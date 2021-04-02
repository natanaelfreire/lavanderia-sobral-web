import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import './styles.css';

import { ComponentToPrint } from '../../components/ComponentToPrint';
import api from '../../services/api';

interface Order {
  id: string;
  order_status: string;
  payment_status: string;
  payment_type: string;
  payment_moment: string;
  delivery_date: string;
  item_quantity: number;
  subtotal: number;
  discount: number
  payment_made: number;
  cost: number;
  created_at: string;
  date_number: number;
  date_out_number: number;
  created_hours: number;
  customer_id: string;
}

interface Item {
  description: string;
  item_id: string;
  observation: string;
  order_id: string;
  unit_cost: number;
  unit_discount: number;
  unit_quantity: number;
  unit_subtotal: number;
}

interface ItemAddedByOrderId {
  [id: string]: Item[];
}

const DownloadPdf = () => {
  const [ ordersToPrint, setOrdersToPrint ] = useState<{orders: Order[], itemAddedByOrderId: ItemAddedByOrderId}>();
  const [ customerToPrint, setCustomerToPrint ] = useState<{
    name: string;
    address: string;
    phone: string;
  }>();

  const search = useLocation().search;
  const searchCustomerId = new URLSearchParams(search).get('customerId');
  const searchOrderId = new URLSearchParams(search).get('orderId');

  useEffect(() => {
    if (searchOrderId) api.get('orders', {
      params: {
        orderId: searchOrderId
      }
    }).then(response => {
      if (response.status === 200) {
        setOrdersToPrint(response.data);

        api.get(`customers/${response.data.orders[0].customer_id}`).then(response => {
          if (response.status === 200) setCustomerToPrint(response.data);
        })
      }
    })
  }, [searchOrderId]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  
  return (
    <div>
      {ordersToPrint? customerToPrint? 
        <ComponentToPrint 
          ref={componentRef}
          orders={ordersToPrint.orders} 
          itemAddedByOrderId={ordersToPrint.itemAddedByOrderId} 
          customer={customerToPrint}
        /> : <div>Carregando...</div> : <div>Carregando...</div> } 
      <button className="pdf-button" onClick={handlePrint}>Gerar PDF!</button>
    </div>
  );
}

export default DownloadPdf;