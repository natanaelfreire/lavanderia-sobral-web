import React, { FormEvent, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { toast } from 'react-toastify';

import api from '../../services/api';

interface Params {
  id: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
}

function CustomerEdit() {
  const { id } = useParams<Params>();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(false);

  const history = useHistory();

  useEffect(() => {
    api.get(`customers/${id}`).then(response => {
      if (response.status === 200) {
        const customer: Customer = response.data;

        setName(customer.name);
        setAddress(customer.address);
        setPhone(customer.phone);
      }
    });
  }, [id]);

  function handleCustomerChangesSubmit(event: FormEvent) {
    event.preventDefault();
    setSaveButtonIsDisabled(true);

    if (!name) {
      toast.error('Preencha o campo Nome.');
      setSaveButtonIsDisabled(false);
      return;
    }

    if (!address) {
      toast.error('Preencha o campo Endereço.');
      setSaveButtonIsDisabled(false);
      return;
    }

    if (!phone) {
      toast.error('Preencha o campo Telefone.');
      setSaveButtonIsDisabled(false);
      return;
    }

    toast.promise(api.put('customers', {
      id,
      name,
      phone,
      address,
    }), {
      pending: 'Salvando as mudanças...',
      success: {
        render() {
          setSaveButtonIsDisabled(false);
          history.push('/customers');

          return 'Mudanças foram salvas com sucesso!';
        }
      },
      error: {
        render() {
          setSaveButtonIsDisabled(false);
          
          return 'Erro ao salvar os dados.';
        }
      }
    }) 
  
  }

  return (
    <div className="container">
      <h5 className="bg-primary p-1 rounded text-white bg-opacity-75">Editando dados do cliente...</h5>

      <div className="row">
        <div className="col-12 col-md-6 mb-2">
          <label className="mb-1" htmlFor="name">Nome</label><br />
          <input
            id="name"
            type="text"
            className="py-1 px-2"
            style={{
              width: '100%',
              borderColor: '#ccc',
              borderRadius: '4px',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-6 mb-2">
          <label className="mb-1" htmlFor="address">Endereço</label><br />
          <input
            id="address"
            type="text"
            className="py-1 px-2"
            style={{
              width: '100%',
              borderColor: '#ccc',
              borderRadius: '4px',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label className="mb-1" htmlFor="phone">Telefone</label><br />
          <input
            id="phone"
            type="tel"
            className="py-1 px-2"
            style={{
              width: '100%',
              borderColor: '#ccc',
              borderRadius: '4px',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-success"
            disabled={saveButtonIsDisabled}
            onClick={handleCustomerChangesSubmit}
          >Salvar</button>
        </div>
      </div>
      
    </div>
  );
}

export default CustomerEdit;