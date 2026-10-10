from src.infrastructure.security.bcrypt_hasher import BcryptPasswordHasher
from src.infrastructure.security.jwt_service import JwtTokenService

SECRET_A = "secret-a-secret-a-secret-a-secret-a"
SECRET_B = "secret-b-secret-b-secret-b-secret-b"


def test_hash_and_verify():
    hasher = BcryptPasswordHasher()
    hashed = hasher.hash_password("secret123")
    assert hashed != "secret123"
    assert hasher.verify_password("secret123", hashed)
    assert not hasher.verify_password("wrong", hashed)


def test_token_roundtrip():
    tokens = JwtTokenService(SECRET_A, "HS256", 60)
    assert tokens.decode_access_token(tokens.create_access_token(7)) == 7


def test_token_rejects_garbage_and_wrong_secret():
    a = JwtTokenService(SECRET_A, "HS256", 60)
    b = JwtTokenService(SECRET_B, "HS256", 60)
    assert a.decode_access_token("garbage") is None
    assert b.decode_access_token(a.create_access_token(1)) is None


def test_expired_token_rejected():
    tokens = JwtTokenService(SECRET_A, "HS256", -1)
    assert tokens.decode_access_token(tokens.create_access_token(1)) is None