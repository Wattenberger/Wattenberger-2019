import React, {Component, PureComponent} from "react"
import PropTypes from "prop-types"
import * as THREE from "three"
import OrbitControlsGenerator from "three-orbit-controls"
import TWEEN from "@tweenjs/tween.js"
import * as d3 from "d3"
import { interpolateRdYlGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';
import Tooltip from 'components/_ui/Tooltip/Tooltip';

import rawData from "./Wdvp_gov_score.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
import WDVPScatter from './WDVPScatter'

import './WDVPMetrics.scss'
const OrbitControls = OrbitControlsGenerator(THREE)

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
const continentColors = _.fromPairs(_.map(continents, continent => [
  continent.code,
  continent.color,
]))
const blackAndWhiteColorScale = d3.scaleSequential(interpolateRdYlGn)
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
const metrics = _.map(metricRankedCorrelationData, "fieldname")
const filteredMetrics = _.sortBy(
  _.without(_.map(metricRankedCorrelationData, "fieldname"), "Area in km²"),
  _.toLower,
)
const metricCorrelationSorts = _.fromPairs(
  _.map(metricRankedCorrelationData, metric => [
    metric.fieldname,
    metric.RankedCorrelationWithOtherFields,
  ])
)
class WDVPMetrics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredCountry: null,
      // isAscending: true,
      colorMode: "normal",
      isShowingPercentile: true,
      processedData: [],
    }
  }
  static propTypes = {
    metrics: PropTypes.array,
    data: PropTypes.array,
    highlightedCountries: PropTypes.array,
  }
  static defaultProps = {
    metrics: ["financial freedom score", "women MPs (% of all MPs)"],
    data: rawData,
    highlightedCountries: ["United States"]
  }

  getClassName() {
    return classNames("WDVPMetrics", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data != this.props.data) this.createScales()
  }
  chart = React.createRef()

  createScales = () => {
    const { data, metrics } = this.props
    const { selectedContinents, isAscending, isShowingPercentile } = this.state

    const selectedContinentValues = _.map(selectedContinents, "code")

    const sortedData = _.map(metrics, metric => (
      _.orderBy(
        data,
        [d => d[metric]],
        ["asc"]
      )
    ))

    const scales = _.fromPairs(
      _.map(metrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(data, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ scales, processedData: sortedData })
  }

  render() {
    const { metrics, highlightedCountries } = this.props
    const { processedData, scales } = this.state

    return (
      <div className={this.getClassName()}>

        <div className="WDVPMetrics__charts">
          {_.map(metrics, (metric, index) => (
            <WDVPMetricsChart
              key={metric}
              data={processedData[index]}
              metric={metric}
              scales={scales}
              highlightedCountries={highlightedCountries}
            />
          ))}
        </div>

        {/* <div className="WDVPMap__controls">
          <div className="WDVPMetrics__toggles">
            <RadioGroup
              className="WDVPMetrics__toggle"
              options={percentileOrRawOptions}
              value={isShowingPercentile}
              onChange={this.onIsShowingPercentileSelect}
            />

            <RadioGroup
              className="WDVPMetrics__toggle"
              options={colorModeOptions}
              value={colorMode}
              onChange={this.onColorModeOptionsSelect}
            />
          </div>

          <div className="WDVPMetrics__metrics">
            {_.map(filteredMetrics, (metric, index) => !!metricsInfo[metric] && (
              <div className={`WDVPMetrics__metrics__item WDVPMetrics__metrics__item--is-${metric == sort ? "selected" : "not-selected"}`} key={metric} onClick={this.onChangeSort(metric)}>
                <div className="WDVPMetrics__metrics__item__label">
                  <span className="WDVPMetrics__metrics__item__index">
                    { index + 1 }.
                  </span>
                  { metric }
                </div>
                {sort == metric && (
                  <div className="WDVPMetrics__metrics__item__details">
                    <div>{ metricsInfo[metric].notes }</div>
                    <div>Source: { metricsInfo[metric].source }, { metricsInfo[metric].year }</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div> */}


      </div>
    )
  }
}

export default WDVPMetrics


const formatNumber = d3.format(",.1f")
const WDVPMetricsChart = React.memo(({ data, metric, scales, highlightedCountries }) => (
  <div className="WDVPMetricsChart">
    <h6 className="WDVPMetricsChart__header">
      { metric}
    </h6>

    <div className="WDVPMetricsChart__items">
      {_.map(data, country => (
        <div className={`WDVPMetricsChart__item WDVPMetricsChart__item--is-${highlightedCountries.includes(country.Country) ? "selected" : "not-selected"}`} key={country.Country}>
          <div className="WDVPMetricsChart__item__bar">
            <div className="WDVPMetricsChart__item__bar__fill" style={{
              height: `${Math.max([
                scales[metric](country[metric]) * 100
              ], 1)}%`,
              // background: continentColors[country.Continent],
            }} />
            <div className="WDVPMetricsChart__item__bar__value">
              { formatNumber(country[metric]) }
            </div>
          </div>
          <div className="WDVPMetricsChart__item__label">
            { country.Country }
          </div>
        </div>
      ))}
    </div>
  </div>
))