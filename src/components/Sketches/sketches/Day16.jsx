import React, {Component} from "react"
import classNames from "classnames"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day16.scss')

let animationRequestId
const INTERVAL_LENGTH = 30
const NUM_TREES = 13
const CANVAS_RGB = "96,72,72"
const BRANCH_COLOR = "rgba(255,255,255, 0.5)"

const STARTING_BRANCHES = 5
const STARTING_WIDTH = 4
const TREE_AGE = 50
const CHANCE_OF_NEW_BRANCH = 0.2
const BRANCH_LENGTH_MIN = 3
const BRANCH_LENGTH_MAX = 30
const MAX_ANGLE_DEVIATION = 0.3
const MAX_WIDTH_DECREASE = 1.3


class Day16 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
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
    window.clearTimeout(animationRequestId)
  }

  getClassName() {
    return classNames("Day16")
  }

  draw = () => {
    let {canvas} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(0.06, canvas, CANVAS_RGB)
      _.times(NUM_TREES, idx => {
        this.drawTree(idx)
      })
    }

    animationRequestId = window.setTimeout(() => {
      window.requestAnimationFrame(this.draw)
    }, canvas ? INTERVAL_LENGTH : 0)
  }

  drawTree = idx => {
    let {width, height, canvas, trees} = this.state

    let tree = trees[idx] || {
      x: _.random(width),
      y: _.random(height),
      branches: [],
      age: 0,
    }
    if (!tree.branches.length) {
      _.times(STARTING_BRANCHES, idx => {
        tree.branches.push(this.createBranch(tree))
      })
    }
    if (tree.age > TREE_AGE) {
      trees.splice(idx, 1)
      this.setState({trees})
      return
    }

    let killedBranches = []
    tree.branches.map((branch, idx) => {
      if (branch.width <= 0) {
        killedBranches.push(idx)
        return
      }

      let length = _.random(BRANCH_LENGTH_MIN, BRANCH_LENGTH_MAX, true)
      branch.width += _.random(-MAX_WIDTH_DECREASE, 0, true)
      branch.angle += _.random(-MAX_ANGLE_DEVIATION, MAX_ANGLE_DEVIATION, true)
      let branchEnd = this.getEndOfLine(branch, length)
      if (branchEnd.x < 0 || branchEnd.x > width ||
          branchEnd.y < 0 || branchEnd.y > height) {
        killedBranches.push(idx)
        return
      }

      canvas.strokeStyle = BRANCH_COLOR
      canvas.lineWidth = branch.width
      canvasUtils.createPathMethods([
        {args: [branch.x, branch.y]},
        {args: [branchEnd.x, branchEnd.y]},
      ], canvas)
      canvas.stroke()

      _.extend(branch, branchEnd)

      if (_.random(1, true) < CHANCE_OF_NEW_BRANCH) tree.branches.push(this.createBranch(branch))
      return branch
    })

    tree.branches = _.filter(tree.branches, (branch, idx) => killedBranches.indexOf(idx) == -1)
    tree.age++

    trees[idx] = tree
    this.setState({trees})
  }

  createBranch = branch => ({
    x: branch.x,
    y: branch.y,
    angle: _.random(360),
    width: branch.width || STARTING_WIDTH
  })

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

export default Day16
