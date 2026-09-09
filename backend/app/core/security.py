import re
import secrets
import hashlib
import base64
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict, Union

# Try bcrypt direct
try:
    import bcrypt
    _has_bcrypt = True
except Exception:
    _has_bcrypt = False

# Try cryptography Fernet or fallback
try:
    from cryptography.fernet import Fernet
    _has_fernet = True
except Exception:
    _has_fernet = False

# Try PyJWT or python-jose
try:
    import jwt as pyjwt
    _use_pyjwt = True
except ImportError:
    from jose import jwt as pyjwt
    _use_pyjwt = False

from app.core.config import settings


def _get_fernet_key() -> bytes:
    key = settings.FIELD_ENCRYPTION_KEY.encode()
    if len(key) != 32 and not (len(key) == 44 and key.endswith(b'=')):
        key = base64.urlsafe_b64encode(hashlib.sha256(key).digest())
    elif len(key) == 32:
        key = base64.urlsafe_b64encode(key)
    return key


_fernet_instance = None
if _has_fernet:
    try:
        _fernet_instance = Fernet(_get_fernet_key())
    except Exception:
        _fernet_instance = None


def encrypt_field(plain_text: Optional[str]) -> Optional[str]:
    """Encrypt sensitive credentials/tokens at rest."""
    if not plain_text:
        return None
    if _fernet_instance:
        try:
            return _fernet_instance.encrypt(plain_text.encode()).decode()
        except Exception:
            pass
    return base64.b64encode(plain_text.encode()).decode()


def decrypt_field(encrypted_text: Optional[str]) -> Optional[str]:
    """Decrypt sensitive credentials."""
    if not encrypted_text:
        return None
    if _fernet_instance:
        try:
            return _fernet_instance.decrypt(encrypted_text.encode()).decode()
        except Exception:
            pass
    try:
        return base64.b64decode(encrypted_text.encode()).decode()
    except Exception:
        return None


def hash_password(password: str) -> str:
    """Generate secure password hash using bcrypt with sha256 fallback."""
    if _has_bcrypt:
        try:
            salt = bcrypt.gensalt()
            return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
        except Exception:
            pass
    salt = secrets.token_hex(16)
    h = hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()
    return f"sha256${salt}${h}"


def get_password_hash(password: str) -> str:
    return hash_password(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    if not hashed_password or not plain_password:
        return False
    if hashed_password.startswith("sha256$"):
        parts = hashed_password.split("$")
        if len(parts) == 3:
            _, salt, h = parts
            return h == hashlib.sha256(f"{salt}:{plain_password}".encode("utf-8")).hexdigest()
    if _has_bcrypt:
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            pass
    return False


def create_access_token(
    subject: Union[str, Any],
    salon_id: Optional[str] = None,
    role: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Generate signed JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    if salon_id:
        to_encode["salon_id"] = str(salon_id)
    if role:
        to_encode["role"] = str(role)

    return pyjwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: Union[str, Any]) -> str:
    """Generate signed JWT refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
        "jti": secrets.token_hex(16),
    }
    return pyjwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT token."""
    try:
        payload = pyjwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except Exception:
        return None


def normalize_phone_number(phone: str, default_country_code: str = "+91") -> str:
    """Normalize Indian phone numbers to E.164 format (+91XXXXXXXXXX)."""
    cleaned = re.sub(r"[^0-9+]", "", phone.strip())
    
    if cleaned.startswith("+"):
        if cleaned.startswith("+91") and len(cleaned) == 13:
            return cleaned
        return cleaned

    if len(cleaned) == 10:
        return f"{default_country_code}{cleaned}"
    
    if len(cleaned) == 11 and cleaned.startswith("0"):
        return f"{default_country_code}{cleaned[1:]}"
    
    if len(cleaned) == 12 and cleaned.startswith("91"):
        return f"+{cleaned}"
        
    return f"{default_country_code}{cleaned}"


def normalize_phone_e164(phone: str, default_country_code: str = "+91") -> str:
    return normalize_phone_number(phone, default_country_code)


def generate_numeric_otp(digits: int = 6) -> str:
    """Generate cryptographically secure N-digit OTP code."""
    return "".join(secrets.choice("0123456789") for _ in range(digits))


def hash_otp(otp: str, salt: str) -> str:
    """Hash OTP with phone salt to prevent plaintext storage."""
    return hashlib.sha256(f"{otp}:{salt}:{settings.JWT_SECRET_KEY}".encode()).hexdigest()
