import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { FiEdit3 } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
  const [customerId, setCustomerId] = useState('');
  const [paymentType, setPaymentType] = useState({ value: '1', label: 'Dinheiro' });
  const [paymentMoment, setPaymentMoment] = useState({ value: '1', label: 'Retirada' });
  const [deliveryDate, setDeliveryDate] = useState('');

  const [paymentStatus, setPaymentStatus] = useState('Não pago');

  const [itemId, setItemId] = useState('');
  const [observation, setObservation] = useState('');
  const [unitCost, setUnitCost] = useState(0);
  const [unitQuantity, setUnitQuantity] = useState(1);
  const [unitDiscount, setUnitDiscount] = useState(0);
  const [unitSubtotal, setUnitSubtotal] = useState(0);

  const [itemQuantity, setItemQuantity] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMade, setPaymentMade] = useState(0);
  const [total, setTotal] = useState(0);

  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [itemOptions, setItemOptions] = useState<Item[]>([]);
  const [paymentTypeOptions] = useState([
    { value: '1', label: 'Dinheiro' },
    { value: '2', label: 'Cartão' },
  ]);
  const [paymentMomentOptions] = useState([
    { value: '1', label: 'Retirada' },
    { value: '2', label: 'Agora' },
  ]);
  const [itemAdded, setItemAdded] = useState<ItemAdded[]>([]);

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(false);

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
      deleteButton.className = 'btn btn-danger px-2 py-0 pb-1 fs-6';
      deleteButton.onclick = handleDeleteClick;
      deleteButton.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>`;


      for (let i = 0; i < 7; ++i) {
        newTds[i] = document.createElement('td');
      }

      newTds[0].innerHTML = itemOptions.find(item => item.value === itemId)?.label || "error: not found";
      newTds[1].innerHTML = observation;
      newTds[2].innerHTML = String(unitQuantity);
      newTds[2].className = "text-center";
      newTds[3].innerHTML = String(Number(unitCost).toFixed(2)).split('.').join(',');
      newTds[3].className = "text-center";
      newTds[4].innerHTML = String(Number(unitDiscount).toFixed(2)).split('.').join(',');
      newTds[4].className = "text-center";
      newTds[5].innerHTML = String(Number(unitSubtotal).toFixed(2)).split('.').join(',');
      newTds[5].className = "text-center";
      newTds[6].appendChild(deleteButton);
      newTds[6].className = "action-td";

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
      toast.error('Selecione uma peça antes de adicionar.');
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
    setPaymentType({ value: '1', label: 'Dinheiro' });
    setPaymentMoment({ value: '1', label: 'Retirada' });
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
      toast.error("Selecione o Cliente antes de salvar.");
      return;
    }

    if (!deliveryDate) {
      setSaveButtonIsDisabled(false);
      toast.error("Selecione a Data de Retirada antes de salvar.");
      return;
    }

    if (!itemAdded[0]) {
      setSaveButtonIsDisabled(false);
      toast.error("Adicione alguma peça no pedido antes de salvar.");
      return;
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

    toast.promise(
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
      }),
      {
        pending: 'O pedido está sendo processado...',
        success: {
          render({ data }) {
            const orderIdCreated = data as { data: number; };
            setCustomerId('');
            setPaymentType({ value: '1', label: 'Dinheiro' });
            setPaymentMoment({ value: '1', label: 'Retirada' });
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

            setTimeout(() => {
              setSaveButtonIsDisabled(false);

              window.open(`/download?orderId=${orderIdCreated.data}`, '_blank');
            }, 250);

            return 'Pedido criado com sucesso!'
          }
        },
        error: {
          render() {
            setSaveButtonIsDisabled(false);

            return 'Erro ao criar pedido!';
          }
        }
      })
  }

  return (
    <div className="">

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Criar Pedido&nbsp;<FiEdit3 className="fs-6 mb-1" /></h5>

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
                noOptionsMessage={() => 'Carregando...'}
                onChange={key => {
                  if (key) setCustomerId(key.value);
                }}
                options={customerOptions}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-4 col-lg-3 mb-2">
              <label className="mb-1" htmlFor="paymentType">Tipo de pagamento</label>
              <Select
                required
                id="paymentType"
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

            <div className="col-12 col-md-4 col-lg-3 mb-2">
              <label className="mb-1" htmlFor="paymentMoment">Pagamento</label>
              <Select
                required
                id="paymentMoment"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  })
                }}
                value={paymentMoment}
                isSearchable
                onChange={key => {
                  if (key) setPaymentMoment({ value: key.value, label: key.label });
                }}
                options={paymentMomentOptions}
              />
            </div>

            <div className="col-12 col-md-4 col-lg-3 mb-2">
              <label className="mb-1" htmlFor="delivery">Retirada</label><br />
              <input
                id="delivery"
                required
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
              {/* <Input
            required
            label="Retirada: "
            name="delivery"
            inputType="date"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.target.value)}
          /> */}
            </div>
          </div>

          <h5 className="card-title mt-1 mb-0">Peças</h5>

          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <label className="mb-1" htmlFor="item">Peça</label>
              <Select
                required
                id="item"
                maxMenuHeight={200}
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: '100%'
                  })
                }}
                placeholder={'Selecione...'}
                value={itemId ? itemOptions.find(item => item.value === itemId) : { value: '0', label: 'Selecione...' }}
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

            <div className="col-12 col-md-6 mb-2">
              <label className="mb-1" htmlFor="observation">Observação</label><br />
              <input
                id="observation"
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                type="text"
                value={observation}
                onChange={e => setObservation(e.target.value)}
              />
              {/* <Input
            label="OBS: "
            name="observation"
            inputType="text"
            value={observation}
            onChange={e => setObservation(e.target.value)}
          /> */}
            </div>
          </div>

          <div className="row">
            <div className="col-6 col-md-3">
              <label className="mb-1" htmlFor="unit-value">Valor unitário</label><br />
              <input
                id="unit-value"
                type="number"
                readOnly
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={Number(unitCost).toFixed(2)}
              />
              {/* <Input
            className="numeric-input"
            label="Valor unitário: "
            name="unit-value"
            inputType="number"
            readOnly
            value={Number(unitCost).toFixed(2)}
          /> */}
            </div>

            <div className="col-6 col-md-2">
              <label className="mb-1" htmlFor="unit-quantity">Quantidade</label><br />
              <input
                id="unit-quantity"
                type="number"
                min={1}
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={unitQuantity}
                onChange={e => {
                  const newUnitQuantity = Number(e.target.value);
                  setUnitQuantity(newUnitQuantity);
                  setUnitSubtotal(unitCost * newUnitQuantity);
                }}
              />
              {/* <Input
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
          /> */}
            </div>

            <div className="col-6 col-md-3">
              <label className="mb-1" htmlFor="unit-discount">Desconto</label><br />
              <input
                id="unit-discount"
                type="number"
                min={0}
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={unitDiscount}
                onChange={e => {
                  const newUnitDiscount = Number(e.target.value.split(',').join('.'));
                  setUnitDiscount(newUnitDiscount);
                  setUnitSubtotal(unitSubtotal + unitDiscount - newUnitDiscount);
                }}
              />
              {/* <Input
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
          /> */}
            </div>

            <div className="col-6 col-md-3">
              <label className="mb-1" htmlFor="unit-sutotal">Subtotal</label><br />
              <input
                id="unit-sutotal"
                type="number"
                readOnly
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={Number(unitSubtotal).toFixed(2)}
              />
              {/* <Input
            className="numeric-input"
            label="Subtotal: "
            name="unit-sutotal"
            inputType="number"
            readOnly
            value={Number(unitSubtotal).toFixed(2)}
          /> */}
            </div>

            <div className="col-1 mb-2">
              <button
                type="button"
                title="Adicionar"
                className="btn btn-outline-success btn-sm pt-0 mt-2 mt-sm-4 fs-5"
                onClick={handlePlusClick}
              ><FaPlus /></button>
            </div>
          </div>

          <h5 className="card-title mt-1">Peças adicionadas</h5>

          <div className="table-responsive mb-1">
            <table className="table table-sm table-striped table-bordered">
              <thead className="fw-bold">
                <tr>
                  <th scope="col">Descrição</th>
                  <th scope="col">OBS.</th>
                  <th scope="col" className="text-center">Qtd.</th>
                  <th scope="col" className="text-center">Valor</th>
                  <th scope="col" className="text-center">Desconto</th>
                  <th scope="col" className="text-center">Subtotal</th>
                  <th scope="col" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody id="table-body">

              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-6 col-md-4 col-lg-2">
              <label className="mb-1" htmlFor="item-quantity">Qntd. peças</label><br />
              <input
                id="item-quantity"
                type="number"
                readOnly
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={itemQuantity}
              />
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="mb-1" htmlFor="subtotal">Subtotal</label><br />
              <input
                id="subtotal"
                type="number"
                readOnly
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={Number(subtotal).toFixed(2)}
              />
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="mb-1" htmlFor="discount">Desconto</label><br />
              <input
                id="discount"
                type="number"
                min={0}
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={discount}
                onChange={e => {
                  const newDiscount = Number(e.target.value.split(',').join('.'));
                  setDiscount(newDiscount);
                  setTotal(subtotal - (newDiscount + paymentMade));
                }}
              />
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <label className="mb-1" htmlFor="paymentMade">Pgto. Efetuado</label><br />
              <input
                id="paymentMade"
                type="number"
                min={0}
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={paymentMade}
                onChange={e => {
                  const newPaymentMade = Number(e.target.value.split(',').join('.'));
                  setPaymentMade(newPaymentMade);
                  setTotal(subtotal - (newPaymentMade + discount));
                }}
              />
            </div>

            <div className="col-12 col-md-4 col-lg-2">
              <label className="mb-1" htmlFor="total">Total</label><br />
              <input
                id="total"
                type="number"
                readOnly
                className="py-1 px-2"
                style={{
                  width: '100%',
                  borderColor: '#ccc',
                  borderRadius: '4px',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                }}
                value={Number(total).toFixed(2)}
              />
            </div>

            <div className="col-12 col-md-4 col-lg-2">
              <div className="row">
                <div className="col-6 col-md-6">
                  <button
                    type="button"
                    className="btn btn-primary mt-2 mt-sm-4"
                    onClick={handleNewClick}
                  >Novo</button>
                </div>

                <div className="col-6 col-md-6 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-success mt-2 mt-sm-4"
                    onClick={handleSaveClick}
                    disabled={saveButtonIsDisabled}
                  >Salvar</button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}