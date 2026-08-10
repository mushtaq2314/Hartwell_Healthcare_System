import { useState } from "react";
import { createPatient } from "../../services/patientService";

export default function PatientRegister() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        blood_group: "",
        address: "",
        emergency_contact: "",
        allergies: "",
        chronic_conditions: "",
        password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const patientData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                dob: formData.dob,
                gender: formData.gender,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                blood_group: formData.blood_group || null,
                address: formData.address || null,
                emergency_contact: formData.emergency_contact || null,
                allergies: formData.allergies || null,
                chronic_conditions: formData.chronic_conditions || null,
            };

            await createPatient(patientData);

            setSuccess("Account created successfully.");

            setFormData({
                first_name: "",
                last_name: "",
                dob: "",
                gender: "",
                email: "",
                phone: "",
                blood_group: "",
                address: "",
                emergency_contact: "",
                allergies: "",
                chronic_conditions: "",
                password: "",
                confirm_password: "",
            });
        } catch (err) {
            setError(err.message || "Unable to create your account.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-200";

    const selectClass =
        "block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-200";

    const labelClass =
        "block mb-2 text-sm font-medium text-gray-600";

    return (
        <section className="text-gray-600 body-font">
            <div className="flex items-center w-full max-w-5xl px-6 py-12 mx-auto">
                <div className="w-full">
                    <h1 className="text-3xl font-semibold tracking-wider text-gray-800">
                        Create Your Patient Account
                    </h1>

                    <p className="mt-4 text-gray-500">
                        Create your account to securely access your healthcare information
                        and AI-powered patient assistant.
                    </p>
                    <p className="mt-4 text-gray-500">
                        Already have an account? <a href="/login" className="text-indigo-500">Click here to login.</a>
                    </p>

                    {error && (
                        <div className="p-4 mt-6 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 mt-6 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-x-8 gap-y-6 mt-8 md:grid-cols-2"
                    >
                        <div>
                            <label className={labelClass}>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="John"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Snow"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className={selectClass}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Blood Group</label>
                            <select
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Emergency Contact</label>
                            <input
                                type="tel"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                placeholder="Emergency contact number"
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                rows={3}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Allergies</label>
                            <textarea
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="e.g. Penicillin, peanuts"
                                rows={3}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Chronic Conditions</label>
                            <textarea
                                name="chronic_conditions"
                                value={formData.chronic_conditions}
                                onChange={handleChange}
                                placeholder="Enter any known chronic conditions"
                                rows={3}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>
                                    {loading ? "Creating account..." : "Create Account"}
                                </span>

                                {!loading && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414v.01l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}