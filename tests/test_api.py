import uuid

from fastapi.testclient import TestClient
from sqlalchemy import delete

from src.infrastructure.api.main import app
from src.infrastructure.database.postgres.models import UserModel
from src.infrastructure.database.postgres.session import SessionLocal


def test_register_login_me_flow():
    email = f"api-{uuid.uuid4().hex}@example.com"
    password = "secret123"
    try:
        with TestClient(app) as client:
            created = client.post("/register", json={"email": email, "password": password})
            assert created.status_code == 201
            assert created.json()["email"] == email
            assert "password" not in created.text

            duplicate = client.post("/register", json={"email": email, "password": password})
            assert duplicate.status_code == 409

            short = client.post("/register", json={"email": email, "password": "short"})
            assert short.status_code == 422

            wrong = client.post("/login", json={"email": email, "password": "wrongpass1"})
            assert wrong.status_code == 401

            login = client.post("/login", json={"email": email, "password": password})
            token = login.json()["access_token"]

            me = client.get("/me", headers={"Authorization": f"Bearer {token}"})
            assert me.status_code == 200
            assert me.json()["email"] == email

            assert client.get("/me").status_code == 401
            bad = client.get("/me", headers={"Authorization": "Bearer garbage"})
            assert bad.status_code == 401
    finally:
        with SessionLocal() as session:
            session.execute(delete(UserModel).where(UserModel.email == email))
            session.commit()