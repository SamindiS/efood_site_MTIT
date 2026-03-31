// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/orders/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-700 mb-6">🧾 My Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-2">Delivery Address: {order.address}</p>

              <ul className="mt-2 border-t pt-2 divide-y text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-1 flex justify-between">
                    <div>
                      {item.name} × {item.quantity}
                    </div>
                    <div>USD {(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 text-right font-semibold text-sky-700">
                Total: USD {order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
