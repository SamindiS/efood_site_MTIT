import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Profile from './Profile.jsx';
import PendingDeliveries from '../components/PendingDeliveries.jsx';
import ActiveDeliveries from '../components/ActiveDeliveries.jsx';
// Commented out imports for components we're not using yet
// import DeliveryHistory from './DeliveryHistory.jsx';
import EarningsOverview from '../components/EarningsOverview.jsx';
import DeliveryMap from '../components/DeliveryMap.jsx'; // Import the DeliveryMap component
import Notifications from '../components/Notification.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // State for dashboard metrics
  const [dashboardData, setDashboardData] = useState({
    todayEarnings: 0,
    availableJobs: 0,
    activeDeliveries: 0,
    weeklyEarnings: 0,
    monthlyDeliveries: 0,
    averageRating: 0,
    recentActivity: []
  });

  // Load dashboard data from localStorage
  useEffect(() => {
    const loadDashboardData = () => {
      try {
        // Get earnings data
        const earningsData = JSON.parse(localStorage.getItem('earningsData')) || {
          total: 0,
          deliveries: 0,
          tips: 0,
          bonuses: 0,
          history: []
        };

        // Get active deliveries
        const activeDeliveries = JSON.parse(localStorage.getItem('activeDeliveries')) || [];

        // Get available orders
        const claimedOrderIds = JSON.parse(localStorage.getItem('claimedOrderIds')) || [];
        const deliveredOrderIds = JSON.parse(localStorage.getItem('deliveredOrderIds')) || [];

        // Calculate today's earnings
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const todayEarnings = earningsData.history
          .filter(entry => entry.date === today)
          .reduce((sum, entry) => sum + entry.amount, 0);

        // Calculate weekly earnings
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Get Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyEarnings = earningsData.history
          .filter(entry => new Date(entry.date) >= startOfWeek)
          .reduce((sum, entry) => sum + entry.amount, 0);

        // Calculate monthly deliveries
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // First day of current month
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyDeliveries = earningsData.history
          .filter(entry => new Date(entry.date) >= startOfMonth)
          .reduce((sum, entry) => sum + entry.deliveries, 0);

        // Get recent activity (last 5 deliveries)
        const recentActivity = [...earningsData.history]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setDashboardData({
          todayEarnings,
          availableJobs: 0, // Will be updated when we load orders
          activeDeliveries: activeDeliveries.length,
          weeklyEarnings,
          monthlyDeliveries,
          averageRating: 4.8, // Placeholder value
          recentActivity
        });

        // Fetch available jobs count (this will be asynchronous)
        fetchAvailableJobsCount();
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    loadDashboardData();
  }, []);

  // Function to fetch available jobs count
  const fetchAvailableJobsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Try to fetch from API first
      try {
        const response = await fetch('http://localhost:5010/delivery-service/api/drivers/orders', {
          headers
        });

        if (response.ok) {
          const data = await response.json();
          let ordersData = [];

          if (data && data.success && Array.isArray(data.data)) {
            ordersData = data.data;
          } else if (Array.isArray(data)) {
            ordersData = data;
          }

          // Get claimed and delivered order IDs to filter
          const claimedOrderIds = JSON.parse(localStorage.getItem('claimedOrderIds')) || [];
          const deliveredOrderIds = JSON.parse(localStorage.getItem('deliveredOrderIds')) || [];

          // Count available orders (not claimed or delivered)
          const availableCount = ordersData.filter(order =>
            !claimedOrderIds.includes(order._id) &&
            !deliveredOrderIds.includes(order._id)
          ).length;

          setDashboardData(prev => ({ ...prev, availableJobs: availableCount }));
          return;
        }
      } catch (apiErr) {
        console.error('API fetch failed:', apiErr);
        // Continue to fallback if API call fails
      }

      // Fallback to localStorage checking for testing
      const claimedOrderIds = JSON.parse(localStorage.getItem('claimedOrderIds')) || [];
      const deliveredOrderIds = JSON.parse(localStorage.getItem('deliveredOrderIds')) || [];

      // For testing purposes, just set a random number between 1-5
      const testAvailableJobs = Math.floor(Math.random() * 5) + 1;
      setDashboardData(prev => ({ ...prev, availableJobs: testAvailableJobs }));

    } catch (err) {
      console.error('Failed to fetch available jobs count:', err);
      setDashboardData(prev => ({ ...prev, availableJobs: 0 }));
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sample delivery data for the map
  const sampleDelivery = {
    pickupLocation: { lat: 37.7749, lng: -122.4194 },
    dropoffLocation: { lat: 37.7858, lng: -122.4064 },
    status: 'accepted',
    restaurantName: 'Sample Restaurant',
    customerName: 'John Doe',
    pickupAddress: '123 Market St, San Francisco',
    dropoffAddress: '456 Union St, San Francisco'
  };

  const sampleDriverLocation = { lat: 37.7739, lng: -122.4312 };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-LK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'pending':
        return <PendingDeliveries />;
      case 'active':
        return <ActiveDeliveries />;
      case 'earnings':
        return <EarningsOverview />;
      case 'notifications':
        return <Notifications />;
      case 'map':
        return (
          <div className="p-6">
            {/* <h2 className="text-2xl font-bold mb-6">Live Delivery Map</h2> */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="h-96 w-full border border-gray-300 rounded">
                <DeliveryMap
                  delivery={sampleDelivery}
                  driverLocation={sampleDriverLocation}
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 mb-2">Navigation Instructions</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Current pickup: {sampleDelivery.pickupAddress}</li>
                <li>Destination: {sampleDelivery.dropoffAddress}</li>
                <li>Estimated distance: 1.2 miles</li>
                <li>Estimated time: 8 minutes</li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick stats cards - now with real data */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700">Today's Earnings</h3>
                <p className="text-2xl font-bold mt-2">{formatCurrency(dashboardData.todayEarnings)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700">Available Jobs</h3>
                <p className="text-2xl font-bold mt-2">{dashboardData.availableJobs}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700">Active Deliveries</h3>
                <p className="text-2xl font-bold mt-2">{dashboardData.activeDeliveries}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700">Weekly Earnings</h3>
                <p className="text-2xl font-bold mt-2">{formatCurrency(dashboardData.weeklyEarnings)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700">Monthly Deliveries</h3>
                <p className="text-2xl font-bold mt-2">{dashboardData.monthlyDeliveries}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700">Average Rating</h3>
                <p className="text-2xl font-bold mt-2">{dashboardData.averageRating.toFixed(1)}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-700 mb-4">Recent Activity</h3>
                {dashboardData.recentActivity.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.recentActivity.map((activity, index) => (
                          <tr key={activity.id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatDate(activity.date)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {activity.deliveries}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {formatCurrency(activity.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-6">
                    No recent activity to display
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 bg-black text-white">
          <h2 className="text-xl font-bold">e foods</h2>
          <p className="text-sm mt-1">Driver Portal</p>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">Welcome,</p>
          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
        </div>
        <nav className="mt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'overview' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Overview</span>

          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'profile' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Profile</span>

          </button>
          {/* <button 
            onClick={() => setActiveTab('pending')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'pending' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Pending Deliveries</span>
            
          </button> */}
          <button
            onClick={() => setActiveTab('active')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'active' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Active Deliveries</span>
            {dashboardData.activeDeliveries > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {dashboardData.activeDeliveries}
              </span>
            )}
          </button>
          {/* Comment out buttons for features we don't have yet */}
          {/* <button 
            onClick={() => setActiveTab('history')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'history' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">history</span>
            Delivery History
          </button> */}
          <button
            onClick={() => setActiveTab('earnings')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'earnings' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Earnings</span>

          </button>
          {/* <button 
            onClick={() => setActiveTab('map')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'map' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Live Map</span>
            
          </button> */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-4 py-2 flex items-center ${activeTab === 'notifications' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3 text-gray-600">Notifications</span>
            {dashboardData.availableJobs > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {dashboardData.availableJobs}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 flex items-center text-red-600 hover:bg-gray-100"
          >
            <span className="material-icons mr-3">Logout</span>

          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;