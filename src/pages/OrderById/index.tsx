import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';

type OrderData = {
  id: string;
  order_status: string;
  payment_status: string;
  payment_type: string;
  payment_moment: string;
  delivery_date: string;
  item_quantity: number;
  subtotal: string;
  discount: string;
  payment_made: string;
  cost: string;
  created_at: string;
  date_number: number;
  date_out_number: number;
  created_hours: number;
  customer_id: string;
  items: {
    description: string;
    item_id: string;
    observation: string;
    order_id: number;
    unit_cost: string;
    unit_discount: string;
    unit_quantity: string;
    unit_subtotal: string;
  }[];
  customer: {
    name: string;
  };
}

interface Params {
  id: string;
}

export default function OrderById() {
  const { id } = useParams<Params>();

  const [loadingData, setLoadingData] = useState(true);
  const [orderData, setOrderData] = useState<OrderData>();

  useEffect(() => {
    if (id) {
      api.get(`orders/${id}`).then(response => {
        if (response.status === 200) {
          const data = response.data;
          setOrderData(data);

          setLoadingData(false);
        }
      }).catch(erro => {
        toast.error('Erro ao carregar os dados.');
        setLoadingData(false);
      })
    }
  }, [id]);

  return (
    <div>
      <div className="pagetitle" style={{ color: "#012970" }}>
        <h4>Pedido Nº {id}</h4>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/orders">Pedidos</Link></li>
            <li className="breadcrumb-item active">{id}</li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="tabelaPedido">
              <thead>
                <tr className="fw-bold">
                  <td>#</td>
                  <td>Cliente</td>
                  <td>Peças</td>
                  <td>Valores</td>
                  <td>Pagamento</td>
                  <td className="text-center">Ações</td>
                </tr>
              </thead>
              <tbody>
                {orderData ?
                  <tr>
                    <td className="fw-bold"><span className="badge bg-secondary"># {orderData.id}</span></td>
                    <td>
                      <p>{orderData.customer.name}</p>
                      <p>Criado em: <span className="badge bg-primary">{orderData.created_at}</span></p>
                      <p>Data retirada: <span className="badge bg-primary">{orderData.delivery_date?.split('-').reverse().join('/')}</span></p>
                    </td>
                    <td>{orderData.items.map(item => (
                      <table style={{ width: '100%' }} key={item.item_id}>
                        <tbody>
                          <tr>
                            <td>{item.unit_quantity}x {item.description}</td>
                          </tr>
                        </tbody>
                      </table>
                    ))}</td>
                    <td>
                      <table style={{width: '100%', border: 'none'}}>
                        <tbody>
                          <tr>
                            <td>Subtotal:</td>
                            <td style={{textAlign: 'right'}}>
                              <span className="badge bg-success">{parseFloat(orderData.subtotal).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Desconto:</td>
                            <td style={{textAlign: 'right'}}>
                              <span className="badge bg-danger">{'- ' + parseFloat(orderData.discount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Pgto. efetuado:</td>
                            <td style={{textAlign: 'right'}}>
                              <span className="badge bg-warning text-dark">{parseFloat(orderData.payment_made).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Total a pagar:</td>
                            <td style={{textAlign: 'right'}}>
                              <span className="badge bg-success">{parseFloat(orderData.cost).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      {<span className={`badge bg-danger ${orderData.payment_status === 'Não pago' ? '' : 'd-none'}`}>{orderData.payment_status}</span>}
                      {<span className={`badge bg-warning text-dark ${orderData.payment_status === 'Parcialmente pago' ? '' : 'd-none'}`}>{orderData.payment_status}</span>}
                      {<span className={`badge bg-success ${orderData.payment_status === 'Pago' ? '' : 'd-none'}`}>{orderData.payment_status}</span>}
                    </td>
                    <td className="d-flex flex-column align-items-center">
                      <button type="button" className={`btn btn-sm btn-success mb-2 ${orderData.payment_status === 'Pago' ? 'd-none' : ''}`}>Receber Pag.</button>
                      <button type="button" className="btn btn-sm btn-light text-dark border border-dark mb-2">Imprimir</button>
                      <button type="button" className={`btn btn-sm btn-warning text-dark mb-2 ${orderData.payment_status === 'Pago' ? 'd-none' : ''}`}>Editar Peças</button>
                      <button type="button" className="btn btn-sm btn-danger mb-2">Cancelar</button>
                    </td>
                  </tr> :

                  <tr>
                    <td className="text-center" colSpan={6}>{loadingData ? <Spinner animation="border" role="status" /> : 'Dados não encontrado.'}</td>
                  </tr>
                }

              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mt-1">
              <h5 className="card-title">Dicas:</h5>
              <p>✨ Click em <strong>Receber Pag.</strong> para registrar o pagamento no sistema.</p>
              <p>✨ Para estornar algum pedido vá para a tela de <strong>Recebimentos</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}