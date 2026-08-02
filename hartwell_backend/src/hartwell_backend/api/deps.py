from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from hartwell_backend.database.session import get_db

DBSession = Annotated[Session, Depends(get_db)]