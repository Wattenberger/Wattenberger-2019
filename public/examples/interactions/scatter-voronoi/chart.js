async function drawScatter() {

  // 1. Access data

  let dataset = await d3.csv("./../data.csv")

  const summaryAccessor = d => d.Summary
  const actualHoursAccessor = d => +d.HoursActual
  const diffAccessor = d => +d.HoursEstimate - actualHoursAccessor(d)

  const xAccessor = d => +d.HoursActual
  const yAccessor = d => +d.HoursEstimate

  dataset = dataset.filter(d => xAccessor(d) < 500 && yAccessor(d) < 500)

  // Only use the first estimate per task (with highest actual hours)
  let usedTasks = {}
  dataset = dataset.filter(d => {
    const hours = actualHoursAccessor(d)
    if (usedTasks[summaryAccessor(d)]) {
      const hasHigherValue = hours > usedTasks[summaryAccessor(d)]
      if (!hasHigherValue) return false
    }
    usedTasks[summaryAccessor(d)] = hours
    return true
  })

  console.table(dataset[0])
  console.log(dataset)

  // 2. Create chart dimensions

  let dimensions = {
    width: 480,
    height: 480,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const drawDots = (dataset) => {

    // 5. Draw data

    const dots = bounds.selectAll(".dot")
      .data(dataset, d => d[0])

    const newDots = dots.enter().append("circle")

    const allDots = newDots.merge(dots)
        .attr("key", (d, i) => i)
        .attr("class", "dot")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 3)

    const oldDots = dots.exit()
        .remove()
  }
  drawDots(dataset)

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .html("Actual Hours")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .text("Estimated Hours")

  // 7. Set up interactions

  const delaunay = d3.Delaunay.from(
    dataset,
    d => xScale(xAccessor(d)),
    d => yScale(yAccessor(d)),
  )
  const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

  bounds.selectAll(".voronoi")
    .data(dataset)
    .enter().append("path")
      .attr("class", "voronoi")
      .attr("d", (d,i) => voronoi.renderCell(i))
      // .attr("stroke", "salmon")
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  const tooltipDot = bounds.append("g")
      .attr("class", "tooltip-dot")
      .attr("opacity", 0)
  tooltipDot.append("circle")
      .attr("class", "tooltip-dot-outside")
      .attr("r", 3)
  tooltipDot.append("circle")
      .attr("class", "tooltip-dot-inside")
      .attr("r", 3)

  function onMouseEnter(datum, index) {
    const formatHours = d3.format(",.0f")
    tooltip.select("#actual")
        .text(formatHours(xAccessor(datum)))

    tooltip.select("#estimated")
        .text(formatHours(yAccessor(datum)))

    const diff = diffAccessor(datum)
    const diffFormat = d3.format(",.1f")
    tooltip.select("#title")
        .text([
          diffFormat(Math.abs(diff)),
          "hours",
          diff < 0 ? "under-estimated" : "over-estimated"
        ].join(" "))

    let usedSummaries = []
    const relevantTasks = dataset.filter(d => {
      const isStacked = xAccessor(d) == xAccessor(datum)
        && yAccessor(d) == yAccessor(datum)
      if (!isStacked) return false
      if (usedSummaries.includes(summaryAccessor(d))) return false
      usedSummaries.push(summaryAccessor(d))
      return true
    })

    tooltip.select("#tasks")
        .html(
          relevantTasks.slice(0, 3).map(d => (
            summaryAccessor(d)
          )).join("<br />")
        )

    const x = xScale(xAccessor(datum))
      + dimensions.margin.left
    const y = yScale(yAccessor(datum))
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)


    tooltip.style("opacity", 1)
    tooltipDot.style("opacity", 1)
      .style("transform", [
        "translate(",
        xScale(xAccessor(datum)),
        "px, ",
        yScale(yAccessor(datum)),
        "px)",
      ].join(""))

    const hoveredDot = bounds.select(`.dot[key='${index}']`)
    hoveredDot.classed("hovered", true)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
    tooltipDot.style("opacity", 0)
    bounds.selectAll(".dot").classed("hovered", false)
  }
}
drawScatter()