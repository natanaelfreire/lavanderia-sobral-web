import api from "../services/api";

interface OrderDisplaeyd {
  id: string;
  order_status: string;
  delivery_date: string;
  created_at: string;
  date_number: number;
  date_out_number: number;
  created_hours: number;
  customer_id: string;
}

export default async function displayOrdersProcessing(filteredOrders: OrderDisplaeyd[]) {
  const ordersDisplay = document.querySelector('.orders-display');
  if (ordersDisplay) {
    ordersDisplay.innerHTML = '';

    for (let i = 0; i < filteredOrders.length; ++i) {
      await api.get(`customers/${filteredOrders[i].customer_id}`).then(response => {
        if (response.status === 200) {
          const customerName: string = response.data.name;

          ordersDisplay.innerHTML = ordersDisplay.innerHTML + 
          `<div class="order">
            <p><span>Nº do pedido: </span>${filteredOrders[i].id}</p>
            <p><span>Cliente: </span>${customerName.toUpperCase()}</p>
            <p><span>Criado em: </span>${filteredOrders[i].created_at} ${'[' + filteredOrders[i].created_hours + ':00 - ' + (filteredOrders[i].created_hours+1) + ':00]'} </p>
            <p><span>Retirada: </span>${filteredOrders[i].delivery_date.split('-').reverse().join('/')}</p>
            <p class="bottom-order" id=${filteredOrders[i].id}><a href="/orders?orderId=${filteredOrders[i].id}"><button class="see-details">Ver detalhes</button></a> </p>
          </div>`;
        }
      });
    }
  }

  const bottomOrder = document.querySelectorAll('.bottom-order');
  bottomOrder.forEach((bottom, index) => {
  
    if (filteredOrders[index].order_status === 'Pendente') {
      const statusButton = document.createElement('button');
      statusButton.className = 'order-status-pendente';
      statusButton.textContent = 'A receber';
      statusButton.onclick = async function () {
        if (window.confirm('Mudar status do pedido para Retirado?')) await api.patch(`orders/${bottom.id}`, {
          order_status: 'Retirado'
        }).then(() => window.location.reload());
      }

      bottom.appendChild(statusButton);
    }
    else {
      const statusButton = document.createElement('button');
      statusButton.className = 'order-status-coletado';
      statusButton.textContent = 'Retirado';
      statusButton.onclick = async function () {
        if (window.confirm('Mudar status do pedido para Pendente?')) await api.patch(`orders/${bottom.id}`, {
          order_status: 'Pendente'
        }).then(() => window.location.reload());
      }

      bottom.appendChild(statusButton);
    }
  });
}