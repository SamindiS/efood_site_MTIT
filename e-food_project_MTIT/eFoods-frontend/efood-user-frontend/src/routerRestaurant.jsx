import { createBrowserRouter } from 'react-router-dom';
import AppUser from './AppUser';
import NotFound from './pages/NotFound';

import ProtectedRestaurant from './components/auth/ProtectedRestaurant';
import SignInR from './pages/Login'
import SignUpR from './pages/Register'
import ProfileR from './pages/Profile'

const router = createBrowserRouter([
    {
        path: '/rts',
        element: <AppUser />,
        errorElement: <NotFound />,
        children: [
          { path: 'restaurant-signin', element: <SignInR /> },
          { path: 'restaurant-signup', element: <SignUpR /> },
          {
            path: 'restaurant-profile',
            element: (
              <ProtectedRestaurant>
                  <ProfileR />
              </ProtectedRestaurant>
            ),
          },
        ],
    },
]);

export default router;