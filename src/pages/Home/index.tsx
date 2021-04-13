import React, { useEffect } from 'react';

import Sidebar from '../../components/Sidebar';
import LogoWithoutBg from '../../assets/images/logo-removebg.png';

import './styles.css';

export default function Home() {

  useEffect(() => {
    window.location.reload();
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
