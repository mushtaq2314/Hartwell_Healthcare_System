const API_BASE_URL = "http://localhost:8000";

export async function createPatient(patientData) {
    const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        // No JSON response
    }

    if (!response.ok) {
        throw new Error(
            data?.detail || "Failed to create patient account."
        );
    }

    return data;
}

export async function sendPatientChat(message, conversationId = null) {
    const token = getToken();
    const response = await fetch(
        `${API_BASE_URL}/patients/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message,
                conversation_id: conversationId,
            }),
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        // No JSON response
    }

    if (!response.ok) {
        throw new Error(
            data?.detail || "Failed to send message."
        );
    }

    return data;
}

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

export async function uploadPatientReport(title, reportType, file) {
    const patientId = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");

    if (!patientId) {
        throw new Error(
            "Patient information is missing. Please log in again."
        );
    }

    const formData = new FormData();

    formData.append("patient_id", patientId);
    formData.append("title", title);
    formData.append("report_type", reportType);
    formData.append("file", file);

    const response = await fetch(
        "http://localhost:8000/reports/",
        {
            method: "POST",
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
            body: formData,
        }
    );

    return response;
}

/*
|--------------------------------------------------------------------------
| Patient
|--------------------------------------------------------------------------
*/

export async function getPatient(patientId) {
    return apiRequest(`/patients/${patientId}`);
}


/*
|--------------------------------------------------------------------------
| Appointments
|--------------------------------------------------------------------------
|
| Keep these here for when the appointment UI is added.
| If your backend route is different, only the URL needs to change.
|--------------------------------------------------------------------------
*/

export async function getPatientAppointments(patientId) {
    return apiRequest(`/appointments/patient/${patientId}`);
}

export async function cancelAppointment(appointmentId) {
    return apiRequest(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
    });
}

export async function makeAppointment(doctorId, reason, dateTime) {
    const token = getToken();
    const patientId = localStorage.getItem("user_id");

    const response = await fetch(`${API_BASE_URL}/appointments/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            doctor_id: doctorId,
            patient_id: patientId,
            reason: reason,
            appointment_time: dateTime,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(
            `Failed to create appointment: ${response.status} ${error}`
        );
    }

    return response.json();
}

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

export async function getPatientReports(patientId) {
    return apiRequest(`/reports/patient/${patientId}`);
}


/*
|--------------------------------------------------------------------------
| Prescriptions
|--------------------------------------------------------------------------
*/

export async function getPatientPrescriptions(patientId) {
    return apiRequest(`/prescriptions/patient/${patientId}`);
}


/*
|--------------------------------------------------------------------------
| Visits
|--------------------------------------------------------------------------
*/

export async function getPatientVisits(patientId) {
    return apiRequest(`/visits/patient/${patientId}`);
}


/*
|--------------------------------------------------------------------------
| Timeline
|--------------------------------------------------------------------------
*/

export async function getPatientTimeline(patientId) {
    return apiRequest(`/timeline/${patientId}`);
}