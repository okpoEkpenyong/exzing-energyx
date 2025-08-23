# TODO: Implement authentication and authorization logic
# backend/api/routers/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginIn(BaseModel):
    username: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=TokenOut)
def login(body: LoginIn):
    # Very small stub: accept admin/admin for convenience
    if body.username == "admin" and body.password == "admin":
        return {"access_token": "dev-mock-token-ADMIN", "token_type": "bearer"}
    # else allow any username but return mock token for dev convenience
    return {"access_token": f"mock-token-{body.username}", "token_type": "bearer"}
