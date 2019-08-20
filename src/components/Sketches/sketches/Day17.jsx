import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day17.scss')

let animationRequestId
const INTERVAL_LENGTH = 1000
const CANVAS_RGB = "245,247,249"
const BLOT_COLOR = "white"
const BLOT_STROKE_COLOR = "#3C485E"

class Day17 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: 400,
      canvas: null,
      trees: [],
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
    return classNames("Day17")
  }

  draw = () => {
    let {canvas} = this.state

    if (canvas) {
      this.drawBlot()
    }

    animationRequestId = setTimeout(() => {
      window.requestAnimationFrame(this.draw)
    }, canvas ? INTERVAL_LENGTH : 0)
  }

  drawBlot = () => {
    let {canvas, height, width} = this.state

    this.resetCanvas(canvas, {width, height})
    let tempCanvas = document.createElement("canvas").getContext("2d")

    let numSections = _.random(3, 9)
    tempCanvas.fillStyle = BLOT_COLOR
    tempCanvas.strokeStyle = BLOT_STROKE_COLOR

    let margin = 10
    let angle = Math.PI / numSections
    let w = tempCanvas.width = width / 2 - margin * 2

    let numPoints = 100
    let point = {
      x: 0,
      dx: 0,
      y: 0,
      dy: 0,
    }

    let points = []
    _.times(numPoints, idx => {
      point = movementUtils.moveRandomly(point, {
        maxMovement: 8,
        percentChangeChangeDir: 0.9,
        height: height * 2,
        width,
      })

      points.push({args: [point.x, point.y]})
    })

    canvasUtils.createPathMethods(points, tempCanvas)

    tempCanvas.fill()
    tempCanvas.stroke()

    canvas.translate(width / 2, height / 2)
    function rotateAndDraw(idx) {
      canvas.save()
      canvas.rotate(idx * angle)
      canvas.drawImage(tempCanvas.canvas, 0, 0)
      canvas.restore()
    }
    _.times(numSections * 2, idx => {
      rotateAndDraw(idx)
      canvas.scale(1, -1)
      rotateAndDraw(idx)
    })
    // canvas.translate(-width / 2, -height / 2)
  }

  resetCanvas = (canvas, params={}) => {
    canvas.setTransform(1, 0, 0, 1, 0, 0)
    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB, params)
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

export default Day17
