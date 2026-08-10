import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (<header className="text-gray-600 body-font border-b border-gray-100">
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <a
        href="/"
        className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 cursor-pointer"
      >
        <div className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <span className="ml-3 text-xl">Hartwell</span>
      </a>

      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <a
          href="#features"
          className="mr-5 hover:text-gray-900 cursor-pointer"
        >
          Features
        </a>

        <a
          href="#patients"
          className="mr-5 hover:text-gray-900 cursor-pointer"
        >
          Patients
        </a>

        <a
          href="#doctors"
          className="mr-5 hover:text-gray-900 cursor-pointer"
        >
          Doctors
        </a>

        <a
          href="#ai"
          className="mr-5 hover:text-gray-900 cursor-pointer"
        >
          AI Assistant
        </a>
      </nav>

      {localStorage.getItem("access_token") ?
        <button
          onClick={logout}
          className="inline-flex items-center bg-gray-100 border-0 py-2 px-4 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 cursor-pointer"
        >
          Logout
        </button> :
        <a
          href="/login"
          className="inline-flex items-center bg-gray-100 border-0 py-2 px-4 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 cursor-pointer"
        >
          Login

          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>}
    </div>
  </header>)
}