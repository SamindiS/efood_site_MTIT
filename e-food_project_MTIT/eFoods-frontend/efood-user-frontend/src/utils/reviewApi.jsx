import axios from 'axios';

const ReviewAPI = axios.create({
  baseURL: 'http://localhost:5010/review-service/api', // Review Management Service via Gateway
  withCredentials: true,
});

export default ReviewAPI;
