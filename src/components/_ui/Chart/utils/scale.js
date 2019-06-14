import * as d3 from "d3"

const scaleTypes = {
  linear: d3.scaleLinear,
  ordinal: d3.scaleOrdinal,
  time: d3.scaleTime,
  log: d3.scaleLog,
}

export const createScale = (providedConfig) => {
  const defaultConfig = {
    type: "linear",
    dimension: "x",
    domain: [0, 1],
    margin: {top: 0, right: 0, bottom: 0, left: 0}
  }
  const config = {
    ...defaultConfig,
    ...providedConfig,
  }

  if (!config.range) {
    config.range = config.dimension == "x" ?
                      [0, config.width - config.margin.right - config.margin.left] :
                      [config.height - config.margin.top - config.margin.bottom, 0]
  }

  let scale = (scaleTypes[config.type] || config.type)()
  scale.range(config.range)
       .domain(config.domain)
  if (config.clamp) scale.clamp(config.clamp)

  return scale
}