import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiRepeat } from 'react-icons/fi';
import { IoShirtOutline } from 'react-icons/io5';
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
      </main>

    </div>
  );
}

export default Menu;