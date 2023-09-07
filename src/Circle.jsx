import "./App.css";
import * as d3 from "d3";

const Circle = ({
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
}) => {
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(120);
  const overlayArcGenerator = d3.arc().innerRadius(0).outerRadius(120);
  return (
    <g>
      <g transform={`translate(${lineW + margin * 3},${h - 60})`}>
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
    </g>
  );
};

export default Circle;
