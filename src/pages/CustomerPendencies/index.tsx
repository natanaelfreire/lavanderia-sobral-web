import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

import api from '../../services/api';
import './styles.css';

interface Params {
  id: string;
}

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
}

type Pendencies = {
  id: number;
  created_at: string;
  payment_status: string;
  cost: number;
}[];

export default function CustomerPendencies() {
  const { id } = useParams<Params>();
  const location: {
    state: {
      name: string;
    }
  } = useLocation();
  const paymentDivRef = useRef<null | HTMLDivElement>(null);

  const [loadingData, setLoadingData] = useState(true);
  const [customerName] = useState(location.state?.name);
  const [pendencies, setPendencies] = useState<Pendencies>([]);
  const [count, setCount] = useState(0);

  const [loadingModalData, setLoadingModalData] = useState(true);
  const [modalReceiveIsOpen, setModalReceiveIsOpen] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>();
  const [idModalReceive, setIdModalReceive] = useState('');
  const [confirmReceiveIsDisabled, setConfirmReceiveIsDisabled] = useState(false);

  const [paymentType, setPaymentType] = useState<{ value: string; label: string; }>();
  const [paymentTypeOptions] = useState([
    { value: '1', label: 'Dinheiro' },
    { value: '2', label: 'Cartão' },
    { value: '3', label: 'Pix' },
  ]);

  const [paidValue, setPaidValue] = useState('');
  const [discountValue, setDiscountValue] = useState('0');
  const [valueToPay, setValueToPay] = useState('');

  useEffect(() => {
    api.get<Pendencies>(`/customers/pendencies/${id}`).then(response => {
      if (response.status === 200) {
        const pendencias = response.data;

        setPendencies(pendencias);
        setLoadingData(false);
      }
    }).catch(erro => {
      toast.error('Erro ao carregar os dados.');
      setLoadingData(false);
    });
  }, [id, count]);

  function getAmount(pendencies: Pendencies) {
    let newAmount = 0;

    for (const p of pendencies)
      newAmount += p.cost;

    return newAmount;
  }

  const scrollToBottom = () => {
    if (paymentDivRef.current)
      paymentDivRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function handleDiscountChange(e: React.FormEvent<HTMLInputElement>) {
    const newDiscountValue = e.currentTarget.value;
    setDiscountValue(newDiscountValue);

    const discount = isNaN(parseFloat(newDiscountValue.replace(',', '.'))) ? 0 : parseFloat(newDiscountValue.replace(',', '.'));
    if (discount >= 0) {
      const cost = isNaN(parseFloat(orderData?.cost as string)) ? 0 : parseFloat(orderData?.cost as string);
      const newValueToPay = cost - discount;
      setValueToPay(newValueToPay < 0 ? '0' : formataValorDecimal(newValueToPay.toString()));
      setPaidValue(newValueToPay < 0 ? '0' : formataValorDecimal(newValueToPay.toString()));
    }
  }

  function loadModalReceive(idModal: string) {
    setModalReceiveIsOpen(true);
    setLoadingModalData(true);

    if (idModal) {
      api.get<OrderData>(`orders/${idModal}`).then(response => {
        if (response.status === 200) {
          const data = response.data;
          setOrderData(data);
          setIdModalReceive(idModal);
          setDiscountValue('0');
          setPaidValue(formataValorDecimal(data.cost as string));
          setValueToPay(formataValorDecimal(data.cost as string));
          setLoadingModalData(false);
          scrollToBottom();
        }
      }).catch(erro => {
        toast.error('Erro ao carregar os dados.');
        setLoadingModalData(false);
        setOrderData(undefined);
        setIdModalReceive('');
        setPaidValue('0');
      })
    }
  }

  function handleConfirmReceive() {
    if (!paymentType) {
      toast.error('Selecione um método de pagamento.');
      return;
    }

    if (parseFloat(discountValue.replace(',', '.')) < 0) {
      toast.error('Desconto aplicado inválido!');
      return;
    }
      

    if (!paidValue || isNaN(parseFloat(paidValue.replace(',', '.'))) || parseFloat(paidValue.replace(',', '.')) < 0) {
      toast.error('Valor recebido inválido!');
      return;
    }

    if (orderData && idModalReceive) {
      setConfirmReceiveIsDisabled(true);

      let newPaymentStatus = orderData.payment_status;
      let newCost = parseFloat(orderData.cost);
      let newDiscount = isNaN(parseFloat(discountValue.replace(',', '.'))) ? 0 : parseFloat(discountValue.replace(',', '.'));

      if (parseFloat(orderData.cost) <= Number(paidValue)) {
        newPaymentStatus = 'Pago';
        newCost = 0;
      }
      else if (paidValue) {
        newPaymentStatus = 'Parcialmente pago';
        newCost = newCost - Number(paidValue);
      }

      toast.promise(api.put('orders', {
        id: idModalReceive,
        order_status: orderData.order_status,
        payment_status: newPaymentStatus,
        payment_type: paymentType?.label,
        payment_moment: orderData.payment_moment,
        delivery_date: orderData.delivery_date,
        item_quantity: orderData.item_quantity,
        subtotal: orderData.subtotal,
        discount: orderData.discount + newDiscount,
        payment_made: Number(orderData.payment_made) + Number(paidValue),
        cost: newCost,
        created_at: orderData.created_at,
        date_number: orderData.date_number,
        date_out_number: orderData.date_out_number,
        created_hours: orderData.created_hours,
        customer_id: orderData.customer_id,
      }), {
        pending: 'Processando recebimento...',
        success: {
          render() {
            setModalReceiveIsOpen(false);
            setOrderData(undefined);
            setIdModalReceive('');
            setPaidValue('0');
            setDiscountValue('0');
            setConfirmReceiveIsDisabled(false);
            setCount(count + 1);

            return 'Recebimento salvo com sucesso!';
          }
        },
        error: {
          render() {
            setConfirmReceiveIsDisabled(false);

            return 'Erro ao salvar recebimento';
          }
        }
      })

    }
  }

  function moneyFormat(value: string) {
    return (parseFloat(value)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  function formataValorDecimal(value: string) {
    return (parseFloat(value)).toLocaleString('pt-br', { minimumFractionDigits: 2 });
  }

  return (
    <div className="pendencies" id="pendencies">
      <div className="pagetitle" style={{ color: "#012970" }}>
        <h4>Pendências</h4>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/customers">Clientes</Link></li>
            <li className="breadcrumb-item active">Pendências</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card">
            <div className="card-body">

              <div className="mb-2">
                <h5 className="card-title">Pendências de pagamento de</h5>
                <div className="card-subtitle-pendencies d-flex justify-content-between align-items-end">{customerName} <button title="Imprimir Todos" className={`btn btn-sm btn-light border border-dark ${pendencies && pendencies.length > 0 ? '' : 'd-none'}`}><i className="bi bi-printer"></i></button></div>
              </div>

              <div className="activity">
                {pendencies && pendencies.length > 0 ? pendencies.map(pendence => (
                  <div className="activity-item d-flex" key={pendence.id}>
                    <div className="activite-label">{pendence.created_at}</div>
                    <i className={`bi bi-circle-fill activity-badge ${pendence.payment_status === 'Não pago' ? 'text-danger' : 'text-warning'} align-self-start`}></i>
                    <div className="activity-content ps-0 ps-sm-2" style={{ width: '100%' }}>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <tr>
                            <td>Pedido nº {pendence.id} no valor</td>
                            <td style={{ textAlign: 'right' }} className="fs-6"><strong>{pendence.cost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></td>
                          </tr>
                          <tr>
                            <td>Pagamento:</td>
                            <td style={{ textAlign: 'right' }}><span style={{ whiteSpace: 'normal' }} className={`badge ${pendence.payment_status === 'Não pago' ? 'bg-danger' : 'bg-warning text-dark'}`}>{pendence.payment_status}</span></td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={{ whiteSpace: 'nowrap' }}><Link target='_blank' to={`/orders/${pendence.id}`} className="btn btn-sm btn-link p-0 m-0 text-primary">Detalhes <i className="bi bi-box-arrow-up-right"></i></Link></td>
                            <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}><button onClick={() => loadModalReceive(pendence.id.toString())} className="btn btn-sm btn-link p-0 m-0 text-success">Receber<i className="bi bi-currency-dollar"></i></button></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )) :
                  <div className="d-flex justify-content-center">
                    {loadingData ? <Spinner animation="border" role="status" /> : 'Nehuma pendência de pagamento encontrada'}
                  </div>
                }

              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-md-7">
          <div className="row">
            <div className="col-12 col-md-5">
              <div className="card">
                <div className="card-body">
                  <div className="mb-2">
                    <h5 className="card-title">Qntd. Pendentes <span>| Total</span></h5>
                    <div className="d-flex align-items-center">
                      <div className="card-icon qntd-pendentes rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-cart-x"></i>
                      </div>
                      <div className="ps-3">
                        <h3>{pendencies.length}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div className="card">
                <div className="card-body">
                  <div className="mb-2">
                    <h5 className="card-title">Valor Acumulado <span>| Total</span></h5>
                    <div className="d-flex align-items-center">
                      <div className="card-icon valor-acumulado rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-currency-dollar"></i>
                      </div>
                      <div className="ps-3">
                        <h3>{pendencies && pendencies.length > 0 ? moneyFormat(getAmount(pendencies).toString()) : 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Dicas:</h5>
                  <p>✨ Click em <strong>Receber</strong> para registrar o pagamento no sistema.</p>
                  <p>✨ Click em <strong>Detalhes</strong> para visualizar mais detalhes do pedido.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={modalReceiveIsOpen} size="xl" onHide={() => setModalReceiveIsOpen(false)}>
        <Modal.Header>
          <Modal.Title>
            Confirmação Recebimento nº {idModalReceive}
          </Modal.Title>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalReceiveIsOpen(false)}></button>
        </Modal.Header>

        {loadingModalData ?
          <Modal.Body className="text-center" style={{ backgroundColor: '#ECF0F5' }}>
            <Spinner animation="border" role="status" />
          </Modal.Body> :
          <Modal.Body style={{ backgroundColor: '#ECF0F5' }}>
            <div className="row">
              <div className="col-12 col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Extrato</h5>
                    <table style={{ width: '100%', backgroundColor: '#fff' }} className="table table-sm">
                      <thead>
                        <tr className="fw-bold">
                          <th style={{ textAlign: 'center' }}>Qtd</th>
                          <th>Peça</th>
                          <th style={{ textAlign: 'right' }}>Desc.</th>
                          <th style={{ textAlign: 'right' }}>Valor Unit</th>
                          <th style={{ textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          orderData ? orderData.items.map(item => (
                            <tr key={item.item_id}>
                              <td style={{ textAlign: 'center' }}>{item.unit_quantity}</td>
                              <td>{item.description}</td>
                              <td style={{ textAlign: 'right' }}>{item.unit_discount}</td>
                              <td style={{ textAlign: 'right' }}>{moneyFormat(item.unit_cost)}</td>
                              <td style={{ textAlign: 'right' }}>{moneyFormat(item.unit_subtotal)}</td>
                            </tr>
                          )) :
                            <tr>
                              <td colSpan={5}></td>
                            </tr>
                        }
                      </tbody>
                    </table>

                    <div className="row d-flex justify-content-end">
                      <div className="col-12 col-md-6">
                        <table style={{ width: '100%', backgroundColor: '#fff' }} className="table table-sm">
                          <tbody>
                            <tr>
                              <td style={{ textAlign: 'right' }}>Subtotal: </td>
                              <td style={{ textAlign: 'right' }}>{orderData ? moneyFormat(orderData.subtotal) : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: 'right' }}>Desconto: </td>
                              <td style={{ textAlign: 'right' }}>{orderData ? moneyFormat(orderData.discount) : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: 'right' }}>Pagamento Prévio: </td>
                              <td style={{ textAlign: 'right' }}>{orderData ? moneyFormat(orderData.payment_made) : 0}</td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: 'right' }}><strong>Valor Total:</strong></td>
                              <td style={{ textAlign: 'right' }}><strong>{orderData ? moneyFormat(orderData.cost) : 0}</strong></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              <div className="col-12 col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Dados Pagamento</h5>
                    <div className="row" ref={paymentDivRef}>
                      <div className="col-12 mb-2">
                        <label className="mb-1" htmlFor="paymentType">Método de pagamento</label>
                        <Select
                          required
                          id="paymentType"
                          placeholder={'Selecione...'}
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: '100%'
                            })
                          }}
                          value={paymentType}
                          isSearchable
                          onChange={key => {
                            if (key) setPaymentType({ value: key.value, label: key.label });
                          }}
                          options={paymentTypeOptions}
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label className="mb-1" htmlFor="valorDesconto" style={{ color: '#00a65a' }}>Aplicar Desconto</label>
                        <input
                          id="valorDesconto"
                          className="py-1 px-2"
                          style={{
                            width: '100%',
                            borderColor: '#00a65a',
                            borderRadius: '4px',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            outline: 'none'
                          }}
                          type="text"
                          value={discountValue}
                          onChange={handleDiscountChange}
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label className="mb-1" htmlFor="valorAPagar">Valor a Pagar</label>
                        <input
                          id="valorAPagar"
                          className="py-1 px-2"
                          style={{
                            width: '100%',
                            borderRadius: '4px',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            outline: 'none'
                          }}
                          type="text"
                          value={valueToPay}
                          disabled
                          onChange={e => {
                            const newValueToPay = e.target.value;
                            setValueToPay(newValueToPay);
                          }}
                        />
                      </div>
                      <div className="col-12 mb-2">
                        <label className="fw-bold mb-1" htmlFor="valorPago" style={{ color: '#00a65a' }}>Valor Recebido</label>
                        <input
                          id="valorPago"
                          step={0.01}
                          className="py-1 px-2"
                          style={{
                            width: '100%',
                            borderColor: '#00a65a',
                            borderRadius: '4px',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            outline: 'none'
                          }}
                          type="text"
                          value={paidValue}
                          onChange={e => {
                            const newPaidValue = e.target.value;
                            setPaidValue(newPaidValue);
                          }}
                        />
                      </div>
                    </div>

                    <Modal.Footer>
                      <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal" onClick={() => setModalReceiveIsOpen(false)}>Cancelar</button>
                      <button type="button" className="btn btn-primary btn-lg btn-block fs-6 text-decoration-none col-6 m-0 rounded-0 border border-top-0" disabled={confirmReceiveIsDisabled} onClick={handleConfirmReceive}><strong>Confirmar Recebimento</strong></button>
                    </Modal.Footer>
                  </div>
                </div>
              </div>


            </div>


          </Modal.Body>
        }


      </Modal>

    </div>
  )
}