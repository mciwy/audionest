import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true // httpOnly cookie
});

export default api;
