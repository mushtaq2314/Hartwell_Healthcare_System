from pydantic import BaseModel


class MedicationBase(BaseModel):
    generic_name: str
    brand_name: str | None = None
    drug_class: str | None = None
    description: str | None = None


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    id: int
    generic_name: str | None = None
    brand_name: str | None = None
    drug_class: str | None = None
    description: str | None = None


class MedicationResponse(MedicationBase):
    id: int

    class Config:
        from_attributes = True