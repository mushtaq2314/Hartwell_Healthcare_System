from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.models import Admin
from hartwell_backend.schemas import AdminLogin
from hartwell_backend.core.security import verify_password, create_access_token

router = APIRouter(prefix="/admins", tags=["Admins"])
    
@router.post("/login", status_code=200)
def admin_login(request: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == request.email).first()

    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(request.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=str(admin.id), role="admin")

    return {
        "access_token": token,
        "token_type": "bearer",
    }