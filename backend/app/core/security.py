import os
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt, JWTError
from backend.app.config import settings

def hash_password(password: str) -> str:
    """Secure SHA-256 with salt password hashing compatible across all platforms."""
    salt = os.urandom(16).hex()
    hash_obj = hashlib.sha256((salt + password).encode('utf-8'))
    return f"{salt}${hash_obj.hexdigest()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against salt$hash string."""
    try:
        if "$" not in hashed_password:
            return False
        salt, expected_hash = hashed_password.split("$", 1)
        actual_hash = hashlib.sha256((salt + plain_password).encode('utf-8')).hexdigest()
        return hmac.compare_digest(actual_hash, expected_hash)
    except Exception:
        return False

def create_access_token(subject: Union[str, Any], role: str = "user", expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
