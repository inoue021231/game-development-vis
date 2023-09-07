/* import Data from "./data.json"; */
import { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";
import Total from "./Total";
import Axis from "./Axis";

const firstYear = 2013;

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
                strokeWidth="5"
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

const Line = ({
  totalScale,
  w,
  h,
  highlightMakerIndex,
  selectMaker,
  color,
  selectPath,
  margin,
  totalSales,
  yScale,
  yScaleArray,
  handleMakerMouseEnter,
  handleMakerMouseLeave,
  handleChangeMaker,
  topRankList,
  line,
  xScale,
  yearCount,
}) => {
  return (
    <g>
      <line x1={xScale(yearCount - 1)} stroke="gray"></line>
      <line y1={h - margin} stroke="gray"></line>
      <line
        x1={xScale(yearCount - 1)}
        x2={xScale(yearCount - 1)}
        y1="0"
        y2={h - margin}
        stroke="gray"
      ></line>

      {selectMaker === -1 &&
        yScale.ticks().map((item, i) => {
          return (
            <g transform={`translate(0,${yScale(item)}) scale(1,-1)`} key={i}>
              <line x1="-5" stroke="gray"></line>
              <text x="-5" textAnchor="end" dominantBaseline="central">
                {item / 10000}
              </text>
              <line x1={xScale(yearCount - 1)} stroke="lightgray"></line>
            </g>
          );
        })}
      {selectMaker !== -1 &&
        yScaleArray[selectMaker].ticks(10).map((item, i) => {
          return (
            <g
              transform={`translate(0,${yScaleArray[selectMaker](
                item
              )}) scale(1,-1)`}
              key={i}
            >
              <line x1="-5" stroke="gray"></line>
              <text x="-5" textAnchor="end" dominantBaseline="central">
                {item / 10000}
              </text>
              <line x1={xScale(yearCount - 1)} stroke="lightgray"></line>
            </g>
          );
        })}

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

      {/* <Total
            margin={margin}
            h={h}
            totalSales={totalSales}
            totalScale={totalScale}
        ></Total> */}
      <g transform={`translate(${(w - margin * 5) / 2},-40) scale(1,-1)`}>
        <text>年</text>
      </g>
      <g
        transform={`translate(${-margin / 2},${h / 4}) rotate(90) scale(1,-1)`}
      >
        <text>メーカー別販売本数</text>
      </g>
      <g transform={`translate(0,${h - margin}) scale(1,-1)`}>
        <text y="-10" textAnchor="end">{`(万本)`}</text>
      </g>
    </g>
  );
};

const Circle = (props) => {};

const Chart = (props) => {
  const [data, setData] = useState(props.data);
  const [selectYear, setSelectYear] = useState(firstYear);
  const [selectMaker, setSelectMaker] = useState(-1);
  const [selectPath, setSelectPath] = useState(null);
  const [selectArcIndex, setSelectArcIndex] = useState(-1);
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
    for (let j = 0; j < data[2013 + i].length; j++) {
      salesFigures.push(Number(data[2013 + i][j]["総販売本数"]));
      total += Number(data[2013 + i][j]["総販売本数"]);
    }
    totalSales.push(total);
  }

  const totalScale = d3
    .scaleLinear()
    .domain([0, Math.max(...totalSales)])
    .range([0, h - margin])
    .nice();

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

  const pie = d3.pie().value((d) => d["総販売本数"]);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(120);
  const miniArcGenerator = d3.arc().innerRadius(0).outerRadius(35);
  const miniPieData = [];
  const pieArray = [];

  const topRankList = [];
  for (let i = 0; i < makerCount; i++) {
    const name = data[firstYear + yearCount - 1][i]["メーカー"];
    topRankList.push({
      [name]: [],
    });

    for (let j = 0; j < yearCount; j++) {
      const year = firstYear + j;
      const d = data[year].find((item) => item["メーカー"] === name);
      if (d) {
        topRankList[i][name].push(Number(d["総販売本数"]));
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

  /* topRankList.map((item, i) => {
    console.log(line(Object.values(item)));
  }); */

  /* circle */
  for (let i = 0; i < makerCount; i++) {
    const d = data[firstYear].find(
      (item) => item["メーカー"] === Object.keys(topRankList[i])[0]
    );
    let y = 0;
    if (d) {
      y = d["総販売本数"];
      pieArray.push(d);
    }
  }
  miniPieData.push(pie(pieArray));

  for (let i = 1; i < yearCount; i++) {
    const pieArray = [];
    for (let j = 0; j < makerCount; j++) {
      let y = 0;
      const d = data[firstYear + i].find(
        (item) => item["メーカー"] === Object.keys(topRankList[j])[0]
      );
      if (d) {
        y = d["総販売本数"];
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
        (item) => item["メーカー"] === Object.keys(topRankList[i])[0]
      );
      if (d) {
        array.push(d["総販売本数"]);
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
          (item) => item["メーカー"] === Object.keys(topRankList[i])[0]
        );
        if (d) {
          y = d["総販売本数"];
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

  const [makerNameWidth, setMakerNameWidth] = useState(0);

  const handleMakerMouseEnter = (i) => {
    const textElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textElement.setAttribute("x", "20");
    textElement.setAttribute("y", "10");
    textElement.textContent = topRankList[i];
    document.querySelector(".svg__content").appendChild(textElement);
    const textBBox = textElement.getBBox();
    setMakerNameWidth(textBBox.width + 30);
    textElement.remove();
    setSelectArcIndex(i);
    setHighlightMakerIndex(i);
  };

  const handleMakerMouseLeave = () => {
    setHighlightMakerIndex(-1);
    setSelectArcIndex(-1);
    setMakerNameWidth(0);
  };

  const overlayArcGenerator = d3.arc().innerRadius(0).outerRadius(120);

  console.log(miniPieData);

  return (
    <svg viewBox={`0 0 ${w + 100} ${h + 100}`} className="svg__content">
      <g transform={`translate(${margin - 30},${h - margin / 2}) scale(1,-1)`}>
        <Axis
          {...{
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
          }}
        ></Axis>
        <Line
          totalScale={totalScale}
          w={w}
          h={h}
          highlightMakerIndex={highlightMakerIndex}
          selectMaker={selectMaker}
          color={color}
          selectPath={selectPath}
          margin={margin}
          totalSales={totalSales}
          yScale={yScale}
          yScaleArray={yScaleArray}
          handleMakerMouseEnter={handleMakerMouseEnter}
          handleMakerMouseLeave={handleMakerMouseLeave}
          handleChangeMaker={handleChangeMaker}
          topRankList={topRankList}
          line={line}
          xScale={xScale}
          yearCount={yearCount}
        ></Line>

        {topRankList.map((item, i) => {
          return (
            <g
              transform={`translate(${xScale(yearCount - 1) + 80},${
                h - margin - 20 * i - 20
              }) scale(1,-1)`}
              key={i}
              onMouseEnter={() => handleMakerMouseEnter(i)}
              onMouseLeave={handleMakerMouseLeave}
              onClick={() => handleChangeMaker(i)}
              style={{ cursor: "pointer" }}
            >
              {highlightMakerIndex === i && (
                <rect
                  x="0"
                  y="-5"
                  width={legendW}
                  height="20"
                  fill="skyblue"
                  opacity="0.5"
                />
              )}
              <rect width="10" height="10" fill={color(i)}></rect>
              <text x="20" y="10">
                {Object.keys(item)}
              </text>
            </g>
          );
        })}
      </g>

      <g transform={`translate(${lineW + margin * 3},${h - 60})`}>
        {miniPieData[selectYear - firstYear].map((item, i) => {
          const percentage =
            ((item.endAngle - item.startAngle) / (2 * Math.PI)) * 100;
          const labelPosition = arcGenerator.centroid(item);
          const labelX = labelPosition[0] * 1.5;
          const labelY = labelPosition[1] * 1.5;

          const handleArcMouseEnter = () => {
            setSelectArcIndex(i);
            setHighlightData(item);
            handleMakerMouseEnter(i);
          };

          const handleArcMouseLeave = () => {
            setSelectArcIndex(-1);
            setHighlightData(null);
            handleMakerMouseLeave();
          };

          return (
            <g
              key={i}
              style={{ cursor: "pointer", transition: "0.5s" }}
              onMouseEnter={handleArcMouseEnter}
              onMouseLeave={handleArcMouseLeave}
              onClick={() => handleChangeMaker(i)}
            >
              <path
                d={arcGenerator(item)}
                fill={color(i)}
                stroke="lightgray"
                strokeWidth="2"
              />

              {selectArcIndex === i && (
                <path d={overlayArcGenerator(item)} fill="skyblue" />
              )}

              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="12px"
              >
                {percentage.toFixed(1)}%
              </text>
            </g>
          );
        })}
        <text y="145" textAnchor="middle" fontSize="15px">
          {selectYear}年
        </text>
      </g>
    </svg>
  );
};

export default Chart;
