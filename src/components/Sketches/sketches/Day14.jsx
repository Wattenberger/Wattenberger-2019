import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Button from 'components/_ui/Button/Button'
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"
import {defaultAspects, features} from "./faceFeatures"

require('./Day14.scss')

let animationRequestId
const MID_X = window.innerWidth / 2
const CANVAS_RGB = "182, 202, 192"
const INTERVAL_LENGTH = 1000

class Day14 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400,
      width: window.innerWidth,
      canvas: null,
    }
  }

  keypresses = {
    // [KEYS.ENTER]: this.startNewGame,
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
    return classNames("Day14")
  }

  draw = () => {
    let {width, height, canvas} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
      this.drawFace()
    }

    animationRequestId = setTimeout(() => {
      window.requestAnimationFrame(this.draw)
    }, canvas ? INTERVAL_LENGTH : 0)
  }

  drawFace() {
    let {width, height, canvas} = this.state
    let scale = 6
    let face = this.createFace(scale)
    let mid = {
      x: width / 2,
      y: (height - face.outline.points[face.outline.points.length - 1].y) / 2,
    }
    let mixFlipped = _.extend({}, mid, {x: mid.x + 0.4})

    _.each(face, (feature, key) => {
      this.drawFeature(feature, false, mid)
      this.drawFeature(feature, true, mixFlipped)
    })
  }

  drawFeature(feature, mirrored, mid) {
    let {canvas} = this.props
    let method = feature.type == "line"    ? "drawLine"    :
                 feature.type == "circle"  ? "drawEllipse" :
                 feature.type == "rect"    ? "drawRect"    :
                 feature.type == "outline" ? "drawOutline" :
                 null

    this[method](feature, mirrored, mid)
  }

  drawLine(point, mirrored, mid) {
    let {canvas} = this.state
    let xMult = mirrored ? -1 : 1
    let style = point.style || "stroke"

    canvas.lineWidth = point.lineWidth || 2
    canvas[`${style}Style`] = point.color || "#444"
    let points = [
      {args: [mid.x + point.x * xMult, mid.y + point.y]},
      {args: [mid.x + point.x * xMult + point.width * xMult, mid.y + point.y]},
    ]
    canvasUtils.createPathMethods(points, canvas)
    canvas[style]()
  }

  drawEllipse(point, mirrored, mid) {
    let {canvas} = this.state
    let xMult = mirrored ? -1 : 1
    let offset = point.offset || 0

    canvasUtils.drawDot({
      x: mid.x + point.x * xMult + point.r / 2 * xMult + offset,
      y: mid.y + point.y + point.r / 2,
      r: Math.abs(point.r),
    }, canvas, point.color || "#000", point.style || "stroke")
  }

  drawRect(point, mirrored, mid) {
    let {canvas} = this.state
    let xMult = mirrored ? -1 : 1
    let style = point.style || "stroke"

    canvas[`${style}Style`] = point.color || "#444"
    canvas[`${style}Rect`](
      mid.x + point.x * xMult,
      mid.y + point.y,
      point.width * xMult,
      point.height,
    )
  }

  drawOutline(feature, mirrored, mid) {
    let {canvas} = this.state
    let mult = mirrored ? -1 : 1
    let style = feature.style || "stroke"

    canvas.lineWidth = feature.lineWidth || 2
    canvas[`${style}Style`] = feature.color || "#444"
    let lastPoint = _.extend({}, mid)

    let aspects = _.map(feature.points, p => {
      let x = mid.x + p.x * mult
      let y = mid.y + p.y
      let yBetween = (y - lastPoint.y) / 2 + lastPoint.y
      let xMax = Math.max(lastPoint.x * mult, x * mult) * mult
      lastPoint = {x, y}

      return {type: "quadraticCurveTo", args: [xMax + 5 * mult, yBetween, x, y]}
    })
    aspects.unshift({args: [mid.x, mid.y]})

    // let points = [
    //   // {args: [mid.x, y2]},
    //   // {args: [mid.x, y1]},
    //   // {args: [x1, y1]},
    //   // {args: [x2, y2]},
    //   // canvasUtils.getArcPathMethod({x: x2, y: y1}, {x: x2, y: y2}),
    //   ...points,
    // ]
    canvasUtils.createPathMethods(aspects, canvas)
    canvas[style]()
  }

  isTuple = obj => _.isArray(obj) && obj.length == 2

  createFace = (scale) => {
    let face = {}

    _.each(features, (feature, featureKey) => {
      let args = {}
      _.each(feature, (aspect, aspectKey) => {
        if (this.isTuple(aspect)) args[aspectKey] = _.random(...aspect, true) * scale
        if (aspectKey == "xRel") args.x = face[aspect.feature][aspect.aspect || "x"] + (aspect.end ? face[aspect.feature].width : 0) + _.random(...aspect.distance, true) * scale
        if (aspectKey == "yRel") args.y = face[aspect.feature][aspect.aspect || "y"] + (aspect.end ? face[aspect.feature].height : 0) + _.random(...aspect.distance, true) * scale
        if (aspectKey == "color" && _.isArray(aspect)) args.color = aspect[_.random(aspect.length)]
        if (aspectKey == "points") args.points = _.map(aspect, p => ({x: _.random(...p.x, true) * scale, y: _.random(...p.y, true) * scale}))
        if (aspectKey == "offset") aspect.offset *= scale
      })
      face[featureKey] = _.extend({}, defaultAspects, feature, args)
    })

    return face
  }

  render() {
    let {height, width, playing} = this.state

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
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

export default Day14
