  import { useState } from 'react';
  import { Link } from 'react-router-dom';

  export default function RestaurantCard({ restaurant }) {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <div 
          onClick={() => setShowModal(true)}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden hover:-translate-y-1"
        >
          <div className="relative h-48 overflow-hidden">
            <img 
              src={restaurant.image?.[0] ? `http://localhost:5000${restaurant.image[0]}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              alt={restaurant.name}
            />
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{restaurant.name}</h3>
                <p className="text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {restaurant.address}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Link 
                to={`/restaurants/${restaurant._id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                View Menu
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {showModal && (
          <div 
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative animate-fadeIn"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.description || 'No description provided.'}</p>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Address: {restaurant.address}</span>
              </div>
              
              <Link 
                to={`/restaurants/${restaurant._id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
              >
                Explore Menu
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }