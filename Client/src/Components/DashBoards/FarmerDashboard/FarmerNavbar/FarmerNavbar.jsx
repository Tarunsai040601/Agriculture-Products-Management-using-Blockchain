import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './FarmerNavbar.css'

const FarmerNavbar = () => {

  const [toggleMenu, setToggleMenu] = useState(false)

  const navigate = useNavigate()

  // ===== GET FARMER NAME =====
  const farmerName =
    localStorage.getItem("farmer_name")

  // ===== LOGOUT =====
  const handleLogout = () => {

    localStorage.removeItem("farmer_token")
    localStorage.removeItem("farmer_name")

    navigate("/login")
  }

  return (

    <div className='farmer-navbar'>

      {/* ===== LOGO ===== */}

      <div className='farmer-logo'>

        <h1>
          🌾 FarmerDashBoard
        </h1>

      </div>

      {/* ===== DESKTOP LINKS ===== */}

      <div className='farmer-nav-links'>

        <Link to="/farmerDashboard">
          Home
        </Link>

        <Link to="uploaditems">
          UploadItems
        </Link>

        <Link to="showitems">
          ShowItems
        </Link>

        <Link to="orders">
          Orders
        </Link>

        <Link to="showdealer">
          ShowDealer
        </Link>

      </div>

      {/* ===== RIGHT SECTION ===== */}

      <div className='farmer-right-section'>

        {/* ===== PROFILE ===== */}

        <div className='farmer-profile'>

          <div className='farmer-profile-icon'>
            👨‍🌾
          </div>

          <h1 className='farmer-welcome'>

            Welcome :
            <span>
              {" "}Hi {farmerName || "Farmer"}
            </span>

          </h1>

        </div>

        {/* ===== LOGOUT ===== */}

        <button
          className='farmer-logout-btn'
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* ===== MOBILE TOGGLE ===== */}

      <div
        className='farmer-toggle'
        onClick={() =>
          setToggleMenu(!toggleMenu)
        }
      >

        <span></span>
        <span></span>
        <span></span>

      </div>

      {/* ===== MOBILE MENU ===== */}

      {
        toggleMenu && (

          <div className='farmer-mobile-menu'>

            <Link to="/farmerDashboard">
              Home
            </Link>

            <Link to="/uploaditems">
              UploadItems
            </Link>

            <Link to="/showitems">
              ShowItems
            </Link>

            <Link to="orders">
              Orders
            </Link>

            <Link to="/showdealer">
              ShowDealer
            </Link>

            {/* ===== MOBILE PROFILE ===== */}

            <div className='mobile-farmer-profile'>

              <div className='mobile-farmer-icon'>
                👨‍🌾
              </div>

              <h1 className='mobile-farmer-welcome'>

                Welcome :
                <span>
                  {" "}Hi {farmerName || "Farmer"}
                </span>

              </h1>

            </div>

            {/* ===== MOBILE LOGOUT ===== */}

            <button
              className='mobile-farmer-logout-btn'
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        )
      }

    </div>
  )
}

export default FarmerNavbar