from hartwell_backend.core.paths import REPORT_DIR
from hartwell_backend.ai.extractor import DocumentReader

pdf = REPORT_DIR / "patient_1" / "img-pdf-report.pdf"

text = DocumentReader.read_document(str(pdf))

print(text)

from hartwell_backend.ai.llm import SummaryService

print("Generating summary...")
summaryService = SummaryService()

summary = summaryService.generate_summary(text)

print("Generated summary:", summary)