from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon
from app.models.salon import Salon
from app.services.customer_service import CustomerService
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.customer import (
    CustomerResponse,
    CustomerDetailResponse,
    CustomerCreate,
    CustomerUpdate,
    CustomerImportBatchRequest,
    CustomerImportResponse,
)
from app.core.constants import CustomerLifecycleStage

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=ResponseEnvelope[PaginatedResponse[CustomerResponse]])
async def list_customers(
    search: Optional[str] = Query(None),
    stage: Optional[CustomerLifecycleStage] = Query(None),
    only_due: bool = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = CustomerService(db)
    customers, total = await service.list_customers(
        salon_id=current_salon.id,
        search=search,
        lifecycle_stage=stage,
        only_due=only_due,
        page=page,
        page_size=page_size,
    )
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
    paginated = PaginatedResponse[CustomerResponse](
        items=[CustomerResponse.model_validate(c) for c in customers],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
    return ResponseEnvelope(success=True, data=paginated)


@router.post("", response_model=ResponseEnvelope[CustomerResponse])
async def create_customer(
    payload: CustomerCreate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = CustomerService(db)
    customer = await service.create_customer(current_salon.id, payload)
    return ResponseEnvelope(success=True, message="Customer profile created", data=CustomerResponse.model_validate(customer))


@router.get("/{customer_id}", response_model=ResponseEnvelope[CustomerDetailResponse])
async def get_customer(
    customer_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = CustomerService(db)
    customer = await service.get_customer_by_id(current_salon.id, customer_id)
    return ResponseEnvelope(success=True, data=CustomerDetailResponse.model_validate(customer))


@router.patch("/{customer_id}", response_model=ResponseEnvelope[CustomerDetailResponse])
async def update_customer(
    customer_id: str,
    payload: CustomerUpdate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = CustomerService(db)
    customer = await service.update_customer(current_salon.id, customer_id, payload)
    return ResponseEnvelope(success=True, message="Customer profile updated", data=CustomerDetailResponse.model_validate(customer))


@router.post("/import", response_model=ResponseEnvelope[CustomerImportResponse])
async def import_customers(
    payload: CustomerImportBatchRequest,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = CustomerService(db)
    res = await service.import_batch(current_salon.id, payload.customers)
    return ResponseEnvelope(success=True, message="Batch customer import complete", data=res)
