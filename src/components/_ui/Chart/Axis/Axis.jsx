import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import * as d3 from "d3"

require('./Axis.scss')
const orientations = {
  x: "bottom",
  y: "left"
}
const axesMap = {
  top: "axisTop",
  left: "axisLeft",
  right: "axisRight",
  bottom: "axisBottom",
}

class Axis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      axis: null
    }
  }

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    scale: PropTypes.func,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    dimension: PropTypes.oneOf(["x", "y"]),
    orientation: PropTypes.oneOf(["left", "right", "top", "bottom"]),
    ticks: PropTypes.number,
    tickSize: PropTypes.number,
    tickSizeInner: PropTypes.number,
    tickSizeOuter: PropTypes.number,
    tickFrequency: PropTypes.number,
    tickArguments: PropTypes.array,
    format: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
    ]),
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    label: PropTypes.string,
    hasInlineLabel: PropTypes.bool,
  };

  static defaultProps = {
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    ticks: 6,
    tickSize: 0,
    tickSizeInner: 6,
    tickSizeOuter: 0,
    initTransition: 300,
    transition: 300
  };
  elem = React.createRef()

  getStyle() {
    const {height, width, margin, dimension} = this.props
    const x = dimension == "x"      ? 0 :
              margin.left           ? 1 :
                                      width
    const y = dimension == "x" ? height - margin.top - margin.bottom : 0

    return {
      transform: `translate3d(${x}px, ${y}px, 0)`
    }
  }

  getOrientation() {
    let {dimension, orientation} = this.props
    return orientation || orientations[this.props.dimension] || "left"
  }

  update(props) {
    let {scale, label, tickSize, tickSizeInner, tickSizeOuter, ticks, tickFrequency, tickPadding, tickArguments, format, initTransition, transition} = (props || this.props)
    let {axis} = this.state
    if (!scale) return

    let init = !axis
    if (init) axis = d3[axesMap[this.getOrientation()]]()

    axis.scale(scale)
        .tickSize(tickSize)
        .tickSizeInner(tickSizeInner)
        .tickSizeOuter(tickSizeOuter)

    if (tickArguments) axis.tickArguments(tickArguments)
    if (format) axis.tickFormat(format)
    if (ticks) axis.ticks(ticks, tickFrequency)
    if (tickPadding) axis.tickPadding(tickPadding)

    d3.select(this.elem.current)
      .transition().duration(init ? initTransition : transition)
      .call(axis)

    this.setState({axis})
  }

  componentDidMount() {
    this.update()
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  renderLabel() {
    let {dimension, label, width, hasInlineLabel} = this.props
    let x =      dimension == "x" ? width - 100 || 0 : 0
    let y =      dimension == "x" ? -10 :
      hasInlineLabel ? 6 : 20
    let rotate = dimension == "x" || hasInlineLabel ? 0 : -90

    let style = {
      transform: `rotate(${rotate}deg)`,
    }
    return <text
      className={`Axis__label Axis--${dimension ? `${dimension}__` : ''}label`}
      style={style}
      x={x}
      y={y}>
      {label}
    </text>
  }

  getClassName() {
    let {dimension, hasInlineLabel, className} = this.props

    return classNames(
      "Axis", {
        [`Axis--${dimension}`]: dimension,
        [`Axis--has-inline-label`]: hasInlineLabel,
      },
      className
    )
  }

  render() {
    let {label} = this.props

    return (
      <g ref={this.elem} className={this.getClassName()} style={this.getStyle()}>
        {!!label && this.renderLabel()}
      </g>
    )
  }
}

export default Axis
