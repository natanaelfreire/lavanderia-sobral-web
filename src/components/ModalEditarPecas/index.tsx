import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../../services/api";

type ModalProps = {
  id: string;
  show: boolean;
  setShow: (value: boolean) => void;
  fn: (id: string) => void;
}

interface Item {
  value: string;
  label: string;
  cost: string;
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

type OrderItem = {
  item_id: string,
  description: string,
  observation: string,
  unit_quantity: number,
  unit_cost: number,
  unit_discount: number,
  unit_subtotal: number
}

type OrderNumbers = {
  item_quantity: number,
  subtotal: number,
  discount: number,
  payment_made: number,
  cost: number
}

type ResponseData = {
  items: OrderItem[],
  order: OrderNumbers
}

const ModalEditarPecas: React.FC<ModalProps> = ({ id, show, setShow, fn }) => {
  const [loadingModalData, setLoadingModalData] = useState(true);

  const [itemOptions, setItemOptions] = useState<Item[]>([]);

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

  const [itemAdded, setItemAdded] = useState<ItemAdded[]>([]);

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(false);

  function carregaPecas(id: string) {
    api.get<ResponseData>(`itemsByOrder/${id}`).then(response => {
      if (response.status === 200) {
        const newItems = response.data.items.map(item => {
          const newItemAdded = {
            id: item.item_id,
            description: item.description,
            observation: item.observation,
            unitQuantity: item.unit_quantity,
            unitCost: item.unit_cost,
            unitDiscount: item.unit_discount,
            unitSubtotal: item.unit_subtotal
          }

          return newItemAdded;
        })

        setItemAdded(newItems);
        setItemQuantity(response.data.order.item_quantity);
        setSubtotal(response.data.order.subtotal);
        setDiscount(response.data.order.discount);
        setPaymentMade(response.data.order.payment_made);
        setTotal(response.data.order.cost);
        setLoadingModalData(false);
      }
    }).catch(error => {
      toast.error(error.toString());
      setLoadingModalData(false);
    })
  }

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
    if (show) {
      carregaPecas(id);
    }
  }, [show, id])

  function formatoDinheiro(valor: number) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  function handlePlusClick() {
    if (itemId) {
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
      setTotal(newSubtotal - (discount + paymentMade));

      const newItem = {
        id: itemId,
        description: itemOptions.find(item => item.value === itemId)?.label || '',
        observation: observation,
        unitQuantity: unitQuantity,
        unitCost: unitCost,
        unitDiscount: unitDiscount,
        unitSubtotal: unitSubtotal,
      }

      setItemAdded([...itemAdded, newItem]);
    }
    else {
      toast.error('Selecione uma peça antes de adicionar.');
    }
  }

  function handleSaveClick() {
    setSaveButtonIsDisabled(true);

    if (!itemAdded[0]) {
      setSaveButtonIsDisabled(false);
      toast.error("Adicione alguma peça no pedido antes de salvar.");
      return;
    }

    toast.promise(
      api.put('order-items', {
        order_id: id,
        items: itemAdded,
        order: {
          item_quantity: itemQuantity,
          subtotal: subtotal,
          discount: discount,
          payment_made: paymentMade,
          cost: total
        }
      }),
      {
        pending: 'As mudanças estão sendo aplicadas...',
        success: {
          render() {
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
            setSaveButtonIsDisabled(false);
            setShow(false);
            fn(id);

            return 'Peças alteradas com sucesso!'
          }
        },
        error: {
          render() {
            setSaveButtonIsDisabled(false);

            return 'Erro ao alterar peças!';
          }
        }
      })
  }

  return <>
    <Modal show={show} size="xl" onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>
          Editar Peças - Pedido Nº {id}
        </Modal.Title>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}></button>
      </Modal.Header>

      {loadingModalData ?
        <Modal.Body className="text-center" style={{ backgroundColor: '#ECF0F5' }}>
          <Spinner animation="border" role="status" />
        </Modal.Body> :
        <Modal.Body style={{ backgroundColor: '#ECF0F5' }}>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mt-1 mb-0">Adicionar Peça</h5>

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

                    <div className="col-12 col-md-3 mb-2">
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
                    </div>

                    <div className="col-6 col-md-3 mb-2">
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
                    </div>

                    <div className="col-6 col-md-3 mb-2">
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
                    </div>

                    <div className="col-6 col-md-3 mb-2">
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
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="mb-1" htmlFor="unit-sutotal">Subtotal</label>
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
                    </div>

                    <div className="col-1 mt-0 mb-2 mt-md-1">
                      <button
                        type="button"
                        title="Adicionar"
                        className="btn btn-outline-success btn-sm pt-0 mt-2 mt-sm-4 fs-5"
                        onClick={handlePlusClick}
                      ><FaPlus /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mt-1">Peças Adicionadas</h5>

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
                      <tbody>
                        {itemAdded && itemAdded.length > 0 ? itemAdded.map((item, key) => (
                          <tr key={key}>
                            <td>{item.description}</td>
                            <td>{item.observation}</td>
                            <td className="text-center">{item.unitQuantity}</td>
                            <td className="text-center">{formatoDinheiro(item.unitCost)}</td>
                            <td className="text-center">{formatoDinheiro(item.unitDiscount)}</td>
                            <td className="text-center">{formatoDinheiro(item.unitSubtotal)}</td>
                            <td className="text-center">
                              <button type="button" onClick={() => {
                                const newItems = [] as ItemAdded[];
                                let valorRetirado = 0;
                                let qtdRetirada = 0;

                                itemAdded.forEach((value, index) => {
                                  if (index !== key)
                                    newItems.push(value);
                                  else {
                                    valorRetirado = value.unitSubtotal;
                                    qtdRetirada = value.unitQuantity;
                                  }
                                })

                                setItemAdded(newItems);

                                setItemQuantity(itemQuantity - qtdRetirada);
                                setSubtotal(subtotal - valorRetirado);
                                setTotal((subtotal - valorRetirado) - (discount + paymentMade));
                              }} className="btn btn-danger px-2 py-0 pb-1 fs-6"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg></button>
                            </td>
                          </tr>
                        ))
                          : ''}
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
                        readOnly
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

                    <div className="col-12 col-md-4 col-lg-2 mt-1">
                      <button
                        type="button"
                        className="btn btn-success mt-2 mt-sm-4"
                        onClick={handleSaveClick}
                        disabled={saveButtonIsDisabled}
                      >
                        Salvar Mudanças
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

        </Modal.Body>
      }

    </Modal>
  </>
}

export default ModalEditarPecas;