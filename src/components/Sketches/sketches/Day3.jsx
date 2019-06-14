import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"

require('./Day3.scss')

let interval
const INTERVAL_LENGTH = 13
const MAX_DIAMETER = 100
const ARC_SEGMENTS = 10

class Day3 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      canvas: null,
      point: null,
      clockwise: true,
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
    return classNames("Day3")
  }

  draw = () => {
    let {canvas, point} = this.state
    if (!canvas) return

    // canvas.clearRect(0, 0, width, height)
    if (point && point.perc < 1) {
      this.continueArc()
    } else {
      this.startNewPoint()
    }
  }

  startNewPoint() {
    let {width, height, canvas, point, clockwise} = this.state
    point = point || {x: width / 2, y: height / 2}

    let newPoint = {
      x: _.random(point.x < 20 ? 0 : -MAX_DIAMETER, point.x > width - 20 ? 0 : MAX_DIAMETER) + point.x,
      y: _.random(point.y < 20 ? 0 : -MAX_DIAMETER, point.y > height - 20 ? 0 : MAX_DIAMETER) + point.y,
    }

    const l = newPoint.x - point.x
    const h = newPoint.y - point.y
    const r = Math.sqrt(Math.abs(h*h) + Math.abs(l*l)) / 2
    const startAngle = Math.tanh(h / l)

    _.extend(newPoint, {
      l, h, startAngle, r: r, perc: 0
    })

    this.drawDot(newPoint, "#45aeb1")
    this.setState({point: newPoint, clockwise: !clockwise})
  }

  fadeCanvas(pct, canvas) {
    let {width, height} = this.state
    canvas = canvas || this.state.canvas
    if (!canvas) return

    canvas.fillStyle = `rgba(245, 247, 249, ${pct})`
    canvas.fillRect(0, 0, width, height)
  }

  drawDot(point, color) {
    let {canvas} = this.state
    canvas.fillStyle = color
    this.createPathMethods([
      {
        type: "arc",
        args: [point.x, point.y, 2, 0, Math.PI * 2, false]
      },
    ], canvas)
    canvas.fill()
  }

  continueArc() {
    let {canvas, point} = this.state
    let endAngle = point.startAngle - Math.PI * point.perc

    canvas.strokeStyle = "rgba(0, 0, 0, 0.4)"
    this.createPathMethods([
      {
        type: "arc",
        // arc(x, y, radius, startAngle, endAngle, anticlockwise)
        args: [point.x + point.l / 2, point.y + point.h / 2, point.r, point.startAngle, endAngle, true]
      },
    ], canvas)
    canvas.stroke()
    point.perc += 1 / ARC_SEGMENTS

    this.fadeCanvas(0.04)
  }

  createPathMethods(points, canvas) {
    canvas.beginPath()
    let moveTo
    points.map((point, idx) => {
      let method = point.type || (moveTo || !idx ? "moveTo" : "lineTo")
      canvas[method](...point.args)
      moveTo = !!point.type
    })
  }

  drawPath() {
    let {canvas} = this.state

    let points = _.times(3, i => ({
      args: [
        _.random(canvas.canvas.width),
        _.random(canvas.canvas.height),
      ]
    }))
    this.createPathMethods(points, canvas)
    canvas.fill()
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

export default Day3
