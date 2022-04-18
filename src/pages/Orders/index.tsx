import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Select from 'react-select';

import api from '../../services/api';
import { Spinner } from 'react-bootstrap';

interface Order {
  id: number;
  customer: string;
  payment_status: string;
  order_status: string;
  delivery_date: string;
  item_quantity: number;
  cost: number;
  created_at: string;
  created_hours: number;
  customer_id: number;
};

interface Customer {
  value: string;
  label: string;
};

export default function Orders() {
  const [page, setPage] = useState(1);
  const [customerId, setCustomerId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<{ value: string; label: string; } | null>(null);
  const [orderStatus, setOrderStatus] = useState<{ value: string; label: string; } | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>();
  const [loadingData, setLoadingData] = useState(true);

  const [dateCreated, setDateCreated] = useState('');
  const [dateDelivery, setDateDelivery] = useState('');

  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [paymentStatusOptions] = useState([
    { value: '1', label: 'Não pago' },
    { value: '2', label: 'Parcialmente pago' },
    { value: '3', label: 'Pago' }
  ]);
  const [orderStatusOptions] = useState([
    { value: '1', label: 'Pendente' },
    { value: '2', label: 'Coletado' },
    { value: '3', label: 'Retirado' }
  ]);

  useEffect(() => {
    api.get('customers').then(response => {
      if (response.status === 200) {
        const data: {
          id: string;
          name: string;
        }[] = response.data;

        const newCustomerOptions: Customer[] = [];
        data.forEach(customer => {
          const newCustomer = {
            value: customer.id,
            label: customer.name
          }

          newCustomerOptions.push(newCustomer);
        });

        setCustomerOptions(newCustomerOptions);
      }
    });
  }, []);

  useEffect(() => {
    setLoadingData(true);

    api.post('orders/listagem', {
      orderId: null,
      customerId: null,
      dateCreated: null,
      dateDelivery: null,
      orderStatus: null,
      paymentStatus: null,
      page: 1
    }).then(response => {
      if (response.status === 200) {
        const data = response.data;
        setFilteredOrders(data);
        setLoadingData(false);
      }
    })
  }, []);

  function handleOrdersFilterClick() {
    setLoadingData(true);

    api.post('orders/listagem', {
      orderId: orderId ? orderId : null,
      customerId: customerId ? customerId : null,
      dateCreated: dateCreated ? dateCreated : null,
      dateDelivery: dateDelivery ? dateDelivery : null,
      orderStatus: orderStatus ? orderStatus.label : null,
      paymentStatus: paymentStatus ? paymentStatus.label : null,
      page: page
    }).then(response => {
      if (response.status === 200) {
        const data = response.data;
        setFilteredOrders(data);
        setLoadingData(false);
      }
    })
  }

  return (
    <div className="">

      <div className="pagetitle" style={{ color: "#012970" }}>
        <h4>Pedidos</h4>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Pedidos</li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <h5 className="card-title">Filtros</h5>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <label className="mb-1" htmlFor="name">Cliente </label>
              <Select
                required
                id="name"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  })
                }}
                placeholder={'Selecione...'}
                value={customerId ? customerOptions.find(customer => customer.value === customerId) : { value: '0', label: 'Selecione...' }}
                isSearchable
                noOptionsMessage={() => 'Carregando...'}
                onChange={key => {
                  if (key) setCustomerId(key.value);
                }}
                options={customerOptions}
              />
            </div>

            <div className="col-5 col-md-2 mb-2">
              <label className="mb-1" htmlFor="filter-created">Data Cadastro</label>
              <input
                id="filter-created"
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
                value={dateCreated}
                onChange={e => setDateCreated(e.target.value)}
              />
            </div>
            <div className='col-1 col-md-1 mb-2 mt-4' style={{ marginLeft: '-2px' }}>
              <button className='btn btn-sm btn-outline-secondary mt-2' onClick={() => setDateCreated('')}>X</button>
            </div>

            <div className="col-5 col-md-2 mb-2">
              <label className="mb-1" htmlFor="filter-delivery">Data Retirada</label>
              <input
                id="filter-delivery"
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
                value={dateDelivery}
                onChange={e => {
                  setDateDelivery(e.target.value)
                }}
              />
            </div>
            <div className='col-1 col-md-1 mb-2 mt-4' style={{ marginLeft: '-5px' }}>
              <button className='btn btn-sm btn-outline-secondary mt-2' onClick={() => setDateDelivery('')}>X</button>
            </div>

            <div className="col-6 col-md-3 mb-2">
              <label className="mb-1" htmlFor="orderCode">Código do Pedido</label>
              <input
                id="orderCode"
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                type="number"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-4 mb-2">
              <label className="mb-1" htmlFor="paymentStatus">Status Pagamento</label>
              <Select
                required
                id="paymentStatus"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  })
                }}
                placeholder={'Selecione...'}
                value={paymentStatus}
                isSearchable
                isClearable
                onChange={key => {
                  if (key)
                    setPaymentStatus({ value: key.value, label: key.label });
                  else
                    setPaymentStatus(null);
                }}
                options={paymentStatusOptions}
              />
            </div>

            <div className="col-6 col-md-4 mb-2">
              <label className="mb-1" htmlFor="orderStatus">Status Serviço</label>
              <Select
                required
                id="orderStatus"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  })
                }}
                placeholder={'Selecione...'}
                value={orderStatus}
                isSearchable
                isClearable
                onChange={key => {
                  if (key)
                    setOrderStatus({ value: key.value, label: key.label });
                  else
                    setOrderStatus(null);
                }}
                options={orderStatusOptions}
              />
            </div>

            <div className="col-6 col-md-1 mb-2 mt-4">
              <button className="btn btn-sm btn-primary mt-2" onClick={handleOrdersFilterClick}>Filtrar</button>
            </div>
          </div>


        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <h5 className="card-title">Listagem</h5>
            {/* <button className="btn btn-sm btn-primary" onClick={() => handleOpenModal('')}><i className="bi bi-plus-lg"> </i> Adicionar</button> */}
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="fw-bold">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Quantidade de Peças</th>
                  <th scope="col" style={{ whiteSpace: 'nowrap' }}>Data Cadatro</th>
                  <th scope="col" style={{ whiteSpace: 'nowrap' }}>Data Retirada</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Status Pedido</th>
                  <th scope="col">Status Pagamento</th>
                  <th scope="col" className="text-center" style={{ width: "10%" }}>Ações</th>
                </tr>
              </thead>
              <tbody id="table-costumers-body">
                {filteredOrders && filteredOrders.length > 0 ? filteredOrders.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>{item.customer.toUpperCase()}</td>
                    <td>{item.item_quantity}</td>
                    <td>{item.created_at} <br /> <span style={{ whiteSpace: 'nowrap' }}>[{item.created_hours}:00 - {item.created_hours + 1}:00]</span></td>
                    <td>{item.delivery_date.split('-').reverse().join('/')}</td>
                    <td>{item.cost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td>{item.order_status}</td>
                    <td>
                      {item.payment_status === 'Pago' ?
                        (<span className='badge bg-success'>{item.payment_status}</span>) :
                        (item.payment_status === 'Não pago' ?
                          (<span className='badge bg-danger'>{item.payment_status}</span>) :
                          (<span className='badge bg-warning'>{item.payment_status}</span>))
                      }</td>
                    <td className="text-center"><a href={`/orders/${item.id}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-info" style={{ whiteSpace: 'nowrap' }}><i className="bi bi-box-arrow-up-right"></i> Detalhes</a> </td>
                  </tr>
                )) :
                  <tr>
                    <td className="text-center" colSpan={9}>{loadingData ? <Spinner animation="border" role="status" /> : 'Nenhuma peça encontrada.'}</td>
                  </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}