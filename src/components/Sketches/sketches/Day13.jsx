import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Button from 'components/_ui/Button/Button'
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day13.scss')

let animationRequestId
const INTERVAL_LENGTH = 40
const SNAKE_STARTING_LENGTH = 6
const CANVAS_RGB = "240, 240, 244"
const SNAKE_RGB = "153, 199, 137"
const TARGET_RGB = "211, 125, 78"
const BOARD_PX_ACROSS = 40
const BOARD_CENTER = Math.floor(BOARD_PX_ACROSS / 2)
const TILE_PX = 10
const BOARD_WIDTH = BOARD_PX_ACROSS * TILE_PX

class Day13 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: BOARD_WIDTH,
      width: BOARD_WIDTH,
      canvas: null,
      snake: null,
      target: null,
      hasDrawnAfterDirChange: false,
      history: [],
      playing: false,
      score: null,
      record: null,
    }
  }

  startNewGame = () => {
    let {playing} = this.state
    if (playing) return

    this.setState({
      snake: null,
      target: null,
      history: [],
      playing: true,
    })
    setTimeout(() => {
      this.draw()
    })
  }

  endGame() {
    let {snake, record} = this.state

    let score = snake.length - SNAKE_STARTING_LENGTH
    record = Math.max(score, record)
    this.setState({
      score,
      record,
      playing: false
    })
  }

  changeDir(dir, e) {
    e.preventDefault()

    let {hasDrawnAfterDirChange, playing, snake} = this.state
    if (!playing || !hasDrawnAfterDirChange) return

    const checkAxis = (axis) => Math.abs(dir[axis] - snake.dir[axis]) > 1
    if (checkAxis("x") || checkAxis("y")) return

    snake.dir = dir
    hasDrawnAfterDirChange = false
    this.setState({snake, hasDrawnAfterDirChange})
  }

  keypresses = {
    [KEYS.LEFT]: this.changeDir.bind(this, {x: -1, y: 0}),
    [KEYS.RIGHT]: this.changeDir.bind(this, {x: 1, y: 0}),
    [KEYS.UP]: this.changeDir.bind(this, {x: 0, y: -1}),
    [KEYS.DOWN]: this.changeDir.bind(this, {x: 0, y: 1}),
    [KEYS.ENTER]: this.startNewGame,
  };

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
    return classNames("Day13")
  }

  draw = () => {
    let {width, height, canvas, playing} = this.state
    if (!playing) return

    if (canvas) {
      canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
      this.drawTarget()
      this.drawSnake()
      this.setState({hasDrawnAfterDirChange: true})
    }

    animationRequestId = setTimeout(() => {window.requestAnimationFrame(this.draw)}, INTERVAL_LENGTH)
  }

  createSnake = () => ({
    length: SNAKE_STARTING_LENGTH,
    dir: {x: 1, y: 0},
    pos: {x: BOARD_CENTER, y: BOARD_CENTER}
  })

  interpPos = (p1, p2) => {
    let {width, height} = this.state
    let interpPlane = (dimension, bound) => {
      let newPoint = (p1[dimension] + p2[dimension]) % bound
      if (newPoint < 0) newPoint = bound + newPoint
      return newPoint
    }
    return {
      x: interpPlane("x", Math.floor(width / TILE_PX)),
      y: interpPlane("y", Math.floor(height / TILE_PX)),
    }
  }

  drawSnake() {
    let {width, height, canvas, snake, history, target, points} = this.state
    if (!snake) snake = this.createSnake()

    let newPos = this.interpPos(snake.pos, snake.dir)
    _.extend(snake.pos, newPos)

    // Eat?
    if (newPos.x == target.x && newPos.y == target.y) {
      target = this.createTarget()
      snake.length++
    }

    // Die?
    if (_.find(history, historyPoint => historyPoint.x == newPos.x && historyPoint.y == newPos.y)) {
      this.endGame()
    }

    history.unshift(newPos)
    history = history.splice(0, snake.length)
    _.map(history, historyPoint => {
      this.drawPx(historyPoint, SNAKE_RGB)
    })

    this.setState({snake, history, target, points})
  }

  drawPx(pos, rgb, style="fill") {
    let {canvas} = this.state

    canvas[`${style}Style`] = `rgb(${rgb})`
    canvas[`${style}Rect`](
      pos.x * TILE_PX,
      pos.y * TILE_PX,
      TILE_PX,
      TILE_PX,
    )
  }

  drawCircle(pos, rgb, style="fill") {
    let {canvas} = this.state

    canvas.lineWidth = 2.5
    let halfTile = TILE_PX / 2
    canvasUtils.drawDot({
      x: pos.x * TILE_PX + halfTile,
      y: pos.y * TILE_PX + halfTile,
      r: TILE_PX * 0.35,
    }, canvas, `rgb(${rgb})`, style)
  }

  createTarget = () => ({
    y: _.random(BOARD_PX_ACROSS - 1),
    x: _.random(BOARD_PX_ACROSS - 1),
  })

  drawTarget() {
    let {canvas, target} = this.state
    if (!target) target = this.createTarget()

    // this.drawPx(target, TARGET_RGB, "stroke")
    this.drawCircle(target, TARGET_RGB, "stroke")
    this.setState({target})
  }

  getGameOverlayStyle = () => ({
    width: `${BOARD_WIDTH}px`,
    height: `${BOARD_WIDTH}px`,
  })

  renderGameOverlay() {
    let {score, record} = this.state

    return <div className="Day13__overlay" style={this.getGameOverlayStyle()}>
      {record ?
        <div>
          <h6>Last game: {score}</h6>
          <h6>Record: {record}</h6>
        </div>
        :
        <h6>Play snake</h6>
      }
      <Button onClick={this.startNewGame}>New Game (Enter)</Button>
    </div>
  }

  render() {
    let {height, width, playing} = this.state

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        {!playing && this.renderGameOverlay()}
        <canvas
          height={height}
          width={width}
          ref={canvas => this.canvas = canvas}
          key
        />
      </div>
    )
  }
}

export default Day13
