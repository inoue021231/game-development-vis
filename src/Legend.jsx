const Legend = ({
  w,
  h,
  margin,
  color,
  topRankList,
  xScale,
  yearCount,
  handleMakerMouseEnter,
  handleMakerMouseLeave,
  handleChangeMaker,
  highlightMakerIndex,
  selectMakerList,
}) => {
  const legendW = w / 3;
  return (
    <g>
      {topRankList.map((item, i) => {
        return (
          <g
            transform={`translate(${xScale(yearCount - 1) + 60},${
              h - margin - 20 * i
            }) scale(1,-1)`}
            key={i}
            onMouseEnter={() => handleMakerMouseEnter(i)}
            onMouseLeave={handleMakerMouseLeave}
            onClick={() => {
              handleChangeMaker(i);
            }}
            style={{ cursor: "pointer" }}
          >
            {selectMakerList[i] && (
              <rect
                x="0"
                y="-5"
                width={legendW}
                height="20"
                fill="skyblue"
                opacity="0.5"
              />
            )}

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
  );
};

export default Legend;
