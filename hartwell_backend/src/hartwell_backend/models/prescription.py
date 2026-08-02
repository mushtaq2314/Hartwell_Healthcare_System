from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id: Mapped[int] = mapped_column(primary_key=True)

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id")
    )

    medication_id: Mapped[int] = mapped_column(
        ForeignKey("medications.id")
    )

    dosage: Mapped[str] = mapped_column(
        String(100)
    )

    frequency: Mapped[str] = mapped_column(
        String(100)
    )

    duration_days: Mapped[int] = mapped_column(
        Integer
    )

    instructions: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    visit = relationship(
        "Visit",
        back_populates="prescriptions",
    )

    medication = relationship(
        "Medication",
        back_populates="prescriptions",
    )