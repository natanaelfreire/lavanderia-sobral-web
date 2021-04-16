import React, { FormEvent, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import api from '../../services/api';

import './styles.css';

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
  const [ name, setName ] = useState('');
  const [ address, setAddress ] = useState('');
  const [ phone, setPhone ] = useState('');

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
    const saveButton = document.getElementsByClassName('save-button')[0];
    if (saveButton) {
      saveButton.setAttribute('disabled', '');
      setTimeout(() => {
        saveButton.removeAttribute('disabled');
      }, 2000);
    } 
    
    const submitMessage = document.getElementsByClassName('submit-message')[0];

    if (!name || !phone || !address) {
      if (submitMessage) {
        submitMessage.textContent = 'Falta preencher campos vazios.';
        submitMessage.id = 'error-message-visibility';

        setTimeout(() => {
          submitMessage.id = '';
        }, 2000);
      }

      return;
    }

    api.put('customers', {
      id,
      name,
      phone,
      address,
    }).then(response => {
      if (response.status === 200)
        history.push('/customers');
    });
  }

  return (
    <div className="page-customers-edit">
      <Sidebar />

      <main className="main-content">
        <h1>Editando dados do cliente...</h1>

        <div className="block">
          <form>
            <Input 
              className="customer-form-name" 
              label="Nome: " 
              name="name" 
              inputType="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
            />
            <Input 
              className="customer-form-address" 
              label="Endereço: " 
              name="address" 
              inputType="text" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              required 
            />
            <Input 
              className="customer-form-phone" 
              label="Telefone: " 
              name="phone" 
              inputType="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required 
            />
            <div className="bottom-form">
              <button
                type="submit" 
                className="save-button"
                onClick={handleCustomerChangesSubmit}
              >Salvar mudanças</button>
              <div className="submit-message"></div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CustomerEdit;