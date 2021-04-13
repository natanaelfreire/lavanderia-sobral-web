import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Select from 'react-select';

import api from '../../services/api';

import './styles.css';

interface Params {
  id: string;
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

export default function MakePayment() {
  const [ customerName, setCustomerName ] = useState('');
  const [ order, setOrder ] = useState<Order>();
  const [ subtotal, setSubtotal ] = useState(0);
  const [ discount, setDiscount ] = useState(0);
  const [ paymentMade, setPaymentMade ] = useState(0);
  const [ cost, setCost ] = useState(0);

  const [ orderStatus, setOrderStatus ] = useState<{value: string; label: string;}>();
  const [ paymentType, setPaymentType ] = useState<{value: string; label: string;}>();
  const [ payment, setPayment ] = useState('');
  const { id } = useParams<Params>();
  const history = useHistory();

  const [ orderStatusOptions ] = useState([
    { value: '1', label: 'Pendente' },
    { value: '2', label: 'Coletado' }
  ]);
  const [ paymentTypeOptions ] = useState([
    {value: '1', label: 'Dinheiro'},
    {value: '2', label: 'Cartão'},
  ]);

  useEffect(() => {
    api.get(`orders/${id}`).then(response => {
      if (response.status === 200) {
        setOrder(response.data);
        const order_status = response.data.order_status;
        const payment_type = response.data.payment_type;

        if (order_status === 'Pendente') 
          setOrderStatus({ value: '1', label: 'Pendente' }); 
        else 
          setOrderStatus({ value: '2', label: 'Coletado' });

        if (payment_type === 'Dinheiro')
          setPaymentType({value: '1', label: 'Dinheiro'});
        else
          setPaymentType({value: '2', label: 'Cartão'});

        setSubtotal(response.data.subtotal);
        setDiscount(response.data.discount);
        setPaymentMade(response.data.payment_made);
        setCost(response.data.cost);

        const customerId: number = response.data.customer_id;

        api.get(`customers/${customerId}`).then(response => {
          if (response.status === 200)
            setCustomerName(response.data.name);
        });
      }
    });
  }, [id]);

  function handleClickPayment() {
    if (order) {
      let newPaymentStatus = order.payment_status;
      let newCost = order.cost;
      
      if (order.cost <= Number(payment)) {
        newPaymentStatus = 'Pago';
        newCost = 0;
      }
      else if (payment) {
        newPaymentStatus = 'Parcialmente pago';
        newCost = newCost - Number(payment);
      }
      
      api.put('orders', {
        id: order.id,
        order_status: orderStatus?.label,
        payment_status: newPaymentStatus,
        payment_type: paymentType?.label,
        payment_moment: order.payment_moment,
        delivery_date: order.delivery_date,
        item_quantity: order.item_quantity,
        subtotal: order.subtotal,
        discount: order.discount,
        payment_made: Number(order.payment_made) + Number(payment),
        cost: newCost,
        created_at: order.created_at,
        date_number: order.date_number,
        date_out_number: order.date_out_number,
        created_hours: order.created_hours,
        customer_id: order.customer_id,
      }).then(response => {
        if (response.status === 200) history.push('/payment');
      });
    }
  }

  return (
    <div className="page-make-payment">
      <Sidebar/>
      
      <main className="main-content">
        <h1>Pedido nº {id}, {customerName.toLocaleUpperCase()}</h1>

        <div className="make-payment">
          <div className="make-payment-block">
            <p>Informações</p>
            <Input 
              label="Subtotal: " 
              name="make-payment-subtotal" 
              inputType="number" 
              value={Number(subtotal).toFixed(2)}
              readOnly
            />
            <Input 
              label="Disconto: " 
              name="make-payment-discount" 
              inputType="number" 
              value={Number(discount).toFixed(2)}
              readOnly
            />
            <Input 
              label="Pgto. prévio: " 
              name="make-payment-previous-payment" 
              inputType="number" 
              value={Number(paymentMade).toFixed(2)}
              readOnly
            />
            <Input 
              label="Total a pagar: " 
              name="make-payment-cost" 
              inputType="number" 
              value={Number(cost).toFixed(2)}
              readOnly
            />
          </div>

          <div className="make-payment-block actions">
            <p>Ações</p>
            <div>
              <label htmlFor="order-status">Status da coleta: </label>
              <Select
                id="order-status" 
                isSearchable
                value={orderStatus}
                onChange={key => {
                  if (key) setOrderStatus(key); else setOrderStatus(undefined);
                }}
                options={orderStatusOptions}
              />
            </div>

            <div>
              <label htmlFor="payment-type">Tipo de pagamento: </label>
              <Select
                id="payment-type" 
                isSearchable
                value={paymentType}
                onChange={key => {
                  if (key) setPaymentType(key); else setPaymentType(undefined);
                }}
                options={paymentTypeOptions}
              />
            </div>

            <Input 
              label="Pagameto: " 
              name="make-payment-payment" 
              inputType="number"
              value={payment}
              onChange={e => setPayment(e.target.value.split(',').join('.'))}
            />
          </div>

          <div className="make-payment-button">
            <button onClick={handleClickPayment}>Salvar</button>
          </div>
        </div>
      </main>
    </div>
  );
}