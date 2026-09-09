import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import asyncio
import time
from app.workers.tasks import run_all_salons_automations_job
from app.core.logging import logger


async def start_periodic_scheduler(interval_seconds: int = 900):  # Default 15 minutes
    logger.info("Starting VertOps Periodic Scheduler", interval_seconds=interval_seconds)
    while True:
        try:
            logger.info("Running periodic automation check cycle...")
            await run_all_salons_automations_job()
        except Exception as exc:
            logger.exception("Scheduler cycle encountered error", exc_info=exc)
        
        await asyncio.sleep(interval_seconds)


if __name__ == "__main__":
    asyncio.run(start_periodic_scheduler())
