from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id")
    )

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id"),
        nullable=True,
    )

    title: Mapped[str] = mapped_column(
        String(255)
    )

    report_type: Mapped[str] = mapped_column(
        String(100)
    )

    file_name: Mapped[str] = mapped_column(
        String(255)
    )

    file_path: Mapped[str] = mapped_column(
        String(500)
    )

    extracted_text: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    ai_summary: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    processing_status: Mapped[str] = mapped_column(
        String(50),
        default="Pending",
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    patient = relationship(
        "Patient",
        back_populates="reports",
    )

    visit = relationship(
        "Visit",
        back_populates="reports",
    )