from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Visit(Base):
    __tablename__ = "visits"

    id: Mapped[int] = mapped_column(primary_key=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id")
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctors.id")
    )

    appointment_id: Mapped[int] = mapped_column(
        ForeignKey("appointments.id"),
        nullable=True,
    )

    visit_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    chief_complaint: Mapped[str] = mapped_column(
        Text
    )

    diagnosis: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    clinical_notes: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    follow_up_required: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    follow_up_date: Mapped[date] = mapped_column(
        Date,
        nullable=True,
    )

    patient = relationship(
        "Patient",
        back_populates="visits",
    )

    doctor = relationship(
        "Doctor",
        back_populates="visits",
    )

    appointment = relationship(
        "Appointment",
        back_populates="visit",
    )

    reports = relationship(
        "Report",
        back_populates="visit",
        cascade="all, delete-orphan",
    )

    prescriptions = relationship(
        "Prescription",
        back_populates="visit",
        cascade="all, delete-orphan",
    )

    timeline_events = relationship(
        "TimelineEvent",
        back_populates="visit",
        cascade="all, delete-orphan",
    )