import React, { useState } from 'react'
import { useRestaurant } from '../context/RestaurantContext'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate();
  const { login } = useRestaurant();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      alert('Login successful!');
      navigate('/restaurant-dashboard');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[25rem] h-[25rem] bg-sky-300 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] bg-green-300 rounded-full blur-3xl opacity-30 animate-pulse" />

      <form onSubmit={handleSubmit} className="relative z-10 bg-white/80 backdrop-blur-md shadow-2xl p-10 rounded-xl w-full max-w-md transition hover:scale-[1.02]">
        <div className="flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-sky-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-sky-800 mb-6">Login to Your Account</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 mb-3 border border-gray-300 rounded-lg" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 mb-6 border border-gray-300 rounded-lg" />
        <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold shadow">
          Login
        </button>

        <div className="mt-4 text-center">
          <a
            href="/restaurant-signup"
            className="text-sm text-sky-600 hover:underline hover:text-sky-800 transition duration-150"
          >
            Haven't registered yet?
          </a>
        </div>


      </form>
    </div>
  )
}
