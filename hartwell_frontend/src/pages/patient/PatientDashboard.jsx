import { useEffect, useState } from "react";

import { getPatient } from "../../services/patientService";

export default function PatientDashboard() {
    const [patient, setPatient] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadPatient() {
        try {
            setLoading(true);
            setError("");

            /*
             * We expect the patient's ID to be available after login.
             *
             * If your login code stores this under a different key,
             * change "user_id" below.
             */
            const patientId = localStorage.getItem("user_id");

            if (!patientId) {
                throw new Error(
                    "Patient information is missing. Please log in again."
                );
            }

            const data = await getPatient(patientId);

            setPatient(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPatient();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-sm text-gray-500">
                            Loading your dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h2 className="text-lg font-semibold text-red-700">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={loadPatient}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Login
                        </button>
                    </div>
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
                HEADER
            ====================================================== */}

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Patient Dashboard
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold text-gray-800">
                                Welcome back, {patient.first_name}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Here's an overview of your healthcare information.
                            </p>
                        </div>


                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                            {patient.first_name?.charAt(0)}
                            {patient.last_name?.charAt(0)}
                        </div>

                    </div>

                </div>
            </div>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* =================================================
                    QUICK STATS
                ================================================== */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <DashboardCard
                        title="Appointments"
                        value="—"
                        description="Upcoming appointments"
                        icon={<CalendarIcon />}
                    />

                    <DashboardCard
                        title="Reports"
                        value="—"
                        description="Medical reports"
                        icon={<ReportIcon />}
                    />

                    <DashboardCard
                        title="Prescriptions"
                        value="—"
                        description="Active prescriptions"
                        icon={<PrescriptionIcon />}
                    />

                    <DashboardCard
                        title="Visits"
                        value="—"
                        description="Medical visits"
                        icon={<VisitIcon />}
                    />

                </div>


                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* =============================================
                        PROFILE
                    ============================================== */}

                    <section className="lg:col-span-2">

                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Personal Information
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Your basic patient information.
                                    </p>
                                </div>

                                <button
                                    className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                >
                                    View Profile
                                </button>

                            </div>


                            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                                <InfoField
                                    label="Full Name"
                                    value={`${patient.first_name} ${patient.last_name}`}
                                />

                                <InfoField
                                    label="Patient ID"
                                    value={`#${patient.id}`}
                                />

                                <InfoField
                                    label="Date of Birth"
                                    value={patient.dob}
                                />

                                <InfoField
                                    label="Gender"
                                    value={patient.gender}
                                />

                                <InfoField
                                    label="Email"
                                    value={patient.email}
                                />

                                <InfoField
                                    label="Phone"
                                    value={patient.phone}
                                />

                                <InfoField
                                    label="Blood Group"
                                    value={patient.blood_group}
                                />

                                <InfoField
                                    label="Emergency Contact"
                                    value={patient.emergency_contact}
                                />

                            </div>

                        </div>


                        {/* =========================================
                            HEALTH INFORMATION
                        ========================================== */}

                        <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">

                            <div className="border-b border-gray-200 px-6 py-5">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Health Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Important information recorded in your profile.
                                </p>

                            </div>


                            <div className="space-y-5 p-6">

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

                    </section>


                    {/* =============================================
                        QUICK ACTIONS
                    ============================================== */}

                    <section>

                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                            <div className="border-b border-gray-200 px-6 py-5">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Quick Actions
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Access your healthcare tools.
                                </p>

                            </div>


                            <div className="space-y-3 p-6">

                                <QuickAction
                                    title="My Appointments"
                                    description="View your appointments"
                                    icon={<CalendarIcon />}
                                />

                                <QuickAction
                                    title="Medical Reports"
                                    description="View your reports"
                                    icon={<ReportIcon />}
                                />

                                <QuickAction
                                    title="Prescriptions"
                                    description="View your medications"
                                    icon={<PrescriptionIcon />}
                                />

                                <QuickAction
                                    title="Medical History"
                                    description="View your visits"
                                    icon={<VisitIcon />}
                                />

                            </div>

                        </div>


                        {/* =========================================
                            AI ASSISTANT
                        ========================================== */}

                        <div className="mt-6 overflow-hidden rounded-xl bg-blue-600 shadow-sm">

                            <div className="p-6">

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/20">
                                    <ChatIcon />
                                </div>

                                <h2 className="mt-5 text-lg font-semibold text-white">
                                    Patient AI Assistant
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-blue-100">
                                    Ask questions about your healthcare
                                    information and get assistance from your
                                    AI-powered patient assistant.
                                </p>

                                <button
                                    className="mt-5 w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Open AI Assistant
                                </button>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}


/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
    title,
    value,
    description,
    icon,
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

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

        </div>
    );
}


/* =========================================================
   INFO FIELD
========================================================= */

function InfoField({ label, value }) {
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


/* =========================================================
   HEALTH INFORMATION
========================================================= */

function HealthInformation({
    title,
    value,
}) {
    return (
        <div>

            <p className="text-sm font-medium text-gray-700">
                {title}
            </p>

            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">
                {value || "No information recorded."}
            </div>

        </div>
    );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
    title,
    description,
    icon,
}) {
    return (
        <button
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
                className="ml-auto h-5 w-5 text-gray-400"
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