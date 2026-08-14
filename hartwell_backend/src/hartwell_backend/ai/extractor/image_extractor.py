from pathlib import Path
import fitz


class ImageExtractor:
    """Converts PDF pages into PNG images."""

    @staticmethod
    def _get_output_dir(pdf_path: Path) -> Path:
        output_dir = pdf_path.parent.parent.parent / "images" / pdf_path.stem
        output_dir.mkdir(parents=True, exist_ok=True)
        return output_dir

    @staticmethod
    def extract_page(pdf_path: str, page_number: int) -> Path:
        pdf_path = Path(pdf_path)
        image_path = ImageExtractor._get_output_dir(pdf_path) / f"page_{page_number + 1}.png"
        document = fitz.open(pdf_path)
        try:
            pix = document.load_page(page_number).get_pixmap(matrix=fitz.Matrix(4, 4), alpha=False)
            pix.save(image_path)
        finally:
            document.close()
        return image_path
