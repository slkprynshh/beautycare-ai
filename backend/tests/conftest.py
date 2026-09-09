import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.models.base import Base
from app.core.database import get_db
from app.main import create_app
from app.core.security import create_access_token
from app.core.constants import UserRole
from app.models.salon import Salon, SalonMembership
from app.models.user import User


TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def test_engine():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def db_session(test_engine):
    session_factory = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
    async with session_factory() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def app_client(test_engine, db_session):
    app = create_app()

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture(scope="function")
async def seeded_test_data(db_session: AsyncSession):
    # Create test salon
    salon = Salon(
        name="Test Luxe Salon",
        slug="test-luxe",
        phone="+919999900000",
        city="Mumbai",
    )
    db_session.add(salon)
    await db_session.flush()

    # Create owner
    user = User(
        full_name="Test Owner",
        phone="+919999900000",
        is_active=True,
    )
    db_session.add(user)
    await db_session.flush()

    membership = SalonMembership(
        salon_id=salon.id,
        user_id=user.id,
        role=UserRole.OWNER,
        is_primary=True,
    )
    db_session.add(membership)
    await db_session.commit()

    token = create_access_token(
        subject=user.id,
        salon_id=salon.id,
        role=UserRole.OWNER.value,
    )

    return {
        "salon": salon,
        "user": user,
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"},
    }
