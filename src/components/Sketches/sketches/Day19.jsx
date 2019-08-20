import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day19.scss')

let animationRequestId
const HEIGHT = 400
const CHANCE_OF_NEW_BLOB = 0.1
const CANVAS_RGB = "245,247,249"
const BLOB_COLORS = ["#539FA2","#72B1A4","#ABCCB1","#C4DBB4","#D4E2B6"]
const BLOB_GROWTH_MAX = 6
const BLOB_OPACITY_START = 1
const BLOB_RADIUS_RANGE = [2, 4]

class Day19 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: HEIGHT,
      width: window.innerWidth,
      canvas: null,
      blobs: [],
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    // canvas.filter = 'blur(5px)'
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day19")
  }

  draw = () => {
    let {canvas} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(0.06, canvas, CANVAS_RGB)
      this.drawWatercolor()
    }

    animationRequestId = window.requestAnimationFrame(this.draw)
  }

  drawWatercolor = origin => {
    let {blobs} = this.state

    let doneBlobs = []

    if (_.random(1, true) < CHANCE_OF_NEW_BLOB) this.createNewBlob()
    _.each(blobs, (blob, idx) => {
      this.drawBlob(blob)
      blob.r += _.random(BLOB_GROWTH_MAX, true)
      blob.opacity -= 0.01
      if (blob.opacity < 0) doneBlobs.push(idx)
    })
    blobs = _.filter(blobs, (blob, idx) => doneBlobs.indexOf(idx) == -1)

    this.setState({blobs})
  }

  drawBlob = blob => {
    let {canvas} = this.state
    canvas.globalAlpha = blob.opacity < 0.1 ? 0.6 - blob.opacity : blob.opacity
    canvasUtils.drawDot(blob, canvas, blob.color, "stroke")
  }

  createNewBlob = () => {
    let {height, width, blobs} = this.state

    let blob = movementUtils.createPoint({
      height,
      width,
      radiusMin: BLOB_RADIUS_RANGE[0],
      radiusMax: BLOB_RADIUS_RANGE[1],
    })

    blob.color = BLOB_COLORS[_.random(BLOB_COLORS.length)]
    blob.opacity = BLOB_OPACITY_START

    blobs.push(blob)
    this.setState({blobs})
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

export default Day19
