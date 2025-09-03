import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/" replace />
  );
}