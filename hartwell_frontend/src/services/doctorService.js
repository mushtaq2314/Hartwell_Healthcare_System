const API_BASE_URL = "http://localhost:8000";


function getToken() {
    return localStorage.getItem("access_token");
}


async function apiRequest(url, options = {}) {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",

            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),

            ...(options.headers || {}),
        },
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        // No JSON response
    }

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.message ||
            "Something went wrong."
        );
    }

    return data;
}


/* =========================================================
   DOCTOR
========================================================= */

export async function getDoctor(doctorId) {
    return apiRequest(`/doctors/${doctorId}`);
}


/* =========================================================
   PATIENTS
========================================================= */

/*
 * This endpoint is already restricted on the backend to:
 *
 * admin / doctor
 *
 * We use it to resolve patient IDs obtained from
 * appointments and visits.
 */
export async function getPatients() {
    return apiRequest("/patients/");
}


export async function getPatient(patientId) {
    return apiRequest(`/patients/${patientId}`);
}


/* =========================================================
   APPOINTMENTS
========================================================= */

export async function getDoctorAppointments(doctorId) {
    return apiRequest(`/appointments/doctor/${doctorId}`);
}


export async function getPatientAppointments(patientId) {
    return apiRequest(`/appointments/patient/${patientId}`);
}


/* =========================================================
   VISITS
========================================================= */

export async function getDoctorVisits(doctorId) {
    return apiRequest(`/visits/doctor/${doctorId}`);
}


export async function getPatientVisits(patientId) {
    return apiRequest(`/visits/patient/${patientId}`);
}


export async function getVisit(visitId) {
    return apiRequest(`/visits/${visitId}`);
}


/* =========================================================
   REPORTS
========================================================= */

export async function getPatientReports(patientId) {
    return apiRequest(`/reports/patient/${patientId}`);
}


export async function getVisitReports(visitId) {
    return apiRequest(`/reports/visit/${visitId}`);
}


export async function getReport(reportId) {
    return apiRequest(`/reports/${reportId}`);
}


/* =========================================================
   PRESCRIPTIONS
========================================================= */

export async function getVisitPrescriptions(visitId) {
    return apiRequest(`/prescriptions/visit/${visitId}`);
}


/* =========================================================
   APPOINTMENT UPDATE
========================================================= */

export async function updateAppointment(data) {
    return apiRequest("/appointments/", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}


export async function cancelAppointment(appointmentId) {
    return apiRequest(
        `/appointments/${appointmentId}/cancel`,
        {
            method: "PATCH",
        }
    );
}