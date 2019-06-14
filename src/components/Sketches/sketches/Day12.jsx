import React, {Component} from "react"
import _ from "lodash"
import classNames from "classnames"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"
import mlk from "./mlk.png"

require('./Day12.scss')

let animationRequestId
// const CANVAS_RGB = "250, 227, 151"
const CANVAS_RGB = "255, 255, 255"
const NUM_STARS = 1000
const NUM_FOGS = 1
const STAR_RGB = CANVAS_RGB
const STAR_CYCLE_LENGTH = 200
const TEXT_RGB = "24, 26, 39"

class Day12 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: 678,
      canvas: null,
      canvasPos: null,
      mousePos: null,
      stars: null,
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    let canvasPos = {
      x: this.canvas.offsetLeft,
      y: this.canvas.offsetTop
    }
    this.setState({canvasPos})
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day12")
  }

  draw = () => {
    let {width, height, canvas, stars} = this.state

    if (canvas) {
      this.drawImage()
      this.drawFog()
      this.drawStars()
    }

    animationRequestId = window.requestAnimationFrame(this.draw)
  }

  drawImage = () => {
    let {canvas} = this.state

    let img = new Image()
    img.src = mlk
    canvas.drawImage(img, 0, 0)
  }

  drawGradient = p => {
    let {canvas} = this.state

    let fogScale = 3
    let r = 90
    // x0, y0, r0, x1, y1, r1
    let radialGradient = canvas.createRadialGradient(
      p.x,
      p.y,
      0,
      p.x,
      p.y,
      r * fogScale
    )

    var fogDensity = 1
    radialGradient.addColorStop(0.6, "rgba(255, 255, 255, " + fogDensity + ")")
    radialGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    canvas.fillStyle = radialGradient
    canvas.fillRect(
      p.x - r * fogScale,
      p.y - r * fogScale,
      fogScale * 2 * r,
      fogScale * 2 * r,
    )
  }

  createFog = () => {
    let {width, height} = this.state

    let fog = movementUtils.createPoint({
      boundX: width,
      boundY: height,
      speedMin: 1,
      speedMax: 3,
      radiusMin: 100,
      radiusMax: 140,
    })

    // fog.interval = 0
    // fog.maxR = fog.r
    return fog
  }

  drawFog = () => {
    let {canvas, fogs, mousePos} = this.state
    if (!mousePos) return

    this.drawGradient(mousePos)

    // canvas.save()
    // canvas.globalCompositeOperation = "soft-light"
    // canvas.restore()
  }

  createStar = () => {
    let {width, height} = this.state

    let star = movementUtils.createPoint({
      boundX: width,
      boundY: height,
      speedMin: 0,
      speedMax: 0.05,
      radiusMin: 1,
      radiusMax: 2,
    })

    star.interval = 0
    star.maxR = star.r
    return star
  }

  drawStars(opacity) {
    let {canvas, stars} = this.state

    if (!stars) {
      stars = _.times(NUM_STARS, this.createStar)
      stars = _.map(stars, star => {
        star.interval = _.random(STAR_CYCLE_LENGTH)
        return star
      })
    }

    const numSteps = (STAR_CYCLE_LENGTH + 1) / 2
    const opacityStep = 1 / numSteps
    stars = _.map(stars, star => {
      if (star.interval > STAR_CYCLE_LENGTH) star = this.createStar()
      const stepNum = numSteps - Math.abs(star.interval - numSteps)
      const opacity =  opacityStep * stepNum
      star.r = opacity * star.maxR + 1
      star = movementUtils.moveRandomly(star, {
        percentChangeChangeDir: 0.03
      })

      canvasUtils.drawDot(star, canvas, `rgba(${STAR_RGB}, ${opacity})`)
      star.interval++
      return star
    })

    this.setState({stars})
  }

  onMouseMove = e => {
    let {canvasPos} = this.state
    let mousePos = {
      x: e.clientX - canvasPos.x || 0,
      y: e.clientY - canvasPos.y || 0
    }
    this.setState({mousePos})
  }

  onMouseOut = e => {
    this.setState({mousePos: null})
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

export default Day12
