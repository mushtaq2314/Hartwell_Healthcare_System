import fitz


class PDFParser:
    """Reads digital text from PDF pages. Does not perform OCR."""

    @staticmethod
    def get_page_count(pdf_path: str) -> int:
        document = fitz.open(pdf_path)
        try:
            return len(document)
        finally:
            document.close()

    @staticmethod
    def extract_page_text(pdf_path: str, page_number: int) -> str:
        document = fitz.open(pdf_path)
        try:
            return document.load_page(page_number).get_text().strip()
        finally:
            document.close()
