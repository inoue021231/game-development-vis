import "./App.css";

const Axis = ({ w, h, margin, xScale, firstYear, padding }) => {
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
    </g>
  );
};

export default Axis;
