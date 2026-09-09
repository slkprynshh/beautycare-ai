import asyncio
from app.core.database import AsyncSessionLocal
from app.services.automation_engine import AutomationEngine
from app.models.salon import Salon
from app.core.logging import logger
from sqlalchemy import select


async def run_salon_automations_task(salon_id: str):
    """Execute all automation rules for a specific salon."""
    async with AsyncSessionLocal() as session:
        try:
            engine = AutomationEngine(session)
            results = await engine.run_all_automations(salon_id)
            logger.info("Executed automations for salon", salon_id=salon_id, results=results)
            return results
        except Exception as exc:
            logger.exception("Error in automation task for salon", salon_id=salon_id, exc_info=exc)
            raise


async def run_all_salons_automations_job():
    """Periodic job to run automations across all active salons."""
    async with AsyncSessionLocal() as session:
        stmt = select(Salon.id).where(Salon.is_deleted == False)
        res = await session.execute(stmt)
        salon_ids = list(res.scalars().all())

    for s_id in salon_ids:
        try:
            await run_salon_automations_task(s_id)
        except Exception:
            pass
