/* import Data from "./data.json"; */
import { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";
import Axis from "./Axis";
import LineChart from "./LineChart";
import Legend from "./Legend";
import Circle from "./Circle";

const firstYear = 2013;
const MakerStr = "メーカー";
const SalesCountStr = "総販売本数";

const Chart = (props) => {
  const [data, setData] = useState(props.data);
  const [selectYear, setSelectYear] = useState(firstYear);
  const [selectMaker, setSelectMaker] = useState(-1);
  const [selectPath, setSelectPath] = useState(null);
  const [selectMiniArcIndex, setSelectMiniArcIndex] = useState(-1);
  const [selectPathIndex, setSelectPathIndex] = useState(-1);
  const [highlightData, setHighlightData] = useState(null);

  const yearCount = Object.keys(data).length;
  const makerCount = 10;
  const w = 1200,
    h = 450,
    margin = 100;

  const lineW = (w * 2) / 3;
  const legendW = (w * 1) / 3;

  const salesFigures = [];
  const totalSales = [];
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(makerCount));

  for (let i = 0; i < yearCount; i++) {
    let total = 0;
    for (let j = 0; j < data[firstYear + i].length; j++) {
      salesFigures.push(Number(data[firstYear + i][j][SalesCountStr]));
      total += Number(data[firstYear + i][j][SalesCountStr]);
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

  const pie = d3.pie().value((d) => d[SalesCountStr]);

  const miniArcGenerator = d3.arc().innerRadius(0).outerRadius(35);
  const miniPieData = [];

  const topRankList = [];
  for (let i = 0; i < makerCount; i++) {
    const name = data[firstYear + yearCount - 1][i][MakerStr];
    topRankList.push({
      [name]: [],
    });

    for (let j = 0; j < yearCount; j++) {
      const year = firstYear + j;
      const d = data[year].find((item) => item[MakerStr] === name);
      if (d) {
        topRankList[i][name].push(Number(d[SalesCountStr]));
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

  for (let i = 0; i < yearCount; i++) {
    const pieArray = [];
    for (let j = 0; j < makerCount; j++) {
      const d = data[firstYear + i].find(
        (item) => item[MakerStr] === Object.keys(topRankList[j])[0]
      );
      if (d) {
        pieArray.push(d);
      }
    }
    miniPieData.push(pie(pieArray));
  }

  const yScaleArray = [];

  for (let i = 0; i < makerCount; i++) {
    const array = [];
    for (let j = 0; j < yearCount; j++) {
      const d = data[firstYear + j].find(
        (item) => item[MakerStr] === Object.keys(topRankList[i])[0]
      );
      if (d) {
        array.push(d[SalesCountStr]);
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

  const handleChangeYear = (i) => {
    setSelectYear(i + firstYear);
  };

  const handleChangeMaker = (i) => {
    if (selectMaker === i) {
      setSelectMaker(-1);
    } else {
      const newPath = d3.path();

      for (let j = 0; j < yearCount; j++) {
        let y = 0;
        const d = data[firstYear + j].find(
          (item) => item[MakerStr] === Object.keys(topRankList[i])[0]
        );
        if (d) {
          y = d[SalesCountStr];
        }
        if (j === 0) {
          newPath.moveTo(0, yScaleArray[i](y));
        } else {
          newPath.lineTo(xScale(j), yScaleArray[i](y));
        }
      }
      setSelectPath(newPath);
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

  const [highlightMakerIndex, setHighlightMakerIndex] = useState(-1);

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
          }}
        ></Axis>
        <LineChart
          {...{
            selectPath,
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
          miniPieData,
          setSelectMiniArcIndex,
          setHighlightData,
          handleMakerMouseEnter,
          handleMakerMouseLeave,
          handleChangeMaker,
          color,
          selectMiniArcIndex,
          firstYear,
        }}
      ></Circle>
    </svg>
  );
};

export default Chart;
