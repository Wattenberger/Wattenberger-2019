async function drawScatter() {
  // load data
  let dataset = await d3.csv("./../data.csv")
  // const dataset = await d3.json("./my_weather_data.json")
  // console.table(dataset[0])

  // set data constants
  const xAccessor = d => +d.HoursEstimate
  const yAccessor = d => +d.HoursActual

  const width = d3.min([
    window.innerWidth * 0.95,
    window.innerHeight * 0.95,
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // create chart area
  const wrapper = d3.select("body")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // create scales
  const xScale = d3.scaleLinear()
    // .domain(d3.extent(dataset, xAccessor))
    .domain([0, 250])
    .range([0, dimensions.boundedWidth])
    // .nice()

  const yScale = d3.scaleLinear()
    // .domain(d3.extent(dataset, yAccessor))
    .domain([0, 250])
    .range([dimensions.boundedHeight, 0])
    // .nice()

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

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html("estimated hours")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .attr("fill", "black")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")
      .style("font-size", "1.4em")
      .text("actual hours")
}
drawScatter()