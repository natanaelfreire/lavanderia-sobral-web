import React, { useContext } from 'react';

import AuthContext from '../contexts/auth';

import SignRoutes from './SignRoutes';
import OtherRoutes from './OtherRoutes';

const Routes: React.FC = () => {
  const { signed } = useContext(AuthContext);

  return signed ? <OtherRoutes /> : <SignRoutes />;
}

export default Routes;