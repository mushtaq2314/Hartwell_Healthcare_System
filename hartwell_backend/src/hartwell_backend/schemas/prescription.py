# schemas/prescription.py
from pydantic import BaseModel


class PrescriptionBase(BaseModel):
    visit_id: int
    medication_id: int
    dosage: str
    frequency: str
    duration_days: int
    instructions: str | None = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionUpdate(BaseModel):
    id: int
    visit_id: int | None = None
    medication_id: int | None = None
    dosage: str | None = None
    frequency: str | None = None
    duration_days: int | None = None
    instructions: str | None = None


class PrescriptionResponse(PrescriptionBase):
    id: int

    class Config:
        from_attributes = True