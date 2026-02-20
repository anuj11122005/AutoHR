import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function LeaveStatus() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Leave Status</h1>

        <div className="card" style={{ marginTop: "20px" }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20 Feb 2026</td>
                <td>Sick Leave</td>
                <td className="approved">Approved</td>
              </tr>
              <tr>
                <td>25 Feb 2026</td>
                <td>Casual Leave</td>
                <td className="pending">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
}

export default LeaveStatus;