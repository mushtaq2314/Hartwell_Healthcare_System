import os

from sqlalchemy.orm import Session

from hartwell_backend.models import Report
from hartwell_backend.schemas import ReportCreateDB, ReportUpdate
from hartwell_backend.core.paths import REPORT_STORAGE

class ReportRepository:

    def create(self, db: Session, report: ReportCreateDB) -> Report:
        db_report = Report(**report.model_dump())
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        return db_report

    def find_all(self, db: Session):
        return db.query(Report).all()

    def find_by_id(self, db: Session, report_id: int):
        return db.query(Report).filter(Report.id == report_id).first()

    def find_by_patient(self, db: Session, patient_id: int):
        return db.query(Report).filter(Report.patient_id == patient_id).order_by(Report.uploaded_at.desc()).all()

    def find_by_visit(self, db: Session, visit_id: int):
        return db.query(Report).filter(Report.visit_id == visit_id).all()

    def update(self, db: Session, report_id: int, report: ReportUpdate) -> Report | None:
        report_data = report.model_dump(exclude_unset=True, exclude={"id"})
        db_report = self.find_by_id(db, report_id)
        if not db_report:
            return None
        for field, value in report_data.items():
            setattr(db_report, field, value)
        db.commit()
        db.refresh(db_report)
        return db_report

    def delete(self, db: Session, report_id: int) -> bool:
        db_report = self.find_by_id(db, report_id)
        if not db_report:
            return False
        report_file_path = REPORT_STORAGE / db_report.file_path
        try:
            os.remove(report_file_path)
        except:
            print("Error deleting report.")    
        db.delete(db_report)
        db.commit()
        return True