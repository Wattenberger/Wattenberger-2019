import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day26.scss')

const SVG_HEIGHT = 400
const FISH_DIMENSION = window.innerWidth * 0.26
const colors = [
  "#fe938c",
  "#edaf97",
  "#c49792",
  "#ad91a3",
  "#9d91a3",
  "#e9c46a",
  "#f4a261",
  "#e76f51",
//   "#554971",
  "#63768d",
  "#8ac6d0",
  "#1693A5",
  "#FBB829",
  "#ADD8C7",
  "#CDD7B6",
  "#FF9999",
  "#CCCCCC",
//   "#7F94B0",
  "#E7807B",
//   "#C5E0DC",
  "#807C8B",
  "#896872",
]
const waterColors = [
  "#2a9d8f",
  "#45aeb1",
  "#77CCA4",
  "#3FB8AF",
  "#90AB76",
  "#61A598",
  "#4ECDC4",
  "#64B6B1",
  "#A1C820",
]

const getFishDimWithinRange = (min = 0, max = 1) => FISH_DIMENSION * _.random(min, max, true)
const getTriangle = (w, h) => (
  "M" + [
    [w / 2, 0].join(" "),
    [w    , h].join(" "),
    [0    , h].join(" "),
  ].join("L ") + "Z"
)

class Day26 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: Math.max(400, window.innerWidth * 0.8),
      width: window.innerWidth,
      svg: null,
      interval: null,
      iteration: 0,
      fish: [],
      numFish: 0,
      bubbles: [],
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const height = Math.max(400, width * 0.54)
    const numFish = 1
    this.setState({ svg, height, width, numFish })

    this.createFish()
    const interval = window.setInterval(this.createFish, 1200)
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    if (interval) window.clearInterval(interval)
  }

  createFish = () => {
    const { numFish, iteration, bubbles } = this.state
    const fish = _.times(numFish, d => this.renderFish())
    const newIteration = iteration + 1
    this.setState({
      fish,
      iteration: newIteration
    })
  }

  renderFish = () => {
    const fish = {
      color: _.sample(colors),
      width: getFishDimWithinRange(0.5, 1),
      height: getFishDimWithinRange(0.1, 1),
      eyeDiameter: getFishDimWithinRange(0.05, 0.1),
      finColor: _.sample(colors),
      lipColor: _.sample(colors),
    }

    return (
      <g>
        {this.renderBubble(fish)}
        {this.renderSideFin(fish)}
        {this.renderSideFin(fish, true)}
        {this.renderBody(fish)}
        {this.renderLips(fish)}
        {this.renderEye(fish)}
        {this.renderFin(fish)}
        {this.renderTail(fish)}
      </g>
    )
  }

  renderBody = fish => (
    <ellipse
      cx={this.getRandomIntoFish(fish.height, 0.5)}
      cy={this.getRandomIntoFish(fish.width, 0.5)}
      ry={fish.height / 2}
      rx={fish.width / 2}
      fill={fish.color}
    />
  )

  renderEye = fish => (
    <g
      className="fish__eye"
      style={{
      transform: [
        "translate3d(",
          this.getRandomIntoFish(fish.width,  0.1, 0.3) + "px,",
          this.getRandomIntoFish(fish.height, 0.3, 0.6) + "px,",
          "0)",
      ].join("")}}>
      <circle
        r={fish.eyeDiameter}
        fill="white"
      />
      <circle
        className="fish__pupil"
        key="fish__pupil"
        r={fish.eyeDiameter * _.random(0.4, 0.9, true)}
        fill={_.sample(colors)}
      />
      <circle
        r={fish.eyeDiameter * _.random(0.1, 0.3)}
        fill="white"
        cx={fish.eyeDiameter * _.random(0, 0.5)}
        cy={fish.eyeDiameter * _.random(-0.4, 0.2)}
      />
    </g>
  )

  getRandomIntoFish = (totalDimension, min, max) => (
    (FISH_DIMENSION - totalDimension) / 2 +
    totalDimension * (_.isNumber(max) ? _.random(min, max, true) : min)
  )

  renderLips = fish => {
    const height = fish.height * _.random(0.1, 0.2, true)
    const width = height * _.random(0.6, 4, true)
    const lipPath = [
      "M", 0, 0,
      "C",
        -width, -height * 2,
        -width,  height * 2,
          0,   0,
      "Z"
    ].join(" ")

    return (
      <g
        style={{
          transform: [
            "translate3d(",
              this.getRandomIntoFish(fish.width, 0.05, 0.2) + "px,",
              this.getRandomIntoFish(fish.height, 0.6,  0.76) + "px,",
            "0)",
          ].join("")
        }}>
        <path
          d={lipPath}
          fill={fish.lipColor}
          style={{
            transform: `rotate3d(1, 1, 1, ${-_.random(0, 90, true)}deg)`,
          }}
        />
        <path
          d={lipPath}
          fill={fish.lipColor}
          style={{
            transform: `rotate3d(1, 1, 1, ${_.random(0, 90, true)}deg)`,
          }}
        />
      </g>
    )
  }

  renderFin = fish => {
    const w = fish.width * _.random(0.05, 0.4, true)
    const h2 = fish.height * _.random(0.1, 0.6, true)
    const h1 = h2 * _.random(0.1, 0.5, true)
    const points = [
      [0, -h1 / 2].join(" "),
      [w, -h2 / 2].join(" "),
      [w, h2 / 2].join(" "),
      [0, h1 / 2].join(" "),
    ]

    return (
      <g
        style={{
          transform: [
            "translate3d(",
            this.getRandomIntoFish(fish.width, 0.4, 0.6) + "px,",
            this.getRandomIntoFish(fish.height, 0.5) + "px,",
            "0)",
          ].join("")
        }}>
        <path
          d={"M" + points.join("L ") + "Z"}
          fill={fish.finColor}
        />
      </g>
    )
  }

  renderTail = fish => {
    const w1 = fish.width * _.random(0.05, 0.4, true)
    const w2 = w1 * _.random(0.2, 1, true)
    const h2 = fish.height * _.random(0.1, 0.9, true)
    const h1 = h2 * _.random(0.1, 0.4, true)
    const points = [
      [0,  -h1 / 2].join(" "),
      [w1, -h2 / 2].join(" "),
      [w2,       0].join(" "),
      [w1,  h2 / 2].join(" "),
      [0,   h1 / 2].join(" "),
    ]

    return (
      <g
        style={{
          transform: [
            "translate3d(",
            this.getRandomIntoFish(fish.width, 0.98) + "px,",
            this.getRandomIntoFish(fish.height, 0.5) + "px,",
            "0)",
          ].join("")
        }}>
        <path
          d={"M" + points.join("L ") + "Z"}
          fill={fish.finColor}
        />
      </g>
    )
  }

  renderFin = fish => {
    const w = fish.width * _.random(0.05, 0.4, true)
    const h2 = fish.height * _.random(0.1, 0.4, true)
    const h1 = h2 * _.random(0.1, 0.9, true)
    const points = [
      [0, -h1 / 2].join(" "),
      [w, -h2 / 2].join(" "),
      [w, h2 / 2].join(" "),
      [0, h1 / 2].join(" "),
    ]

    return (
      <g
        style={{
          transform: [
            "translate3d(",
            this.getRandomIntoFish(fish.width, 0.4, 0.6) + "px,",
            this.getRandomIntoFish(fish.height, 0.5) + "px,",
            "0)",
          ].join("")
        }}>
        <path
          d={"M" + points.join("L ") + "Z"}
          fill={fish.finColor}
        />
      </g>
    )
  }

  renderSideFin = (fish, flipped=false) => {
    const w = fish.width * _.random(0.05, 0.6, true)
    const h2 = fish.height * -_.random(0.1, 0.9, true)
    const h1 = h2 * _.random(0.1, 0.4, true)
    const points = [
      [0,   0].join(" "),
      [0,  h1 * (flipped ? -1 : 1)].join(" "),
      [w,  h2 * (flipped ? -1 : 1)].join(" "),
      [w,   0].join(" "),
    ]

    return (
      <g
        style={{
          transform: [
            "translate3d(",
              (FISH_DIMENSION - fish.width) / 2 + (fish.width - w) * _.random(0.2, 0.8, true) + "px,",
              (flipped ?
                this.getRandomIntoFish(fish.height, 0.86) :
                this.getRandomIntoFish(fish.height, 0.14))
               + "px,",
            "0)",
          ].join("")
        }}>
        <path
          d={"M" + points.join("L ") + "Z"}
          fill={fish.finColor}
        />
      </g>
    )
  }

  renderBubble = fish => (
    <circle
      key={`fish__bubble--${this.state.iteration}`}
      className="fish__bubble"
      cx={this.getRandomIntoFish(fish.width, 0)}
      cy={this.getRandomIntoFish(fish.height, 0.5)}
      r={getFishDimWithinRange(0.1, 0.4)}
    />
  )

  getClassName() {
    return classNames("Day26")
  }

  render() {
    let { height, width, fish, numFish } = this.state

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <rect
            className="Day26__background"
            height={height}
            width={width}
            fill={_.sample(waterColors)}
          />
          <g className="fishes" style={{
            transform: `translate3d(${width / 2}px, ${height / 2}px, 0)`
          }} s>
            {_.map(fish, (fish, i) => {
              return (
                <g
                  className="fish"
                  key={i} style={{
                    transform: `translate3d(-${FISH_DIMENSION / 2}px, -${FISH_DIMENSION / 2}px, 0)`,
                  }}>
                  {fish}
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    )
  }
}

export default Day26
