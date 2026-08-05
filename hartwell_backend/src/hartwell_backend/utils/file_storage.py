from datetime import datetime
from pathlib import Path
import shutil

from fastapi import UploadFile

REPORT_STORAGE = Path("storage/reports")


def save_report_file(
    patient_id: int,
    file: UploadFile,
) -> tuple[str, str]:

    patient_folder = REPORT_STORAGE / f"patient_{patient_id}"
    patient_folder.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = f"{timestamp}_{file.filename}"

    filepath = patient_folder / filename

    with filepath.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filename, str(filepath)