import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function ApplyLeave() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Apply Leave</h1>

        <div className="card" style={{ marginTop: "20px" }}>
          <form>
            <input type="date" required />
            <input type="date" required />
            <select>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Paid Leave</option>
            </select>
            <textarea placeholder="Reason" rows="4" />
            <button type="submit">Submit Request</button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}

export default ApplyLeave;