import React from "react";
import { Outlet } from "react-router-dom";
import CustomerNavbar from "../../Components/DashBoards/CustomerDashboard/CustomerNavbar/CustomerNavbar";

const CustomerLayout = () => {
  return (
    <div>
      <CustomerNavbar />
      <Outlet />
    </div>
  );
};

export default CustomerLayout;
