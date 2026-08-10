import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Header from "./components/Header";
import Footer from "./components/Footer"
import PatientRegister from "./pages/patient/PatientRegister";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientManagement from "./pages/admin/PatientManagement";
import DoctorManagement from "./pages/admin/DoctorManagement";
import PatientDashboard from "./pages/patient/PatientDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
      <Header></Header>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/patients" element={<PatientManagement/>} />
          <Route path="/admin/doctors" element={<DoctorManagement />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Routes>
      <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;