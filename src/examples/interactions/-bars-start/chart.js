async function drawBars() {

  // 1. Access data
  let dataset = await d3.csv("./../data.csv")

  const summaryAccessor = d => d.Summary
  const actualHoursAccessor = d => +d.HoursActual
  const developerHoursAccessor = d => +d.DeveloperHoursActual

  // Only use the first estimate per task (with highest actual hours)
  let usedTasks = {}
  dataset = dataset.filter(d => {
    const hours = actualHoursAccessor(d)
    if (usedTasks[summaryAccessor(d)]) {
      const hasHigherValue = hours > usedTasks[summaryAccessor(d)]
      if (!hasHigherValue) return false
    }
    usedTasks[summaryAccessor(d)] = hours
    return actualHoursAccessor(d) > 10
  })

  const diffAccessor = d => +d.HoursEstimate - actualHoursAccessor(d)
  dataset = dataset.filter(d => (
    diffAccessor(d) >= -50
    && diffAccessor(d) <= 50
  ))
  const yAccessor = d => d.length

  // 2. Create chart dimensions

  const width = 600
  let dimensions = {
    width: width,
    height: width * 0.5,
    margin: {
      top: 35,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  const background = bounds.append("g")

  // init static elements
  bounds.append("g")
      .attr("class", "bins")
  bounds.append("line")
      .attr("class", "mean")
  bounds.append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)
    .append("text")
      .attr("class", "x-axis-label")

  // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, diffAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const binsGenerator = d3.bin()
    .domain(xScale.domain())
    .value(diffAccessor)
    .thresholds(30)

  const bins = binsGenerator(dataset)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  // 5. Draw data

  const barPadding = 1.5

  let binGroups = bounds.select(".bins")
    .selectAll(".bin")
    .data(bins)

  binGroups.exit()
      .remove()

  const newBinGroups = binGroups.enter().append("g")
      .attr("class", "bin")

  newBinGroups.append("rect")

  // update binGroups to include new points
  binGroups = newBinGroups.merge(binGroups)

  const barRects = binGroups.select("rect")
      .attr("x", d => xScale(d.x0) + barPadding)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("height", d => (
        dimensions.boundedHeight - yScale(yAccessor(d))
      ))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))

  const mean = d3.mean(dataset, diffAccessor)

  const meanLine = bounds.selectAll(".mean")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -20)
      .attr("y2", dimensions.boundedHeight)

  const meanLabel = bounds.append("text")
      .attr("class", "mean-label")
      .attr("x", xScale(mean))
      .attr("y", -25)
      .text("mean")

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.select(".x-axis")
    .call(xAxisGenerator)

  const xAxisLabel = xAxis.select(".x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .text("Hours over-estimated")

  const backgroundLeft = background.append("rect")
      .attr("class", "background left-side-background")
      .attr("y", -20)
      .attr("width", dimensions.boundedWidth / 2)
      .attr("height", dimensions.boundedHeight + 20)

  const backgroundRight = background.append("rect")
      .attr("class", "background right-side-background")
      .attr("x", dimensions.boundedWidth / 2 + 1)
      .attr("y", -20)
      .attr("width", dimensions.boundedWidth / 2 - 1)
      .attr("height", dimensions.boundedHeight + 20)

  const leftSideLabel = background.append("text")
      .attr("class", "label left-side-label")
      .attr("x", 10)
      .attr("y", 0)
      .text("Under-estimated")

  const rightSideLabel = background.append("text")
      .attr("class", "label right-side-label")
      .attr("x", dimensions.boundedWidth - 10)
      .attr("y", 0)
      .text("Over-estimated")

  // 7. Set up interactions



}
drawBars()