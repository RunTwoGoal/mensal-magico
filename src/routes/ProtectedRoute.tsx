import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // manda pro login, guardando a rota de origem
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
}