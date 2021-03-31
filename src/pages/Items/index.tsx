import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BsBookmarkPlus } from 'react-icons/bs';
import { BiSearchAlt } from 'react-icons/bi';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import api from '../../services/api';

import './styles.css';

interface Item {
  id: string;
  description: string;
  cost: number;
}

export default function Items() {
  const [ description, setDescription ] = useState('');
  const [ cost, setCost ] = useState('');
  const [ items, setItems ] = useState<Item[]>([]);
  const [ count, setCount ] = useState(0);

  const displayContent = (content: Item[]) => {
    const displayItems = document.getElementsByClassName('display-items')[0];

    displayItems.innerHTML = 
    `<div class="head-table-items">
      <p class="item-code">Código</p>
      <p class="item-description">Descrição</p>
      <p class="item-cost">Preço</p>
      <p class="item-actions-head">Ações</p>
    </div>`;

    content.forEach(item => {
      displayItems.innerHTML = displayItems.innerHTML + 
      `<div class="body-table-items" id=${item.id}>
        <input class="item-code" value=${item.id} readonly></input>
        <p class="item-description">${item.description}</p>
        <input class="item-cost" value=${item.cost.toFixed(2).split('.').join(',')} readonly></input>
        <p class="item-actions" id=${item.id}>
          <a href="/items-edit/${item.id}"><button type="button">Editar</button></a>
        </p>
      </div>`;
    });

    const displayedItemActions = document.getElementsByClassName('item-actions');
    Array.from(displayedItemActions).forEach(element => {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.type = 'button';
      deleteButton.onclick = async function () {
        await api.delete(`/items/${element.id}`).then(response => {
          if (response.status === 204)
            setCount(count + 1);
        });
      }

      element.appendChild(deleteButton);
    })
  }

  useEffect(() => {
    api.get('items').then(response => {
      if (response.status === 200) 
        setItems(response.data);
    });
  }, [count]);

  useEffect(() => {
    if (items) displayContent(items);

  }, [items]);

  function handleItemSubmit(event: FormEvent) {
    event.preventDefault();
    const submitMessage = document.getElementsByClassName('submit-message')[0];

    if (description.length === 0 || cost.length === 0) {
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

    api.post('items', {
      description,
      cost: formatedCost
    }).then(response => {
      if (response.status === 201) {
        setDescription('');
        setCost('');
        setCount(count + 1);

        if (submitMessage) {
          submitMessage.textContent = 'Peça salva com sucesso!';
          submitMessage.id = 'submit-message-visibility';

          setTimeout(() => {
            submitMessage.id = '';
          }, 2000);
        }
      }
    });      
  }

  function handleFilterName(event: ChangeEvent<HTMLInputElement>) {
    const filterName = event.target.value.toUpperCase();
    const filteredItems = filterName ? items.filter(item => item.description.toUpperCase().includes(filterName)) : null;

    if (filteredItems) 
      displayContent(filteredItems);
    else
      displayContent(items);
  }

  return(
    <div className="page-items">
      <Sidebar />

      <main className="main-content">
        <h1>CRIAR NOVA PEÇA&nbsp;<BsBookmarkPlus/></h1>
        <div className="block">
          <form>
            <Input 
              className="item-form-description" 
              label="Descrição: " 
              name="description" 
              inputType="text" 
              maxLength={35}
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
              min={0} 
              required
            />
            <div className="bottom-form">
              <button 
                type="submit" 
                className="save-button"
                onClick={handleItemSubmit}
              >Salvar</button>
              <div className="submit-message"></div>
            </div>
          </form>
        </div>

        <h2>Listar peças&nbsp;<span><BiSearchAlt/></span></h2>
        <Input 
          label="Filtrar por nome: " 
          name="item-filter" 
          inputType="text"
          onChange={handleFilterName}
        />
        <div className="display-items">
          
        </div>
      </main>
    </div>
  );
}