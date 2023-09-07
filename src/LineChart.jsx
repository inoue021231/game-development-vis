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
          <g fill="none" key={i}>
            {highlightMakerIndex === i && (
              <path d={linePath} stroke="skyblue" strokeWidth="8"></path>
            )}
            <path
              d={linePath}
              stroke={
                highlightMakerIndex === i || highlightMakerIndex === -1
                  ? color(i)
                  : "gray"
              }
              strokeWidth="2"
            ></path>
            <path
              d={linePath}
              stroke="transparent"
              strokeWidth="20"
              onMouseEnter={() => handleMakerMouseEnter(i)}
              onMouseLeave={handleMakerMouseLeave}
            ></path>
          </g>
        );
      })}
    </g>
  );
};

const LinePlot = ({ selectLine, selectMaker, color }) => {
  return (
    <g>
      <path
        d={selectLine}
        stroke={color(selectMaker)}
        strokeWidth="2"
        style={{ transition: "1s" }}
        fill="none"
      ></path>
    </g>
  );
};

const LineChart = ({
  h,
  margin,
  padding,
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
      {selectMaker === -1 ? (
        <g>
          {yScale.ticks().map((item, i) => {
            return (
              <g transform={`translate(0,${yScale(item)}) scale(1,-1)`} key={i}>
                <line x1={-padding} stroke="gray"></line>
                <text x={-padding} textAnchor="end" dominantBaseline="central">
                  {item / 10000}
                </text>
                <line x1={xScale(yearCount - 1)} stroke="lightgray"></line>
              </g>
            );
          })}
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
        </g>
      ) : (
        <g>
          {yScaleArray[selectMaker].ticks(10).map((item, i) => {
            return (
              <g
                transform={`translate(0,${yScaleArray[selectMaker](
                  item
                )}) scale(1,-1)`}
                key={i}
              >
                <line x1={-padding} stroke="gray"></line>
                <text x={-padding} textAnchor="end" dominantBaseline="central">
                  {item / 10000}
                </text>
                <line x1={xScale(yearCount - 1)} stroke="lightgray"></line>
              </g>
            );
          })}
          <LinePlot
            {...{
              selectLine,
              selectMaker,
              color,
            }}
          ></LinePlot>
        </g>
      )}
    </g>
  );
};

export default LineChart;
