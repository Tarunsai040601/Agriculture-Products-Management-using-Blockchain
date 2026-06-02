import React from "react";
import { Route, Routes } from "react-router-dom";

import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";

import AdminLayout from "./Layouts/AdminLayout/AdminLayout";
import FamerLayout from "./Layouts/FarmerLayout/FarmerLayout";
import CustomerLayout from "./Layouts/CustomerLayout/CustomerLayout";
import DealerLayout from "./Layouts/DealerLayout/DealerLayout";
import AdminHome from "./Components/DashBoards/AdminDashboard/AdminHome/AdminHome";
import CreateFarmer_Dealer from "./Components/DashBoards/AdminDashboard/CreateFamer_Dealer/CreateFarmer_Dealer";
import Show_Farmers from "./Components/DashBoards/AdminDashboard/Show_Farmers/Show_Farmers";
import Show_Dealers from "./Components/DashBoards/AdminDashboard/Show_Dealers/Show_Dealers";
import FarmerHomePage from "./Components/DashBoards/FarmerDashboard/FarmerHomePage/FarmerHomePage";
import UploadItems from "./Components/DashBoards/FarmerDashboard/UploadItems/UploadItems";
import ShowItems from "./Components/DashBoards/FarmerDashboard/ShowItems/ShowItems";
import ShowDealers from "./Components/DashBoards/FarmerDashboard/ShowDealers/ShowDealers";
import Orders from "./Components/DashBoards/FarmerDashboard/Orders/Orders";
import DealerHome from "./Components/DashBoards/DealerDashboard/DealerHome/DealerHome";
import MyJob from "./Components/DashBoards/DealerDashboard/Myjob/MyJob";

import CustomerHomePage from "./Components/DashBoards/CustomerDashboard/CustomerHomePage/CustomerHomePage";
import About from "./Components/DashBoards/CustomerDashboard/About/About";
import Items from "./Components/DashBoards/CustomerDashboard/Items/Items";
import Myoders from "./Components/DashBoards/CustomerDashboard/Myoders/Myoders";
import Tracking from "./Components/DashBoards/CustomerDashboard/Tracking/Tracking";
import Reviews from "./Components/DashBoards/CustomerDashboard/Reviews/Reviews";

const App = () => {
  return (
    <div>
      <Routes>
        {/* ===== CUSTOMER PAGES ===== */}

        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerHomePage />} />
          <Route path="about" element={<About />} />
          <Route path="items" element={<Items />} />
          <Route path="myorders" element={<Myoders />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        {/* ===== LOGIN PAGE ===== */}

        <Route path="/login" element={<Login />} />

        {/* ===== REGISTER PAGE ===== */}

        <Route path="/register" element={<Register />} />

        {/* ===== ADMIN DASHBOARD ===== */}

        <Route path="/adminDashboard" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route
            path="createfarmers_Dealer"
            element={<CreateFarmer_Dealer />}
          />
          <Route path="showfarmers" element={<Show_Farmers />} />
          <Route path="showdealers" element={<Show_Dealers />} />
        </Route>

        {/* ===== FARMER DASHBOARD ===== */}
        <Route path="/farmerDashboard" element={<FamerLayout />}>
          <Route index element={<FarmerHomePage />} />
          <Route path="uploaditems" element={<UploadItems />} />
          <Route path="showitems" element={<ShowItems />} />
          <Route path="showdealer" element={<ShowDealers />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* ===== DEALER DASHBOARD ===== */}

        <Route path="/dealerDashboard" element={<DealerLayout />}>
          <Route index element={<DealerHome />} />
          <Route path="myjob" element={<MyJob />} />
        </Route>

       
      </Routes>
    </div>
  );
};

export default App;
