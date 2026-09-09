from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon, require_role
from app.models.salon import Salon
from app.services.service_service import ServiceCatalogService
from app.schemas.common import ResponseEnvelope
from app.schemas.service import (
    ServiceResponse,
    ServiceCreate,
    ServiceUpdate,
    ServiceCategoryResponse,
    ServiceCategoryCreate,
)
from app.core.constants import UserRole

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/categories", response_model=ResponseEnvelope[List[ServiceCategoryResponse]])
async def list_categories(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = ServiceCatalogService(db)
    categories = await service.list_categories(current_salon.id)
    return ResponseEnvelope(success=True, data=[ServiceCategoryResponse.model_validate(c) for c in categories])


@router.post("/categories", response_model=ResponseEnvelope[ServiceCategoryResponse])
async def create_category(
    payload: ServiceCategoryCreate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = ServiceCatalogService(db)
    cat = await service.create_category(current_salon.id, payload)
    return ResponseEnvelope(success=True, message="Category created", data=ServiceCategoryResponse.model_validate(cat))


@router.get("", response_model=ResponseEnvelope[List[ServiceResponse]])
async def list_services(
    category_id: Optional[str] = Query(None),
    active_only: bool = Query(False),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = ServiceCatalogService(db)
    services = await service.list_services(current_salon.id, category_id=category_id, active_only=active_only)
    return ResponseEnvelope(success=True, data=[ServiceResponse.model_validate(s) for s in services])


@router.post("", response_model=ResponseEnvelope[ServiceResponse])
async def create_service(
    payload: ServiceCreate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = ServiceCatalogService(db)
    svc = await service.create_service(current_salon.id, payload)
    return ResponseEnvelope(success=True, message="Service added to catalog", data=ServiceResponse.model_validate(svc))


@router.get("/{service_id}", response_model=ResponseEnvelope[ServiceResponse])
async def get_service(
    service_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = ServiceCatalogService(db)
    svc = await service.get_service_by_id(current_salon.id, service_id)
    return ResponseEnvelope(success=True, data=ServiceResponse.model_validate(svc))


@router.patch("/{service_id}", response_model=ResponseEnvelope[ServiceResponse])
async def update_service(
    service_id: str,
    payload: ServiceUpdate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = ServiceCatalogService(db)
    svc = await service.update_service(current_salon.id, service_id, payload)
    return ResponseEnvelope(success=True, message="Service updated", data=ServiceResponse.model_validate(svc))


@router.delete("/{service_id}", response_model=ResponseEnvelope[dict])
async def delete_service(
    service_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = ServiceCatalogService(db)
    await service.delete_service(current_salon.id, service_id)
    return ResponseEnvelope(success=True, message="Service removed", data={"id": service_id})
