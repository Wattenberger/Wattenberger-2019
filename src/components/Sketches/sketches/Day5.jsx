import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"

require('./Day5.scss')

let interval
const INTERVAL_LENGTH = 10
const MAX_DIAMETER = 30
const NUM_INTERPOLATIONS = 10
const NUM_STREAMS = 10
const CANVAS_RGB = "198, 215, 199"

class Day5 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      points: _.times(NUM_STREAMS, () => null),
      interpolation: NUM_INTERPOLATIONS,
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})
    this.fadeCanvas(1, canvas)
    interval = window.setInterval(this.draw, INTERVAL_LENGTH)
  }

  componentWillUnmount() {
    window.clearInterval(interval)
  }

  getClassName() {
    return classNames("Day5")
  }

  draw = () => {
    let {canvas, interpolation} = this.state
    if (!canvas) return

    // canvas.clearRect(0, 0, width, height)
    this.fadeCanvas(0.6)
    if (interpolation < NUM_INTERPOLATIONS) {
      _.times(NUM_STREAMS, idx => {this.interpolatePoint(idx)})
    } else {
      _.times(NUM_STREAMS, idx => {this.drawPoint(idx, idx - 1)})
      this.setState({interpolation: 0})
    }
  }

  interpolatePoint(idx) {
    let {points, interpolation} = this.state
    let point = points[idx]
    if (!point) return

    point.x = point.x += point.xInterpolation
    point.y = point.y += point.yInterpolation

    this.drawDot(point, idx ? "#fff" : "#FF5035")

    this.setState({interpolation: interpolation + 1})
    points[idx] = point
    this.setState({points})
  }

  drawPoint(idx, targetIdx) {
    let {width, height, points} = this.state
    let point = points[idx] || {x: _.random(width), y: _.random(height), r: _.random(MAX_DIAMETER - idx * 2 - 10, MAX_DIAMETER - idx * 2)}
    let target = points[targetIdx]
    if (!target) {
      point.xDir = !point.xDir || point.x < 60 || point.x > width - 60 || _.random(1, true) < 1 / 90 ? this.getRandomDeltaWithinBounds(point.x, width) : point.xDir
      point.yDir = !point.yDir || point.y < 60 || point.y > height - 60 || _.random(1, true) < 1 / 90 ? this.getRandomDeltaWithinBounds(point.y, height) : point.yDir
      target = {
        x: point.x + point.xDir,
        y: point.y + point.yDir,
      }
    }

    const moveTowardsTarget = (pos, targetPos) => {
      let dist = targetPos - pos
      return Math.min(Math.abs(dist), _.random(idx ? points.length * 5 - idx * 4 : points.length * 6)) * (dist < 0 ? -1 : 1)
    }
    point.xInterpolation = moveTowardsTarget(point.x, target.x) / NUM_INTERPOLATIONS
    point.yInterpolation = moveTowardsTarget(point.y, target.y) / NUM_INTERPOLATIONS
    points[idx] = point
    this.setState({points})

    this.interpolatePoint(idx)
  }

  getRandomDeltaWithinBounds(currentPos, bound, maxMovement = 100, padding = 60) {
    return _.random(currentPos < padding ? 0 : -maxMovement, currentPos > bound - padding ? 0 : maxMovement)
  }

  fadeCanvas(pct, canvas) {
    let {width, height} = this.state
    canvas = canvas || this.state.canvas
    if (!canvas) return

    canvas.fillStyle = `rgba(${CANVAS_RGB}, ${pct})`
    canvas.fillRect(0, 0, width, height)
  }

  drawDot(point, color) {
    let {canvas} = this.state
    canvas.fillStyle = color
    this.createPathMethods([
      {
        type: "arc",
        args: [point.x, point.y, point.r || 2, 0, Math.PI * 2, false]
      },
    ], canvas)
    canvas.fill()
  }

  createPathMethods(points, canvas) {
    canvas.beginPath()
    let moveTo
    points.map((point, idx) => {
      let method = point.type || (moveTo || !idx ? "moveTo" : "lineTo")
      canvas[method](...point.args)
      moveTo = !!point.type
      return
    })
  }

  render() {
    let {height, width} = this.state

    return (
      <div className={this.getClassName()}>
        <canvas
          height={height}
          width={width}
          ref={canvas => this.canvas = canvas}
        />
      </div>
    )
  }
}

export default Day5
