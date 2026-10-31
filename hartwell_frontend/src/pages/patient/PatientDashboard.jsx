import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    uploadPatientReport,
    getPatient,
    getPatientAppointments,
    getPatientReports,
    // getPatientPrescriptions,
    getPatientVisits,
    getPatientTimeline,
    makeAppointment,
    cancelAppointment,
} from "../../services/patientService";

import PatientAIChat from "./PatientAIChat";
import { getAllDoctors } from "../../services/commonService";

export default function PatientDashboard() {
    const [patient, setPatient] = useState(null);

    const [appointments, setAppointments] = useState([]);
    const [reports, setReports] = useState([]);
    // const [prescriptions, setPrescriptions] = useState([]);
    const [visits, setVisits] = useState([]);
    const [timeline, setTimeline] = useState([]);

    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);

    useEffect(() => {
        async function loadDoctors() {
            try {
                const data = await getAllDoctors();

                console.log("Doctors loaded:");
                console.log(data);

                setDoctors(data);
            } catch (error) {
                console.error("Failed to load doctors:", error);
                setDoctors([]);
            } finally {
                setLoadingDoctors(false);
            }
        }

        loadDoctors();
    }, []);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeSection, setActiveSection] = useState("overview");

    const [showChat, setShowChat] = useState(false);
    const [showUploadReport, setShowUploadReport] = useState(false);
    const [showAppointment, setShowAppointment] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const patientId = localStorage.getItem("user_id");

            if (!patientId) {
                throw new Error(
                    "Patient information is missing. Please log in again."
                );
            }

            /*
             * Load the dashboard data.
             *
             * We keep these requests together so refreshing the dashboard
             * refreshes all sections.
             */
            const [
                patientData,
                appointmentData,
                reportData,
                // prescriptionData,
                visitData,
                timelineData,
            ] = await Promise.all([
                getPatient(patientId),
                getPatientAppointments(patientId),
                getPatientReports(patientId),
                // getPatientPrescriptions(patientId),
                getPatientVisits(patientId),
                getPatientTimeline(patientId),
            ]);

            setPatient(patientData);

            setAppointments(normalizeList(appointmentData));
            setReports(normalizeList(reportData));
            // setPrescriptions(normalizeList(prescriptionData));
            setVisits(normalizeList(visitData));
            setTimeline(normalizeList(timelineData));
        } catch (err) {
            setError(
                err.message || "Failed to load your healthcare dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] bg-gray-50 p-6">
                <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-700">
                        Unable to load dashboard
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!patient) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Patient Dashboard
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold text-gray-800">
                                Welcome back,{" "}
                                {patient.first_name || "Patient"}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Here's an overview of your healthcare information.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={loadDashboard}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Refresh
                            </button>

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                                {patient.first_name?.charAt(0)}
                                {patient.last_name?.charAt(0)}
                            </div>

                        </div>

                    </div>

                </div>
            </div>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* =================================================
                    TABS
                ================================================== */}

                <div className="overflow-x-auto">

                    <div className="flex min-w-max gap-2 rounded-xl border border-gray-200 bg-white p-2">

                        <NavButton
                            active={activeSection === "overview"}
                            onClick={() => setActiveSection("overview")}
                        >
                            Overview
                        </NavButton>

                        <NavButton
                            active={activeSection === "appointments"}
                            onClick={() =>
                                setActiveSection("appointments")
                            }
                        >
                            Appointments
                        </NavButton>

                        <NavButton
                            active={activeSection === "reports"}
                            onClick={() =>
                                setActiveSection("reports")
                            }
                        >
                            Reports
                        </NavButton>

                        {/* <NavButton
                            active={activeSection === "prescriptions"}
                            onClick={() =>
                                setActiveSection("prescriptions")
                            }
                        >
                            Prescriptions
                        </NavButton> */}

                        <NavButton
                            active={activeSection === "visits"}
                            onClick={() =>
                                setActiveSection("visits")
                            }
                        >
                            Visits
                        </NavButton>

                        <NavButton
                            active={activeSection === "timeline"}
                            onClick={() =>
                                setActiveSection("timeline")
                            }
                        >
                            Timeline
                        </NavButton>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================== */}

                {activeSection === "overview" && (
                    <Overview
                        patient={patient}
                        appointments={appointments}
                        reports={reports}
                        // prescriptions={prescriptions}
                        visits={visits}
                        timeline={timeline}
                        onOpenChat={() => setShowChat(true)}
                        onNavigate={setActiveSection}
                        onMakeAppointment={() =>
                            setShowAppointment(true)
                        }
                        onUploadReport={() =>
                            setShowUploadReport(true)
                        }
                    />
                )}


                {activeSection === "appointments" && (
                    <AppointmentsSection
                        appointments={appointments}
                        doctors={doctors}
                        onMakeAppointment={() =>
                            setShowAppointment(true)
                        }
                        onRefresh={loadDashboard}
                    />
                )}


                {activeSection === "reports" && (
                    <ReportsSection
                        reports={reports}
                        onUploadReport={() =>
                            setShowUploadReport(true)
                        }
                        onOpenReport={(r) => {
                            setSelectedReport(r);
                            setShowReportModal(true);
                        }}
                    />
                )}


                {/* {activeSection === "prescriptions" && (
                    <PrescriptionsSection
                        prescriptions={prescriptions}
                    />
                )} */}


                {activeSection === "visits" && (
                    <VisitsSection
                        visits={visits}
                        onOpenVisit={(v) => {
                            setSelectedVisit(v);
                            setShowVisitModal(true);
                        }}
                    />
                )}


                {activeSection === "timeline" && (
                    <TimelineSection
                        timeline={timeline}
                    />
                )}

            </main>


            {/* =====================================================
                AI CHAT
            ====================================================== */}

            <PatientAIChat
                open={showChat}
                onClose={() => setShowChat(false)}
            />


            {/* =====================================================
                UPLOAD REPORT
            ====================================================== */}

            {showUploadReport && (
                <UploadReportModal
                    onClose={() => setShowUploadReport(false)}
                    onUploaded={async () => {
                        setShowUploadReport(false);
                        await loadDashboard();
                        setActiveSection("reports");
                    }}
                />
            )}

            {showVisitModal && (
                <VisitModal
                    visit={selectedVisit}
                    onClose={() => setShowVisitModal(false)}
                />
            )}

            {showReportModal && (
                <ReportModal
                    report={selectedReport}
                    onClose={() => setShowReportModal(false)}
                />
            )}

            {/* Floating AI Chat button */}
            {!showChat && (
                <button
                    onClick={() => setShowChat(true)}
                    aria-label="Open AI Chat"
                    className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg hover:bg-blue-600"
                >
                    <ChatIcon />
                </button>
            )}


            {/* =====================================================
                MAKE APPOINTMENT
            ====================================================== */}

            {showAppointment && (
                <AppointmentModal
                    onClose={() => setShowAppointment(false)}
                    doctors={doctors}
                    onSubmit={async () => {
                        setShowAppointment(false);
                        await loadDashboard();
                        setActiveSection("appointments");
                    }}
                />
            )}

        </div>
    );
}


/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
    patient,
    appointments,
    reports,
    // prescriptions,
    visits,
    timeline,
    onOpenChat,
    onNavigate,
    onMakeAppointment,
    onUploadReport,
}) {
    return (
        <div className="mt-6 space-y-6">

            {/* PROFILE + AI */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Your profile
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-gray-800">
                                {patient.first_name}{" "}
                                {patient.last_name}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                            {patient.first_name?.charAt(0)}
                            {patient.last_name?.charAt(0)}
                        </div>

                    </div>


                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <ProfileItem
                            label="Email"
                            value={patient.email}
                        />

                        <ProfileItem
                            label="Phone"
                            value={patient.phone}
                        />

                        <ProfileItem
                            label="Date of Birth"
                            value={patient.dob}
                        />

                        <ProfileItem
                            label="Gender"
                            value={patient.gender}
                        />

                        <ProfileItem
                            label="Blood Group"
                            value={patient.blood_group}
                        />

                        <ProfileItem
                            label="Emergency Contact"
                            value={patient.emergency_contact}
                        />

                    </div>

                </div>


                {/* AI ASSISTANT */}

                <div className="rounded-xl bg-blue-500 p-6 text-white">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                        <ChatIcon />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                        AI Health Assistant
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-blue-100">
                        Ask questions about your health records,
                        reports, visits, prescriptions and more.
                    </p>

                    <button
                        onClick={onOpenChat}
                        className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                        Open Assistant
                    </button>

                </div>

            </div>


            {/* STAT CARDS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    title="Appointments"
                    value={appointments.length}
                    description="Total appointments"
                    onClick={() =>
                        onNavigate("appointments")
                    }
                    icon={<CalendarIcon />}
                />

                <StatCard
                    title="Reports"
                    value={reports.length}
                    description="Medical reports"
                    onClick={() =>
                        onNavigate("reports")
                    }
                    icon={<ReportIcon />}
                />

                {/* <StatCard
                    title="Prescriptions"
                    value={prescriptions.length}
                    description="Prescriptions"
                    onClick={() =>
                        onNavigate("prescriptions")
                    }
                    icon={<PrescriptionIcon />}
                /> */}

                <StatCard
                    title="Visits"
                    value={visits.length}
                    description="Medical visits"
                    onClick={() =>
                        onNavigate("visits")
                    }
                    icon={<VisitIcon />}
                />

            </div>


            {/* QUICK ACTIONS */}

            <div className="rounded-xl border border-gray-200 bg-white p-6">

                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Quick actions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Common healthcare actions.
                    </p>
                </div>


                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <QuickAction
                        title="Make Appointment"
                        description="Schedule a doctor visit"
                        icon={<CalendarIcon />}
                        onClick={onMakeAppointment}
                    />

                    <QuickAction
                        title="Upload Report"
                        description="Add a medical report"
                        icon={<ReportIcon />}
                        onClick={onUploadReport}
                    />

                    <QuickAction
                        title="My Reports"
                        description="View medical reports"
                        icon={<ReportIcon />}
                        onClick={() =>
                            onNavigate("reports")
                        }
                    />

                    <QuickAction
                        title="Medical History"
                        description="View your timeline"
                        icon={<VisitIcon />}
                        onClick={() =>
                            onNavigate("timeline")
                        }
                    />

                </div>

            </div>


            {/* HEALTH INFORMATION */}

            <div className="rounded-xl border border-gray-200 bg-white p-6">

                <h2 className="text-lg font-semibold text-gray-800">
                    Health information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Important information recorded in your profile.
                </p>


                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

                    <HealthInformation
                        title="Allergies"
                        value={patient.allergies}
                    />

                    <HealthInformation
                        title="Chronic Conditions"
                        value={patient.chronic_conditions}
                    />

                    <HealthInformation
                        title="Address"
                        value={patient.address}
                    />

                </div>

            </div>


            {/* RECENT ACTIVITY */}

            <div className="rounded-xl border border-gray-200 bg-white p-6">

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Recent activity
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Recent events from your medical history.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            onNavigate("timeline")
                        }
                        className="text-sm font-medium text-blue-500 hover:text-blue-600"
                    >
                        View all
                    </button>

                </div>

                <TimelineList
                    timeline={timeline.slice(0, 5)}
                />

            </div>

        </div>
    );
}


/* =========================================================
   APPOINTMENTS
========================================================= */

function AppointmentsSection({
    appointments,
    onMakeAppointment,
    doctors = [],
    onRefresh = null,
}) {
    const [cancellingId, setCancellingId] = useState(null);

    async function handleCancel(appointment) {
        const id = appointment.id ?? appointment.appointment_id;

        if (!id) return;

        if (!confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            setCancellingId(id);
            await cancelAppointment(id);
            if (typeof onRefresh === "function") {
                await onRefresh();
            } else {
                window.location.reload();
            }
        } catch (err) {
            alert(err.message || "Failed to cancel appointment.");
        } finally {
            setCancellingId(null);
        }
    }
    return (
        <Section
            title="Appointments"
            description="Manage your upcoming and previous appointments."
            action={
                <button
                    onClick={onMakeAppointment}
                    className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
                >
                    + Make Appointment
                </button>
            }
        >

            {appointments.length === 0 ? (
                <EmptyState
                    title="No appointments"
                    message="You don't have any appointments yet."
                    action={
                        <button
                            onClick={onMakeAppointment}
                            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                            Make an Appointment
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {appointments.map((appointment, index) => (

                        <div
                            key={
                                appointment.id ??
                                appointment.appointment_id ??
                                index
                            }
                            className="rounded-xl border border-gray-200 bg-white p-4"
                        >

                            <div className="flex flex-col gap-3">

                                <div>
                                    <p className="font-medium text-gray-800">
                                        {appointment.title ||
                                            appointment.reason ||
                                            "Medical Appointment"}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(appointment.appointment_time)}
                                    </p>

                                    {appointment.doctor_id && (
                                        (() => {
                                            const doc = doctors.find(
                                                (d) => d.id === appointment.doctor_id || d.doctor_id === appointment.doctor_id
                                            );

                                            return (
                                                <p className="mt-1 text-xs text-gray-400">
                                                    Doctor: {doc ? `${doc.first_name || ''} ${doc.last_name || ''}`.trim() : 'Unknown'}
                                                </p>
                                            );
                                        })()
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <StatusBadge
                                        status={
                                            appointment.status ||
                                            "Scheduled"
                                        }
                                    />

                                    {(function () {
                                        const normalized = String(appointment.status || "").toLowerCase();
                                        const canCancel = /pending|scheduled|confirmed/.test(normalized);
                                        const id = appointment.id ?? appointment.appointment_id;

                                        if (!canCancel || !id) return null;

                                        return (
                                            <button
                                                onClick={() => handleCancel(appointment)}
                                                disabled={cancellingId === id}
                                                className="ml-2 rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                                            >
                                                {cancellingId === id ? "Cancelling..." : "Cancel"}
                                            </button>
                                        );
                                    })()}
                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </Section>
    );
}


/* =========================================================
   REPORTS
========================================================= */

function ReportsSection({
    reports,
    onUploadReport,
    onOpenReport,
}) {
    return (
        <Section
            title="Medical Reports"
            description="View your uploaded medical reports and AI summaries."
            action={
                <button
                    onClick={onUploadReport}
                    className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
                >
                    + Upload Report
                </button>
            }
        >

            {reports.length === 0 ? (
                <EmptyState
                    title="No reports"
                    message="No medical reports are available."
                    action={
                        <button
                            onClick={onUploadReport}
                            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                            Upload a Report
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {reports.map((report, index) => (

                        <div
                            key={
                                report.id ??
                                report.report_id ??
                                index
                            }
                            className="rounded-xl border border-gray-200 p-5 m-2"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <h3 className="font-medium text-gray-800">
                                        {report.title ||
                                            report.name ||
                                            "Medical Report"}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {report.report_type ||
                                            "Medical Report"}
                                    </p>

                                </div>

                                <StatusBadge
                                    status={
                                        report.processing_status ||
                                        "Available"
                                    }
                                />

                            </div>


                            {report.ai_summary && (
                                <div className="mt-4 rounded-lg bg-gray-50 p-4">

                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        AI Summary
                                    </p>

                                    <div className="mt-2 line-clamp-4 text-sm leading-6 text-gray-600 prose max-w-full">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} children={report.ai_summary} />
                                    </div>

                                </div>
                            )}


                            {report.uploaded_at && (
                                <p className="mt-4 text-xs text-gray-400">
                                    {formatDate(report.uploaded_at)}
                                </p>
                            )}

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => onOpenReport && onOpenReport(report)}
                                    className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                >
                                    Open
                                </button>

                                {report.file_path && (
                                    <a
                                        href={report.file_path}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Download
                                    </a>
                                )}
                            </div>

                        </div>

                    ))}

                </div>
            )}

        </Section>
    );
}


/* =========================================================
   PRESCRIPTIONS
========================================================= */

function PrescriptionsSection({
    prescriptions,
}) {
    return (
        <Section
            title="Prescriptions"
            description="Your current and previous prescriptions."
        >

            {prescriptions.length === 0 ? (
                <EmptyState
                    title="No prescriptions"
                    message="No prescriptions are currently available."
                />
            ) : (
                <div className="divide-y divide-gray-100">

                    {prescriptions.map(
                        (prescription, index) => (

                            <div
                                key={
                                    prescription.id ??
                                    prescription.prescription_id ??
                                    index
                                }
                                className="p-5"
                            >

                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                                    <div>

                                        <h3 className="font-medium text-gray-800">
                                            {prescription.medication_name ||
                                                prescription.medication ||
                                                prescription.name ||
                                                "Prescription"}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {prescription.dosage ||
                                                "Dosage not specified"}
                                        </p>

                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {prescription.frequency ||
                                            "Frequency not specified"}
                                    </div>

                                </div>

                                {prescription.instructions && (
                                    <p className="mt-3 text-sm text-gray-500">
                                        {prescription.instructions}
                                    </p>
                                )}

                            </div>

                        )
                    )}

                </div>
            )}

        </Section>
    );
}


/* =========================================================
   VISITS
========================================================= */

function VisitsSection({
    visits,
    onOpenVisit,
}) {
    return (
        <Section
            title="Medical Visits"
            description="Your previous medical visits."
        >

            {visits.length === 0 ? (
                <EmptyState
                    title="No visits"
                    message="No medical visits are available."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {visits.map((visit, index) => (

                        <div
                            key={
                                visit.id ??
                                visit.visit_id ??
                                index
                            }
                            className="rounded-xl border border-gray-200 p-5 m-2"
                        >

                            <div className="flex flex-col gap-2">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h3 className="font-medium text-gray-800">
                                            {visit.title || visit.reason || "Medical Visit"}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {formatDate(visit.visit_date)}
                                        </p>

                                    </div>

                                    {visit.status && (
                                        <StatusBadge
                                            status={visit.status}
                                        />
                                    )}

                                </div>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => onOpenVisit && onOpenVisit(visit)}
                                        className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                    >
                                        Open
                                    </button>
                                </div>

                                {visit.notes && (
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        {visit.notes}
                                    </p>
                                )}

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </Section>
    );
}


/* =========================================================
   TIMELINE
========================================================= */

function TimelineSection({
    timeline,
}) {
    return (
        <Section
            title="Medical Timeline"
            description="A chronological view of your healthcare activity."
        >

            {timeline.length === 0 ? (
                <EmptyState
                    title="No timeline events"
                    message="Your medical timeline is currently empty."
                />
            ) : (
                <TimelineList
                    timeline={timeline}
                />
            )}

        </Section>
    );
}


function TimelineList({
    timeline,
}) {
    if (!timeline.length) {
        return (
            <EmptyState
                title="No recent activity"
                message="There are no timeline events to display."
            />
        );
    }

    return (
        <div className="mt-6">

            {timeline.map((event, index) => (

                <div
                    key={
                        event.id ??
                        event.timeline_event_id ??
                        index
                    }
                    className="relative flex gap-4 pb-6"
                >

                    {index !== timeline.length - 1 && (
                        <div className="absolute left-[9px] top-6 h-full w-px bg-gray-200" />
                    )}

                    <div className="relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-white bg-blue-500 shadow-sm" />

                    <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                            <h3 className="font-medium text-gray-800">
                                {event.title ||
                                    event.event_type ||
                                    event.type ||
                                    "Medical Event"}
                            </h3>

                            <span className="text-xs text-gray-400">
                                {formatDate(
                                    event.event_time
                                )}
                            </span>

                        </div>

                        {(event.description ||
                            event.details) && (
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {event.description ||
                                        event.details}
                                </p>
                            )}

                    </div>

                </div>

            ))}

        </div>
    );
}


/* =========================================================
   UPLOAD REPORT MODAL
========================================================= */

function UploadReportModal({
    onClose,
    onUploaded,
}) {
    const [title, setTitle] = useState("");
    const [reportType, setReportType] = useState("");
    const [file, setFile] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!file) {
            setError("Please select a report file.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            let response = await uploadPatientReport(title, reportType, file);

            let data = null;

            try {
                data = await response.json();
            } catch {
                // No JSON response.
            }

            if (!response.ok) {
                throw new Error(
                    data?.detail ||
                    "Failed to upload report."
                );
            }

            await onUploaded();
        } catch (err) {
            setError(
                err.message ||
                "Failed to upload report."
            );
        } finally {
            setUploading(false);
        }
    }

    return (
        <Modal onClose={onClose}>

            <h2 className="text-xl font-semibold text-gray-800">
                Upload Medical Report
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Upload a medical report to add it to your healthcare records.
            </p>


            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}


            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
            >

                <Field
                    label="Report Title"
                    value={title}
                    onChange={setTitle}
                    placeholder="Blood Report"
                    required
                />


                <Field
                    label="Report Type"
                    value={reportType}
                    onChange={setReportType}
                    placeholder="CBC, MRI, X-Ray..."
                    required
                />


                <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Report File
                    </label>

                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                            setFile(
                                e.target.files?.[0] || null
                            )
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                        required
                    />

                    <p className="mt-2 text-xs text-gray-400">
                        PDF, PNG or JPG files are supported.
                    </p>

                </div>


                <div className="flex justify-end gap-3 pt-2">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload Report"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


/* =========================================================
   APPOINTMENT MODAL
========================================================= */

function AppointmentModal({
    onClose,
    onSubmit,
    doctors = [],
}) {
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const nextMinute = new Date(now.getTime() + 60_000);
    const minimumTime = `${String(nextMinute.getHours()).padStart(2, "0")}:${String(nextMinute.getMinutes()).padStart(2, "0")}`;

    function handleSubmit(e) {
        e.preventDefault();

        if (!doctor) {
            setError("Please select a doctor.");
            return;
        }

        if (!date || !time) {
            setError("Please select a date and time.");
            return;
        }

        if (new Date(`${date}T${time}`) < new Date()) {
            setError("Please select a present or future date and time.");
            return;
        }

        try {
            setError("");

            const dateTime = new Date(
                `${date}T${time}`
            ).toISOString();

            makeAppointment(
                doctor,
                reason,
                dateTime
            );
        } catch (err) {
            setError("Invalid date or time.");
        }
    }

    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800">
                Make an Appointment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Request an appointment with your doctor.
            </p>

            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
            >
                {/* Doctor */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Doctor
                    </label>

                    <select
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">
                            Select a doctor
                        </option>

                        {doctors.map((doc) => (
                            <option
                                key={doc.id}
                                value={doc.id}
                            >
                                Dr. {doc.first_name} — {doc.department} —{" "}
                                {doc.qualification} —{" "}
                                {doc.experience_years} years experience
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <Field
                    label="Preferred Date"
                    type="date"
                    value={date}
                    onChange={setDate}
                    min={today}
                    required
                />

                {/* Time */}
                <Field
                    label="Preferred Time"
                    type="time"
                    value={time}
                    onChange={setTime}
                    min={date === today ? minimumTime : undefined}
                    required
                />

                {/* Reason */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Reason
                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) =>
                            setReason(e.target.value)
                        }
                        rows={4}
                        placeholder="Briefly describe the reason for your appointment..."
                        className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        Request Appointment
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function Section({
    title,
    description,
    action,
    children,
}) {
    return (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h2 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}

                </div>

                {action}

            </div>

            <div>
                {children}
            </div>

        </div>
    );
}


function NavButton({
    active,
    onClick,
    children,
}) {
    return (
        <button
            onClick={onClick}
            className={
                active
                    ? "rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white"
                    : "rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            }
        >
            {children}
        </button>
    );
}


function StatCard({
    title,
    value,
    description,
    onClick,
    icon,
}) {
    return (
        <button
            onClick={onClick}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow"
        >

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-gray-800">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {description}
                    </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {icon}
                </div>

            </div>

        </button>
    );
}


function ProfileItem({
    label,
    value,
}) {
    return (
        <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {value || "—"}
            </div>

        </div>
    );
}


function HealthInformation({
    title,
    value,
}) {
    return (
        <div>

            <p className="text-sm font-medium text-gray-700">
                {title}
            </p>

            <div className="mt-2 min-h-[70px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">
                {value || "No information recorded."}
            </div>

        </div>
    );
}


function QuickAction({
    title,
    description,
    icon,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
        >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-sm font-medium text-gray-800">
                    {title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {description}
                </p>

            </div>

            <svg
                className="ml-auto h-5 w-5 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                />
            </svg>

        </button>
    );
}


function EmptyState({
    title,
    message,
    action,
}) {
    return (
        <div className="p-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <ReportIcon />
            </div>

            <h3 className="mt-4 font-medium text-gray-800">
                {title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                {message}
            </p>

            {action}

        </div>
    );
}


function StatusBadge({
    status,
}) {
    const normalized = String(status).toLowerCase();

    let classes =
        "bg-gray-100 text-gray-600";

    if (
        normalized.includes("complete") ||
        normalized.includes("approved") ||
        normalized.includes("available") ||
        normalized.includes("confirmed")
    ) {
        classes =
            "bg-green-50 text-green-600";
    } else if (
        normalized.includes("pending") ||
        normalized.includes("scheduled") ||
        normalized.includes("processing")
    ) {
        classes =
            "bg-yellow-50 text-yellow-600";
    } else if (
        normalized.includes("cancel") ||
        normalized.includes("failed") ||
        normalized.includes("rejected")
    ) {
        classes =
            "bg-red-50 text-red-600";
    }

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classes}`}
        >
            {status}
        </span>
    );
}


function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    min,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value ?? ""}
                placeholder={placeholder}
                required={required}
                min={min}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>
    );
}


function Modal({
    children,
    onClose,
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >

            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

                {children}

            </div>

        </div>
    );
}


/* =========================================================
   HELPERS
========================================================= */

function normalizeList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    return data?.items || [];
}


function formatDate(value) {
    if (!value) {
        return "Date not available";
    }

    try {
        const date = new Date(value);

        const time = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        const formattedDate = date.toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        return `${time} on ${formattedDate}`;
    } catch {
        return String(value);
    }
}


/* =========================================================
   ICONS
========================================================= */

function CalendarIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
            />
        </svg>
    );
}


function ReportIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
            />
        </svg>
    );
}


function PrescriptionIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm3 4h4m-6 4h8m-8 4h5"
            />
        </svg>
    );
}


function VisitIcon() {
    return (
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
        </svg>
    );
}


function ChatIcon() {
    return (
        <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.88 9.88 0 01-4.255-.938L3 20l1.5-4.5A7.78 7.78 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
        </svg>
    );
}


function VisitModal({ visit, onClose }) {
    if (!visit) return null;

    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800">Visit Details</h2>

            <div className="mt-4 space-y-3">
                <div>
                    <p className="text-sm text-gray-500">Visit Date</p>
                    <p className="text-sm text-gray-800">{formatDate(visit.visit_date)}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Chief Complaint</p>
                    <p className="text-sm text-gray-800">{visit.chief_complaint || '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p className="text-sm text-gray-800">{visit.diagnosis || '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Clinical Notes</p>
                    <p className="text-sm text-gray-800">{visit.clinical_notes || '—'}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Follow-up Required</p>
                    <p className="text-sm text-gray-800">{visit.follow_up_required ? 'Yes' : 'No'}</p>
                </div>

                {visit.follow_up_date && (
                    <div>
                        <p className="text-sm text-gray-500">Follow-up Date</p>
                        <p className="text-sm text-gray-800">{formatDate(visit.follow_up_date)}</p>
                    </div>
                )}

            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}


function ReportModal({ report, onClose }) {
    if (!report) return null;

    return (
        <Modal onClose={onClose}>
            <div className="flex max-h-[90vh] flex-col rounded-2xl bg-white p-4">
                {/* Header */}
                <div className="shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Report Details
                    </h2>
                </div>

                {/* Scrollable content */}
                <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-2 space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="text-sm text-gray-800">
                            {report.title || '—'}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="text-sm text-gray-800">
                            {report.report_type || '—'}
                        </p>
                    </div>

                    {report.ai_summary && (
                        <div>
                            <p className="text-sm text-gray-500">AI Summary</p>
                            <div className="mt-2 text-sm text-gray-800 prose max-w-full border border-gray-200 px-4 rounded-lg bg-blue-50">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} children={report.ai_summary} />
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-500">
                            Processing Status
                        </p>
                        <p className="text-sm text-gray-800">
                            {report.processing_status || '—'}
                        </p>
                    </div>

                    {report.uploaded_at && (
                        <div>
                            <p className="text-sm text-gray-500">Uploaded</p>
                            <p className="text-sm text-gray-800">
                                {formatDate(report.uploaded_at)}
                            </p>
                        </div>
                    )}

                    {report.file_name && (
                        <div>
                            <p className="text-sm text-gray-500">File</p>
                            <p className="text-sm text-gray-800 break-all">
                                {report.file_name}
                            </p>
                        </div>
                    )}

                    {report.file_path && (
                        <div>
                            <a
                                href={report.file_path}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Open file
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 shrink-0 flex justify-end border-t border-gray-100 pt-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}