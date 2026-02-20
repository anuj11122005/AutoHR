import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function Reports() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Reports & Analytics</h1>

        <div className="card" style={{ marginTop: "20px" }}>
          <p>Monthly leave statistics will appear here.</p>
        </div>
      </motion.div>
    </Layout>
  );
}

export default Reports;