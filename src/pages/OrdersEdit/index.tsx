import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { FaPlus } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Select from 'react-select'

import api from '../../services/api';

import { Order, Item } from '../../utils/interfaces';

import './styles.css';

interface Params {
  id: string;
}

interface Customer {
  name: string;
  address: string;
  phone: string;
}

interface ItemOption {
  value: string;
  label: string;
  cost: string;
}

function OrderEdit() {
  const { id } = useParams<Params>();
  const [order, setOrder] = useState<Order>();
  const [items, setItems] = useState<Item[]>([]);
  const [customer, setCustomer] = useState<Customer>();

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

  const [ itemOptions, setItemOptions ] = useState<ItemOption[]>([]);

  const history = useHistory();

  useEffect(() => {
    api.get('items').then(response => {
      if (response.status === 200) {
        const data: {
          id: string;
          description: string;
          cost: number;
        }[] = response.data;

        const newItemOptions: ItemOption[] = [];
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
    if (id) api.get('orders', {
      params: {
        orderId: id
      }
    }).then(response => {
      if (response.status === 200) {
        console.log('retorno api:', response.data)
        setOrder(response.data.orders[0]);
        setItems(response.data.itemAddedByOrderId[id]);
        setCustomer(response.data.customerByOrderId[id]);

        setItemQuantity(response.data.orders[0].item_quantity);
        setSubtotal(response.data.orders[0].subtotal);
        setDiscount(response.data.orders[0].discount);
        setPaymentMade(response.data.orders[0].payment_made);
        setTotal(response.data.orders[0].cost);
      }
    });
  }, [id]);

  useEffect(() => {
    if ((Number(paymentMade) !== 0) && (total === 0)) {
      setPaymentStatus('Pago');
    }

    if (Number(paymentMade) !== 0 && (total !== 0)) {
      setPaymentStatus('Parcialmente pago');
    }

    if (Number(paymentMade) === 0) {
      setPaymentStatus('Não pago');
    }
  }, [paymentMade, total, subtotal, discount]);

  function handlePlusClick() {
    if (itemId) {
      const newItemQuantity = itemQuantity + unitQuantity;
      const newSubtotal = Number(subtotal) + unitSubtotal;
      setItemQuantity(newItemQuantity);
      setSubtotal(newSubtotal);
      setTotal(newSubtotal);

      const newArrayOfItemAdded = items;
      newArrayOfItemAdded.push({
        item_id: itemId,
        description: itemOptions.find(item => item.value === itemId)?.label || '',
        observation: observation,
        unit_quantity: unitQuantity.toString(),
        unit_cost: unitCost.toString(),
        unit_discount: unitDiscount.toString(),
        unit_subtotal: unitSubtotal.toString(),
        order_id: parseInt(id)
      });
      
      setItems(newArrayOfItemAdded);

      setItemId('');
      setObservation('');
      setUnitCost(0);
      setUnitQuantity(1);
      setUnitDiscount(0);
      setUnitSubtotal(0);
    }
    else {
      alert('Selecione uma peça antes de adicionar!');
    }
  }

  async function handleSaveClick() {
    const saveButton = document.getElementsByClassName('save-button')[0];
    if (saveButton) {
      saveButton.setAttribute('disabled', '');
      setTimeout(() => {
        saveButton.removeAttribute('disabled');
      }, 2000);
    } 

    try {
      await api.put('orders', {
        id: order?.id,
        order_status: order?.order_status,
        payment_status: paymentStatus,
        payment_type: order?.payment_type,
        payment_moment: order?.payment_moment,
        delivery_date: order?.delivery_date,
        item_quantity: itemQuantity,
        subtotal: subtotal,
        discount: discount,
        payment_made: paymentMade,
        cost: total,
        created_at: order?.created_at,
        date_number: order?.date_number,
        customer_id: order?.customer_id,
      });
  
      await api.put('order-items', {
        order_id: id,
        item_added: items,
      });

      const submitMessage = document.querySelector('.submit-message');
      if (submitMessage) submitMessage.id = 'submit-message-visibility';

      setTimeout(() => {
        history.push('/');
      }, 2000);

    } catch (err) {
      console.log('Erro');
    }
  }

  return (
    <div className="page-orders-edit">
      <Sidebar />

      <main className="main-content">
        <h1>Editando peças do pedido nº {order?.id}, cliente: {customer?.name.toUpperCase()}</h1>

        
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

              {items?.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.item_id}
                  </td>
                  <td className="description-td">
                    {item.description}
                  </td>
                  <td className="observation-td">
                    {item.observation}
                  </td>
                  <td>
                    {parseInt(item.unit_quantity).toFixed(0)}
                  </td>
                  <td>
                    {parseFloat(item.unit_cost).toFixed(2).split('.').join(',')}
                  </td>
                  <td>
                    {parseFloat(item.unit_discount).toFixed(2).split('.').join(',')}
                  </td>
                  <td>
                    {parseFloat(item.unit_subtotal).toFixed(2).split('.').join(',')}
                  </td>
                  <td>
                    <button type="button" className="delete-button" onClick={() => {
                      const newItems: Item[] = [];
                      items.forEach(function(item, indexItem) {
                        if (indexItem !== index)
                          newItems.push(item);
                      });

                      setItems(newItems); 
                      console.log(newItems)

                      let totalQuantity = 0;
                      let totalSubtotal = 0;

                      newItems.forEach(element => {
                        totalQuantity += parseFloat(element.unit_quantity);
                        totalSubtotal += parseFloat(element.unit_subtotal);
                      });

                      setItemQuantity(totalQuantity);
                      setDiscount(0);
                      setPaymentMade(0);
                      setSubtotal(totalSubtotal);
                      setTotal(totalSubtotal);
                    }}><FiDelete /></button>
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
        </div>

        <div className="block" id="foot-table">
          <Input 
            className="numeric-input" 
            label="Qntde. peças: " 
            name="item-quantity" 
            inputType="number" 
            value={itemQuantity.toFixed(0)}
            readOnly
          />
          <Input 
            className="numeric-input" 
            label="Subtotal: " 
            name="subtotal" 
            inputType="number"
            value={subtotal.toFixed(2)} 
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
              setTotal(Number(subtotal) - (newDiscount + Number(paymentMade)));
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
              setTotal(Number(subtotal) - (newPaymentMade + Number(discount)));
            }}
            min={0}
          />
          <Input 
            className="numeric-input" 
            label="Total: " 
            name="total" 
            inputType="number" 
            value={total.toFixed(2)}
            readOnly
          />
        </div>

        <div className="submit-buttons"> 
          <button 
            type="button" 
            className="cancel-button" 
            onClick={() => {
              history.push('/');
            }}
          >Cancelar
          </button>

          <button 
            type="button" 
            className="save-button" 
            onClick={handleSaveClick}
          >Salvar mudanças
          </button>
        </div>
        
        <div className="submit-message">Informações salvas com sucesso!</div>

      </main>
    </div>
  );
}

export default OrderEdit;