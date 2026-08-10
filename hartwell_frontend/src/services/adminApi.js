const API_BASE_URL = "http://localhost:8000";

function getToken() {
    return localStorage.getItem("access_token");
}

async function request(url, options = {}) {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail || data?.message || "Request failed"
        );
    }

    return data;
}

/* =========================
   PATIENTS
========================= */

export async function getPatients() {
    return request("/patients");
}

export async function getPatient(patientId) {
    return request(`/patients/${patientId}`);
}

export async function createPatient(patient) {
    return request("/patients", {
        method: "POST",
        body: JSON.stringify(patient),
    });
}

export async function updatePatient(patientId, patient) {
    return request(`/patients/${patientId}`, {
        method: "PUT",
        body: JSON.stringify(patient),
    });
}

export async function deletePatient(patientId) {
    return request(`/patients/${patientId}`, {
        method: "DELETE",
    });
}

/* =========================
   DOCTORS
========================= */

export async function getDoctors() {
    return request("/doctors");
}

export async function getDoctor(doctorId) {
    return request(`/doctors/${doctorId}`);
}

export async function createDoctor(doctor) {
    return request("/doctors", {
        method: "POST",
        body: JSON.stringify(doctor),
    });
}

export async function updateDoctor(doctorId, doctor) {
    return request(`/doctors/${doctorId}`, {
        method: "PUT",
        body: JSON.stringify(doctor),
    });
}

export async function deleteDoctor(doctorId) {
    return request(`/doctors/${doctorId}`, {
        method: "DELETE",
    });
}