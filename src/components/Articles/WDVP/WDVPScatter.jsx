import React, {Component} from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import numeral from "numeral"
import { interpolatePRGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';
import Select from 'react-select';
import selectStyles from './selectStyles';

import Chart from "components/_ui/Chart/Chart"
import Axis from "components/_ui/Chart/Axis/Axis"
import Scatter from "components/_ui/Chart/Scatter/Scatter"

// import data from "./WDVP Datasets - the future of government"
import rawData from "./Wdvp_gov_score.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
// import data from "./WDVP Datasets - small countries are beautiful"

import './WDVPScatter.scss'

const formatNumber = d => numeral(d).format("0,0")
const margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 50,
}
let continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const numberFromValue = value =>
  _.isFinite(value) ? value :
  _.isString(value) ? +value.replace(/,/g, "") :
  null

// const metricOptions = [
//   "population", "GDP", "GDP per km2", "land area (sq km)", "population density", "total foreign-born\npopulation", "% foreign-born population", "population living abroad (diaspora)", "population living abroad", "happy planet index", "world happiness report score", "human development index", "health expenditure", "education expenditure", "Area in km²", "Population"
// ]
const metricOptions = [
  "population", "surface area (Km2)", "happy planet index", "human development index", "world happiness report score", "sustainable economic development assessment (SEDA)", "GDP (billions PPP)", "GDP per capita (PPP)", "GDP growth (annual %)", "health expenditure % of GDP", "health expenditure per person", "education expenditure % of GDP", "education expenditure per person", "school life expectancy (years)", "unemployment (%)", "government spending score", "government expenditure (% of GDP)", "political rights score", "civil liberties score", "political stability & absence of violence", "government effectiveness", "regulatory quality", "rule of law", "control of corruption", "judicial effectiveness score", "government integrity score", "property rights score", "tax burden score", "overall economic freedom score", "financial freedom score", "women MPs (% of all MPs)", "Area in km²", "Population",
  "PCscore1", "PCscore2", "PCscore3", "PCscore4", "tSNE1", "tSNE2",
]
const metricOptionsVerbose = _.map(metricOptions, m => ({
  value: m,
  label: m,
  color: "#114D4D",
}))
const continentColors = _.fromPairs(_.map(continents, continent => [
  continent.code,
  continent.color,
]))
const countryOptions = _.map(rawData, country => ({ value: country.Country, label: country.Country, color: continentColors[country.Continent] }))

class WDVPScatter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
      filteredData: [],
      tooltipInfo: null,
      closestCountries: null,
      selectedCountries: [],
      selectedContinents: [],
      iteration: 0,
      showingPointLabels: {},
      scales: {},
      hoveredCountry: null,
      iterator: 0,
    }
  }
  chart = React.createRef()
  scatter = React.createRef()
  container = React.createRef()
  static propTypes = {
    data: PropTypes.array,
    xMetric: PropTypes.string,
    yMetric: PropTypes.string,
  }
  static defaultProps = {
    data: [],
  }

  getClassName() {
    return classNames("WDVPScatter", this.props.className)
  }

  componentDidMount() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.data != prevProps.data ||
      this.props.xMetric != prevProps.xMetric ||
      this.props.yMetric != prevProps.yMetric
    ) this.createScales()
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize)
  }

  onResize = () => {
    const width = Math.min(
      window.innerHeight * 0.8,
      this.container.current.clientWidth,
    )
    const height = width

    this.setState({width, height}, this.createScales)
  }

  createScales = () => {
    const { data } = this.props
    const { width, height, selectedCountries, selectedContinents, selectedGroups } = this.state

    const selectedContinentValues = _.map(selectedContinents, "code")
    // const selectedGroupValues = _.map(selectedGroups, "value")
    const filteredData = _.filter(data, d => (
      (_.isEmpty(selectedContinents) || _.includes(selectedContinentValues, d.Continent))
      // && (_.isEmpty(selectedGroups) || _.includes(selectedGroupValues, d.group))
    ))

    const scales = {
      x: createScale({
        // type: "time",
        width,
        margin,
        clamp: false,
        dimension: "x",
        domain: d3.extent(filteredData, this.xAccessor),
      }),
      y: createScale({
        // type: "log",
        height,
        margin,
        clamp: false,
        dimension: "y",
        domain: d3.extent(filteredData, this.yAccessor),
      })
    }
    const iteration = this.state.iteration + 1
    this.setState({ scales, filteredData, iteration })
  }
  onDotsUpdate = dots => {
    dots.style("fill", d => continentColors[d.Continent])
      .style("opacity", 1)
      // .style("transition", "all 0.9s ease-out")
  }

  xAccessor = d => numberFromValue(d[this.props.xMetric])
  yAccessor = d => numberFromValue(d[this.props.yMetric])
  xAccessorScaled = (d,i) => this.state.scales.x && this.state.scales.x(this.xAccessor(d))
  yAccessorScaled = d => this.state.scales.y && this.state.scales.y(this.yAccessor(d))

  onMouseMove = (clientX, clientY) => {
    if (!this.chart || !this.chart.current) return
    const { width, scales, filteredData } = this.state
    if (!this.isHoveringChart) return

    const mouseX = clientX - this.chart.current.getBoundingClientRect().left - margin.left
    const yearIndex = Math.round(scales.x.invert(mouseX))
    const year = yearIndex + 1926

    const mouseY = clientY - this.chart.current.getBoundingClientRect().top - margin.top
    const mouseYVal = scales.y.invert(mouseY)

    const parsedCountries = _.map(filteredData, country => ({
      ...country,
      value: country.GDP,
      distanceFromY: mouseYVal - country.GDP,
      absDistanceFromY: Math.abs(mouseYVal - country.GDP),
    }))
    const orderedCountries = _.map(_.orderBy(parsedCountries, "GDP", "desc"), (d, i) => ({...d, index: i + 1}))
    const continentsByYCloseness = _.orderBy(orderedCountries, "distanceFromY", "asc")
    const continentsByYAbsCloseness = _.orderBy(orderedCountries, "absDistanceFromY", "asc")
    const closestCountries = _.get(continentsByYAbsCloseness, [0, "Country"])
    const closestCountriesIndex = _.findIndex(continentsByYCloseness, {country: closestCountries})
    const neighborsOnEachSide = 3
    const closestCountriesIndexCenter = Math.max(Math.min(closestCountriesIndex, continentsByYCloseness.length - neighborsOnEachSide), neighborsOnEachSide)
    const closestCountries2 = _.map(
      continentsByYCloseness.slice(closestCountriesIndexCenter - neighborsOnEachSide, closestCountriesIndexCenter + neighborsOnEachSide),
      (country, i) => ({...country, isSelected: closestCountriesIndexCenter + i - neighborsOnEachSide == closestCountriesIndex }),
    )
    const x = mouseX
    const boundedX = Math.max(Math.min(width - 200, x), 0)

    const tooltipInfo = {
      countries: closestCountries2,
      year,
      y: mouseY,
      x,
      boundedX,
    }

    this.setState({ tooltipInfo, closestCountries })
  }
  throttledOnMouseMove = _.throttle(this.onMouseMove, 90)
  persistedOnMouseMove = e => this.throttledOnMouseMove(e.clientX, e.clientY)

  onMouseEnter = () => this.isHoveringChart = true;
  clearTooltip = () => {
    this.isHoveringChart = false;
    this.setState({ tooltipInfo: null, closestCountries: null })
  }
  onCountriesSelect = countries => {
    this.setState({ selectedCountries: countries }, this.createScales)
    if (this.props.onHighlightedCountriesChange) this.props.onHighlightedCountriesChange(countries)
  }
  onContinentsSelect = continents => this.setState({ selectedContinents: continents }, this.createScales)

  onMetricChange = axis => metric => this.setState({ [`${axis}Metric`]: metric.value }, this.createScales)

  onMouseEnterPoint = country => () => {
    const showingPointLabels = _.uniqBy([...this.state.showingPointLabels, country], "Country")
    this.setState({ showingPointLabels })
  }
  onMouseLeavePoint = country => () => {
    const showingPointLabels = _.reject(this.state.showingPointLabels, {Country: country.Country})
    this.setState({ showingPointLabels })
  }

  render() {
    const { data, xMetric, yMetric, angleOfMostVariance, vectorOfMostVariance } = this.props
    const { height, width, scales, tooltipInfo, selectedCountries, selectedContinents, filteredData, iteration, showingPointLabels } = this.state
    const selectedCountryValues = _.map(selectedCountries, "value")
    const meanX = scales.x && scales.x(_.meanBy(data, "xValue"))
    const meanY = scales.y && scales.y(_.meanBy(data, "yValue"))

    return (
      <div className={this.getClassName()}>
        <div className="WDVPScatter__contents">
          <div className="WDVPScatter__controls">
            <div className="WDVPScatter__sentence">
              Show me countries in
                {/* <Select
                  isMulti
                  name="continents"
                  options={continentOptions}
                  value={selectedContinents}
                  className="WDVPScatter__select"
                  classNamePrefix="WDVPScatter__select"
                  styles={selectStyles}
                  onChange={this.onContinentsSelect}
                /> */}

                <RadioGroup
                  className="WDVPScatter__toggle"
                  options={continents}
                  value={selectedContinents}
                  onChange={this.onContinentsSelect}
                  isMulti
                  canClear
                />
              </div>
              <div className="WDVPScatter__aside">
                I'm especially interested in
                <Select
                  isMulti
                  name="countries"
                  options={countryOptions}
                  value={selectedCountries}
                  className="WDVPScatter__select"
                  classNamePrefix="WDVPScatter__select"
                  styles={selectStyles}
                  onChange={this.onCountriesSelect}
                />
            </div>
          </div>
        </div>
        <div className="WDVPScatter__chart-wrapper" ref={this.container} style={{
          // transform: `rotateZ(${angleOfMostVariance}deg)`
        }}>
          <Chart
            height={height}
            width={width}
            margin={margin}
            ref={this.chart}
          >
            <Axis
              dimension="x"
              height={height}
              width={width}
              margin={margin}
              scale={scales.x}
              format={formatNumber}
              label={"x axis weights"}
            />
            <Axis
              dimension="y"
              height={height}
              margin={margin}
              scale={scales.y}
              format={formatNumber}
              label={"y axis weights"}
            />
            {_.map(filteredData, country => (
              <WDVPScatterCountry
                key={country.Country}
                name={country.Country}
                color={continentColors[country.Continent]}
                x={this.xAccessorScaled(country)}
                y={this.yAccessorScaled(country)}
                isSelected={_.includes(selectedCountryValues, country.Country)}
              />
            ))}

            {_.map(filteredData, country => (
              <WDVPScatterCountryHighlight
                key={country.Country}
                name={country.Country}
                color={continentColors[country.Continent]}
                x={this.xAccessorScaled(country)}
                y={this.yAccessorScaled(country)}
                isSelected={_.includes(selectedCountryValues, country.Country)}
                isShowingLabels={filteredData.length < 55}
              />
            ))}

            {tooltipInfo && (
              <rect
                className="WDVPScatter__crosshair"
                x={tooltipInfo.x}
                y={margin.top}
                width={1}
                height={height - margin.top - margin.bottom}
              />
            )}

            {_.isFinite(angleOfMostVariance) && _.isFinite(meanX) && (
              <WDVPScatterLine
                angle={angleOfMostVariance}
                meanX={meanX}
                meanY={meanY}
                width={width}
                height={height}
                margin={margin}
              />
            )}
          </Chart>

          {tooltipInfo && (
            <WDVPScatterTooltip
              style={{transform: `translate3d(calc(-50% + ${tooltipInfo.boundedX}px), calc(-100% + ${tooltipInfo.y}px), 0)`}}
              {...tooltipInfo}
            />
          )}
        </div>
      </div>
    )
  }
}

export default WDVPScatter



const WDVPScatterTooltip = ({ continents, year, x, boundedX, y, ...props }) => (
  <div className="WDVPScatterTooltip" {...props}>
    <h6 className="WDVPScatterTooltip__header">{ year }</h6>
    <div className="WDVPScatterTooltip__continents">
      {_.map(continents, continent => _.isObject(continent) && (
        <div className={`WDVPScatterTooltip__continent WDVPScatterTooltip__continent--is-${continent.isSelected ? "selected" : "not-selected"}`} key={continent.continent}>
          <div className="WDVPScatterTooltip__continent-color" style={{background: continentColors[continent]}} />
          <div className="WDVPScatterTooltip__continent__index">
            { continent.index }.
          </div>
          <div className="WDVPScatterTooltip__continent__label">
            { continent.continent }
          </div>
          <div className="WDVPScatterTooltip__continent__value">
            { formatNumber(continent.value) }
          </div>
        </div>
      ))}
    </div>
  </div>
)

const WDVPScatterCountry = React.memo(({ color, x, y }) => _.isFinite(x) && _.isFinite(y) && (
  <circle
    className="WDVPScatterCountry"
    cx={x}
    cy={y}
    r={5}
    fill={color}
  />
))

const WDVPScatterCountryHighlight = React.memo(({ name, color, x, y, isSelected, isShowingLabels }) => _.isFinite(x) && _.isFinite(y) && (
  <g className="WDVPScatterCountryHighlight">
    <circle
      className="WDVPScatterCountryHighlight__outline"
      cx={x}
      cy={y}
      r={9}
      style={{
        fill: "transparent",
        stroke: isSelected ? "#114D4D" : "transparent",
        strokeWidth: 4,
      }}
    />
      <g
        className="WDVPScatterCountryHighlight__text-wrapper"
        style={{
          opacity: isShowingLabels || isSelected ? 1 : 0,
      }}>
        <text
          className="WDVPScatterCountryHighlight__text"
          x={x}
          y={y - 13}
          // fill={color}
          stroke="white"
          strokeWidth="3"
          >
          { name }
        </text>
        <text
          className="WDVPScatterCountryHighlight__text"
          x={x}
          y={y - 13}
          stroke="0"
          fill="black"
          // fill={color}
        >
        { name }
      </text>
    </g>
  </g>
))

const WDVPScatterLine = ({ angle, meanX, meanY, width, height, margin }) => {
  const boundedWidth = width - margin.left - margin.right
  const boundedHeight = height - margin.top - margin.bottom
  const x1 = meanX + boundedWidth / 2 * Math.cos(angle / 180 * Math.PI)
  const y1 = meanY - boundedHeight / 2 * Math.sin(angle / 180 * Math.PI)
  const x2 = meanX - boundedWidth / 2 * Math.cos(angle / 180 * Math.PI)
  const y2 = meanY + boundedHeight / 2 * Math.sin(angle / 180 * Math.PI)
  const arrowWidth = 10
  const arrowHeight = 10

  return (
    <g
      style={{
        // transform: `rotate(${-angle}deg)`,
        // transformOrigin: "center center",
      }}>
        {/* <rect x="0" y="0" width={boundedWidth} height={boundedHeight} fill="none" stroke="green" /> */}
        {/* <text
          x={width - margin.left - margin.right / 2}
          y={meanY}>Axis of Good</text> */}
        <line
          className="WDVPScatter__line"
          // x1={meanX - ((width) / 2)}
          // y1={meanY}
          // x2={meanX + ((width) / 2)}
          // y2={meanY}
          // x1={meanX - vectorOfMostVariance[0] * 300}
          // y1={meanY + vectorOfMostVariance[1] * 300}
          // x2={meanX + vectorOfMostVariance[0] * 300}
          // y2={meanY - vectorOfMostVariance[1] * 300}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="black"
        />
        {/* <path d={"M " + [
          [width - arrowWidth / 2, meanY - arrowHeight / 2].join(" "),
          [width + arrowWidth / 2, meanY + 0].join(" "),
          [width - arrowWidth / 2, meanY + arrowHeight / 2].join(" "),
        ].join(" L ") + " Z"} /> */}
    </g>
  )
}