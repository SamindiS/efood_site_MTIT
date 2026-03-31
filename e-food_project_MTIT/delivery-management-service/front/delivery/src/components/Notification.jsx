import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Notifications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          type: 'delivery',
          title: 'New delivery request',
          message: 'You have a new delivery request from Tasty Bistro, 3.2 miles away.',
          time: '2025-04-11T10:15:00',
          read: false
        },
        {
          id: 2,
          type: 'payment',
          title: 'Payment processed',
          message: 'Your payment of $89.75 for this week has been processed.',
          time: '2025-04-10T16:30:00',
          read: true
        },
        {
          id: 3,
          type: 'system',
          title: 'App update available',
          message: 'A new version of the app is available. Please update for improved features.',
          time: '2025-04-09T14:22:00',
          read: true
        },
        {
          id: 4,
          type: 'delivery',
          title: 'Delivery canceled',
          message: 'The delivery request from Green Garden Restaurant has been canceled.',
          time: '2025-04-09T12:05:00',
          read: false
        },
        {
          id: 5,
          type: 'payment',
          title: 'Bonus earned',
          message: 'Congratulations! You\'ve earned a $25 bonus for completing 50 deliveries this month.',
          time: '2025-04-08T19:45:00',
          read: true
        },
        {
          id: 6,
          type: 'system',
          title: 'Account verification',
          message: 'Your driver\'s license verification is complete. Thank you!',
          time: '2025-04-07T09:30:00',
          read: true
        },
        {
          id: 7,
          type: 'delivery',
          title: 'Customer feedback',
          message: 'You received a 5-star rating from your last delivery. Keep up the good work!',
          time: '2025-04-06T17:50:00',
          read: false
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(notifications.filter(notification => !notification.read));
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'delivery':
        return <span className="material-icons text-blue-500">Deliveries</span>;
      case 'payment':
        return <span className="material-icons text-green-500">Payments</span>;
      case 'system':
        return <span className="material-icons text-purple-500">Notifications</span>;
      default:
        return <span className="material-icons text-gray-500">Notifications</span>;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'delivery':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'system':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="flex items-center">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="mr-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mark all as read
            </button>
          )}
          <button 
            onClick={clearAllRead}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear read
          </button>
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="mb-6 flex bg-white rounded-lg overflow-hidden shadow p-1">
        <button 
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 ${filter === 'all' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          All
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`flex-1 py-2 px-4 ${filter === 'unread' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Unread
        </button>
        <button 
          onClick={() => setFilter('delivery')}
          className={`flex-1 py-2 px-4 ${filter === 'delivery' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Deliveries
        </button>
        <button 
          onClick={() => setFilter('payment')}
          className={`flex-1 py-2 px-4 ${filter === 'payment' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Payments
        </button>
        <button 
          onClick={() => setFilter('system')}
          className={`flex-1 py-2 px-4 ${filter === 'system' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          System
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredNotifications.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500">{formatTime(notification.time)}</span>
                            <span 
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getTypeColor(notification.type)}`}
                            >
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          {notification.message}
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <span className="material-icons text-gray-400 text-5xl">notifications_off</span>
              <p className="mt-2 text-gray-500">
                {filter === 'all' 
                  ? 'No notifications to display.' 
                  : `No ${filter === 'unread' ? 'unread' : filter} notifications to display.`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;