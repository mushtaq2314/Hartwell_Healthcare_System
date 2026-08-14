import base64

from .ollama_client import OllamaClient
from hartwell_backend.ai.prompts import build_summarizer_prompt
from pathlib import Path

class SummaryService:
    def __init__(self):
        self.client = OllamaClient()
  
    def generate_summary(self, extracted_text: str, image_paths: list[Path]) -> str:
        prompt = build_summarizer_prompt(extracted_text, len(image_paths))   
        b64_images = []
        
        if image_paths:
            for image_path in image_paths:
                with open(str(image_path), "rb") as img_file:
                    print("Converting medical image to base64")
                    img_data = img_file.read()
                    img_base64 = base64.b64encode(img_data).decode('utf-8')
                    b64_images.append(img_base64)
        print("Sending prompt:")
        print(prompt)
        return self.client.generate(
            prompt,
            b64_images
        )
