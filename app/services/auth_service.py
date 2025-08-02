from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, create_acces_token
from app.schemas.auth import Token

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def login(db: Session, email: str, password: str) -> Token | None:
    user = authenticate_user(db, email, password)
    if not user:
        return None
    access_token = create_acces_token(data={'sub': user.email})
    return Token(access_token=access_token)