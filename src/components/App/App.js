import React from 'react';
import Back from '../Back/Back';
import Timelines from '../Timelines/Timelines';
import NewTask from '../NewTask/NewTask';
import Options from '../Options/Options';
import './App.scss';

const App = () => {
  return (
    <div className="App">
      <Back />
      <div className="App__content">
        <Timelines />
        <NewTask />
        <Options />
      </div>
    </div>
  );
};

export default App;
