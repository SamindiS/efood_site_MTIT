import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5004/api',
});

export const getReviews = () => api.get('/reviews');
export const getRestaurantReviews = (id) => api.get(`/reviews/${id}`);
export const getAverageRating = (id) => api.get(`/reviews/average/${id}`);
export const addReview = (reviewData) => api.post('/reviews', reviewData);

// Fetch from external Restaurant Service (Port 5000)
export const getAllRestaurants = () => axios.get('http://localhost:5000/api/restaurants');

export default api;
