# FastAPI Clean Architecture

A user registration and authentication API (register, login, current user)
built with FastAPI, PostgreSQL and JWT, organized with Clean Architecture.
It is my solution to the Khaojai IT Software Engineer coding challenge:
re-implement a Go Clean Architecture template in Python.

## Credits

This project is a Python rewrite of the architecture in
[max38/golang-clean-code-architecture](https://github.com/max38/golang-clean-code-architecture)
(Apache-2.0). I studied the original Go template and re-implemented it in Python with FastAPI.

**Taken from the template:** the four-layer organization (domain, usecases,
interface, infrastructure), the rule that inner layers never depend on outer
layers, and the feature set (user registration and JWT authentication).

**My own work:** the Python/FastAPI implementation; ports for password hashing
and token creation so use cases stay free of bcrypt and PyJWT; a Docker Compose
setup with configuration read from `.env`; and 13 automated tests across all layers.


## Tech stack

- FastAPI, Pydantic
- SQLAlchemy 2, PostgreSQL 16 (Docker)
- bcrypt (password hashing), PyJWT (access tokens)
- pytest

## API

| Method | Path | Auth | Responses |
|---|---|---|---|
| POST | `/register` | none | 201, 409 (email taken), 422 (invalid input) |
| POST | `/login` | none | 200 (access token), 401 |
| GET | `/me` | Bearer token | 200, 401 |

Interactive docs (Swagger UI): http://127.0.0.1:8000/docs

## Architecture

```
src/
├── config/                  settings read from .env
├── domain/
│   ├── entities/            User
│   ├── repositories/        UserRepository (interface)
│   └── exceptions.py        business errors
├── usecases/
│   ├── ports.py             PasswordHasher, TokenService (interfaces)
│   ├── register_user.py
│   ├── login_user.py
│   └── get_current_user.py
├── interface/
│   ├── handlers/api/        routers and request/response schemas
│   └── repositories/postgres/   PostgresUserRepository
└── infrastructure/
    ├── api/                 FastAPI app, dependency wiring
    ├── database/postgres/   engine, ORM models, table creation
    └── security/            bcrypt and JWT implementations
tests/
```

| Layer | Responsibility | Depends on |
|---|---|---|
| domain | entities, repository interface, business errors | nothing |
| usecases | one class per application action, plus ports | domain |
| interface | HTTP routers/schemas, repository implementation | usecases, domain |
| infrastructure | app creation, database, bcrypt/JWT, wiring | all inner layers |

### Why this structure

Source code dependencies point inward only. `domain` and `usecases` never import
FastAPI, SQLAlchemy, bcrypt or PyJWT. They depend on interfaces (`UserRepository`,
`PasswordHasher`, `TokenService`) that the outer layers implement.

- **Changing the database:** only outer layers change: the driver in
  `requirements.txt`, the connection settings, the ORM models, `PostgresUserRepository`,
  and the wiring in `infrastructure/api/dependencies.py`. `domain`, `usecases`,
  the routers and the use case tests stay untouched. For another SQL database
  supported by SQLAlchemy, this can be as small as the driver and the connection URL.
- **Testing without a database:** because use cases depend on interfaces,
  `test_usecases.py` passes in-memory fakes. It checks business rules (duplicate
  emails, wrong passwords, invalid tokens) in milliseconds, with no Docker,
  no real bcrypt cost and no real tokens.
- **No direct bcrypt/jwt imports in use cases:** libraries are details that may
  change (for example bcrypt to argon2). Behind `PasswordHasher` and `TokenService`,
  such a change touches one adapter class and nothing in the use cases.

### Differences from the original template

1. **Go (GoFiber, GORM) to Python (FastAPI, SQLAlchemy, Pydantic).**
2. **ORM models moved out of the domain layer.** An ORM model is a database detail
   (table names, column types, a SQLAlchemy base class). Keeping it in `domain` would
   make the innermost layer depend on a library. `domain` now holds a plain `User`
   dataclass, and `PostgresUserRepository` converts between `UserModel` and `User`.
3. **Added `usecases/ports.py`.** Interfaces for password hashing and token creation,
   so use cases never import bcrypt or PyJWT.
4. **The router is built by a function (`create_auth_router`)** that receives its
   dependencies as arguments instead of importing them. The `interface` layer does not
   import concrete implementations, and all wiring happens in one place
   (the composition root in `infrastructure/api`).
5. **Domain errors are translated to HTTP at the outermost layer.**
   `EmailAlreadyRegisteredError` becomes 409 and `InvalidCredentialsError` becomes 401
   in exception handlers in `main.py`. Business errors stay independent of HTTP, and
   the mapping can change in one place.     

## Getting started

```bash
git clone <repo-url>
cd fastapi-clean-architecture
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
# edit .env: set POSTGRES_PASSWORD and JWT_SECRET
# generate a secret: python -c "import secrets; print(secrets.token_hex(32))"

docker compose up -d
uvicorn src.infrastructure.api.main:app --reload
```

Tables are created automatically on startup.

## Running tests

```bash
python -m pytest -v
```

The database container must be running. The integration and API tests use
PostgreSQL with random emails and remove their data afterwards.

| File | What it covers |
|---|---|
| `test_usecases.py` | use case logic with in-memory fakes (no database) |
| `test_security.py` | bcrypt hashing and JWT creation/expiry/rejection |
| `test_integration_db.py` | use cases wired to real PostgreSQL, bcrypt and JWT |
| `test_api.py` | full HTTP flow: register, duplicate, login, `/me`, invalid input |

## Design and security notes

- **Responses never include the password hash.** The `User` entity holds it, but
  `UserResponse` exposes only `id`, `email` and `created_at`, so it cannot leak
  through any endpoint.
- **Unknown email and wrong password return the same error (401).** This prevents
  user enumeration: an attacker cannot learn which emails have accounts.
- **The password limit is 72 bytes, not characters.** bcrypt handles at most 72 bytes
  and raises an error beyond that. Thai characters take 3 bytes each in UTF-8, so a
  character limit would let some Thai passwords through only to fail later. The limit
  and a minimum of 8 characters are validated in the request schema.
- **Secrets stay out of Git.** The database password and JWT secret are read from
  `.env`, which is in `.gitignore`. `.env.example` contains placeholders only.
- **Passwords are salted and hashed with bcrypt.** Plain-text passwords are never stored.

## Limitations

- Tables are created with `create_all` at startup. There is no migration tool
  (for example Alembic), so changes to existing tables are not handled.
- No refresh tokens, token revocation or login rate limiting.
- CORS allows only `http://localhost:3000` (development setting).
- The dependency rule is not 100% strict: `PostgresUserRepository` lives in
  `interface/repositories/postgres` but imports `UserModel` from `infrastructure`.
  Moving it into `infrastructure/database/postgres` would make the rule strict.

## License

Apache-2.0. See [LICENSE](LICENSE).