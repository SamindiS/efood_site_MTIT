import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/usericon.png';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.firstName) {
      setFirstName(storedUser.firstName);
    } else if (user && user.firstName) {
      setFirstName(user.firstName);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18230F] via-[#27391C] to-[#1F7D53] p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-white/20">
        <div className="flex justify-center mb-6">
          <img
            src={userIcon}
            alt="User"
            className="h-24 w-24 rounded-full border-4 border-[#1F7D53] shadow-md"
          />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{firstName}</h2>
        <p className="text-[#C1D8C3] text-sm mb-6">{user?.email}</p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate('/edit-profile')}
            className="px-6 py-2 rounded-full bg-[#255F38] hover:bg-[#1F7D53] text-white font-semibold transition transform hover:scale-105"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/order-history')}
            className="px-6 py-2 rounded-full bg-[#255F38] hover:bg-[#1F7D53] text-white font-semibold transition transform hover:scale-105"
          >
            Order History
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className="px-6 py-2 rounded-full bg-[#255F38] hover:bg-[#1F7D53] text-white font-semibold transition transform hover:scale-105"
          >
            Favorites
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition transform hover:scale-105"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;