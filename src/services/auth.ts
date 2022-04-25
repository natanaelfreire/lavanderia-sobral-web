import axios from 'axios';
import api from './api';

const apiAuthorization = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'localhost://3333',
});

interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export async function signIn(user: string, password: string): Promise<Response> {
  return apiAuthorization.post('authorization', {
    user,
    password,
  }).then(response => {
    if (response.status === 200) {
      return response.data;
    }
  }).catch(error => {
    if (error.response?.status === 401) {
      //console.log('Usuário ou senha errado');
    }
  })
}

export function LogOut() {
  api.defaults.headers['Authorization'] = '';
  localStorage.removeItem('@lavanderia:user');
  localStorage.removeItem('@lavanderia:token');

  window.location.href = '/';
}