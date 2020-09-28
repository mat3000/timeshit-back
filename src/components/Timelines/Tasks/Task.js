import React from 'react';
import { useOvermind } from '../../../overmind';
import {
  useToolsStep,
  useConvertTimeToHour,
  useEvent,
  useCumulativeOffset,
} from '../../hooks';

// import './Task.scss';

function resolveConflict(tasks, time, id) {
  const time2 = time;
  let newTime = [...time];

  tasks.forEach(task => {
    const time1 = task.time;
    if (task.id === id) return;

    if (
      time1[1] > time2[0] &&
      time1[0] < time2[1] &&
      time1[0] < time2[0] &&
      time1[1] < time2[1]
    ) {
      newTime[0] = time1[1];
    } else if (
      time1[1] > time2[0] &&
      time1[0] < time2[1] &&
      time1[0] > time2[0] &&
      time1[1] > time2[1]
    ) {
      newTime[1] = time1[0];
      // } else if (time2[0] <= time1[0] && time1[1] <= time2[1]) {
      //   // console.log('remove1');
      //   newTime = [0, 0];
      // } else if (time2[0] >= time1[0] && time1[1] >= time2[1]) {
      //   // console.log('remove2');
      //   newTime = [0, 0];
    }
  });

  return newTime;
}

const Task = ({ task, timelineRef, index }) => {
  const { state, actions } = useOvermind();
  const convertTimeToHour = useConvertTimeToHour();
  const cumulativeOffset = useCumulativeOffset();
  const {
    getPercentByTime,
    getPercentByTimeEnd,
    getLimitByPercent,
  } = useToolsStep(index);
  const event = useEvent();

  const start = getPercentByTime(task.time[0]);
  const end = getPercentByTime(task.time[1]);
  const client = state.clients.reduce(
    (a, c) => (c.id === task.clientId ? c : a),
    {}
  );

  const update = (
    top,
    height,
    downPageY,
    movePageY = downPageY,
    type,
    save = false
  ) => {
    const initialTop = getPercentByTime(task.time[0]);
    const initialBottom = getPercentByTimeEnd(task.time[1]);
    const cursorStart = ((downPageY - top) / height) * 100;
    const cursorTop = ((movePageY - top) / height) * 100;

    const newTop = type === 'top' ? cursorTop : initialTop;
    const newBottom = type === 'bottom' ? cursorTop : initialBottom;

    const [tStart, tEnd] = getLimitByPercent(
      type === 'move' ? newTop + (cursorTop - cursorStart) : newTop,
      type === 'move' ? newBottom + (cursorTop - cursorStart) : newBottom
    );

    const [timeStart, timeEnd] = resolveConflict(
      state.tasks[index].tasks,
      [tStart, tEnd],
      task.id
    );

    actions.updateTask({
      id: task.id,
      index,
      timeStart,
      timeEnd,
      save,
    });
  };

  const mouseMove = (top, height, downPageY, eventMove, type) => {
    eventMove.preventDefault();
    const movePageY = eventMove.pageY;
    update(top, height, downPageY, movePageY, type);
  };

  const mouseup = (top, height, downPageY, eventEnd, type) => {
    eventEnd.preventDefault();
    event.removeEventListener('mousemove.timeline', () => mouseMove());
    event.removeEventListener('mouseup.timeline', () => mouseup());

    const movePageY = eventEnd.pageY;

    update(top, height, downPageY, movePageY, type, true);
    actions.selectTask();
  };

  const mouseDown = (eventDown, type) => {
    eventDown.stopPropagation();
    eventDown.preventDefault();

    const node = timelineRef.current;
    const { top } = cumulativeOffset(node);
    const height = node.offsetHeight;
    const downPageY = eventDown.pageY;

    actions.resetSelect();
    actions.selectTask(task.id);

    event.addEventListener('mousemove.timeline', eventMove => {
      mouseMove(top, height, downPageY, eventMove, type);
    });

    event.addEventListener('mouseup.timeline', eventEnd => {
      mouseup(top, height, downPageY, eventEnd, type);
    });
  };

  return (
    <div
      className={`Tasks__item ${task.consider ? '' : '-noConsider'}`}
      style={{ top: `${start}%`, height: `${end - start}%` }}
      title={`${client.label} | ${convertTimeToHour(
        task.time[0]
      )} - ${convertTimeToHour(task.time[1])} | ${task.description}`}
      onMouseDown={e => mouseDown(e, 'move')}
    >
      <div
        className="Tasks__resize-top"
        onMouseDown={e => mouseDown(e, 'top')}
      />
      <div className="Tasks__back">
        <div
          className="Tasks__color"
          style={{ backgroundColor: client.color }}
        />
      </div>
      <span className="Tasks__label">{client.label}</span>
      <span className="Tasks__times">
        {convertTimeToHour(task.time[1] - task.time[0])}
      </span>
      <span className="Tasks__description">{task.description}</span>
      <div
        className="Tasks__resize-bottom"
        onMouseDown={e => mouseDown(e, 'bottom')}
      />
    </div>
  );
};

export default Task;
