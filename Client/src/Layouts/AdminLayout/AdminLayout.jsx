import React from "react";
import Admin_Navbar from "../../Components/DashBoards/AdminDashboard/Admin_Navbar/Admin_Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <Admin_Navbar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
