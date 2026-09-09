from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.dependencies import get_current_salon, require_role
from app.models.salon import Salon
from app.models.automation import AutomationRule, AutomationRun
from app.services.automation_engine import AutomationEngine
from app.schemas.common import ResponseEnvelope
from app.schemas.automation import (
    AutomationRuleResponse,
    AutomationRuleUpdate,
    AutomationRunResponse,
)
from app.core.constants import UserRole

router = APIRouter(prefix="/automations", tags=["Automations"])


@router.get("/rules", response_model=ResponseEnvelope[List[AutomationRuleResponse]])
async def list_automation_rules(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(AutomationRule)
        .where(AutomationRule.salon_id == current_salon.id, AutomationRule.is_deleted == False)
        .order_by(AutomationRule.automation_type)
    )
    res = await db.execute(stmt)
    rules = list(res.scalars().all())
    return ResponseEnvelope(success=True, data=[AutomationRuleResponse.model_validate(r) for r in rules])


@router.patch("/rules/{rule_id}", response_model=ResponseEnvelope[AutomationRuleResponse])
async def update_automation_rule(
    rule_id: str,
    payload: AutomationRuleUpdate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    stmt = select(AutomationRule).where(AutomationRule.id == rule_id, AutomationRule.salon_id == current_salon.id)
    res = await db.execute(stmt)
    rule = res.scalars().first()
    if not rule:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Rule not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(rule, k, v)

    await db.commit()
    await db.refresh(rule)
    return ResponseEnvelope(success=True, message="Automation rule updated", data=AutomationRuleResponse.model_validate(rule))


@router.post("/run-now", response_model=ResponseEnvelope[dict])
async def trigger_automation_cycle(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    engine = AutomationEngine(db)
    result = await engine.run_all_automations(current_salon.id)
    return ResponseEnvelope(success=True, message="Automation engine executed successfully", data=result)


@router.get("/runs", response_model=ResponseEnvelope[List[AutomationRunResponse]])
async def list_recent_runs(
    limit: int = 50,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(AutomationRun)
        .where(AutomationRun.salon_id == current_salon.id)
        .order_by(AutomationRun.scheduled_for.desc())
        .limit(limit)
    )
    res = await db.execute(stmt)
    runs = list(res.scalars().all())
    return ResponseEnvelope(success=True, data=[AutomationRunResponse.model_validate(r) for r in runs])
