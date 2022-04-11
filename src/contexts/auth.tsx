import React, { createContext, CSSProperties, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../services/api';
import * as auth from '../services/auth';

const styles: CSSProperties = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(user: string, password: string): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [ user, setUser ] = useState<object | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const storageUser = localStorage.getItem('@lavanderia:user');
    const storageToken = localStorage.getItem('@lavanderia:token');

    if (storageUser && storageToken) {
      api.defaults.headers['Authorization'] = `Bearer ${storageToken}`;
      setUser(JSON.parse(storageUser));
      setLoading(false);    
    }

  }, []);

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    return (
      <div style={styles}>
        <main>
          <h2>Carregando...</h2>
        </main>
      </div>
    );
  }

  async function signIn(user: string, password: string) {
    const response = await auth.signIn(user, password);

    if (response) {
      api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

      localStorage.setItem('@lavanderia:user', JSON.stringify(response.user));
      localStorage.setItem('@lavanderia:token', response.token);
  
      setUser(response.user);
    }
    else
      toast.error('Usuário ou Senha errado');
  }

  return (
    <AuthContext.Provider value={{signed: !!user, user, signIn}}>
      {children}
      <ToastContainer theme="colored" />
    </AuthContext.Provider>
  );
 };

export default AuthContext;
