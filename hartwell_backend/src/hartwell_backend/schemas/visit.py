# schemas/visit.py
from datetime import date, datetime

from pydantic import BaseModel


class VisitBase(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_id: int | None = None
    chief_complaint: str
    diagnosis: str | None = None
    clinical_notes: str | None = None
    follow_up_required: bool = False
    follow_up_date: date | None = None


class VisitCreate(VisitBase):
    pass


class VisitUpdate(BaseModel):
    id: int
    patient_id: int | None = None
    doctor_id: int | None = None
    appointment_id: int | None = None
    chief_complaint: str | None = None
    diagnosis: str | None = None
    clinical_notes: str | None = None
    follow_up_required: bool | None = None
    follow_up_date: date | None = None


class VisitResponse(VisitBase):
    id: int
    visit_date: datetime

    class Config:
        from_attributes = True