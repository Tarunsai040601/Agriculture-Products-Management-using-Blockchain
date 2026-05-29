import React from 'react'
import { Outlet } from 'react-router-dom'
import FarmerNavbar from '../../Components/DashBoards/FarmerDashboard/FarmerNavbar/FarmerNavbar'

const FamerLayout = () => {
  return (
    <div>
      <FarmerNavbar/>
      <Outlet/>
    </div>
  )
}

export default FamerLayout
