import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './DealerNavbar.css'

const DealerNavbar = () => {

  const [toggleMenu, setToggleMenu] =
    useState(false)

  const navigate = useNavigate()

  // ===== GET DEALER NAME =====

  const dealerName =
    localStorage.getItem("dealer_name")

  // ===== LOGOUT =====

  const handleLogout = () => {

    localStorage.removeItem(
      "dealer_token"
    )

    localStorage.removeItem(
      "dealer_name"
    )

    navigate("/login")
  }

  return (

    <div className='dealer-navbar'>

      {/* ===== LOGO ===== */}

      <div className='dealer-logo'>

        <h1>
          🚜 DealerDashboard
        </h1>

      </div>

      {/* ===== DESKTOP LINKS ===== */}

      <div className='dealer-nav-links'>

        <Link to="/dealerDashboard">
          Home
        </Link>

        <Link to="myjob">
          MyJob
        </Link>

      </div>

      {/* ===== RIGHT SECTION ===== */}

      <div className='dealer-right-section'>

        {/* ===== PROFILE ===== */}

        <div className='dealer-profile'>

          <div className='dealer-profile-icon'>
            👨‍💼
          </div>

          <h1 className='dealer-welcome'>

            Welcome :
            <span>
              {" "}Hi {dealerName || "Dealer"}
            </span>

          </h1>

        </div>

        {/* ===== LOGOUT ===== */}

        <button
          className='dealer-logout-btn'
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* ===== MOBILE TOGGLE ===== */}

      <div
        className='dealer-toggle'
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

          <div className='dealer-mobile-menu'>

            <Link to="/dealerDashboard">
              Home
            </Link>

            <Link to="myjob">
              MyJob
            </Link>

            {/* ===== MOBILE PROFILE ===== */}

            <div className='mobile-dealer-profile'>

              <div className='mobile-dealer-icon'>
                👨‍💼
              </div>

              <h1 className='mobile-dealer-welcome'>

                Welcome :
                <span>
                  {" "}Hi {dealerName || "Dealer"}
                </span>

              </h1>

            </div>

            {/* ===== MOBILE LOGOUT ===== */}

            <button
              className='mobile-dealer-logout-btn'
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

export default DealerNavbar