/* import Data from "./data.json"; */
import { useState, useEffect } from "react";
import * as d3 from "d3";
import Chart from "./Chart";
import "./App.css";

const AreaChart = ({ data }) => {
  const makerCount = 10;
  const years = Object.keys(data).sort();
  const lastYear = years[years.length - 1];
  const topRankMaker = data[lastYear]
    .slice(0, makerCount)
    .map((item) => item["メーカー"]);
  const stackedvalue = years.map((year, i) => {
    const topRankData = topRankMaker.map((name, j) => {
      const d = data[year].find((item) => item["メーカー"] === topRankMaker[j]);
      let price = 0;
      if (d) {
        price = Number(d["総販売本数"]);
      }
      return [name, price];
    });

    const topObject = Object.fromEntries(topRankData);
    return {
      year: Number(year),
      ...topObject,
    };
  });

  /* const xScale = d3
    .scaleLinear()
    .domain([0, yearCount - 1])
    .range([0, lineW])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...salesFigures)])
    .range([0, h - margin])
    .nice(); */

  console.log(stackedvalue);
  return <p></p>;
};

export default AreaChart;
