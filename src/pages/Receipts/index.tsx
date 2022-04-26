import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../../services/api";

type Receipt = {
  id: number;
  description: string;
  status: string;
  payment_type: string;
  subtotal: string;
  discount?: string | null;
  addition?: string | null;
  amount_received: string;
  due_date: string;
  payment_date: string | null;
  cancelling_date: string | null;
  user_created: string;
  created_at: string;
  user_updated: string;
  updated_at: string | null;
  customer_id: number;
  customer_name: string;
  order_id: number;
}

interface Customer {
  value: string;
  label: string;
};

export default function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[] | null>(null);
  const [customerId, setCustomerId] = useState<string | null>('');
  const [dateType, setDateType] = useState({ value: 'DIARIO', label: 'DIARIO' });
  const [dateValue, setDateValue] = useState(new Date().toLocaleDateString('pt-br').split('/').reverse().join('-'));

  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [dateTypeOptions] = useState([
    { value: 'DIARIO', label: 'DIARIO' },
    { value: 'MENSAL', label: 'MENSAL' }
  ]);

  const carregaRecebimentos = (customerId: string | null, dateType: string, date: string) => {
    api.post('receipts/listagem', {
      customerId: customerId ? parseInt(customerId) : '',
      dateType,
      date
    }).then((response: any) => {
      if (response.status === 200) {
        setReceipts(response.data);
      }
      else {
        toast.error(response.response?.data)
      }
    })
  }

  function handleOrdersFilterClick() {
    if (!dateValue)
      return toast.error("Preencha uma Data antes de pesquisar");

    carregaRecebimentos(customerId, dateType.value, dateValue);
  }

  function getAmount(receipts: Receipt[]) {
    let amount = 0;

    for (const item of receipts) {
      amount += parseFloat(item.amount_received);
    }

    return amount;
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
    api.post<Receipt[]>('receipts/listagem', {
      customerId: '',
      dateType: '',
      date: ''
    }).then((response: any) => {
      if (response.status === 200) {
        setReceipts(response.data);
      }
      else {
        toast.error(response.response?.data)
      }
    })
  }, [])
  return (
    <>
      <div className="pagetitle" style={{ color: "#012970" }}>
        <h4>Recebimentos</h4>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Recebimentos</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Filtros</h5>
              <div className="row">
                <div className="col-12 col-md-12 mb-2">
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
                    isClearable
                    noOptionsMessage={() => 'Carregando...'}
                    onChange={key => {
                      if (key)
                        setCustomerId(key.value);
                      else
                        setCustomerId(null);
                    }}
                    options={customerOptions}
                  />
                </div>

                <div className="col-12 col-md-4 mb-2">
                  <label className="mb-1" htmlFor="tipoData">Tipo Data</label>
                  <Select
                    required
                    id="tipoData"
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '100%'
                      })
                    }}
                    placeholder={'Selecione...'}
                    value={dateType}
                    isSearchable
                    onChange={key => {
                      if (key) {
                        setDateType({ value: key.value, label: key.label });

                        if (key.value === 'DIARIO')
                          setDateValue(new Date().toLocaleDateString('pt-br').split('/').reverse().join('-'));
                        else {
                          const year = new Date().toLocaleDateString('pt-br').split('/').reverse()[0];
                          const month = new Date().toLocaleDateString('pt-br').split('/').reverse()[1];
                          setDateValue(`${year}-${month}`);
                        }
                      }
                    }}
                    options={dateTypeOptions}
                  />
                </div>

                <div className="col-12 col-md-6 mb-2">
                  <div className='row'>
                    <div className='col-10'>
                      <label className="mb-1" htmlFor="filter-created">{dateType.value === 'DIARIO' ? 'Dia' : 'Mês'}</label>
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
                        type={dateType.value === 'DIARIO' ? 'date' : 'month'}
                        value={dateValue}
                        onChange={e => setDateValue(e.target.value)}
                      />
                    </div>
                    <div className='col-2 mb-2 mt-4' style={{ marginLeft: '-15px' }}>
                      <button className='btn btn-sm btn-outline-secondary mt-2' onClick={() => setDateValue('')}>X</button>
                    </div>
                  </div>

                </div>

                <div className="col-6 col-md-2 mb-2 mt-0 mt-md-4">
                  <button className="btn btn-sm btn-primary mt-2" onClick={handleOrdersFilterClick}>Filtrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="mb-2">
                    <h5 className="card-title">Valor Acumulado <span>| Total</span></h5>
                    <div className="d-flex align-items-center">
                      <div className="card-icon valor-acumulado rounded-circle d-flex align-items-center justify-content-center">
                        <i className="bi bi-currency-dollar"></i>
                      </div>
                      <div className="ps-3">
                        <h3>{(receipts ? getAmount(receipts) : 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h3>
                      </div>
                    </div>
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
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr className="fw-bold">
                      <td>#</td>
                      <td>Descrição</td>
                      <td>Data Recebimento</td>
                      <th>Valor</th>
                      <th>Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      receipts && receipts.length > 0 ? receipts.map((item, key) => (
                        <tr key={key}>
                          <td>{item.id}</td>
                          <td>{item.description}</td>
                          <td>{item.payment_date?.split('-').reverse().join('/')}</td>
                          <td>{parseFloat(item.amount_received).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                          <td>{item.customer_name.toUpperCase()}</td>
                        </tr>
                      )) :
                        <tr>
                          <td colSpan={5} className="text-center">Nenhum recebimento encontrado</td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}