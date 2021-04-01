import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import CreateOrder from './pages/CreateOrder';
import Customers from './pages/Customers';
import Items from './pages/Items';
import CustomerEdit from './pages/CustomersEdit';
import ItemsEdit from './pages/ItemsEdit';
import Orders from './pages/Orders';
import Payment from './pages/Payment';
import MakePayment from './pages/MakePayment';
import Processing from './pages/Processing';
import DownloadPdf from './pages/DownloadPdf';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/create-order" component={CreateOrder} />
        <Route path="/customers" component={Customers} />
        <Route path="/items" component={Items} />
        <Route path="/customers-edit/:id" component={CustomerEdit} />
        <Route path="/items-edit/:id" component={ItemsEdit} />
        <Route path="/orders" component={Orders} />
        <Route path="/payment" component={Payment} />
        <Route path="/make-payment/:id" component={MakePayment} />
        <Route path="/processing" component={Processing} />
        <Route path="/download" component={DownloadPdf} />
      </Switch>
    </BrowserRouter>
  )
}