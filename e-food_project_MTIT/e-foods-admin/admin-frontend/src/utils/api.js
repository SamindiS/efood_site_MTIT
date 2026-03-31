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

export const restaurantAPI = createAPI('http://localhost:5000/api');
export const orderAPI = createAPI('http://localhost:5001/api');
export const deliveryAPI = createAPI('http://localhost:5002/api');
export const paymentAPI = createAPI('http://localhost:5003/api');
