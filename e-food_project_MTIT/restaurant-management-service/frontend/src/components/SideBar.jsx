import React from 'react'
import { FaUtensils, FaBars, FaSignOutAlt, FaCog, FaHome, FaListAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function SideBar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/restaurant-signin')
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center p-4 border-b">
          <FaUtensils className="text-3xl text-sky-600 mr-2" />
          <h1 className="text-xl font-bold text-sky-600">eFoods Admin</h1>
        </div>

        <nav className="mt-4">
          <ul className="space-y-2">

            <a href="/restaurant-dashboard">
                <li className="p-3 hover:bg-sky-100 flex items-center cursor-pointer">
                <FaHome className="mr-2" /> Dashboard
                </li>
            </a>

            <a href="/restaurant-my">
                <li className="p-3 hover:bg-sky-100 flex items-center cursor-pointer">
                <FaListAlt className="mr-2" /> Restaurant Management
                </li>
            </a>
            
            <a href="/restaurant-menu">
                <li className="p-3 hover:bg-sky-100 flex items-center cursor-pointer">
                <FaListAlt className="mr-2" /> Menu Management
                </li>
            </a>

            {/* <a href="/restaurant-order">
                <li className="p-3 hover:bg-sky-100 flex items-center cursor-pointer">
                <FaBars className="mr-2" /> Order Management
                </li>
            </a> */}

            <a href="/restaurant-settings">
                <li className="p-3 hover:bg-sky-100 flex items-center cursor-pointer">
                <FaCog className="mr-2" /> Settings
                </li>            
            </a>

          </ul>
        </nav>
      </div>

      <div className="border-t p-4">
        <button onClick={logout} className="w-full flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  )
}
