import { createBrowserRouter } from 'react-router-dom';
import App from './src/App';

import ProtectedRestaurant from './src/components/Auth/ProtectedRestaurant';
import Register from './src/pages/Register';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Dashboard from './src/pages/Dashboard';
import Menu from '../frontend/src/pages/Menu/Menu';
import NavBar from './src/components/NavBar';
import Footer from './src/components/Footer';
import Settings from './src/pages/Settings';
import Restaurant from './src/pages/Restaurant/Restaurant';
import RestaurantEditForm from './src/pages/Restaurant/RestaurantEditForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'restaurant-admin', element: <Home /> },
      { path: 'restaurant-signin', element: <Login /> },
      { path: 'restaurant-signup', element: <Register /> },
      {
        path: 'restaurant-dashboard',
        element: (
          <ProtectedRestaurant>
            <NavBar />
                <Dashboard />
            <Footer />
          </ProtectedRestaurant>
        ),
      },
      {
        path: 'restaurant-menu',
        element: (
          <ProtectedRestaurant>
            <NavBar />
                <Menu />
            <Footer />
          </ProtectedRestaurant>
        ),
      },
      {
        path: 'restaurant-settings',
        element: (
          <ProtectedRestaurant>
            <NavBar />
                <Settings />
            <Footer />
          </ProtectedRestaurant>
        ),
      },
      {
        path: 'restaurant-my',
        element: (
          <ProtectedRestaurant>
            <NavBar />
                <Restaurant />
            <Footer />
          </ProtectedRestaurant>
        ),
      },
      {
        path: 'restaurant-edit/:id',
        element: (
          <ProtectedRestaurant>
            <NavBar />
                <RestaurantEditForm />
            <Footer />
          </ProtectedRestaurant>
        ),
      },
    ],
  },
]);

export default router;