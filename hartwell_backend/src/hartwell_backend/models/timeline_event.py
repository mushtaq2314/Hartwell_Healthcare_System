from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from hartwell_backend.database import Base


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[int] = mapped_column(primary_key=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id")
    )

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id"),
        nullable=True,
    )

    event_type: Mapped[str] = mapped_column(
        String(100)
    )

    title: Mapped[str] = mapped_column(
        String(255)
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    event_time: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
    )

    patient = relationship(
        "Patient",
        back_populates="timeline_events",
    )

    visit = relationship(
        "Visit",
        back_populates="timeline_events",
    )