import { createBrowserRouter } from 'react-router-dom';
import AppUser from './AppUser';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserNavBar from './components/userNavBar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import LoyaltyRewards from './pages/LoyaltyRewards';


// 👇 Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PlaceOrder from './pages/PlaceOrder';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import UserProfile from './pages/UserProfile';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQs from './pages/FAQs';

const stripePromise = loadStripe('pk_test_51RGy5IROKHbYsMp0Ue9D52MOfKF51l6IH0V1FHVURZwezgcHyCRSPD5RaqcCx0MoLIVEspYVpZJZ18kcFnXZbjWQ00mXaxfi3M');

// 👇 Wrapper component to provide Stripe Elements context
const StripeWrapper = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppUser />,
    children: [
      { path: '', element: <Home /> },
      { path: 'aboutus', element: <AboutUs /> },
      { path: 'contactus', element: <ContactUs /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'help', element: <HelpCenter /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsAndConditions /> },
      { path: 'faq', element: <FAQs /> },
      {
        path: 'restaurants',
        element: (
          <ProtectedRoute>
            <UserNavBar />
            <Restaurants />
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'rewards',
        element: (
          <ProtectedRoute>
            <UserNavBar />
            <LoyaltyRewards />
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'restaurants/:id',
        element: (
          <ProtectedRoute>
            <UserNavBar />
            <RestaurantDetails />
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <UserNavBar />
            <Cart />
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <UserNavBar />
            <Checkout />
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile-my',
        element: (
          <ProtectedRoute>
            <UserNavBar />
            <UserProfile />
            <Footer />
          </ProtectedRoute>
        ),
      },
      // 👇 Stripe-related routes wrapped in Elements
      {
        path: 'placeorder',
        element: (
          <ProtectedRoute>
            <StripeWrapper>
              <PlaceOrder />
            </StripeWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment-success',
        element: (
          <ProtectedRoute>
            <StripeWrapper>
              <PaymentSuccess />
            </StripeWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment-failed',
        element: (
          <ProtectedRoute>
            <StripeWrapper>
              <PaymentFailed />
            </StripeWrapper>
          </ProtectedRoute>
        ),
      },

    ],
  },
]);

export default router;