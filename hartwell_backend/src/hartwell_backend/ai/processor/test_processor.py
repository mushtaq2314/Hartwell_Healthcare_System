from hartwell_backend.database import SessionLocal
from hartwell_backend.ai.processor.report_processor import ReportProcessor

# Move this file to src/hartwell_backend before running
db = SessionLocal()

ReportProcessor().process(
    db=db,
    report_id=1,
)

db.close()

print("Done.")