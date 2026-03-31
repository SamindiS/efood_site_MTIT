import { useRestaurant } from '../../context/RestaurantContext';
import { Navigate } from 'react-router-dom';

const ProtectedRestaurant = ({ children }) => {
  const { restaurant } = useRestaurant();
  return restaurant ? children : <Navigate to="/restaurant-signin" />;
};

export default ProtectedRestaurant;