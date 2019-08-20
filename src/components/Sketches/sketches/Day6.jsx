import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day6.scss')

let interval
const INTERVAL_LENGTH = 10
const NUM_STREAMS = 90
const CANVAS_RGB = "248, 235, 238"
const SPEED_MIN = 1
const SPEED_MAX = 3

class Day6 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      points: _.times(NUM_STREAMS, () => null),
      canvasPos: {},
      mousePos: {},
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    interval = window.setInterval(this.draw, INTERVAL_LENGTH)

    let canvasPos = {
      x: this.canvas.offsetLeft,
      y: this.canvas.offsetTop
    }
    this.setState({canvasPos})
  }

  componentWillUnmount() {
    window.clearInterval(interval)
  }

  getClassName() {
    return classNames("Day6")
  }

  draw = () => {
    let {canvas, mousePos} = this.state
    if (!canvas) return

    canvasUtils.fadeCanvas(0.6, canvas, CANVAS_RGB)
    _.times(NUM_STREAMS, idx => {this.drawPoint(idx)})
    if (mousePos.x) this.drawMousePos()
  }

  drawPoint(idx) {
    let {canvas, points, mousePos} = this.state
    let point = points[idx] || movementUtils.createPoint({
      speedMin: SPEED_MIN,
      speedMax: SPEED_MAX,
    })
    point = movementUtils.moveRandomly(point, {
      percentChangeChangeDir: 0,
      avoidPoints: [mousePos]
    })
    canvasUtils.drawDot(point, canvas, "rgba(12, 57, 52, 0.6)")

    points[idx] = point
    this.setState({points})
  }

  drawMousePos() {
    let {mousePos, canvas} = this.state
    canvasUtils.drawDot(_.extend({}, mousePos, {r: 20}), canvas, "#666", "stroke")
  }

  onMouseMove = e => {
    let {canvasPos} = this.state
    let mousePos = {
      x: e.clientX - canvasPos.x || 0,
      y: e.clientY - canvasPos.y || 0
    }
    this.setState({mousePos})
  }

  onMouseOut = e => {
    this.setState({mousePos: {}})
  }

  render() {
    let {height, width} = this.state

    return (
      <div className={this.getClassName()}>
        <canvas
          height={height}
          width={width}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseOut}
          ref={canvas => this.canvas = canvas}
        />
      </div>
    )
  }
}

export default Day6
