import React from "react";
import { Outlet } from "react-router-dom";
import DealerNavbar from "../../Components/DashBoards/DealerDashboard/DealerNavbar/DealerNavbar";

const DealerLayout = () => {
  return (
    <div>
      <DealerNavbar />
      <Outlet />
    </div>
  );
};

export default DealerLayout;
