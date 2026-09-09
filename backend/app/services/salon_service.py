from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.salon import Salon, SalonBusinessHours
from app.models.whatsapp import WhatsAppAccount
from app.schemas.salon import SalonCreate, SalonUpdate, BusinessHoursCreate
from app.core.exceptions import NotFoundException


class SalonService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_salon_by_id(self, salon_id: str) -> Salon:
        stmt = (
            select(Salon)
            .where(Salon.id == salon_id, Salon.is_deleted == False)
            .options(selectinload(Salon.business_hours))
        )
        res = await self.db.execute(stmt)
        salon = res.scalars().first()
        if not salon:
            raise NotFoundException("Salon not found")
        return salon

    async def update_salon(self, salon_id: str, payload: SalonUpdate) -> Salon:
        salon = await self.get_salon_by_id(salon_id)
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(salon, field, value)
        await self.db.commit()
        await self.db.refresh(salon)
        return salon

    async def get_business_hours(self, salon_id: str) -> List[SalonBusinessHours]:
        stmt = (
            select(SalonBusinessHours)
            .where(SalonBusinessHours.salon_id == salon_id)
            .order_by(SalonBusinessHours.day_of_week)
        )
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def set_business_hours(self, salon_id: str, hours_list: List[BusinessHoursCreate]) -> List[SalonBusinessHours]:
        # Delete existing
        existing = await self.get_business_hours(salon_id)
        for h in existing:
            await self.db.delete(h)

        created = []
        for h_in in hours_list:
            bh = SalonBusinessHours(
                tenant_id=salon_id,
                salon_id=salon_id,
                day_of_week=h_in.day_of_week,
                open_time=h_in.open_time,
                close_time=h_in.close_time,
                is_closed=h_in.is_closed,
            )
            self.db.add(bh)
            created.append(bh)

        await self.db.commit()
        return created

    async def get_whatsapp_settings(self, salon_id: str) -> WhatsAppAccount:
        stmt = select(WhatsAppAccount).where(WhatsAppAccount.salon_id == salon_id, WhatsAppAccount.is_deleted == False)
        res = await self.db.execute(stmt)
        wa = res.scalars().first()
        if not wa:
            wa = WhatsAppAccount(
                tenant_id=salon_id,
                salon_id=salon_id,
                is_mock=True,
                is_active=True,
            )
            self.db.add(wa)
            await self.db.commit()
            await self.db.refresh(wa)
        return wa
