import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [patientsResponse, doctorsResponse] =
                await Promise.all([
                    fetch(`${API_BASE_URL}/patients/`, {
                        headers,
                    }),
                    fetch(`${API_BASE_URL}/doctors/`, {
                        headers,
                    }),
                ]);

            if (patientsResponse.status === 401 ||
                patientsResponse.status === 403 ||
                doctorsResponse.status === 401 ||
                doctorsResponse.status === 403) {

                localStorage.removeItem("access_token");
                navigate("/login");
                return;
            }

            if (!patientsResponse.ok) {
                throw new Error("Failed to load patients");
            }

            if (!doctorsResponse.ok) {
                throw new Error("Failed to load doctors");
            }

            const patientsData = await patientsResponse.json();
            const doctorsData = await doctorsResponse.json();

            setPatients(patientsData);
            setDoctors(doctorsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-5 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Hartwell Healthcare
                        </h1>

                        <p className="text-sm text-gray-500">
                            Administrator Dashboard
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="px-5 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                        Logout
                    </button>

                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-5 py-8">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Dashboard
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Manage patients and doctors from one place.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Patients */}
                    <div className="bg-white border rounded-xl p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Patients
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-gray-800">
                                    {patients.length}
                                </p>
                            </div>

                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5.121 17.804A7 7 0 0112 14a7 7 0 016.879 3.804M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>

                        </div>
                    </div>

                    {/* Doctors */}
                    <div className="bg-white border rounded-xl p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Doctors
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-gray-800">
                                    {doctors.length}
                                </p>
                            </div>

                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="currentColor" fill-rule="evenodd" d="M34 16c0 5.523-4.477 10-10 10s-10-4.477-10-10S18.477 6 24 6s10 4.477 10 10m-2 0a8 8 0 1 1-16 0a8 8 0 0 1 16 0M17.914 28.855l.011.022l.075.147h11.749c.229-.434.748-1.126 1.251-1.011c1.13.257 2.268.615 3.361 1.056l.033-.016l.011.022l.008.015C38.528 30.762 42 33.596 42 36.57V42H6v-5.43c0-3.775 5.596-7.327 11-8.557c.441-.1.703.42.914.842m14.79 1.728a20 20 0 0 0-1.301-.407l-.446.848H16.793l-.414-.787l-.36.108q-.011.098-.016.224c-.013.345.013.754.07 1.17a8 8 0 0 0 .28 1.281a3 3 0 1 1-1.957.444l-.008-.028a10 10 0 0 1-.297-1.426a10 10 0 0 1-.084-.928c-1.236.528-2.389 1.166-3.355 1.87C8.73 34.356 8 35.668 8 36.57V40h32v-3.43c0-.903-.73-2.215-2.652-3.617a16.6 16.6 0 0 0-2.666-1.562A10.5 10.5 0 0 1 34.434 33H35a1 1 0 0 1 .894.553l1 2c.07.139.106.292.106.447v2a1 1 0 0 1-1 1h-2v-2h1v-.764L34.382 35h-2.764L31 36.236V37h1v2h-2a1 1 0 0 1-1-1v-2c0-.155.036-.308.106-.447l1-2A1 1 0 0 1 31 33h1.362l.037-.124c.094-.321.178-.72.235-1.136c.056-.412.082-.815.07-1.157M17 36c0 .574-.462 1.015-1 1.015s-1-.44-1-1.015c0-.574.462-1.015 1-1.015s1 .44 1 1.015" clip-rule="evenodd" /></svg>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="mt-8">

                    <h3 className="text-lg font-semibold text-gray-800">
                        Quick Actions
                    </h3>

                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">

                        <button
                            onClick={() => navigate("/admin/patients")}
                            className="p-6 text-left bg-white border rounded-xl hover:border-blue-400 hover:shadow-sm transition cursor-pointer"
                        >
                            <h4 className="font-semibold text-gray-800">
                                Manage Patients
                            </h4>

                            <p className="mt-2 text-sm text-gray-500">
                                View and manage registered patients.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/admin/doctors")}
                            className="p-6 text-left bg-white border rounded-xl hover:border-blue-400 hover:shadow-sm transition cursor-pointer"
                        >
                            <h4 className="font-semibold text-gray-800">
                                Manage Doctors
                            </h4>

                            <p className="mt-2 text-sm text-gray-500">
                                View and manage registered doctors.
                            </p>
                        </button>

                    </div>

                </div>

                {/* Recent Patients */}
                <div className="mt-8 bg-white border rounded-xl">

                    <div className="px-6 py-5 border-b">
                        <h3 className="font-semibold text-gray-800">
                            Patients
                        </h3>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                                        ID
                                    </th>

                                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                                        Phone
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {patients.slice(0, 10).map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50">

                                        <td className="px-6 py-4 text-gray-600">
                                            {patient.id}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {patient.first_name} {patient.last_name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {patient.email}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {patient.phone}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                        {patients.length === 0 && (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No patients found.
                            </div>
                        )}

                    </div>

                </div>

            </main>
        </div>
    );
}