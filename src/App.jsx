import { useState, useEffect } from 'react';
import './App.css';
import Chart from './Chart';

const App = () => {
  
  return (
    <div className="app-container">
      <div className="header">
        <h1>Game Development Visualization</h1>
      </div>

      <div className="svg__container">
        <Chart />
      </div>

      <div className="footer">

        <a href="https://github.com/inoue021231/game-development-viz">Github</a> 2023 inoue_r
      </div>
    </div>
  )
}

export default App;
