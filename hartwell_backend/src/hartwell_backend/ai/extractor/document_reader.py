from pathlib import Path
from pydantic import BaseModel

from .image_extractor import ImageExtractor
from .ocr_service import OCRService
from .pdf_parser import PDFParser


class DocumentReaderOutput(BaseModel):
    page_number: int | None = None
    text: str | None = None
    image_path: Path | None = None

class DocumentReader:
    """
    Reads medical reports from PDF/JPG/JPEG/PNG.

    PDF:
        Digital text -> store text
        Insufficient text -> render page -> OCR
        Insufficient OCR -> store image path

    Image:
        OCR -> store text
        Insufficient OCR -> store image path
    """

    TEXT_THRESHOLD = 100
    SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

    @classmethod
    def _has_enough_text(cls, text: str | None) -> bool:
        return len(" ".join(text.split())) >= cls.TEXT_THRESHOLD if text else False

    @classmethod
    def read_document(cls, document_path: Path) -> list[DocumentReaderOutput]:
        
        if not document_path.exists():
            raise FileNotFoundError(f"Document not found: {str(document_path)}")

        suffix = document_path.suffix.lower()
        
        if suffix == ".pdf":
            return cls._read_pdf(document_path)
        elif suffix in cls.SUPPORTED_IMAGE_EXTENSIONS:
            result = cls._read_image(document_path)
            result.page_number = 1
            return [result]
        else:
            raise ValueError(f"Unsupported document type: {suffix}. Supported types: PDF, JPG, JPEG, PNG.")

    @classmethod
    def _read_pdf(cls, pdf_path: Path) -> list[DocumentReaderOutput]:
        results = []
        page_count = PDFParser.get_page_count(str(pdf_path))

        for page_number in range(page_count):
            page = page_number + 1
            print(f"Processing page {page}/{page_count}")

            text = PDFParser.extract_page_text(str(pdf_path), page_number)
            if cls._has_enough_text(text):
                results.append(DocumentReaderOutput(page_number=page, text=text))
                continue

            print(f"Page {page}: insufficient digital text, running OCR...")
            image_path = ImageExtractor.extract_page(str(pdf_path), page_number)
            image_reader_result = cls._read_image(image_path)
            image_reader_result.page_number = page
            results.append(image_reader_result)

        return results

    @classmethod
    def _read_image(cls, image_path: Path) -> DocumentReaderOutput:
        ocr = OCRService()
        text = ocr.extract_text(image_path)
        if cls._has_enough_text(text):
            return DocumentReaderOutput(text=text)

        return DocumentReaderOutput(image_path=image_path)
