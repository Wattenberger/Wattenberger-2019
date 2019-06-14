import React, {Component} from "react"
import classNames from "classnames"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day9.scss')

let animationRequestId
const CANVAS_RGB = "255, 255, 255"
const PATH_COLORS = ["#A6CFE2", "#F0CF61", "#DABAAF"]
const NUM_POINTS = 3
const SPEED_MIN = 40
const SPEED_MAX = 120
const RADIUS_MIN = 2
const RADIUS_MAX = 4

class Day9 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      canvas: null,
      lastLine: null,
      line: null,
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvas.lineCap = "round"
    let lineWidth = _.random(RADIUS_MIN, RADIUS_MAX)
    canvas.lineWidth = lineWidth

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day9")
  }

  draw = () => {
    let {canvas} = this.state
    if (canvas) canvasUtils.fadeCanvas(0.06, canvas, CANVAS_RGB)

    this.drawLine()
    animationRequestId = window.requestAnimationFrame(this.draw)
  }

  drawLine = () => {
    let {canvas, lastLine, line, lineWidth} = this.state
    if (!canvas) return

    lastLine = lastLine || movementUtils.createPoint()
    line = line || movementUtils.createPoint({
      speedMin: SPEED_MIN,
      speedMax: SPEED_MAX,
    })
    let newLine = movementUtils.moveRandomly(line, {
      percentChangeChangeDir: 0.1,
    })
    let pathArgs = [this.getPathMethod(line)]
    pathArgs.push(line.dx + line.dy == newLine.dx + newLine.dy ? this.getPathMethod(newLine) : canvasUtils.getArcPathMethod(line, newLine, lastLine))
    canvas.strokeStyle = "#666"
    canvasUtils.createPathMethods(pathArgs, canvas)
    canvas.stroke()

    this.setState({line: newLine})
  }

  getPathMethod = (line) => ({args: [line.x, line.y]})

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

export default Day9
