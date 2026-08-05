from pathlib import Path

import fitz


class ImageExtractor:
    """
    Converts every page of a PDF into PNG images.
    Output:
        storage/images/report_<report_id>/page_1.png
    """
    @staticmethod
    def extract_images(pdf_path: str) -> list[Path]:
        pdf_path = Path(pdf_path)
        report_name = pdf_path.stem

        output_dir = (pdf_path.parent.parent.parent/ "images"/ report_name)
        output_dir.mkdir(parents=True, exist_ok=True)

        document = fitz.open(pdf_path)
        image_paths = []

        for page_number in range(len(document)):
            page = document.load_page(page_number)
            pix = page.get_pixmap(matrix=fitz.Matrix(4, 4))
            image_path = (output_dir/ f"page_{page_number + 1}.png")

            pix.save(image_path)
            image_paths.append(image_path)

        document.close()
        return image_paths