from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=True,
    )

    doctors = relationship(
        "Doctor",
        back_populates="department",
    )