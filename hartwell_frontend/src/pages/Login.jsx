import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

// Change these if your backend routes are different.
const LOGIN_ENDPOINTS = {
  patient: `${API_BASE_URL}/patients/login`,
  doctor: `${API_BASE_URL}/doctors/login`,
  admin: `${API_BASE_URL}/admins/login`,
};

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(LOGIN_ENDPOINTS[role], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      // Store authentication information.
      localStorage.setItem("access_token", data.access_token);

      localStorage.setItem("user_role", role);
      localStorage.setItem("user_id", data.user_id);

      // Redirect according to account type.
      if (role === "patient") {
        navigate("/patient/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/admin/dashboard")
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-160px)] flex items-center">
      <div className="container px-5 py-2 mx-auto">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center">
            <p className="text-gray-600 md:text-lg">
              Welcome back
            </p>

            <h1 className="mt-3 text-3xl font-medium text-gray-800 capitalize lg:text-4xl">
              Login to your account
            </h1>

            <p className="mt-4 text-gray-500">
              Access your healthcare information and
              AI-powered assistant securely.
            </p>
          </div>

          {/* Login Card */}
          <div className="max-w-xl mx-auto mt-10">

            <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">

              {/* Account Type */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Login as
                </p>

                <div className="grid grid-cols-3 gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setRole("patient");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition ${role === "patient"
                        ? "text-white bg-blue-500 border-blue-500"
                        : "text-gray-600 bg-white border-gray-200 hover:border-blue-400"
                      }`}
                  >
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

                    Patient
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("doctor");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition ${role === "doctor"
                        ? "text-white bg-blue-500 border-blue-500"
                        : "text-gray-600 bg-white border-gray-200 hover:border-blue-400"
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="currentColor" fill-rule="evenodd" d="M34 16c0 5.523-4.477 10-10 10s-10-4.477-10-10S18.477 6 24 6s10 4.477 10 10m-2 0a8 8 0 1 1-16 0a8 8 0 0 1 16 0M17.914 28.855l.011.022l.075.147h11.749c.229-.434.748-1.126 1.251-1.011c1.13.257 2.268.615 3.361 1.056l.033-.016l.011.022l.008.015C38.528 30.762 42 33.596 42 36.57V42H6v-5.43c0-3.775 5.596-7.327 11-8.557c.441-.1.703.42.914.842m14.79 1.728a20 20 0 0 0-1.301-.407l-.446.848H16.793l-.414-.787l-.36.108q-.011.098-.016.224c-.013.345.013.754.07 1.17a8 8 0 0 0 .28 1.281a3 3 0 1 1-1.957.444l-.008-.028a10 10 0 0 1-.297-1.426a10 10 0 0 1-.084-.928c-1.236.528-2.389 1.166-3.355 1.87C8.73 34.356 8 35.668 8 36.57V40h32v-3.43c0-.903-.73-2.215-2.652-3.617a16.6 16.6 0 0 0-2.666-1.562A10.5 10.5 0 0 1 34.434 33H35a1 1 0 0 1 .894.553l1 2c.07.139.106.292.106.447v2a1 1 0 0 1-1 1h-2v-2h1v-.764L34.382 35h-2.764L31 36.236V37h1v2h-2a1 1 0 0 1-1-1v-2c0-.155.036-.308.106-.447l1-2A1 1 0 0 1 31 33h1.362l.037-.124c.094-.321.178-.72.235-1.136c.056-.412.082-.815.07-1.157M17 36c0 .574-.462 1.015-1 1.015s-1-.44-1-1.015c0-.574.462-1.015 1-1.015s1 .44 1 1.015" clip-rule="evenodd" /></svg>
                    Doctor
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("admin");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition ${role === "admin"
                        ? "text-white bg-blue-500 border-blue-500"
                        : "text-gray-600 bg-white border-gray-200 hover:border-blue-400"
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    Admin
                  </button>

                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 mt-6 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >

                {/* Email */}
                <div className="relative flex items-center">
                  <span className="absolute left-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                    className="block w-full py-3 text-gray-700 bg-white border border-gray-200 rounded-lg px-11 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Email address"
                  />
                </div>

                {/* Password */}
                <div className="relative flex items-center mt-4">
                  <span className="absolute left-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                    className="block w-full px-11 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Password"
                  />
                </div>

                {/* Submit */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 bg-blue-500 rounded-lg hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    {loading
                      ? "Signing in..."
                      : `Sign in as ${role === "patient"
                        ? "Patient"
                        : role === "doctor" ? "Doctor" : "Admin"
                      }`}
                  </button>
                </div>

              </form>

              {/* Register */}
              <div className="mt-6 text-sm text-center text-gray-500">
                {role === "patient" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/patient/register")
                      }
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Create patient account
                    </button>
                  </>
                ) : (
                  <>
                  </>
                )}
              </div>

              {/* Forgot password */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}