from pydantic import BaseModel
from hartwell_backend.schemas.doctor import DoctorResponse


class DepartmentBase(BaseModel):
    name: str
    description: str | None = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class DepartmentResponse(DepartmentBase):
    id: int
    doctors: list[DoctorResponse] = []

    class Config:
        from_attributes = True
