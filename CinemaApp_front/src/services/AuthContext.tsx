import { createContext, useContext, ReactNode } from "react";
import { getToken, decodeToken } from "./authService";

interface AuthContextType {
  isAdmin: boolean;
  isEmployee: boolean;
  isAuthenticated: boolean;
  email: string | null;
  nameidentifier: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = getToken();
  const decoded = token ? decodeToken(token) : null;

  const isAdmin = decoded?.role === "Admin";
  const isEmployee = decoded?.role === "Employee";
  const isAuthenticated = !!token;
  const email = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null;
  const nameidentifier = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
  
  return (
    <AuthContext.Provider value={{ isAdmin, isEmployee, isAuthenticated, email, nameidentifier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
