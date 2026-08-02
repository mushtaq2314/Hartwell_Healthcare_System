from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import DoctorCreate, DoctorResponse, DoctorUpdate
from hartwell_backend.services import DoctorService

router = APIRouter(prefix="/doctors", tags=["Doctors"])

service = DoctorService()


@router.post("/", response_model=DoctorResponse)
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    try:
        return service.create_doctor(db, doctor)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    return service.get_all_doctors(db)


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_doctor(db, doctor_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(doctor_id: int, doctor: DoctorUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_doctor(db, doctor_id, doctor)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{doctor_id}", status_code=204)
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_doctor(db, doctor_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
