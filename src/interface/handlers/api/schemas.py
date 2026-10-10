from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_BYTES = 72  # bcrypt รับรหัสผ่านได้ไม่เกิน 72 bytes


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < MIN_PASSWORD_LENGTH:
            raise ValueError(f"password must be at least {MIN_PASSWORD_LENGTH} characters")
        if len(value.encode("utf-8")) > MAX_PASSWORD_BYTES:
            raise ValueError(f"password must be at most {MAX_PASSWORD_BYTES} bytes")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"