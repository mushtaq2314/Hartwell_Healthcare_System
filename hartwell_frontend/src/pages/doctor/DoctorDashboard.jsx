import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    getDoctor,
    getPatients,
    getDoctorAppointments,
    getDoctorVisits,
    getPatientReports,
    getVisitReports,
    getVisitPrescriptions,
} from "../../services/doctorService";


export default function DoctorDashboard() {
    const [doctor, setDoctor] = useState(null);

    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [visits, setVisits] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatient, setShowPatient] = useState(false);

    const [activeTab, setActiveTab] = useState("overview");

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const doctorId = localStorage.getItem("user_id");

            if (!doctorId) {
                throw new Error(
                    "Doctor information is missing. Please log in again."
                );
            }

            /*
             * Load doctor profile, doctor's appointments,
             * doctor's visits and patients.
             */
            const [
                doctorData,
                appointmentData,
                visitData,
                patientData,
            ] = await Promise.all([
                getDoctor(doctorId),
                getDoctorAppointments(doctorId),
                getDoctorVisits(doctorId),
                getPatients(),
            ]);

            setDoctor(doctorData);

            const normalizedAppointments = Array.isArray(
                appointmentData
            )
                ? appointmentData
                : appointmentData?.items || [];

            const normalizedVisits = Array.isArray(visitData)
                ? visitData
                : visitData?.items || [];

            const normalizedPatients = Array.isArray(patientData)
                ? patientData
                : patientData?.items || [];

            setAppointments(normalizedAppointments);
            setVisits(normalizedVisits);

            /*
             * IMPORTANT:
             *
             * Do NOT display every patient returned by /patients/.
             *
             * A doctor should only see patients that are connected
             * to this doctor through an appointment or visit.
             */
            const connectedPatientIds = new Set();

            normalizedAppointments.forEach((appointment) => {
                if (appointment.patient_id != null) {
                    connectedPatientIds.add(
                        Number(appointment.patient_id)
                    );
                }
            });

            normalizedVisits.forEach((visit) => {
                if (visit.patient_id != null) {
                    connectedPatientIds.add(
                        Number(visit.patient_id)
                    );
                }
            });

            const doctorPatients = normalizedPatients.filter(
                (patient) =>
                    connectedPatientIds.has(Number(patient.id))
            );

            setPatients(doctorPatients);

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load doctor dashboard."
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadDashboard();
    }, []);


    const filteredPatients = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return patients;
        }

        return patients.filter((patient) => {
            const name =
                `${patient.first_name || ""} ${patient.last_name || ""}`
                    .toLowerCase();

            return (
                name.includes(query) ||
                String(patient.id).includes(query) ||
                patient.email?.toLowerCase().includes(query) ||
                patient.phone?.toLowerCase().includes(query)
            );
        });
    }, [patients, search]);


    const upcomingAppointments = useMemo(() => {
        return appointments
            .filter(
                (appointment) =>
                    appointment.status !== "Cancelled" &&
                    appointment.status !== "Completed"
            )
            .sort(
                (a, b) =>
                    new Date(a.appointment_time) -
                    new Date(b.appointment_time)
            )
            .slice(0, 5);
    }, [appointments]);


    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading doctor dashboard...
                    </p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
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


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl p-6">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <p className="text-sm text-gray-500">
                            Doctor Dashboard
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold text-gray-800">
                            Welcome back, Dr.{" "}
                            {doctor?.first_name || "Doctor"}{" "}
                            {doctor?.last_name || ""}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your patients, appointments and
                            clinical history.
                        </p>
                    </div>

                    <button
                        onClick={loadDashboard}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Refresh
                    </button>
                </div>


                {/* =====================================================
                    DOCTOR PROFILE
                ===================================================== */}

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-5 md:flex-row md:items-center">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600">
                            {doctor?.first_name?.charAt(0)}
                            {doctor?.last_name?.charAt(0)}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Dr. {doctor?.first_name}{" "}
                                {doctor?.last_name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {doctor?.specialization ||
                                    "Medical Specialist"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                                {doctor?.qualification && (
                                    <span>
                                        {doctor.qualification}
                                    </span>
                                )}

                                {doctor?.experience_years != null && (
                                    <span>
                                        {doctor.experience_years} years
                                        experience
                                    </span>
                                )}

                                {doctor?.license_number && (
                                    <span>
                                        License:{" "}
                                        {doctor.license_number}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>


                {/* =====================================================
                    STAT CARDS
                ===================================================== */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="My Patients"
                        value={patients.length}
                        description="Patients connected to you"
                    />

                    <StatCard
                        title="Appointments"
                        value={appointments.length}
                        description="Your appointments"
                    />

                    <StatCard
                        title="Medical Visits"
                        value={visits.length}
                        description="Visits you've handled"
                    />

                    <StatCard
                        title="Upcoming"
                        value={upcomingAppointments.length}
                        description="Upcoming appointments"
                    />

                </div>


                {/* =====================================================
                    TABS
                ===================================================== */}

                <div className="mt-8 overflow-x-auto">

                    <div className="flex min-w-max gap-2 rounded-xl border border-gray-200 bg-white p-2">

                        <Tab
                            active={activeTab === "overview"}
                            onClick={() =>
                                setActiveTab("overview")
                            }
                        >
                            Overview
                        </Tab>

                        <Tab
                            active={activeTab === "patients"}
                            onClick={() =>
                                setActiveTab("patients")
                            }
                        >
                            My Patients
                        </Tab>

                        <Tab
                            active={activeTab === "appointments"}
                            onClick={() =>
                                setActiveTab("appointments")
                            }
                        >
                            Appointments
                        </Tab>

                        <Tab
                            active={activeTab === "visits"}
                            onClick={() =>
                                setActiveTab("visits")
                            }
                        >
                            Visits
                        </Tab>

                    </div>
                </div>


                {/* =====================================================
                    TAB CONTENT
                ===================================================== */}

                {activeTab === "overview" && (
                    <Overview
                        doctor={doctor}
                        patients={patients}
                        appointments={appointments}
                        visits={visits}
                        upcomingAppointments={
                            upcomingAppointments
                        }
                        onOpenPatient={(patient) => {
                            setSelectedPatient(patient);
                            setShowPatient(true);
                        }}
                        onNavigate={setActiveTab}
                    />
                )}


                {activeTab === "patients" && (
                    <PatientsSection
                        patients={filteredPatients}
                        search={search}
                        setSearch={setSearch}
                        appointments={appointments}
                        visits={visits}
                        onOpenPatient={(patient) => {
                            setSelectedPatient(patient);
                            setShowPatient(true);
                        }}
                    />
                )}


                {activeTab === "appointments" && (
                    <AppointmentsSection
                        appointments={appointments}
                        patients={patients}
                    />
                )}


                {activeTab === "visits" && (
                    <VisitsSection
                        visits={visits}
                        patients={patients}
                    />
                )}

            </div>


            {/* =====================================================
                PATIENT DETAIL DIALOG
            ===================================================== */}

            {showPatient && selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    appointments={appointments}
                    visits={visits}
                    onClose={() => {
                        setShowPatient(false);
                        setSelectedPatient(null);
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
    doctor,
    patients,
    appointments,
    visits,
    upcomingAppointments,
    onOpenPatient,
    onNavigate,
}) {
    return (
        <div className="mt-6 space-y-6">

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* PATIENT SUMMARY */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                My Patients
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Patients connected through appointments
                                and medical visits.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                onNavigate("patients")
                            }
                            className="text-sm font-medium text-blue-500 hover:text-blue-600"
                        >
                            View all
                        </button>

                    </div>


                    <div className="mt-5 divide-y divide-gray-100">

                        {patients.length === 0 ? (
                            <EmptyState
                                title="No patients yet"
                                message="Patients will appear here when they have an appointment or visit with you."
                            />
                        ) : (
                            patients.slice(0, 5).map((patient) => (
                                <PatientRow
                                    key={patient.id}
                                    patient={patient}
                                    appointments={appointments}
                                    visits={visits}
                                    onOpen={() =>
                                        onOpenPatient(patient)
                                    }
                                />
                            ))
                        )}

                    </div>
                </div>


                {/* DOCTOR INFO */}

                <div className="rounded-xl bg-blue-500 p-6 text-white">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-xl">
                        +
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                        Dr. {doctor?.first_name}{" "}
                        {doctor?.last_name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-blue-100">
                        {doctor?.specialization ||
                            "Medical Specialist"}
                    </p>

                    <div className="mt-6 space-y-2 text-sm text-blue-100">
                        <p>
                            {doctor?.qualification || "—"}
                        </p>

                        <p>
                            {doctor?.experience_years ?? "—"} years
                            experience
                        </p>

                        <p>
                            {doctor?.email || "—"}
                        </p>
                    </div>

                </div>

            </div>


            {/* UPCOMING APPOINTMENTS */}

            <div className="rounded-xl border border-gray-200 bg-white">

                <div className="flex items-center justify-between border-b border-gray-100 p-6">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Upcoming Appointments
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Your next scheduled appointments.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            onNavigate("appointments")
                        }
                        className="text-sm font-medium text-blue-500 hover:text-blue-600"
                    >
                        View all
                    </button>

                </div>

                {upcomingAppointments.length === 0 ? (
                    <EmptyState
                        title="No upcoming appointments"
                        message="You don't have any upcoming appointments."
                    />
                ) : (
                    <div className="divide-y divide-gray-100">

                        {upcomingAppointments.map(
                            (appointment) => {

                                const patient =
                                    patients.find(
                                        (p) =>
                                            Number(p.id) ===
                                            Number(
                                                appointment.patient_id
                                            )
                                    );

                                return (
                                    <div
                                        key={appointment.id}
                                        className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                                    >

                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {patient
                                                    ? `${patient.first_name} ${patient.last_name}`
                                                    : `Patient #${appointment.patient_id}`}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {formatDate(
                                                    appointment.appointment_time
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {appointment.reason ||
                                                    "No reason specified"}
                                            </p>
                                        </div>

                                        <StatusBadge
                                            status={
                                                appointment.status
                                            }
                                        />

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}


/* =========================================================
   PATIENTS
========================================================= */

function PatientsSection({
    patients,
    search,
    setSearch,
    appointments,
    visits,
    onOpenPatient,
}) {
    return (
        <div className="mt-6">

            <div className="rounded-xl border border-gray-200 bg-white p-6">

                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        My Patients
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Patients associated with you through
                        appointments and visits.
                    </p>
                </div>

                <div className="mt-5">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search patients by name, ID, email or phone..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                </div>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

                {patients.length === 0 ? (
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                            <p className="font-medium text-gray-700">
                                No patients found
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Try another search.
                            </p>
                        </div>
                    </div>
                ) : (
                    patients.map((patient) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            appointments={appointments}
                            visits={visits}
                            onOpen={() =>
                                onOpenPatient(patient)
                            }
                        />
                    ))
                )}

            </div>

        </div>
    );
}


/* =========================================================
   PATIENT CARD
========================================================= */

function PatientCard({
    patient,
    appointments,
    visits,
    onOpen,
}) {
    const patientAppointments =
        appointments.filter(
            (appointment) =>
                Number(appointment.patient_id) ===
                Number(patient.id)
        );

    const patientVisits =
        visits.filter(
            (visit) =>
                Number(visit.patient_id) ===
                Number(patient.id)
        );

    const lastVisit =
        [...patientVisits].sort(
            (a, b) =>
                new Date(b.visit_date) -
                new Date(a.visit_date)
        )[0];


    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                        {patient.first_name?.charAt(0)}
                        {patient.last_name?.charAt(0)}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800">
                            {patient.first_name}{" "}
                            {patient.last_name}
                        </h3>

                        <p className="text-xs text-gray-400">
                            Patient #{patient.id}
                        </p>
                    </div>

                </div>

                <button
                    onClick={onOpen}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                >
                    Open
                </button>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-3">

                <MiniInfo
                    label="Appointments"
                    value={patientAppointments.length}
                />

                <MiniInfo
                    label="Visits"
                    value={patientVisits.length}
                />

                <MiniInfo
                    label="Gender"
                    value={patient.gender}
                />

                <MiniInfo
                    label="Blood Group"
                    value={patient.blood_group}
                />

            </div>


            {lastVisit && (
                <div className="mt-4 rounded-lg bg-gray-50 p-3">

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Last Visit
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatDate(lastVisit.visit_date)}
                    </p>

                    {lastVisit.chief_complaint && (
                        <p className="mt-1 text-xs text-gray-500">
                            {lastVisit.chief_complaint}
                        </p>
                    )}

                </div>
            )}

        </div>
    );
}


/* =========================================================
   PATIENT ROW
========================================================= */

function PatientRow({
    patient,
    appointments,
    visits,
    onOpen,
}) {
    const patientVisits = visits.filter(
        (visit) =>
            Number(visit.patient_id) ===
            Number(patient.id)
    );

    const patientAppointments = appointments.filter(
        (appointment) =>
            Number(appointment.patient_id) ===
            Number(patient.id)
    );

    return (
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                    {patient.first_name?.charAt(0)}
                    {patient.last_name?.charAt(0)}
                </div>

                <div>
                    <p className="font-medium text-gray-800">
                        {patient.first_name}{" "}
                        {patient.last_name}
                    </p>

                    <p className="text-xs text-gray-400">
                        {patientAppointments.length} appointments
                        {" · "}
                        {patientVisits.length} visits
                    </p>
                </div>

            </div>

            <button
                onClick={onOpen}
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
                View Patient
            </button>

        </div>
    );
}


/* =========================================================
   APPOINTMENTS
========================================================= */

function AppointmentsSection({
    appointments,
    patients,
}) {
    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">

            <div className="border-b border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    Appointments
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Appointments assigned to you.
                </p>
            </div>

            {appointments.length === 0 ? (
                <EmptyState
                    title="No appointments"
                    message="You don't have any appointments."
                />
            ) : (
                <div className="divide-y divide-gray-100">

                    {appointments.map((appointment) => {

                        const patient =
                            patients.find(
                                (p) =>
                                    Number(p.id) ===
                                    Number(
                                        appointment.patient_id
                                    )
                            );

                        return (
                            <div
                                key={appointment.id}
                                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                            >

                                <div>

                                    <p className="font-medium text-gray-800">
                                        {patient
                                            ? `${patient.first_name} ${patient.last_name}`
                                            : `Patient #${appointment.patient_id}`}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(
                                            appointment.appointment_time
                                        )}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {appointment.reason ||
                                            "No reason specified"}
                                    </p>

                                    {appointment.notes && (
                                        <p className="mt-2 text-xs text-gray-400">
                                            {appointment.notes}
                                        </p>
                                    )}

                                </div>

                                <StatusBadge
                                    status={
                                        appointment.status
                                    }
                                />

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}


/* =========================================================
   VISITS
========================================================= */

function VisitsSection({
    visits,
    patients,
}) {
    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">

            <div className="border-b border-gray-100 p-6">

                <h2 className="text-lg font-semibold text-gray-800">
                    Medical Visits
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Visits handled by you.
                </p>

            </div>

            {visits.length === 0 ? (
                <EmptyState
                    title="No visits"
                    message="No medical visits are available."
                />
            ) : (
                <div className="divide-y divide-gray-100">

                    {visits.map((visit) => {

                        const patient =
                            patients.find(
                                (p) =>
                                    Number(p.id) ===
                                    Number(
                                        visit.patient_id
                                    )
                            );

                        return (
                            <div
                                key={visit.id}
                                className="p-6"
                            >

                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                                    <div>

                                        <p className="font-semibold text-gray-800">
                                            {patient
                                                ? `${patient.first_name} ${patient.last_name}`
                                                : `Patient #${visit.patient_id}`}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {formatDate(
                                                visit.visit_date
                                            )}
                                        </p>

                                    </div>

                                    {visit.follow_up_required && (
                                        <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                            Follow-up required
                                        </span>
                                    )}

                                </div>


                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <InfoBlock
                                        label="Chief Complaint"
                                        value={
                                            visit.chief_complaint
                                        }
                                    />

                                    <InfoBlock
                                        label="Diagnosis"
                                        value={
                                            visit.diagnosis
                                        }
                                    />

                                    <InfoBlock
                                        label="Clinical Notes"
                                        value={
                                            visit.clinical_notes
                                        }
                                    />

                                    <InfoBlock
                                        label="Follow-up Date"
                                        value={
                                            visit.follow_up_date
                                        }
                                    />

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}


/* =========================================================
   PATIENT DETAIL MODAL
========================================================= */

function PatientDetailModal({
    patient,
    appointments,
    visits,
    onClose,
}) {
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] =
        useState(true);

    const [selectedReport, setSelectedReport] =
        useState(null);


    const patientAppointments =
        appointments.filter(
            (appointment) =>
                Number(appointment.patient_id) ===
                Number(patient.id)
        );

    const patientVisits =
        visits.filter(
            (visit) =>
                Number(visit.patient_id) ===
                Number(patient.id)
        );


    useEffect(() => {
        async function loadReports() {
            try {
                setLoadingReports(true);

                const data =
                    await getPatientReports(patient.id);

                setReports(
                    Array.isArray(data)
                        ? data
                        : data?.items || []
                );
            } catch (err) {
                console.error(
                    "Failed to load patient reports:",
                    err
                );
            } finally {
                setLoadingReports(false);
            }
        }

        loadReports();
    }, [patient.id]);


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >

            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-gray-200 p-6">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                            {patient.first_name?.charAt(0)}
                            {patient.last_name?.charAt(0)}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {patient.first_name}{" "}
                                {patient.last_name}
                            </h2>

                            <p className="text-sm text-gray-500">
                                Patient #{patient.id}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        ✕
                    </button>

                </div>


                {/* CONTENT */}

                <div className="overflow-y-auto p-6">

                    {/* BASIC INFO */}

                    <section>

                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                            Patient Information
                        </h3>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <InfoBlock
                                label="Email"
                                value={patient.email}
                            />

                            <InfoBlock
                                label="Phone"
                                value={patient.phone}
                            />

                            <InfoBlock
                                label="Date of Birth"
                                value={patient.dob}
                            />

                            <InfoBlock
                                label="Gender"
                                value={patient.gender}
                            />

                            <InfoBlock
                                label="Blood Group"
                                value={patient.blood_group}
                            />

                            <InfoBlock
                                label="Emergency Contact"
                                value={
                                    patient.emergency_contact
                                }
                            />

                            <InfoBlock
                                label="Allergies"
                                value={patient.allergies}
                            />

                            <InfoBlock
                                label="Chronic Conditions"
                                value={
                                    patient.chronic_conditions
                                }
                            />

                            <InfoBlock
                                label="Address"
                                value={patient.address}
                            />

                        </div>

                    </section>


                    {/* VISITS */}

                    <section className="mt-8">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Visits
                        </h3>

                        <div className="mt-4 space-y-3">

                            {patientVisits.length === 0 ? (
                                <EmptyState
                                    title="No visits"
                                    message="There are no visits recorded with you."
                                />
                            ) : (
                                patientVisits.map(
                                    (visit) => (
                                        <div
                                            key={visit.id}
                                            className="rounded-xl border border-gray-200 p-5"
                                        >

                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        Visit #
                                                        {visit.id}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {formatDate(
                                                            visit.visit_date
                                                        )}
                                                    </p>
                                                </div>

                                                {visit.follow_up_required && (
                                                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                                        Follow-up
                                                    </span>
                                                )}

                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                                                <InfoBlock
                                                    label="Chief Complaint"
                                                    value={
                                                        visit.chief_complaint
                                                    }
                                                />

                                                <InfoBlock
                                                    label="Diagnosis"
                                                    value={
                                                        visit.diagnosis
                                                    }
                                                />

                                                <InfoBlock
                                                    label="Clinical Notes"
                                                    value={
                                                        visit.clinical_notes
                                                    }
                                                />

                                                <InfoBlock
                                                    label="Follow-up Date"
                                                    value={
                                                        visit.follow_up_date
                                                    }
                                                />

                                            </div>

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </section>


                    {/* REPORTS */}

                    <section className="mt-8">

                        <div className="flex items-center justify-between">

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Medical Reports
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Reports belonging to this patient.
                                </p>
                            </div>

                        </div>


                        <div className="mt-4">

                            {loadingReports ? (
                                <div className="rounded-xl border border-gray-200 p-6 text-center text-sm text-gray-500">
                                    Loading reports...
                                </div>
                            ) : reports.length === 0 ? (
                                <EmptyState
                                    title="No reports"
                                    message="No reports are available for this patient."
                                />
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    {reports.map(
                                        (report) => (
                                            <div
                                                key={report.id}
                                                className="rounded-xl border border-gray-200 p-5"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>
                                                        <h4 className="font-medium text-gray-800">
                                                            {report.title ||
                                                                report.file_name ||
                                                                "Medical Report"}
                                                        </h4>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {report.report_type ||
                                                                "Report"}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            setSelectedReport(
                                                                report
                                                            )
                                                        }
                                                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                                                    >
                                                        Open
                                                    </button>

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

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </section>


                    {/* APPOINTMENTS */}

                    <section className="mt-8">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Appointments
                        </h3>

                        <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200">

                            {patientAppointments.length === 0 ? (
                                <EmptyState
                                    title="No appointments"
                                    message="No appointments with this patient."
                                />
                            ) : (
                                patientAppointments.map(
                                    (appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                                        >

                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {formatDate(
                                                        appointment.appointment_time
                                                    )}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {appointment.reason ||
                                                        "No reason specified"}
                                                </p>

                                                {appointment.notes && (
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {
                                                            appointment.notes
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <StatusBadge
                                                status={
                                                    appointment.status
                                                }
                                            />

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </section>

                </div>

                {/* FOOTER */}

                <div className="flex justify-end border-t border-gray-200 p-5">

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Close
                    </button>

                </div>

            </div>


            {/* REPORT POPUP */}

            {selectedReport && (
                <ReportModal
                    report={selectedReport}
                    onClose={() =>
                        setSelectedReport(null)
                    }
                />
            )}

        </div>
    );
}


/* =========================================================
   REPORT MODAL
========================================================= */

function ReportModal({
    report,
    onClose,
}) {
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >

            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">

                <div className="flex items-start justify-between">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {report.title ||
                                report.file_name ||
                                "Medical Report"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {report.report_type ||
                                "Report"}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-100"
                    >
                        ✕
                    </button>

                </div>


                <div className="mt-6">

                    <InfoBlock
                        label="File"
                        value={report.file_name}
                    />

                    <div className="mt-5">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Processing Status
                        </p>

                        <div className="mt-1">
                            <StatusBadge
                                status={
                                    report.processing_status
                                }
                            />
                        </div>

                    </div>


                    {report.ai_summary && (
                        <div className="mt-6">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                                AI Summary
                            </h3>

                            <div className="mt-2 rounded-xl bg-blue-50 p-5 text-sm leading-7 text-gray-700 prose max-w-full">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} children={report.ai_summary} />
                            </div>

                        </div>
                    )}


                    {report.extracted_text && (
                        <div className="mt-6">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                                Extracted Text
                            </h3>

                            <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-600 whitespace-pre-wrap">
                                {report.extracted_text}
                            </div>

                        </div>
                    )}

                </div>


                <div className="mt-6 flex justify-end">

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
    title,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-semibold text-gray-800">
                {value}
            </p>

            <p className="mt-1 text-xs text-gray-400">
                {description}
            </p>

        </div>
    );
}


function Tab({
    active,
    onClick,
    children,
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${active
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            {children}
        </button>
    );
}


function StatusBadge({ status }) {
    if (!status) {
        return (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                —
            </span>
        );
    }

    const normalized = String(status).toLowerCase();

    let classes =
        "bg-gray-100 text-gray-600";

    if (
        normalized.includes("scheduled") ||
        normalized.includes("pending")
    ) {
        classes =
            "bg-blue-50 text-blue-600";
    }

    if (
        normalized.includes("completed") ||
        normalized.includes("success")
    ) {
        classes =
            "bg-green-50 text-green-600";
    }

    if (
        normalized.includes("cancel") ||
        normalized.includes("no show") ||
        normalized.includes("failed")
    ) {
        classes =
            "bg-red-50 text-red-600";
    }

    if (normalized.includes("follow")) {
        classes =
            "bg-yellow-50 text-yellow-600";
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}
        >
            {status}
        </span>
    );
}


function InfoBlock({
    label,
    value,
}) {
    return (
        <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {value === null ||
                    value === undefined ||
                    value === ""
                    ? "—"
                    : String(value)}
            </div>

        </div>
    );
}


function MiniInfo({
    label,
    value,
}) {
    return (
        <div className="rounded-lg bg-gray-50 p-3">

            <p className="text-xs text-gray-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
                {value ?? "—"}
            </p>

        </div>
    );
}


function EmptyState({
    title,
    message,
}) {
    return (
        <div className="p-8 text-center">

            <p className="font-medium text-gray-700">
                {title}
            </p>

            <p className="mt-1 text-sm text-gray-500">
                {message}
            </p>

        </div>
    );
}


function formatDate(value) {
    if (!value) {
        return "Date not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
}