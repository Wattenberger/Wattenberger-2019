import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

require('./Gradient.scss')
const orientations = {
  x: "bottom",
  y: "left"
}

class Gradient extends Component {
  static propTypes = {
    id: PropTypes.string,
    stops: PropTypes.arrayOf(PropTypes.shape({
      offset: PropTypes.string,
      color: PropTypes.string,
      opacity: PropTypes.string,
    })),
    x: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.number,
    ]),
    y: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.number,
    ]),
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    id: "gradient",
    stops: {},
    x: 0,
    y: 0,
    width: 100,
    height: 10,
  };

  getClassName() {
    let {id} = this.props
    return classNames(
      "Gradient",
      `Gradient__${id}`,
      this.props.className
    )
  }

  render() {
    let {id, stops, x, y, width, height} = this.props
    let hasX2 = _.isArray(x)
    let hasY2 = _.isArray(y)

    return (
      <linearGradient
        className={this.getClassName()}
        id={id}
        x1={hasX2 ? x[1] : x}
        x2={hasX2 ? x[2] : x + width}
        y1={hasY2 ? y[1] : y}
        y2={hasY2 ? y[2] : y + height}
        gradientUnits="userSpaceOnUse"
      >
        {stops.map(stop =>
          <stop
            key={stop.offset || 0}
            offset={stop.offset || 0}
            stopColor={stop.color}
            stopOpacity={stop.opacity || 1}
          />
        )}
      </linearGradient>
    )
  }
}

export default Gradient
