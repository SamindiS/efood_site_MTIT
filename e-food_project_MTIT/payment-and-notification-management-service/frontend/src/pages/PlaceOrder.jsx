import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51RGxa9QwYkP7b05Rhk7zOc5FqNp2go8wELiqw6sFbpK874upT4hV3crf94pDEYHSi6YHdaGXuKJH0JXR3fjB8pxI00fTmS611t");
import { useAuth } from '../../../../eFoods-frontend/efood-user-frontend/src/context/AuthContext';
import { useCart } from '../../../../eFoods-frontend/efood-user-frontend/src/context/CartContext';
import API from '../../../../eFoods-frontend/efood-user-frontend/src/utils/api'; // Your Axios instance
import { useLocation } from 'react-router-dom';

const PlaceOrder = ({ userId }) => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  




  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5003/api/payment/checkout/${userId}`
        );
        setCheckoutData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [userId]);



  const { user } = useAuth();
  const { cart } = useCart(); // you may not need the whole cart now, but it's good to have
  
  const handlePayment = async () => {
    try {
      const orderId = location.state?.orderId;
      const res = await API.post(`http://localhost:5003/api/payment/process`, {
        userId: user._id,
        orderId: orderId
      });
  
      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  
  

  if (loading) return <p>Loading checkout info...</p>;
  if (!checkoutData) return <p>No data available</p>;






  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Customer Info */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Customer Information</h3>
        <p>
          {checkoutData.customer.firstName} {checkoutData.customer.lastName}
        </p>
        <p>Email: {checkoutData.customer.email}</p>
        <p>Phone: {checkoutData.customer.contact}</p>
      </div>

      {/* Shipping Info */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Shipping Information</h3>
        <p>Address: {checkoutData.order.shippingInfo.address}</p>
        <p>City: {checkoutData.order.shippingInfo.city}</p>
        <p>
          Postal Code: {checkoutData.order.shippingInfo.postalCode || "N/A"}
        </p>
        <p>Country: {checkoutData.order.shippingInfo.country}</p>
      </div>

      {/* Order Summary */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-2">Order Summary</h3>
        <ul className="divide-y">
          {checkoutData.order.items.map((item, idx) => (
            <li key={idx} className="py-2">
              <div className="flex justify-between">
                <span>
                  <strong>{item.menuItemName}</strong> (x{item.quantity})
                </span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
              <p className="text-sm text-gray-600">
                {item.restaurantName}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 mt-2">
          <p className="font-bold text-lg flex justify-between">
            <span>Total:</span>
            <span>Rs. {checkoutData.order.totalAmount}</span>
          </p>
        </div>
      </div>

     

      {/* Pay Button */}
      <div className="mt-6">
        <button
  onClick={handlePayment}
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
>
Pay Now (Rs. ${checkoutData.order.totalAmount})
</button>


      </div>
    </div>
  );
};

export default PlaceOrder;