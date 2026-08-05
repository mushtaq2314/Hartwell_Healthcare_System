from .ollama_client import OllamaClient
from hartwell_backend.ai.prompts.summary_prompt import SYSTEM_PROMPT

class SummaryService:
    def __init__(self):
        self.client = OllamaClient()

    def generate_summary(self, extracted_text: str) -> str:
        prompt = f"""You are given the extracted text of a medical report.

The extracted text may contain:
- OCR mistakes
- Page headers
- Footers
- Repeated information

Ignore obvious OCR artefacts and formatting noise.
Summarize only the medical findings.

Output exactly in this format:
Summary:
...

Abnormal Findings:
- ...

Normal Findings:
- ...

Notes:
....

Below is the extracted text\n
{extracted_text}
"""

        return self.client.generate(
            SYSTEM_PROMPT,
            prompt,
        )
