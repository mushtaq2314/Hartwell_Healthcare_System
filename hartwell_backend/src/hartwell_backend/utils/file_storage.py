from datetime import datetime
from pathlib import Path
import shutil

from fastapi import UploadFile

from hartwell_backend.core.paths import REPORT_STORAGE


def save_report_file(
    patient_id: int,
    file: UploadFile,
) -> tuple[str, str]:

    patient_folder = REPORT_STORAGE / f"patient_{patient_id}"
    patient_folder.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    filename = f"{timestamp}_{file.filename}"

    # Absolute path (used for saving)
    absolute_path = patient_folder / filename

    with absolute_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Relative path (stored in DB)
    relative_path = Path(f"patient_{patient_id}") / filename

    return filename, str(relative_path)