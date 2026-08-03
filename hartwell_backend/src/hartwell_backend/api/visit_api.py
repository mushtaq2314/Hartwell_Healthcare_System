# api/visit_api.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import VisitCreate, VisitResponse, VisitUpdate
from hartwell_backend.services import VisitService

router = APIRouter(prefix="/visits", tags=["Visits"])

service = VisitService()


@router.post("/", response_model=VisitResponse)
def create_visit(visit: VisitCreate, db: Session = Depends(get_db)):
    try:
        return service.create_visit(db, visit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[VisitResponse])
def get_visits(db: Session = Depends(get_db)):
    return service.get_all_visits(db)


@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_visit(db, visit_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/patient/{patient_id}", response_model=list[VisitResponse])
def get_visits_for_patient(patient_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_visits_for_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/doctor/{doctor_id}", response_model=list[VisitResponse])
def get_visits_for_doctor(doctor_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_visits_for_doctor(db, doctor_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/", response_model=VisitResponse)
def update_visit(visit: VisitUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_visit(db, visit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{visit_id}", status_code=204)
def delete_visit(visit_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_visit(db, visit_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))