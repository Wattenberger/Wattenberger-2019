import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day23.scss')

const SVG_HEIGHT = 400
const PUPPY_DIMENSION = 100
const PUPPY_BUFFER = 20
const TOTAL_PUPPY_DIMENSION = PUPPY_DIMENSION + PUPPY_BUFFER
const faceColors = [
  "#ddd",
  "navajowhite",
  "#FF7C59",
  "#D56649",
  "#AA5039",
  "#7F3B29",
  // "#53261A",

  "#27556C",
  "#3E82A3",
  "#326B87",
  // "#1D3F50",
  // "#122935",

  "#867376",
  "#DFBFC4",
  "#AF9397",
  // "#5A5152",
  // "#211F1F",

  "#7C776F",
  "#CECAC2",
  "#A39E96",
  // "#504C45",
  // "#312C22",

  // "#47504E",
  "#7D8583",
  "#616967",
  // "#2C3432",
  // "#16201D",

  "#7C746F",
  "#CEC7C2",
  "#A39B96",
  // "#504945",
  // "#312822",

  // "#4B4D53",
  "#83858A",
  "#65686D",
  "#2F3136",
  // "#181A21",

]
const eyeColors = [
  "charcoal",
  "#003423",
  // "#026243",
  "#4E1A00",
  // "#943403",
  "#480011",
  "#880322",
  // "#113C4F",
  // "#455311",
  "#563612",
  "#7D4D16",
]

const getPuppyCircle = (ranges, color, mirror=false, className="") => {
  const defaultRanges = {
    width:  [0, 1],
    height: [0, 1],
    x:      [0, 0],
    y:      [0, 0],
  }
  const calculatedRanges = _.extend({}, defaultRanges, ranges)

  const width  = PUPPY_DIMENSION * _.random(calculatedRanges.width[0],  calculatedRanges.width[1],  true)
  const height = PUPPY_DIMENSION * _.random(calculatedRanges.height[0], calculatedRanges.height[1], true)
  const x      = PUPPY_DIMENSION / 2 - PUPPY_DIMENSION * _.random(calculatedRanges.x[0],      calculatedRanges.x[1],      true)
  const y      = PUPPY_DIMENSION / 2 - PUPPY_DIMENSION * _.random(calculatedRanges.y[0],      calculatedRanges.y[1],      true)
  const rotate = calculatedRanges.rotate && _.random(-calculatedRanges.rotate[0], calculatedRanges.rotate[1], true)

  return _.times(mirror ? 2 : 1, i => (
    <ellipse
      key={i}
      className={className}
      cx={ranges.x ? (i ? -x : x) : 0}
      rx={width / 2}
      cy={ranges.y ? -y : 0}
      ry={height / 2}
      style={{
        fill: color,
        transform: `rotate(${(rotate || 0) * (i ? 1 : -1)}deg)`
      }}
    />
  ))
}

class Day23 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: SVG_HEIGHT,
      width: window.innerWidth,
      svg: null,
      interval: null,
      puppies: [],
      iterations: 0,
      numPuppies: 0,
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const numPuppies = Math.floor(width / TOTAL_PUPPY_DIMENSION) - 1
    this.setState({ svg, width, numPuppies })

    this.createPuppy()
    const interval = window.setInterval(this.createPuppy, 1200)
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    if (interval) window.clearInterval(interval)
  }

  createPuppy = () => {
    let { width, puppies, iterations, numPuppies } = this.state

    iterations++

    let newPuppies = [...puppies, this.getPuppy({
      x: puppies.length * TOTAL_PUPPY_DIMENSION + TOTAL_PUPPY_DIMENSION / 2,
      y: SVG_HEIGHT / 2,
    })]
    newPuppies = _.map(newPuppies, (puppy, i) => i > newPuppies.length - numPuppies ? puppy : null)

    this.setState({ puppies: newPuppies, iterations })
  }

  getPuppy = (pos) => {
    const { width } = this.state
    const faceColor = _.sample(faceColors)
    const eyeColor = _.sample(eyeColors)
    const snoutColor = d3.color(faceColor).brighter(_.random(0.1, 0.8))
    console.log([
      `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      `rotate3d(${_.random(-30, 30, true)}deg)`,
      `scale3d(${_.random(0.8, 1.2, true)}, ${_.random(0.8, 1.2, true)}, 1)`,
    ].join(" "))
    return (
      <g
        className="puppy"
        key={`${pos.x},${pos.y}`}>
        <g
          style={{
            transform: [
              `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              `rotate(${_.random(-30, 30, true)}deg)`,
              `scale3d(${_.random(0.8, 1.2, true)}, ${_.random(0.8, 1.2, true)}, 1)`,
            ].join(" ")
          }}>
          {this.generateFace(faceColor)}
          {this.generateEars(!!_.random(0, 20) ? faceColor : _.sample(faceColors))}
          {this.generateSnout(snoutColor)}
          {this.generateNose("black")}
          {this.generateEyes(eyeColor)}
        </g>
      </g>
    )
  }

  generateFace = (color) => (
    getPuppyCircle({
      width:  [0.7, 1],
      height: [0.7, 1],
    }, color, false, "puppy__face")
  )

  generateEars = (color, reverse=false) => (
    getPuppyCircle({
      width:  [0.1,  0.3],
      height: [0.1,  0.6],
      x:      [0.02, 0.2],
      y:      [0.1,  0.5],
      rotate: [-30,   6],
    }, color, true, "puppy__ear")
  )

  generateSnout = (color) => (
    getPuppyCircle({
      width:  [0.2,  0.6],
      height: [0.26, 0.5],
      y:      [0.6,  0.8],
    }, color, false, "puppy__snout")
  )

  generateNose = (color) => (
    getPuppyCircle({
      width:  [0.08, 0.2],
      height: [0.06, 0.1],
      y:      [0.6,  0.7],
    }, color, false, "puppy__nose")
  )

  generateEyes = (color, reverse=false) => (
    getPuppyCircle({
      width:  [0.05, 0.2],
      height: [0.05, 0.2],
      x:      [0.2,  0.36],
      y:      [0.2,  0.6],
    }, color, true, "puppy__eye")
  )


  getClassName() {
    return classNames("Day23")
  }

  render() {
    let { height, width, puppies, iterations, numPuppies } = this.state

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <rect
            className="Day23__background"
            height={height}
            width={width}
          />
          <g className="puppies" style={{
            transform: `translate3d(-${(iterations - numPuppies) * TOTAL_PUPPY_DIMENSION}px, 0, 0)`
          }}>
            {puppies}
          </g>
        </svg>
      </div>
    )
  }
}

export default Day23
