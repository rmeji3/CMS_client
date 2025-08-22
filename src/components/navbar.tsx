import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { IoIosLogOut } from "react-icons/io";

const API = "https://localhost:7108";

function getXsrfCookie(): string {
  const k = "XSRF-TOKEN=";
  return document.cookie
    .split("; ")
    .find((x) => x.startsWith(k))
    ?.substring(k.length) ?? "";
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function checkSession() {
    try {
      const res = await fetch(`${API}/Profile/me`, { credentials: "include" });
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    // make sure CSRF cookie exists once per session
    fetch(`${API}/antiforgery/token`, { credentials: "include" }).finally(checkSession);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // re-check when route changes (e.g., after login navigation)
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-TOKEN": getXsrfCookie() }, // ✅ CSRF header
      });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setIsLoggedIn(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 top-0 bg-gray-100">
      <div className="font-bold text-xl">
        <Link to="/" className="no-underline">CMS Client</Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/" className="no-underline font-medium hover:underline">Home</Link>
        {isLoggedIn ? (
          <button className="h-[40px] w-[140px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-10 overflow-visible bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg cursor-pointer"
                  onClick={handleLogout}>
            <span className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-0 blur-2xl pointer-events-none transition-all duration-700 group-hover:opacity-40"></span>
			<div className="flex justify-center items-center gap-2">
				<IoIosLogOut className="h-[20px] w-[20px] z-10" />
				<span className="relative z-10">Logout</span>
			</div>
            
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-70 blur-sm transition-all duration-700 group-hover:opacity-100 pointer-events-none"></span>
          </button>
        ) : (
          <button className="h-[40px] w-[100px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-10 overflow-visible bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg cursor-pointer"
                  onClick={() => navigate("/login")}>
            <span className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-0 blur-2xl pointer-events-none transition-all duration-700 group-hover:opacity-40"></span>
            <span className="relative z-10">Login</span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-70 blur-sm transition-all duration-700 group-hover:opacity-100 pointer-events-none"></span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
