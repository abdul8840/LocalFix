import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import RegisterChoice from "./pages/RegisterChoice.jsx";
import RegisterCustomer from "./pages/RegisterCustomer.jsx";
import RegisterWorker from "./pages/RegisterWorker.jsx";
import Services from "./pages/Services.jsx";
import WorkerDetail from "./pages/WorkerDetail.jsx";
import BookService from "./pages/BookService.jsx";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard.jsx";
import WorkerDashboard from "./pages/dashboards/WorkerDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminWorkers from "./pages/admin/AdminWorkers.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";
import AdminFraud from "./pages/admin/AdminFraud.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterChoice />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/worker" element={<RegisterWorker />} />

          <Route path="/services" element={<Services />} />
          <Route path="/workers/:id" element={<WorkerDetail />} />

          <Route path="/book/:workerId" element={
            <ProtectedRoute roles={["customer"]}><BookService /></ProtectedRoute>
          } />

          <Route path="/customer" element={
            <ProtectedRoute roles={["customer"]}><CustomerDashboard /></ProtectedRoute>
          } />
          <Route path="/worker" element={
            <ProtectedRoute roles={["worker"]}><WorkerDashboard /></ProtectedRoute>
          } />

          {/* Admin — nested layout */}
          <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="fraud" element={<AdminFraud />} />
          </Route>

          <Route path="*" element={
            <div className="text-center py-20 text-gray-500">Page not found</div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}