import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-sky-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">🍽️ eFood</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  )
}
