'use client'
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface LineGraphProps {
  data: number[];
  width: number;
  height: number;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);

    // Define the dimensions of the graph
    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    // Remove the previous graph contents
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data) || 1]).nice().range([height - margin.bottom, margin.top]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);
    
    // Add x-axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom / 2)
      .attr('text-anchor', 'middle')
      .text('Time');

    // Add y-axis label
    svg
      .append('text')
      .attr('x', -(height / 2))
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Pressure');

    // Create line generator
    const line = d3.line<number>().x((d, i) => xScale(i)).y((d) => yScale(d));

    // Append the line to the SVG
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      {/* SVG container for the line graph */}
    </svg>
  );
};

export default LineGraph;
