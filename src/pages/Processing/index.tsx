import React, { useEffect, useState } from 'react';

import api from '../../services/api';

interface OrderInsAndOuts {
  id: number;
  order_status: string;
  payment_status: string;
  delivery_date: string;
  created_at: string;
  created_hours: number;
  name: string;
}

export default function Processing() {
  const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString('pt-br').split('/').reverse().join('-'));

  const [displayedOrdersIn, setDisplayedOrdersIn] = useState<OrderInsAndOuts[] | null>(null);
  const [displayedOrdersOut, setDisplayedOrdersOut] = useState<OrderInsAndOuts[] | null>(null);

  useEffect(() => {
    async function loadOrders() {
      if (dateFilter) {
        api.post('orders/insAndOuts', {
          date: dateFilter,
        }).then(response => {
          if (response.status === 200) {
            const data: { ordersIn: OrderInsAndOuts[], ordersOut: OrderInsAndOuts[] } = response.data;

            setDisplayedOrdersIn(data.ordersIn);
            setDisplayedOrdersOut(data.ordersOut);
          }
        });
      }
    }

    loadOrders();

  }, [dateFilter]);

  return (
    <div className="">

      <div className="row">
        <div className="col-12 col-md-3 mb-2">
          <label className="mb-1" htmlFor="filter-date">Data Referência</label>
          <input
            id="filter-date"
            required
            className="py-1 px-2"
            style={{
              width: '100%',
              borderColor: '#ccc',
              borderRadius: '4px',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            type="date"
            value={dateFilter}
            onChange={e => {
              setDateFilter(e.target.value)
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 mt-2 mb-2">
          <div className="pagetitle" style={{ color: "#4154f1" }}>
            <h4>Saídas <i className="bi bi-arrow-bar-right"></i></h4>
          </div>

          <div className="row">
            <div className="col-12 col-sm-10">
              {displayedOrdersOut && displayedOrdersOut.length > 0 ? displayedOrdersOut.map(order => (
                <div className="card mb-3 bg-light" style={{ width: '100%' }} key={order.id}>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{order.name.toUpperCase()}</h5>
                    <hr></hr>
                    <h6 className="card-subtitle mb-2 text-muted">Data Retirada: {order.delivery_date.split('-').reverse().join('/')}</h6>
                    <hr></hr>
                    <p className="card-text">Retirada: <span className={`badge ${order.order_status === 'Retirado' ? 'bg-success' : 'bg-secondary'}`}>{order.order_status}</span></p>
                    <p className="card-text">Pagamento: <span className={`badge ${order.payment_status === 'Pago' ? 'bg-success' : 'bg-danger'}`}>{order.payment_status}</span></p>
                    <a href={`/orders/${order.id}`} target="_blank" rel="noreferrer" className="btn btn-link float-start p-0" style={{ fontSize: '14px' }}>Detalhes <i className="bi bi-box-arrow-up-right"></i></a>
                  </div>
                </div>
              )) : ''}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mb-2">
          <div className="pagetitle" style={{ color: "#4154f1" }}>
            <h4>Entradas <i className="bi bi-arrow-bar-left"></i></h4>
          </div>

          <div className="row">
            <div className="col-12 col-sm-10">
              {displayedOrdersIn && displayedOrdersIn.length > 0 ? displayedOrdersIn.map(order => (
                <div className="card mb-3 bg-light" style={{ width: '100%' }} key={order.id}>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{order.name.toUpperCase()}</h5>
                    <hr></hr>
                    <h6 className="card-subtitle mb-2 text-muted">Criado em {order.created_at} [{order.created_hours}:00 - {order.created_hours + 1}:00]</h6>
                    <hr></hr>
                    <p className="card-text">Retirada: <span className={`badge ${order.order_status === 'Retirado' ? 'bg-success' : 'bg-secondary'}`}>{order.order_status}</span></p>
                    <p className="card-text">Pagamento: <span className={`badge ${order.payment_status === 'Pago' ? 'bg-success' : 'bg-danger'}`}>{order.payment_status}</span></p>
                    <a href={`/orders/${order.id}`} target="_blank" rel="noreferrer" className="btn btn-link float-start p-0" style={{ fontSize: '14px' }}>Detalhes <i className="bi bi-box-arrow-up-right"></i></a>
                  </div>
                </div>
              )) : ''}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}