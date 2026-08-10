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
    return apiRequest(`/timeline/patient/${patientId}`);
}