import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BillForm from "./pages/BillForm";
import BillsList from "./pages/BillsList";
import InstallPWAButton from "./components/InstallPWAButton";
import { useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/new-bill", label: "New Bill" },
    { to: "/bills", label: "All Bills" },
  ];
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-900 shadow-lg py-2 lg:p-4 px-8 flex flex-col lg:flex-row items-center justify-between">
      <div className="lg:text-2xl text-lg font-extrabold text-white tracking-wide mb-3 mt-2">e-Billing</div>
      <div className="flex gap-6">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`lg:text-lg text-md font-medium p-[5px] mb-4 lg:p-2 rounded transition ${
              location.pathname === link.to
                ? "bg-white text-blue-700 shadow"
                : "text-white hover:bg-blue-600 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <InstallPWAButton />
    </nav>
  );
}

function App() {
  useEffect(() => {
    fetch("https://ebillingbackend.onrender.com/api/bills")
      .then(() => {})
      .catch(() => {});
  }, []);
  return (
    <Router>
      <Navbar />
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-bill" element={<BillForm />} />
          <Route path="/bills" element={<BillsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;