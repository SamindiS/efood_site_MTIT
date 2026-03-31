import { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants')
      .then(res => setRestaurants(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Explore Restaurants
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover delicious dining options near you
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map(r => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))}
        </div>
      </div>
    </div>
  );
}