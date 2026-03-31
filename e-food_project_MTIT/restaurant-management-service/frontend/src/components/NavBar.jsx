import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex">
            <a href="#" className="flex items-center text-xl font-bold text-sky-600">eFoods</a>
          </div>

          {/* Toggle Button for Mobile */}
          <div className="flex items-center sm:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-black focus:outline-none">
              <FaBars size={20} />
            </button>
          </div>

          {/* Right side */}
          <div className={`sm:flex ${isOpen ? 'block' : 'hidden'} sm:items-center`}>
            <ul className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-0">
              <li><a href="/restaurant-dashboard" className="block px-3 py-2 rounded hover:bg-sky-100">Home</a></li>
              <li><a href="/restaurant-my" className="block px-3 py-2 rounded hover:bg-sky-100">Restaurant</a></li>
              <li><a href="/restaurant-menu" className="block px-3 py-2 rounded hover:bg-sky-100">Menu</a></li>
              {/* <li><a href="/restaurant-order" className="block px-3 py-2 rounded hover:bg-sky-100">Order</a></li> */}
              {/* <li><a href="#" className="block px-3 py-2 rounded hover:bg-sky-100">Home</a></li>
              <li><a href="#" className="block px-3 py-2 rounded hover:bg-sky-100">Link</a></li> */}

              {/* Dropdown */}
              {/* <li className="relative group">
                <button className="flex items-center px-3 py-2 hover:bg-sky-100 rounded">
                  Dropdown
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 z-10 w-40">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Action</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Another action</a>
                  <div className="border-t my-1"></div>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Something else here</a>
                </div>
              </li>

              <li><a href="#" className="block px-3 py-2 text-gray-400 cursor-not-allowed">Disabled</a></li> */}
            </ul>

            {/* Search Form */}
            <form className="flex mt-4 sm:mt-0 sm:ml-4">
              <input
                type="text"
                placeholder="Search"
                className="border px-2 py-1 rounded-l focus:outline-none"
              />
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-r hover:bg-green-600">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
