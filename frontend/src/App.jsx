import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import RegisterChoice from "./pages/RegisterChoice.jsx";
import RegisterCustomer from "./pages/RegisterCustomer.jsx";
import RegisterWorker from "./pages/RegisterWorker.jsx";
import Services from "./pages/Services.jsx";
import WorkerDetail from "./pages/WorkerDetail.jsx";
import BookService from "./pages/BookService.jsx";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard.jsx";
import WorkerDashboard from "./pages/dashboards/WorkerDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterChoice />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/worker" element={<RegisterWorker />} />

          {/* Public browse */}
          <Route path="/services" element={<Services />} />
          <Route path="/workers/:id" element={<WorkerDetail />} />

          {/* Customer booking (auth required) */}
          <Route path="/book/:workerId" element={
            <ProtectedRoute roles={["customer"]}>
              <BookService />
            </ProtectedRoute>
          } />

          {/* Dashboards */}
          <Route path="/customer" element={
            <ProtectedRoute roles={["customer"]}><CustomerDashboard /></ProtectedRoute>
          } />
          <Route path="/worker" element={
            <ProtectedRoute roles={["worker"]}><WorkerDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={
            <div className="text-center py-20 text-gray-500">Page not found</div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}