from abc import ABC, abstractmethod


class PasswordHasher(ABC):
    @abstractmethod
    def hash_password(self, plain_password: str) -> str:
        """แปลงรหัสผ่านจริงเป็นค่า hash"""

    @abstractmethod
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """เทียบรหัสผ่านจริงกับค่า hash ที่เก็บไว้"""


class TokenService(ABC):
    @abstractmethod
    def create_access_token(self, user_id: int) -> str:
        """สร้าง token ของผู้ใช้"""

    @abstractmethod
    def decode_access_token(self, token: str) -> int | None:
        """คืน user_id ถ้า token ถูกต้อง ไม่ถูกต้องหรือหมดอายุให้คืน None"""