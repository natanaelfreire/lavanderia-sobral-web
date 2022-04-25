import axios from 'axios';
import { LogOut } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'localhost://3333',
});

api.defaults.withCredentials = true;
// api.defaults.headers['Authorization'] = process.env.REACT_APP_API_TOKEN;

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    LogOut();
  }

  return error;
})

export default api;