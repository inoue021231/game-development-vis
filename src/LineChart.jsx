const LineChart = ({
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
      {NYScale.map((item, i) => {
        return (
          <g
            transform={`translate(0,${
              ((h - margin) * i) / (NYScale.length - 1)
            }) scale(1,-1)`}
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
      {newlinearray.map((item, i) => {
        let flag = false;
        if (highlightMakerIndex !== -1) {
          flag = !selectMakerList[highlightMakerIndex];
        }
        return item !== null ? (
          <g fill="none" key={i}>
            {highlightMakerIndex === i && highlightFlag && (
              <path d={item} stroke="skyblue" strokeWidth="8"></path>
            )}
            <path
              d={item}
              stroke={
                highlightMakerIndex === i || highlightMakerIndex === -1 || flag
                  ? color(i)
                  : "gray"
              }
              strokeWidth="2"
              style={{ transition: "d 0.5s" }}
              onTransitionEnd={() => setHighlightFlag(true)}
              key={i}
            ></path>
            <path
              d={item}
              stroke="transparent"
              strokeWidth="20"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => handleMakerMouseEnter(i)}
              onMouseLeave={handleMakerMouseLeave}
            ></path>
          </g>
        ) : (
          <g key={i}></g>
        );
      })}
    </g>
  );
};

export default LineChart;
