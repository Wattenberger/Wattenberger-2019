import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day7.scss')

let animationRequestId
const NUM_STREAMS = window.innerWidth * 0.13
const NUM_STATIC_POINTS = window.innerWidth * 0.008
const CANVAS_RGB = "18, 23, 56"
const SPEED_MIN = 1
const SPEED_MAX = 3
const RADIUS_MIN = 3
const RADIUS_MAX = 9
const STATIC_RADIUS_MIN = 50
const STATIC_RADIUS_MAX = 90

class Day7 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      points: _.times(NUM_STREAMS, () => null),
      staticPoints: _.times(NUM_STATIC_POINTS, () => null),
      canvasPos: {},
      mousePos: {},
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)

    let canvasPos = {
      x: this.canvas.offsetLeft,
      y: this.canvas.offsetTop
    }
    this.setState({canvasPos})
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day7")
  }

  draw = () => {
    let {canvas, mousePos} = this.state
    animationRequestId = window.requestAnimationFrame(this.draw)
    if (!canvas) return

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    _.times(NUM_STATIC_POINTS, idx => {this.drawStaticPoint(idx)})
    _.times(NUM_STREAMS, idx => {this.drawPoint(idx)})
    if (mousePos.x) this.drawMousePos()
  }

  drawPoint(idx) {
    let {canvas, points, staticPoints} = this.state
    let point = points[idx] || movementUtils.createPoint({
      speedMin: SPEED_MIN,
      speedMax: SPEED_MAX,
      radiusMin: RADIUS_MIN,
      radiusMax: RADIUS_MAX,
    })
    point = movementUtils.moveRandomly(point, {
      percentChangeChangeDir: 0,
      avoidPoints: [...staticPoints, ..._.filter(points, (p, i) => p && i != idx)],
    })
    canvasUtils.drawDot(point, canvas, "#D17C78")

    points[idx] = point
    this.setState({points})
  }

  drawStaticPoint(idx) {
    let {canvas, staticPoints} = this.state
    let point = staticPoints[idx] || movementUtils.createPoint({
      radiusMin: STATIC_RADIUS_MIN,
      radiusMax: STATIC_RADIUS_MAX,
    })
    canvasUtils.drawDot(point, canvas, "#111")

    staticPoints[idx] = point
    this.setState({staticPoints})
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

export default Day7
