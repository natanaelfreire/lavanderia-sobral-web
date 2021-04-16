import api from "../services/api";

interface Item {
  id: string;
  description: string;
  cost: number;
}

export default function displayContentItems(content: Item[]) {
  const displayItems = document.getElementsByClassName('display-items')[0];

  displayItems.innerHTML = 
  `<div class="head-table-items">
    <p class="item-code">Código</p>
    <p class="item-description">Descrição</p>
    <p class="item-cost">Preço</p>
    <p class="item-actions-head">Ações</p>
  </div>`;

  if (content.length === 0) {
    return displayItems.innerHTML += `<br></br><p>Carregando...</p>`;
  }

  content.forEach(item => {
    displayItems.innerHTML = displayItems.innerHTML + 
    `<div class="body-table-items" id=${item.id}>
      <input class="item-code" value=${item.id} readonly></input>
      <p class="item-description">${item.description}</p>
      <input class="item-cost" value=${Number(item.cost).toFixed(2).split('.').join(',')} readonly></input>
      <p class="item-actions" id=${item.id}>
        <a href="/items-edit/${item.id}"><button type="button">Editar</button></a>
      </p>
    </div>`;
  });

  const displayedItemActions = document.getElementsByClassName('item-actions');
  Array.from(displayedItemActions).forEach(element => {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.type = 'button';
    deleteButton.onclick = async function () {
      await api.delete(`/items/${element.id}`).then(response => {
        if (response.status === 204)
          window.location.reload();
      });
    }

    element.appendChild(deleteButton);
  })
}