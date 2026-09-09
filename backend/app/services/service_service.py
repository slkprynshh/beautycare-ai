from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.service import ServiceCategory, Service
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceCategoryCreate
from app.core.exceptions import NotFoundException


class ServiceCatalogService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_categories(self, salon_id: str) -> List[ServiceCategory]:
        stmt = (
            select(ServiceCategory)
            .where(ServiceCategory.salon_id == salon_id, ServiceCategory.is_deleted == False)
            .order_by(ServiceCategory.display_order, ServiceCategory.name)
        )
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def create_category(self, salon_id: str, payload: ServiceCategoryCreate) -> ServiceCategory:
        cat = ServiceCategory(
            tenant_id=salon_id,
            salon_id=salon_id,
            name=payload.name,
            description=payload.description,
            display_order=payload.display_order,
            icon_name=payload.icon_name,
        )
        self.db.add(cat)
        await self.db.commit()
        await self.db.refresh(cat)
        return cat

    async def list_services(self, salon_id: str, category_id: Optional[str] = None, active_only: bool = False) -> List[Service]:
        stmt = (
            select(Service)
            .where(Service.salon_id == salon_id, Service.is_deleted == False)
            .options(selectinload(Service.category))
            .order_by(Service.display_order, Service.name)
        )
        if category_id:
            stmt = stmt.where(Service.category_id == category_id)
        if active_only:
            stmt = stmt.where(Service.is_active == True)
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def get_service_by_id(self, salon_id: str, service_id: str) -> Service:
        stmt = (
            select(Service)
            .where(Service.id == service_id, Service.salon_id == salon_id, Service.is_deleted == False)
            .options(selectinload(Service.category))
        )
        res = await self.db.execute(stmt)
        svc = res.scalars().first()
        if not svc:
            raise NotFoundException("Service not found")
        return svc

    async def create_service(self, salon_id: str, payload: ServiceCreate) -> Service:
        svc = Service(
            tenant_id=salon_id,
            salon_id=salon_id,
            category_id=payload.category_id,
            name=payload.name,
            description=payload.description,
            duration_minutes=payload.duration_minutes,
            buffer_minutes_after=payload.buffer_minutes_after,
            price_paise=payload.price_paise,
            typical_return_interval_days=payload.typical_return_interval_days,
            is_active=payload.is_active,
            display_order=payload.display_order,
        )
        self.db.add(svc)
        await self.db.commit()
        return await self.get_service_by_id(salon_id, svc.id)

    async def update_service(self, salon_id: str, service_id: str, payload: ServiceUpdate) -> Service:
        svc = await self.get_service_by_id(salon_id, service_id)
        update_data = payload.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(svc, k, v)
        await self.db.commit()
        return await self.get_service_by_id(salon_id, svc.id)

    async def delete_service(self, salon_id: str, service_id: str):
        svc = await self.get_service_by_id(salon_id, service_id)
        svc.is_deleted = True
        svc.is_active = False
        await self.db.commit()
