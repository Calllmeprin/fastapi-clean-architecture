from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.domain.exceptions import EmailAlreadyRegisteredError, InvalidCredentialsError
from src.infrastructure.api import dependencies as deps
from src.infrastructure.database.postgres.init_db import init_db
from src.interface.handlers.api.auth_router import create_auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # สร้างตารางตอนเริ่มโปรแกรม ถ้ายังไม่มี
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="FastAPI Clean Architecture", lifespan=lifespan)

    # อนุญาตให้ frontend (Next.js พอร์ต 3000) เรียก API นี้จากเบราว์เซอร์ได้
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(EmailAlreadyRegisteredError)
    async def email_already_registered(_: Request, __: EmailAlreadyRegisteredError):
        return JSONResponse(
            status_code=409, content={"detail": "Email already registered"}
        )

    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials(_: Request, __: InvalidCredentialsError):
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid credentials"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    app.include_router(
        create_auth_router(
            deps.get_register_user, deps.get_login_user, deps.get_current_user
        )
    )
    return app


app = create_app()