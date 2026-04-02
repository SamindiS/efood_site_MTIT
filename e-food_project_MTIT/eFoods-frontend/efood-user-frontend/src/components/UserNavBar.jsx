import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/efoods.png';
import userIcon from '../assets/usericon.png';

const UserNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile-my');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative px-3 py-2 text-sm font-medium transition-colors ${isActive
          ? 'text-[#1F7D53]'
          : 'text-gray-700 hover:text-[#255F38]'
          }`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#1F7D53]"></span>
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="EFoods Logo" className="h-10" />
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/restaurants">Restaurants</NavLink>
            <NavLink to="/rewards">Rewards</NavLink>
            <NavLink to="/aboutus">About Us</NavLink>
            <NavLink to="/contactus">Contact Us</NavLink>
            <NavLink to="/review">Feedbacks</NavLink>
          </div>

          {/* Right Side: Auth - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={goToProfile}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="relative">
                    <img src={userIcon} alt="User" className="h-8 w-8 rounded-full object-cover border-2 border-[#255F38]" />
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></span>
                  </div>
                  <span className="text-gray-800 font-medium">{user.firstName}</span>
                </button>
                <button
                  onClick={goToCart}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1F7D53] hover:bg-[#255F38] rounded-lg transition-colors"
                >
                  Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1F7D53] hover:bg-[#255F38] rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : isHomePage ? (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-[#1F7D53] border border-[#1F7D53] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1F7D53] hover:bg-[#255F38] rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#1F7D53] hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
            >
              Restaurants
            </Link>
            <Link
              to="/rewards"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
            >
              Rewards
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
            >
              Contact Us
            </Link>
            <Link
              to="/review"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
            >
              Feedbacks
            </Link>
          </div>

          {/* Auth links for mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img src={userIcon} alt="User" className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.firstName}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
            ) : null}

            <div className="mt-3 px-2 space-y-1">
              {user ? (
                <>
                  <button
                    onClick={goToCart}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
                  >
                    Cart
                  </button>
                  <button
                    onClick={goToProfile}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : isHomePage ? (
                <>
                  <Link
                    to="/signin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1F7D53] hover:bg-gray-50"
                  >
                    Sign Up
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavBar;