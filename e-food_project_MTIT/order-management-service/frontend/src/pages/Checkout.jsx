import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import API from '../utils/api';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleCheckout = async () => {
    if (!address) return alert("Please enter an address");
    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        items: cart,
        address,
        totalPrice: cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0),
      };
      await API.post('/order/checkout', orderData);
      alert('Order placed successfully!');
      fetchCart();
    } catch (err) {
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE852] py-10 px-4">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#5CB338] mb-6 text-center">Checkout</h2>

        <div className="space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-[#FFC145] text-white px-4 py-3 rounded-lg shadow"
            >
              <div>
                <p className="font-semibold">{item.menuItem?.name}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="text-lg font-bold">
                Rs. {(item.menuItem?.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block font-medium text-[#5CB338] mb-1">Shipping Address</label>
          <textarea
            className="w-full border-2 border-[#5CB338] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#5CB338]"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-xl font-bold text-[#FB4141]">
            Total: Rs. {cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0).toFixed(2)}
          </p>
          <button
            onClick={handleCheckout}
            className={`px-6 py-3 rounded font-semibold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#5CB338] text-white hover:bg-green-700'
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