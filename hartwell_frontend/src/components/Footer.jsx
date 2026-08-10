export default function Footer() {
    return (<footer className="text-gray-600 body-font border-t border-gray-100">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
            <a
                href="/"
                className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900 cursor-pointer"
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

            <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                © {new Date().getFullYear()} Hartwell Healthcare System
            </p>
        </div>
    </footer>)
}