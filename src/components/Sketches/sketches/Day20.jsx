import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day20.scss')

let animationRequestId
const HEIGHT = 400
const CANVAS_RGB = "217, 226, 231"
const LINE_COLOR = "#474E64"
const INTERVAL_LENGTH = 100
const CHANCE_OF_ROTATION = 0.01
const TILE_WIDTH = 20
const TILE_RADIUS = TILE_WIDTH / 2
const TILE_ROTATION_STEPS = 30

class Day20 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: HEIGHT,
      width: window.innerWidth,
      canvas: null,
      tiles: null,
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    canvas.strokeStyle = LINE_COLOR
    this.draw()
  }

  componentWillUnmount() {
    window.clearTimeout(animationRequestId)
  }

  getClassName() {
    return classNames("Day20")
  }

  draw = () => {
    let {canvas, height, width} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
      this.drawTiles()
    }

    animationRequestId = window.setTimeout(() => {
      window.requestAnimationFrame(this.draw)
    }, canvas ? INTERVAL_LENGTH : 0)
  }

  drawTiles = origin => {
    let {height, width, canvas, tiles} = this.state

    if (!tiles) {
      var tilesAcross = _.floor(width / TILE_WIDTH)
      var tilesDown = _.floor(height / TILE_WIDTH)
      tiles = _.flatMap(_.times(tilesAcross, x => _.times(tilesDown, y => this.createNewTile(x * TILE_WIDTH, y * TILE_WIDTH))))
    }

    _.each(tiles, (tile, idx) => {
      if (!tile.rotation && _.random(1, true) < CHANCE_OF_ROTATION) {
        tile.orientation = _.random(0, 2)
        tile.rotation = 1
      }
      this.drawTile(tile)
    })

    this.setState({tiles})
  }

  createNewTile = (x, y) => ({
    x,
    y,
    orientation: _.random(0,1),
    rotating: 0,
  })

  drawTile = tile => {
    let {canvas} = this.state

    let path1 = [
      {args: [tile.x + TILE_RADIUS, tile.y]},
      {args: tile.orientation == 1 ? [tile.x + TILE_WIDTH, tile.y + TILE_RADIUS] : [tile.x, tile.y + TILE_RADIUS]},
    ]
    let path2 = [
      {args: [tile.x + TILE_RADIUS, tile.y + TILE_WIDTH]},
      {args: tile.orientation == 2 ? [tile.x + TILE_WIDTH, tile.y + TILE_RADIUS] : [tile.x, tile.y + TILE_RADIUS]},
    ]

    if (tile.rotation) {
      let percentRotated = tile.rotation / TILE_ROTATION_STEPS
      if (!tile.orientation) percentRotated = 1 - percentRotated
      if (tile.orientation == 1) path1[1].args[0] = tile.x + (TILE_WIDTH * percentRotated)
      if (tile.orientation == 2) path2[1].args[0] = tile.x + (TILE_WIDTH * percentRotated)

      tile.rotation = (tile.rotation + 1) % 30
    }
    canvasUtils.createPathMethods(path1, canvas)
    canvas.stroke()
    canvasUtils.createPathMethods(path2, canvas)
    canvas.stroke()
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

export default Day20
