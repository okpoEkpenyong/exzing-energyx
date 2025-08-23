# backend/api/routers/oidc.py
import os
from fastapi import APIRouter, Request
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv

load_dotenv()

oauth = OAuth()
# Example config for Google:
oauth.register(
    name="google",
    client_id=os.environ.get("OIDC_GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("OIDC_GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

router = APIRouter(prefix="/oidc", tags=["OIDC"])

@router.get("/login")
async def oidc_login(request: Request):
    redirect_uri = request.url_for("oidc_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def oidc_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    # user is a dict with email / name / sub
    # TODO: create or find local user and issue local JWT
    # For demo we redirect to frontend with a temporary token in query (not secure for prod)
    # frontend = os.environ.get("FRONTEND_BASE", "https://energyx.exzing.com")
    frontend = os.environ.get("FRONTEND_BASE", "http://localhost:5173")
    return RedirectResponse(f"{frontend}/?oidc_token={token['access_token']}")
