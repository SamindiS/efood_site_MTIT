import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from '../router';
import { RestaurantProvider } from './context/RestaurantContext';
import { MenuProvider } from './context/MenuContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RestaurantProvider>
      <MenuProvider>
        <RouterProvider router={router} />
      </MenuProvider>
    </RestaurantProvider>
  </React.StrictMode>
);