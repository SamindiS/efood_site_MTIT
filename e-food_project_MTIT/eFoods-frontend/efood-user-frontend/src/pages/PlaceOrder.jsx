import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51RGxa9QwYkP7b05Rhk7zOc5FqNp2go8wELiqw6sFbpK874upT4hV3crf94pDEYHSi6YHdaGXuKJH0JXR3fjB8pxI00fTmS611t");
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../utils/api'; // Your Axios instance
import { useLocation } from 'react-router-dom';

const PlaceOrder = () => {
  const { user } = useAuth(); // get user from context
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!user?._id || !orderId) {
        console.log("Missing userId or orderId");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5003/api/payment/placeorder/${user._id}`);
        setCheckoutData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [user, orderId]);

  const handlePayment = async () => {
    try {
      console.log("Initiating payment...");
      const orderId = location.state?.orderId;
      if (!user?._id || !orderId) {
        console.warn("Missing user ID or order ID");
        return;
      }

      const res = await API.post(`http://localhost:5003/api/payment/process`, {
        userId: user._id,
        orderId: orderId
      });

      console.log("Stripe session response:", res.data);
      if (res.data && res.data.url) {
        console.log("Redirecting to Stripe checkout...");
        window.location.href = res.data.url;
      } else {
        console.warn("No URL returned from backend");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#18230F]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F7D53] mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-[#255F38]">Loading checkout info...</p>
      </div>
    </div>
  );

  if (!checkoutData) return (
    <div className="min-h-screen flex items-center justify-center bg-[#18230F]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold text-[#255F38]">No data available</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#255F38] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#18230F] text-white p-6 text-center">
          <h2 className="text-3xl font-bold mb-2">eFoods Order Details</h2>
          <p className="text-sm opacity-80">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center p-6 bg-[#27391C] bg-opacity-10">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#27391C] flex items-center justify-center text-white font-bold mb-1">1</div>
            <span className="text-sm text-white">Cart</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2 relative">
            <div className="absolute inset-0 bg-[#1F7D53] w-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#27391C] flex items-center justify-center text-white font-bold mb-1">2</div>
            <span className="text-sm text-white">Details</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2 relative">
            <div className="absolute inset-0 bg-[#1F7D53] w-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#1F7D53] flex items-center justify-center text-white font-bold mb-1">3</div>
            <span className="text-sm font-semibold text-white">Payment</span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Customer Info */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#255F38]">
            <h3 className="font-bold text-lg mb-3 text-[#27391C] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#1F7D53]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-medium">{checkoutData.customer.firstName} {checkoutData.customer.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{checkoutData.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-medium">{checkoutData.customer.contact}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#255F38]">
            <h3 className="font-bold text-lg mb-3 text-[#27391C] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#1F7D53]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-medium">{checkoutData.order.shippingInfo.address}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">City</p>
                <p className="font-medium">{checkoutData.order.shippingInfo.city}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Postal Code</p>
                <p className="font-medium">{checkoutData.order.shippingInfo.postalCode || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Country</p>
                <p className="font-medium">{checkoutData.order.shippingInfo.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md border-l-4 border-[#255F38]">
            <h3 className="font-bold text-lg mb-3 text-[#27391C] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#1F7D53]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Order Summary
            </h3>
            <div className="divide-y">
              {checkoutData.order.items.map((item, idx) => (
                <div key={idx} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.menuItemName} <span className="text-[#1F7D53] font-bold">(x{item.quantity})</span></p>
                      <p className="text-sm text-gray-500">{item.restaurantName}</p>
                    </div>
                    <p className="font-semibold">US$. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#255F38] pt-4 mt-3">
              <p className="font-bold text-xl flex justify-between">
                <span>Total Amount:</span>
                <span className="text-[#1F7D53]">US$. {checkoutData.order.totalAmount}</span>
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <div className="text-center mt-8">
            <button
              onClick={handlePayment}
              className="bg-gradient-to-r from-[#27391C] to-[#1F7D53] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#255F38] focus:ring-opacity-50"
            >
              Pay Now (USD. {checkoutData.order.totalAmount})
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="text-sm text-gray-600 mt-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment processed by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;