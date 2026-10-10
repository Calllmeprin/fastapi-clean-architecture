from src.domain.entities.user import User
from src.domain.exceptions import EmailAlreadyRegisteredError
from src.domain.repositories.user_repository import UserRepository
from src.usecases.ports import PasswordHasher


class RegisterUser:
    def __init__(self, users: UserRepository, hasher: PasswordHasher) -> None:
        self._users = users
        self._hasher = hasher

    def execute(self, email: str, password: str) -> User:
        email = email.strip().lower()
        if self._users.get_by_email(email) is not None:
            raise EmailAlreadyRegisteredError(email)
        user = User(email=email, hashed_password=self._hasher.hash_password(password))
        return self._users.add(user)