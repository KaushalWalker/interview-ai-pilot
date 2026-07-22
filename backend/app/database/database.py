from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True   # This tell Sqlalchemy before using an existing database connection 
)                        # check whether it's still alive. if it's dead reconnect insted of uisng the broken connection.

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,

)

Base =declarative_base()