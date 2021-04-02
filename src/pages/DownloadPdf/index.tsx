import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import './styles.css';

import { ComponentToPrint } from '../../components/ComponentToPrint';
import { ComponentToPrintAll } from '../../components/ComponentToPrintAll';
import { Item, Order } from '../../utils/interfaces';
import api from '../../services/api';

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
  const [ isUniqueOrder, setIsUniqueOrder ] = useState(false);

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
        setIsUniqueOrder(true);

        api.get(`customers/${response.data.orders[0].customer_id}`).then(response => {
          if (response.status === 200) setCustomerToPrint(response.data);
        })
      }
    })
  }, [searchOrderId]);

  useEffect(() => {
    if (searchCustomerId) api.get('orders', {
      params: {
        customerId: searchCustomerId,
        paymentStatus: 'Pendence'
      }
    }).then(response => {
      if (response.status === 200) {
        setOrdersToPrint(response.data);

        api.get(`customers/${searchCustomerId}`).then(response => {
          if (response.status === 200) setCustomerToPrint(response.data);
        })
      }
    })
  }, [searchCustomerId]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  
  return (
    <div>
      {ordersToPrint? customerToPrint? isUniqueOrder?
        <ComponentToPrint 
          ref={componentRef}
          orders={ordersToPrint.orders} 
          itemAddedByOrderId={ordersToPrint.itemAddedByOrderId} 
          customer={customerToPrint}
        /> : 
        <ComponentToPrintAll
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