import React, { useRef, useEffect } from "react"
import * as d3 from "d3"
import dataUrl from "./data.csv"

import "./D3AndReactExample.scss"

const width = 500
const height = 500
const D3AndReactExample = () => {
  const ref = useRef()

  const drawDots = async () => {
    const dataset = await d3.csv(dataUrl)
    console.log("dataset")

    // set data constants
    const xAccessor = d => +d.HoursEstimate
    const yAccessor = d => +d.HoursActual

    // create chart area
    const bounds = d3.select(ref.current)

    // create scales
    const xScale = d3.scaleLinear()
      .domain([0, 250])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, 250])
      .range([height, 0])

    // draw the points
    const dots = bounds.selectAll(".dot")
      .data(dataset, d => d.TaskNumber)

    const newDots = dots.enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))

    // draw axes
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
      .ticks(4)

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${height}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", width - 10)
        .attr("y", -10)
        .style("text-anchor", "end")
        .html("estimated hours")

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(4)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("x", 6)
        .attr("y", 5)
        .style("text-anchor", "start")
        .text("actual hours")
  }

  useEffect(() => {
    drawDots()
  }, [])

  return (
    <svg
      className="D3AndReactExample"
      ref={ref}
      style={{
        width,
        height,
      }}
    />
  )
}

export default D3AndReactExample