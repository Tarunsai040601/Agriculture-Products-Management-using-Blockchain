import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Admin_Navbar.css'

const Admin_Navbar = () => {

  const [toggleMenu, setToggleMenu] = useState(false)

  const navigate = useNavigate()

  // ===== GET ADMIN NAME =====
  const adminName =
    localStorage.getItem("admin_name")

  // ===== LOGOUT =====
  const handleLogout = () => {

    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_name")

    navigate("/")
  }

  return (

    <div className='admin-navbar'>

      {/* ===== Logo ===== */}

      <div className='admin-logo'>
        <h1>👨‍🌾 AgriChain Admin</h1>
      </div>

      {/* ===== Desktop Links ===== */}

      <div className='admin-nav-links'>

        <Link to="/home">
          Home
        </Link>

        <Link to="/createfarmers">
          CreateFarmers
        </Link>

        <Link to="/createdealers">
          CreateDealers
        </Link>

        <Link to="/showfarmers">
          ShowFarmers
        </Link>

        <Link to="/showdealers">
          ShowDealers
        </Link>

      </div>

      {/* ===== Desktop Right Section ===== */}

      <div className='admin-right-section'>

        {/* ===== Profile ===== */}

        <div className='admin-profile'>

          {/* ===== IMAGE ICON ===== */}

          

          {/* ===== WELCOME ===== */}

          <h1 className='admin-welcome'>

            Welcome :
            <span>
              {" "}Hi {adminName || "Admin"}👨‍🌾
            </span>

          </h1>

        </div>

        {/* ===== LOGOUT ===== */}

        <button
          className='admin-logout-btn'
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* ===== Mobile Toggle ===== */}

      <div
        className='admin-toggle'
        onClick={() =>
          setToggleMenu(!toggleMenu)
        }
      >

        <span></span>
        <span></span>
        <span></span>

      </div>

      {/* ===== Mobile Menu ===== */}

      {
        toggleMenu && (

          <div className='admin-mobile-menu'>

            <Link to="/home">
              Home
            </Link>

            <Link to="/createfarmers">
              CreateFarmers
            </Link>

            <Link to="/createdealers">
              CreateDealers
            </Link>

            <Link to="/showfarmers">
              ShowFarmers
            </Link>

            <Link to="/showdealers">
              ShowDealers
            </Link>

            {/* ===== MOBILE PROFILE ===== */}

            <div className='mobile-profile'>

              

              <h1 className='mobile-welcome'>

                Welcome :
                <span>
                  {" "}Hi {adminName || "Admin"}👨‍🌾
                </span>

              </h1>

            </div>

            {/* ===== MOBILE LOGOUT ===== */}

            <button
              className='mobile-logout-btn'
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

export default Admin_Navbar