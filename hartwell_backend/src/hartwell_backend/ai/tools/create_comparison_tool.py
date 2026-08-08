from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import ReportRepository


repository = ReportRepository()


def create_comparison_tool():
    @tool
    def compare_reports(report_id_1: int, report_id_2: int):
        """
        Returns two reports for AI comparison.
        """
        print("compare_reports tool called")
        db = SessionLocal()

        try:
            report1 = repository.find_by_id(
                db,
                report_id_1,
            )

            report2 = repository.find_by_id(
                db,
                report_id_2,
            )

            if report1 is None or report2 is None:
                return {"error": "One or more reports not found."}

            return {
                "report_1": {
                    "id": report1.id,
                    "title": report1.title,
                    "summary": report1.ai_summary,
                    "text": report1.extracted_text,
                },
                "report_2": {
                    "id": report2.id,
                    "title": report2.title,
                    "summary": report2.ai_summary,
                    "text": report2.extracted_text,
                },
            }

        finally:
            db.close()

    return compare_reports