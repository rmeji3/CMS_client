import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useFetchAntiforgeryTokenQuery } from "../services/antiforgery";
import { useFetchProfileQuery } from "../services/profile";
import { skipToken } from "@reduxjs/toolkit/query";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLoginRoute = pathname === "/login";
  const { data: profileData, isLoading: profileLoading, isSuccess: profileSuccess, refetch: refetchProfile } = useFetchProfileQuery(isLoginRoute ? (skipToken as any) : undefined, { refetchOnMountOrArgChange: true, refetchOnFocus: true, refetchOnReconnect: true });
  const { isLoading: antiforgeryLoading, refetch: refetchAntiforgery } = useFetchAntiforgeryTokenQuery();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    refetchAntiforgery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for unsaved-changes state from the editor
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      setHasUnsavedChanges(!!ce.detail);
    };
    window.addEventListener('unsaved-changes', handler as EventListener);
    return () => window.removeEventListener('unsaved-changes', handler as EventListener);
  }, []);

  useEffect(() => {
    if (profileSuccess) {
      refetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, profileSuccess]);

  if (profileLoading || antiforgeryLoading) {
    return <div>Loading…</div>;
  }

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. If you log out now, they will be lost. Continue?');
      if (!ok) return;
    }
    // Delegate logout flow to parent (App) to avoid double-calls
    onLogout();
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 top-0 bg-gray-100">
      <div className="font-bold text-xl">
        {profileData ? (
          <span className="pointer-events-none">CMS Client</span>
        ) : (
          <Link to="/" className="no-underline">CMS Client</Link>
        )}
      </div>
      <div className="flex items-center gap-6">
  {profileSuccess ? (
          <>
            <Link to="/home" className="no-underline font-medium hover:underline">Home</Link>
            <Link to="/account" className="no-underline font-medium hover:underline">Account</Link>
            <button
              className="h-[40px] w-[140px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-10 overflow-visible bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg cursor-pointer"
              onClick={handleLogout}
            >
              <span className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-0 blur-2xl pointer-events-none transition-all duration-700 group-hover:opacity-40"></span>
              <div className="flex justify-center items-center gap-2">
                <IoIosLogOut className="h-[20px] w-[20px] z-10" />
                <span className="relative z-10">Logout</span>
              </div>
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-70 blur-sm transition-all duration-700 group-hover:opacity-100 pointer-events-none"></span>
            </button>
          </>
        ) : (
          <button
            className="h-[40px] w-[100px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-10 overflow-visible bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg cursor-pointer"
            onClick={() => navigate("/login")}
          >
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
