import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API = "https://localhost:7108";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await fetch(`${API}/antiforgery/token`, { credentials: "include" });
        const res = await fetch(`${API}/Profile/me`, { credentials: "include" });
        if (!mounted) return;
        setOk(res.ok);
      } catch (e) {
        if (!mounted) return;
        console.error("Auth check failed:", e);
        setOk(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (ok === null) return <div>Loading…</div>;
  return ok ? <>{children}</> : <Navigate to="/login" replace />;
}
