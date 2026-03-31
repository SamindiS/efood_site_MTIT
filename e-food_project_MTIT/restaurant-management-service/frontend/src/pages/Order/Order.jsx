import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import OrderForm from './OrderForm';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const restaurantId = user?._id || user?.restaurantId;

      if (!restaurantId) return;

      const res = await axios.get(`http://localhost:5001/api/orders/restaurant/${restaurantId}`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  // const fetchOrders = async() =>{
  //   try{
  //     const res = await axios.get('http://localhost:5000/api/orders');
  //     setOrders(res.data);
  //     setLoading(true);
  //   }catch(err){
  //     console.error("Error fetching orders..", err);
  //   }
  // }

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* <h1 className="text-4xl font-bold text-sky-700 mb-6">All Orders..</h1> */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-sky-700">All Orders..</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-900"
          >
            Add New Order
          </button>
        </div>

        {showForm && (
          <OrderForm
            onClose={() => setShowForm(false)}
            onSuccess={fetchOrders}
          />
        )}


        {loading ? (
          <p className="text-gray-500">Loading orders...</p>

        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-sky-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Restaurant</th>
                  <th className="px-4 py-2 text-left">Items</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Payment</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-2">{order.customer.name}</td>
                    <td className="px-4 py-2">{order.restaurantId?.name}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc ml-4">
                        {order.items.map((item, index) => (
                          <li key={index}>{item.menuItemId?.name} x {item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">US$: {order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.paymentMethod.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 font-semibold text-sky-700">{order.status}</td>
                    <td className="px-4 py-2 space-x-2 text-center">
                      <button
                        onClick={() => updateStatus(order._id, 'confirmed')}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, 'cancelled')}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
