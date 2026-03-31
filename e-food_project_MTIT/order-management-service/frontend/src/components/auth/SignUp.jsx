import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import effodsLogo from '../../assets/efoods.png'; // logo import

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      alert('Sign Up Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE852] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src={effodsLogo} alt="Effods Logo" className="w-50 h-50 object-contain" />
        </div>
        <h2 className="text-3xl font-extrabold text-center text-[#5CB338] mb-6">SIGN UP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['firstName', 'lastName', 'contact', 'email', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC145]"
            />
          ))}
          <button
            type="submit"
            className="w-full bg-[#5CB338] hover:bg-[#469127] text-white py-2 rounded-lg transition duration-200 font-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-[#FB4141] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;