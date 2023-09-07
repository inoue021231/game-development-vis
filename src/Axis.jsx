import "./App.css";

const Axis = ({
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
}) => {
  const padding = 5;
  return (
    <g>
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
      {xScale.ticks().map((item, i) => {
        return (
          <g transform={`translate(${xScale(item)},0) scale(1,-1)`} key={i}>
            <line y1={padding} stroke="gray"></line>
            <text
              y={padding}
              textAnchor="middle"
              dominantBaseline="text-before-edge"
            >
              {item + firstYear}
            </text>
            <line y1={-h + margin} stroke="lightgray"></line>
          </g>
        );
      })}
      <g transform={`translate(${0},${-margin + padding * 3}) scale(1,-1)`}>
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
    </g>
  );
};

export default Axis;
