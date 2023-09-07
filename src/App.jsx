import { useState, useEffect } from "react";
import "./App.css";
import Chart from "./Chart";
import Data from "./data.json";
import AreaChart from "./AreaChart";

const App = () => {
  const [chartName, setChartName] = useState("Line Chart");
  const handleChangeChart = (event) => {
    setChartName(event.target.value);
  };
  return (
    <div className="app-container">
      <div className="header">
        <h1>Game Development Visualization</h1>
        <select className="form-select" onChange={handleChangeChart}>
          <option>Line Chart</option>
          <option>Area Chart</option>
        </select>
      </div>

      <div className="svg__container">
        {chartName === "Line Chart" ? (
          <Chart data={Data} />
        ) : (
          <AreaChart data={Data}></AreaChart>
        )}
      </div>

      <div className="footer">
        <a href="https://github.com/inoue021231/game-development-viz">Github</a>{" "}
        2023 inoue_r
      </div>
    </div>
  );
};

export default App;
