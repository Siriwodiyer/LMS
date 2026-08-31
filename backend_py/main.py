import time
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from backend_py.config import settings
from backend_py.database import get_engine, Base
from backend_py.seed.seeder import seed_database
from backend_py.routers import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created & seeded
    print(f"[{datetime.utcnow().isoformat()}] LMS Python Backend starting up...")
    try:
        engine = get_engine()
        Base.metadata.create_all(bind=engine)
        seed_database()
        print(f"[{datetime.utcnow().isoformat()}] Database initialization and seed check completed.")
    except Exception as e:
        print(f"[Startup Warning] Database initialization issue: {e}")
    yield
    # Shutdown
    print(f"[{datetime.utcnow().isoformat()}] LMS Python Backend shutting down...")


app = FastAPI(
    title="LMS Platform API (Python + MySQL)",
    description="Full-featured LMS REST API with Authentication, 6-Reel Micro-Assessments, Modular Courses, Mentor Workflow, Content Approvals, Gamification, and AI Tutor.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
origins = settings.cors_origins_list
if "*" not in origins:
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing & logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    print(f"[{datetime.utcnow().isoformat()}] {request.method} {request.url.path} - {response.status_code} ({duration_ms}ms)")
    return response


# Health Check
@app.get("/api/health", tags=["Health"])
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "LMS Platform Python FastAPI Backend",
        "database": f"MySQL ({settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME})",
        "version": "1.0.0"
    }


# Include all LMS Routers
app.include_router(api_router)


# Custom validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation error in request payload.",
            "errors": exc.errors()
        }
    )


# Generic catch-all 404 handler for undefined API routes
@app.api_route("/api/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def catch_all_api(request: Request, path_name: str):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": f"API endpoint {request.method} /api/{path_name} not found."
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend_py.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
