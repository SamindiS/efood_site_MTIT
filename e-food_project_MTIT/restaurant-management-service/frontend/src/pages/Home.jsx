import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, Utensils } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 flex items-center justify-center relative overflow-hidden">

      {/* Background animation shape */}
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>

      {/* Main content */}
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-10 w-full max-w-xl z-10 transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="bg-sky-600 p-4 rounded-full shadow-lg">
              <Utensils className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-sky-800 mb-2 drop-shadow-md">eFoods Restaurant Portal</h1>
          <p className="text-gray-600 mb-6 text-md leading-relaxed">Welcome to your restaurant dashboard — manage menus, track orders, and optimize service, all from one place.</p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/restaurant-signin')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" /> Login
            </button>
            <button
              onClick={() => navigate('/restaurant-signup')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" /> Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
