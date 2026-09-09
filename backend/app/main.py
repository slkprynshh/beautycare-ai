import app.core.compat  # noqa: F401 - Must be imported first for OpenAPI schema generation
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.core.middleware import RequestContextMiddleware
from app.api.v1.router import api_v1_router
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VertOps Backend Engine", version="1.0.0", env=settings.ENVIRONMENT)
    await init_db()
    yield
    logger.info("Shutting down VertOps Backend Engine")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="Production Backend for VertOps — India-first WhatsApp-native Revenue Recovery Platform for Salons & Spas.",
        openapi_url="/api/v1/openapi.json",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        lifespan=lifespan,
    )

    # CORS configuration
    origins = [str(origin).rstrip("/") for origin in settings.CORS_ORIGINS] + ["http://localhost:3000", "http://127.0.0.1:3000"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request context & error handling middleware
    app.add_middleware(RequestContextMiddleware)

    # Mount API v1 router
    app.include_router(api_v1_router)

    @app.get("/health", tags=["System"])
    async def root_health():
        return {"status": "healthy", "service": "vertops-backend", "version": "1.0.0"}

    @app.get("/", tags=["System"])
    async def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": "1.0.0",
            "docs": "/api/docs",
            "status": "operational",
        }

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
