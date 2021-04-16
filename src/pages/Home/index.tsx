import Sidebar from '../../components/Sidebar';
import LogoWithoutBg from '../../assets/images/logo-removebg.png';

import './styles.css';
import { useEffect } from 'react';
import api from '../../services/api';

export default function Home() {
  useEffect(() => {
    const storageUser = localStorage.getItem('@lavanderia:user');

    async function pingApi(u: string) {
      api.post('session', {
        user: u
      }).then(response => {
        if (response.status === 200) {
          console.log('Logado!')
        }
      });
    }

    if (storageUser) {
      const user = JSON.parse(storageUser).name;

      pingApi(user);
    }
  }, []);

  return (
    <div className="page-home">

      <Sidebar />

      <div className="main">
        <img src={LogoWithoutBg} alt="logo" />
      </div>
    </div>
  );
}
