import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import monthToNumber from '../../utils/monthToNumber';

import Sidebar from '../../components/Sidebar';

import './styles.css';

import api from '../../services/api';
import displayOrdersProcessing from '../../utils/displayOrdersProcessing';

interface OrderDisplaeyd {
  id: string;
  order_status: string;
  delivery_date: string;
  created_at: string;
  date_number: number;
  date_out_number: number;
  created_hours: number;
  customer_id: string;
}

export default function Processing() {
  const [ calendarValue, setCalendarValue ] = useState<Date | Date[]>([ new Date(), new Date() ]);
  const [ calendarStart, setCalendarStart ] = useState('');
  const [ calendarEnd, setCalendarEnd ] = useState('');

  const [ filteredInOrders, setFilteredInOrders ] = useState<OrderDisplaeyd[]>([]);
  const [ filteredOutOrders, setFilteredOutOrders ] = useState<OrderDisplaeyd[]>([]);

  useEffect(() => {
    if (Array.isArray(calendarValue)) {
      let start = calendarValue[0].toString();
      let end = calendarValue[1].toString();
      
      start = start.split('GMT')[0];
      end = end.split('GMT')[0];
      
      let startDay = start.split(' ')[2];
      let startMonth = monthToNumber(start.split(' ')[1]);
      let startYear = start.split(' ')[3];
      let endDay = end.split(' ')[2];
      let endMonth = monthToNumber(end.split(' ')[1]);
      let endYear = end.split(' ')[3];

      setCalendarStart(startYear + '-' + startMonth + '-' + startDay);
      setCalendarEnd(endYear + '-' + endMonth + '-' + endDay);
    }
  }, [calendarValue]);

  useEffect(() => {
    const optionSelected = document.querySelector('#style-selected');
    const className =  optionSelected?.getAttribute('class');

    if (calendarStart && calendarEnd) {
      api.get('orders', {
        params: {
          dateStart: calendarStart,
          dateEnd: calendarEnd,
          outOrders: true
        }
      }).then(response => {
        if (response.status === 200) {
          setFilteredOutOrders(response.data);
          if (className === 'ordersOut') displayOrdersProcessing(response.data);
        }         
      });
      
      api.get('orders', {
        params: {
          dateStart: calendarStart,
          dateEnd: calendarEnd
        }
      }).then(response => {
        if (response.status === 200) {
          const { orders } = response.data;
          setFilteredInOrders(orders);
          if (className === 'ordersIn') displayOrdersProcessing(orders);
        }
      });
    }
  }, [calendarStart, calendarEnd]);

  function handleInClick() {
    const buttonIn = document.querySelector('.ordersIn');
    const buttonOut = document.querySelector('.ordersOut');
    buttonIn?.setAttribute('id', 'style-selected');
    buttonOut?.setAttribute('id', '');

    displayOrdersProcessing(filteredInOrders);
  }

  function handleOutClick() {
    const buttonIn = document.querySelector('.ordersIn');
    const buttonOut = document.querySelector('.ordersOut');
    buttonIn?.setAttribute('id', '');
    buttonOut?.setAttribute('id', 'style-selected');

    displayOrdersProcessing(filteredOutOrders);
  }

  return (
    <div className="page-processing">
      <Sidebar/>

      <main className="main-content">
        <h1>Processamento</h1>

        <div className="body-content">
          <div className="calendar-display">
            <Calendar 
              onChange={e => setCalendarValue(e)}
              selectRange
              value={calendarValue}
            />          
          </div>

          <div className="orders-block">
            <div className="buttons-top">
              <button onClick={handleInClick} className="ordersIn" id="style-selected">Entradas</button>
              <button onClick={handleOutClick} className="ordersOut">Saídas</button>
            </div>
            
            <div className="orders-display">
              
            </div>

          </div>
        </div>
      
      </main>
    </div>
  );
}