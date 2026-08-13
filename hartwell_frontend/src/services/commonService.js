const API_BASE_URL = "http://localhost:8000";


function getToken() {
    localStorage.getItem("access_token")
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

export async function getAllDoctors() {
    return apiRequest('/doctors/');
}