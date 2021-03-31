import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import api from '../../services/api';

import './styles.css';

interface Params {
  id: string;
}

interface Item {
  id: string;
  description: string;
  cost: number;
}

export default function ItemsEdit() {
  const { id } = useParams<Params>();

  const [ description, setDescription ] = useState('');
  const [ cost, setCost ] = useState('');

  const history = useHistory();

  useEffect(() => {
    api.get(`items/${id}`).then(response => {
      if (response.status === 200) {
        const item: Item = response.data;

        setDescription(item.description);
        setCost(item.cost.toFixed(2));
      }
    });
  }, [id]);

  function handleItemsChangesSubmit(event: FormEvent) {
    event.preventDefault();
    const submitMessage = document.getElementsByClassName('submit-message')[0];

    if (!description || !cost) {
      if (submitMessage) {
        submitMessage.textContent = 'Falta preencher campos vazios.';
        submitMessage.id = 'error-message-visibility';

        setTimeout(() => {
          submitMessage.id = '';
        }, 2000);
      }

      return;
    }

    const formatedCost = Number(cost.split(',').join('.'));

    api.put('items', {
      id,
      description,
      cost: formatedCost
    }).then(response => {
      if (response.status === 200)
        history.push('/items');
    });
  }

  return (
    <div className="page-items-edit">
      <Sidebar />

      <main className="main-content">
        <h1>Editando valores/nome da peça... </h1>

        <div className="block">
          <form>
            <Input 
              className="item-form-description" 
              label="Descrição: " 
              name="description" 
              inputType="text"
              value={description}
              onChange={e => setDescription(e.target.value)} 
              required 
            />
            <Input 
              className="item-form-cost" 
              label="Preço: " 
              name="cost" 
              inputType="number" 
              value={cost}
              onChange={e => setCost(e.target.value)}
              required 
            /> 

            <div className="bottom-form">
              <button
                type="submit" 
                className="save-button"
                onClick={handleItemsChangesSubmit}
              >Salvar mudanças</button>
              <div className="submit-message"></div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}