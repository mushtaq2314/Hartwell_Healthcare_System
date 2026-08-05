from sqlalchemy.orm import Session
from hartwell_backend.database import SessionLocal

from hartwell_backend.ai.extractor import DocumentReader
from hartwell_backend.ai.llm import SummaryService
from hartwell_backend.repositories import ReportRepository, TimelineEventRepository
from hartwell_backend.schemas import TimelineEventCreate, ReportUpdate
from hartwell_backend.core.paths import REPORT_STORAGE


class ReportProcessor:
    def __init__(self):
        self.report_repository = ReportRepository()
        self.timeline_repository = TimelineEventRepository()
        self.summary_service = SummaryService()
        self.db = SessionLocal()

    def process(
        self,
        report_id: int,
    ):
        db_report = self.report_repository.find_by_id(self.db, report_id)
        report = ReportUpdate(id=report_id)

        if db_report is None:
            raise ValueError("Report not found")

        try:
            report.processing_status = "Processing"
            self.report_repository.update(
                self.db,
                report_id,
                report,
            )

            pdf_path = REPORT_STORAGE / db_report.file_path
            text = DocumentReader.read_document(str(pdf_path))

            report.extracted_text = text
            report.processing_status = "Summarizing"
            self.report_repository.update(
                self.db,
                report_id,
                report,
            )

            summary = self.summary_service.generate_summary(text)

            report.ai_summary = summary
            report.processing_status = "Completed"
            self.report_repository.update(
                self.db,
                report_id,
                report,
            )

            self.timeline_repository.create(
                self.db,
                TimelineEventCreate(
                    patient_id=db_report.patient_id,
                    visit_id=db_report.visit_id,
                    event_type="AI_REPORT_SUMMARIZED",
                    title="AI Report Summary",
                    description="Medical report processed successfully.",
                ),
            )

        except Exception:
            report.processing_status = "Failed"
            self.report_repository.update(
                self.db,
                report_id,
                report,
            )
            raise