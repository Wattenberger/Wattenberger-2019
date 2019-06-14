import React, {Component, PureComponent} from "react"
import Select from 'react-select';
import * as d3 from "d3"
import { interpolateRdYlGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';
import Tooltip from 'components/_ui/Tooltip-old/Tooltip';

import rawData from "./Wdvp_gov_score.json"
import countryPaths from "./country-paths.json"
import metricsInfo from "./metric-info.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"

import './WDVPMap.scss'

// const blackAndWhiteColorScale = d3.scaleSequential(interpolateRdYlGn)
const blackAndWhiteColorScale = createScale({
  domain: [-.2, 1],
  // range: ["#fafafa", "#45aeb1"],
  range: ["#E1EEFB", "#30336b"],
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
const metricOptionsVerbose = _.map(defaultMetrics, m => ({
  value: m,
  label: m,
  color: "#114D4D",
}))

class WDVPMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMetric: defaultMetrics[0],
      metricScales: {},
      hoveredCountry: null,
      tooltipPosition: null,
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
  componentWillUnmount() {
    this._isMounted = false
  }
  chart = React.createRef()

  createScales = () => {
    const { sort, selectedContinents, isAscending, isShowingPercentile } = this.state

    const metricScales = _.fromPairs(
      _.map(defaultMetrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(rawData, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ metricScales })
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
        x: bounds.top - containerBounds.top + bounds.height / 2,
        y: bounds.left - containerBounds.left + bounds.width / 2,
      }
      this.setState({ tooltipPosition })
    } catch(e) {

    }

    this.setState({ hoveredCountry: country })
  }
  onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value }, this.createScales)
  onMetricChange = metric => () => this.setState({ selectedMetric: metric })

  render() {
    const { metricScales, selectedMetric, hoveredCountry, tooltipPosition, isShowingPercentile } = this.state
    const valueMetric = isShowingPercentile ? `${selectedMetric}__percentile` : selectedMetric

    return (
      <div className={this.getClassName()}>
        {/* <Select
          className="WDVP__select"
          classNamePrefix="WDVP__select"
          options={metricOptionsVerbose}
          value={{value: selectedMetric, label: selectedMetric}}
          styles={selectStyles}
          onChange={this.onMetricChange}
        /> */}

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
                color={
                  metricScales[selectedMetric] &&
                  blackAndWhiteColorScale(isShowingPercentile ?
                    country[`${selectedMetric}__percentile`] / 100 :
                    metricScales[selectedMetric](country[selectedMetric])
                  )
                }
              />
            ))}

            {hoveredCountry && (
              <WDVPMapCountry
                name={hoveredCountry.Country}
                path={countryPaths[hoveredCountry.Country]}
                color={
                  metricScales[selectedMetric] &&
                  blackAndWhiteColorScale(isShowingPercentile ?
                    hoveredCountry[`${selectedMetric}__percentile`] / 100 :
                    metricScales[selectedMetric](hoveredCountry[selectedMetric])
                  )
                }
                isHovered
              />
            )}
          </svg>

          {tooltipPosition && (
            <WDVPMapTooltip
              country={hoveredCountry}
              selectedMetric={selectedMetric}
              style={{
                transform: `translate(${tooltipPosition.y}px, ${tooltipPosition.x}px)`
              }}
            />
          )}
        </div>

        <div className="WDVPMap__controls">
          <RadioGroup
            className="WDVPMap__toggle"
            options={percentileOrRawOptions}
            value={isShowingPercentile}
            onChange={this.onIsShowingPercentileSelect}
          />

          <div className="WDVPMap__metrics">
            {_.map(defaultMetrics, metric => (
              <div className={`WDVPMap__metrics__item WDVPMap__metrics__item--is-${metric == selectedMetric ? "selected" : "not-selected"}`} key={metric} onMouseEnter={this.onMetricChange(metric)}>
                { metric }
                {selectedMetric == metric && (
                  <div className="WDVPMap__metrics__item__details">
                    <div>{ metricsInfo[metric].notes }</div>
                    <div>Source: { metricsInfo[metric].source }, { metricsInfo[metric].year }</div>
                  </div>
                )}
                {false && metricsInfo[metric] && (
                  <Tooltip className="WDVPMap__metrics__tooltip">
                    <h6>{ metric }</h6>
                    <div>{ metricsInfo[metric].notes }</div>
                    <div>Source: { metricsInfo[metric].source }, { metricsInfo[metric].year }</div>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    )
  }
}

export default WDVPMap


const formatNumber = d3.format(",")
const WDVPMapCountry = React.memo(({ id, name, path, color, isHovered, ...props }) => (
  <path {...props}
    className={isHovered ? "WDVPMapCountry WDVPMapCountry--is-hovered" : "WDVPMapCountry"}
    id={`country--${id}`}
    d={path}
    title={name}
    fill={color}
  />
))

const WDVPMapTooltip = React.memo(({ country, selectedMetric, ...props }) => (
  <div className="WDVPMapTooltip" {...props}>
    <h6>
      { country.Country }
    </h6>
    <div className="WDVPMapTooltip__metric">
      <div className="WDVPMapTooltip__metric__label">
        { selectedMetric }:
      </div>
      <div className="WDVPMapTooltip__metric__number">
        { formatNumber(country[selectedMetric]) }
      </div>
    </div>
    <div className="WDVPMapTooltip__metric">
      <div className="WDVPMapTooltip__metric__label">
        { selectedMetric } Percentile:
      </div>
      <div className="WDVPMapTooltip__metric__number">
        { _.isFinite(country[`${selectedMetric}__percentile`]) ? country[`${selectedMetric}__percentile`] - 1 : "-" }
      </div>
    </div>
  </div>
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