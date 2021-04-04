import React, { FormEvent, useContext, useState } from 'react';
import AuthContext from '../../contexts/auth';

import './styles.css';

export default function Login() {
  const { signed, signIn } = useContext(AuthContext);
  const [ userInput, setUserInput ] = useState('');
  const [ passwordInput, setPasswordInput ] = useState('');

  console.log(signed);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    signIn(userInput, passwordInput);
  }

  return (
    <div>
      <h1>Login page</h1>
      <form>
        <label htmlFor="user">User: </label>
        <input type="text" id="user" value={userInput} onChange={e => setUserInput(e.target.value)}/>
        <label htmlFor="password">Passsword: </label>
        <input type="text" id="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)}/>
        <button onClick={handleLogin}>Entrar!</button>
      </form>
    </div>
  );
}