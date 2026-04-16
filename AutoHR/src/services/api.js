const BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "http://localhost:5678/webhook";

/**
 * Helper to get stored auth token
 */
function getAuthHeaders() {
  const token = localStorage.getItem("autohr_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Unable to connect to authentication server.");
    }
  },

  applyLeave: async (leaveData) => {
    try {
      const response = await fetch(`${BASE_URL}/leave/apply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(leaveData),
      });
      return await response.json();
    } catch (error) {
      console.error("Apply Leave Error:", error);
      throw new Error("Unable to submit leave request.");
    }
  },

  getLeaves: async (employeeId, role) => {
    try {
      const url = new URL(`${BASE_URL}/leave/status`);
      if (employeeId) url.searchParams.append("employeeId", employeeId);
      if (role) url.searchParams.append("role", role);
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Get Leaves Error:", error);
      throw new Error("Unable to fetch leaves.");
    }
  },

  updateLeaveStatus: async (leaveId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/leave/approve`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ leaveId, status }),
      });
      return await response.json();
    } catch (error) {
      console.error("Update Leave Status Error:", error);
      throw new Error("Unable to update leave status.");
    }
  },

  getDashboardMetrics: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/metrics`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Dashboard Metrics Error:", error);
      throw new Error("Unable to fetch dashboard metrics.");
    }
  },
};