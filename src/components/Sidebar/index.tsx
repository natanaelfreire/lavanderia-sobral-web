import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiUsers, FiEdit, FiRepeat } from 'react-icons/fi'
import { IoShirtOutline } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { BiMoney } from 'react-icons/bi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

import logoImg from '../../assets/images/logo.jpg';

import './styles.css';

export default function Sidebar() {
  const history = useHistory();
  const [ user, setUser ] = useState('Carregando...');

  useEffect(() => {
    const storageUser = localStorage.getItem('@lavanderia:user');
    if (storageUser) setUser(JSON.parse(storageUser).name);
  }, []);

  function handleLogout() {
    localStorage.removeItem('@lavanderia:user');
    localStorage.removeItem('@lavanderia:token');

    history.push('/');
    window.location.reload();
  }

  return (
    <div className="sidebar">
      <div className="div-logo">
        <img src={logoImg} alt="logo" width="100%"></img>
      </div>
      
      <Link to="/create-order" className="create-order"><FaPlus /><span>Criar Pedido</span></Link>
      <Link to="/customers" className="options"><FiUsers size="18px"/> &nbsp; Clientes</Link>
      <Link to="/items" className="options"><IoShirtOutline size="18px"/> &nbsp; Peças</Link>
      <Link to="/orders" className="options"><FiEdit size="18px"/> &nbsp; Pedidos</Link>
      <Link to="/processing" className="options"><FiRepeat size="18px"/> &nbsp; Entradas e Saídas</Link>
      <Link to="/payment" className="options"><BiMoney size="18px"/> &nbsp; Não Pagos</Link>
      <Link to="/payment" className="options"><RiMoneyDollarCircleLine size="18px"/> &nbsp; Financeiro</Link>
      <p className="username">{user}</p>
      <p className="logout" onClick={handleLogout}>Sair</p>
    </div>
  );
}