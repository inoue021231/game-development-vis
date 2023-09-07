/* import Data from "./data.json"; */
import { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

const LineAllPlot = ({
  topRankList,
  line,
  highlightMakerIndex,
  color,
  handleMakerMouseEnter,
  handleMakerMouseLeave,
}) => {
  return (
    <g>
      {topRankList.map((item, i) => {
        const linePath = line[i](Object.values(item).flat());
        return (
          <g key={i}>
            {highlightMakerIndex === i && (
              <path
                d={linePath}
                stroke="skyblue"
                fill="none"
                strokeWidth="8"
              ></path>
            )}
            <path
              d={linePath}
              stroke={
                highlightMakerIndex === i || highlightMakerIndex === -1
                  ? color(i)
                  : "gray"
              }
              strokeWidth="2"
              fill="none"
            ></path>

            <path
              d={linePath}
              stroke="transparent"
              strokeWidth="20"
              fill="none"
              onMouseEnter={() => handleMakerMouseEnter(i)}
              onMouseLeave={handleMakerMouseLeave}
            ></path>
          </g>
        );
      })}
    </g>
  );
};

const LinePlot = ({ selectPath, selectMaker, color }) => {
  return (
    <g>
      <path
        d={selectPath}
        stroke={color(selectMaker)}
        strokeWidth="2"
        style={{ transition: "0.5s" }}
        fill="none"
      ></path>
    </g>
  );
};

const LineChart = ({
  selectPath,
  selectMaker,
  topRankList,
  line,
  highlightMakerIndex,
  color,
  handleMakerMouseEnter,
  handleMakerMouseLeave,
}) => {
  return (
    <g>
      {selectMaker === -1 ? (
        <LineAllPlot
          {...{
            topRankList,
            line,
            highlightMakerIndex,
            color,
            handleMakerMouseEnter,
            handleMakerMouseLeave,
          }}
        ></LineAllPlot>
      ) : (
        <LinePlot
          {...{
            selectPath,
            selectMaker,
            color,
          }}
        ></LinePlot>
      )}
    </g>
  );
};

export default LineChart;
