import React, { createContext, CSSProperties, useEffect, useState } from 'react';
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

    async function getOriginalToken() {
      await api.post('session', {
        user: storageUser
      }).then(response => {
        if (response.status === 200) {
          const originalToken: {
            user: string;
            token: string;
          } = response.data;

          console.log(originalToken);
          console.log(storageToken)

          if (originalToken.token === storageToken) {
            if (storageUser) setUser(JSON.parse(storageUser));
            setLoading(false);
          }
        }
      })
    }

    if (storageUser && storageToken) {
      // api.defaults.headers['Authorization'] = `Bearer ${storageToken}`;
      getOriginalToken();      
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, []);

  if (loading) {
    return (
      <div style={styles}>
        <main>
          <h1>Carregando...</h1>
        </main>
      </div>
    );
  }

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
