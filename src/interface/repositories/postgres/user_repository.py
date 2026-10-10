from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.domain.entities.user import User
from src.domain.exceptions import EmailAlreadyRegisteredError
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.database.postgres.models import UserModel


class PostgresUserRepository(UserRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, user: User) -> User:
        model = UserModel(email=user.email, hashed_password=user.hashed_password)
        self._session.add(model)
        try:
            self._session.commit()
        except IntegrityError:
            self._session.rollback()
            raise EmailAlreadyRegisteredError(user.email)
        self._session.refresh(model)
        return self._to_entity(model)

    def get_by_email(self, email: str) -> User | None:
        model = self._session.scalar(select(UserModel).where(UserModel.email == email))
        return self._to_entity(model) if model else None

    def get_by_id(self, user_id: int) -> User | None:
        model = self._session.get(UserModel, user_id)
        return self._to_entity(model) if model else None

    @staticmethod
    def _to_entity(model: UserModel) -> User:
        return User(
            email=model.email,
            hashed_password=model.hashed_password,
            id=model.id,
            created_at=model.created_at,
        )