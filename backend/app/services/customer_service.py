from datetime import date, datetime, timedelta
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.models.customer import CustomerProfile, CustomerPreference, CustomerServiceCycle
from app.models.appointment import Appointment
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerImportItem,
    CustomerImportResponse,
)
from app.core.constants import CustomerLifecycleStage, AppointmentStatus
from app.core.exceptions import NotFoundException, ConflictException
from app.core.security import normalize_phone_number


class CustomerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_customers(
        self,
        salon_id: str,
        search: Optional[str] = None,
        lifecycle_stage: Optional[CustomerLifecycleStage] = None,
        only_due: bool = False,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[CustomerProfile], int]:
        stmt = (
            select(CustomerProfile)
            .where(CustomerProfile.salon_id == salon_id, CustomerProfile.is_deleted == False)
            .options(selectinload(CustomerProfile.preferences))
        )

        if search:
            search_clean = search.strip()
            stmt = stmt.where(
                or_(
                    CustomerProfile.full_name.ilike(f"%{search_clean}%"),
                    CustomerProfile.phone.ilike(f"%{search_clean}%"),
                    CustomerProfile.email.ilike(f"%{search_clean}%"),
                )
            )

        if lifecycle_stage:
            stmt = stmt.where(CustomerProfile.lifecycle_stage == lifecycle_stage)

        if only_due:
            stmt = stmt.where(
                CustomerProfile.next_due_date.is_not(None),
                CustomerProfile.next_due_date <= date.today() + timedelta(days=3),
            )

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_res = await self.db.execute(count_stmt)
        total = count_res.scalar_one()

        # Paginate & sort by recent visits
        stmt = stmt.order_by(CustomerProfile.last_visit_at.desc().nullslast(), CustomerProfile.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        res = await self.db.execute(stmt)
        return list(res.scalars().all()), total

    async def get_customer_by_id(self, salon_id: str, customer_id: str) -> CustomerProfile:
        stmt = (
            select(CustomerProfile)
            .where(CustomerProfile.id == customer_id, CustomerProfile.salon_id == salon_id, CustomerProfile.is_deleted == False)
            .options(
                selectinload(CustomerProfile.preferences),
                selectinload(CustomerProfile.service_cycles),
            )
        )
        res = await self.db.execute(stmt)
        customer = res.scalars().first()
        if not customer:
            raise NotFoundException("Customer not found")
        return customer

    async def get_customer_by_phone(self, salon_id: str, raw_phone: str) -> Optional[CustomerProfile]:
        phone = normalize_phone_number(raw_phone)
        stmt = (
            select(CustomerProfile)
            .where(CustomerProfile.salon_id == salon_id, CustomerProfile.phone == phone, CustomerProfile.is_deleted == False)
            .options(selectinload(CustomerProfile.preferences))
        )
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def create_customer(self, salon_id: str, payload: CustomerCreate) -> CustomerProfile:
        phone = normalize_phone_number(payload.phone)
        existing = await self.get_customer_by_phone(salon_id, phone)
        if existing:
            raise ConflictException(f"Customer with phone {phone} already exists in this salon")

        cust = CustomerProfile(
            tenant_id=salon_id,
            salon_id=salon_id,
            full_name=payload.full_name,
            phone=phone,
            email=payload.email,
            gender=payload.gender,
            date_of_birth=payload.date_of_birth,
            anniversary_date=payload.anniversary_date,
            notes=payload.notes,
            lifecycle_stage=CustomerLifecycleStage.NEW,
        )
        self.db.add(cust)
        await self.db.flush()

        pref = CustomerPreference(
            customer_id=cust.id,
            allergies=payload.preferences.allergies if payload.preferences else None,
            preferred_stylist_id=payload.preferences.preferred_stylist_id if payload.preferences else None,
            preferred_beverage=payload.preferences.preferred_beverage if payload.preferences else None,
            hair_type=payload.preferences.hair_type if payload.preferences else None,
            skin_tone=payload.preferences.skin_tone if payload.preferences else None,
            whatsapp_opt_out=payload.preferences.whatsapp_opt_out if payload.preferences else False,
        )
        self.db.add(pref)
        await self.db.commit()
        return await self.get_customer_by_id(salon_id, cust.id)

    async def update_customer(self, salon_id: str, customer_id: str, payload: CustomerUpdate) -> CustomerProfile:
        cust = await self.get_customer_by_id(salon_id, customer_id)
        data = payload.model_dump(exclude_unset=True, exclude={"preferences"})
        if "phone" in data and data["phone"]:
            data["phone"] = normalize_phone_number(data["phone"])

        for k, v in data.items():
            setattr(cust, k, v)

        if payload.preferences is not None:
            if not cust.preferences:
                cust.preferences = CustomerPreference(customer_id=cust.id)
                self.db.add(cust.preferences)
            for pk, pv in payload.preferences.model_dump(exclude_unset=True).items():
                setattr(cust.preferences, pk, pv)

        if payload.whatsapp_opt_out is not None:
            cust.whatsapp_opt_out = payload.whatsapp_opt_out

        await self.db.commit()
        return await self.get_customer_by_id(salon_id, customer_id)

    async def update_lifecycle_and_due_date(self, salon_id: str, customer_id: str):
        """Recalculate customer total spend, visit count, return due date, and lifecycle stage."""
        cust = await self.get_customer_by_id(salon_id, customer_id)
        stmt = (
            select(Appointment)
            .where(Appointment.customer_id == customer_id, Appointment.is_deleted == False)
            .order_by(Appointment.starts_at.desc())
        )
        res = await self.db.execute(stmt)
        appts = list(res.scalars().all())

        completed = [a for a in appts if a.status == AppointmentStatus.COMPLETED]
        no_shows = [a for a in appts if a.status == AppointmentStatus.NO_SHOW]
        cancelled = [a for a in appts if a.status == AppointmentStatus.CANCELLED]

        cust.total_visits = len(completed)
        cust.no_show_count = len(no_shows)
        cust.cancelled_count = len(cancelled)
        cust.total_spend_paise = sum(a.total_price_paise for a in completed)

        if completed:
            last_appt = completed[0]
            cust.last_visit_at = last_appt.starts_at
            # Default 30 day cycle if not set
            cust.next_due_date = last_appt.starts_at.date() + timedelta(days=30)
            
            # Lifecycle classification
            days_since_visit = (datetime.utcnow() - last_appt.starts_at).days
            if days_since_visit <= 35:
                cust.lifecycle_stage = CustomerLifecycleStage.ACTIVE
            elif days_since_visit <= 60:
                cust.lifecycle_stage = CustomerLifecycleStage.DUE_FOR_RETURN
            elif days_since_visit <= 120:
                cust.lifecycle_stage = CustomerLifecycleStage.OVERDUE_LAPSED
            else:
                cust.lifecycle_stage = CustomerLifecycleStage.CHURNED_RISK
        else:
            cust.lifecycle_stage = CustomerLifecycleStage.NEW

        await self.db.commit()

    async def import_batch(self, salon_id: str, items: List[CustomerImportItem]) -> CustomerImportResponse:
        imported = 0
        updated = 0
        failed = 0
        errors = []

        for item in items:
            try:
                phone = normalize_phone_number(item.phone)
                existing = await self.get_customer_by_phone(salon_id, phone)
                if existing:
                    existing.full_name = item.full_name or existing.full_name
                    if item.email:
                        existing.email = item.email
                    if item.notes:
                        existing.notes = (existing.notes or "") + f"\nImport: {item.notes}"
                    updated += 1
                else:
                    cust = CustomerProfile(
                        tenant_id=salon_id,
                        salon_id=salon_id,
                        full_name=item.full_name,
                        phone=phone,
                        email=item.email,
                        notes=item.notes,
                        lifecycle_stage=CustomerLifecycleStage.ACTIVE if item.last_visit_date else CustomerLifecycleStage.NEW,
                    )
                    self.db.add(cust)
                    await self.db.flush()
                    pref = CustomerPreference(customer_id=cust.id)
                    self.db.add(pref)
                    imported += 1
            except Exception as e:
                failed += 1
                errors.append({"phone": item.phone, "name": item.full_name, "error": str(e)})

        await self.db.commit()
        return CustomerImportResponse(
            imported_count=imported,
            updated_count=updated,
            failed_count=failed,
            errors=errors,
        )
