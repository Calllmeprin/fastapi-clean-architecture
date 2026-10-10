class DomainError(Exception):
    """ฐานของข้อผิดพลาดที่เกิดจากกฎของธุรกิจ"""


class EmailAlreadyRegisteredError(DomainError):
    """สมัครด้วยอีเมลที่มีอยู่แล้ว"""


class InvalidCredentialsError(DomainError):
    """อีเมลหรือรหัสผ่านไม่ถูกต้อง"""