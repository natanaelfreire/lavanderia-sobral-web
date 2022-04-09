import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';

import api from '../../services/api';

interface Params {
  id: string;
}

interface Item {
  id: string;
  description: string;
  cost: number;
}

export default function ItemsEdit() {
  const { id } = useParams<Params>();

  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(false);

  const history = useHistory();

  useEffect(() => {
    api.get(`items/${id}`).then(response => {
      if (response.status === 200) {
        const item: Item = response.data;

        setDescription(item.description);
        setCost(Number(item.cost).toFixed(2));
      }
    });
  }, [id]);

  function handleItemsChangesSubmit(event: FormEvent) {
    event.preventDefault();
    setSaveButtonIsDisabled(true);

    if (!description) {
      toast.error('Preencha o campo Descrição.');
      setSaveButtonIsDisabled(false);
      return;
    }

    if (!cost) {
      toast.error('Preencha o campo Preço.');
      setSaveButtonIsDisabled(false);
      return;
    }

    const formatedCost = Number(cost.split(',').join('.'));

    toast.promise(api.put('items', {
      id,
      description,
      cost: formatedCost
    }), {
      pending: 'Salvando mudanças nos dados...',
      success: {
        render() {
          setSaveButtonIsDisabled(false);
          history.push('/items');

          return 'Mudanças salvas com sucesso!';
        }
      },
      error: {
        render() {
          setSaveButtonIsDisabled(false);

          return 'Erro ao salvar mudanças.';
        }
      }
    })

  }

  return (
    <div className="container">
      <h5 className="bg-primary p-1 rounded text-white bg-opacity-75">Editando valores/nome da peça... </h5>

      <div className="row">
        <div className="col-12 col-md-6 mb-2">
          <label className="mb-1" htmlFor="description">Descrição</label><br />
          <input
            id="description"
            type="text"
            maxLength={35}
            className="py-1 px-2"
            style={{
              width: '100%',
              borderColor: '#ccc',
              borderRadius: '4px',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label className="mb-1" htmlFor="cost">Preço R$</label><br />
          <input
            id="cost"
            type="number"
            className="py-1 px-2"
            style={{
              width: '100%',
              borderColor: '#ccc',
              borderRadius: '4px',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
            value={cost}
            onChange={e => setCost(e.target.value)}
            min={0}
            required
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-success"
            disabled={saveButtonIsDisabled}
            onClick={handleItemsChangesSubmit}
          >Salvar mudanças</button>
        </div>
      </div>

    </div>
  );
}