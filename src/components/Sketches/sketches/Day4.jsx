import React, {Component} from "react"
import classNames from "classnames"

require('./Day4.scss')

let interval
const INTERVAL_LENGTH = 160
const MAX_DIAMETER = 300
const MAX_ARC_SEGMENTS = 10
const NUM_STREAMS = 10

class Day4 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      canvas: null,
      points: _.times(NUM_STREAMS, () => null),
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
    return classNames("Day4")
  }

  draw = () => {
    let {canvas, point} = this.state
    if (!canvas) return

    // canvas.clearRect(0, 0, width, height)
    _.times(NUM_STREAMS, idx => {this.drawPoint(idx)})
  }

  drawPoint(idx) {
    let {points} = this.state
    let point = points[idx]
    if (point && point.perc < 1) {
      this.continueArc(idx)
    } else {
      this.startNewPoint(idx)
    }
  }

  startNewPoint(idx) {
    let {width, height, canvas, points, clockwise} = this.state
    let point = points[idx] || {x: width / 2, y: height / 2}

    let newPoint = {
      x: _.random(point.x < 20 ? 0 : -MAX_DIAMETER, point.x > width - 20 ? 0 : MAX_DIAMETER) + point.x,
      y: _.random(point.y < 20 ? 0 : -MAX_DIAMETER, point.y > height - 20 ? 0 : MAX_DIAMETER) + point.y,
      speed: _.random(MAX_ARC_SEGMENTS)
    }

    const l = newPoint.x - point.x
    const h = newPoint.y - point.y
    const r = Math.sqrt(Math.abs(h*h) + Math.abs(l*l)) / 2
    const startAngle = Math.tanh(h / l)

    _.extend(newPoint, {
      l, h, startAngle, r: r, perc: 0
    })

    this.drawDot(newPoint, "#fff")
    points[idx] = newPoint
    this.setState({points, clockwise: !clockwise})
  }

  fadeCanvas(pct, canvas) {
    let {width, height} = this.state
    canvas = canvas || this.state.canvas
    if (!canvas) return

    canvas.fillStyle = `rgba(5, 90, 91, ${pct})`
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

  continueArc(idx) {
    let {canvas, points, clockwise} = this.state
    let point = points[idx]
    let endAngle = point.startAngle - Math.PI * 2 * point.perc

    canvas.strokeStyle = "rgba(255, 255, 255, 0.9)"
    this.createPathMethods([
      {
        type: "arc",
        // arc(x, y, radius, startAngle, endAngle, anticlockwise)
        args: [point.x + point.l / 2, point.y + point.h / 2, point.r, point.startAngle, endAngle, clockwise]
      },
    ], canvas)
    canvas.stroke()
    point.perc += 1 / point.speed

    if (point.perc >= 1) {
      canvas.fill()
    }

    this.fadeCanvas(0.05)
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

export default Day4
