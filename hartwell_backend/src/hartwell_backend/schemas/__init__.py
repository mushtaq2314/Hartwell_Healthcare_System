from .appointment import AppointmentCreate, AppointmentResponse, AppointmentUpdate
from .department import DepartmentCreate, DepartmentResponse, DepartmentUpdate
from .doctor import DoctorCreate, DoctorResponse, DoctorUpdate
from .medication import MedicationCreate, MedicationResponse, MedicationUpdate
from .patient import PatientCreate, PatientResponse, PatientUpdate
from .prescription import PrescriptionCreate, PrescriptionResponse, PrescriptionUpdate
from .report import ReportCreate, ReportResponse, ReportUpdate, ReportCreateDB
from .timeline_event import TimelineEventCreate, TimelineEventResponse
from .visit import VisitCreate, VisitResponse, VisitUpdate
from .patient_chat import PatientChatRequest, PatientChatResponse
from .doctor_chat import DoctorChatRequest, DoctorChatResponse