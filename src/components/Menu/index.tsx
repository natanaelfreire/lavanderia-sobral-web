import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiRepeat } from 'react-icons/fi';
import { IoShirtOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import Dropdown from "react-bootstrap/Dropdown";

import logo from '../../assets/images/mini-logo.png';
import './styles.css';

const Menu: React.FC = ({ children }) => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState('Carregando...');

  useEffect(() => {
    const storageUser = localStorage.getItem('@lavanderia:user');
    if (storageUser) setUser(JSON.parse(storageUser).name);
  }, []);

  function handleLogout() {
    localStorage.removeItem('@lavanderia:user');
    localStorage.removeItem('@lavanderia:token');

    history.push('/');
    window.location.reload();
  }

  return (
    <div className={`${toggleSidebar ? 'toggle-sidebar' : ''}`}>

      <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="logo d-flex align-items-center">
            <img src={logo} alt="logo" className="d-none d-sm-block" />
          </Link>
          <i className="bi bi-list toggle-sidebar-btn" onClick={() => setToggleSidebar(!toggleSidebar)}></i>
        </div>

        <nav className="header-nav ms-auto">
          <div className="d-flex align-items-center">

            <Dropdown className="nav-item dropdown" align={'end'}>
              <Dropdown.Toggle variant="none" id="dropdown-notifications" className="nav-link nav-icon d-flex align-items-center">
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number" style={{ position: 'absolute', inset: '4px 6px auto auto' }}>4</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <Link to="/notifications"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                </li>
                <Dropdown.Divider />
                <Dropdown.Item className="notification-item">
                  <i className="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Perigo! Conserte algo agora!</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Atenção!</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Algo deu certo</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="notification-item">
                  <i className="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Informação</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-footer">
                  <Link to="/notifications">Show all notifications</Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="nav-item dropdown" align={'end'}>
              <Dropdown.Toggle variant="none" id="dropdown-messages" className="nav-link nav-icon d-flex align-items-center">
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number" style={{ position: 'absolute', inset: '4px 6px auto auto' }}>3</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                  You have 3 new messages
                  <Link to="/messages"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                </li>
                <Dropdown.Divider />
                <Dropdown.Item className="message-item">
                  <Link to="/messages/1">
                    <img src="assets/img/messages-1.jpg" alt="" className="rounded-circle" />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>4 hrs. ago</p>
                    </div>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="message-item">
                  <Link to="/messages/2">
                    <img src="assets/img/messages-2.jpg" alt="" className="rounded-circle" />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>6 hrs. ago</p>
                    </div>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="message-item">
                  <Link to="/messages/3">
                    <img src="assets/img/messages-3.jpg" alt="" className="rounded-circle" />
                    <div>
                      <h4>David Muldon</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>8 hrs. ago</p>
                    </div>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-footer">
                  <Link to="/messages">Show all messages</Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="nav-item dropdown pe-3" align={'end'}>
              <Dropdown.Toggle variant="none" id="dropdown-user" className="nav-link nav-icon d-flex align-items-center">
                <i className="bi bi-person-circle"> </i>
                <span className="d-none d-md-block ps-2">{user}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#"><i className="bi bi-person"></i> Perfil</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#"><i className="bi bi-gear"></i> Configurações</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </div>
        </nav>

      </header>

      {/* <!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">

        <ul className="sidebar-nav" id="sidebar-nav">

          <li className="nav-item">
            <Link to="/create-order" className="nav-link justify-content-center border border-warning text-warning" id="btnCreateOrder">
              <i className="bi bi-plus-square"></i>
              <span>Criar Pedido</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/dashboard' ? '' : 'collapsed'}`} to="/dashboard">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <li className="nav-heading">Cadastros</li>

          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/customers' ? '' : 'collapsed'}`} to="/customers">
              <i className="bi bi-person"></i>
              <span>Clientes</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/items' ? '' : 'collapsed'}`} to="/items">
              <IoShirtOutline style={{ marginRight: '10px' }} />
              <span>Peças</span>
            </Link>
          </li>

          <li className="nav-heading">Buscas</li>

          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/processing' ? '' : 'collapsed'}`} to="/processing">
              <FiRepeat style={{ marginRight: '10px' }} />
              <span>Entradas e Saídas</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/orders' ? '' : 'collapsed'}`} to="/orders">
              <i className="bi bi-pencil-square"></i>
              <span>Pedidos</span>
            </Link>
          </li>

          <li className="nav-heading">Financeiro</li>

          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/payment' ? '' : 'collapsed'}`} to="/payment">
              <i className="bi bi-cash"></i>
              <span>Recebimentos</span>
            </Link>
          </li>

        </ul>

      </aside>

      <main id="main" className="main">
        {children}
        <ToastContainer theme="colored" />
      </main>

      {/* <div className="row flex-nowrap">
        <div className="col-2 col-sm-4 col-md-3 col-lg-2 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span className="fs-5 d-none d-sm-inline">Lavanderia Sobral</span>
            </Link>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <Link to="/create-order" className="nav-link align-middle text-warning border border-warning rounded px-3 pt-0 pb-1">
                  <i className="fs-5"><FaPlus /></i> <span className="ms-1 d-none d-sm-inline">Criar Pedido</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link align-middle px-0">
                  <i className="fs-5"><AiFillHome /></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/customers" className="nav-link align-middle px-0">
                  <i className="fs-5"><FiUsers /></i> <span className="ms-1 d-none d-sm-inline">Clientes</span>
                </Link>
              </li>
              <li>
                <Link to="/items" className="nav-link px-0 align-middle">
                  <i className="fs-5"><IoShirtOutline /></i> <span className="ms-1 d-none d-sm-inline">Peças</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" className="nav-link px-0 align-middle">
                  <i className="fs-5"><FiEdit /></i> <span className="ms-1 d-none d-sm-inline">Pedidos</span>
                </Link>
              </li>
              <li>
                <Link to="/processing" className="nav-link px-0 align-middle">
                  <i className="fs-5"><FiRepeat /></i> <span className="ms-1 d-none d-sm-inline">Entradas e Saídas</span>
                </Link>
              </li>
              <li>
                <Link to="/payment" className="nav-link px-0 align-middle">
                  <i className="fs-5"><BiMoney /></i> <span className="ms-1 d-none d-sm-inline">Não Pagos</span>
                </Link>
              </li>
              <li>
                <Link to="/financial" className="nav-link px-0 align-middle">
                  <i className="fs-5"><RiMoneyDollarCircleLine /></i> <span className="ms-1 d-none d-sm-inline">Financeiro</span>
                </Link>
              </li>
            </ul>
            <hr />
            <div className="pb-4 text-center">
              <span className="d-flex align-items-center justify-content-center text-white text-decoration-none">
                <i className="fs-4"><BiUserCircle /></i>
                <span className="d-none d-sm-inline mx-1">{user}</span>
              </span>
              <button className="btn btn-danger text-white py-0 px-1" onClick={handleLogout}>Sair</button>
            </div>
          </div>
        </div>
        
      </div> */}


    </div>
  );
}

export default Menu;