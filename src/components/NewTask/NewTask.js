import React, { useState, useRef } from 'react';
import Form, { Autocomplete, Checkbox, Textarea } from '../Form';
import { useOvermind } from '../../overmind';
import './NewTask.scss';

const FormNewClient = ({ label, validate, cancel }) => {
  const { state, actions } = useOvermind();
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [consider, setConsider] = useState(true);

  return (
    <div className="FormNewClient">
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Couleur :</span>
        {state.colors.map((c, i) => (
          <div
            key={i}
            onClick={() => setColor(c)}
            className={`FormNewClient__color ${color === c ? '-current' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </label>
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Description :</span>
        <textarea
          onChange={({ target }) => setDescription(target.value)}
          className="FormNewClient__textarea"
          rows="5"
        />
      </label>
      <label className="FormNewClient__group">
        <input
          type="checkbox"
          checked={consider}
          onChange={({ target }) => setConsider(target.checked)}
          className="FormNewClient__checkbox"
        />
        <span className="FormNewClient__labelCheckbox">
          Prendre en compte :
        </span>
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          actions
            .newClient({
              label,
              color,
              description,
              consider,
            })
            .then((newClient) => validate(newClient));
        }}
      >
        Valider
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          cancel();
        }}
      >
        Annuler
      </button>
    </div>
  );
};

const NewTask = () => {
  const formApi = useRef();
  const { state, actions } = useOvermind();
  const [disabled, setDisabled] = useState(true);

  /*  order by label */
  const clients = [...state.clients].sort((a, b) => {
    const bandA = a.label.toUpperCase();
    const bandB = b.label.toUpperCase();
    let comparison = 0;
    if (a.id === 0) {
      comparison = 1;
    } else if (b.id === 0) {
      comparison = -1;
    } else if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  });

  return (
    <>
      <div
        className={`NewTask ${state.select.index >= 0 ? '-show' : ''}`}
        style={{
          // top: `${top + height / 2}%`,
          // left: `calc(${20 * selectIndex}% + 20%)`,
          top: `calc(${state.select.percentStart}% - 10px)`,
          left: `calc(${20 * (state.select.index + 1)}%)`,
        }}
      >
        <Form
          onSubmit={(formData) => {
            // console.log({ ...formData });
            actions.newTask({
              task: {
                time: [state.select.timeStart, state.select.timeEnd],
                clientId: formData.client.id,
                description: formData.description || '',
                consider: formData.consider,
              },
              index: state.select.index,
            });
            actions.resetSelect();
          }}
          getApi={(e) => {
            formApi.current = e;
          }}
        >
          <Autocomplete
            name="client"
            options={clients}
            placeholder="Client..."
            label="Client"
            newOption={(label, validate, cancel) => (
              <FormNewClient
                label={label}
                validate={validate}
                cancel={cancel}
              />
            )}
            onChange={() => {
              if (formApi.current.getValue('client').value.id !== -1) {
                setDisabled(false);
              } else {
                setDisabled(true);
              }
              const consider = !!formApi.current.getValue('client').value
                .consider;
              formApi.current.setValue('consider', consider);
            }}
            // format={data => {
            //   console.log(data);
            //   return data.id;
            // }}
          />
          <Textarea
            name="description"
            label="Description"
            rows="5"
            disabled={disabled}
          />
          <Checkbox
            name="consider"
            label="Prise en compte"
            value={true}
            disabled={disabled}
          />
          {/* <button type="submit" disabled={disabled}>
            Démarrer...
          </button> */}
          <button type="submit" disabled={disabled}>
            Valider
          </button>
          <button
            type="button"
            onClick={() => {
              actions.resetSelect();
            }}
          >
            Annuler
          </button>
        </Form>
      </div>
    </>
  );
};

export default NewTask;
