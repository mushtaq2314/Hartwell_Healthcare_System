from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(primary_key=True)

    first_name: Mapped[str] = mapped_column(String(100))

    last_name: Mapped[str] = mapped_column(String(100))

    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id")
    )

    qualification: Mapped[str] = mapped_column(
        String(255)
    )

    specialization: Mapped[str] = mapped_column(
        String(255)
    )

    experience_years: Mapped[int] = mapped_column(
        Integer
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
    )

    phone: Mapped[str] = mapped_column(
        String(20)
    )

    license_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
    )

    department = relationship(
        "Department",
        back_populates="doctors",
    )

    appointments = relationship(
        "Appointment",
        back_populates="doctor",
    )

    visits = relationship(
        "Visit",
        back_populates="doctor",
    )