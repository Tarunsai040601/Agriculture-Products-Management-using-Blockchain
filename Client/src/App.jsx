import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'

import AdminLayout from './Layouts/AdminLayout/AdminLayout'
import FamerLayout from './Layouts/FarmerLayout/FarmerLayout'
import CustomerLayout from './Layouts/CustomerLayout/CustomerLayout'
import DealerLayout from './Layouts/DealerLayout/DealerLayout'

const App = () => {

  return (

    <div>

      <Routes>

        {/* ===== DEFAULT CUSTOMER PAGE ===== */}

        <Route
          path='/'
          element={<CustomerLayout />}
        />

        {/* ===== LOGIN PAGE ===== */}

        <Route
          path='/login'
          element={<Login />}
        />

        {/* ===== REGISTER PAGE ===== */}

        <Route
          path='/register'
          element={<Register />}
        />

        {/* ===== ADMIN DASHBOARD ===== */}

        <Route
          path='/adminDashboard'
          element={<AdminLayout />}
        />

        {/* ===== FARMER DASHBOARD ===== */}

        <Route
          path='/farmerDashboard'
          element={<FamerLayout />}
        />

        {/* ===== DEALER DASHBOARD ===== */}

        <Route
          path='/dealerDashboard'
          element={<DealerLayout />}
        />

        {/* ===== CUSTOMER DASHBOARD ===== */}

        <Route
          path='/customerDashboard'
          element={<CustomerLayout />}
        />

      </Routes>

    </div>
  )
}

export default App