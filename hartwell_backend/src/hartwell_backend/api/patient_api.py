from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.api.deps import require_role
from hartwell_backend.schemas import PatientCreate, PatientResponse, PatientUpdate, PatientLogin
from hartwell_backend.services import PatientService
from hartwell_backend.core.security import verify_password, create_access_token

router = APIRouter(prefix="/patients", tags=["Patients"])

service = PatientService()


@router.post("/", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    try:
        return service.create_patient(db, patient)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db), current_user=Depends(require_role("admin", "doctor"))):
    return service.get_all_patients(db)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db), current_user=Depends(require_role("admin", "doctor", "patient"))):
    try:
        role = current_user["role"]
        user_id = int(current_user["sub"])
        if role == "patient" and user_id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="You can only access your own profile",
            )
        return service.get_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, patient: PatientUpdate, db: Session = Depends(get_db), current_user=Depends(require_role("admin", "doctor", "patient"))):
    try:
        role = current_user["role"]
        user_id = int(current_user["sub"])
        if role == "patient" and user_id != patient_id:
            raise HTTPException(
                status_code=403,
                detail="You can only access your own profile",
            )
        return service.update_patient(db, patient_id, patient)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(get_db), admin=Depends(require_role("admin"))):
    try:
        service.delete_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.post("/login", status_code=200)
def patient_login(request: PatientLogin, db: Session = Depends(get_db)):
    patient = service.get_patient_by_email(db, request.email)

    if patient is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(request.password, patient.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=str(patient.id), role="patient")

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": patient.id
    }