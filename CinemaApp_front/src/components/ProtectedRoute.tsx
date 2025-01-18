import { Navigate } from "react-router-dom";
import { getToken, decodeToken } from "../services/authService";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = decodeToken(token);

    if (decoded.exp * 1000 < Date.now()) {
      return <Navigate to="/" />;
    }

    const isAdmin = decoded.role === "Admin";
    const isEmployee = decoded.role === "Employee";

    if (!isAdmin && !isEmployee) {
      return <Navigate to="/" />;
    }
  } catch {
    return <Navigate to="/" />;
  }

  return children;
}
