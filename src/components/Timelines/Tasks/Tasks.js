import React from 'react';
import { useOvermind } from '../../../overmind';
import Task from './Task';

import './Tasks.scss';

// function resolveConflict(data1, id) {
//   const data1Cloned = JSON.parse(JSON.stringify(data1));
//   const length = data1Cloned.length - 1;
//   const data2 = data1Cloned.find(e => e.id === id);
//   if (!data2 || !id) return data1;
//   const select_2 = data2.time;

//   // console.log(select_2);

//   for (let i = length; i >= 0; i--) {
//     const select_1 = data1Cloned[i].time;

//     if (data1Cloned[i].id === id) continue;

//     if (
//       select_1[1] > select_2[0] &&
//       select_1[0] < select_2[1] &&
//       select_1[0] < select_2[0] &&
//       select_1[1] < select_2[1]
//     ) {
//       // data2.time[1] = select_1[0];
//       data1Cloned[i].time[1] = select_2[0];
//     } else if (
//       select_1[1] > select_2[0] &&
//       select_1[0] < select_2[1] &&
//       select_1[0] > select_2[0] &&
//       select_1[1] > select_2[1]
//     ) {
//       data2.time[0] = select_2[1];
//       // data1Cloned[i].time[0] = select_2[1];
//     } else if (select_2[0] <= select_1[0] && select_1[1] <= select_2[1]) {
//       // data1Cloned.splice(i, 1);
//     } else if (select_2[0] >= select_1[0] && select_1[1] >= select_2[1]) {
//       // data1Cloned.splice(i, 1);
//     }
//   }

//   return data1Cloned;
// }

const Tasks = ({ tasks = [], timelineRef, index }) => {
  const { state } = useOvermind();
  // console.log(tasks);
  // console.log(resolveConflict(tasks, 5));
  return (
    <div className="Tasks">
      {tasks.map((task, i) => {
        return (
          <Task task={task} timelineRef={timelineRef} index={index} key={i} />
        );
      })}
    </div>
  );
};

export default Tasks;
