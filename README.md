# Backend – FastAPI

## Setup

1. **Create virtual environment:**

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**

   ```sh
   pip install -r requirements.txt
   ```

3. **Configure environment:**

   - Copy `.env.example` to `.env` and set your variables (e.g. `DATABASE_URL`).

4. **Run migrations:**

   ```sh
   alembic upgrade head
   ```

5. **Start server:**
   ```sh
   uvicorn app.main:app --reload
   ```

## Main scripts

- `app/main.py` – FastAPI entrypoint
- `app/api/v1/` – API routes
- `app/models/` – SQLAlchemy models
- `app/schemas/` – Pydantic schemas
- `app/services/` – Business logic
- `app/core/` – DB, config, security

## Useful commands

- Run tests:  
  _Add your test command here if you use pytest or similar._

- Create migration:
  ```sh
  alembic revision --autogenerate -m "message"
  ```

---

## License

MIT or your license here.
