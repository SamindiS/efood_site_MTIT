import axios from 'axios';

const createAPI = (baseURL) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add auth interceptor if needed later
    return api;
};

export const restaurantAPI = createAPI('http://localhost:5010/restaurant-service/api');
export const orderAPI = createAPI('http://localhost:5010/order-service/api');
export const deliveryAPI = createAPI('http://localhost:5010/delivery-service/api');
export const paymentAPI = createAPI('http://localhost:5010/payment-service/api');
