import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '../pages/Home';
import CreateOrder from '../pages/CreateOrder';
import Customers from '../pages/Customers';
import Items from '../pages/Items';
import CustomerEdit from '../pages/CustomersEdit';
import ItemsEdit from '../pages/ItemsEdit';
import Orders from '../pages/Orders';
import Payment from '../pages/Payment';
import MakePayment from '../pages/MakePayment';
import Processing from '../pages/Processing';
import DownloadPdf from '../pages/DownloadPdf';
import OrderEdit from '../pages/OrdersEdit';
import Menu from '../components/Menu';
import CustomerPendencies from '../pages/CustomerPendencies';
import OrderById from '../pages/OrderById';

export default function OtherRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/download" exact component={DownloadPdf} />
        <Menu>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/Menu" component={Menu} />
            <Route path="/create-order" component={CreateOrder} />
            <Route path="/customers" exact component={Customers} />
            <Route path="/customers/pendencies/:id" component={CustomerPendencies} />
            <Route path="/items" component={Items} />
            <Route path="/customers-edit/:id" component={CustomerEdit} />
            <Route path="/items-edit/:id" component={ItemsEdit} />
            <Route path="/orders" exact component={Orders} />
            <Route path="/orders/:id" component={OrderById} />
            <Route path="/orders-edit/:id" component={OrderEdit} />
            <Route path="/payment" component={Payment} />
            <Route path="/make-payment/:id" component={MakePayment} />
            <Route path="/processing" component={Processing} />

          </Switch>
        </Menu>
      </Switch>

    </BrowserRouter>
  );
}