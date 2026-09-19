import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import StudentDashboard from '@/pages/StudentDashboard';
import SubmitComplaintPage from '@/pages/SubmitComplaintPage';
import MyComplaintsPage from '@/pages/MyComplaintsPage';
import StaffDashboard from '@/pages/StaffDashboard';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/submit" element={<SubmitComplaintPage />} />
        <Route path="/student/complaints" element={<MyComplaintsPage />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/complaints" element={<StaffDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
