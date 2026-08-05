from pathlib import Path

import easyocr


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

    def extract_text(self, image_paths: list[Path]) -> str:
        pages = []

        for image_path in image_paths:
            print(f"OCR -> {image_path.name}")

            result = OCRService._reader.readtext(
                str(image_path),
                detail=0,
                paragraph=True,
            )

            page_text = "\n".join(result)
            pages.append(page_text)

        return "\n\n".join(pages)
