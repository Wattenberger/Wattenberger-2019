import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import Select from 'react-select';
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from 'components/_ui/Chart/Chart';
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Axis from 'components/_ui/Chart/Axis/Axis';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

// import data from "./WDVP Datasets - the future of government"
// import data from "./WDVP Datasets - what makes a 'good' government.json"
import data from "./Wdvp_gov_score.json"
// import data from "./WDVP Datasets - small countries are beautiful"

import './WDVP.scss'

console.log(data)
const dataByContinent = _.fromPairs(_.map(data, d => [
  d.Continent,
  d,
]))
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
const margin = {
  top: 2,
  right: 20,
  bottom: 30,
  left: 50,
}
const formatNumber = d => numeral(d).format("0,0")
const formatNumberShort = d => numeral(d).format("0,0a")
const ordinalColors = ["#63cdda", "#cf6a87", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]; // "#e77f67", "#778beb",
// const continents = _.uniq(_.map(data, "Continent"))

const continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const continentNameToCodeMap = _.fromPairs(_.map(continents, c => [
  c.value,
  c.code,
]))
const continentColors = _.fromPairs(_.map(continents, c => [
  c.code,
  c.color,
]))
const continentOptions = _.map(continents, continent => ({ value: continent, label: continent, color: continentColors[continent] }))
// const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const countryOptions = _.map(data, country => ({ value: country.Country, label: country.Country, color: continentColors[country.Continent] }))

class WDVP extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
      xScale: null,
      yScale: null,
      filteredData: [],
      tooltipInfo: null,
      closestCountries: null,
      selectedCountries: [],
      selectedContinents: [],
      iteration: 0,
      xMetric: "government effectiveness",
      yMetric: "political stability & absence of violence",
      showingPointLabels: {},
    }
  }

  getClassName() {
    return classNames("WDVP", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }

  chart = React.createRef()

  createScales = () => {
    const { selectedCountries, selectedContinents, selectedGroups } = this.state

    const height = 500
    const width = window.innerWidth * 0.9

    const selectedContinentValues = _.map(selectedContinents, "code")
    // const selectedGroupValues = _.map(selectedGroups, "value")
    const filteredData = _.filter(data, d => (
      (_.isEmpty(selectedContinents) || _.includes(selectedContinentValues, d.Continent))
      // && (_.isEmpty(selectedGroups) || _.includes(selectedGroupValues, d.group))
    ))

    const xScale = createScale({
      // type: "time",
      width,
      margin,
      clamp: false,
      dimension: "x",
      domain: d3.extent(filteredData, this.xAccessor),
    })

    const yScale = createScale({
      // type: "log",
      height,
      margin,
      clamp: false,
      dimension: "y",
      domain: d3.extent(filteredData, this.yAccessor),
    })
    const iteration = this.state.iteration + 1
    this.setState({ height, width, xScale, yScale, filteredData, iteration })
  }

  xAccessor = d => numberFromValue(d[this.state.xMetric])
  yAccessor = d => numberFromValue(d[this.state.yMetric])
  xAccessorScaled = (d,i) => this.state.xScale && this.state.xScale(this.xAccessor(d))
  yAccessorScaled = d => this.state.yScale && this.state.yScale(this.yAccessor(d))

  onMouseMove = (clientX, clientY) => {
    if (!this.chart || !this.chart.current) return
    const { width, xScale, yScale, filteredData } = this.state
    if (!this.isHoveringChart) return

    const mouseX = clientX - this.chart.current.getBoundingClientRect().left - margin.left
    const yearIndex = Math.round(xScale.invert(mouseX))
    const year = yearIndex + 1926

    const mouseY = clientY - this.chart.current.getBoundingClientRect().top - margin.top
    const mouseYVal = yScale.invert(mouseY)

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
  onCountriesSelect = countries => this.setState({ selectedCountries: countries }, this.createScales)
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
    const { height, width, xScale, yScale, xMetric, yMetric, tooltipInfo, selectedCountries, selectedContinents, filteredData, iteration, showingPointLabels } = this.state
    const selectedCountryValues = _.map(selectedCountries, "value")

    return (
      <div className={this.getClassName()}>
        <div className="WDVP__title-container">
          <h2 className="WDVP__title">
            Country Metric Explorer
          </h2>
        </div>
        <div className="WDVP__contents">
          <div className="WDVP__controls">
            <div className="WDVP__sentence">
              Show me countries in
                {/* <Select
                  isMulti
                  name="continents"
                  options={continentOptions}
                  value={selectedContinents}
                  className="WDVP__select"
                  classNamePrefix="WDVP__select"
                  styles={selectStyles}
                  onChange={this.onContinentsSelect}
                /> */}

                <RadioGroup
                  className="WDVP__toggle"
                  options={continents}
                  value={selectedContinents}
                  onChange={this.onContinentsSelect}
                  isMulti
                  canClear
                />
                and plot them based on
                  <div className="WDVP__sentence__group">
                    <div className="WDVP__select__group">
                      <div className="WDVP__select-add-on">y</div>
                      <Select
                        className="WDVP__select"
                        classNamePrefix="WDVP__select"
                        options={metricOptionsVerbose}
                        value={{value: yMetric, label: yMetric}}
                        styles={selectStyles}
                        onChange={this.onMetricChange("y")}
                      />
                    </div>
                    vs
                    <div className="WDVP__select__group">
                      <div className="WDVP__select-add-on">x</div>
                      <Select
                        className="WDVP__select"
                        classNamePrefix="WDVP__select"
                        options={metricOptionsVerbose}
                        value={{value: xMetric, label: xMetric}}
                        styles={selectStyles}
                        onChange={this.onMetricChange("x")}
                      />
                    </div>
                  </div>
                </div>
              <div className="WDVP__aside">
                I'm especially interested in
                <Select
                  isMulti
                  name="countries"
                  options={countryOptions}
                  value={selectedCountries}
                  className="WDVP__select"
                  classNamePrefix="WDVP__select"
                  styles={selectStyles}
                  onChange={this.onCountriesSelect}
                />
            </div>
          </div>
          <div className={`WDVP__chart WDVP__chart--has-${selectedCountryValues.length ? "selected-countries" : "no-selected-countries"}`} ref={this.chart}>
            <Chart
              width={width}
              height={height}
              margin={margin}>

              <Axis
                dimension="x"
                height={height}
                width={width}
                margin={margin}
                scale={xScale}
                format={formatNumber}
                label={xMetric}
              />
              <Axis
                dimension="y"
                height={height}
                margin={margin}
                scale={yScale}
                format={formatNumber}
                label={yMetric}
              />

              {_.map(filteredData, country => (
                <WDVPCountry
                  key={country.Country}
                  name={country.Country}
                  color={continentColors[country.Continent]}
                  x={this.xAccessorScaled(country)}
                  y={this.yAccessorScaled(country)}
                  isSelected={_.includes(selectedCountryValues, country.Country)}
                />
              ))}

              {_.map(filteredData, country => (
                <WDVPCountryHighlight
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
                  className="WDVP__crosshair"
                  x={tooltipInfo.x}
                  y={margin.top}
                  width={1}
                  height={height - margin.top - margin.bottom}
                />
              )}
            </Chart>

            {tooltipInfo && (
              <WDVPTooltip
                style={{transform: `translate3d(calc(-50% + ${tooltipInfo.boundedX}px), calc(-100% + ${tooltipInfo.y}px), 0)`}}
                {...tooltipInfo}
              />
            )}
          </div>
        </div>
    </div>
    )
  }
}

export default WDVP


const WDVPTooltip = ({ continents, year, x, boundedX, y, ...props }) => (
  <div className="WDVPTooltip" {...props}>
    <h6 className="WDVPTooltip__header">{ year }</h6>
    <div className="WDVPTooltip__continents">
      {_.map(continents, continent => _.isObject(continent) && (
        <div className={`WDVPTooltip__continent WDVPTooltip__continent--is-${continent.isSelected ? "selected" : "not-selected"}`} key={continent.continent}>
          <div className="WDVPTooltip__continent-color" style={{background: continentColors[continent]}} />
          <div className="WDVPTooltip__continent__index">
            { continent.index }.
          </div>
          <div className="WDVPTooltip__continent__label">
            { continent.continent }
          </div>
          <div className="WDVPTooltip__continent__value">
            { formatNumber(continent.value) }
          </div>
        </div>
      ))}
    </div>
  </div>
)

const WDVPCountry = React.memo(({ color, x, y }) => _.isFinite(x) && _.isFinite(y) && (
  <circle
    className="WDVPCountry"
    cx={x}
    cy={y}
    r={5}
    fill={color}
  />
))

const WDVPCountryHighlight = React.memo(({ name, color, x, y, isSelected, isShowingLabels }) => _.isFinite(x) && _.isFinite(y) && (
  <g className="WDVPCountryHighlight">
    <circle
      className="WDVPCountryHighlight__outline"
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
        className="WDVPCountryHighlight__text-wrapper"
        style={{
          opacity: isShowingLabels || isSelected ? 1 : 0,
      }}>
        <text
          className="WDVPCountryHighlight__text"
          x={x}
          y={y - 13}
          // fill={color}
          stroke="white"
          strokeWidth="3"
          >
          { name }
        </text>
        <text
          className="WDVPCountryHighlight__text"
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


const selectStyles = {
  colors: {
    primary: "#114D4D",
    primary50: "#e0e9ee",
    primary25: "#e0e9ee",
  },
  borderRadius: 6,
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? `${data.color}22` : null,
      color: isDisabled
        ? '#e0e9ee'
        : isSelected
          ? "white"
          : data.color,
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: `${data.color}22`,
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  })
}