import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Spinner from 'react-bootstrap/Spinner';
import api from "../../services/api"

import Logo from '../../assets/images/logo-print.jpg';
import { useLocation } from "react-router-dom";

type OrderResponse = {
  id: number,
  customer: string | null,
  payment_status: string,
  order_status: string,
  delivery_date: string,
  item_quantity: number,
  cost: string,
  created_at: string,
  created_hours: number,
  customer_id: number,
  payment_made: string
}

type OrderItemResponse = {
  item_id: string,
  description: string,
  observation: string,
  unit_quantity: string,
  unit_cost: string,
  unit_discount: string,
  unit_subtotal: string
}

type CustomerResponse = {
  name: string;
  phone: string;
  address: string;
}

type OrderPrintResponse = {
  order: OrderResponse,
  items: OrderItemResponse[],
  customer: CustomerResponse
}

const PrintOrder: React.FC = () => {
  const [data, setData] = useState<OrderPrintResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const search = useLocation().search;
  const searchCustomerId = new URLSearchParams(search).get('customerId');
  const searchOrderId = new URLSearchParams(search).get('orderId');

  useEffect(() => {
    if (searchCustomerId || searchOrderId) {
      api.get<OrderPrintResponse>('orders', {
        params: {
          customerId: searchCustomerId,
          orderId: searchOrderId
        }
      })
        .then((response: any) => {
          if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            setTimeout(() => {
              window.print();
            }, 1000)
          }
          else {
            toast.error(response.response?.data)
          }
        })
    }
    else {
      window.location.href = '/';
    }

  }, [searchCustomerId, searchOrderId]);

  function formatoDinheiro(value: string) {
    return value.replace('.', ',');
  }

  return <>
    {data && data.length > 0 ? data.map((dados, key) => (
      <div key={key} style={{ fontSize: '10px', margin: 0, padding: 0, pageBreakAfter: 'always' }}>
        <div style={{ paddingBottom: '10px', borderBottom: '1px dashed black' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <img src={Logo} alt="logo" width="120px" />
              <div>
                <span style={{ fontWeight: 'bold' }}>Benedita Eliene Divino Freire</span><br></br>
                <span>Avenida John Sanford, 352 - Em frente a Santa Cruz Distribuidora</span><br></br>
                <span>(88) 3614-5957, (88) 9 9333-1150</span>
              </div>
            </div>

            <div>
              <span>Pedido Avulso N?? {dados.order.id}</span> <br></br>
              <span>{dados.order.created_at} - [{dados.order.created_hours}:00 - {dados.order.created_hours + 1}:00]</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <table style={{ fontSize: '10px', border: 'none', marginTop: '5px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}><b>Cliente:</b></td>
                    <td style={{ padding: 0, paddingLeft: '5px' }}>{dados.customer.name.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Endere??o:</b></td>
                    <td style={{ padding: 0, paddingLeft: '5px' }}>{dados.customer.address}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Telefone:</b></td>
                    <td style={{ padding: 0, paddingLeft: '5px' }}>{dados.customer.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <table style={{ fontSize: '10px', border: 'none', marginTop: '-10px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}><b>TOTAL A PAGAR:</b></td>
                    <td style={{ padding: 0, fontSize: '18px', textAlign: 'right' }}><b>{parseFloat(dados.order.cost).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b></td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Pagamento Pr??vio:</b></td>
                    <td style={{ padding: 0, textAlign: 'right' }}>{parseFloat(dados.order.payment_made).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Data Retirada:</b></td>
                    <td style={{ padding: 0, textAlign: 'right' }}>{dados.order.delivery_date.split('-').reverse().join('/')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '10px', border: 'none', marginTop: '7px' }}>
            <thead>
              <tr style={{ fontWeight: 'bold' }}>
                <th style={{ padding: '1px' }}>PE??A</th>
                <th style={{ padding: '1px' }}>OBS.</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>QTDE.</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>UNIT??RIO</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>DESC.</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {
                dados.items && dados.items.length > 0 ? dados.items.map((item, key) =>
                (
                  <tr key={key}>
                    <td style={{ padding: '1px' }}>{item.description.toUpperCase()}</td>
                    <td style={{ padding: '1px' }}>{item.observation.toUpperCase()}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{parseInt(item.unit_quantity).toFixed(0)}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{formatoDinheiro(item.unit_cost)}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{formatoDinheiro(item.unit_discount)}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{formatoDinheiro(item.unit_subtotal)}</td>
                  </tr>
                )
                )
                  :
                  <tr>Nenhum item encontrado</tr>
              }
            </tbody>
          </table>
          <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
            <span>Total de pe??as: {dados.order.item_quantity}</span>
          </div>

          <div style={{ marginTop: '10px', fontSize: '8px', display: 'flex' }}>
            <div style={{ width: '80%', marginRight: '5px' }}>
              As partes decidem entre si que o CONTRATANTE tem o prazo m??ximo de 90 (noventa) dias para retirada das roupas entregues para lavagem, ao CONTRATADO. Caso isto n??o ocorra, o CONTRATANTE estar?? ciente e de acordo com o que segue: 1?? A manuten????o do produto junto ao estabelecimento n??o configura nenhuma forma de dep??sito. 2?? O consumidor autoriza pr??via e expressamente a venda do produto para o pagamento dos servi??os efetuados, tendo direito ao recebimento de eventual saldo positivo ou tendo o dever de efetuar o pagamento da diferen??a restante, conforme o valor apurado com a venda do produto e o seu d??bito. Bem como concorda que caso haja dano a pe??a de roupa causado pelo CONTRATADO, ser?? pago 50% do valor de mercado da pe??a nova atualizado conforme comprova????o de pre??o no mercado local. Consultar o C??digo de Defesa do Consumidor em seu Art. 26, inciso I.
            </div>
            <div>
              <div>
                <div style={{ paddingBottom: '25px', borderBottom: '1px solid black' }}>De acordo:</div>

                <p>{dados.customer.name.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <img src={Logo} alt="logo" width="120px" />
              <div>
                <span style={{ fontWeight: 'bold' }}>Benedita Eliene Divino Freire</span><br></br>
                <span>Avenida John Sanford, 352 - Em frente a Santa Cruz Distribuidora</span><br></br>
                <span>(88) 3614-5957, (88) 9 9333-1150</span>
              </div>
            </div>

            <div>
              <span>Pedido Avulso N?? {dados.order.id}</span> <br></br>
              <span>{dados.order.created_at} - [{dados.order.created_hours}:00 - {dados.order.created_hours + 1}:00]</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <table style={{ fontSize: '10px', border: 'none', marginTop: '5px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}><b>Cliente:</b></td>
                    <td style={{ padding: 0, paddingLeft: '5px' }}>{dados.customer.name.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Endere??o:</b></td>
                    <td style={{ padding: 0, paddingLeft: '5px' }}>{dados.customer.address}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Telefone:</b></td>
                    <td style={{ padding: 0, paddingLeft: '5px' }}>{dados.customer.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <table style={{ fontSize: '10px', border: 'none', marginTop: '-10px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0 }}><b>TOTAL A PAGAR:</b></td>
                    <td style={{ padding: 0, fontSize: '18px', textAlign: 'right' }}><b>{formatoDinheiro(dados.order.cost)}</b></td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Pagamento Pr??vio:</b></td>
                    <td style={{ padding: 0, textAlign: 'right' }}>{formatoDinheiro(dados.order.payment_made)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}><b>Data Retirada:</b></td>
                    <td style={{ padding: 0, textAlign: 'right' }}>{dados.order.delivery_date.split('-').reverse().join('/')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '10px', border: 'none', marginTop: '7px' }}>
            <thead>
              <tr style={{ fontWeight: 'bold' }}>
                <th style={{ padding: '1px' }}>PE??A</th>
                <th style={{ padding: '1px' }}>OBS.</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>QTDE.</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>UNIT??RIO</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>DESC.</th>
                <th style={{ width: '10%', textAlign: 'center', padding: '1px' }}>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {
                dados.items && dados.items.length > 0 ? dados.items.map((item, key) =>
                (
                  <tr key={key}>
                    <td style={{ padding: '1px' }}>{item.description.toUpperCase()}</td>
                    <td style={{ padding: '1px' }}>{item.observation.toUpperCase()}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{parseInt(item.unit_quantity).toFixed(0)}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{formatoDinheiro(item.unit_cost)}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{formatoDinheiro(item.unit_discount)}</td>
                    <td style={{ textAlign: 'center', padding: '1px' }}>{formatoDinheiro(item.unit_subtotal)}</td>
                  </tr>
                )
                )
                  :
                  <tr>Nenhum item encontrado</tr>
              }
            </tbody>
          </table>
          <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
            <span>Total de pe??as: {dados.order.item_quantity}</span>
          </div>

          <div style={{ marginTop: '10px', fontSize: '8px', display: 'flex' }}>
            <div style={{ width: '80%', marginRight: '5px' }}>
              As partes decidem entre si que o CONTRATANTE tem o prazo m??ximo de 90 (noventa) dias para retirada das roupas entregues para lavagem, ao CONTRATADO. Caso isto n??o ocorra, o CONTRATANTE estar?? ciente e de acordo com o que segue: 1?? A manuten????o do produto junto ao estabelecimento n??o configura nenhuma forma de dep??sito. 2?? O consumidor autoriza pr??via e expressamente a venda do produto para o pagamento dos servi??os efetuados, tendo direito ao recebimento de eventual saldo positivo ou tendo o dever de efetuar o pagamento da diferen??a restante, conforme o valor apurado com a venda do produto e o seu d??bito. Bem como concorda que caso haja dano a pe??a de roupa causado pelo CONTRATADO, ser?? pago 50% do valor de mercado da pe??a nova atualizado conforme comprova????o de pre??o no mercado local. Consultar o C??digo de Defesa do Consumidor em seu Art. 26, inciso I.
            </div>
            <div>
              <div>
                <div style={{ paddingBottom: '25px', borderBottom: '1px solid black' }}>De acordo:</div>

                <p>{dados.customer.name.toUpperCase()}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    )) :
      loading ?
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner animation="border" role="status" />
        </div> :
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>
            <p>Nada por aqui</p>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => window.location.href = '/'}>Voltar</button>
          </div>
        </div>}
  </>
}

export default PrintOrder;