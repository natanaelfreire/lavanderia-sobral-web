import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import monthToNumber from '../../utils/monthToNumber';
import { toast } from 'react-toastify';

import './styles.css';

import api from '../../services/api';

interface OrderInsAndOuts {
  id: number;
  order_status: string;
  delivery_date: string;
  created_at: string;
  created_hours: number;
  name: string;
}

export default function Processing() {
  const [calendarValue, setCalendarValue] = useState<Date | Date[]>([new Date(), new Date()]);
  const [calendarStart, setCalendarStart] = useState('');
  const [calendarEnd, setCalendarEnd] = useState('');

  const [displayedOrders, setDisplayedOrders] = useState<OrderInsAndOuts[]>([]);
  const [optionSelected, setOptionSelected] = useState('in');
  const [count, setCount] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [idOrderModal, setIdOrderModal] = useState('');
  const [descriptionOrderModal, setDescriptionOrderModal] = useState('');
  const [confirmButtonIsDisabled, setConfirmButtonIsDisabled] = useState(false);

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
    async function loadOrders() {
      if (calendarStart && calendarEnd) {
        api.post('orders-ins-outs', {
          dateStart: calendarStart,
          dateEnd: calendarEnd,
        }).then(response => {
          if (response.status === 200) {
            const data : {ordersIn: OrderInsAndOuts[], ordersOut: OrderInsAndOuts[]} = response.data;
            
            if (optionSelected === 'in')
              setDisplayedOrders(data.ordersIn);

            if (optionSelected === 'out')
              setDisplayedOrders(data.ordersOut);

          }
        });
      }
    }

    loadOrders();

  }, [calendarStart, calendarEnd, optionSelected, count]);

  function handleInClick() {
    const buttonIn = document.querySelector('.ordersIn');
    const buttonOut = document.querySelector('.ordersOut');
    buttonIn?.setAttribute('id', 'style-selected');
    buttonOut?.setAttribute('id', '');

    setOptionSelected('in');
  }

  function handleOutClick() {
    const buttonIn = document.querySelector('.ordersIn');
    const buttonOut = document.querySelector('.ordersOut');
    buttonIn?.setAttribute('id', '');
    buttonOut?.setAttribute('id', 'style-selected');

    setOptionSelected('out');
  }

  function handleOrderFinish(orderId: number, name: string) {
    setModalIsOpen(true);
    setIdOrderModal(orderId.toString());
    setDescriptionOrderModal(name);
  }

  function handleConfirmOrderFinish() {
    setConfirmButtonIsDisabled(true);

    toast.promise(api.patch(`orders/${idOrderModal}`, {
      order_status: 'Finalizado'
    }), {
      pending: 'Atualizando os dados...',
      success: {
        render() {
          setCount(count + 1);
          setConfirmButtonIsDisabled(false);
          setModalIsOpen(false);
          
          return 'Pedido atualizado com sucesso!'
        }
      },
      error: {
        render() {
          setConfirmButtonIsDisabled(false);

          return 'Erro ao salvar os dados.';
        }
      }
    })
    
  }

  return (
    <div className="container">
      <h5 className="bg-primary p-1 rounded text-white bg-opacity-75">ENTRADAS E SAÍDAS</h5>

      <div className="row">
        <div className="col-12 col-md-5 mt-2 mb-2">
          <h6>Selecione um intervalo de datas no calendário</h6>

          <Calendar
            onChange={e => setCalendarValue(e)}
            selectRange
            value={calendarValue}
          />
        </div>

        <div className="col-12 col-md-5 mt-2">
          <h6 className="text-center">Selecione uma das opções [Entrada] ou [Saída]</h6>

          <div className="row">
            <div className="col-6 d-flex justify-content-center buttons-top">
              <button onClick={handleInClick} className="ordersIn" id="style-selected">Entradas</button>
            </div>
            <div className="col-6 d-flex justify-content-center buttons-top">
              <button onClick={handleOutClick} className="ordersOut">Saídas</button>
            </div>
            <div className="col-12">
              {displayedOrders && displayedOrders.length > 0 ? displayedOrders.map(order => (
                <div className="card mb-3 bg-light" style={{ width: '100%' }} key={order.id}>
                  <div className="card-body">
                    <h5 className="card-title">{order.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Criado em {order.created_at} [{order.created_hours}:00 - {order.created_hours + 1}:00]</h6>
                    <p className="card-text">Status: <span className={`badge ${order.order_status === 'Pendente' ? 'bg-warning text-dark' : 'bg-success'}`}>{order.order_status}</span></p>
                    <a href={`/orders?orderId=${order.id}`} target="_blank" rel="noreferrer" className="btn btn-link float-start p-0" style={{ fontSize: '14px' }}>Detalhes</a>
                    <button className={`btn btn-link float-end p-0 ${order.order_status === 'Finalizado' ? 'd-none' : ''}`} style={{ fontSize: '14px' }} onClick={() => handleOrderFinish(order.id, order.name)}>Foi finalizado?</button>
                  </div>
                </div>
              )) : ''}

            </div>
          </div>

        </div>
      </div>

        <div className={`modal-content rounded-4 shadow w-50 position-fixed top-0 ${modalIsOpen ? 'd-block' : 'd-none'}`}>
          <div className="modal-body p-3 text-center">
            <h5 className="m-0">Confirmar: este pedido foi <span className="text-success">FINALIZADO</span>?</h5>
            <p className="m-0 mt-2"><strong>#{idOrderModal}</strong> - {descriptionOrderModal}</p>
          </div>
          <div className="modal-footer flex-nowrap p-0">
            <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 border border-top-0" disabled={confirmButtonIsDisabled} onClick={handleConfirmOrderFinish}><strong>Sim</strong></button>
            <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal" onClick={() => setModalIsOpen(false)}>Não</button>
          </div>
        </div>

    </div>
  );
}