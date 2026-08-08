from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import ReportRepository


repository = ReportRepository()


def create_report_tool(current_patient_id: int):
    @tool
    def get_reports(patient_id: int):
        """
        Returns all processed reports of the patient.
        """
        print("get_reports tool called")

        if patient_id != current_patient_id:
            return "Access denied."

        db = SessionLocal()

        try:
            reports = repository.find_by_patient(
                db,
                patient_id,
            )

            return [
                {
                    "id": report.id,
                    "title": report.title,
                    "type": report.report_type,
                    "summary": report.ai_summary,
                    "status": report.processing_status,
                    "uploaded_at": str(report.uploaded_at),
                }
                for report in reports
            ]

        finally:
            db.close()

    return get_reports