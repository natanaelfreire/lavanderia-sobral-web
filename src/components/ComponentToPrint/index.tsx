import React from 'react';
import './styles.css';

import Logo from '../../assets/images/logo-print.jpg';
import { Item, Order } from '../../utils/interfaces';

interface ItemAddedByOrderId {
  [id: string]: Item[];
}

interface Props {
  orders: Order[];
  itemAddedByOrderId: ItemAddedByOrderId;
  customer: {
    name: string;
    address: string;
    phone: string;
  }
}

export class ComponentToPrint extends React.PureComponent<Props, {}> {
  render() {
    return (
      <div className="page-print">
        <div className="first-via">
          <header>
            <div className="credencials">
              <img src={Logo} alt="logo" width="120px"/>
              <p><span>Benedita Eliene Divino Freire</span><br></br>
              Avenida John Sanford, 352 - Em frente a Santa Cruz Distribuidora<br></br>
              (88) 9911-8065,
              (88) 99740-5747</p>  
            </div>

            <p>Pedido Avulso Nº {this.props.orders[0].id} <br></br>
            {this.props.orders[0].created_at} - [{this.props.orders[0].created_hours}:00 - {this.props.orders[0].created_hours+1}:00]</p>
          </header>

          <main>
            <div className="general-print-info">
              <div className="customer-print-info">
                <p><span>Cliente: </span>{this.props.customer.name.toUpperCase()}</p>
                <p><span>Endereço: </span>{this.props.customer.address}</p>
                <p><span>Fone: </span>{this.props.customer.phone}</p>
              </div>

              <div className="order-print-info">
                <p>TOTAL A PAGAR: <span>R$ {Number(this.props.orders[0].cost).toFixed(2).split('.').join(',')}</span></p>
                <p>PAGAMENTO PRÉVIO: R$ {Number(this.props.orders[0].payment_made).toFixed(2).split('.').join(',')}</p>
                <p>DATA RETIRADA: {this.props.orders[0].delivery_date.split('-').reverse().join('/')}</p>
              </div>
            </div>

            <table className="table-print">
              <thead>
                <tr>
                  <th className="print-item">PEÇA</th>
                  <th className="print-description"></th>
                  <th className="print-observation">OBS.</th>
                  <th className="print-quantity">QTDE.</th>
                  <th className="print-unit">UNITÁRIO</th>
                  <th className="print-discount">DESC.</th>
                  <th className="print-subtotal">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {this.props.orders.map((order) => (
                    this.props.itemAddedByOrderId[order.id].map((item) => (
                      <tr key={item.item_id}>
                        <td className="print-numeric-data">{item.item_id} - </td>
                        <td>{item.description.toUpperCase()}</td>
                        <td>{item.observation}</td>
                        <td className="print-numeric-data">{Number(item.unit_quantity).toFixed(0)}</td>
                        <td className="print-numeric-data">{Number(item.unit_cost).toFixed(2).split('.').join(',')}</td>
                        <td className="print-numeric-data">{Number(item.unit_discount).toFixed(2).split('.').join(',')}</td>
                        <td className="print-numeric-data">{Number(item.unit_subtotal).toFixed(2).split('.').join(',')}</td>
                      </tr>
                    ))
                ))}
              </tbody>
            </table>
            <span>Total de peças: {this.props.orders[0].item_quantity}</span>
          </main>

          <footer>
            <p className="rules-contract">
              As partes decidem entre si que o CONTRATANTE tem o prazo máximo de 90 (noventa) dias para retirada das roupas entregues para lavagem, ao CONTRATADO. Caso isto não ocorra do prazo acima determinado, o CONTRATANTE estará ciente e de acordo com o que segue: 1º A manutenção do produto junto ao estabelecimento não configura nenhuma forma de depósito. 2º O consumidor autoriza prévia e expressamente a venda do produto para o pagamento dos serviços efetuados, tendo direito ao recebimento de eventual saldo positivo ou tendo o dever de efetuar o pagamento da diferença restante, conforme o valor apurado com a venda do produto e o seu débito. Bem como concorda que caso haja dano a peça de roupa causado pelo CONTRATADO, será pago 50% do valor de mercado da peça nova atualizado conforme comprovação de preço no mercado local. O Código de Defesa do Consumidor em seu Art. 26, inciso I. rege que: “Art. 26 – O direito de reclamar pelos vícios aparentes ou de fácil constatação caduca em: I – 30 (trinta) dias, tratando-se de fornecimento de serviço e de produtos não duráveis.” 
            </p>
            <div className="sign-contract">
              <div>
                De acordo: <br></br>
                <br></br>

                <p>__________________________</p>

                <p>{this.props.customer.name.toUpperCase()}</p>
              </div>
            </div>
          </footer>
        </div>

        <div className="second-via">
          <header>
            <div className="credencials">
            <img src={Logo} alt="logo" width="120px"/>
              <p><span>Benedita Eliene Divino Freire</span><br></br>
              Avenida John Sanford, 352 - Em frente a Santa Cruz Distribuidora<br></br>
              (88) 9911-8065,
              (88) 99740-5747</p>  
            </div>

            <p>Pedido Avulso Nº {this.props.orders[0].id} <br></br>
            {this.props.orders[0].created_at} - [{this.props.orders[0].created_hours}:00 - {this.props.orders[0].created_hours+1}:00]</p>
          </header>

          <main>
            <div className="general-print-info">
              <div className="customer-print-info">
                <p><span>Cliente: </span>{this.props.customer.name.toUpperCase()}</p>
                <p><span>Endereço: </span>{this.props.customer.address}</p>
                <p><span>Fone: </span>{this.props.customer.phone}</p>
              </div>

              <div className="order-print-info">
                <p>TOTAL A PAGAR: <span>R$ {Number(this.props.orders[0].cost).toFixed(2).split('.').join(',')}</span></p>
                <p>PAGAMENTO PRÉVIO: R$ {Number(this.props.orders[0].payment_made).toFixed(2).split('.').join(',')}</p>
                <p>DATA RETIRADA: {this.props.orders[0].delivery_date.split('-').reverse().join('/')}</p>
              </div>
            </div>

            <table className="table-print">
              <thead>
                <tr>
                  <th className="print-item">PEÇA</th>
                  <th className="print-description"></th>
                  <th className="print-observation">OBS.</th>
                  <th className="print-quantity">QTDE.</th>
                  <th className="print-unit">UNITÁRIO</th>
                  <th className="print-discount">DESC.</th>
                  <th className="print-subtotal">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {this.props.orders.map((order) => (
                    this.props.itemAddedByOrderId[order.id].map((item) => (
                      <tr key={item.item_id}>
                        <td className="print-numeric-data">{item.item_id} - </td>
                        <td>{item.description.toUpperCase()}</td>
                        <td>{item.observation}</td>
                        <td className="print-numeric-data">{Number(item.unit_quantity).toFixed(0)}</td>
                        <td className="print-numeric-data">{Number(item.unit_cost).toFixed(2).split('.').join(',')}</td>
                        <td className="print-numeric-data">{Number(item.unit_discount).toFixed(2).split('.').join(',')}</td>
                        <td className="print-numeric-data">{Number(item.unit_subtotal).toFixed(2).split('.').join(',')}</td>
                      </tr>
                    ))
                ))}
              </tbody>
            </table>
            <span>Total de peças: {this.props.orders[0].item_quantity}</span>
          </main>

          <footer>
            <p className="rules-contract">
              As partes decidem entre si que o CONTRATANTE tem o prazo máximo de 90 (noventa) dias para retirada das roupas entregues para lavagem, ao CONTRATADO. Caso isto não ocorra do prazo acima determinado, o CONTRATANTE estará ciente e de acordo com o que segue: 1º A manutenção do produto junto ao estabelecimento não configura nenhuma forma de depósito. 2º O consumidor autoriza prévia e expressamente a venda do produto para o pagamento dos serviços efetuados, tendo direito ao recebimento de eventual saldo positivo ou tendo o dever de efetuar o pagamento da diferença restante, conforme o valor apurado com a venda do produto e o seu débito. Bem como concorda que caso haja dano a peça de roupa causado pelo CONTRATADO, será pago 50% do valor de mercado da peça nova atualizado conforme comprovação de preço no mercado local. O Código de Defesa do Consumidor em seu Art. 26, inciso I. rege que: “Art. 26 – O direito de reclamar pelos vícios aparentes ou de fácil constatação caduca em: I – 30 (trinta) dias, tratando-se de fornecimento de serviço e de produtos não duráveis.” 
            </p>
            <div className="sign-contract">
              <div>
                De acordo: <br></br>
                <br></br>

                <p>__________________________</p>

                <p>{this.props.customer.name.toUpperCase()}</p>
              </div>
            </div>
          </footer>
        </div>
        
      </div>
    );
  }
}