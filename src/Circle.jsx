import "./App.css";
import * as d3 from "d3";

const Circle = ({
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
}) => {
  const miniArcGenerator = d3.arc().innerRadius(0).outerRadius(35);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(120);
  const overlayArcGenerator = d3.arc().innerRadius(0).outerRadius(120);
  const miniPieData = [];
  const pie = d3.pie().value((d) => d[salesCountStr]);

  for (let i = 0; i < yearCount; i++) {
    const pieArray = [];
    for (let j = 0; j < makerCount; j++) {
      const d = data[firstYear + i].find(
        (item) => item[makerStr] === Object.keys(topRankList[j])[0]
      );

      console.log(Object.keys(topRankList[j])[0]);
      if (d) {
        pieArray.push(d);
      }
    }
    miniPieData.push(pie(pieArray));
  }
  return (
    <g>
      <g transform={`translate(${margin - 30},${h + margin / 7})`}>
        {miniPieData.map((pie, i) => {
          return pie.map((item, j) => {
            return (
              <g transform={`translate(${xScale(i)},0)`} key={j}>
                <path
                  d={miniArcGenerator(item)}
                  fill={color(j)}
                  onClick={() => {
                    setSelectYear(i + firstYear);
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
      <g transform={`translate(${lineW + margin * 3},${h - margin})`}>
        {miniPieData[selectYear - firstYear].map((item, i) => {
          const percentage =
            ((item.endAngle - item.startAngle) / (2 * Math.PI)) * 100;
          const labelPosition = arcGenerator.centroid(item);
          const labelX = labelPosition[0] * 1.5;
          const labelY = labelPosition[1] * 1.5;

          const handleArcMouseEnter = () => {
            setSelectMiniArcIndex(i);
            setHighlightData(item);
            handleMakerMouseEnter(i);
          };

          const handleArcMouseLeave = () => {
            setSelectMiniArcIndex(-1);
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

              {selectMiniArcIndex === i && (
                <path d={overlayArcGenerator(item)} fill="skyblue" />
              )}
              {percentage >= 3 && (
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
              )}
            </g>
          );
        })}
        <text y={h / 3} textAnchor="middle" fontSize="15px">
          {selectYear}年
        </text>
      </g>
    </g>
  );
};

export default Circle;
