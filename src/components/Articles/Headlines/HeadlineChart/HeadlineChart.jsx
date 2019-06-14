import React, {Component} from "react"
import PropTypes from "prop-types"
import moment from "moment"
import numeral from "numeral"
import {filter, isFunction, isNull, isUndefined} from "lodash"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import stats from "components/_ui/Chart/utils/stats"
import Axis from "components/_ui/Chart/Axis/Axis"
import Line from "components/_ui/Chart/Line/Line"
import Tooltip from "components/_ui/Chart/Tooltip/Tooltip"

// require('./HeadlineChart.less')

class HeadlineChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartInfo: {
        height: 400,
        width: window.innerWidth - 40,
        margin: {top: 10, right: 10, bottom: 30, left: 30},
      },
      scales: {},
      chart: null,
    }
  }

  static propTypes = {
    data: PropTypes.array,
    xField: PropTypes.shape({
      fieldName: PropTypes.string.required,
      type: PropTypes.string,
      labelFormat: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.number,
      ]),
    }),
    yField: PropTypes.shape({
      fieldName: PropTypes.string.required,
      type: PropTypes.string,
      labelFormat: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.number,
      ]),
    }),
  }

  componentWillMount() {
    this.setScales()
  }

  componentDidMount() {
    this.setState({chart: this.chart})
  }

  componentWillReceiveProps(nextProps) {
    this.setScales(nextProps)
  }

  getClassName() {
    return classNames("HeadlineChart")
  }

  setScales(props) {
    let {data, xField, yField} = (props || this.props)
    let {chartInfo} = this.state

    const getScale = axis => {
      const field = (props || this.props)[`${axis}Field`]
      const type = field.type == "ordinal"  ? "scaleLinear" :
                   field.type == "interval" ? "scaleLinear" :
                   field.type == "date"     ? "scaleTime"   :
                                              "scaleQuantize"

      const range = type == "scaleQuantize" ?
                      _.uniqBy(data, field.fieldName) :
                      axis == "x" ?
                        [0, chartInfo.width - chartInfo.margin.right - chartInfo.margin.left] :
                        [chartInfo.height - chartInfo.margin.top - chartInfo.margin.bottom, 0]
      const min = field.type == "interval" ? _.min(_.map(data, field.fieldName)) :
                  field.type == "date"     ? data[0][field.fieldName] :
                                             d3.max([0, _.min(_.map(data, field.fieldName))])
      const max = field.type == "date"     ? data[data.length - 1][field.fieldName] :
                                             _.max(_.map(data, field.fieldName))
      console.log(axis, range, min, max)
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

  dataAccessor = axis => d => {
    let {scales} = this.state

    const fieldName = this.props[`${axis}Field`].fieldName
    if (isNull(d[fieldName]) || isUndefined(d[fieldName])) return null

    return scales[axis](d[fieldName])
  }

  tooltipAccessor = axis => d => {
    let {data, xField, yField} = this.props
    let {scales} = this.state

    const i = d3.bisector(d => d[xField.fieldName]).left(data, scales.x.invert(d[0]))
    const point = data[i]
    return axis == "x" ?
      d[0] :
      point ? scales.y(point[yField.fieldName]) : null
  }

  renderTooltip = d => {
    let {data, xField, yField} = this.props
    let {scales} = this.state

    const i = d3.bisector(d => d[xField.fieldName]).left(data, scales.x.invert(d[0]))
    console.log(i, data[i])
    const point = data[i] || {}

    return (
      <div className="HeadlineChart__tooltip">
        <h6>{moment(point.date).format()}</h6>
        <div className="HeadlineChart__tooltip__row">
          <em>{xField.fieldName}</em>: {xField.labelFormat(point[xField.fieldName])}
        </div>
        <div className="HeadlineChart__tooltip__row">
          <em>{yField.fieldName}</em>: {yField.labelFormat(point[yField.fieldName])}
        </div>
      </div>
    )
  }

  render() {
    let {data, xField, yField} = this.props
    let {scales, chartInfo, chart} = this.state

    return (
      <Chart
        className="HeadlineChart"
        height={chartInfo.height}
        width={chartInfo.width}
        margin={chartInfo.margin}
        ref={Chart => this.chart = Chart}
      >
        <Axis
          scale={scales.x}
          dimension="x"
          format={xField.labelFormat}
          label={xField.fieldName}
          chartInfo={chartInfo}
        />
        <Axis
          scale={scales.y}
          dimension="y"
          format={yField.labelFormat}
          label={yField.fieldName}
          chartInfo={chartInfo}
        />
        <Line
          data={data}
          xAccessor={this.dataAccessor("x")}
          yAccessor={this.dataAccessor("y")}
        />
        <Tooltip
          type="chart"
          elem={chart}
          xAccessor={this.tooltipAccessor("x")}
          yAccessor={this.tooltipAccessor("y")}
          scales={scales}
          renderElem={this.renderTooltip}
        />
      </Chart>
    )
  }
}

export default HeadlineChart
