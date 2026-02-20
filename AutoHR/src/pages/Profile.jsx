import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function Profile() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>User Profile</h1>

        <div className="card" style={{ marginTop: "20px" }}>
          <p><strong>Name:</strong> Anuj Raval</p>
          <p><strong>Role:</strong> Manager</p>
          <p><strong>Email:</strong> anuj@company.com</p>
        </div>
      </motion.div>
    </Layout>
  );
}

export default Profile;