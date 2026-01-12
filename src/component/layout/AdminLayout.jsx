import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiMap,
  FiMapPin,
  FiUsers,
  FiMail,
  FiLogOut,
} from "react-icons/fi";

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLogoutPopup(false);
    navigate("/admin/login");
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= TOP BAR ================= */}
      {/* Desktop */}
      <div className="hidden md:flex fixed top-0 left-0 w-full h-[72px] bg-white shadow z-30 px-6 items-center">
        <h1 className="text-2xl font-semibold text-gray-700">
          Admin Panel
        </h1>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full h-[64px] bg-pink-600 text-white flex items-center justify-between px-4 z-30 shadow">
        <h1 className="text-lg font-semibold">Girls Panel</h1>
        <button onClick={() => setIsOpen(true)}>
          <FiMenu size={26} />
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed
          top-[64px] md:top-[72px]
          left-0
          h-[calc(100vh-64px)] md:h-[calc(100vh-72px)]
          w-64
          bg-gradient-to-b from-pink-600 to-pink-400
          text-white
          p-6
          z-40
          overflow-y-auto
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close Button - Mobile */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={() => setIsOpen(false)}
        >
          <FiX size={28} />
        </button>

        {/* Logo */}
        <h1 className="text-3xl font-bold mb-10 text-center">
          Girls
        </h1>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 font-medium">
          {[
            { to: "/admin/all-state", icon: <FiMap />, label: "State" },
            { to: "/admin/all-cities", icon: <FiMapPin />, label: "City" },
            { to: "/admin/model-girl", icon: <FiUsers />, label: "Model Girl" },
            { to: "/admin/all-contacts", icon: <FiMail />, label: "Contact" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md flex items-center gap-3 transition ${
                  isActive
                    ? "bg-white text-pink-600 font-semibold shadow"
                    : "hover:bg-pink-300"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-10">
          <button
            onClick={() => setLogoutPopup(true)}
            className="w-full bg-white text-pink-600 font-semibold py-2 rounded-md shadow hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className="
          pt-[64px] md:pt-[72px]
          md:ml-64
          p-4 md:p-6
          min-h-screen
        "
      >
        {children}
      </main>

      {/* ================= LOGOUT MODAL ================= */}
      {logoutPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-8 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-gray-500 mt-2">
              You will be logged out.
            </p>

            <div className="flex justify-center my-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <FiLogOut size={40} className="text-red-500" />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setLogoutPopup(false)}
                className="px-6 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
