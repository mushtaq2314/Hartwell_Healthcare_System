from pathlib import Path
import easyocr


class OCRService:
    """OCR service using EasyOCR."""

    _reader = None

    def __init__(self):
        if OCRService._reader is None:
            print("Loading EasyOCR model...")
            OCRService._reader = easyocr.Reader(["en"], gpu=False)
            print("EasyOCR loaded.")

    def extract_text(self, image_path: Path) -> str:
        print(f"OCR -> {image_path.name}")
        result = OCRService._reader.readtext(str(image_path), detail=0, paragraph=True)
        return "\n".join(text.strip() for text in result if text and text.strip())
