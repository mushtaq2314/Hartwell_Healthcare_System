from .image_extractor import ImageExtractor
from .ocr_service import OCRService, OCROutput
from .pdf_parser import PDFParser


class DocumentReader:
    """
    Reads any uploaded report.

    Phase 1

        Digital PDF
            ↓
        PDF Parser

        Scanned PDF
            ↓
        Image Extractor
            ↓
        OCR
    """

    @staticmethod
    def read_document(pdf_path: str) -> str | list[OCROutput]:
        text = PDFParser.extract_text(pdf_path)

        if len(text.strip()) > 100:
            print("✓ Digital PDF detected.")
            print("Detected text:", text)
            return text

        print("No digital text found.")
        print("Running OCR...")

        images = ImageExtractor.extract_images(pdf_path)
        ocr = OCRService()

        return ocr.extract_text(images)
