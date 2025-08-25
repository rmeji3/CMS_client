import React from "react";
import { Navigate } from "react-router-dom";
import { useFetchProfileQuery } from "../services/profile";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading, isSuccess } = useFetchProfileQuery(undefined, { refetchOnMountOrArgChange: true, refetchOnFocus: true, refetchOnReconnect: true });

  if (isLoading) return <div>Loading…</div>;
  if (!isSuccess || !profile) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
