import { useState } from 'react';
import Data from './data.json';
import './App.css';
import * as d3 from "d3";

const Chart = (props) => {
  const chart = props.chart;
  const firstYear = 2013;
  const yearCount = Object.keys(Data).length;
  const makerCount = 10;
  const w = 1200, h = 450, margin = 100;
  const salesFigures = [];
  const totalSales = [];
  const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(makerCount));
  const [selectYear, setSelectYear] = useState(firstYear);
  const [selectMaker, setSelectMaker] = useState(-1);
  const [selectPath, setSelectPath] = useState(null);
  const xArray = [{
    year: firstYear,
    x: 0,
  }];

  console.log(chart);


  const pie = d3.pie().value((d) => d["総販売本数"]);

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(120);
  const miniArcGenerator = d3.arc().innerRadius(0).outerRadius(35);
  const miniPieData = [];

  for (let i = 0; i < yearCount; i++) {
    let total = 0;
    for (let j = 0; j < Data[2013 + i].length; j++) {
      salesFigures.push(Number(Data[2013 + i][j]["総販売本数"]));
      total += Number(Data[2013 + i][j]["総販売本数"]);
    }
    totalSales.push(total);
  }

  const totalScale = d3.scaleLinear()
    .domain([0, Math.max(...totalSales)])
    .range([0, h - margin])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([0, Math.max(...salesFigures)])
    .range([0, h - margin])
    .nice();

  const topRankList = [];
  const path = new Array(makerCount);

  const pieArray = [];

  for (let i = 0; i < makerCount; i++) {
    topRankList.push(Data[firstYear + yearCount - 1][i]["メーカー"]);
    const d = Data[firstYear].find(item => item["メーカー"] === topRankList[i]);
    let y = 0;
    if (d) {
      y = d["総販売本数"];
      pieArray.push(d);
    }
    path[i] = d3.path();
    path[i].moveTo(0, yScale(y));
  }
  miniPieData.push(pie(pieArray));

  for (let i = 1; i < yearCount; i++) {
    xArray.push({
      year: firstYear + i,
      x: (w - margin * 4) * i / yearCount
    });
    const pieArray = [];
    for (let j = 0; j < makerCount; j++) {
      let y = 0;
      const d = Data[firstYear + i].find(item => item["メーカー"] === topRankList[j]);
      if (d) {
        y = d["総販売本数"];
        pieArray.push(d);
      }
      path[j].lineTo(xArray[i].x, yScale(y));
    }
    miniPieData.push(pie(pieArray));

  }

  const yScaleArray = [];

  for (let i = 0; i < makerCount; i++) {
    const array = [];
    for (let j = 0; j < yearCount; j++) {
      const d = Data[firstYear + j].find(item => item["メーカー"] === topRankList[i]);
      if (d) {
        array.push(d["総販売本数"]);
      }
    }
    yScaleArray.push(
      d3.scaleLinear()
        .domain([0, Math.max(...array)])
        .range([0, h - margin])
        .nice()
    );
  }

  /* 面グラフ関連 */
  const areaPoint = [];
  for (let i = 0; i < yearCount; i++) {
    const point = [];
    for (let j = 0; j < makerCount; j++) {
      const d = Data[firstYear + i].find(item => item["メーカー"] === topRankList[j]);
      if (j === 0) {
        point.push(parseFloat(d["販売シェア"]));
      } else {
        if (d) {
          point.push(parseFloat(d["販売シェア"]) + point[j - 1]);

        } else {
          point.push(point[j - 1]);
        }
      }

    }
    const maxPoint = Math.max(...point);
    const areaScale = d3.scaleLinear()
      .domain([0, maxPoint])
      .range([0, h - margin]);

    const newPoint = point.map((value) => areaScale(value));
    areaPoint.push(newPoint);
  }



  const areaPath = [];
  const fp = d3.path();
  fp.moveTo(0, 0);
  fp.lineTo(xArray[9].x, 0);
  fp.lineTo(xArray[9].x, areaPoint[9][0]);
  for (let i = yearCount - 2; i >= 0; i--) {
    fp.lineTo(xArray[i].x, areaPoint[i][0]);
  }
  areaPath.push(fp);

  for (let i = 1; i < makerCount; i++) {
    const path = d3.path();
    path.moveTo(0, areaPoint[0][i]);
    path.lineTo(0, areaPoint[0][i - 1]);
    for (let j = 1; j < yearCount; j++) {
      path.lineTo(xArray[j].x, areaPoint[j][i - 1]);
    }
    path.lineTo(xArray[9].x, areaPoint[9][i]);
    for (let j = yearCount - 2; j >= 0; j--) {
      path.lineTo(xArray[j].x, areaPoint[j][i]);
    }
    areaPath.push(path);
  }

  console.log(areaPath);
  /*  */

  const handleChangeYear = (i) => {
    setSelectYear(i + firstYear);
  }

  const handleChangeMaker = (i) => {
    if (selectMaker === i) {
      setSelectMaker(-1);
    } else {
      const newPath = d3.path();

      for (let j = 0; j < yearCount; j++) {
        let y = 0;
        const d = Data[firstYear + j].find(item => item["メーカー"] === topRankList[i]);
        if (d) {
          y = d["総販売本数"];
        }
        if (j === 0) {
          newPath.moveTo(0, yScaleArray[i](y));
        } else {
          newPath.lineTo(xArray[j].x, yScaleArray[i](y));
        }
      }
      setSelectPath(newPath);
      setSelectMaker(i);
    }
  }

  const [selectArcIndex, setSelectArcIndex] = useState(-1);
  const [selectPathIndex, setSelectPathIndex] = useState(-1);
  const [highlightData, setHighlightData] = useState(null);

  const highlightCircle = d3.arc().innerRadius(35).outerRadius(38).startAngle(0).endAngle(2 * Math.PI)();

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
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', '20');
    textElement.setAttribute('y', '10');
    textElement.textContent = topRankList[i];
    document.querySelector('.svg__content').appendChild(textElement);
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

  const getTransparentColor = (i) => {
    const c = d3.color(color(i));
    c.opacity = 0.5;
    return c.toString();
  };

  const overlayArcGenerator = d3.arc().innerRadius(0).outerRadius(120);

  return <svg viewBox={`0 0 ${w + 100} ${h + 100}`} className="svg__content">
    <g transform={`translate(${margin - 30},${h - margin / 2}) scale(1,-1)`}>

      {
        xArray.map((item, i) => {
          return <g transform={`translate(${item.x},0) scale(1,-1)`} key={i}>
            <line y1="5" stroke="gray"></line>
            <text y="5" textAnchor='middle' dominantBaseline="text-before-edge">{item.year}</text>
            <line y1={-h + margin} stroke="lightgray"></line>
          </g>
        })
      }

      {chart === "Line Chart" && selectMaker === -1 && yScale.ticks().map((item, i) => {
        return <g transform={`translate(0,${yScale(item)}) scale(1,-1)`} key={i}>
          <line x1="-5" stroke='gray'></line>
          <text x="-5" textAnchor='end' dominantBaseline="central">{item / 10000}</text>
          <line x1={xArray[9].x} stroke="lightgray"></line>
        </g>
      })}

      {chart === "Line Chart" && selectMaker !== -1 && yScaleArray[selectMaker].ticks(10).map((item, i) => {
        return <g transform={`translate(0,${yScaleArray[selectMaker](item)}) scale(1,-1)`} key={i}>
          <line x1="-5" stroke='gray'></line>
          <text x="-5" textAnchor='end' dominantBaseline="central">{item / 10000}</text>
          <line x1={xArray[9].x} stroke="lightgray"></line>
        </g>
      })}


      {chart === "Line Chart" && totalSales.map((_, i) => {
        if (i !== 0) {
          return <line x1={xArray[i - 1].x} y1={totalScale(totalSales[i - 1])} x2={xArray[i].x} y2={totalScale(totalSales[i])} stroke='black' strokeDasharray="5 3" key={i}></line>
        } else {
          return <div key={i}></div>;
        }
      })}

      {chart === "Line Chart" && totalScale.ticks().map((item, i) => {
        return <g transform={`translate(${xArray[9].x},${totalScale(item)}) scale(1,-1)`} key={i}>
          <text x="5" textAnchor='start' dominantBaseline="central">{item / 10000}</text>
        </g>
      })}

      <line x1={xArray[9].x} stroke='gray'></line>
      <line y1={h - margin} stroke='gray'></line>
      <line x1={xArray[9].x} x2={xArray[9].x} y1="0" y2={h - margin} stroke='gray'></line>

      {chart === "Line Chart" && highlightMakerIndex !== -1 && selectMaker === -1 && <path d={path[highlightMakerIndex]} stroke="skyblue" fill="none" strokeWidth="5"></path>}

      {chart === "Line Chart" && <g>
        {selectMaker === -1 ? path.map((p, i) => {
          return <path d={p} stroke={color(i)} strokeWidth="2" fill='none' key={i} ></path>
        }) : <path
          d={selectPath}
          stroke={color(selectMaker)}
          strokeWidth="2"
          fill='none'
        ></path>
        }
      </g>}

      {chart === "Line Chart" && <g>
        <g transform={`translate(${xArray[9].x},${h - margin}) scale(1,-1)`}>
          <text y="-10" textAnchor='start'>{`(万本)`}</text>
        </g>
        <g transform={`translate(${xArray[9].x + margin / 2},${h / 2}) rotate(270) scale(1,-1)`}>
          <text>年別総販売本数</text>
        </g>

        <g transform={`translate(${(w - margin * 5) / 2},-40) scale(1,-1)`}>
          <text>年</text>
        </g>
        <g transform={`translate(${-margin / 2},${h / 4}) rotate(90) scale(1,-1)`}>
          <text>メーカー別販売本数</text>
        </g>

        <g transform={`translate(0,${h - margin}) scale(1,-1)`}>
          <text y="-10" textAnchor='end'>{`(万本)`}</text>
        </g>

        <g transform={`translate(${xArray[9].x + 80},${h - margin + 10}) scale(1,-1)`}>
          <line x1="10" strokeDasharray="5 2" stroke="black"></line>
          <text x="20" dominantBaseline="central">年別総販売本数</text>
        </g>
      </g>}

      {
        topRankList.map((item, i) => {
          return <g
            transform={`translate(${xArray[9].x + 80},${h - margin - 20 * i - 20}) scale(1,-1)`}
            key={i}
            onMouseEnter={() => handleMakerMouseEnter(i)}
            onMouseLeave={handleMakerMouseLeave}
            onClick={() => handleChangeMaker(i)}
            style={{ cursor: 'pointer' }}
          >
            {highlightMakerIndex === i && (
              <rect x="0" y="-5" width={makerNameWidth} height="20" fill="skyblue" opacity="0.5" />
            )}
            <rect width="10" height="10" fill={color(i)}></rect>
            <text x="20" y="10">
              {item}
            </text>

          </g>
        })
      }

      {chart === "Area Chart" && areaPath.map((item, i) => {
        return <g transform={`translate(0,${h - margin}) scale(1,-1)`}><path d={item} fill={getTransparentColor(i)} key={i}></path></g>
      })}


    </g>
    <g transform={`translate(${margin - 30},${h + 30})`}>
      {miniPieData.map((pie, i) => {
        return pie.map((item, j) => {
          return <g transform={`translate(${xArray[i].x},0)`} key={j}>
            <path
              d={miniArcGenerator(item)}
              fill={color(j)}
              onClick={() => { handleChangeYear(i) }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handlePathMouseEnter(i)}
              onMouseLeave={handlePathMouseLeave}
            ></path>
            {highlightData && selectPathIndex === i && <path d={highlightData} fill="skyblue" />}

          </g>
        })
      })}
      <g transform={`translate(${xArray[selectYear - firstYear].x},0)`}>
        <path d={highlightCircle} fill="skyblue"></path>
      </g>
    </g>
    <g transform={`translate(${w - 200},${h - 60})`}>
      {miniPieData[selectYear - firstYear].map((item, i) => {
        const percentage = ((item.endAngle - item.startAngle) / (2 * Math.PI)) * 100;
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
            style={{ cursor: 'pointer' }}
            onMouseEnter={handleArcMouseEnter}
            onMouseLeave={handleArcMouseLeave}
            onClick={() => handleChangeMaker(i)}
          >

            <path d={arcGenerator(item)} fill={color(i)} stroke="lightgray" strokeWidth="2" />

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
  </svg >
}

const App = () => {
  const [chart, setChart] = useState("Line Chart");
  const handleChangeChart = (event) => {
    setChart(event.target.value);
  }
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
        <Chart chart={chart} />
      </div>

      <div className="footer">

        <a href="https://github.com/inoue021231/game-development-viz">github</a> 2023 inoue_r
      </div>
    </div>
  )
}

export default App;
