# api/report_api.py
from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import ReportCreate, ReportResponse, ReportUpdate
from hartwell_backend.services import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])

service = ReportService()


@router.post("/", response_model=ReportResponse)
def create_report(patient_id: int = Form(...),
    visit_id: int | None = Form(None),
    title: str = Form(...),
    report_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    report = ReportCreate(
        patient_id=patient_id,
        visit_id=visit_id,
        title=title,
        report_type=report_type,
    )

    try:
        return service.create_report(db, report, file)

    except ValueError as e:
        raise HTTPException( status_code=400, detail=str(e))


@router.get("/", response_model=list[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return service.get_all_reports(db)


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_report(db, report_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/patient/{patient_id}", response_model=list[ReportResponse])
def get_reports_for_patient(patient_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_reports_for_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/visit/{visit_id}", response_model=list[ReportResponse])
def get_reports_for_visit(visit_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_reports_for_visit(db, visit_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/", response_model=ReportResponse)
def update_report(report: ReportUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_report(db, report)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{report_id}", status_code=204)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_report(db, report_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))