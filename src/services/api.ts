import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'localhost://3333',
});

api.defaults.withCredentials = true;
api.defaults.headers['Authorization'] = process.env.REACT_APP_API_TOKEN;

export default api;