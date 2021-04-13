import axios from 'axios';

const apiAuthorization = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiAuthorization.defaults.withCredentials = true;

interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function signIn(user: string, password: string): Promise<Response> {
  return apiAuthorization.post('authorization', {
    user,
    password,
  }).then(response => {
    if (response.status === 200) {
      return response.data;
    }
  })
}