import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { BiSearchAlt } from 'react-icons/bi';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';

import api from '../../services/api';

import './styles.css';

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function Customers() {
  const [ name, setName ] = useState('');
  const [ address, setAddress ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ customers, setCustomers ] = useState<Customer[]>([]);
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    api.get('customers').then(response => {
      if (response.status === 200) {
        setCustomers(response.data);
      }
    })
  }, [count]);

  function handleSearchName(event: ChangeEvent<HTMLInputElement>) {
    const searchName = event.target.value.toUpperCase();
    const newFilteredCustomers = searchName? customers.filter((customer) => customer.name.toUpperCase().includes(searchName)) : [];

    const displayCustomers = document.getElementsByClassName('display-customers')[0];
    displayCustomers.innerHTML = '';

    if (displayCustomers) {
      newFilteredCustomers.forEach(element => { displayCustomers.innerHTML = displayCustomers.innerHTML +
        `<div class="box-customer"> 
          <h3> ${element.name} </h3>
          <p><strong>Endereço:</strong> ${element.address}</p>
          <p><strong>Telefone:</strong> ${element.phone}</p>
          <div class="box-customer-buttons">
            <a href="/customers-edit/${element.id}"><button type="button">Editar</button></a>
            <a href="/payment?customerId=${element.id}"><button>Ver pendências</button></a>
          </div>
        </div>`;
      });
    }
  }

  function handleCustomerSubmit(event: FormEvent) {
    event.preventDefault();
    const saveButton = document.getElementsByClassName('save-button')[0];
    if (saveButton) {
      saveButton.setAttribute('disabled', '');
      setTimeout(() => {
        saveButton.removeAttribute('disabled');
      }, 2000);
    } 
    
    const submitMessage = document.getElementsByClassName('submit-message')[0];

    if (!name || !address || !phone) {
      if (submitMessage) {
        submitMessage.textContent = 'Falta preencher campos vazios.';
        submitMessage.id = 'error-message-visibility';

        setTimeout(() => {
          submitMessage.id = '';
        }, 2000);
      }

      return;
    }

    api.post('customers', {
      name,
      address,
      phone,
    }).then(response => {
      if (response.status === 201) {
        setName('');
        setAddress('');
        setPhone('');
        setCount(count + 1);

        if (submitMessage) {
          submitMessage.textContent = 'Cliente salvo com sucesso!';
          submitMessage.id = 'submit-message-visibility';

          setTimeout(() => {
            submitMessage.id = '';
          }, 2000);
        }
      }
    });
  }

  return (
    <div className="page-customers">
      <Sidebar />

      <main className="main-content">
        <h1>CRIAR CLIENTE&nbsp; <FiUserPlus/></h1>
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
                onClick={handleCustomerSubmit}
              >Salvar</button>
              <div className="submit-message"></div>
            </div>
          </form>
        </div>

        <h2>Buscar clientes&nbsp;<span><BiSearchAlt/></span></h2>
        <div className="block-line">
          <Input 
            label="Por nome: " 
            name="search-name" 
            inputType="text" 
            onChange={handleSearchName}
          />

          <a href="/download" target="_blank"><button className="search-button">Buscar</button></a>
        </div>

        <div className="display-customers">

          

        </div>
      </main>
    </div>
  );
}