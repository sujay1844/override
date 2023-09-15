import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  value: number;
  ishighlighted: boolean;
}

interface LineGraphProps {
  data: DataPoint[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  width,
  height,
  margin = { top: 20, right: 20, bottom: 30, left: 40 }, // Default margins
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Create a group element for the graph content and apply margins
    const g = svg
      .selectAll(".chart")
      .data([null])
      .join("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Clear existing axes before redrawing
    g.selectAll(".x-axis").remove();
    g.selectAll(".y-axis").remove();

    // Draw x-axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // Draw y-axis
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    const line = d3
      .line<DataPoint>()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.value));

    // Draw the line
    g.selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue");

    // Draw circles for DataPoints
    g.selectAll(".datapoint")
      .data(data)
      .join("circle")
      .attr("class", "datapoint")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", (d) => (d.ishighlighted ? 10 : 3))
      .attr("fill", (d) => (d.ishighlighted ? "red" : "steelblue"))
      .attr("stroke", "white")
      .attr("stroke-width", 2);
  }, [data, width, height, margin, innerHeight, innerWidth]);

  return (
    <svg width={width} height={height}>
      <g ref={svgRef} />
    </svg>
  );
};

export default LineGraph;
