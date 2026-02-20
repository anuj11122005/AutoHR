import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function Approval() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Approval Panel</h1>

        <div className="card" style={{ marginTop: "20px" }}>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Anuj</td>
                <td>Sick Leave</td>
                <td>
                  <button>Approve</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
}

export default Approval;