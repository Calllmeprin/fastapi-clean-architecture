from src.infrastructure.database.postgres import models  # noqa: F401
from src.infrastructure.database.postgres.session import Base, engine


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("tables created")