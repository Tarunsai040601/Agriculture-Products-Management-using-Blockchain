import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './CustomerNavbar.css'

const CustomerNavbar = () => {

  const [toggleMenu, setToggleMenu] =
    useState(false)

  const [customerName, setCustomerName] =
    useState("")

  const navigate = useNavigate()

  // ===== CHECK LOGIN =====

  useEffect(() => {

    const customer =
      localStorage.getItem(
        "customer_name"
      )

    if (customer) {

      setCustomerName(customer)

    }

  }, [])

  // ===== LOGIN =====

  const handleLogin = () => {

    navigate("/login")
  }

  // ===== LOGOUT =====

  const handleLogout = () => {

    localStorage.removeItem(
      "customer_token"
    )

    localStorage.removeItem(
      "customer_name"
    )

    setCustomerName("")

    navigate("/")
  }

  // ===== PROTECTED ITEMS =====

  const handleProtectedRoute = (
    e,
    path
  ) => {

    if (!customerName) {

      e.preventDefault()

      alert(
        "⚠ Login Required To Access"
      )

      navigate("/")

    }
    else {

      navigate(path)

    }
  }

  return (

    <div className='customer-navbar'>

      {/* ===== LOGO ===== */}

      <div className='customer-logo'>

        <h1>
          🌾 AgriTech
        </h1>

      </div>

      {/* ===== DESKTOP LINKS ===== */}

      <div className='customer-nav-links'>

        <Link to="/customerDashboard">
          Home
        </Link>

        <Link to="/about">
          About_us
        </Link>

        <Link
          to="/items"
          onClick={(e) =>
            handleProtectedRoute(
              e,
              "/items"
            )
          }
        >
          Items
        </Link>

        <Link
          to="/myorders"
          onClick={(e) =>
            handleProtectedRoute(
              e,
              "/myorders"
            )
          }
        >
          My_Orders
        </Link>

        <Link to="/reviews">
          Reviews
        </Link>

      </div>

      {/* ===== RIGHT SECTION ===== */}

      <div className='customer-right-section'>

        {
          customerName ? (

            <>
              {/* ===== PROFILE ===== */}

              <div className='customer-profile'>

                <div className='customer-profile-icon'>
                  🧑‍🌾
                </div>

                <h1 className='customer-welcome'>

                  Welcome :
                  <span>
                    {" "}Hi {customerName}
                  </span>

                </h1>

              </div>

              {/* ===== LOGOUT ===== */}

              <button
                className='customer-logout-btn'
                onClick={handleLogout}
              >
                Logout
              </button>

            </>

          ) : (

            <button
              className='customer-login-btn'
              onClick={handleLogin}
            >
              Login
            </button>

          )
        }

      </div>

      {/* ===== MOBILE TOGGLE ===== */}

      <div
        className='customer-toggle'
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

          <div className='customer-mobile-menu'>

            <Link to="/customerDashboard">
              Home
            </Link>

            <Link to="/about">
              About_us
            </Link>

            <Link
              to="/items"
              onClick={(e) =>
                handleProtectedRoute(
                  e,
                  "/items"
                )
              }
            >
              Items
            </Link>

            <Link
              to="/myorders"
              onClick={(e) =>
                handleProtectedRoute(
                  e,
                  "/myorders"
                )
              }
            >
              My_Orders
            </Link>

            <Link to="/reviews">
              Reviews
            </Link>

            {
              customerName ? (

                <>
                  {/* ===== MOBILE PROFILE ===== */}

                  <div className='mobile-customer-profile'>

                    <div className='mobile-customer-icon'>
                      🧑‍🌾
                    </div>

                    <h1 className='mobile-customer-welcome'>

                      Welcome :
                      <span>
                        {" "}Hi {customerName}
                      </span>

                    </h1>

                  </div>

                  {/* ===== MOBILE LOGOUT ===== */}

                  <button
                    className='mobile-customer-logout-btn'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                </>

              ) : (

                <button
                  className='mobile-customer-login-btn'
                  onClick={handleLogin}
                >
                  Login
                </button>

              )
            }

          </div>

        )
      }

    </div>
  )
}

export default CustomerNavbar