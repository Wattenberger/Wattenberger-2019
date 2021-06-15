import React, {Component, PureComponent} from "react"
import Select from 'react-select';
import selectStyles from "./selectStyles"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import Icon from 'components/_ui/Icon/Icon';

import rawData from "./Wdvp_gov_score.json"
import countryPaths from "./country-paths.json"
import metricsInfo from "./metric-info.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"

import './WDVPMap.scss'

const countriesByName = _.fromPairs(
  _.map(rawData, country => [country.Country, country])
)

// const blackAndWhiteColorScale = d3.scaleSequential(interpolateRdBu)
const blackAndWhiteColorScale = createScale({
  domain: [-0.9, 0, 0.9],
  // range: ["#fafafa", "#45aeb1"],
  range: ["#F97F51", "#eaeaea", "#3B3B98"],
})
const percentileOrRawOptions = [{
  value: false,
  label: "Value",
},{
  value: true,
  label: "Percentile",
}]
const defaultMetrics = _.sortBy(
  _.without(_.map(metricRankedCorrelationData, "fieldname"), "Area in km²"),
  _.toLower,
)
const percentileMetrics = _.map(defaultMetrics, d => `${d}__percentile`)
const countryOptions = _.map(rawData, country => ({
  value: country.Country,
  label: country.Country,
  color: "#114D4D",
}))
const metricOptionsVerbose = _.map(defaultMetrics, m => ({
  value: m,
  label: m,
  color: "#114D4D",
}))
const valueToNumber = d => _.isFinite(d) ? d : 0

class WDVPMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMetric: defaultMetrics[0],
      selectedCountry: countriesByName["United States"],
      metricScales: {},
      sortedCountries: [],
      metricsByImportance: [],
      hoveredCountry: null,
      tooltipPosition: null,
      countryCorrelations: null,
      isShowingPercentile: false,
    }
  }
  container = React.createRef()

  getClassName() {
    return classNames("WDVPMap", "WDVP__full-width", this.props.className)
  }

  componentDidMount() {
    this._isMounted = true
    this.createScales()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectedCountryName != this.props.selectedCountryName) this.onCountrySelectExternal()
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  chart = React.createRef()

  createScales = () => {
    const { sort, selectedCountry, isAscending, isShowingPercentile } = this.state

    const metricsByImportance = _.orderBy(
      _.map(defaultMetrics, metric => [
        metric,
        selectedCountry[`${metric}__percentile`] > 50 ? 100 - selectedCountry[`${metric}__percentile`] : selectedCountry[`${metric}__percentile`],
        selectedCountry[`${metric}__percentile`],
      ]),
      1,
      "asc",
    )
    const selectedCountryDifferences = this.getDifferences(_.values(_.pick(selectedCountry, percentileMetrics)))

    const countryCorrelations = _.fromPairs(
      _.map(rawData, country => {
        const metricDifferences = this.getDifferences(_.values(_.pick(country, percentileMetrics)))
        const numerator = _.mean(_.map(metricDifferences, (d,i) => d * selectedCountryDifferences[i]))
        const squaredDiffsForCountry = _.mean(_.map(metricDifferences, (d,i) => d * d))
        const squaredDiffsForSelectedCountry = _.mean(_.map(selectedCountryDifferences, (d,i) => d * d))
        const denominator = Math.sqrt(squaredDiffsForCountry) * Math.sqrt(squaredDiffsForSelectedCountry)
        return [country.Country, numerator / denominator]
      })
    )

    const sortedCountries = _.map(
      _.orderBy(
        _.toPairs(countryCorrelations),
        1,
        "desc"
      ),
      0,
    )

    this.setState({ countryCorrelations, sortedCountries, metricsByImportance })
  }

  getDifferences = arr => {
    const values = _.map(arr, valueToNumber)
    const mean = _.mean(arr)
    const differences = _.map(values, (d, i) => d - mean)
    return differences
  }

  removeTooltip = () => {
    if (!this._isMounted) return

    this.setState({ hoveredCountry: null, tooltipPosition: null })
  }

  onCountryHover = country => () => {
    if (!country) {
      this.timeout = setTimeout(this.removeTooltip, 100)
      return
    }

    if (this.timeout) clearTimeout(this.timeout)

    try {
      const countryElement = d3.select(this.container.current).select(`#country--${country["ISO-3166 alpha2"]}`)._groups[0][0]
      if (!countryElement) return;

      const containerBounds = this.container.current.getBoundingClientRect()
      const bounds = countryElement.getBoundingClientRect()
      const tooltipPosition = {
        x: Math.min(bounds.left - containerBounds.left + bounds.width / 2, window.innerWidth - 300),
        y: bounds.top - containerBounds.top + bounds.height / 2,
      }
      this.setState({ tooltipPosition })
    } catch(e) {

    }

    this.setState({ hoveredCountry: country })
  }
  onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value }, this.createScales)
  onMetricChange = metric => () => this.setState({ selectedMetric: metric })
  onCountrySelectFromSelect = country => this.onCountrySelect(countriesByName[country.value])
  onCountrySelectLocal = country => () => this.onCountrySelect(country)
  onCountrySelectByNameLocal = country => () => this.onCountrySelect(countriesByName[country])
  onCountrySelect = country => this.setState({ selectedCountry: country }, this.createScales)
  onCountrySelectExternal = () => !!this.props.selectedCountryName && this.setState({ selectedCountry: countriesByName[this.props.selectedCountryName] }, this.createScales)

  getCountryColor = countryName => countryName == this.state.selectedCountry.Country ? "#1d1d27" :
    this.state.countryCorrelations &&
    _.isFinite(this.state.countryCorrelations[countryName]) &&
    blackAndWhiteColorScale(this.state.countryCorrelations[countryName])

  render() {
    const { metricScales, selectedMetric, selectedCountry, countryCorrelations, sortedCountries, metricsByImportance, hoveredCountry, tooltipPosition, isShowingPercentile } = this.state
    const valueMetric = isShowingPercentile ? `${selectedMetric}__percentile` : selectedMetric

    return (
      <div className={this.getClassName()}>

      <div className="WDVPMap__header">
        <div className="WDVPMap__header__contents">
          <div className="WDVPMap__header__title">
            <div className="WDVPMap__header__title__text">
              Countries similar to
            </div>
            <Select
              name="countries"
              options={countryOptions}
              value={{value: selectedCountry.Country, label: selectedCountry.Country}}
              className="WDVPMap__select"
              classNamePrefix="WDVPMap__select"
              styles={selectStyles}
              onChange={this.onCountrySelectFromSelect}
            />
          </div>

          <div className="WDVPMap__header__scale">
            <h6 className="WDVPMap__header__scale__label">Most Similar</h6>
            {_.map(sortedCountries.slice(1, 4), (country, index) => (
              <React.Fragment key={country}>
                {!!index && ","}
                <span style={{color: this.getCountryColor(country)}} className="WDVPMap__header__country" onClick={this.onCountrySelectByNameLocal(country)}>
                  { country }
                </span>
              </React.Fragment>
            ))}
            ...
            {_.map(sortedCountries.slice(-3), (country, index) => (
              <React.Fragment key={country}>
                {!!index && ","}
                <span style={{color: this.getCountryColor(country)}} className="WDVPMap__header__country" onClick={this.onCountrySelectByNameLocal(country)}>
                  { country }
                </span>
              </React.Fragment>
            ))}
            <h6 className="WDVPMap__header__scale__label">Least Similar</h6>
          </div>

          <div className="WDVPMap__header__scale WDVPMap__header__metrics">
            <h6 className="WDVPMap__header__scale__label">Distinctive metrics</h6>
            {_.map(metricsByImportance.slice(0, 5), (metric, index) => (
              <React.Fragment key={metric[0]}>
                {!!index && ","}
                <span className="WDVPMap__header__metrics__item">
                  { metric[0] }
                  <span className={`WDVPMap__header__metrics__item__arrow WDVPMap__header__metrics__item__arrow--${metric[2] > 50 ? "up" : "down"}`}>
                    <Icon name="arrow" size="s" direction="n" />
                  </span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

        <div className="WDVPMap__chart">
          <svg className="WDVPMap__svg" viewBox="0 0 962 502" preserveAspectRatio="xMidYMid meet" ref={this.container}>
            {_.map(rawData, country => (
              <WDVPMapCountry
                key={country.Country}
                name={country.Country}
                id={country["ISO-3166 alpha2"]}
                path={countryPaths[country.Country]}
                onMouseEnter={this.onCountryHover(country)}
                onMouseLeave={this.onCountryHover(null)}
                onClick={this.onCountrySelectLocal(country)}
                color={this.getCountryColor(country.Country)}
              />
            ))}

            {hoveredCountry && (
              <WDVPMapCountry
                name={hoveredCountry.Country}
                path={countryPaths[hoveredCountry.Country]}
                color={this.getCountryColor(hoveredCountry.Country)}
                isHovered
              />
            )}
          </svg>

          {tooltipPosition && (
            <WDVPMapTooltip
              country={hoveredCountry}
              correlation={countryCorrelations && countryCorrelations[hoveredCountry.Country]}
              sortedCountries={sortedCountries}
              selectedCountry={selectedCountry}
              selectedMetric={selectedMetric}
              style={{
                transform: `translate(${tooltipPosition.x}px, ${tooltipPosition.y}px)`
              }}
            />
          )}
        </div>

      </div>
    )
  }
}

export default WDVPMap


const formatNumber = d3.format(",")
const formatCorrelation = d3.format(".2f")
const WDVPMapCountry = React.memo(({ id, name, path, color, isHovered, ...props }) => (
  <path {...props}
    className={isHovered ? "WDVPMapCountry WDVPMapCountry--is-hovered" : "WDVPMapCountry"}
    id={`country--${id}`}
    d={path}
    title={name}
    fill={color}
  />
))

const WDVPMapTooltip = React.memo(({ country, selectedCountry, selectedMetric, correlation, ...props }) => (
  <div className="WDVPMapTooltip" {...props}>
    <h6>
      { country.Country }
    </h6>
    <div className="WDVPMapTooltip__metric">
      <div className="WDVPMapTooltip__metric__label">
        Correlation with { selectedCountry.Country }:
      </div>
      <div className="WDVPMapTooltip__metric__number">
        { formatCorrelation(correlation) }
      </div>
    </div>
  </div>
))
