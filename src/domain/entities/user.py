from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    email: str
    hashed_password: str
    id: int | None = None
    created_at: datetime | None = None