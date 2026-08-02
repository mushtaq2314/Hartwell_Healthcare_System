from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True)

    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))

    dob: Mapped[date] = mapped_column(Date)

    gender: Mapped[str] = mapped_column(String(20))

    email: Mapped[str] = mapped_column(String(255), nullable=False)

    phone: Mapped[str] = mapped_column(String(20))

    blood_group: Mapped[str] = mapped_column(String(10))

    address: Mapped[str] = mapped_column(String(255))

    emergency_contact: Mapped[str] = mapped_column(String(20))

    allergies: Mapped[str] = mapped_column(String(500))

    chronic_conditions: Mapped[str] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
    )

    # Relationships

    appointments = relationship(
        "Appointment",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    visits = relationship(
        "Visit",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    reports = relationship(
        "Report",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    timeline_events = relationship(
        "TimelineEvent",
        back_populates="patient",
        cascade="all, delete-orphan",
    )