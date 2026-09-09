from datetime import datetime, timedelta
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from app.models.appointment import Appointment, AppointmentService, AppointmentStatusEvent
from app.models.customer import CustomerProfile
from app.models.service import Service
from app.models.staff import StaffProfile
from app.models.audit import AuditLog
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentStatusChange
from app.core.constants import AppointmentStatus, BookingSource, AuditActorType, RecoveryTriggerReason
from app.core.exceptions import NotFoundException, ConflictException, BadRequestException
from app.core.security import normalize_phone_number


class AppointmentServiceLogic:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_appointments(
        self,
        salon_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        staff_id: Optional[str] = None,
        customer_id: Optional[str] = None,
        status: Optional[AppointmentStatus] = None,
    ) -> List[Appointment]:
        stmt = (
            select(Appointment)
            .where(Appointment.salon_id == salon_id, Appointment.is_deleted == False)
            .options(
                selectinload(Appointment.customer),
                selectinload(Appointment.primary_staff),
                selectinload(Appointment.appointment_services).selectinload(AppointmentService.service),
            )
            .order_by(Appointment.starts_at)
        )

        if start_date:
            stmt = stmt.where(Appointment.starts_at >= start_date)
        if end_date:
            stmt = stmt.where(Appointment.starts_at <= end_date)
        if staff_id:
            stmt = stmt.where(Appointment.primary_staff_id == staff_id)
        if customer_id:
            stmt = stmt.where(Appointment.customer_id == customer_id)
        if status:
            stmt = stmt.where(Appointment.status == status)

        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def get_appointment_by_id(self, salon_id: str, appointment_id: str) -> Appointment:
        stmt = (
            select(Appointment)
            .where(Appointment.id == appointment_id, Appointment.salon_id == salon_id, Appointment.is_deleted == False)
            .options(
                selectinload(Appointment.customer),
                selectinload(Appointment.primary_staff),
                selectinload(Appointment.appointment_services).selectinload(AppointmentService.service),
                selectinload(Appointment.status_events),
            )
        )
        res = await self.db.execute(stmt)
        appt = res.scalars().first()
        if not appt:
            raise NotFoundException("Appointment not found")
        return appt

    async def create_appointment(
        self,
        salon_id: str,
        payload: AppointmentCreate,
        actor_id: Optional[str] = None,
    ) -> Appointment:
        # Resolve customer
        customer_id = payload.customer_id
        if not customer_id:
            if not payload.customer_phone or not payload.customer_name:
                raise BadRequestException("Either customer_id or (customer_name + customer_phone) is required")
            
            clean_phone = normalize_phone_number(payload.customer_phone)
            stmt_c = select(CustomerProfile).where(CustomerProfile.salon_id == salon_id, CustomerProfile.phone == clean_phone)
            res_c = await self.db.execute(stmt_c)
            cust = res_c.scalars().first()
            if not cust:
                cust = CustomerProfile(
                    tenant_id=salon_id,
                    salon_id=salon_id,
                    full_name=payload.customer_name,
                    phone=clean_phone,
                )
                self.db.add(cust)
                await self.db.flush()
            customer_id = cust.id

        # Calculate total duration and price
        total_duration = 0
        total_price_paise = 0
        service_items_to_add = []

        for item in payload.services:
            svc_stmt = select(Service).where(Service.id == item.service_id, Service.salon_id == salon_id)
            svc_res = await self.db.execute(svc_stmt)
            svc = svc_res.scalars().first()
            if not svc:
                raise NotFoundException(f"Service ID {item.service_id} not found")

            duration = item.duration_minutes or svc.duration_minutes
            price_paise = item.price_paise if item.price_paise is not None else svc.price_paise
            total_duration += duration
            total_price_paise += price_paise

            service_items_to_add.append({
                "service_id": svc.id,
                "staff_id": item.staff_id or payload.primary_staff_id,
                "service_name": svc.name,
                "price_paise": price_paise,
                "duration_minutes": duration,
            })

        ends_at = payload.starts_at + timedelta(minutes=total_duration)

        # Check staff collision if primary_staff_id is given
        if payload.primary_staff_id:
            collision_stmt = select(Appointment).where(
                Appointment.salon_id == salon_id,
                Appointment.primary_staff_id == payload.primary_staff_id,
                Appointment.is_deleted == False,
                Appointment.status.in_([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_SERVICE]),
                Appointment.starts_at < ends_at,
                Appointment.ends_at > payload.starts_at,
            )
            col_res = await self.db.execute(collision_stmt)
            if col_res.scalars().first():
                raise ConflictException("Staff member already has an overlapping appointment in this time window")

        appt = Appointment(
            tenant_id=salon_id,
            salon_id=salon_id,
            customer_id=customer_id,
            primary_staff_id=payload.primary_staff_id,
            starts_at=payload.starts_at,
            ends_at=ends_at,
            duration_minutes=total_duration,
            status=AppointmentStatus.CONFIRMED,
            total_price_paise=total_price_paise,
            source=payload.source,
            is_recovered=payload.is_recovered,
            recovery_event_id=payload.recovery_event_id,
            notes=payload.notes,
        )
        self.db.add(appt)
        await self.db.flush()

        for s_data in service_items_to_add:
            asvc = AppointmentService(
                tenant_id=salon_id,
                salon_id=salon_id,
                appointment_id=appt.id,
                service_id=s_data["service_id"],
                staff_id=s_data["staff_id"],
                service_name=s_data["service_name"],
                price_paise=s_data["price_paise"],
                duration_minutes=s_data["duration_minutes"],
            )
            self.db.add(asvc)

        # Record Initial Status Event
        evt = AppointmentStatusEvent(
            appointment_id=appt.id,
            from_status=None,
            to_status=AppointmentStatus.CONFIRMED,
            changed_by_user_id=actor_id,
        )
        self.db.add(evt)

        # Record Audit Log
        audit = AuditLog(
            tenant_id=salon_id,
            salon_id=salon_id,
            actor_id=actor_id,
            actor_type=AuditActorType.USER if actor_id else AuditActorType.SYSTEM,
            action="APPOINTMENT_CREATED",
            entity_type="APPOINTMENT",
            entity_id=appt.id,
            after_state={"status": appt.status.value, "total_price_paise": total_price_paise, "starts_at": str(payload.starts_at)},
        )
        self.db.add(audit)

        # If this appointment was created from a recovery event, link and update recovery status!
        if payload.recovery_event_id or payload.is_recovered:
            from app.services.recovery_service import RecoveryService
            rec_svc = RecoveryService(self.db)
            await rec_svc.mark_rebooked(
                salon_id=salon_id,
                customer_id=customer_id,
                rebooked_appointment_id=appt.id,
                revenue_paise=total_price_paise,
                recovery_event_id=payload.recovery_event_id,
            )

        await self.db.commit()
        return await self.get_appointment_by_id(salon_id, appt.id)

    async def update_status(
        self,
        salon_id: str,
        appointment_id: str,
        payload: AppointmentStatusChange,
        actor_id: Optional[str] = None,
    ) -> Appointment:
        appt = await self.get_appointment_by_id(salon_id, appointment_id)
        from_status = appt.status
        to_status = payload.status

        appt.status = to_status
        if payload.cancellation_reason:
            appt.cancellation_reason = payload.cancellation_reason

        # Record event
        evt = AppointmentStatusEvent(
            appointment_id=appt.id,
            from_status=from_status,
            to_status=to_status,
            changed_by_user_id=actor_id,
            reason=payload.cancellation_reason,
        )
        self.db.add(evt)

        # If status transitioned to NO_SHOW, automatically trigger Recovery Event!
        if to_status == AppointmentStatus.NO_SHOW:
            from app.services.recovery_service import RecoveryService
            rec_svc = RecoveryService(self.db)
            await rec_svc.trigger_no_show_recovery(
                salon_id=salon_id,
                customer_id=appt.customer_id,
                original_appointment_id=appt.id,
                estimated_revenue_paise=appt.total_price_paise,
            )

        # If status transitioned to COMPLETED, update customer metrics and recovery confirmed revenue!
        if to_status == AppointmentStatus.COMPLETED:
            from app.services.customer_service import CustomerService
            cust_svc = CustomerService(self.db)
            await cust_svc.update_lifecycle_and_due_date(salon_id, appt.customer_id)

            from app.services.recovery_service import RecoveryService
            rec_svc = RecoveryService(self.db)
            await rec_svc.mark_completed(salon_id, appt.id, appt.total_price_paise)

        await self.db.commit()
        return await self.get_appointment_by_id(salon_id, appt.id)
