import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("Employee");

  const handleLogin = (e) => {
    e.preventDefault();

    login(role); // 🔥 IMPORTANT
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <motion.div className="login-card">
        <h1 className="login-title">AutoHR</h1>

        <form onSubmit={handleLogin}>
          <input type="email" required />
          <input type="password" required />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
          </select>

          <button type="submit">
            Login as {role}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;