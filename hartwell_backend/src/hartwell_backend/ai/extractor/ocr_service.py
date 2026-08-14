from pathlib import Path
from pydantic import BaseModel
import easyocr

class OCROutput(BaseModel):
    is_medical_image: bool
    image_path: Path
    extracted_text: str

class OCRService:
    """
    OCR service using EasyOCR.

    Input:
        List of page images.

    Output:
        Extracted text.
    """

    _reader = None

    def __init__(self):
        if OCRService._reader is None:
            print("Loading EasyOCR model...")

            OCRService._reader = easyocr.Reader(
                ["en"],
                gpu=False,
            )

            print("EasyOCR loaded.")

    def extract_text(self, image_paths: list[Path]) -> list[OCROutput]:
        pages = []

        for idx, image_path in enumerate(image_paths):
            print(f"OCR -> {image_path.name}")

            result = OCRService._reader.readtext(
                str(image_path),
                detail=0,
                paragraph=True,
            )

            page_text = "\n".join(result)
            pages.append(OCROutput(is_medical_image=len(page_text.strip()) < 100, image_path=image_path, extracted_text=page_text))

        return pages
