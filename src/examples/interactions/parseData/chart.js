async function drawBars() {
    const dataset = await d3.csv("./../data.csv")

    console.log(dataset)

    const diffAccessor = d => +d.HoursEstimate - +d.HoursActual
    const values = dataset.map(diffAccessor)

    console.log(values)

    const bins = d3.bin()
      // .domain(x.domain())
      // .thresholds(x.ticks(40))
      (values)

    console.log(bins)

  }
  drawBars()