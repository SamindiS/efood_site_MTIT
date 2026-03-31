import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/efoods.png';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/restaurants');
    } catch (err) {
      alert('Invalid credentials');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18230F] to-[#1F7D53] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="EFoods Logo" className="h-16 w-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-[#27391C]">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#255F38]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#255F38]">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#1F7D53] focus:ring-[#255F38] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-[#1F7D53] hover:text-[#255F38]">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#1F7D53] hover:bg-[#255F38] text-white py-3 rounded-lg font-medium transition duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-[#1F7D53] hover:text-[#255F38]">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;