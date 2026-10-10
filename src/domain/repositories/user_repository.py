from abc import ABC, abstractmethod

from src.domain.entities.user import User


class UserRepository(ABC):
    """สัญญาว่าการเก็บและดึงผู้ใช้ต้องทำอะไรได้บ้าง

    domain บอกแค่ "ต้องทำอะไรได้" ส่วน "ทำอย่างไร"
    (PostgreSQL, หน่วยความจำ ฯลฯ) ให้ชั้นนอกเป็นคนตัดสินใจ
    """

    @abstractmethod
    def add(self, user: User) -> User:
        """บันทึกผู้ใช้ใหม่ แล้วคืน User ที่มี id และ created_at"""

    @abstractmethod
    def get_by_email(self, email: str) -> User | None:
        """หาผู้ใช้จากอีเมล ไม่พบให้คืน None"""

    @abstractmethod
    def get_by_id(self, user_id: int) -> User | None:
        """หาผู้ใช้จาก id ไม่พบให้คืน None"""