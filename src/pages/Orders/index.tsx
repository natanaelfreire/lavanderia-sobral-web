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
}

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
}

interface Customer {
  value: string;
  label: string;
}

export default function Orders() {
  const [ customerId, setCustomerId ] = useState('');
  const [ orderId, setOrderId ] = useState('');
  const [ paymentStatus, setPaymentStatus ] = useState<{value: string; label: string;}>();
  const [ orderStatus, setOrderStatus ] = useState<{value: string; label: string;}>();

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

  const displayContent = async (content: {orders: Order[], itemAddedByOrderId: Item[][]}) => {
    const { orders, itemAddedByOrderId } = content;
    const displayOrders = document.getElementsByClassName('display-orders')[0];

    if (orders.length === 0) return displayOrders.innerHTML = '<p class="no-orders-found">Não foi encontrado nenhum pedido.</p>';

    displayOrders.innerHTML = 
    `<div class="head-order-field">
      <p class="order-info">Pedido</p>
      <p class="customer-info">Cliente</p>
      <p class="delivery-date">Data da Retirada</p>
      <p class="additional-info">Infos Adicionais</p>
      <p class="order-actions-head">Ações</p>
    </div>`;

    for (let i = 0; i < orders.length; i++) {
      const items = itemAddedByOrderId[orders[i].id];
      let displayItems = ''; 
      if (items) items.forEach(item => {
        displayItems += `<p>${item.unit_quantity}x ${item.description} - disc.${item.unit_discount} - R$${item.unit_subtotal.toFixed(2).split('.').join(',')}</p>`;
      });

      await api.get(`customers/${orders[i].customer_id}`).then(response => {
        if (response.status === 200) {
          const customer: {
            name: string;
            phone: string;
            address: string
          } = response.data;

          displayOrders.innerHTML = displayOrders.innerHTML + 
          `<div class="order-field">
            <div class="order-info">
              <p class=${orders[i].payment_status === 'Não pago' ? "payment-status-not-paid": orders[i].payment_status === 'Pago' ? "payment-status-paid" : "payment-status-partially"}>${orders[i].payment_status.toUpperCase()}</p>
              <p><span>Cód do pedido: </span>${orders[i].id}</p>
              <p><span>Criado em: </span>${orders[i].created_at}</p>
              <p>-----------------------------------</p>
              ${displayItems}
              <p>-----------------------------------</p>
              <p><span>Subtotal: </span>R$${orders[i].subtotal.toFixed(2).split('.').join(',')}</p>
              <p><span>Disconto aplicado: </span>${orders[i].discount.toFixed(2).split('.').join(',')}</p>
              <p><span>Pagamento efetuado: </span>R$${orders[i].payment_made.toFixed(2).split('.').join(',')}</p>
              <p><span>${orders[i].payment_status === 'Parcialmente pago'? "Falta pagar: " : "Total a pagar: "}</span>R$${orders[i].cost.toFixed(2).split('.').join(',')}</p>
            </div>

            <div class="customer-info">
              <p><span>${customer.name.toUpperCase()}</span></p>
              <p><span>Endereço: </span>${customer.address}</p>
              <p><span>Telefone: </span>${customer.phone}</p>
            </div>

            <div class="delivery-date">
              <p>${orders[i].delivery_date.split('-').reverse().join('/')}</p>
            </div>

            <div class="additional-info">
              <p class=${orders[i].order_status === 'Pendente' ? "order-status-pending" : "order-status-collected"}>${orders[i].order_status}</p>
              <p><span>Tipo pagamento: </span>${orders[i].payment_type}</p>
            </div>

            <div class="order-actions" id=${orders[i].id}>
              <button>Imprimir</button>
              <a href="/make-payment/${orders[i].id}"><button>Realizar pagamento</button></a>
            </div>
          </div>`
        
        }
      });

    }

    const orderActions = document.getElementsByClassName('order-actions');
    
    Array.from(orderActions).forEach(element => {
      if (element.children.length !== 4) {
        const changeStatusButton = document.createElement('button');
        changeStatusButton.textContent = "Alterar status";
        changeStatusButton.onclick = async function () {
          if (window.confirm('Confirmar alteração de status?')) await api.patch(`/orders/${element.id}`, {
            order_status: 'Coletado'
          }).then(response => {
            if (response.status === 200) {
              handleOrdersFilterClick();
            }
          });
        }
        element.appendChild(changeStatusButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Cancelar / Excluir";
        deleteButton.onclick = async function () {
          if (window.confirm('Deseja excluir pedido?')) await api.delete(`/orders/${element.id}`).then(response => {
            if (response.status === 204) {
              handleOrdersFilterClick();
            }
          });
        }
        element.appendChild(deleteButton);
      }
    })
      
  }

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
          displayContent(data);
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
          displayContent(data);
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
        displayContent(data);
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

        </div>
        
      </main>
    </div>
  );
}