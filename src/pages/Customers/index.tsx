import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from 'react-bootstrap/Spinner';

import api from '../../services/api';

type DataResponseDelete = {
  data: {
    response: {
      data: string;
    }
  }
}

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function Customers() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [count, setCount] = useState(0);

  const [loadingData, setLoadingData] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [idModal, setIdModal] = useState('');
  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(false);
  const [confirmDeleteIsDisabled, setConfirmDeleteIsDisabled] = useState(false);

  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [idModalDelete, setIdModalDelete] = useState('');
  const [nomeModalDelete, setNomeModalDelete] = useState('');

  const history = useHistory();

  useEffect(() => {
    api.get('customers').then(response => {
      if (response.status === 200) {
        const invertedCustomers = response.data.reverse();
        setCustomers(invertedCustomers);
        setFilteredCustomers(invertedCustomers);
        setLoadingData(false);
      }
    }).catch(erro => {
      toast.error('Erro ao carregar os dados.');
      setLoadingData(false);
    })
  }, [count]);

  function handleSearchName(event: ChangeEvent<HTMLInputElement>) {
    const searchName = event.target.value.toUpperCase();
    const newFilteredCustomers = searchName ? customers.filter((customer) => customer.name.toUpperCase().includes(searchName)) : customers;

    setFilteredCustomers(newFilteredCustomers);
  }

  function handleCustomerSubmit(event: FormEvent) {
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

    if (idModal) {
      toast.promise(api.put('customers', {
        id: idModal,
        name,
        phone,
        address,
      }), {
        pending: 'Salvando as mudanças...',
        success: {
          render() {
            setCount(count + 1);
            setModalIsOpen(false);
            setSaveButtonIsDisabled(false);

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
    } else {
      toast.promise(api.post('customers', {
        name,
        address,
        phone,
      }), {
        pending: 'Salvando os dados novos...',
        success: {
          render() {
            setName('');
            setAddress('');
            setPhone('');
            setCount(count + 1);
            setModalIsOpen(false);
            setSaveButtonIsDisabled(false);

            return 'Cliente salvo com sucesso!';
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

      api.get(`customers/${id}`).then(response => {
        if (response.status === 200) {
          const customer: Customer = response.data;

          setName(customer.name);
          setAddress(customer.address);
          setPhone(customer.phone);

          setModalIsOpen(true);
        }
      }).catch(erro => {
        toast.error('Erro ao carregar dados do cliente.');
        toast.error(erro.textMessage);
      });
    } else {
      setIdModal('');
      setName('');
      setAddress('');
      setPhone('');

      setModalIsOpen(true);
    }
  }

  function handleDeleteCustomer(id: string, name: string) {
    setModalDeleteIsOpen(true);
    setIdModalDelete(id);
    setNomeModalDelete(name);
  }

  function handleConfirmDelete() {
    setConfirmDeleteIsDisabled(true);

    toast.promise(api.delete(`/customers/${idModalDelete}`),
      {
        pending: 'Salvando mudança nos dados...',
        success: {
          render() {
            setConfirmDeleteIsDisabled(false);
            setModalDeleteIsOpen(false);
            setCount(count + 1);

            return 'Cliente excluído com sucesso!';
          }
        },
        error: {
          render({ data }: DataResponseDelete) {
            setConfirmDeleteIsDisabled(false);

            return data.response.data;
          }
        }
      })

  }

  return (
    <div className="">
      <div className="pagetitle" style={{ color: "#012970" }}>
        <h4>Clientes</h4>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Clientes</li>
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
                  {idModal ? `Editar Cliente ` : 'Criar Cliente '}
                  {idModal ? `#${idModal}` : <i className="bi bi-person-plus"> </i>}
                </Modal.Title>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalIsOpen(false)}></button>
              </Modal.Header>

              <Modal.Body>
                <div className="row">
                  <div className="col-12 mb-2">
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

                  <div className="col-12 mb-2">
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

                  <div className="col-12 mb-2">
                    <label className="mb-1" htmlFor="phone">Telefone</label><br />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="DDD 000000000"
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
                </div>
              </Modal.Body>

              <Modal.Footer className="justify-content-between">
                <button type="button" className="btn btn-secondary float-start" data-bs-dismiss="modal" onClick={() => setModalIsOpen(false)}>Fechar</button>
                <button type="button"
                  className="btn btn-success"
                  disabled={saveButtonIsDisabled}
                  onClick={handleCustomerSubmit}>
                  Salvar
                </button>
              </Modal.Footer>
            </Modal>
          </div>

          <div className="row">
            <div className="col-12 mb-2">
              <div className="input-group">
                <label className="input-group-text py-1 px-1" htmlFor="search-name">Buscar&nbsp;<span><BiSearchAlt /></span></label>
                <input
                  id="search-name"
                  type="text"
                  className="py-1 px-2"
                  style={{
                    width: '40%',
                    borderColor: '#ccc',
                    borderRadius: '4px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                  }}
                  onChange={handleSearchName}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive" style={{ minHeight: '250px' }}>
            <table className="table table-striped table-bordered" id="tabelaClientes">
              <thead className="fw-bold">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Endereço</th>
                  <th scope="col">Telefone</th>
                  <th scope="col" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody id="table-costumers-body">
                {filteredCustomers && filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="fw-bold">{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.address}</td>
                    <td>{customer.phone}</td>
                    <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" title="Ações">
                          Ações
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => history.push(`/customers/pendencies/${customer.id}`, {name: customer.name})}><i className="bi bi-currency-dollar"></i> Pendências</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleOpenModal(customer.id)}><i className="bi bi-pencil-square"></i> Editar</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDeleteCustomer(customer.id, customer.name)}><i className="bi bi-trash"></i> Excluir</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                )) :
                  <tr>
                    <td className="text-center" colSpan={5}>{loadingData ? <Spinner animation="border" role="status" /> : 'Nenhum cliente encontrado.'}</td>
                  </tr>}
              </tbody>
            </table>
          </div>

          <Modal show={modalDeleteIsOpen} onHide={() => setModalDeleteIsOpen(false)}>
            <Modal.Header>
              <Modal.Title>
                Tem certeza que deseja <span className="text-danger">EXCLUIR</span> este cliente?
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="row">
                <div className="col-12 text-center">
                  #{idModalDelete} - {nomeModalDelete}
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