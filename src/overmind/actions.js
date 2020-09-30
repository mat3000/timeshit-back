import { format, addDays, subDays } from 'date-fns';
import services from './services';
import fr from 'date-fns/locale/fr';

export const newTask = async ({ state }, { task, index }) => {
  const newTask = {
    date: format(state.week[index], 'yyyy-MM-dd', { locale: fr }),
    ...task,
  };
  const id = await services('tasks').save(newTask);
  state.tasks[index].tasks.push({ id, ...newTask });
};

export const updateTask = (
  { state },
  { id, index, timeStart, timeEnd, save }
) => {
  const { tasks } = state.tasks[index];

  const newTask = tasks.find((task) => task.id === id);
  const newTasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        time: [timeStart, timeEnd],
      };
    }
    return { ...task, time: [...task.time] };
  });

  state.tasks[index].tasks = newTasks;

  if (save) services('tasks').save(id, newTask);
};

export const setSelect = (
  { state },
  { index, timeStart, timeEnd, percentStart, percentEnd }
) => {
  state.select = {
    index,
    timeStart,
    timeEnd,
    percentStart,
    percentEnd,
  };
};

export const resetSelect = ({ state }) => {
  state.select = {
    index: -1,
    timeStart: null,
    timeEnd: null,
    percentStart: null,
    percentEnd: null,
  };
};

export const selectTask = ({ state }, id) => {
  state.taskSelected = id;
};

export const newTaskStatus = ({ state }, status) => {
  state.newTaskStatus = status;
};

export const newClient = async ({ state }, client) => {
  const id = services('clients').save(client);
  const newClient = { id, ...client };

  state.clients.push(newClient);

  return newClient;
};

export const nextWeek = async ({ state, actions, effects }) => {
  actions.resetSelect();

  const { weekIndex, datesOfTheWeek } = effects.getDates(
    addDays(state.week[0], 7),
    state.options.week
  );

  const tasks = await effects.getTasksByWeek(datesOfTheWeek);

  state.tasks = tasks;
  state.weekIndex = weekIndex;
  state.week = datesOfTheWeek;
};

export const previousWeek = async ({ state, actions, effects }) => {
  actions.resetSelect();

  const { weekIndex, datesOfTheWeek } = effects.getDates(
    subDays(state.week[0], 7),
    state.options.week
  );

  const tasks = await effects.getTasksByWeek(datesOfTheWeek);

  state.tasks = tasks;
  state.weekIndex = weekIndex;
  state.week = datesOfTheWeek;
};

export const updateOption = ({ state }, { label, value }) => {
  state.options[label] = value;
  services('options').save(label, value);
};

export const toggleOptionsStatus = ({ state }) => {
  state.options.status = !state.options.status;
};
