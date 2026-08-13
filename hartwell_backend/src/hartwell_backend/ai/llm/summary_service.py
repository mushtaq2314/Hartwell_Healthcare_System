from .ollama_client import OllamaClient
from hartwell_backend.ai.prompts.summary_prompt import SYSTEM_PROMPT

class SummaryService:
    def __init__(self):
        self.client = OllamaClient()

    def generate_summary_from_report(self, report_paths: list[str]):
        prompt = """You are given a medical report, analyse it and generate a summary.
Output exactly in this format:
Summary:
...

Abnormal Findings:
- ...

Normal Findings:
- ...

Notes:
....
"""
        report_images = []
        import base64
        for path in report_paths:
            with open(path, 'rb') as img_file:
                img_data = img_file.read()
            
            # Convert image to base64 for Ollama
            img_base64 = base64.b64encode(img_data).decode('utf-8')
            report_images.append(img_base64)
            
        return self.client.generate(SYSTEM_PROMPT, prompt, report_images)
        
    
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
