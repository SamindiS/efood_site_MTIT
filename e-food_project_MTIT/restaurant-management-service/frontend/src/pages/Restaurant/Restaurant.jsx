import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import axios from 'axios';
import { Pencil, Trash, Mail, Phone, MapPin, Info, Store, Coins, Calendar, Clock, Award, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyRestaurant();
  }, []);

  const fetchMyRestaurant = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/restaurants/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurant(res.data);
    } catch (err) {
      console.error('Error fetching restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your restaurant?')) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${restaurant._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Restaurant deleted successfully');
        localStorage.removeItem('token');
        navigate('/');
      } catch (err) {
        console.error(err);
        alert('Error deleting restaurant');
      }
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const updated = await axios.put(
        `http://localhost:5000/api/restaurants/${restaurant._id}/availability`,
        { isAvailable: !restaurant.isAvailable },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      setRestaurant(updated.data);
    } catch (err) {
      console.error('Error updating availability:', err);
      alert('Failed to update availability status');
    }
  };

  const handleEdit = () => {
    navigate(`/restaurant-edit/${restaurant._id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="animate-pulse text-center">
            <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 w-32 mx-auto rounded mb-2"></div>
            <div className="h-3 bg-gray-300 w-24 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // No restaurant found state
  if (!restaurant) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Restaurant Not Found</h2>
            <p className="text-gray-600">No restaurant data available.</p>
            <button
              onClick={() => navigate('/restaurant/create')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Create Restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get restaurant image with proper error handling
  const getRestaurantImage = () => {
    if (imageError) {
      return 'https://via.placeholder.com/800x400?text=Restaurant+Image';
    }
    
    if (restaurant.image && restaurant.image.length > 0) {
      return `http://localhost:5000${restaurant.image[0]}`;
    }
    
    return 'https://via.placeholder.com/800x400?text=No+Image+Available';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-green-700">🍽️ My Restaurant</h1>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-80 mb-8 rounded-xl overflow-hidden shadow-xl">
            <img
              src={getRestaurantImage()}
              alt={restaurant.name}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
            
            {/* Image overlay with restaurant info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end px-8 pb-6">
              <div className="flex flex-wrap items-center justify-between w-full">
                <h2 className="text-3xl md:text-4xl text-white font-bold flex items-center mb-2">
                  <Store className="mr-3" /> {restaurant.name}
                </h2>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500/90 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow flex items-center transition duration-200"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow flex items-center transition duration-200"
                  >
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </button>
                </div>
              </div>
              
              <p className="flex items-center mt-2 text-white text-lg">
                <MapPin className="w-5 h-5 mr-2" /> {restaurant.address}
              </p>

              <button
                onClick={handleToggleAvailability}
                className={`mt-4 inline-block px-6 py-3 rounded-lg text-base font-semibold transition duration-300 ${
                  restaurant.isAvailable
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {restaurant.isAvailable ? '🔓 Open Now (Click to Close)' : '🔒 Closed (Click to Open)'}
              </button>
            </div>
            
            {/* Image upload overlay button */}
            <button 
              onClick={() => navigate(`/restaurant/edit/${restaurant._id}`, { state: { scrollToImage: true } })}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
              title="Change restaurant image"
            >
              <ImageIcon className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* Detail Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <DetailSection icon={<Info />} title="About">
                {restaurant.description ? (
                  <p className="text-gray-700">{restaurant.description}</p>
                ) : (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded">
                    <AlertCircle className="mr-2 w-5 h-5" />
                    <p>No description provided. Consider adding one to attract more customers!</p>
                  </div>
                )}
              </DetailSection>

              <DetailSection title="Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailCard icon={<Mail />} label="Email" value={restaurant.email} className="hover:bg-gray-100 hover:text-gray-900 hover:shadow transition duration-200 ease-in-out"/>
                  <DetailCard icon={<Phone />} label="Contact" value={restaurant.contact} className="hover:bg-gray-100 hover:text-gray-900 hover:shadow transition duration-200 ease-in-out"/>
                  <DetailCard icon={<Coins />} label="Delivery Fee" value={`LKR ${restaurant.deliveryFee}`} className="hover:bg-gray-100 hover:text-gray-900 hover:shadow transition duration-200 ease-in-out"/>
                  <DetailCard icon={<Store />} label="Status" value={restaurant.status} className="hover:bg-gray-100 hover:text-gray-900 hover:shadow transition duration-200 ease-in-out"/>
                </div>
              </DetailSection>
            </div>

            {/* Sidebar Summary */}
            <div>
              <div className="bg-white rounded-lg p-5 shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="mr-2 text-blue-600" /> Quick Info
                </h3>
                <div className="space-y-4 text-gray-600">
                  <InfoItem 
                    icon={<Calendar className="text-blue-500" />} 
                    label="Joined" 
                    value={new Date(restaurant.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  />
                  <InfoItem 
                    icon={<Clock className="text-blue-500" />} 
                    label="Hours" 
                    value={restaurant.openingTime + ' - ' + restaurant.closingTime} 
                  />
                  <InfoItem 
                    icon={<Award className="text-blue-500" />} 
                    label="Specialty" 
                    value="Authentic Sri Lankan Cuisine" 
                  />
                </div>
              </div>
              
              <div className='bg-green-100 rounded-lg p-5 shadow-md'>
                <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">Revenue Summary</h2>
                <div className="text-center py-4">
                  {/* Revenue placeholder - will be replaced with actual component */}
                  <p className="text-gray-600">Revenue details will appear here.</p>
                  {/* <RevenueTable /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailSection = ({ title, icon, children }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {title}
    </h3>
    <div className="bg-white p-5 rounded-lg shadow-md">{children}</div>
  </div>
);

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-white hover:border-blue-200 hover:shadow-md transition duration-200">
    <div className="text-green-600 mr-3">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value || 'Not provided'}</p>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition duration-200">
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);