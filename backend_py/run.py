import sys
import os
import uvicorn

# Add parent directory to python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from backend_py.config import settings

if __name__ == "__main__":
    print("=" * 60)
    print("  🚀 Starting LMS Python FastAPI & MySQL Backend")
    print(f"  📍 Host: http://localhost:{settings.PORT}")
    print(f"  📚 Interactive Swagger Docs: http://localhost:{settings.PORT}/docs")
    print(f"  📖 ReDoc: http://localhost:{settings.PORT}/redoc")
    print(f"  🗄️ Database: MySQL {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    print("=" * 60)

    uvicorn.run(
        "backend_py.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
