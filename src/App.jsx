import "./App.css";
import Chart from "./Chart";
import Data from "./data.json";

const App = () => {
  return (
    <div className="app-container">
      <div className="header">
        <h1>Game Development Visualization</h1>
        <div className="user">
          <a href="https://github.com/inoue021231/game-development-viz">
            Github
          </a>{" "}
          2023 inoue_r
        </div>
      </div>

      <div className="svg__container">
        <Chart data={Data} />
      </div>
    </div>
  );
};

export default App;
