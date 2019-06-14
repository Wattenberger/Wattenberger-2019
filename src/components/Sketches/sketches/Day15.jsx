import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day15.scss')

let animationRequestId
const INTERVAL_LENGTH = 2000
const NUM_TREES = 6
const CANVAS_RGB = "192, 194, 206"
const BRANCH_COLOR = "rgba(55, 23, 34, 0.6)"

class Day15 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      canvas: null,
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
    return classNames("Day15")
  }

  draw = () => {
    let {width, height, canvas} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
      _.times(NUM_TREES, idx => {
        this.drawTree({
          x: (width / (NUM_TREES + 1)) * (idx + 1),
          y: height - 20,
        })
      })
    }

    animationRequestId = setTimeout(() => {
      window.requestAnimationFrame(this.draw)
    }, canvas ? INTERVAL_LENGTH : 0)
  }

  drawTree = pos => {
    let {canvas} = this.state

    const startingWidth = 10
    const chanceOfNewBranch = 0.4
    const branchLengthMin = 3
    const branchLengthMax = 30
    const maxAngleDeviation = 0.3
    const maxWidthDecrease = 1.3

    const drawBranch = branch => {
      if (branch.width < 0) return
      branch = _.extend({}, branch)

      let length = _.random(branchLengthMin, branchLengthMax, true)
      branch.width = branch.width + _.random(-maxWidthDecrease, 0, true)
      branch.angle = branch.angle + _.random(-maxAngleDeviation, maxAngleDeviation, true)
      let branchEnd = this.getEndOfLine(branch, length)

      canvas.strokeStyle = BRANCH_COLOR
      canvas.lineWidth = branch.width
      canvasUtils.createPathMethods([
        {args: [branch.x, branch.y]},
        {args: [branchEnd.x, branchEnd.y]},
      ], canvas)
      canvas.stroke()

      _.extend(branch, branchEnd)
      drawBranch(branch)

      if (_.random(1, true) < chanceOfNewBranch) {
        drawBranch(branch)
      }
    }

    drawBranch({x: pos.x, y: pos.y, angle: Math.PI / 2, width: startingWidth})
  }

  getEndOfLine = (line, length) => {
    const xDelta = Math.cos(line.angle) * length
    const yDelta = Math.sin(line.angle) * length
    const x = line.x + xDelta
    const y = line.y - yDelta
    return {x, y}
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

export default Day15
