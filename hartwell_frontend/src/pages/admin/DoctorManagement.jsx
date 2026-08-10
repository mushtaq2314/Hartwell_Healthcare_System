import { useEffect, useMemo, useState } from "react";

import {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
} from "../../services/adminApi";

const EMPTY_DOCTOR = {
    first_name: "",
    last_name: "",
    department_id: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    email: "",
    phone: "",
    license_number: "",
    password: "",
    confirm_password: "",
};

export default function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAdd, setShowAdd] = useState(false);
    const [viewDoctor, setViewDoctor] = useState(null);
    const [editDoctor, setEditDoctor] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    async function loadDoctors() {
        try {
            setLoading(true);
            setError("");

            const data = await getDoctors();
            setDoctors(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDoctors();
    }, []);

    const filteredDoctors = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) {
            return doctors;
        }

        return doctors.filter((doctor) => {
            const searchable = [
                doctor.id,
                doctor.first_name,
                doctor.last_name,
                doctor.email,
                doctor.phone,
                doctor.specialization,
                doctor.qualification,
                doctor.license_number,
                doctor.department_id,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(query);
        });
    }, [doctors, search]);

    async function handleCreate(data) {
        try {
            await createDoctor(data);

            setShowAdd(false);
            await loadDoctors();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleUpdate(data) {
        try {
            await updateDoctor(editDoctor.id, data);

            setEditDoctor(null);
            await loadDoctors();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDelete() {
        try {
            await deleteDoctor(deleteTarget.id);

            setDeleteTarget(null);
            await loadDoctors();
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Doctor Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage registered doctors.
                    </p>
                </div>

                <button
                    onClick={() => setShowAdd(true)}
                    className="rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
                >
                    + Add Doctor
                </button>
            </div>

            {/* SEARCH */}
            <div className="mt-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, ID, email, phone, specialization..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* TABLE */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading doctors...
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No doctors found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">ID</th>

                                    <th className="px-6 py-4">
                                        Doctor
                                    </th>

                                    <th className="px-6 py-4">
                                        Email
                                    </th>

                                    <th className="px-6 py-4">
                                        Phone
                                    </th>

                                    <th className="px-6 py-4">
                                        Specialization
                                    </th>

                                    <th className="px-6 py-4">
                                        Experience
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDoctors.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            #{doctor.id}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">
                                                {doctor.first_name}{" "}
                                                {doctor.last_name}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-400">
                                                {doctor.qualification || "—"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {doctor.email}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {doctor.phone}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {doctor.specialization || "—"}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {doctor.experience_years ?? "—"}{" "}
                                            {doctor.experience_years !==
                                                null &&
                                            doctor.experience_years !==
                                                undefined
                                                ? "years"
                                                : ""}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setViewDoctor(doctor)
                                                    }
                                                    className="rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setEditDoctor(doctor)
                                                    }
                                                    className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(doctor)
                                                    }
                                                    className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD */}
            {showAdd && (
                <DoctorFormModal
                    title="Add Doctor"
                    doctor={EMPTY_DOCTOR}
                    onClose={() => setShowAdd(false)}
                    onSubmit={handleCreate}
                />
            )}

            {/* EDIT */}
            {editDoctor && (
                <DoctorFormModal
                    title="Edit Doctor"
                    doctor={editDoctor}
                    onClose={() => setEditDoctor(null)}
                    onSubmit={handleUpdate}
                />
            )}

            {/* VIEW */}
            {viewDoctor && (
                <DoctorViewModal
                    doctor={viewDoctor}
                    onClose={() => setViewDoctor(null)}
                />
            )}

            {/* DELETE */}
            {deleteTarget && (
                <DeleteModal
                    title="Delete Doctor"
                    name={`${deleteTarget.first_name} ${deleteTarget.last_name}`}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}


/* =========================================================
   DOCTOR FORM
========================================================= */

function DoctorFormModal({
    title,
    doctor,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState({
        ...EMPTY_DOCTOR,
        ...doctor,
        department_id:
            doctor.department_id !== undefined &&
            doctor.department_id !== null
                ? String(doctor.department_id)
                : "",
        experience_years:
            doctor.experience_years !== undefined &&
            doctor.experience_years !== null
                ? String(doctor.experience_years)
                : "",
        password: "",
        confirm_password: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    function updateField(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setFormError("");

        /*
         * Password is required only when creating
         * a new doctor.
         */
        if (!doctor.id && !form.password) {
            setFormError("Password is required.");
            return;
        }

        /*
         * Only validate confirmation when a password
         * has been entered.
         */
        if (
            form.password &&
            form.password !== form.confirm_password
        ) {
            setFormError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            /*
             * confirm_password is frontend-only.
             * Do not send it to the backend.
             */
            const payload = {
                first_name: form.first_name,
                last_name: form.last_name,
                department_id: Number(form.department_id),
                qualification: form.qualification,
                specialization: form.specialization,
                experience_years: Number(form.experience_years),
                email: form.email,
                phone: form.phone,
                license_number: form.license_number,
            };

            /*
             * Password:
             *
             * CREATE -> always send it.
             *
             * EDIT -> only send it if admin entered
             *         a new password.
             */
            if (form.password) {
                payload.password = form.password;
            }

            await onSubmit(payload);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal onClose={onClose}>
            <div className="max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {doctor.id
                        ? "Update the doctor's information."
                        : "Enter the doctor's information."}
                </p>

                {formError && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {formError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                    {/* FIRST NAME */}
                    <Field
                        label="First Name"
                        value={form.first_name}
                        onChange={(v) =>
                            updateField("first_name", v)
                        }
                        required
                    />

                    {/* LAST NAME */}
                    <Field
                        label="Last Name"
                        value={form.last_name}
                        onChange={(v) =>
                            updateField("last_name", v)
                        }
                        required
                    />

                    {/* DEPARTMENT */}
                    <Field
                        label="Department ID"
                        type="number"
                        value={form.department_id}
                        onChange={(v) =>
                            updateField("department_id", v)
                        }
                        required
                    />

                    {/* QUALIFICATION */}
                    <Field
                        label="Qualification"
                        value={form.qualification}
                        onChange={(v) =>
                            updateField("qualification", v)
                        }
                        placeholder="e.g. MD"
                        required
                    />

                    {/* SPECIALIZATION */}
                    <Field
                        label="Specialization"
                        value={form.specialization}
                        onChange={(v) =>
                            updateField("specialization", v)
                        }
                        placeholder="e.g. Internal Medicine"
                        required
                    />

                    {/* EXPERIENCE */}
                    <Field
                        label="Experience (Years)"
                        type="number"
                        min="0"
                        value={form.experience_years}
                        onChange={(v) =>
                            updateField("experience_years", v)
                        }
                        required
                    />

                    {/* EMAIL */}
                    <Field
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v) =>
                            updateField("email", v)
                        }
                        required
                    />

                    {/* PHONE */}
                    <Field
                        label="Phone"
                        value={form.phone}
                        onChange={(v) =>
                            updateField("phone", v)
                        }
                        required
                    />

                    {/* LICENSE */}
                    <Field
                        label="License Number"
                        value={form.license_number}
                        onChange={(v) =>
                            updateField("license_number", v)
                        }
                        required
                    />

                    {/* PASSWORD */}
                    <Field
                        label={
                            doctor.id
                                ? "New Password"
                                : "Password"
                        }
                        type="password"
                        value={form.password}
                        onChange={(v) =>
                            updateField("password", v)
                        }
                        required={!doctor.id}
                        placeholder={
                            doctor.id
                                ? "Leave blank to keep current password"
                                : "Enter password"
                        }
                    />

                    {/* CONFIRM PASSWORD */}
                    <Field
                        label="Confirm Password"
                        type="password"
                        value={form.confirm_password}
                        onChange={(v) =>
                            updateField("confirm_password", v)
                        }
                        required={!doctor.id}
                        placeholder={
                            doctor.id
                                ? "Enter only if changing password"
                                : "Confirm password"
                        }
                    />

                    {/* BUTTONS */}
                    <div className="mt-2 flex justify-end gap-3 md:col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                            {submitting
                                ? "Saving..."
                                : doctor.id
                                ? "Update Doctor"
                                : "Create Doctor"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}


/* =========================================================
   DOCTOR VIEW
========================================================= */

function DoctorViewModal({ doctor, onClose }) {
    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800">
                Doctor Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Doctor profile information.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Info
                    label="Doctor ID"
                    value={doctor.id}
                />

                <Info
                    label="Name"
                    value={`${doctor.first_name} ${doctor.last_name}`}
                />

                <Info
                    label="Department ID"
                    value={doctor.department_id}
                />

                <Info
                    label="Qualification"
                    value={doctor.qualification}
                />

                <Info
                    label="Specialization"
                    value={doctor.specialization}
                />

                <Info
                    label="Experience"
                    value={
                        doctor.experience_years !== null &&
                        doctor.experience_years !== undefined
                            ? `${doctor.experience_years} years`
                            : null
                    }
                />

                <Info
                    label="Email"
                    value={doctor.email}
                />

                <Info
                    label="Phone"
                    value={doctor.phone}
                />

                <Info
                    label="License Number"
                    value={doctor.license_number}
                />
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}


/* =========================================================
   SHARED COMPONENTS
========================================================= */

function Modal({ children, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
                {children}
            </div>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder = "",
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
                required={required}
                min={min}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

function Info({ label, value }) {
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


/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteModal({
    title,
    name,
    onClose,
    onConfirm,
}) {
    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800">
                {title}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                    {name}
                </span>
                ?
            </p>

            <p className="mt-2 text-sm text-red-500">
                This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    onClick={onConfirm}
                    className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}