import React, { FormEvent, useContext, useState } from 'react';
import AuthContext from '../../contexts/auth';

import './styles.css';

export default function Login() {
  const {/* signed,*/ signIn } = useContext(AuthContext);
  const [ userInput, setUserInput ] = useState('');
  const [ passwordInput, setPasswordInput ] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    signIn(userInput, passwordInput);
  }

  return (
    <div className="page-login">
      <div className="main-content">
        <h2>LOGIN</h2>
        <form>
          <input 
            type="text" 
            id="user" 
            value={userInput} 
            onChange={e => setUserInput(e.target.value)} 
            placeholder="Usuário"
          />
          <input 
            type="password" 
            id="password" 
            value={passwordInput} 
            onChange={e => setPasswordInput(e.target.value)} 
            placeholder="Senha"
          /><br></br>
          <button onClick={handleLogin}>Entrar</button>
        </form>
      </div>
    </div>
      
  );
}