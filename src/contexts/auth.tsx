import React, { createContext, useEffect, useState } from 'react';
import * as auth from '../services/auth';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(user: string, password: string): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [ user, setUser ] = useState<object | null>(null);

  useEffect(() => {
    const storageUser = localStorage.getItem('@lavanderia:user');
    const storageToken = localStorage.getItem('@lavanderia:token');

    if (storageUser && storageToken) {
      // api.defaults.headers['Authorization'] = `Bearer ${storageToken}`;
      setUser(JSON.parse(storageUser));
    }
  }, []);

  async function signIn(user: string, password: string) {
    const response = await auth.signIn(user, password);

    setUser(response.user);

    // api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

    localStorage.setItem('@lavanderia:user', JSON.stringify(response.user));
    localStorage.setItem('@lavanderia:token', response.token);
  }

  return (
    <AuthContext.Provider value={{signed: !!user, user, signIn}}>
      {children}
    </AuthContext.Provider>
  );
 };

export default AuthContext;
