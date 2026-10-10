import pytest

from src.domain.entities.user import User
from src.domain.exceptions import EmailAlreadyRegisteredError, InvalidCredentialsError
from src.domain.repositories.user_repository import UserRepository
from src.usecases.get_current_user import GetCurrentUser
from src.usecases.login_user import LoginUser
from src.usecases.ports import PasswordHasher, TokenService
from src.usecases.register_user import RegisterUser


class FakeUserRepository(UserRepository):
    def __init__(self) -> None:
        self._users: dict[int, User] = {}
        self._next_id = 1

    def add(self, user: User) -> User:
        user.id = self._next_id
        self._next_id += 1
        self._users[user.id] = user
        return user

    def get_by_email(self, email: str) -> User | None:
        return next((u for u in self._users.values() if u.email == email), None)

    def get_by_id(self, user_id: int) -> User | None:
        return self._users.get(user_id)


class FakeHasher(PasswordHasher):
    def hash_password(self, plain_password: str) -> str:
        return f"hashed:{plain_password}"

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return hashed_password == f"hashed:{plain_password}"


class FakeTokenService(TokenService):
    def create_access_token(self, user_id: int) -> str:
        return f"token-{user_id}"

    def decode_access_token(self, token: str) -> int | None:
        if token.startswith("token-"):
            return int(token.removeprefix("token-"))
        return None


@pytest.fixture
def services():
    repo, hasher, tokens = FakeUserRepository(), FakeHasher(), FakeTokenService()
    return (
        RegisterUser(repo, hasher),
        LoginUser(repo, hasher, tokens),
        GetCurrentUser(repo, tokens),
    )


def test_register_stores_hashed_password(services):
    register, _, _ = services
    user = register.execute("A@B.com", "secret123")
    assert user.id == 1
    assert user.email == "a@b.com"
    assert user.hashed_password != "secret123"


def test_register_duplicate_email_raises(services):
    register, _, _ = services
    register.execute("a@b.com", "secret123")
    with pytest.raises(EmailAlreadyRegisteredError):
        register.execute("A@B.COM", "other")


def test_login_returns_token(services):
    register, login, _ = services
    register.execute("a@b.com", "secret123")
    assert login.execute("a@b.com", "secret123") == "token-1"


def test_login_wrong_password_raises(services):
    register, login, _ = services
    register.execute("a@b.com", "secret123")
    with pytest.raises(InvalidCredentialsError):
        login.execute("a@b.com", "wrong")


def test_login_unknown_email_raises(services):
    _, login, _ = services
    with pytest.raises(InvalidCredentialsError):
        login.execute("nobody@b.com", "secret123")


def test_get_current_user_with_valid_token(services):
    register, login, current = services
    register.execute("a@b.com", "secret123")
    token = login.execute("a@b.com", "secret123")
    assert current.execute(token).email == "a@b.com"


def test_get_current_user_with_invalid_token_raises(services):
    _, _, current = services
    with pytest.raises(InvalidCredentialsError):
        current.execute("garbage")