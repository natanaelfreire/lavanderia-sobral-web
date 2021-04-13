import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { FiX } from 'react-icons/fi';

import Sidebar from '../../components/Sidebar';
import Select from 'react-select';
import Input from '../../components/Input';

import api from '../../services/api';

import './styles.css';

interface Item {
  description: string;
  item_id: string;
  observation: string;
  order_id: number;
  unit_cost: number;
  unit_discount: number;
  unit_quantity: number;
  unit_subtotal: number;
};

interface Order {
  id: number;
  order_status: string;
  payment_status: string;
  payment_type: string;
  payment_moment: string;
  delivery_date: string;
  item_quantity: number;
  subtotal: number;
  discount: number;
  payment_made: number;
  cost: number;
  created_at: string;
  date_number: number;
  date_out_number: number;
  created_hours: number;
  customer_id: number; 
};

interface Customer {
  value: string;
  label: string;
};

interface FilteredCustomer {
  [id: string]: {
    name: string;
    address: string;
    phone: string;
  }
};

export default function Orders() {
  const [ customerId, setCustomerId ] = useState('');
  const [ orderId, setOrderId ] = useState('');
  const [ paymentStatus, setPaymentStatus ] = useState<{value: string; label: string;}>();
  const [ orderStatus, setOrderStatus ] = useState<{value: string; label: string;}>();
  const [ filteredOrders, setFilteredOrders ] = useState<{orders: Order[], itemAddedByOrderId: Item[][], customerByOrderId: FilteredCustomer}>();

  const [ dateStart, setDateStart ] = useState('');
  const [ dateEnd, setDateEnd ] = useState('');
  
  const [ customerOptions, setCustomerOptions ] = useState<Customer[]>([]);
  const [ paymentStatusOptions ] = useState([
    { value: '1', label: 'Não pago' },
    { value: '2', label: 'Parcialmente pago' },
    { value: '3', label: 'Pago' }
  ]);
  const [ orderStatusOptions ] = useState([
    { value: '1', label: 'Pendente' },
    { value: '2', label: 'Coletado' }
  ]);
  
  const search = useLocation().search;
  const searchCustomerId = new URLSearchParams(search).get('customerId');
  const searchOrderId = new URLSearchParams(search).get('orderId');

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
    if (searchCustomerId) {
      setCustomerId(searchCustomerId);
      
      api.get('orders', {
        params: {
          customerId: searchCustomerId
        }
      }).then(response => {
        if (response.status === 200) {
          const data = response.data;
          setFilteredOrders(data);
        }
      })
    }
  }, [searchCustomerId]);

  useEffect(() => {
    if (searchOrderId) {
      api.get('orders', {
        params: {
          orderId: searchOrderId
        }
      }).then(response => {
        if (response.status === 200) {
          const data = response.data;
          setFilteredOrders(data);
        }
      })
    }
  }, [searchOrderId]);

  function handleOrdersFilterClick() {
    api.get('orders', {
      params: {
        customerId: customerId? customerId : searchCustomerId,
        orderId,
        paymentStatus: paymentStatus?.label,
        orderStatus: orderStatus?.label,
        dateStart,
        dateEnd
      }
    }).then(response => {
      if (response.status === 200) {
        const data = response.data;       
        setFilteredOrders(data);
      }
    });
  }

  return (
    <div className="page-orders">
      <Sidebar />

      <main className="main-content">
        <h1>Preencha algum campo para fazer a filtragem...</h1>

        <div className="block">
          <label htmlFor="name"style={{paddingBottom: '8px'}}>Cliente: </label>
          <div className="select" style={{width: '100%'}}>
            <Select
              id="name" 
              placeholder={'Selecione...'}
              isSearchable
              isClearable
              onChange={key => {
                if (key) setCustomerId(key.value); else setCustomerId('');
              }}
              options={customerOptions}
            />
          </div>
        </div>

        <div className="block">
          <Input 
            label="Cód. do pedido: " 
            name="order-code" 
            inputType="number" 
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
          />

          <label htmlFor="payment-status" style={{width: 'max-content'}}>Status do pagamento: </label>
          <div className="select" style={{width: '60%', marginTop: '5px'}}>
              <Select 
                id="payment-status" 
                placeholder={'Selecione...'}
                isSearchable
                defaultValue={paymentStatus}
                onChange={key => {
                  if (key) setPaymentStatus(key); else setPaymentStatus(undefined);
                }}
                isClearable
                options={paymentStatusOptions}
              />
          </div>          
          <label htmlFor="oder-status" style={{width: 'max-content'}}>Status da coleta: </label>
          <div className="select" style={{width: '60%', marginTop: '5px'}}>
              <Select
                placeholder={'Selecione...'}
                id="oder-status" 
                isSearchable
                defaultValue={orderStatus}
                onChange={key => {
                  if (key) setOrderStatus(key); else setOrderStatus(undefined);
                }}
                isClearable
                options={orderStatusOptions}
              />
          </div>
        </div>

        <h2>Intervalo de datas (opcional):</h2>

        <div className="date-interval">
          <div className="date-input">
            <Input 
              label="Data início: " 
              name="date-start" 
              inputType="date" 
              value={dateStart}
              onChange={e => setDateStart(e.target.value)}
            />
            <button onClick={() => setDateStart('')}><FiX color={'black'}/></button>
          </div>
          
          <div className="date-input">
            <Input 
              label="Data final: " 
              name="date-end" 
              inputType="date" 
              value={dateEnd}
              onChange={e => setDateEnd(e.target.value)}
            />
            <button onClick={() => setDateEnd('')}><FiX color={'black'} /></button>
          </div>
        </div>

        <button 
          type="button" 
          className="filter-button"
          onClick={handleOrdersFilterClick}
        >Filtrar</button>

        <div className="display-orders">
          {filteredOrders? (<div>
            <div className="head-order-field">
              <p className="order-info">Pedido</p>
              <p className="customer-info">Cliente</p>
              <p className="delivery-date">Data da Retirada</p>
              <p className="additional-info">Infos Adicionais</p>
              <p className="order-actions-head">Ações</p>
            </div>

            {filteredOrders.orders.map(order => (
                <div className="order-field" key={order.id}>
                  <div className="order-info">
                    <p className={order.payment_status === 'Não pago' ? "payment-status-not-paid": order.payment_status === 'Pago' ? "payment-status-paid" : "payment-status-partially"}>{order.payment_status.toUpperCase()}</p>
                    <p><span>Cód do pedido: </span>{order.id}</p>
                    <p><span>Criado em: </span>{order.created_at}</p>
                    <p>-----------------------------------</p>
                      {filteredOrders.itemAddedByOrderId[order.id].map(item => (
                        <p key={item.item_id}>{item.unit_quantity}x {item.description} - disc.{item.unit_discount} - R${Number(item.unit_subtotal).toFixed(2).split('.').join(',')}</p>
                      ))}
                    <p>-----------------------------------</p>
                    <p><span>Subtotal: </span>R${Number(order.subtotal).toFixed(2).split('.').join(',')}</p>
                    <p><span>Disconto aplicado: </span>{Number(order.discount).toFixed(2).split('.').join(',')}</p>
                    <p><span>Pagamento efetuado: </span>R${Number(order.payment_made).toFixed(2).split('.').join(',')}</p>
                    <p><span>{order.payment_status === 'Parcialmente pago'? "Falta pagar: " : "Total a pagar: "}</span>R${Number(order.cost).toFixed(2).split('.').join(',')}</p>
                  </div>
                  
                  <div className="customer-info">
                    <p><span>{filteredOrders.customerByOrderId[String(order.id)].name.toUpperCase()}</span></p>
                    <p><span>Endereço: </span>{filteredOrders.customerByOrderId[String(order.id)].address}</p>
                    <p><span>Telefone: </span>{filteredOrders.customerByOrderId[String(order.id)].phone}</p>
                  </div>

                  <div className="delivery-date">
                    <p>{order.delivery_date.split('-').reverse().join('/')}</p>
                  </div>

                  <div className="additional-info">
                    <p className={order.order_status === 'Pendente' ? "order-status-pending" : "order-status-collected"}>{order.order_status}</p>
                    <p><span>Tipo pagamento: </span>{order.payment_type}</p>
                  </div>

                  <div className="order-actions" id={String(order.id)}>
                    <a href={"/download?orderId=" + order.id} target="_blank" rel="noreferrer"><button>Imprimir</button></a>
                    <a href={`/orders-edit/${order.id}`}><button>Editar peças</button></a>
                    <a href={"/make-payment/" + order.id}><button>Realizar pagamento</button></a>
                    <button onClick={async () => {
                      if (window.confirm('Deseja excluir pedido?')) await api.delete(`/orders/${order.id}`).then(response => {
                        if (response.status === 204) {
                          handleOrdersFilterClick();
                        }
                      });
                    }}>Cancelar / Excluir</button>
                  </div>
                </div>
              )

            )}
          </div>) : <p className="no-orders-found">Não foi encontrado nenhum pedido.</p>}
        </div>
        
      </main>
    </div>
  );
}