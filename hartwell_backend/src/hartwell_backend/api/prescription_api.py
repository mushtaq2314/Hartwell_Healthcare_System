# api/prescription_api.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import PrescriptionCreate, PrescriptionResponse, PrescriptionUpdate
from hartwell_backend.services import PrescriptionService

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

service = PrescriptionService()


@router.post("/", response_model=PrescriptionResponse)
def create_prescription(prescription: PrescriptionCreate, db: Session = Depends(get_db)):
    try:
        return service.create_prescription(db, prescription)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[PrescriptionResponse])
def get_prescriptions(db: Session = Depends(get_db)):
    return service.get_all_prescriptions(db)


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def get_prescription(prescription_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_prescription(db, prescription_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/visit/{visit_id}", response_model=list[PrescriptionResponse])
def get_prescriptions_for_visit(visit_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_prescriptions_for_visit(db, visit_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/", response_model=PrescriptionResponse)
def update_prescription(prescription: PrescriptionUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_prescription(db, prescription)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{prescription_id}", status_code=204)
def delete_prescription(prescription_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_prescription(db, prescription_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))