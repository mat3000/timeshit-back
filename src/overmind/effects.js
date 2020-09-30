import services from './services';
import { format, addDays, startOfWeek } from 'date-fns';
import fr from 'date-fns/locale/fr';

export const getOptions = async () => {
  const options = await services('options').getAll();
  return options || {};
};

export const getColors = () => {
  return Promise.resolve([
    '#8a3636',
    '#36898a',
    '#cba321',
    '#012e5a',
    '#af8989',
    '#4e4e4e',
    '#4a8a36',
  ]);
};

export const getDates = (date, week) => {
  const weekIndex = format(date, 'w', { locale: fr });
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const datesOfTheWeek = week.map((e, i) => addDays(monday, i));
  return { weekIndex, datesOfTheWeek };
};

export const getTasksByWeek = async (datesOfTheWeek) => {
  const rawTasks = datesOfTheWeek.map((date) =>
    services('tasks').getByDate(format(date, 'yyyy-MM-dd', { locale: fr }))
  );

  const tasks = await Promise.all(rawTasks);
  return tasks.map((e) => ({
    tasks: e ? Object.entries(e).map(([id, val]) => ({ ...val, id })) : [],
  }));

  /* 
  [
    {
      tasks: [
        {
          time: [9.5, 11.75],
          clientId: 1,
          description: 'coucou',
          consider: false,
        },
      ],
    },
  ]
  */
};

export const getClients = async (clientId) => {
  const rawClients = await services('clients').getAll();
  const clients = Object.entries(rawClients).map(([id, value]) => ({
    ...value,
    id,
  }));

  return [
    {
      id: 0,
      label: 'Absence',
      color: '#CCC',
      description: 'Congés, arrêt maladie, etc...',
      consider: true,
      holiday: true,
    },
    ...clients,
  ];
};
