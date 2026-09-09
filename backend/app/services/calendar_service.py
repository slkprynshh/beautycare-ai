from datetime import date, datetime, time, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.salon import SalonBusinessHours
from app.models.staff import StaffProfile, StaffWorkingHours, StaffTimeOff
from app.models.appointment import Appointment, AppointmentService
from app.schemas.calendar import CalendarViewResponse, StaffCalendarDay, TimeSlot
from app.schemas.appointment import AppointmentResponse
from app.core.constants import AppointmentStatus


class CalendarService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_day_schedule(
        self,
        salon_id: str,
        target_date: date,
        staff_id_filter: Optional[str] = None,
    ) -> CalendarViewResponse:
        weekday = target_date.weekday()  # 0=Monday, 6=Sunday

        # 1. Fetch Salon Business Hours
        stmt_bh = select(SalonBusinessHours).where(
            SalonBusinessHours.salon_id == salon_id,
            SalonBusinessHours.day_of_week == weekday,
        )
        res_bh = await self.db.execute(stmt_bh)
        bh = res_bh.scalars().first()

        is_salon_open = True
        bh_dict = {"open_time": "10:00", "close_time": "20:00"}
        if bh:
            is_salon_open = not bh.is_closed
            bh_dict = {"open_time": bh.open_time, "close_time": bh.close_time}

        # 2. Fetch Active Staff
        stmt_staff = (
            select(StaffProfile)
            .where(StaffProfile.salon_id == salon_id, StaffProfile.is_active == True, StaffProfile.is_deleted == False)
            .options(
                selectinload(StaffProfile.working_hours),
                selectinload(StaffProfile.time_off),
            )
            .order_by(StaffProfile.full_name)
        )
        if staff_id_filter:
            stmt_staff = stmt_staff.where(StaffProfile.id == staff_id_filter)
        res_staff = await self.db.execute(stmt_staff)
        staff_members = list(res_staff.scalars().all())

        # 3. Fetch Appointments for target date
        day_start = datetime.combine(target_date, time.min)
        day_end = datetime.combine(target_date, time.max)
        stmt_appts = (
            select(Appointment)
            .where(
                Appointment.salon_id == salon_id,
                Appointment.is_deleted == False,
                Appointment.starts_at >= day_start,
                Appointment.starts_at <= day_end,
                Appointment.status.notin_([AppointmentStatus.CANCELLED]),
            )
            .options(
                selectinload(Appointment.customer),
                selectinload(Appointment.primary_staff),
                selectinload(Appointment.appointment_services).selectinload(AppointmentService.service),
            )
            .order_by(Appointment.starts_at)
        )
        res_appts = await self.db.execute(stmt_appts)
        all_appts = list(res_appts.scalars().all())

        # 4. Assemble staff calendar schedules
        staff_schedules: List[StaffCalendarDay] = []
        total_revenue_paise = 0

        for staff in staff_members:
            # Check staff shift today
            swh = next((h for h in staff.working_hours if h.day_of_week == weekday), None)
            is_working_today = is_salon_open and (swh is not None and not swh.is_day_off)
            
            # Check time-off
            for to in staff.time_off:
                if to.is_approved and to.start_date <= day_start and to.end_date >= day_end:
                    is_working_today = False
                    break

            staff_appts = [a for a in all_appts if a.primary_staff_id == staff.id]
            for a in staff_appts:
                total_revenue_paise += a.total_price_paise

            # Generate available 30-min slots
            slots = []
            if is_working_today and swh:
                s_hour, s_min = map(int, swh.start_time.split(":"))
                e_hour, e_min = map(int, swh.end_time.split(":"))
                curr_slot_time = datetime.combine(target_date, time(s_hour, s_min))
                end_slot_time = datetime.combine(target_date, time(e_hour, e_min))

                while curr_slot_time < end_slot_time:
                    slot_end = curr_slot_time + timedelta(minutes=30)
                    # Check collision
                    is_occupied = any(
                        a.starts_at < slot_end and a.ends_at > curr_slot_time
                        for a in staff_appts
                    )
                    slots.append(
                        TimeSlot(
                            start_time=curr_slot_time.strftime("%H:%M"),
                            end_time=slot_end.strftime("%H:%M"),
                            is_available=not is_occupied,
                            reason_unavailable="Booked" if is_occupied else None,
                        )
                    )
                    curr_slot_time = slot_end

            staff_schedules.append(
                StaffCalendarDay(
                    staff_id=staff.id,
                    staff_name=staff.full_name,
                    is_working_today=is_working_today,
                    working_hours={"start": swh.start_time, "end": swh.end_time} if swh else None,
                    appointments=[AppointmentResponse.model_validate(a) for a in staff_appts],
                    available_slots=slots,
                )
            )

        return CalendarViewResponse(
            date=target_date,
            is_salon_open=is_salon_open,
            salon_business_hours=bh_dict,
            staff_schedules=staff_schedules,
            total_appointments=len(all_appts),
            total_revenue_paise=total_revenue_paise,
            total_revenue_inr=round(total_revenue_paise / 100.0, 2),
        )
