import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import efoodsLogo from '../../assets/efoods.png'; // logo import

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(formData);
      navigate('/signin'); // Redirect to signin page
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18230F] to-[#1F7D53] px-4 py-12">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={efoodsLogo} alt="eFoods Logo" className="h-16 w-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-[#27391C]">Create Your Account</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#255F38]">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
                placeholder="Mahinda"
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#255F38]">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
                placeholder="Rajapaksa"
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#255F38]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
              placeholder="your@gmail.com"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#255F38]">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
              placeholder="+9471 234 5678"
            />
            {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#255F38]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7D53] focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#1F7D53] hover:bg-[#255F38] text-white py-3 rounded-lg font-medium transition duration-300 shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-[#1F7D53] hover:text-[#255F38]">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;