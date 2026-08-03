# api/timeline_event_api.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import TimelineEventResponse
from hartwell_backend.services import TimelineEventService

router = APIRouter(prefix="/timeline", tags=["Timeline"])

service = TimelineEventService()


@router.get("/{patient_id}", response_model=list[TimelineEventResponse])
def get_timeline(patient_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_timeline_for_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))