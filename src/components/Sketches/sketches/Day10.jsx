import React, {Component} from "react"
import classNames from "classnames"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day10.scss')

let animationRequestId
const CANVAS_RGB = "255,255,255"
const PATH_COLORS = ["#A6CFE2", "#F0CF61", "#DABAAF"]
const RADIUS_MIN = 3
const RADIUS_MAX = 20
const MIN_PETALS = 4
const MAX_PETALS = 10
const PETAL_OFFSET = 4
const COLORS = ["164,53,84", "147,29,61", "247,158,131", "231,89,19", "246,235,187"]
const MIDDLE_COLOR = "#f4f4f4"

class Day10 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      canvas: null,
      currentFlower: null,
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvas.lineCap = "round"
    canvas.lineWidth = 1

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day10")
  }

  draw = () => {
    let {canvas} = this.state

    this.drawFlower()
    animationRequestId = window.requestAnimationFrame(this.draw)
  }

  drawFlower = () => {
    let {currentFlower} = this.state

    if (!currentFlower || currentFlower.petals >= currentFlower.numPetals) {
      this.makeNewFlower()
    } else {
      this.drawPetal()
    }

  }

  makeNewFlower() {
    let {canvas} = this.state
    if (!canvas) return

    if (canvas) canvasUtils.fadeCanvas(0.06, canvas, CANVAS_RGB)
    let currentFlower = movementUtils.createPoint({
      radiusMin: RADIUS_MIN,
      radiusMax: RADIUS_MAX,
    })
    currentFlower.petals = 0
    currentFlower.petalColor = `rgba(${COLORS[_.random(COLORS.length)]}, ${_.random(.9, 1, true)})`
    currentFlower.numPetals = _.random(MIN_PETALS, MAX_PETALS)
    currentFlower.rx = _.random(currentFlower.numPetals * 0.3, currentFlower.numPetals * 3)
    currentFlower.ry = _.random(currentFlower.numPetals * 0.5, currentFlower.numPetals)

    this.setState({currentFlower})

    canvas.fillStyle = MIDDLE_COLOR
    let middleArgs = [this.getArcMethod(currentFlower)]
    canvasUtils.createPathMethods(middleArgs, canvas)
    canvas.fill()
  }
  // arc(x, y, radius, startAngle, endAngle, anticlockwise)
  getArcMethod = (p) => ({type: "arc", args: [p.x, p.y, p.r, 0, Math.PI * 2, true]})
  // x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise
  getEllipseMethod = (p) => ({type: "ellipse", args: [p.x, p.y, p.rx, p.ry, p.rotation, 0, Math.PI * 2, true]})

  drawPetal() {
    let {canvas, currentFlower} = this.state
    if (!canvas) return

    canvas.fillStyle = currentFlower.petalColor
    let petal = this.getOffsetInCircle(currentFlower, currentFlower.petals / currentFlower.numPetals)
    let petalArgs = [this.getEllipseMethod(petal)]
    canvasUtils.createPathMethods(petalArgs, canvas)
    canvas.fill()

    currentFlower.petals++
    this.setState({currentFlower})
  }

  getOffsetInCircle(p, perc) {
    let offset = p.r + p.rx
    let angle = 360 * perc
    return {
      x: Math.cos(angle * Math.PI / 180) * offset + p.x,
      y: Math.sin(angle * Math.PI / 180) * offset + p.y,
      rotation: Math.PI * 2 * perc,
      rx: p.rx,
      ry: p.ry,
    }
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

export default Day10
