  import React, {Component} from "react"
import * as d3 from "d3"
import { interpolatePRGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

// import data from "./WDVP Datasets - the future of government"
import rawData from "./Wdvp_gov_score.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
// import data from "./WDVP Datasets - small countries are beautiful"
import WDVPScatter from './WDVPScatter'

import './WDVPGrid.scss'

// console.log(rawData)

const ordinalColors = ["#63cdda", "#cf6a87", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]; // "#e77f67", "#778beb", 
const numberFromValue = value =>
  _.isFinite(value) ? value : 
  _.isString(value) ? +value.replace(/,/g, "") :
  null

let continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const interpolatedColorScale = createScale({
  domain: [0, continents.length - 1],
  range: ["#63cdda", "#cf6a87"]
})
const blackAndWhiteColorScale = d3.scaleSequential(interpolatePRGn)
const highlightColorScale = createScale({
  domain: [0, 1],
  range: ["#fff", "#45aeb1"]
})
continents = _.map(continents, (continent, i) => ({...continent, color: d3.interpolatePlasma(i /( continents.length - 1))}))
const continentColorScales = _.fromPairs(
  _.map(continents, continent => [
    continent.code,
    createScale({
      domain: [-0.3, 0.6, 1.2],
      range: ["#fff", continent.color, "#000"],
    }),
  ])
)
const percentileOrRawOptions = [{
  value: true,
  label: "Percentile",
},{
  value: false,
  label: "Value",
}]
const colorModeOptions = [{
  value: "normal",
  label: "All the same",
},{
  value: "continents",
  label: "Continents",
}]
const defaultMetrics = _.map(metricRankedCorrelationData, "fieldname")
const metricCorrelationSorts = _.fromPairs(
  _.map(metricRankedCorrelationData, metric => [
    metric.fieldname,
    metric.RankedCorrelationWithOtherFields,
  ])
)
const metricsColorScale = createScale({
  domain: [0, defaultMetrics.length - 1],
  range: ["#63cdda", "#e77f67"],
})
class WDVPGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      metrics: defaultMetrics,
      scales: {},
      sort: defaultMetrics[0],
      processedData: [],
      selectedContinents: [],
      hoveredCountry: null,
      isAscending: true,
      colorMode: "continents",
      isShowingPercentile: true,
    }
  }

  getClassName() {
    return classNames("WDVPGrid", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }
  chart = React.createRef()

  createScales = () => {
    const { sort, selectedContinents, isAscending, isShowingPercentile } = this.state

    const sortedMetrics = _.map(metricCorrelationSorts[sort], index => defaultMetrics[index - 1])
    // const metricIndices = _.zipObject(defaultMetrics, metricCorrelationSorts[sort])
    // console.log(metricCorrelationSorts, defaultMetrics)
    // const sortedMetrics = _.orderBy(
    //   defaultMetrics,
    //   metric => {console.log(metric, metricIndices[metric]); return metricIndices[metric]},
    //   "asc",
    // )

    const selectedContinentValues = _.map(selectedContinents, "code")

    const sortedData = _.orderBy(
      rawData,
      [d => d[`${sort}__percentile`]],
      [isAscending ? "asc" : "desc"]
    )
    const filteredData = _.isEmpty(selectedContinents) ? sortedData :
      _.filter(sortedData, d => _.includes(selectedContinentValues, d.Continent))

    const scales = _.fromPairs(
      _.map(defaultMetrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(sortedData, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ scales, processedData: filteredData, metrics: sortedMetrics })
  }

  onChangeSort = metric => metric == this.state.sort ?
    this.setState({ isAscending: !this.state.isAscending }, this.createScales) :
    this.setState({ sort: metric, isAscending: this.state.isShowingPercentile ? true : false }, this.createScales)
    
  onContinentsSelect = continents => this.setState({ selectedContinents: continents }, this.createScales)
  onColorModeOptionsSelect = newVal => this.setState({ colorMode: newVal.value })
  onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value, isAscending: !this.state.isAscending }, this.createScales)
  onCountryHover = country => this.setState({ hoveredCountry: country })

  render() {
    const { processedData, metrics, selectedContinents, scales, sort, hoveredCountry, colorMode, isAscending, isShowingPercentile } = this.state

    return (
      <div className={this.getClassName()}>
        <h2 className="WDVPGrid__title">
          Country Metric Explorer
        </h2>
        <div className="WDVPGrid__contents">
        
          <RadioGroup
            className="WDVPGrid__toggle"
            options={continents}
            value={selectedContinents}
            onChange={this.onContinentsSelect}
            isMulti
            canClear
          />
        
          <RadioGroup
            className="WDVPGrid__toggle"
            options={percentileOrRawOptions}
            value={isShowingPercentile}
            onChange={this.onIsShowingPercentileSelect}
          />
        
          <RadioGroup
            className="WDVPGrid__toggle"
            options={colorModeOptions}
            value={colorMode}
            onChange={this.onColorModeOptionsSelect}
          />
          
          <div className="WDVPGrid__chart">
            {/* <div className="WDVPGrid__header">
              {_.map(processedData, country => (
                <div
                  key={country.Country}
                  className={`WDVPGrid__header__item WDVPGrid__header__item--is-${hoveredCountry == country.Country ? "hovered" : "not-hovered"}`}>
                  <div className="WDVPGrid__header__item__text">
                    { country.Country }
                  </div>
                </div>
              ))}
            </div> */}
            {/* <div className="WDVPGrid__metrics">
              {_.map(metrics, metric => (
                <div
                  key={metric}
                  className={`WDVPGrid__metrics__item WDVPGrid__metrics__item--is-${sort == metric ? "selected" : "not-selected"}`}
                  onClick={this.onChangeSort(metric)}>
                  { metric }x
                </div>
              ))}
            </div> */}
          
            <WDVPGridChart
              data={processedData}
              metrics={metrics}
              sort={sort}
              scales={scales}
              colorMode={colorMode}
              isShowingPercentile={isShowingPercentile}
              onCountryHover={this.onCountryHover}
              onMetricClick={this.onChangeSort}
            />
            
            <WDVPScatter
              data={processedData}
              xMetric={metrics[0]}
              yMetric={_.last(metrics)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default WDVPGrid


class WDVPGridChart extends Component {
  state = {
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.9,
    margins: {
      top: 150,
      right: 0,
      bottom: 50,
      left: 160,
    }
  }
  container = React.createRef()

  componentDidMount() {
    this.createScales()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != this.props.data) this.createScales()
    if (prevProps.isShowingPercentile != this.props.isShowingPercentile) this.drawData()
    if (prevProps.Continent != this.props.Continent) this.drawData()
  }

  createScales = () => {
    const { data, metrics } = this.props
    const { width, height, margins } = this.state
    const boundedHeight = height - margins.top - margins.bottom
    const boundedWidth = width - margins.left - margins.right
    const xScale = createScale({
      domain: [0, data.length],
      range: [0, boundedWidth],
    })
    const yScale = createScale({
      domain: [0, metrics.length],
      range: [boundedHeight, 0],
      orientation: "y",
    })
    this.setState({ xScale, yScale }, this.drawData)
  }

  drawData = () => {
    if (!this.container.current) return
    const { data, metrics, scales, sort, colorMode, isShowingPercentile, onCountryHover, onMetricClick } = this.props
    const { width, height, margins, xScale, yScale } = this.state

    if (_.isEmpty(data)) return;

    const reformattedData = _.map(data, (country, countryIndex) => ({
      name: country.Country,
      metrics: _.map(metrics, (metric, metricIndex) => ({
        metric,
        countryIndex,
        metricIndex,
        Continent: country.Continent,
        scaledValue: scales[metric](country[metric]),
        percentileValue: (country[`${metric}__percentile`] - 1) / 100,
      })),
    }))

    const bounds = d3.select(this.container.current)
        .on("mouseout", d => onCountryHover(null))
    const cellWidth = xScale(1) - xScale(0)
    const cellHeight = yScale(0) - yScale(1)
    const speedMultiplier = 3
    
    const metricElems = bounds.selectAll(".WDVPGridChart__metric")
        .data(metrics, d => d)
      metricElems.enter().append("text")
        .attr("class", "WDVPGridChart__metric")
        .on("click", onMetricClick)
      .merge(metricElems)
        .style("fill", d => d == sort ? "#45aeb1" : "inherit")
        .attr("x", -margins.left)
        .text(d => d)
      .transition(d3.transition().duration(900).ease(d3.easeLinear))
        .delay((d, i) => data.length * speedMultiplier + i * speedMultiplier + 900)
        .attr("y", (d, i) => yScale(metrics.length - i) + cellHeight * 0.6)
    
    let countries = bounds.selectAll(".WDVPGridChart__country")
        .data(reformattedData, d => d.name)
      
    const newCountries = countries.enter().append("g")
        .attr("class", "WDVPGridChart__country")
        .on("mouseover", d => onCountryHover(d.name))
        
    newCountries.append("text")
        .attr("class", "WDVPGridChart__country__text")
        .text(d => d.name)
        
    countries.merge(newCountries)
        .style("opacity", 0.2)
      .transition(d3.transition().duration(900).ease(d3.easeLinear))
        .delay((d,i) => i * speedMultiplier)
        .style("transform", (d, i) => `translateX(${xScale(i)}px)`)
        .style("opacity", 1)

    countries.exit().remove()

    // bounds.selectAll(".WDVPGridChart__country__text")
        // .attr("transform", `translate(-10px, ${cellWidth}px)`)

    const rects = bounds.selectAll(".WDVPGridChart__country").selectAll(".WDVPGridChart__rect")
        .data(d => d.metrics, d => d.metric)
        
    const getValue = d => isShowingPercentile ? d.percentileValue : d.scaledValue
    rects.enter().append("rect")
      .merge(rects)
        .attr("class", "WDVPGridChart__rect")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("fill", d =>
          !_.isFinite(getValue(d))  ? "#ccc" :
          colorMode == "continents" ? continentColorScales[d.Continent](getValue(d)) :
                                      blackAndWhiteColorScale(getValue(d))
        )
      .transition(d3.transition().duration(900).ease(d3.easeLinear))
        // .delay((d, i) => data.length * speedMultiplier + i * 10 + 900)
        .delay((d, i) => data.length * speedMultiplier + 900)
        .attr("y", d => yScale(metrics.length - d.metricIndex))
    rects.exit().remove()
  }

  render () {
    const { data } = this.props
    const { width, height, margins, xScale, yScale } = this.state

    return (
      <svg height={height} width={width}>
        <g
          ref={this.container}
          style={{
            transform: `translate(${margins.left}px, ${margins.top}px)`,
          }}
        />
      </svg>
    )
  }
}