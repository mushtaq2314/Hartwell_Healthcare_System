from datetime import datetime

from pydantic import BaseModel

from hartwell_backend.models.appointment import AppointmentStatus


class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_time: datetime
    reason: str | None = None
    notes: str | None = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    id: int
    patient_id: int | None = None
    doctor_id: int | None = None
    appointment_time: datetime | None = None
    status: AppointmentStatus | None = None
    reason: str | None = None
    notes: str | None = None


class AppointmentResponse(AppointmentBase):
    id: int
    status: AppointmentStatus
    created_at: datetime

    class Config:
        from_attributes = True