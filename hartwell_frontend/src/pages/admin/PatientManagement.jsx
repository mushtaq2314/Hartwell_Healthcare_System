import { useEffect, useMemo, useState } from "react";

import {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
} from "../../services/adminApi";

const EMPTY_PATIENT = {
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
};

export default function PatientManagement() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAdd, setShowAdd] = useState(false);
    const [viewPatient, setViewPatient] = useState(null);
    const [editPatient, setEditPatient] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    async function loadPatients() {
        try {
            setLoading(true);
            setError("");

            const data = await getPatients();
            setPatients(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) {
            return patients;
        }

        return patients.filter((patient) => {
            const fullName =
                `${patient.first_name} ${patient.last_name}`.toLowerCase();

            return (
                fullName.includes(query) ||
                String(patient.id).includes(query) ||
                patient.email?.toLowerCase().includes(query) ||
                patient.phone?.toLowerCase().includes(query)
            );
        });
    }, [patients, search]);

    async function handleCreate(data) {
        try {
            await createPatient(data);

            setShowAdd(false);

            await loadPatients();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleUpdate(data) {
        try {
            /*
             * Do not send confirm_password to the backend.
             *
             * If password is empty during edit, remove it too.
             * This allows the backend to keep the existing password.
             */
            const payload = { ...data };

            delete payload.confirm_password;

            if (!payload.password) {
                delete payload.password;
            }

            await updatePatient(editPatient.id, payload);

            setEditPatient(null);

            await loadPatients();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDelete() {
        try {
            await deletePatient(deleteTarget.id);

            setDeleteTarget(null);

            await loadPatients();
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
                        Patient Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage registered patients.
                    </p>
                </div>

                <button
                    onClick={() => setShowAdd(true)}
                    className="rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600"
                >
                    + Add Patient
                </button>
            </div>

            {/* SEARCH */}
            <div className="mt-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, ID, email or phone..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* TABLE */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading patients...
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No patients found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Gender</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            #{patient.id}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800">
                                                {patient.first_name}{" "}
                                                {patient.last_name}
                                            </div>

                                            <div className="text-xs text-gray-400">
                                                DOB: {patient.dob}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {patient.email}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {patient.phone}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {patient.gender}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setViewPatient(patient)
                                                    }
                                                    className="rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setEditPatient(patient)
                                                    }
                                                    className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(patient)
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
                <PatientFormModal
                    title="Add Patient"
                    patient={EMPTY_PATIENT}
                    isEdit={false}
                    onClose={() => setShowAdd(false)}
                    onSubmit={handleCreate}
                />
            )}

            {/* EDIT */}
            {editPatient && (
                <PatientFormModal
                    title="Edit Patient"
                    patient={editPatient}
                    isEdit={true}
                    onClose={() => setEditPatient(null)}
                    onSubmit={handleUpdate}
                />
            )}

            {/* VIEW */}
            {viewPatient && (
                <PatientViewModal
                    patient={viewPatient}
                    onClose={() => setViewPatient(null)}
                />
            )}

            {/* DELETE */}
            {deleteTarget && (
                <DeleteModal
                    title="Delete Patient"
                    name={`${deleteTarget.first_name} ${deleteTarget.last_name}`}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}


/* =========================================================
   PATIENT FORM MODAL
========================================================= */

function PatientFormModal({
    title,
    patient,
    isEdit,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState({
        ...EMPTY_PATIENT,
        ...patient,
        password: "",
        confirm_password: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    function updateField(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (
            field === "password" ||
            field === "confirm_password"
        ) {
            setPasswordError("");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        /*
         * Password is mandatory when creating.
         * Password is optional when editing.
         */
        if (!isEdit && !form.password) {
            setPasswordError("Password is required.");
            return;
        }

        /*
         * If a password is supplied, confirmation must match.
         */
        if (form.password !== form.confirm_password) {
            setPasswordError("Passwords do not match.");
            return;
        }

        /*
         * During edit, an empty password means:
         * "keep existing password".
         */
        if (isEdit && !form.password) {
            setPasswordError("");
        }

        setSubmitting(true);

        try {
            await onSubmit(form);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal onClose={onClose}>
            <div className="max-h-[90vh] overflow-y-auto pr-1">
                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {isEdit
                        ? "Update the patient's information."
                        : "Enter the patient's information."}
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                    <Field
                        label="First Name"
                        value={form.first_name}
                        onChange={(v) =>
                            updateField("first_name", v)
                        }
                        required
                    />

                    <Field
                        label="Last Name"
                        value={form.last_name}
                        onChange={(v) =>
                            updateField("last_name", v)
                        }
                        required
                    />

                    <Field
                        label="Date of Birth"
                        type="date"
                        value={form.dob}
                        onChange={(v) =>
                            updateField("dob", v)
                        }
                        required
                    />

                    <Field
                        label="Gender"
                        value={form.gender}
                        onChange={(v) =>
                            updateField("gender", v)
                        }
                        required
                    />

                    <Field
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v) =>
                            updateField("email", v)
                        }
                        required
                    />

                    <Field
                        label="Phone"
                        value={form.phone}
                        onChange={(v) =>
                            updateField("phone", v)
                        }
                        required
                    />

                    <Field
                        label="Blood Group"
                        value={form.blood_group || ""}
                        onChange={(v) =>
                            updateField("blood_group", v)
                        }
                    />

                    <Field
                        label="Emergency Contact"
                        value={form.emergency_contact || ""}
                        onChange={(v) =>
                            updateField("emergency_contact", v)
                        }
                    />

                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field
                                label={
                                    isEdit
                                        ? "New Password (optional)"
                                        : "Password"
                                }
                                type="password"
                                value={form.password}
                                onChange={(v) =>
                                    updateField("password", v)
                                }
                                required={!isEdit}
                            />

                            <Field
                                label="Confirm Password"
                                type="password"
                                value={form.confirm_password}
                                onChange={(v) =>
                                    updateField(
                                        "confirm_password",
                                        v
                                    )
                                }
                                required={!isEdit}
                            />
                        </div>

                        {isEdit && (
                            <p className="mt-2 text-xs text-gray-400">
                                Leave the password fields empty to
                                keep the current password.
                            </p>
                        )}

                        {passwordError && (
                            <p className="mt-2 text-sm text-red-500">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Field
                            label="Address"
                            value={form.address || ""}
                            onChange={(v) =>
                                updateField("address", v)
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Field
                            label="Allergies"
                            value={form.allergies || ""}
                            onChange={(v) =>
                                updateField("allergies", v)
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Field
                            label="Chronic Conditions"
                            value={form.chronic_conditions || ""}
                            onChange={(v) =>
                                updateField(
                                    "chronic_conditions",
                                    v
                                )
                            }
                        />
                    </div>

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
                                : isEdit
                                ? "Update Patient"
                                : "Create Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}


/* =========================================================
   PATIENT VIEW
========================================================= */

function PatientViewModal({ patient, onClose }) {
    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800">
                Patient Details
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Info label="Patient ID" value={patient.id} />

                <Info
                    label="Name"
                    value={`${patient.first_name} ${patient.last_name}`}
                />

                <Info label="Date of Birth" value={patient.dob} />

                <Info label="Gender" value={patient.gender} />

                <Info label="Email" value={patient.email} />

                <Info label="Phone" value={patient.phone} />

                <Info
                    label="Blood Group"
                    value={patient.blood_group}
                />

                <Info
                    label="Emergency Contact"
                    value={patient.emergency_contact}
                />

                <Info
                    label="Address"
                    value={patient.address}
                    full
                />

                <Info
                    label="Allergies"
                    value={patient.allergies}
                    full
                />

                <Info
                    label="Chronic Conditions"
                    value={patient.chronic_conditions}
                    full
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
   SHARED MODAL
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


/* =========================================================
   INPUT
========================================================= */

function Field({
    label,
    value,
    onChange,
    type = "text",
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <input
                type={type}
                value={value ?? ""}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}


/* =========================================================
   INFO
========================================================= */

function Info({ label, value, full = false }) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {value || "—"}
            </div>
        </div>
    );
}


/* =========================================================
   DELETE
========================================================= */

function DeleteModal({
    title,
    name,
    onClose,
    onConfirm,
}) {
    const [deleting, setDeleting] = useState(false);

    async function handleConfirm() {
        setDeleting(true);

        try {
            await onConfirm();
        } finally {
            setDeleting(false);
        }
    }

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
                    disabled={deleting}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    onClick={handleConfirm}
                    disabled={deleting}
                    className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </Modal>
    );
}