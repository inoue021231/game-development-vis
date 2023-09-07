/* import Data from "./data.json"; */
import { useState } from "react";
import * as d3 from "d3";
import "./App.css";
import Axis from "./Axis";
import LineChart from "./LineChart";
import Legend from "./Legend";
import Circle from "./Circle";

const Chart = (props) => {
  const [data] = useState(props.data);
  const [selectMaker, setSelectMaker] = useState(-1);
  const [selectLine, setSelectLine] = useState(null);
  const [selectMiniArcIndex, setSelectMiniArcIndex] = useState(-1);
  const [selectPathIndex, setSelectPathIndex] = useState(-1);
  const [highlightData, setHighlightData] = useState(null);
  const [highlightMakerIndex, setHighlightMakerIndex] = useState(-1);

  const years = Object.keys(data).sort();
  const firstYear = Number(years[0]);
  //const lastYear = Number(years[years.length - 1]);

  const makerStr = "メーカー";
  const salesCountStr = "総販売本数";
  const [selectYear, setSelectYear] = useState(firstYear);

  const yearCount = Object.keys(data).length;
  const makerCount = 10;
  const w = 1200,
    h = 450,
    margin = 100;
  const padding = 5;

  const lineW = (w * 2) / 3;
  const legendW = w / 3;

  const salesFigures = [];
  const totalSales = [];
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(makerCount));

  for (let i = 0; i < yearCount; i++) {
    let total = 0;
    for (let j = 0; j < data[firstYear + i].length; j++) {
      salesFigures.push(Number(data[firstYear + i][j][salesCountStr]));
      total += Number(data[firstYear + i][j][salesCountStr]);
    }
    totalSales.push(total);
  }

  const xScale = d3
    .scaleLinear()
    .domain([0, yearCount - 1])
    .range([0, lineW])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...salesFigures)])
    .range([0, h - margin])
    .nice();

  const topRankList = [];
  for (let i = 0; i < makerCount; i++) {
    const name = data[firstYear + yearCount - 1][i][makerStr];
    topRankList.push({
      [name]: [],
    });

    for (let j = 0; j < yearCount; j++) {
      const year = firstYear + j;
      const d = data[year].find((item) => item[makerStr] === name);
      if (d) {
        topRankList[i][name].push(Number(d[salesCountStr]));
      } else {
        topRankList[i][name].push(0);
      }
    }
  }

  const line = new Array(makerCount);
  for (let i = 0; i < makerCount; i++) {
    line[i] = d3
      .line()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d));
  }

  const yScaleArray = [];

  for (let i = 0; i < makerCount; i++) {
    const array = [];
    for (let j = 0; j < yearCount; j++) {
      const d = data[firstYear + j].find(
        (item) => item[makerStr] === Object.keys(topRankList[i])[0]
      );
      if (d) {
        array.push(d[salesCountStr]);
      }
    }
    yScaleArray.push(
      d3
        .scaleLinear()
        .domain([0, Math.max(...array)])
        .range([0, h - margin])
        .nice()
    );
  }

  const handleChangeMaker = (i) => {
    if (selectMaker === i) {
      const line = d3
        .line()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d));
      setSelectLine(line);
      setSelectMaker(-1);
    } else {
      const array = [];
      for (let j = 0; j < yearCount; j++) {
        const d = data[firstYear + j].find(
          (item) => item[makerStr] === Object.keys(topRankList[i])[0]
        );

        if (d) {
          array.push(d[salesCountStr]);
        }
      }

      const newYScale = d3
        .scaleLinear()
        .domain([0, Math.max(...array)])
        .range([0, h - margin])
        .nice();
      const newLine = d3
        .line()
        .x((_, i) => xScale(i))
        .y((d) => newYScale(d));

      setSelectLine(newLine(Object.values(topRankList[i]).flat()));
      setSelectMaker(i);
    }
  };

  const highlightCircle = d3
    .arc()
    .innerRadius(35)
    .outerRadius(38)
    .startAngle(0)
    .endAngle(2 * Math.PI)();

  const handlePathMouseEnter = (i) => {
    setSelectPathIndex(i);
    setHighlightData(highlightCircle);
  };

  const handlePathMouseLeave = () => {
    setSelectPathIndex(-1);
    setHighlightData(null);
  };

  const handleMakerMouseEnter = (i) => {
    setSelectMiniArcIndex(i);
    setHighlightMakerIndex(i);
  };

  const handleMakerMouseLeave = () => {
    setHighlightMakerIndex(-1);
    setSelectMiniArcIndex(-1);
  };

  return (
    <svg viewBox={`0 0 ${w + 100} ${h + 100}`} className="svg__content">
      <g transform={`translate(${margin - 30},${h - margin / 2}) scale(1,-1)`}>
        <Axis
          {...{
            margin,
            w,
            h,
            xScale,
            firstYear,
            padding,
          }}
        ></Axis>
        <LineChart
          {...{
            selectLine,
            selectMaker,
            topRankList,
            line,
            highlightMakerIndex,
            color,
            handleMakerMouseEnter,
            handleMakerMouseLeave,
            xScale,
            yScale,
            yearCount,
            yScaleArray,
            h,
            margin,
          }}
        ></LineChart>
        <Legend
          {...{
            topRankList,
            xScale,
            yearCount,
            h,
            margin,
            handleMakerMouseEnter,
            handleMakerMouseLeave,
            handleChangeMaker,
            highlightMakerIndex,
            legendW,
            color,
          }}
        ></Legend>
      </g>
      <Circle
        {...{
          selectYear,
          lineW,
          margin,
          h,
          setSelectMiniArcIndex,
          setHighlightData,
          handleMakerMouseEnter,
          handleMakerMouseLeave,
          handleChangeMaker,
          color,
          selectMiniArcIndex,
          firstYear,
          xScale,
          setSelectYear,
          handlePathMouseEnter,
          handlePathMouseLeave,
          highlightData,
          highlightCircle,
          selectPathIndex,
          data,
          salesCountStr,
          makerStr,
          yearCount,
          makerCount,
          topRankList,
        }}
      ></Circle>
    </svg>
  );
};

export default Chart;
