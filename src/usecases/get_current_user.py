from src.domain.entities.user import User
from src.domain.exceptions import InvalidCredentialsError
from src.domain.repositories.user_repository import UserRepository
from src.usecases.ports import TokenService


class GetCurrentUser:
    def __init__(self, users: UserRepository, tokens: TokenService) -> None:
        self._users = users
        self._tokens = tokens

    def execute(self, token: str) -> User:
        user_id = self._tokens.decode_access_token(token)
        if user_id is None:
            raise InvalidCredentialsError()
        user = self._users.get_by_id(user_id)
        if user is None:
            raise InvalidCredentialsError()
        return user