import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("autohr_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // We try to use the n8n API. If it fails (maybe n8n isn't running), we fallback or throw.
    try {
      const response = await api.login(credentials);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem("autohr_user", JSON.stringify(response.user));
        // Store auth token for subsequent API calls
        if (response.token) {
          localStorage.setItem("autohr_token", response.token);
        }
        return { success: true };
      } else {
        return { success: false, message: response.message || "Login failed" };
      }
    } catch (error) {
      // For demo purposes if n8n is down, let's use the fallback mock credentials
      console.warn("API failed, using fallback authentication", error);
      if (credentials.email === "admin@autohr.com" && credentials.password === "admin123") {
        const mockUser = { id: 1, email: credentials.email, name: "Alex Johnson", role: "Admin" };
        setUser(mockUser);
        localStorage.setItem("autohr_user", JSON.stringify(mockUser));
        localStorage.setItem("autohr_token", "mock-admin-token");
        return { success: true };
      } else if (credentials.email === "hr@autohr.com" && credentials.password === "hr1234") {
        const mockUser = { id: 2, email: credentials.email, name: "Sara Williams", role: "HR Manager" };
        setUser(mockUser);
        localStorage.setItem("autohr_user", JSON.stringify(mockUser));
        localStorage.setItem("autohr_token", "mock-hr-token");
        return { success: true };
      } else if (credentials.email === "employee@autohr.com" && credentials.password === "emp123") {
        const mockUser = { id: 3, email: credentials.email, name: "John Smith", role: "Employee" };
        setUser(mockUser);
        localStorage.setItem("autohr_user", JSON.stringify(mockUser));
        localStorage.setItem("autohr_token", "mock-jwt-token-123");
        return { success: true };
      }
      return { success: false, message: "Invalid email or password." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("autohr_user");
    localStorage.removeItem("autohr_token");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}