from pathlib import Path

import fitz


class PDFParser:
    """
    Reads digital PDFs.
    Does NOT perform OCR.
    Returns extracted text.
    """
    @staticmethod
    def extract_text(pdf_path: str) -> str:
        document = fitz.open(pdf_path)
        pages = []

        for page in document:
            text = page.get_text().strip()
            if text:
                pages.append(text)

        document.close()

        return "\n\n".join(pages)