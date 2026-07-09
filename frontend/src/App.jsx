import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Auth, dashboards, and worker pages come in Step 2+ */}
          <Route
            path="*"
            element={
              <div className="text-center py-20 text-gray-500">
                Page not found
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}