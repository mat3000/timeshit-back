import React from 'react';
import { useOvermind } from '../../../overmind';
import { useToolsStep } from '../../hooks';
import './Steps.scss';

const Steps = ({ steps, index }) => {
  const { state } = useOvermind();
  const { getPercentByTime } = useToolsStep(index);
  const start = getPercentByTime(state.options.break.start);
  const end = getPercentByTime(state.options.break.end);

  return (
    <div className="Steps">
      <div
        className="Steps__break"
        style={{ height: `${end - start}%`, top: `${start}%` }}
      />
      <div className="Steps__group">
        {steps.map(({ integer }, i) => (
          <div className={`Steps__step ${integer ? '-integer' : ''}`} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Steps;
