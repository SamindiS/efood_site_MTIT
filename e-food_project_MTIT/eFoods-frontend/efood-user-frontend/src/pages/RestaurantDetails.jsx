import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function RestaurantDetails() {
  const { id: restaurantId } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const userId = user?._id;

  const [menu, setMenu] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/menu?restaurantId=${restaurantId}`)
      .then(res => setMenu(res.data));
  }, [restaurantId]);

  const handleAddToCart = () => {
    if (!selected || quantity < 1 || !restaurantId || !user?._id) return;
  
    const item = {
      userId: user._id,
      restaurantId,
      menuItemId: selected._id,
      quantity,
    };
  
    addToCart(item);
    setShowActionModal(true);
    setSelected(null);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">🍽️ Menu Selection</h2>
          <p className="text-lg text-gray-600">Browse our delicious offerings</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menu.map(item => (
            <div
              key={item._id}
              onClick={() => setSelected(item)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image?.[0] ? `http://localhost:5000${item.image[0]}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  alt={item.name}
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                <p className="text-green-600 font-bold text-lg">US$. {item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
          >
            <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <div className="relative h-56 overflow-hidden rounded-lg mb-4">
                  <img 
                    src={selected.image?.[0] ? `http://localhost:5000${selected.image[0]}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'}
                    className="w-full h-full object-cover"
                    alt={selected.name}
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selected.name}</h2>
                <p className="text-gray-600 mb-4">{selected.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">US$. {selected.price}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setQuantity(prev => (prev > 1 ? prev - 1 : 1)); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                  <button
                    className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add {quantity} to Cart
              </button>
            </div>
          </div>
        )}

        {showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center space-y-6 animate-popIn">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Item Added to Cart!</h3>
              <p className="text-gray-600">What would you like to do next?</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => window.location.href = '/cart'}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Go to Cart
                </button>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}