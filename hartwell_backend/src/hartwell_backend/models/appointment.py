from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id")
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctors.id")
    )

    appointment_time: Mapped[datetime] = mapped_column(
        DateTime
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Scheduled",
    )

    reason: Mapped[str] = mapped_column(
        String(255)
    )

    notes: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    patient = relationship(
        "Patient",
        back_populates="appointments",
    )

    doctor = relationship(
        "Doctor",
        back_populates="appointments",
    )

    visit = relationship(
        "Visit",
        back_populates="appointment",
        uselist=False,
    )