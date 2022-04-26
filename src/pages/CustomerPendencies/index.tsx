import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';
import './styles.css';

interface Params {
  id: string;
}

type Pendencies = {
  id: number;
  created_at: string;
  payment_status: string;
  cost: string;
}[];

export default function CustomerPendencies() {
  const { id } = useParams<Params>();
  const location: {
    state: {
      name: string;
    }
  } = useLocation();

  const [loadingData, setLoadingData] = useState(true);
  const [customerName] = useState(location.state?.name);
  const [pendencies, setPendencies] = useState<Pendencies>([]);

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
  }, [id]);

  function getAmount(pendencies: Pendencies) {
    let newAmount = 0;

    for (const p of pendencies)
      newAmount += parseFloat(p.cost);

    return newAmount;
  }

  function moneyFormat(value: string) {
    return (parseFloat(value)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
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
                <div className="card-subtitle-pendencies d-flex justify-content-between align-items-end">
                  {customerName} 
                  <button title="Imprimir Todos" onClick={() => window.open(`/download?customerId=${id}`, '_blank')} className={`btn btn-sm btn-light border border-dark ${pendencies && pendencies.length > 0 ? '' : 'd-none'}`}><i className="bi bi-printer"></i></button>
                </div>
              </div>

              <div className="activity">
                {pendencies && pendencies.length > 0 ? pendencies.map(pendence => (
                  <div className="activity-item d-flex" key={pendence.id}>
                    <div className="activite-label">{pendence.created_at}</div>
                    <i className={`bi bi-circle-fill activity-badge ${pendence.payment_status === 'Não pago' ? 'text-danger' : 'text-warning'} align-self-start`}></i>
                    <div className="activity-content ps-0 ps-sm-2" style={{ width: '100%' }}>
                      <table style={{ borderCollapse: 'separate', border: '1px solid lightgray' }} className="table">
                        <tbody>
                          <tr>
                            <td style={{border: 'none'}}>Pedido nº {pendence.id} no valor</td>
                            <td style={{ textAlign: 'right', border: 'none' }} className="fs-6"><strong>{moneyFormat(pendence.cost)}</strong></td>
                          </tr>
                          <tr>
                            <td style={{border: 'none'}}>Pagamento:</td>
                            <td style={{ textAlign: 'right', border: 'none' }}><span style={{ whiteSpace: 'normal' }} className={`badge ${pendence.payment_status === 'Não pago' ? 'bg-danger' : 'bg-warning text-dark'}`}>{pendence.payment_status}</span></td>
                          </tr>
                          <tr>
                            <td colSpan={2} style={{ whiteSpace: 'nowrap' }}><Link to={`/orders/${pendence.id}`} className="btn btn-sm btn-link p-0 m-0 text-primary">Detalhes <i className="bi bi-box-arrow-up-right"></i></Link></td>
                          </tr>
                        </tbody>
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
        </div>
      </div>

    </div>
  )
}