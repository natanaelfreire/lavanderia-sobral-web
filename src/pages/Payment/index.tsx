import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';

import api from '../../services/api';

import './styles.css';

interface Order {
  cost: number;
  created_at: string;
  date_number: number;
  id: number;
  payment_status: string;
  name: string;
}

export default function Payment() {
  const [ notPaidOrders, setNotPaidOrders ] = useState<Order[]>();
  const [ filteredOrders, setFilteredOrders ] = useState<Order[]>([]);

  const [ inputName, setInputName ] = useState('');
  const [ inputDateStarted, setInputDateStarted ] = useState('');
  const [ inputDateEnded, setInputDateEnded ] = useState('');
  const [ dateToday, setDateToday ] = useState('');

  const search = useLocation().search;
  
  useEffect(() => {
    const date = new Date();
    let currentDate = '';
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    currentDate += String(year) + '-';
    currentDate += month < 10 ? '0' + (month+1) + '-' : String(month+1) + '-';
    currentDate += day < 10 ? '0' + day: String(day);
    setInputDateStarted(currentDate);
    setInputDateEnded(currentDate);
    setDateToday(currentDate);

    api.get('orders-not-paid').then(response => {
      if (response.status === 200) {
        const data: Order[] = response.data;
        setNotPaidOrders(data);
        const filtered = data.filter(order => (order.created_at.split('/').reverse().join('-')) === currentDate);
        setFilteredOrders(filtered);
      }
    })
    
  }, []);

  useEffect(() => {
    const searchCustomerId = new URLSearchParams(search).get('customerId');

    api.get(`customers/${searchCustomerId}`).then(response => {
      if (response.status === 200)
        setInputName(response.data.name);
    })
  }, [search]);

  useEffect(() => {
    const displayNotPaid = document.getElementsByClassName('display-not-paid')[0];
    displayNotPaid.innerHTML = '';

    if (filteredOrders.length === 0) {
      displayNotPaid.innerHTML = 'Nenhum resultado para essa pesquisa.';
      return;
    }

    for (let i = 0; i < filteredOrders.length; ++i) {
      displayNotPaid.innerHTML = displayNotPaid.innerHTML + 
      `<div class="not-paid-block">
        <div class="not-paid-info">
          <p class="not-paid-head">Pagamento parcial pendente</p>
          <p>${filteredOrders[i].name.toUpperCase()}</p>
          <p>Cód. do pedido: ${filteredOrders[i].id}</p>
        </div>
        <div class="not-paid-info">
          <p>Criado em:<br>${filteredOrders[i].created_at}</p>
          <p>Pendente de pagamento:<br><span>R$ ${filteredOrders[i].cost.toFixed(2).split('.').join(',')}</span></p>
        </div>
        <div class="not-paid-button"> 
          <a href="/make-payment/${filteredOrders[i].id}"><button>Pagar</button></a>
        </div>
      </div>`;
    }
  }, [filteredOrders]);

  useEffect(() => {
    if (!inputName) {
      const filtered = notPaidOrders?.filter(order => (order.created_at.split('/').reverse().join('-')) === dateToday);
      if (filtered) setFilteredOrders(filtered);
      return;
    }
    
    const filtered = notPaidOrders?.filter(order => order.name.toUpperCase().includes(inputName.toUpperCase()));
    setFilteredOrders(filtered || []);
  }, [inputName, dateToday, notPaidOrders]);

  useEffect(() => {
    if (inputDateStarted && inputDateEnded) {
      const filtered = notPaidOrders?.filter(order => (order.created_at.split('/').reverse().join('-') >= inputDateStarted) && (order.created_at.split('/').reverse().join('-') <= inputDateEnded));
      if (filtered) setFilteredOrders(filtered);
      return;
    }
  }, [inputDateStarted, inputDateEnded, notPaidOrders]);

  return (
    <div className="page-payment">
      <Sidebar/>

      <main className="main-content">
        <h1>Histórico de não pago&nbsp;<RiMoneyDollarCircleLine/></h1>

        <div className="body-main-content">
          <div className="display-not-paid">

          </div>

          <div className="not-paid-filter">
            <Input 
              label="" 
              name="name-filter" 
              inputType="text" 
              placeholder="Nome..."
              value={inputName}
              onChange={e => setInputName(e.target.value)}
            />
            <Input 
              label="" 
              name="date-started" 
              inputType="date"
              value={inputDateStarted}
              onChange={e => setInputDateStarted(e.target.value)}
            />
            <Input 
              label="" 
              name="date-ended" 
              inputType="date"
              value={inputDateEnded}
              onChange={e => setInputDateEnded(e.target.value)}
            />
          </div>
        </div>
        
      </main>
    </div>
  );
}