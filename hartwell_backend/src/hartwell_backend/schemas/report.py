# schemas/report.py
from datetime import datetime

from pydantic import BaseModel


class ReportBase(BaseModel):
    patient_id: int
    visit_id: int | None = None
    title: str
    report_type: str


class ReportCreate(ReportBase):
    pass

class ReportCreateDB(ReportBase):
    file_name: str
    file_path: str

class ReportUpdate(BaseModel):
    id: int
    title: str | None = None
    report_type: str | None = None
    extracted_text: str | None = None
    ai_summary: str | None = None
    processing_status: str | None = None


class ReportResponse(ReportBase):
    id: int
    extracted_text: str | None = None
    ai_summary: str | None = None
    processing_status: str
    uploaded_at: datetime
    file_name: str
    file_path: str

    class Config:
        from_attributes = True