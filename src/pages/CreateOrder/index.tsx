import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { FiEdit3 } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import api from '../../services/api';

import './styles.css';

interface Item {
  value: string;
  label: string;
  cost: string;
}

interface Customer {
  value: string;
  label: string;
}

interface ItemAdded {
  id: string;
  description: string;
  observation: string;
  unitQuantity: number;
  unitCost: number;
  unitDiscount: number;
  unitSubtotal: number;
}

export default function CreateOrder() {
  const [ customerId, setCustomerId ] = useState('');
  const [ paymentType, setPaymentType ] = useState({value: '1', label: 'Dinheiro'});
  const [ paymentMoment, setPaymentMoment ] = useState({value: '1', label: 'Retirada'});
  const [ deliveryDate, setDeliveryDate ] = useState('');

  const [ paymentStatus, setPaymentStatus ] = useState('Não pago');

  const [ itemId, setItemId ] = useState('');
  const [ observation, setObservation ] = useState('');
  const [ unitCost, setUnitCost ] = useState(0);
  const [ unitQuantity, setUnitQuantity ] = useState(1);
  const [ unitDiscount, setUnitDiscount ] = useState(0);
  const [ unitSubtotal, setUnitSubtotal ] = useState(0);

  const [ itemQuantity, setItemQuantity ] = useState(0);
  const [ subtotal, setSubtotal ] = useState(0);
  const [ discount, setDiscount ] = useState(0);
  const [ paymentMade, setPaymentMade ] = useState(0);
  const [ total, setTotal ] = useState(0);

  const [ customerOptions, setCustomerOptions ] = useState<Customer[]>([]);
  const [ itemOptions, setItemOptions ] = useState<Item[]>([]);
  const [ paymentTypeOptions ] = useState([
    {value: '1', label: 'Dinheiro'},
    {value: '2', label: 'Cartão'},
  ]);
  const [ paymentMomentOptions ] = useState([
    {value: '1', label: 'Retirada'},
    {value: '2', label: 'Agora'},
  ]);
  const [ itemAdded, setItemAdded ] = useState<ItemAdded[]>([]);
  const [ saveButtonIsDisabled, setSaveButtonIsDisabled ] = useState(false);

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
    api.get('items').then(response => {
      if (response.status === 200) {
        const data: {
          id: string;
          description: string;
          cost: number;
        }[] = response.data;

        const newItemOptions: Item[] = [];
        data.forEach(item => {
          const newItem = {
            value: item.id,
            label: item.description,
            cost: String(item.cost)
          }

          newItemOptions.push(newItem);
        });

        setItemOptions(newItemOptions);
      }
    });
  }, []);

  useEffect(() => {
    if ((paymentMade !== 0) && (total === 0)) {
      setPaymentStatus('Pago');
    }

    if (paymentMade !== 0 && (total !== 0)) {
      setPaymentStatus('Parcialmente pago');
    }

    if (paymentMade === 0) {
      setPaymentStatus('Não pago');
    }
  }, [paymentMade, total, subtotal, discount]);

  function handlePlusClick() {
    if (itemId) {
      const newTds: Array<HTMLTableDataCellElement> = [];
      
      const deleteButton: HTMLButtonElement = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-button';
      deleteButton.onclick = handleDeleteClick;
      deleteButton.innerHTML = `&nbsp;&nbsp;<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>`;
      

      for (let i = 0; i < 8; ++i) {
        newTds[i] = document.createElement('td');
      }

      newTds[0].innerHTML = itemId;
      newTds[1].className = "description-td";
      newTds[1].innerHTML = itemOptions.find(item => item.value === itemId)?.label || "error: not found";
      newTds[2].className = "observation-td";
      newTds[2].innerHTML = observation;
      newTds[3].innerHTML = String(unitQuantity);
      newTds[4].innerHTML = String(Number(unitCost).toFixed(2)).split('.').join(',');
      newTds[5].innerHTML = String(Number(unitDiscount).toFixed(2)).split('.').join(',');
      newTds[6].innerHTML = String(Number(unitSubtotal).toFixed(2)).split('.').join(',');
      newTds[7].appendChild(deleteButton);

      const newTr = document.createElement('tr');
      
      newTds.forEach(element => {
        newTr.appendChild(element);
      }); 

      setItemId('');
      setObservation('');
      setUnitCost(0);
      setUnitQuantity(1);
      setUnitDiscount(0);
      setUnitSubtotal(0);

      const newItemQuantity = itemQuantity + unitQuantity;
      const newSubtotal = subtotal + unitSubtotal;
      setItemQuantity(newItemQuantity);
      setSubtotal(newSubtotal);
      setTotal(newSubtotal);
      
      document.getElementById('table-body')?.appendChild(newTr);

      const newArrayOfItemAdded = itemAdded;
      newArrayOfItemAdded.push({
        id: itemId,
        description: itemOptions.find(item => item.value === itemId)?.label || '',
        observation: observation,
        unitQuantity: unitQuantity,
        unitCost: unitCost,
        unitDiscount: unitDiscount,
        unitSubtotal: unitSubtotal,
      });
      setItemAdded(newArrayOfItemAdded);
    }
    else {
      alert('Selecione uma peça antes de adicionar!');
    }
  }

  function handleDeleteClick(this: GlobalEventHandlers | any, ev: globalThis.MouseEvent) {
    const deletedTr: (Node & ParentNode) | null | undefined = this.parentNode?.parentNode;
    
    if (deletedTr?.parentNode?.childNodes) {
      const nodeList: Node[] = Array.from(deletedTr?.parentNode?.childNodes);
      const nodeIndex = nodeList.indexOf(deletedTr);
      const newArrayOfItemAdded = itemAdded;
      newArrayOfItemAdded.splice(nodeIndex, 1);
      setItemAdded(newArrayOfItemAdded);

      let totalQuantity = 0;
      let totalSubtotal = 0;

      newArrayOfItemAdded.forEach(element => {
        totalQuantity += element.unitQuantity;
        totalSubtotal += element.unitSubtotal;
      });

      setItemQuantity(totalQuantity);
      setDiscount(0);
      setPaymentMade(0);
      setSubtotal(totalSubtotal);
      setTotal(totalSubtotal);

      document.getElementById('table-body')?.removeChild(deletedTr);
    }  
  }

  function handleNewClick() {
    setCustomerId('');
    setPaymentType({value: '1', label: 'Dinheiro'});
    setPaymentMoment({value: '1', label: 'Retirada'});
    setDeliveryDate('');

    setItemId('');
    setObservation('');
    setUnitCost(0);
    setUnitQuantity(1);
    setUnitDiscount(0);
    setUnitSubtotal(0);

    setItemQuantity(0);
    setSubtotal(0);
    setDiscount(0);
    setPaymentMade(0);
    setTotal(0);

    setItemAdded([]);

    const tableBody = document.getElementById('table-body');
    if (tableBody)
      tableBody.innerHTML = '';
  
  }

  function handleSaveClick() {
    setSaveButtonIsDisabled(true);

    if (!customerId) {
      setSaveButtonIsDisabled(false);
      return alert('Selecione o Cliente antes de salvar.');
    }

    if (!deliveryDate) {
      setSaveButtonIsDisabled(false);
      return alert('Selecione a Data de Retirada antes de salvar.');
    }

    if (!itemAdded[0]) {
      setSaveButtonIsDisabled(false);
      return alert('Adicione alguma peça no pedido antes de salvar.');
    }

    const date = new Date();
    var currentDate = '';
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    if (day < 10) 
      currentDate += "0" + day;
    else 
      currentDate += String(day);

    if (month < 10) 
      currentDate += "/0" + (month + 1);
    else 
      currentDate += "/" + (month + 1);

    currentDate += "/" + year;

    api.post('orders', {
      order_status: 'Pendente',
      payment_status: paymentStatus,
      payment_type: paymentType.label,
      payment_moment: paymentMoment.label,
      delivery_date: deliveryDate,
      item_quantity: itemQuantity,
      subtotal: subtotal,
      discount: discount,
      payment_made: paymentMade,
      cost: total,
      created_at: currentDate,
      date_number: Number(currentDate.split('/').reverse().join('')),
      date_out_number: Number(deliveryDate.split('-').join('')),
      created_hours: date.getHours(),
      customer_id: customerId,
      item_added: itemAdded
    }).then(response => {
      if (response.status === 200) {
        const orderIdCreated = response.data;
        setCustomerId('');
        setPaymentType({value: '1', label: 'Dinheiro'});
        setPaymentMoment({value: '1', label: 'Retirada'});
        setDeliveryDate('');

        setItemId('');
        setObservation('');
        setUnitCost(0);
        setUnitQuantity(1);
        setUnitDiscount(0);
        setUnitSubtotal(0);

        setItemQuantity(0);
        setSubtotal(0);
        setDiscount(0);
        setPaymentMade(0);
        setTotal(0);

        setItemAdded([]);

        const tableBody = document.getElementById('table-body');
        if (tableBody)
          tableBody.innerHTML = '';

        const submitMessage = document.getElementsByClassName('submit-message')[0];
        if (submitMessage) {
          submitMessage.textContent = 'Pedido salvo com sucesso!';
          submitMessage.id = 'submit-message-visibility';

          setTimeout(() => {
            submitMessage.id = '';
            window.open(`/download?orderId=${orderIdCreated}`, '_blank');
          }, 500);
        }
      }

      setSaveButtonIsDisabled(false);
      
    }).catch(() => {
      alert('Erro ao salvar pedido.');

      setSaveButtonIsDisabled(false);
    });
  }

  return (
    <div className="page-create-order">
      <Sidebar />

      <main className="main-content">
        <h1>CRIAR NOVO PEDIDO&nbsp;<FiEdit3/> </h1>

        <div className="block">
          <label htmlFor="name"style={{paddingBottom: '8px'}}>Cliente: </label>
          <div className="select" style={{width: '100%'}}>
            <Select
              required 
              id="name" 
              placeholder={'Selecione...'}
              value={customerId? customerOptions.find(customer => customer.value === customerId) : {value: '0', label: 'Selecione...'}}
              isSearchable
              noOptionsMessage={() => 'Carregando...'}
              onChange={key => {
                if (key) setCustomerId(key.value);
              }}
              options={customerOptions}
            />
          </div>
        </div>

        <div className="block">
          <label htmlFor="paymentType" style={{width: '56%'}}>Tipo de pagamento: </label>
          <div className="select" style={{width: '60%', marginTop: '5px'}}>
            <Select
              required 
              id="paymentType" 
              value={paymentType}
              isSearchable
              onChange={key => {
                if (key) setPaymentType({ value: key.value, label: key.label });
              }}
              options={paymentTypeOptions}
            />
          </div>

          <label htmlFor="paymentMoment" style={{width: 'max-content'}}>Pagamento: </label>
          <div className="select" style={{width: '60%', marginTop: '5px'}}>
              <Select
                required 
                id="paymentMoment" 
                value={paymentMoment}
                isSearchable
                onChange={key => {
                  if (key) setPaymentMoment({ value: key.value , label: key.label });
                }}
                options={paymentMomentOptions}
              />
          </div>          
          <Input 
            required 
            label="Retirada: " 
            name="delivery" 
            inputType="date"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.target.value)}
          />
        </div>

        <h2>Peças</h2>

        <div className="block">
          <label htmlFor="item" style={{paddingBottom: '8px'}}>Peça: </label>
          <div className="select" style={{width: '100%'}}>
              <Select
                required 
                id="item" 
                placeholder={'Selecione...'}
                value={itemId? itemOptions.find(item => item.value === itemId) : {value: '0', label: 'Selecione...'}}
                isSearchable
                noOptionsMessage={() => 'Carregando...'}
                onChange={key => {
                  if (key) {
                    setItemId(key.value);
                    const newUnitCost = Number(itemOptions.find(item => item.value === key.value)?.cost);
                    setUnitCost(newUnitCost);
                    setUnitQuantity(1);
                    setUnitDiscount(0);
                    setUnitSubtotal(newUnitCost);
                  }
                }}
                options={itemOptions}
              />
          </div>
          <Input 
            label="OBS: " 
            name="observation" 
            inputType="text"
            value={observation}
            onChange={e => setObservation(e.target.value)}
          />
        </div>

        <div className="block">
          <Input 
            className="numeric-input"
            label="Valor unitário: "
            name="unit-value"
            inputType="number"
            readOnly
            value={Number(unitCost).toFixed(2)}
          />
      
          <Input 
            className="numeric-input" 
            label="Quantidade: " 
            name="unit-quantity" 
            inputType="number" 
            min={1}
            value={unitQuantity}
            onChange={e => {
              const newUnitQuantity = Number(e.target.value);
              setUnitQuantity(newUnitQuantity);
              setUnitSubtotal(unitCost * newUnitQuantity);
            }}
          />
      
          <Input 
            className="numeric-input" 
            label="Desconto: " 
            name="unit-discount" 
            inputType="number"
            min={0}
            value={unitDiscount}
            onChange={e => {
              const newUnitDiscount = Number(e.target.value.split(',').join('.'));
              setUnitDiscount(newUnitDiscount);
              setUnitSubtotal(unitSubtotal + unitDiscount - newUnitDiscount);
            }}
          />
          
          <Input 
            className="numeric-input" 
            label="Subtotal: " 
            name="unit-sutotal" 
            inputType="number"
            readOnly
            value={Number(unitSubtotal).toFixed(2)}
          />

          <button 
            type="button" 
            className="plus-button"
            onClick={handlePlusClick}
          ><FaPlus/></button>
        </div>

        <h2>Peças adicionadas</h2>

        <div className="table-container">
          <div id="head-table">
            <p style={{width: '48px'}}>Código</p>
            <p style={{width: '250px'}}>Descrição</p>
            <p style={{width: '150px'}}>OBS.</p>
            <p style={{width: '38px'}}>Qtde.</p>
            <p style={{width: '78px'}}>Valor R$</p>
            <p style={{width: '78px'}}>Desconto</p>
            <p style={{width: '78px'}}>Subtotal</p>
            <p style={{width: '50px'}}></p>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{width: '48px'}}>Código</th>
                <th style={{width: '250px'}}>Descrição</th>
                <th style={{width: '150px'}}>OBS.</th>
                <th style={{width: '38px'}}>Qtde.</th>
                <th style={{width: '78px'}}>Valor R$</th>
                <th style={{width: '78px'}}>Desconto</th>
                <th style={{width: '78px'}}>Subtotal</th>
                <th style={{width: '50px'}}></th>
              </tr>
            </thead>
            
            <tbody id="table-body">
              
            </tbody>
          </table>
        </div>

        <div className="block" id="foot-table">
          <Input 
            className="numeric-input" 
            label="Qntde. peças: " 
            name="item-quantity" 
            inputType="number" 
            value={itemQuantity}
            readOnly
          />
          <Input 
            className="numeric-input" 
            label="Subtotal: " 
            name="subtotal" 
            inputType="number"
            value={Number(subtotal).toFixed(2)} 
            readOnly
          />
          <Input 
            className="numeric-input" 
            label="Desconto: " 
            name="discount" 
            inputType="number" 
            value={discount}
            onChange={e => {
              const newDiscount = Number(e.target.value.split(',').join('.'));
              setDiscount(newDiscount);
              setTotal(subtotal - (newDiscount + paymentMade));
            }}
            min={0}
          />
          <Input 
            className="numeric-input" 
            label="Pgto. Efetuado: " 
            name="paymentMade" 
            inputType="number" 
            value={paymentMade}
            onChange={e => {
              const newPaymentMade = Number(e.target.value.split(',').join('.'));
              setPaymentMade(newPaymentMade);
              setTotal(subtotal - (newPaymentMade + discount));
            }}
            min={0}
          />
          <Input 
            className="numeric-input" 
            label="Total: " 
            name="total" 
            inputType="number" 
            value={Number(total).toFixed(2)}
            readOnly
          />
        </div>

        <div className="submit-buttons">
          <div className="submit-message"></div>
          <button
            type="button" 
            className="new-button"
            onClick={handleNewClick}
          >Novo</button>
          <button 
            type="button" 
            className="save-button" 
            onClick={handleSaveClick}
            disabled={saveButtonIsDisabled}
          >Salvar</button>
        </div>

      </main>
    </div>
  );
}