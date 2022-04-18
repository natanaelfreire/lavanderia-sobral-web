import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from "react-bootstrap/Modal";

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
    address: string;
    phone: string;
  };
}

interface Params {
  id: string;
}

export default function OrderById() {
  const { id } = useParams<Params>();
  const history = useHistory();
  const [loadingData, setLoadingData] = useState(true);
  const [orderData, setOrderData] = useState<OrderData>();

  const [confirmButtonIsDisabled, setConfirmButtonIsDisabled] = useState(false);

  const [modalRetiradaIsOpen, setModalRetiradaIsOpen] = useState(false);
  const [modalCancelarIsOpen, setModalCancelarIsOpen] = useState(false);

  function carregaDadosPedido(id: string) {
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

  useEffect(() => {
    if (id) {
      carregaDadosPedido(id);
    }
  }, [id]);

  function formatoDinheiro(valor: number) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  function handleConfirmRetirada() {    
    setConfirmButtonIsDisabled(true);

    toast.promise(api.patch(`orders/${id}`, {
      order_status: 'Retirado'
    }),
    {
      pending: 'Salvando mudança nos dados...',
        success: {
          render() {
            setConfirmButtonIsDisabled(false);
            setModalRetiradaIsOpen(false);
            carregaDadosPedido(id);

            return 'Status alterado com sucesso!';
          }
        },
        error: {
          render() {
            setConfirmButtonIsDisabled(false);

            return 'Erro ao alterar status.';
          }
        }
    })
  }

  function handleConfirmCancelar() {
    setConfirmButtonIsDisabled(true);

    toast.promise(api.delete(`/orders/${id}`),
    {
      pending: 'Salvando mudança nos dados...',
        success: {
          render() {
            setConfirmButtonIsDisabled(false);
            setModalCancelarIsOpen(false);
            setTimeout(() => {
              history.push('/orders');
            }, 500)

            return 'Pedido excluído com sucesso!';
          }
        },
        error: {
          render() {
            setConfirmButtonIsDisabled(false);

            return 'Erro ao excluir pedido.';
          }
        }
    })
  }

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
                  <td>Pagamento</td>
                  <td>Status Retirada</td>
                  <td className="text-center">Ações</td>
                </tr>
              </thead>
              <tbody>
                {orderData ?
                  <tr>
                    <td className="fw-bold"><span className="badge bg-secondary"># {orderData.id}</span></td>
                    <td>
                      <p>
                        {orderData.customer.name.toUpperCase()} <br />
                        <span style={{ fontSize: '14px', color: 'gray' }}>{orderData.customer.address.toLocaleLowerCase()}</span> <br />
                        <span style={{ fontSize: '14px', color: 'gray' }}>{orderData.customer.phone}</span> <br />
                      </p>
                      <p>Criado em: <br /><span className="badge bg-primary">{orderData.created_at}</span></p>
                      <p>Previsão retirada: <br /><span className="badge bg-primary">{orderData.delivery_date?.split('-').reverse().join('/')}</span></p>
                    </td>
                    <td>
                      <table style={{ width: '100%' }} >
                        <thead>
                          <tr>
                            <th style={{ fontWeight: 'bold' }}>Descriçao</th>
                            <th style={{ fontWeight: 'bold' }}>Valor Unit.</th>
                            <th style={{ fontWeight: 'bold' }}>Desc.</th>
                            <th style={{ fontWeight: 'bold' }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.items.map(item => (
                            <tr key={item.item_id}>
                              <td style={{ whiteSpace: 'nowrap' }}>{item.unit_quantity}x {item.description}</td>
                              <td>{formatoDinheiro(parseFloat(item.unit_cost))}</td>
                              <td>{formatoDinheiro(parseFloat(item.unit_discount))}</td>
                              <td>{formatoDinheiro(parseFloat(item.unit_subtotal))}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot style={{ backgroundColor: 'lightgoldenrodyellow', fontWeight: 'bold' }}>
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'right' }}>Subtotal:</td>
                            <td>{formatoDinheiro(parseFloat(orderData.subtotal))}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'right' }}>Desconto:</td>
                            <td>{formatoDinheiro(parseFloat(orderData.discount))}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'right' }}>Pagamento Prévio:</td>
                            <td>{formatoDinheiro(parseFloat(orderData.payment_made))}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'right' }}>Valor Total:</td>
                            <td>{formatoDinheiro(parseFloat(orderData.cost))}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </td>
                    <td>
                      {<span className={`badge bg-danger ${orderData.payment_status === 'Não pago' ? '' : 'd-none'}`}>{orderData.payment_status}</span>}
                      {<span className={`badge bg-warning text-dark ${orderData.payment_status === 'Parcialmente pago' ? '' : 'd-none'}`}>{orderData.payment_status}</span>}
                      {<span className={`badge bg-success ${orderData.payment_status === 'Pago' ? '' : 'd-none'}`}>{orderData.payment_status}</span>}
                    </td>
                    <td>
                      {
                        orderData.order_status === "Pendente" ?
                          <span className="badge bg-secondary">Pendente</span> :
                          <span className="badge bg-success">Retirado</span>
                      }
                    </td>
                    <td className="d-flex flex-column align-items-start">
                      <button
                        type="button"
                        style={{ whiteSpace: 'nowrap' }}
                        className={`btn btn-sm btn-success mb-2 ${orderData.payment_status === 'Pago' ? 'd-none' : ''}`}
                      >
                        <i className="bi bi-currency-dollar"></i> Receber Pag.
                      </button>
                      <button
                        type="button"
                        style={{ whiteSpace: 'nowrap' }}
                        className="btn btn-sm btn-light text-dark border border-dark mb-2"
                      >
                        <i className="bi bi-printer"></i> Imprimir
                      </button>
                      <button
                        type="button"
                        style={{ whiteSpace: 'nowrap' }}
                        className={`btn btn-sm btn-info mb-2 ${orderData.order_status === 'Retirado' ? 'd-none' : ''}`}
                        onClick={() => {
                          setModalRetiradaIsOpen(true);
                        }}
                      >
                        <i className="bi bi-basket"></i> Retirada
                      </button>
                      <button
                        type="button"
                        style={{ whiteSpace: 'nowrap' }}
                        className={`btn btn-sm btn-warning text-dark mb-2 ${orderData.payment_status === 'Pago' ? 'd-none' : ''}`}
                      >
                        <i className="bi bi-pencil-square"></i> Editar Peças
                      </button>
                      <button
                        type="button"
                        style={{ whiteSpace: 'nowrap' }} className="btn btn-sm btn-danger mb-2"
                        onClick={() => {
                          setModalCancelarIsOpen(true);
                        }}
                      >
                        <i className="bi bi-x-circle"></i> Cancelar
                      </button>
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
            <div className="col-12 col-md-8 mt-2">
              <h5 className="card-title">Dicas:</h5>
              <p>✨ Click em <strong>Receber Pag.</strong> para registrar o pagamento no sistema.</p>
              <p>✨ Para estornar algum pagamento vá para a tela de <strong>Recebimentos</strong>.</p>
            </div>
          </div>
        </div>
      </div>

      <Modal show={modalRetiradaIsOpen} onHide={() => setModalRetiradaIsOpen(false)}>
        <Modal.Header>
          <Modal.Title>
            Confirmar mudança de Status
          </Modal.Title>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalRetiradaIsOpen(false)}></button>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-12 text-center">
              Mudar o Status do pedido para Retirado?
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-primary fs-6 text-decoration-none col-6 m-0 rounded-0 border border-top-0" disabled={confirmButtonIsDisabled} onClick={handleConfirmRetirada}><strong>Sim</strong></button>
          <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal" onClick={() => setModalRetiradaIsOpen(false)}>Cancelar</button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalCancelarIsOpen} onHide={() => setModalCancelarIsOpen(false)}>
        <Modal.Header>
          <Modal.Title>
            Confirmar exclusão de pedido
          </Modal.Title>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalCancelarIsOpen(false)}></button>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-12 text-center">
              Deseja excluir pedido?
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-danger fs-6 text-decoration-none col-6 m-0 rounded-0 border border-top-0" disabled={confirmButtonIsDisabled} onClick={handleConfirmCancelar}><strong>Sim</strong></button>
          <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal" onClick={() => setModalCancelarIsOpen(false)}>Cancelar</button>
        </Modal.Footer>
      </Modal>

    </div>
  );

}