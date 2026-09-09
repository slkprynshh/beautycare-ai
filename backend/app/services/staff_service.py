from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.staff import StaffProfile, StaffService, StaffWorkingHours, StaffTimeOff
from app.schemas.staff import StaffCreate, StaffUpdate, StaffWorkingHoursSchema
from app.core.exceptions import NotFoundException
from app.core.security import normalize_phone_number


class StaffServiceLogic:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_staff(self, salon_id: str, active_only: bool = True) -> List[StaffProfile]:
        stmt = (
            select(StaffProfile)
            .where(StaffProfile.salon_id == salon_id, StaffProfile.is_deleted == False)
            .options(
                selectinload(StaffProfile.working_hours),
                selectinload(StaffProfile.staff_services),
            )
            .order_by(StaffProfile.full_name)
        )
        if active_only:
            stmt = stmt.where(StaffProfile.is_active == True)
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def get_staff_by_id(self, salon_id: str, staff_id: str) -> StaffProfile:
        stmt = (
            select(StaffProfile)
            .where(StaffProfile.id == staff_id, StaffProfile.salon_id == salon_id, StaffProfile.is_deleted == False)
            .options(
                selectinload(StaffProfile.working_hours),
                selectinload(StaffProfile.staff_services),
            )
        )
        res = await self.db.execute(stmt)
        staff = res.scalars().first()
        if not staff:
            raise NotFoundException("Staff member not found")
        return staff

    async def create_staff(self, salon_id: str, payload: StaffCreate) -> StaffProfile:
        staff = StaffProfile(
            tenant_id=salon_id,
            salon_id=salon_id,
            full_name=payload.full_name,
            display_title=payload.display_title,
            phone=normalize_phone_number(payload.phone) if payload.phone else None,
            email=payload.email,
            staff_role=payload.staff_role,
            bio=payload.bio,
            is_active=True,
        )
        self.db.add(staff)
        await self.db.flush()

        # Add default working hours (Mon-Sat 10:00 - 19:00)
        if payload.working_hours:
            for wh in payload.working_hours:
                swh = StaffWorkingHours(
                    staff_id=staff.id,
                    day_of_week=wh.day_of_week,
                    start_time=wh.start_time,
                    end_time=wh.end_time,
                    is_day_off=wh.is_day_off,
                )
                self.db.add(swh)
        else:
            for day in range(7):
                swh = StaffWorkingHours(
                    staff_id=staff.id,
                    day_of_week=day,
                    start_time="10:00",
                    end_time="19:00",
                    is_day_off=(day == 0),  # Mon off
                )
                self.db.add(swh)

        # Link services
        if payload.service_ids:
            for s_id in payload.service_ids:
                ss = StaffService(staff_id=staff.id, service_id=s_id)
                self.db.add(ss)

        await self.db.commit()
        return await self.get_staff_by_id(salon_id, staff.id)

    async def update_staff(self, salon_id: str, staff_id: str, payload: StaffUpdate) -> StaffProfile:
        staff = await self.get_staff_by_id(salon_id, staff_id)
        update_data = payload.model_dump(exclude_unset=True, exclude={"working_hours", "service_ids"})
        if "phone" in update_data and update_data["phone"]:
            update_data["phone"] = normalize_phone_number(update_data["phone"])

        for k, v in update_data.items():
            setattr(staff, k, v)

        if payload.working_hours is not None:
            # Delete old working hours
            stmt_del = select(StaffWorkingHours).where(StaffWorkingHours.staff_id == staff.id)
            res_del = await self.db.execute(stmt_del)
            for old_wh in res_del.scalars().all():
                await self.db.delete(old_wh)
            for wh in payload.working_hours:
                swh = StaffWorkingHours(
                    staff_id=staff.id,
                    day_of_week=wh.day_of_week,
                    start_time=wh.start_time,
                    end_time=wh.end_time,
                    is_day_off=wh.is_day_off,
                )
                self.db.add(swh)

        if payload.service_ids is not None:
            stmt_del_s = select(StaffService).where(StaffService.staff_id == staff.id)
            res_del_s = await self.db.execute(stmt_del_s)
            for old_s in res_del_s.scalars().all():
                await self.db.delete(old_s)
            for s_id in payload.service_ids:
                self.db.add(StaffService(staff_id=staff.id, service_id=s_id))

        await self.db.commit()
        return await self.get_staff_by_id(salon_id, staff.id)

    async def delete_staff(self, salon_id: str, staff_id: str):
        staff = await self.get_staff_by_id(salon_id, staff_id)
        staff.is_deleted = True
        staff.is_active = False
        await self.db.commit()
