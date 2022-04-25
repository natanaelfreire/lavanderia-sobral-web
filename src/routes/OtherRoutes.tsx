import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '../pages/Home';
import CreateOrder from '../pages/CreateOrder';
import Customers from '../pages/Customers';
import Items from '../pages/Items';
import Orders from '../pages/Orders';
import Processing from '../pages/Processing';
import Menu from '../components/Menu';
import CustomerPendencies from '../pages/CustomerPendencies';
import OrderById from '../pages/OrderById';
import PrintOrder from '../components/PrintOrder';
import Receipts from '../pages/Receipts';

export default function OtherRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/download" exact component={PrintOrder} />
        <Menu>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/create-order" component={CreateOrder} />
            <Route path="/customers" exact component={Customers} />
            <Route path="/customers/pendencies/:id" component={CustomerPendencies} />
            <Route path="/items" component={Items} />
            <Route path="/orders" exact component={Orders} />
            <Route path="/orders/:id" component={OrderById} />
            <Route path="/receipts" component={Receipts} />
            <Route path="/processing" component={Processing} />
          </Switch>
        </Menu>
      </Switch>

    </BrowserRouter>
  );
}