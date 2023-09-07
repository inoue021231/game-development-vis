import Data from './data.json';
import { useState, useEffect } from 'react';
import * as d3 from "d3";
import './App.css';

const Total = (props) => {
    const {xArray, margin, h, totalSales, totalScale} = props

    return <g>
        <g transform={`translate(${xArray[9].x + margin / 2},${h / 2}) rotate(270) scale(1,-1)`}>
            <text>年別総販売本数</text>
        </g>

        <g transform={`translate(${xArray[9].x},${h - margin}) scale(1,-1)`}>
            <text y="-10" textAnchor='start'>{`(万本)`}</text>
        </g>

        <g transform={`translate(${xArray[9].x + 80},${h - margin + 10}) scale(1,-1)`}>
            <line x1="10" strokeDasharray="5 2" stroke="black"></line>
            <text x="20" dominantBaseline="central">年別総販売本数</text>
        </g>

        {totalScale.ticks().map((item, i) => {
            return <g transform={`translate(${xArray[9].x},${totalScale(item)}) scale(1,-1)`} key={i}>
                <text x="5" textAnchor='start' dominantBaseline="central">{item / 10000}</text>
            </g>
        })}

        {totalSales.map((_, i) => {
            if (i !== 0) {
                return <line x1={xArray[i - 1].x} y1={totalScale(totalSales[i - 1])} x2={xArray[i].x} y2={totalScale(totalSales[i])} stroke='black' strokeDasharray="5 3" key={i}></line>
            } else {
                return <div key={i}></div>;
            }
        })}
    </g>
}

export default Total