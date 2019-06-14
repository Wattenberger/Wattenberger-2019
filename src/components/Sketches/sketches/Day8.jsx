import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day8.scss')

let animationRequestId
const CANVAS_RGB = "255, 255, 255"
const PATH_COLORS = ["#A6CFE2", "#F0CF61", "#DABAAF"]
const NUM_POINTS = 3
const SPEED_MIN = 4
const SPEED_MAX = 12
const RADIUS_MIN = 20
const RADIUS_MAX = 40

class Day8 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      points: []
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day8")
  }

  draw = () => {
    let {canvas} = this.state
    if (canvas) canvasUtils.fadeCanvas(0.06, canvas, CANVAS_RGB)

    _.times(NUM_POINTS, this.drawPoint)
    animationRequestId = window.requestAnimationFrame(this.draw)
  }

  drawPoint = (idx) => {
    let {canvas, points} = this.state
    if (!canvas) return

    let point = points[idx] || movementUtils.createPoint({
      speedMin: SPEED_MIN,
      speedMax: SPEED_MAX,
      radiusMin: RADIUS_MIN,
      radiusMax: RADIUS_MAX,
    })
    canvasUtils.drawDot(_.extend({}, point, {r: point.r + 1}), canvas, PATH_COLORS[idx % PATH_COLORS.length])
    point = movementUtils.moveRandomly(point, {
      percentChangeChangeDir: 0,
    })
    canvasUtils.drawDot(point, canvas, "#666", "stroke")

    points[idx] = point
    this.setState({points})
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

export default Day8
