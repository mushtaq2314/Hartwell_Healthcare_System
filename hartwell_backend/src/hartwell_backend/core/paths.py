from pathlib import Path

# src/hartwell_backend
BASE_DIR = Path(__file__).resolve().parent.parent

# src/hartwell_backend/storage
STORAGE_DIR = BASE_DIR / "storage"

# src/hartwell_backend/storage/reports
REPORT_STORAGE = STORAGE_DIR / "reports"

# src/hartwell_backend/storage/temp
TEMP_STORAGE = STORAGE_DIR / "temp"

# Create directories automatically
REPORT_STORAGE.mkdir(parents=True, exist_ok=True)
TEMP_STORAGE.mkdir(parents=True, exist_ok=True)