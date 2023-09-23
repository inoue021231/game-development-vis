import { useEffect, useState } from "react";
import * as d3 from "d3";
import Axis from "./Axis";
import LineChart from "./LineChart";
import Legend from "./Legend";
import Circle from "./Circle";

const Chart = (props) => {
  const data = props.data;
  const makerCount = 10;
  const w = 1200;
  const h = 450;
  const margin = 100;
  const padding = 5;
  const makerStr = "メーカー";
  const salesCountStr = "総販売本数";

  const [selectMakerList, setSelectMakerList] = useState(
    Array(makerCount).fill(false)
  );
  const [selectMiniArcIndex, setSelectMiniArcIndex] = useState(-1);
  const [selectPathIndex, setSelectPathIndex] = useState(-1);
  const [highlightMakerIndex, setHighlightMakerIndex] = useState(-1);
  const [highlightData, setHighlightData] = useState(null);
  const [NYScale, setNYScale] = useState([]);
  const [newlinearray, setNewlinearray] = useState([]);
  const [highlightFlag, setHighlightFlag] = useState(true);

  const years = Object.keys(data).sort();
  const firstYear = Number(years[0]);

  const [selectYear, setSelectYear] = useState(firstYear);

  const yearCount = Object.keys(data).length;
  const lineW = (w * 2) / 3;
  const legendW = w / 3;
  const miniArcRadius = 35;

  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(makerCount));

  const highlightCircle = d3
    .arc()
    .innerRadius(miniArcRadius)
    .outerRadius(miniArcRadius + 3)
    .startAngle(0)
    .endAngle(2 * Math.PI)();

  const xScale = d3
    .scaleLinear()
    .domain([0, yearCount - 1])
    .range([0, lineW])
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

  const handleChangeMaker = (i) => {
    setSelectMakerList(
      selectMakerList.map((item, j) => {
        return i === j ? !item : item;
      })
    );
    setHighlightFlag(false);
  };

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
    setHighlightFlag(true);
  };

  const handleMakerMouseLeave = () => {
    setHighlightMakerIndex(-1);
    setSelectMiniArcIndex(-1);
  };

  useEffect(() => {
    const scale = d3
      .scaleLinear()
      .domain([0, yearCount - 1])
      .range([0, lineW])
      .nice();
    const max = Math.max(
      ...topRankList
        .map((item, i) => {
          const name = Object.keys(item).flat();
          return selectMakerList[i] || selectMakerList.every((value) => !value)
            ? item[name]
            : 0;
        })
        .flat()
    );

    const newScale = d3
      .scaleLinear()
      .domain([0, max])
      .range([0, h - margin])
      .nice();

    const line = d3
      .line()
      .x((_, i) => scale(i))
      .y((d) => newScale(d));

    const newLine = topRankList.map((item, i) => {
      const name = Object.keys(item).flat();
      console.log(line(item[name]));
      return selectMakerList[i] || selectMakerList.every((value) => !value)
        ? line(item[name])
        : null;
    });
    setNYScale(newScale.ticks());
    setNewlinearray(newLine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectMakerList]);

  return (
    <svg viewBox={`0 0 ${w + 100} ${h + 50}`} className="svg__content">
      <g
        transform={`translate(${margin - 30},${
          h - (margin * 2) / 3
        }) scale(1,-1)`}
      >
        <Axis
          {...{
            w,
            h,
            margin,
            xScale,
            firstYear,
            padding,
          }}
        ></Axis>
        <LineChart
          {...{
            h,
            margin,
            padding,
            highlightMakerIndex,
            color,
            handleMakerMouseEnter,
            handleMakerMouseLeave,
            xScale,
            yearCount,
            newlinearray,
            NYScale,
            highlightFlag,
            setHighlightFlag,
            selectMakerList,
          }}
        ></LineChart>
        <Legend
          {...{
            h,
            margin,
            topRankList,
            xScale,
            yearCount,
            handleMakerMouseEnter,
            handleMakerMouseLeave,
            handleChangeMaker,
            highlightMakerIndex,
            legendW,
            color,
            selectMakerList,
          }}
        ></Legend>
      </g>
      <Circle
        {...{
          data,
          h,
          margin,
          selectYear,
          lineW,
          setHighlightData,
          handleMakerMouseEnter,
          handleMakerMouseLeave,
          handleChangeMaker,
          color,
          selectMiniArcIndex,
          setSelectMiniArcIndex,
          firstYear,
          xScale,
          setSelectYear,
          handlePathMouseEnter,
          handlePathMouseLeave,
          highlightData,
          highlightCircle,
          selectPathIndex,
          salesCountStr,
          makerStr,
          yearCount,
          makerCount,
          topRankList,
          miniArcRadius,
        }}
      ></Circle>
    </svg>
  );
};

export default Chart;
