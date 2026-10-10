from src.domain.exceptions import InvalidCredentialsError
from src.domain.repositories.user_repository import UserRepository
from src.usecases.ports import PasswordHasher, TokenService


class LoginUser:
    def __init__(
        self, users: UserRepository, hasher: PasswordHasher, tokens: TokenService
    ) -> None:
        self._users = users
        self._hasher = hasher
        self._tokens = tokens

    def execute(self, email: str, password: str) -> str:
        user = self._users.get_by_email(email.strip().lower())
        if user is None or not self._hasher.verify_password(
            password, user.hashed_password
        ):
            raise InvalidCredentialsError()
        return self._tokens.create_access_token(user.id)