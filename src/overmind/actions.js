import { format, addDays, subDays } from 'date-fns';
import indexedDB from './indexedDB';
import services from './services';
import fr from 'date-fns/locale/fr';

// function resolveConflict(tasks, id) {
//   const tasksCloned = JSON.parse(JSON.stringify(tasks));
//   const length = tasksCloned.length - 1;
//   const select_2 = tasksCloned.reduce(
//     (a, e) => (e.id === id ? e.time : a),
//     null
//   );

//   if (!select_2 || !id) return tasks;

//   for (let i = length; i >= 0; i--) {
//     const select_1 = tasksCloned[i].time;

//     if (tasksCloned[i].id === id) continue;

//     if (
//       select_1[1] > select_2[0] &&
//       select_1[0] < select_2[1] &&
//       select_1[0] < select_2[0] &&
//       select_1[1] < select_2[1]
//     ) {
//       tasksCloned[i].time[1] = select_2[0];
//     } else if (
//       select_1[1] > select_2[0] &&
//       select_1[0] < select_2[1] &&
//       select_1[0] > select_2[0] &&
//       select_1[1] > select_2[1]
//     ) {
//       tasksCloned[i].time[0] = select_2[1];
//     } else if (select_2[0] <= select_1[0] && select_1[1] <= select_2[1]) {
//       tasksCloned.splice(i, 1);
//     } else if (select_2[0] >= select_1[0] && select_1[1] >= select_2[1]) {
//       tasksCloned.splice(i, 1);
//     }
//   }

//   return tasksCloned;
// }

export const newTask = async ({ state }, { task, index }) => {
  // const { tasks } = state.tasks[index];
  // const id = 9999;
  const newTask = {
    date: format(state.week[index], 'yyyy-MM-dd', { locale: fr }),
    ...task,
  };

  // const test = resolveConflict(tasks, newTask);

  // state.tasks[index].tasks = [...test, newTask];

  // const test = resolveConflict(tasks, [timeStart, timeEnd]);

  const id = await indexedDB('tasks').add(newTask);
  state.tasks[index].tasks.push({ id, ...newTask });
};

export const updateTask = (
  { state },
  { id, index, timeStart, timeEnd, save }
) => {
  const { tasks } = state.tasks[index];

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

  // if (save) indexedDB('options').update({ text: 'okok' });
  if (save) indexedDB('tasks').update(newTasks);
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
  // const id = await indexedDB('clients').add(client);
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
  console.log('cccc');
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
