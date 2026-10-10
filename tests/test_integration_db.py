import uuid

import pytest
from sqlalchemy import delete

from src.config.settings import settings
from src.domain.exceptions import EmailAlreadyRegisteredError
from src.infrastructure.database.postgres.init_db import init_db
from src.infrastructure.database.postgres.models import UserModel
from src.infrastructure.database.postgres.session import SessionLocal
from src.infrastructure.security.bcrypt_hasher import BcryptPasswordHasher
from src.infrastructure.security.jwt_service import JwtTokenService
from src.interface.repositories.postgres.user_repository import PostgresUserRepository
from src.usecases.login_user import LoginUser
from src.usecases.register_user import RegisterUser


@pytest.fixture
def session():
    init_db()
    s = SessionLocal()
    yield s
    s.close()


def test_register_and_login_with_real_database(session):
    repo = PostgresUserRepository(session)
    hasher = BcryptPasswordHasher()
    tokens = JwtTokenService(
        settings.jwt_secret, settings.jwt_algorithm, settings.jwt_expire_minutes
    )
    email = f"test-{uuid.uuid4().hex}@example.com"
    try:
        user = RegisterUser(repo, hasher).execute(email, "secret123")
        assert user.id is not None
        assert user.created_at is not None

        token = LoginUser(repo, hasher, tokens).execute(email, "secret123")
        assert tokens.decode_access_token(token) == user.id

        with pytest.raises(EmailAlreadyRegisteredError):
            RegisterUser(repo, hasher).execute(email, "other")
    finally:
        session.rollback()
        session.execute(delete(UserModel).where(UserModel.email == email))
        session.commit()