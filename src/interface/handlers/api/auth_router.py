from collections.abc import Callable

from fastapi import APIRouter, Depends, status

from src.domain.entities.user import User
from src.interface.handlers.api.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from src.usecases.login_user import LoginUser
from src.usecases.register_user import RegisterUser


def create_auth_router(
    get_register_user: Callable[..., RegisterUser],
    get_login_user: Callable[..., LoginUser],
    get_current_user: Callable[..., User],
) -> APIRouter:
    router = APIRouter(tags=["auth"])

    @router.post(
        "/register",
        response_model=UserResponse,
        status_code=status.HTTP_201_CREATED,
    )
    def register(
        body: RegisterRequest, usecase: RegisterUser = Depends(get_register_user)
    ):
        user = usecase.execute(body.email, body.password)
        return UserResponse.model_validate(user)

    @router.post("/login", response_model=TokenResponse)
    def login(body: LoginRequest, usecase: LoginUser = Depends(get_login_user)):
        token = usecase.execute(body.email, body.password)
        return TokenResponse(access_token=token)

    @router.get("/me", response_model=UserResponse)
    def me(user: User = Depends(get_current_user)):
        return UserResponse.model_validate(user)

    return router