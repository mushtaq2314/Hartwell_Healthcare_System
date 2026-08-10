import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="text-gray-600 body-font">  
      {/* =========================
          HERO
      ========================== */}
      <section className="text-gray-600 body-font mx-20">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <span className="text-indigo-500 font-bold text-4xl mb-4">
              HARTWELL HEALTHCARE SYSTEM
            </span>

            <h1 className="title-font sm:text-3xl text-xl mb-6 font-medium text-gray-900 leading-tight">
              Healthcare management,
              <br className="hidden lg:inline-block" />
              made smarter.
            </h1>

            <p className="mb-8 leading-relaxed text-lg max-w-xl">
              A unified healthcare platform for patients and doctors to
              manage medical records, reports, appointments, medications,
              and AI-assisted healthcare conversations.
            </p>

            <div className="flex justify-center flex-wrap gap-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate("/patient/register")}
                className="inline-flex text-white bg-indigo-500 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg cursor-pointer"
              >
                Patient Portal
              </button>

              <button
                onClick={() => navigate("/login")}
                className="inline-flex text-gray-700 bg-gray-100 border-0 py-3 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg cursor-pointer"
              >
                Doctor Portal
              </button>

              <button
                onClick={() => navigate("/login")}
                className="text-center text-white bg-indigo-500 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg cursor-pointer col-span-2"
              >
                Make an appointment
              </button>
            </div>
          </div>

          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <div className="rounded-2xl bg-indigo-50 p-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      Patient Dashboard
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Welcome back
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                    +
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Reports</p>
                    <p className="text-xl font-semibold text-gray-900">
                      05
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Visits</p>
                    <p className="text-xl font-semibold text-gray-900">
                      08
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Upcoming</p>
                    <p className="text-xl font-semibold text-gray-900">
                      01
                    </p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        Latest Report
                      </p>
                      <p className="text-sm text-gray-500">
                        Complete Blood Count
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3">
                      AI
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        AI Healthcare Assistant
                      </p>
                      <p className="text-xs text-gray-500">
                        Ask about your medical records
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PATIENT / DOCTOR
      ========================== */}
      <section id="patients" className="text-gray-600 body-font bg-gray-50 mx-20">
        <div className="container px-5 py-20 mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-medium title-font text-gray-900 mb-4">
              Built for everyone involved in care
            </h2>

            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Patients get a simple way to manage their healthcare data,
              while doctors get the tools they need to understand and
              manage patient information.
            </p>
          </div>

          <div className="flex flex-wrap -m-4">
            {/* PATIENT */}
            <div className="p-4 md:w-1/2 w-full" id="patients">
              <div className="h-full bg-white border border-gray-200 p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-500 flex items-center justify-center mb-6">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <h2 className="text-2xl font-medium title-font text-gray-900 mb-3">
                  For Patients
                </h2>

                <p className="leading-relaxed mb-6">
                  Keep your healthcare information organized in one place.
                  Access reports, appointments, medications and your
                  medical timeline whenever you need them.
                </p>

                <ul className="mb-6 space-y-2 text-sm">
                  <li>✓ Manage your profile</li>
                  <li>✓ View medical reports</li>
                  <li>✓ Track appointments</li>
                  <li>✓ View medications and timeline</li>
                  <li>✓ Talk to your AI healthcare assistant</li>
                </ul>

                <button
                  onClick={() => navigate("/patient/register")}
                  className="text-indigo-500 inline-flex items-center cursor-pointer"
                >
                  Create patient account
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* DOCTOR */}
            <div className="p-4 md:w-1/2 w-full" id="doctors">
              <div className="h-full bg-white border border-gray-200 p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-500 flex items-center justify-center mb-6">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14v7" />
                    <path d="M5 12v5a7 7 0 0014 0v-5" />
                  </svg>
                </div>

                <h2 className="text-2xl font-medium title-font text-gray-900 mb-3">
                  For Doctors
                </h2>

                <p className="leading-relaxed mb-6">
                  Get a complete view of your patients and use AI-assisted
                  tools to quickly understand their healthcare history and
                  reports.
                </p>

                <ul className="mb-6 space-y-2 text-sm">
                  <li>✓ Manage patients</li>
                  <li>✓ Review medical reports</li>
                  <li>✓ Track appointments and visits</li>
                  <li>✓ Manage prescriptions</li>
                  <li>✓ Use the Doctor AI assistant</li>
                </ul>

                <button
                  onClick={() => navigate("/doctor/register")}
                  className="text-indigo-500 inline-flex items-center cursor-pointer"
                >
                  Create doctor account
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section id="features" className="text-gray-600 body-font mx-20">
        <div className="container px-5 py-20 mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-medium title-font text-gray-900 mb-4">
              Everything in one place
            </h2>

            <p className="lg:w-2/3 mx-auto leading-relaxed">
              Hartwell connects the everyday pieces of healthcare
              management into one system.
            </p>
          </div>

          <div className="flex flex-wrap -m-4">
            {[
              {
                title: "Medical Reports",
                description:
                  "Upload, process and review medical reports with AI-generated summaries.",
              },
              {
                title: "Appointments",
                description:
                  "Keep track of upcoming appointments and previous visits.",
              },
              {
                title: "Medications",
                description:
                  "Keep prescriptions and medication information organized.",
              },
              {
                title: "Medical Timeline",
                description:
                  "View important healthcare events in chronological order.",
              },
              {
                title: "Patient Management",
                description:
                  "Doctors can access the information they need for their patients.",
              },
              {
                title: "AI Assistant",
                description:
                  "Interact with your healthcare information through an AI-powered assistant.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-4 md:w-1/3 sm:w-1/2 w-full"
              >
                <div className="border border-gray-200 p-6 rounded-xl h-full">
                  <div className="w-10 h-10 mb-4 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center">
                    <span className="font-semibold">+</span>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          AI SECTION
      ========================== */}
      <section id="ai" className="text-gray-600 body-font bg-gray-50 mx-20">
        <div className="container mx-auto flex px-5 py-20 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3">
                  AI
                </div>

                <div>
                  <p className="font-medium text-gray-900">
                    Healthcare Assistant
                  </p>

                  <p className="text-xs text-green-500">
                    Ready to help
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-3 text-sm">
                What was in my latest blood report?
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 text-sm">
                Your latest blood report was a Complete Blood Count.
                I can explain the information contained in the report
                and help you understand your recorded results.
              </div>

              <div className="mt-4 border border-gray-200 rounded-lg p-3 text-gray-400 text-sm">
                Ask something about your records...
              </div>
            </div>
          </div>

          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <span className="text-indigo-500 font-medium mb-4">
              AI-POWERED
            </span>

            <h2 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Your healthcare data,
              <br className="hidden lg:inline-block" />
              easier to understand.
            </h2>

            <p className="mb-8 leading-relaxed max-w-xl">
              Hartwell's AI assistants can work with the healthcare
              information available to the patient or doctor, helping
              them interact with reports, visits, medications and
              timelines through natural conversation.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="inline-flex text-white bg-indigo-500 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-600 rounded cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-20 mx-auto">
          <div className="bg-indigo-500 rounded-2xl px-8 py-14 text-center">
            <h2 className="text-3xl font-medium text-white mb-4">
              Ready to get started?
            </h2>

            <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
              Access your healthcare information through the Hartwell
              patient or doctor portal.
            </p>

            <div className="flex justify-center flex-wrap gap-3">
              <button
                onClick={() => navigate("/patient/register")}
                className="inline-flex text-indigo-600 bg-white border-0 py-3 px-6 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Make an appointment
              </button>
              
              <button
                onClick={() => navigate("/patient/register")}
                className="inline-flex text-indigo-600 bg-white border-0 py-3 px-6 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Patient Registration
              </button>

              <button
                disabled
                onClick={() => navigate("/doctor/register")}
                className="inline-flex text-white bg-indigo-600 border border-indigo-400 py-3 px-6 rounded-lg hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
              >
                Doctor Registration
              </button>
            </div>
          </div>
        </div>
      </section>      
    </div>
  );
}