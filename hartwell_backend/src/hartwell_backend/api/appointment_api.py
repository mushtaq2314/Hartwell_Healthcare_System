from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.services import AppointmentService
from hartwell_backend.schemas import AppointmentCreate, AppointmentResponse, AppointmentUpdate
from hartwell_backend.database import get_db

router = APIRouter(prefix="/appointments", tags=["Appointments"])

service = AppointmentService()

@router.post("/", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    try:
        return service.create_appointment(db, appointment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/", response_model=list[AppointmentResponse])
def get_appointments(db: Session = Depends(get_db)):
    return service.get_all_appointments(db)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_appointment(db, appointment_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/patient/{patient_id}", response_model=list[AppointmentResponse])
def get_appointments_for_patient(patient_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_appointments_for_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/doctor/{doctor_id}", response_model=list[AppointmentResponse])
def get_appointments_for_doctor(doctor_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_appointments_for_doctor(db, doctor_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/", response_model=AppointmentResponse)
def update_appointment(appointment: AppointmentUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_appointment(db, appointment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    try:
        return service.cancel_appointment(db, appointment_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))