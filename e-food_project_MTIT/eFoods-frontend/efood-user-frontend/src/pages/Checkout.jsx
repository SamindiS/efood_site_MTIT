import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address || !city || !postalCode || !country) {
      return alert('Please fill all shipping fields');
    }
    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        shippingInfo: {
          address,
          city,
          postalCode,
          country,
        },
      };
      

      const res = await API.post('/orders', orderData); // ✅ get response
      const orderId = res.data._id; // ✅ get orderId
      alert('Order placed successfully!');
      fetchCart();

      navigate('/placeorder', {
       state: { orderId }, // ✅ pass it properly
      });


    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#18230F] py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto p-8 bg-[#27391C] rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold text-center text-[#1F7D53] mb-8">Checkout</h2>
  
        {/* Cart Summary */}
        <div className="space-y-4 mb-8">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-[#255F38] text-white px-5 py-4 rounded-xl shadow-md"
            >
              <div>
                <p className="font-semibold text-lg">{item.menuItem?.name}</p>
                <p className="text-sm opacity-80">Qty: {item.quantity}</p>
              </div>
              <p className="text-xl font-bold">
                US$. {(item.menuItem?.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
  
        {/* Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#A0DAB8]">Address</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-transparent border border-[#1F7D53] focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street Address"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#A0DAB8]">City</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-transparent border border-[#1F7D53] focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#A0DAB8]">Postal Code</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-transparent border border-[#1F7D53] focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal Code"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#A0DAB8]">Country</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-transparent border border-[#1F7D53] focus:outline-none focus:ring-2 focus:ring-[#1F7D53]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
  
        {/* Total & Button */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-2xl font-bold text-[#A0DAB8]">
            Total: US$. {total.toFixed(2)}
          </p>
          <button
            onClick={handleCheckout}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#1F7D53] hover:bg-[#255F38] text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Checkout;