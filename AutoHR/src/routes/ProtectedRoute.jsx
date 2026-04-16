import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("autohr_user");

  // If no user stored → redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user exists → allow access
  return children;
}