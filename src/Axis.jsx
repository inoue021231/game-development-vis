/* import Data from "./data.json"; */
import { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

const Axis = ({
  margin,
  h,
  miniPieData,
  xScale,
  miniArcGenerator,
  color,
  handleChangeYear,
  handlePathMouseEnter,
  handlePathMouseLeave,
  highlightData,
  selectPathIndex,
  selectYear,
  firstYear,
  highlightCircle,
  legendW,
}) => {
  return (
    <g transform={`translate(${margin - 30},${h + 30})`}>
      {miniPieData.map((pie, i) => {
        return pie.map((item, j) => {
          return (
            <g transform={`translate(${xScale(i)},0)`} key={j}>
              <path
                d={miniArcGenerator(item)}
                fill={color(j)}
                onClick={() => {
                  handleChangeYear(i);
                }}
                style={{ cursor: "pointer", transition: "0.5s" }}
                onMouseEnter={() => handlePathMouseEnter(i)}
                onMouseLeave={handlePathMouseLeave}
              ></path>
              {highlightData && selectPathIndex === i && (
                <path d={highlightData} fill="skyblue" />
              )}
            </g>
          );
        });
      })}
      <g transform={`translate(${xScale(selectYear - firstYear)},0)`}>
        <path d={highlightCircle} fill="skyblue"></path>
      </g>
    </g>
  );
};

export default Axis;
