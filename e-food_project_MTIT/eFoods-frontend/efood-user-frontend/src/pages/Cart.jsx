import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
  const {
    cart,
    fetchCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem?.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18230F] to-[#1F7D53] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#255F38] py-6 px-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Shopping Cart ({cart.length} items)
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-[#27391C] text-xl font-medium mb-6">
                Your cart is empty
              </div>
              <button
                onClick={() => navigate('/restaurants')}
                className="px-6 py-3 bg-[#1F7D53] text-white rounded-lg hover:bg-[#255F38] transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {cart.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={`${item.menuItem._id}-${index}`}
                  className="flex flex-col md:flex-row items-center gap-4 bg-[#F0F5F1] rounded-xl p-6 border border-[#1F7D53]/20"
                >
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold text-[#18230F]">
                      {item.menuItem?.name}
                    </h3>
                    <p className="text-[#27391C] mt-1">
                      USD {item.menuItem?.price?.toFixed(2)} per item
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-1/2 justify-end">
                    <div className="flex items-center bg-white rounded-lg border border-[#1F7D53]/20">
                      
                      <span className="px-4 py-2 font-medium text-[#27391C] min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="border-t border-[#1F7D53]/20 pt-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-[#18230F]">Total:</span>
                  <span className="text-2xl font-bold text-[#1F7D53]">
                    USD  {calculateTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={() => navigate('/restaurants')}
                    className="px-6 py-3 text-[#255F38] border-2 border-[#255F38] rounded-lg hover:bg-[#F0F5F1] transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="px-6 py-3 bg-[#1F7D53] text-white rounded-lg hover:bg-[#255F38] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;