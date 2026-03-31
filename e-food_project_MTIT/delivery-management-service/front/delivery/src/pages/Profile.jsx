import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const vehicleTypes = ['Motorcycle', 'Car', 'Van', 'Truck'];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleType: '',
    profileImage: null
  });
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => { 
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const profileResponse = await authService.getProfile(token);
        const fetchedProfileData = {
          firstName: profileResponse.firstName || '',
          lastName: profileResponse.lastName || '',
          email: profileResponse.email || '',
          phoneNumber: profileResponse.phoneNumber || '',
          licenseNumber: profileResponse.licenseNumber || '',
          vehicleType: profileResponse.vehicleType || '',
          profileImage: profileResponse.profileImage || null
        };
        
        // Only update if not currently editing
        if (!isEditing) {
          setProfileData(fetchedProfileData);
          setOriginalProfileData(fetchedProfileData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [navigate, logout, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedProfile = await authService.updateProfile(token, profileData);
      setProfileData(updatedProfile);
      setOriginalProfileData(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedProfile = await authService.updateProfile(token, profileData);
      setProfileData(updatedProfile);
      setOriginalProfileData(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Revert to original data when canceling
    setProfileData(originalProfileData);
    setIsEditing(false);
    setError('');
  };

  if (!user) return null;

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold mb-6">Driver Profile</h2> */}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image Section */}
            <div className="md:w-1/4">
              <div className="flex flex-col items-center">
                <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-gray-300">
                  {profileData.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl text-gray-400">
                      {profileData.firstName && profileData.lastName 
                        ? `${profileData.firstName[0]}${profileData.lastName[0]}`
                        : 'U'}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    Upload Photo
                  </button>
                )}
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="md:w-3/4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profileData.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profileData.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{profileData.email}</p>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      required
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profileData.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      required
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profileData.licenseNumber}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  {isEditing ? (
                    <select
                      name="vehicleType"
                      value={profileData.vehicleType}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">{profileData.vehicleType}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-6">
                  {isEditing ? (
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="w-1/2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;