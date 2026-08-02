from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(primary_key=True)

    generic_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    brand_name: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    drug_class: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    prescriptions = relationship(
        "Prescription",
        back_populates="medication",
    )