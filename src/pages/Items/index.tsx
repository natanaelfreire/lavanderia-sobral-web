import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsBookmarkPlus } from 'react-icons/bs';
import { BiSearchAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import Modal from "react-bootstrap/Modal";
import Spinner from 'react-bootstrap/Spinner';

import api from '../../services/api';

interface Item {
  id: string;
  description: string;
  cost: string;
}

export default function Items() {
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [count, setCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [idModal, setIdModal] = useState('');
  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(false);
  const [confirmDeleteIsDisabled, setConfirmDeleteIsDisabled] = useState(false);

  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [idItemModalDelete, setIdItemModalDelete] = useState('');
  const [descriptionItemModalDelete, setDescriptionItemModalDelete] = useState('');
  const [costItemModalDelete, setCostItemModalDelete] = useState('');

  useEffect(() => {
    api.get('items').then(response => {
      if (response.status === 200) {
        setItems(response.data);
        setFilteredItems(response.data);
        setLoadingData(false);
      }
    }).catch(erro => {
      toast.error('Erro ao carregar os dados.');
      setLoadingData(false);
    });
  }, [count]);

  function handleItemSubmit(event: FormEvent) {
    event.preventDefault();
    setSaveButtonIsDisabled(true);

    if (!description) {
      toast.error('Preencha o campo Descrição.');
      setSaveButtonIsDisabled(false);
      return;
    }

    if (!cost) {
      toast.error('Preencha o campo Preço.');
      setSaveButtonIsDisabled(false);
      return;
    }

    const formatedCost = Number(cost.split(',').join('.'));

    if (idModal) {
      toast.promise(api.put('items', {
        id: idModal,
        description,
        cost: formatedCost
      }), {
        pending: 'Salvando mudanças nos dados...',
        success: {
          render() {
            setCount(count + 1);
            setModalIsOpen(false);
            setSaveButtonIsDisabled(false);

            return 'Mudanças salvas com sucesso!';
          }
        },
        error: {
          render() {
            setSaveButtonIsDisabled(false);

            return 'Erro ao salvar mudanças.';
          }
        }
      })
    } else {
      toast.promise(api.post('items', {
        description,
        cost: formatedCost
      }), {
        pending: 'Salvando os dados novos...',
        success: {
          render() {
            setDescription('');
            setCost('');
            setCount(count + 1);
            setModalIsOpen(false);
            setSaveButtonIsDisabled(false);

            return 'Peça salva com sucesso!'
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

  }

  function handleOpenModal(id: string) {
    if (id) {
      setIdModal(id);

      api.get(`items/${id}`).then(response => {
        if (response.status === 200) {
          const item: Item = response.data;

          setDescription(item.description);
          setCost(Number(item.cost).toFixed(2));

          setModalIsOpen(true);
        }
      }).catch(erro => {
        toast.error('Erro ao carregar dados do cliente.');
        toast.error(erro.textMessage);
      });
    } else {
      setIdModal('');
      setDescription('');
      setCost('');

      setModalIsOpen(true);
    }
  }

  function handleDeleteItem(idModal: string, descriptionModal: string, costModal: string) {
    setModalDeleteIsOpen(true);
    setIdItemModalDelete(idModal);
    setDescriptionItemModalDelete(descriptionModal);
    setCostItemModalDelete(costModal);
  }

  function handleConfirmDelete() {
    setConfirmDeleteIsDisabled(true);

    toast.promise(api.delete(`/items/${idItemModalDelete}`),
      {
        pending: 'Salvando mudança nos dados...',
        success: {
          render() {
            setConfirmDeleteIsDisabled(false);
            setModalDeleteIsOpen(false);
            setCount(count + 1);

            return 'Peça excluída com sucesso!';
          }
        },
        error: {
          render() {
            setConfirmDeleteIsDisabled(false);

            return 'Erro ao excluir peça.';
          }
        }
      })

  }

  function handleFilterName(event: ChangeEvent<HTMLInputElement>) {
    const filterName = event.target.value.toUpperCase();
    const newFilteredItems = filterName ? items.filter(item => item.description.toUpperCase().includes(filterName)) : items;

    setFilteredItems(newFilteredItems);
  }

  return (
    <div className="">
      {/* <h5 className="bg-primary p-1 rounded text-white bg-opacity-75">CRIAR PEÇA NOVA&nbsp;<BsBookmarkPlus className="fs-6 mb-1" /></h5> */}

      <div className="pagetitle" style={{ color: "#012970" }}>
        <h4>Peças</h4>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Peças</li>
          </ol>
        </nav>
      </div>

      <div className="card">
        <div className="card-body">

          <div className="d-flex justify-content-between mb-2">
            <h5 className="card-title">Listagem</h5>
            <button className="btn btn-sm btn-primary" onClick={() => handleOpenModal('')}><i className="bi bi-plus-lg"> </i> Adicionar</button>

            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
              <Modal.Header>
                <Modal.Title>
                  {idModal ? `Editar Peça ` : 'Criar Peça '}
                  {idModal ? `#${idModal}` : <BsBookmarkPlus className="fs-5 mb-1" />}
                </Modal.Title>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalIsOpen(false)}></button>
              </Modal.Header>

              <Modal.Body>
                <div className="row">
                  <div className="col-12 mb-2">
                    <label className="mb-1" htmlFor="description">Descrição</label><br />
                    <input
                      id="description"
                      type="text"
                      maxLength={35}
                      className="py-1 px-2"
                      style={{
                        width: '100%',
                        borderColor: '#ccc',
                        borderRadius: '4px',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                      }}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <label className="mb-1" htmlFor="cost">Preço R$</label><br />
                    <input
                      id="cost"
                      type="number"
                      className="py-1 px-2"
                      style={{
                        width: '100%',
                        borderColor: '#ccc',
                        borderRadius: '4px',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                      }}
                      value={cost}
                      onChange={e => setCost(e.target.value)}
                      min={0}
                      required
                    />
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="justify-content-between">
                <button type="button" className="btn btn-secondary float-start" data-bs-dismiss="modal" onClick={() => setModalIsOpen(false)}>Fechar</button>
                <button type="button"
                  className="btn btn-success"
                  disabled={saveButtonIsDisabled}
                  onClick={handleItemSubmit}>
                  Salvar
                </button>
              </Modal.Footer>
            </Modal>
          </div>

          <div className="row">
            <div className="col-12 mb-2">
              <div className="input-group">
                <label className="input-group-text py-1 px-1" htmlFor="item-filter">Buscar&nbsp;<span><BiSearchAlt /></span></label>
                <input
                  id="item-filter"
                  type="text"
                  className="py-1 px-2"
                  style={{
                    width: '40%',
                    borderColor: '#ccc',
                    borderRadius: '4px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                  }}
                  onChange={handleFilterName}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="fw-bold">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Descrição</th>
                  <th scope="col" style={{ whiteSpace: 'nowrap' }}>Preço R$</th>
                  <th scope="col" className="text-center" style={{ width: "20%" }}>Ações</th>
                </tr>
              </thead>
              <tbody id="table-costumers-body">
                {filteredItems && filteredItems.length > 0 ? filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>{item.description}</td>
                    <td>{parseFloat(item.cost).toFixed(2).split('.').join(',')}</td>
                    <td className="text-center"><button onClick={() => handleOpenModal(item.id)} className="btn btn-sm btn-warning text-dark"> <i className="bi bi-pencil-square"></i> Editar</button> <button onClick={() => handleDeleteItem(item.id, item.description, item.cost)} className="btn btn-sm btn-danger mt-1 ms-0 mt-lg-0"><i className="bi bi-trash"></i> Excluir</button></td>
                  </tr>
                )) :
                  <tr>
                    <td className="text-center" colSpan={4}>{loadingData ? <Spinner animation="border" role="status" /> : 'Nenhuma peça encontrada.'}</td>
                  </tr>}
              </tbody>
            </table>
          </div>

          <Modal show={modalDeleteIsOpen} onHide={() => setModalDeleteIsOpen(false)} size="sm">
            <Modal.Header>
              <Modal.Title>
                Confirmar <span className="text-danger">excluir</span> peça:
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="row">
                <div className="col-12 text-center">
                  #{idItemModalDelete} - {descriptionItemModalDelete} - {parseFloat(costItemModalDelete).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 border border-top-0" disabled={confirmDeleteIsDisabled} onClick={handleConfirmDelete}><strong>Sim, excluir</strong></button>
              <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal" onClick={() => setModalDeleteIsOpen(false)}>Não</button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>
  );
}