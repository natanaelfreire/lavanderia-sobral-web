import LogoWithoutBg from '../../assets/images/logo-removebg.png';

import './styles.css';

export default function Home() {
  return (
    <div className="page-home">
      <div className="col col-md-6 mx-auto">
        <img className="w-100" src={LogoWithoutBg} alt="logo" />
      </div>
    </div>
  );
}
