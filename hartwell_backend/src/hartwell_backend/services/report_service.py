# services/report_service.py
from sqlalchemy.orm import Session
from fastapi import UploadFile

from hartwell_backend.repositories import PatientRepository, ReportRepository, TimelineEventRepository, VisitRepository
from hartwell_backend.schemas import ReportCreate, ReportUpdate, TimelineEventCreate, ReportCreateDB
from hartwell_backend.utils import save_report_file

class ReportService:

    def __init__(self):
        self.repository = ReportRepository()
        self.patient_repository = PatientRepository()
        self.visit_repository = VisitRepository()
        self.timeline_repository = TimelineEventRepository()

    def create_report(self, db: Session, report: ReportCreate, file: UploadFile):
        if not self.patient_repository.find_by_id(db, report.patient_id):
            raise ValueError("Patient not found")
        if report.visit_id is not None and not self.visit_repository.find_by_id(db, report.visit_id):
            raise ValueError("Visit not found")

        file_name, file_path = save_report_file(report.patient_id, file)
        
        report_db = ReportCreateDB(**report.model_dump(), file_name=file_name, file_path=file_path)
        
        db_report = self.repository.create(db, report_db)

        self.timeline_repository.create(
            db,
            TimelineEventCreate(
                patient_id=report.patient_id,
                visit_id=report.visit_id,
                event_type="REPORT_UPLOADED",
                title=f"{report.report_type} Uploaded",
                description=report.title,
            ),
        )

        return db_report

    def get_all_reports(self, db: Session):
        return self.repository.find_all(db)

    def get_report(self, db: Session, report_id: int):
        report = self.repository.find_by_id(db, report_id)
        if not report:
            raise ValueError("Report not found")
        return report

    def get_reports_for_patient(self, db: Session, patient_id: int):
        if not self.patient_repository.find_by_id(db, patient_id):
            raise ValueError("Patient not found")
        return self.repository.find_by_patient(db, patient_id)

    def get_reports_for_visit(self, db: Session, visit_id: int):
        if not self.visit_repository.find_by_id(db, visit_id):
            raise ValueError("Visit not found")
        return self.repository.find_by_visit(db, visit_id)

    def update_report(self, db: Session, report: ReportUpdate):
        updated = self.repository.update(db, report.id, report)
        if not updated:
            raise ValueError("Report not found")
        return updated

    def delete_report(self, db: Session, report_id: int):
        deleted = self.repository.delete(db, report_id)
        if not deleted:
            raise ValueError("Report not found")