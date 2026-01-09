import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const NavBar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLetter, setUserLetter] = useState("");

  /* ✅ LOAD USER FROM LOCAL STORAGE */
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const letter =
          parsed.email?.[0]?.toUpperCase() ||
          parsed.name?.[0]?.toUpperCase() ||
          "";
        setUserLetter(letter);
      } catch {
        setUserLetter("");
      }
    } else {
      setUserLetter("");
    }
  };

  useEffect(() => {
    loadUser();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", loadUser);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", loadUser);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ✅ LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserLetter("");
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-20 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur shadow-md py-3"
            : "py-5 text-white"
        }`}
      >
        {/* ===== SMARTCAST LOGO ===== */}
        <Link
          to="/"
          className={`font-bold text-2xl tracking-wide ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          SmartCast
        </Link>

        {/* ===== RIGHT SIDE ===== */}
        <div className="relative flex items-center">
          {!userLetter ? (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-black text-white px-7 py-2 rounded-full"
            >
              Login
            </button>
          ) : (
            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold cursor-pointer"
                title="Logged in"
              >
                {userLetter}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow text-sm">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={() => {
            setShowLogin(false);
            loadUser();
          }}
        />
      )}

      {/* ================= REGISTER MODAL ================= */}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitch={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default NavBar;
