from datetime import datetime

from pydantic import BaseModel, EmailStr


class DoctorBase(BaseModel):
    first_name: str
    last_name: str
    department_id: int
    qualification: str
    specialization: str
    experience_years: int
    email: EmailStr
    phone: str
    license_number: str


class DoctorCreate(DoctorBase):
    password: str
    pass

class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

class DoctorUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    department_id: int | None = None
    qualification: str | None = None
    specialization: str | None = None
    experience_years: int | None = None
    email: EmailStr | None = None
    phone: str | None = None
    license_number: str | None = None


class DoctorGeneralResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    department_id: int
    qualification: str
    specialization: str
    experience_years: int
    department: str

class DoctorResponse(DoctorBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
