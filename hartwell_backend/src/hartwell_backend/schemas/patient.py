from pydantic import BaseModel, EmailStr


class PatientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None


class PatientResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None

    class Config:
        from_attributes = True