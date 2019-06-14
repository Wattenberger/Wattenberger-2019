import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day28.scss')

const SVG_HEIGHT = 400

class Day28 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: Math.max(400, window.innerWidth * 0.8),
      width: window.innerWidth,
      svg: null,
      interval: null,
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const height = Math.max(400, width * 0.54)
    this.setState({ svg, height, width })

    const interval = window.setInterval(this.makeCircles, 200)
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    if (interval) window.clearInterval(interval)
  }

  makeCircles = () => {
    const circles = _.times(2, this.renderCircles)
    this.setState({ circles });
  }

  renderCircles = circleIndex => {
    const { height, width } = this.state
    let lastRadius = height * 0.4
    const numCircles = 30
    return _.times(numCircles, i => {
      lastRadius -= height * _.random(0.01, 0.03, true)
      lastRadius = _.max([0, lastRadius])
      return (
        <circle
          className={`circle--${circleIndex}`}
          key={i}
          cx={width / 2 + (height * 0.3 * (circleIndex ? 1 : -1))}
          cy={height / 2}
          r={lastRadius}
        />
      )
    })
  }

  getClassName() {
    return classNames("Day28")
  }

  render() {
    let { height, width, circles } = this.state

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height + 50}
          width={width}
          ref={svg => this.svg = svg}
        >
        {circles}
        </svg>
      </div>
    )
  }
}

export default Day28
