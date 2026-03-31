import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This will render <Outlet /> from App.jsx
    children: [
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
