from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    dob: date
    gender: str
    email: EmailStr
    phone: str
    blood_group: str | None = None
    address: str | None = None
    emergency_contact: str | None = None
    allergies: str | None = None
    chronic_conditions: str | None = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    dob: date | None = None
    gender: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    blood_group: str | None = None
    address: str | None = None
    emergency_contact: str | None = None
    allergies: str | None = None
    chronic_conditions: str | None = None


class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True