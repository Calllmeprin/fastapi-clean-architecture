from collections.abc import Iterator

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.config.settings import settings
from src.domain.entities.user import User
from src.domain.exceptions import InvalidCredentialsError
from src.infrastructure.database.postgres.session import SessionLocal
from src.infrastructure.security.bcrypt_hasher import BcryptPasswordHasher
from src.infrastructure.security.jwt_service import JwtTokenService
from src.interface.repositories.postgres.user_repository import PostgresUserRepository
from src.usecases.get_current_user import GetCurrentUser
from src.usecases.login_user import LoginUser
from src.usecases.register_user import RegisterUser

bearer_scheme = HTTPBearer(auto_error=False)

_hasher = BcryptPasswordHasher()
_tokens = JwtTokenService(
    settings.jwt_secret, settings.jwt_algorithm, settings.jwt_expire_minutes
)


def get_session() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_user_repository(
    session: Session = Depends(get_session),
) -> PostgresUserRepository:
    return PostgresUserRepository(session)


def get_register_user(
    users: PostgresUserRepository = Depends(get_user_repository),
) -> RegisterUser:
    return RegisterUser(users, _hasher)


def get_login_user(
    users: PostgresUserRepository = Depends(get_user_repository),
) -> LoginUser:
    return LoginUser(users, _hasher, _tokens)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    users: PostgresUserRepository = Depends(get_user_repository),
) -> User:
    if credentials is None:
        raise InvalidCredentialsError()
    return GetCurrentUser(users, _tokens).execute(credentials.credentials)