import os
import sys
import pymysql
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend_py.config import settings

Base = declarative_base()

_engine = None
_SessionLocal = None
_using_sqlite_fallback = False


def create_mysql_database_if_not_exists():
    """Attempt to create the MySQL database if it does not exist."""
    try:
        conn = pymysql.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            charset='utf8mb4',
            connect_timeout=3
        )
        with conn.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{settings.DB_NAME}` "
                f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            )
        conn.commit()
        conn.close()
        print(f"[Database] Successfully verified/created MySQL database: {settings.DB_NAME}")
        return True
    except Exception as e:
        print(f"[Database Warning] Could not auto-create MySQL database '{settings.DB_NAME}': {e}")
        return False


def get_engine():
    global _engine, _SessionLocal, _using_sqlite_fallback
    if _engine is not None:
        return _engine

    mysql_success = create_mysql_database_if_not_exists()

    if mysql_success:
        try:
            _engine = create_engine(
                settings.mysql_url,
                pool_pre_ping=True,
                pool_recycle=3600,
                echo=False
            )
            # Test connection
            with _engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"[Database] Connected to MySQL successfully at {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
            _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
            return _engine
        except Exception as e:
            print(f"[Database Error] Failed to connect to MySQL database '{settings.DB_NAME}': {e}")

    # Fallback to local SQLite if MySQL is not reachable or credentials differ
    print("[Database Info] Falling back to SQLite database at data/lms_local.db for resilience.")
    _using_sqlite_fallback = True
    os.makedirs(os.path.join(os.path.dirname(__file__), "..", "data"), exist_ok=True)
    sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "lms_local.db"))
    _engine = create_engine(
        f"sqlite:///{sqlite_path}",
        connect_args={"check_same_thread": False},
        echo=False
    )
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


def get_session_factory():
    global _SessionLocal
    if _SessionLocal is None:
        get_engine()
    return _SessionLocal


def get_db():
    """FastAPI Dependency for database session."""
    session_factory = get_session_factory()
    db: Session = session_factory()
    try:
        yield db
    finally:
        db.close()


def is_using_sqlite() -> bool:
    return _using_sqlite_fallback
