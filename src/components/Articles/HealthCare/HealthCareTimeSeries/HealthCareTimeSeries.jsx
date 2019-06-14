import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import {filter} from "lodash"
import * as d3 from "d3"
import Select from "react-select"
// import "react-select/dist/react-select.css"
import Flex from "components/_ui/Flex/Flex"
import Chart from "components/_ui/Chart/Chart"
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
import { createScale } from 'components/_ui/Chart/utils/scale';
import Axis from 'components/_ui/Chart/Axis/Axis';
import Line from 'components/_ui/Chart/Line/Line';

require('./HealthCareTimeSeries.scss')
const continents = [
  {code: "AS", value: "Asia", color: "#EF4E78"},
  {code: "EU", value: "Europe", color: "#F99072"},
  {code: "AF", value: "Africa", color: "#FFCA81"},
  {code: "NA", value: "North America", color: "#98C55C"},
  {code: "OC", value: "Oceania", color: "#67B279"},
  {code: "SA", value: "South America", color: "#6F87A6"}
]

const margin = {
  top: 0,
  right: 0,
  bottom: 30,
  left: 100,
}
class HealthCareTimeSeries extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedCountry: {value: "United States", label: "United States"},
      selectedContinent: null
    }
  }

  static propTypes = {
    label: PropTypes.string,
    data: PropTypes.array,
    renderTooltip: PropTypes.func,
    yAxisFormatting: PropTypes.func
  };

  componentDidMount() {
    this.createScales()
  }

  chart = React.createRef()

  createScales = () => {
    const height = 500
    const width = window.innerWidth * 0.9
    const data = this.getData();

    const xScale = createScale({
      width,
      margin,
      dimension: "x",
      domain: [_.min(_.map(_.flatMap(data, "values"), "year")), _.max(_.map(_.flatMap(data, "values"), "year"))],
    })
    const maxY = _.max(_.map(_.flatMap(data, "values"), "yVal"))
    const yScale = createScale({
      height,
      margin,
      dimension: "y",
      domain: [0, maxY],
    })
    this.setState({ data, height, width, xScale, yScale })
  }
  getClassName() {
    return classNames("HealthCareTimeSeries", this.props.className)
  }

  getData() {
    let {data} = this.props
    let {selectedContinent, selectedCountry} = this.state

    return data.map(series => {
      series.filtered = selectedContinent && series.continent != selectedContinent.code
      let continent = filter(continents, c => c.code === series.continent)[0] || {}
      series.color = series.country == selectedCountry.value ? "red" : continent.color
      series.width = series.country == selectedCountry.value ? 3 : 1
      series.values = filter(series.values, v => !!v.yVal)
      return series
    }).filter(s => !!s.continent && !s.filtered)
  }

  getCountries() {
    let {data} = this.props
    return data.map(series => ({
      value: series.country,
      label: series.country
    }))
  }

  onCountrySelect(country) {
    this.setState({selectedCountry: country}, this.createScales)
  }

  onContinentSelect(continent) {
    const { selectedContinent } = this.state
    this.setState({selectedContinent: selectedContinent == continent ? null : continent}, this.createScales)
  }

  onContinentClear() {
    this.setState({selectedContinent: null}, this.createScales)
  }

  getSelectedCountry() {
    let {selectedCountry} = this.state
    if (!selectedCountry) return null
    return filter(this.getData(), c => c.country === selectedCountry.value)[0]
  }

  xAccessor = d => this.state.xScale(d.year)
  yAccessor = d => this.state.yScale(d.yVal)

  render() {
    let {label, yAxisFormatting} = this.props
    let {data, height, width, selectedCountry, selectedContinent, xScale, yScale} = this.state

    return (
      <div className={this.getClassName()}>
        <div className="HealthCareTimeSeries__header">
          <h6>{label}</h6>
          <Flex direction="row" className="HealthCareTimeSeries__modulators">
            <Select
              className="HealthCareTimeSeries__modulators__select"
              placeholder="Search for a country"
              value={selectedCountry}
              options={this.getCountries()}
              onChange={::this.onCountrySelect}
            />
            <RadioGroup
              options={continents}
              value={selectedContinent}
              onChange={::this.onContinentSelect}
              canClear
            />
          </Flex>
        </div>
        <Chart
          height={height}
          width={width}
          margin={margin}
          selectedSeries={this.getSelectedCountry()}
        >
          <Axis
            dimension="x"
            height={height}
            width={width}
            margin={margin}
            scale={xScale}
            format={_.identity}
          />
          <Axis
            dimension="y"
            height={height}
            margin={margin}
            scale={yScale}
            format={yAxisFormatting}
          />

          {_.map(data, d => (
            <Line
              key={d.country}
              data={d.values}
              xAccessor={this.xAccessor}
              yAccessor={this.yAccessor}
              style={{
                stroke: d.color,
                strokeWidth: d.width,
              }}
              interpolation={d3.curveMonotoneX}
            />
          ))}
        </Chart>
      </div>
    )
  }
}

export default HealthCareTimeSeries
