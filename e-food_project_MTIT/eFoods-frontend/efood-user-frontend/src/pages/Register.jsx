import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:5001/api/users/register', form)
    alert('Registered successfully!')
    navigate('/login')
  }

  return (
    <div className="bg-gradient-to-br from-green-200 to-green-50 p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} className="border w-full p-2" required />
        <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} className="border w-full p-2" required />
        <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} className="border w-full p-2" required />
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  )
}
