import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import {filter, isFunction} from "lodash"
import * as d3 from "d3"
import Chart, {getWidth, getHeight} from "components/_ui/Chart/Chart"
import stats from "components/_ui/Chart/utils/stats"
import Axis from "components/_ui/Chart/Axis/Axis"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Line from "components/_ui/Chart/Line/Line"
import Tooltip from "components/_ui/Chart/Tooltip-old/Tooltip"

require('./RochesterRealEstateTimeSeries.scss')

class RochesterRealEstateTimeSeries extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartInfo: {
        outerHeight: 400,
        height: 400,
        outerWidth: window.innerWidth < 800 ? window.innerWidth - 40 : 800,
        width: window.innerWidth < 800 ? window.innerWidth - 40 : 800,
        margin: {top: 10, right: 10, bottom: 30, left: 30},
      },
      scales: {},
      scatter: null,
    }
  }

  static PropTypes = {
    data: PropTypes.array,
    xField: PropTypes.shape({
      fieldName: PropTypes.string.required,
      type: PropTypes.string,
      format: PropTypes.string,
    }),
    yField: PropTypes.shape({
      fieldName: PropTypes.string.required,
      type: PropTypes.string,
      format: PropTypes.string,
    }),
  };

  getClassName() {
    return classNames("RochesterRealEstateTimeSeries", this.props.className)
  }

  componentWillMount() {
    this.setChartInfo()
    this.setScales()
  }

  componentDidMount() {
    this.setState({scatter: this.scatter})
  }

  componentWillReceiveProps(newProps) {
    this.setScales(newProps)
  }

  cleanPoint = (d, field) => {
    if (!field) return d
    if (field && field.generate) {
      d[field.fieldName] = field.generate(d)
    }
    if (["ordinal", "interval"].indexOf(field.type) != -1) {
      d[field.fieldName] = +(("" + d[field.fieldName]).replace(/[$,%]/g,""))
    }
    return d
  }

  getData(props) {
    let {data, xField, yField} = (props || this.props)

    return data.map(d => {
      d = this.cleanPoint(d, xField)
      d = this.cleanPoint(d, yField)
      return d
    })
  }

  setChartInfo() {
    let {chartInfo} = this.state
    chartInfo.height = getHeight(chartInfo.height, chartInfo.margin)
    chartInfo.width = getWidth(chartInfo.width, chartInfo.margin)
    this.setState({chartInfo})
  }

  setScales(props) {
    let {xField, yField} = (props || this.props)
    let {chartInfo} = this.state

    const data = this.getData(props)

    const getScale = axis => {
      const field = (props || this.props)[`${axis}Field`]
      const type = field.type == "ordinal"  ? "scaleLinear" :
                   field.type == "interval" ? "scaleLinear" :
                   field.type == "date"     ? "scaleTime"   :
                                              "scaleQuantize"

      const dataMin = d3.min(data, d => d[field.fieldName])
      const range = type == "scaleQuantize" ?
                      _.uniqBy(data, field.fieldName) :
                      axis == "x" ?
                        [0, chartInfo.width] :
                        [chartInfo.height, 0]
      const min = field.type == "interval" ?
                    dataMin :
                    d3.max([0, dataMin])
      const max = d3.max(data, d => d[field.fieldName])
      return d3[type]()
               .range(range)
               .domain([min, max])
    }

    const scales = {
      x: getScale("x"),
      y: getScale("y"),
    }
    this.setState({scales})
  }

  getFormat = (format=",.2r") => d3.format(format)

  getLinearRegressionData = () => {
    let {xAccessor, yAccessor, xField, yField} = this.props
    let {scales} = this.state
    if (!scales.x || !scales.y) return []

    const data = this.getData()
    const xSeries = data.map(this.dAccessor.bind(this, xField, d => d))
    const ySeries = data.map(this.dAccessor.bind(this, yField, d => d))
    const path = stats.leastSquares(xSeries, ySeries)

    const xDomain = scales.x.domain()
    const x1 = xDomain[0]
    const x2 = xDomain[1]
    const y1 = path.intercept + path.slope * x1
    const y2 = path.intercept + path.slope * x2

    return [
      {x: x1, y: y1},
      {x: x2, y: y2},
    ]
  }

  dAccessor = (field, scale, d) => {
    if (["ordinal", "interval", "date"].indexOf(field.type)) {
      return isFunction(scale) ? scale(d[field.fieldName]) : 0

    } else {
      return isFunction(scale) ? scale(d[field.fieldName]) : 0
    }
  }

  renderTooltip = d => {
    let {xField, yField} = this.props

    return <div className="RochesterRealEstateTimeSeries__tooltip">
      <h6>{d.Address}</h6>
      <div className="RochesterRealEstateTimeSeries__tooltip__row">
      ${d3.format(",")(+(("" + d["Original List Price"]).replace(/[$,]/g,"")))}, sold at ${d3.format(",")(+(("" + d["Sale Price"]).replace(/[$,]/g,"")))}
      </div>
      <div className="RochesterRealEstateTimeSeries__tooltip__row">
        <em>{xField.fieldName}</em>: {this.getFormat(xField.format)(d[xField.fieldName])}
      </div>
      <div className="RochesterRealEstateTimeSeries__tooltip__row">
        <em>{yField.fieldName}</em>: {this.getFormat(yField.format)(d[yField.fieldName])}
      </div>
    </div>
  }

  render() {
    let {xField, yField} = this.props
    let {scales, chartInfo, scatter} = this.state

    return (
      <div className={this.getClassName()}>
        <h6>{yField.fieldName} vs {xField.fieldName}</h6>

        <Chart
          height={chartInfo.outerHeight}
          width={chartInfo.outerWidth}
          margin={chartInfo.margin}
          ref={Chart => this.chart = Chart}
        >
          <Axis
            scale={scales.x}
            dimension="x"
            format={this.getFormat(xField.format)}
            label={xField.fieldName}
            chartInfo={chartInfo}
          />
          <Axis
            scale={scales.y}
            dimension="y"
            format={this.getFormat(yField.format)}
            label={yField.fieldName}
            chartInfo={chartInfo}
          />
          <Scatter
            data={this.getData()}
            xAccessor={this.dAccessor.bind(this, xField, scales.x)}
            yAccessor={this.dAccessor.bind(this, yField, scales.y)}
            radius={6}
            ref={Scatter => this.scatter = Scatter}
          />
          <Line
            data={this.getLinearRegressionData()}
            xAccessor={d => scales.x(d.x)}
            yAccessor={d => scales.y(d.y)}
          />
          <Tooltip
            type="scatter"
            elem={scatter}
            xAccessor={this.dAccessor.bind(this, xField, scales.x)}
            yAccessor={this.dAccessor.bind(this, yField, scales.y)}
            renderElem={this.renderTooltip}
          />
        </Chart>
      </div>
    )
  }
}

export default RochesterRealEstateTimeSeries
