from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import (
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse,
)
from hartwell_backend.services.medication_service import MedicationService

router = APIRouter(prefix="/medications", tags=["Medications"])

service = MedicationService()


@router.post("/", response_model=MedicationResponse)
def create_medication(medication: MedicationCreate, db: Session = Depends(get_db)):
    try:
        return service.create_medication(db, medication)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[MedicationResponse])
def get_medications(db: Session = Depends(get_db)):
    return service.get_all_medications(db)


@router.get("/search", response_model=list[MedicationResponse])
def search_medications(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return service.search_medications(db, q)


@router.get("/{medication_id}", response_model=MedicationResponse)
def get_medication(medication_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_medication(db, medication_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/", response_model=MedicationResponse)
def update_medication(medication: MedicationUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_medication(db, medication)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{medication_id}", status_code=204)
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_medication(db, medication_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))