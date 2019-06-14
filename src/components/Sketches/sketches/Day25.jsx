import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day25.scss')

const SVG_HEIGHT = 400
const HOUSE_DIMENSION = window.innerWidth * 0.26
const HOUSE_BUFFER = 40
const ORIFICE_WIDTH = HOUSE_DIMENSION * 0.2
const ORIFICE_BUFFER = HOUSE_DIMENSION * 0.05
const TOTAL_ORIFICE_WIDTH = ORIFICE_WIDTH + ORIFICE_BUFFER
const TOTAL_HOUSE_DIMENSION = HOUSE_DIMENSION + HOUSE_BUFFER
const STORY_HEIGHT = HOUSE_DIMENSION / 3
const orificeTypes = ["window"]
const houseColors = [
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
const roofColors = [
  "#264653",
  "#36213e",
  "#323035",
  "#170535",
  "#556270",
  "#630947",
  "#3B3B3B",
  "#4F4E57",
  "#3C3D36",
  "#3B8686",
]
const shrubColors = [
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

const getHouseDimWithinRange = (min=0, max=1) => HOUSE_DIMENSION * _.random(min, max, true)
const getTriangle = (w, h) => (
  "M" + [
    [w / 2, 0].join(" "),
    [w    , h].join(" "),
    [0    , h].join(" "),
  ].join("L ") + "Z"
)

class Day25 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: Math.max(400, window.innerWidth * 0.8),
      width: window.innerWidth,
      svg: null,
      interval: null,
      iteration: 0,
      houses: [],
      numHouses: 0,
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const height = Math.max(400, width * 0.54)
    const numHouses = 1
    this.setState({ svg, height, width, numHouses })

    this.createHouse()
    const interval = window.setInterval(this.createHouse, 4000)
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    if (interval) window.clearInterval(interval)
  }

  createHouse = () => {
    const { numHouses, iteration } = this.state
    const houses = _.times(numHouses, d => this.getHouse())
    const newIteration = iteration + 1
    this.setState({ houses, iteration: newIteration })
  }

  getHouse = () => {
    const mainColor = _.sample(houseColors)
    const roofColor = _.sample(roofColors)
    const width = getHouseDimWithinRange(0.6)
    const stories = !_.random(0, 2) ? 2 : 1
    const additionWidth = !_.random(0, 2) ? _.random(HOUSE_DIMENSION * 0.2, width * 0.8, true) : 0
    const additionStories = additionWidth ? _.random(1, stories) : stories
    const additionXOffset = _.random(-(width - additionWidth) / 2, (width - additionWidth) / 2)
    const chimneyWidth = !_.random(0, 3) ? _.random(HOUSE_DIMENSION * 0.05, width * 0.2, true) : 0
    const shutterColor = _.sample(_.filter(houseColors, d => d != mainColor))
    const shutterWidth = ORIFICE_WIDTH * _.random(0.1, 0.26, true)

    return (
      <g>
        {this.getTrees()}
        {chimneyWidth && this.getChimney(
          chimneyWidth,
          stories,
          (HOUSE_DIMENSION - width) / 2 + width * _.random(0, 0.9, true)
        )}
        {this.getStructure(
          width,
          stories,
          roofColor,
          mainColor,
          0,
          "main",
          shutterColor,
          shutterWidth
        )}
        {!!additionWidth && this.getStructure(
          additionWidth,
          additionStories,
          roofColor,
          d3.color(mainColor).brighter(_.random(0.3, 1.2)),
          additionXOffset,
          "addition",
          shutterColor,
          shutterWidth,
        )}
      </g>
    )
  }

  getChimney = (chimneyWidth, stories, x) => {
    const { iteration } = this.state
    const height = STORY_HEIGHT * (stories + _.random(0.6, 1.1))
    const CHIMNEY_TOP_OVERHANG = 0.04

    return (
      <g key={iteration} className="house__chimney">
        {_.times(_.random(18, 40), i => (
          <circle
            className={`house__chimney__smoke house__chimney__smoke--${i}`}
            key={i}
            cx={x + chimneyWidth / 2 + getHouseDimWithinRange(-0.02, 0.02)}
            cy={HOUSE_DIMENSION - height + getHouseDimWithinRange(-0.02, 0.02)}
            r={getHouseDimWithinRange(0.02, 0.16)}
          />
        ))}
        <rect
          className="house__chimney__top"
          height={HOUSE_DIMENSION * 0.05}
          width={chimneyWidth * (1 + CHIMNEY_TOP_OVERHANG * 2)}
          x={x - chimneyWidth * CHIMNEY_TOP_OVERHANG}
          y={HOUSE_DIMENSION - height - HOUSE_DIMENSION * 0.043}
          fill="grey"
        />
        <rect
          height={height}
          width={chimneyWidth}
          x={x}
          y={HOUSE_DIMENSION - height}
          fill="black"
        />
      </g>
    )
  }

  getStructure = (width, stories, roofColor, mainColor, xOffset=0, className, shutterColor, shutterWidth) => {
    const numOrifices = Math.floor(width / TOTAL_ORIFICE_WIDTH)
    const orificeXStart = TOTAL_HOUSE_DIMENSION / 2 - (numOrifices * TOTAL_ORIFICE_WIDTH + ORIFICE_BUFFER) / 2 + xOffset
    let orificeNumber = 0

    return (
      <g className="house__structure" key={`house__structure--${this.state.iteration}--${className}`}>
        <rect
          height={stories * STORY_HEIGHT + 1}
          width={width}
          x={(HOUSE_DIMENSION - width) / 2 + xOffset}
          y={HOUSE_DIMENSION - (STORY_HEIGHT * stories) - 1}
          fill={mainColor}
        />

        {_.times(stories, story => {
          const numShrubs = !story && _.random(0, 2)
          const shrubColor = _.sample(shrubColors)
          const doorIndex = _.random(0, numOrifices - 1)

          return <g key={story}>
            {_.times(numOrifices, i => {
              orificeNumber++

              return (
                <g className={story == stories ? "house__orifice--attic" : ""} key={i}>
                  <g style={{
                      transform: [
                        "translate3d(",
                        [
                          orificeXStart + i * TOTAL_ORIFICE_WIDTH + (story == stories ? ORIFICE_WIDTH : 0),
                          HOUSE_DIMENSION - (STORY_HEIGHT * (story + 1)) + (story == stories ? ORIFICE_WIDTH : 0),
                          0
                        ].join("px, "),
                        ")"
                      ].join("")
                    }}
                  >
                    {this.getOrifice(!story && i == doorIndex && "door", shutterColor, shutterWidth, orificeNumber)}
                  </g>
                </g>
              )
            })}

            {numShrubs && _.times(numShrubs, i => (
                this.getShrub(
                  TOTAL_ORIFICE_WIDTH * ((i ? _.random(-0.3, 0.4) : _.random(2, 2.2)) + doorIndex),
                  shrubColor,
                  i
                )
            ))}
            </g>
        })}
        {this.getRoof(width, stories, roofColor, mainColor, xOffset)}
      </g>
    )
  }

  getRoof = (width, stories, roofColor, mainColor, xOffset=0) => {
    const { iteration } = this.state

    const bottomOfRoof = HOUSE_DIMENSION - stories * STORY_HEIGHT
    const overhang = getHouseDimWithinRange(0.01, 0.07)
    let paths = [
      [(HOUSE_DIMENSION - width) / 2 - overhang + xOffset, bottomOfRoof               ].join(" "),
      [HOUSE_DIMENSION           / 2            + xOffset, bottomOfRoof - STORY_HEIGHT].join(" "),
      [(HOUSE_DIMENSION + width) / 2 + overhang + xOffset, bottomOfRoof               ].join(" "),
    ]
    const isGambrel = !xOffset && !_.random(0, 6)
    if (isGambrel) {
      paths = [
        paths[0],
        [(HOUSE_DIMENSION - width * 0.6) / 2, bottomOfRoof - STORY_HEIGHT * 0.75].join(" "),
        paths[1],
        [(HOUSE_DIMENSION + width * 0.6) / 2, bottomOfRoof - STORY_HEIGHT * 0.75].join(" "),
        paths[2],
      ]
    }
    const isRotated = !xOffset && !isGambrel && !_.random(0, 4)
    if (isRotated) {
      paths = [
        paths[0],
        [(HOUSE_DIMENSION - width * 0.9) / 2, bottomOfRoof - STORY_HEIGHT].join(" "),
        [(HOUSE_DIMENSION + width * 0.9) / 2, bottomOfRoof - STORY_HEIGHT].join(" "),
        paths[2],
      ]
    }

    return (
      <path
        key={"house__roof--" + iteration}
        className="house__roof"
        d={"M " + paths.join("L ")}
        stroke={roofColor}
        fill={isRotated ? roofColor : mainColor}
      />
    )
  }

  getOrifice = (type, shutterColor, shutterWidth, i) => {
    const { iteration } = this.state

    type = type || _.random(0, 5) && _.sample(orificeTypes)
    if (!type) return null
    const range = type == "door" ? [0.7, 0.9] : [0.3, 0.6]
    const height = STORY_HEIGHT * _.random(range[0], range[1], true)
    const width = ORIFICE_WIDTH * (type == "door" ? _.random(0.7, 0.92, true) : _.random(0.4, 0.8, true))

    return (
      <g className={`house__orifice house__orifice--${type} house__orifice--${i}`} key={`house__orifice--${iteration}`}>
        <rect
          height={height}
          width={width}
          x={(ORIFICE_WIDTH - width) / 2}
          y={type == "door" ? STORY_HEIGHT - height : (STORY_HEIGHT - height) / 2}
          fill={type == "door" ? _.sample(roofColors) : "white"}
        />
        {type == "window" && _.times(2, i => (
          <rect
            className={`house__orifice--window__shutter house__orifice--window__shutter--${i ? "right" : "left"}`}
            key={i}
            width={shutterWidth}
            height={height}
            x={(ORIFICE_WIDTH - width) / 2 + (i ? -shutterWidth : width)}
            y={(STORY_HEIGHT - height) / 2}
            fill={shutterColor}
          />
        ))}
      </g>
    )
  }

  getShrub = (x, color, i) => {
    const { iteration } = this.state
    const width = getHouseDimWithinRange(0.01, 0.12)
    const height = getHouseDimWithinRange(0.06, 0.12)
    const numBubbles = _.random(2, 10)

    return (
      <g key={`${i},${iteration}`}>
        {_.times(numBubbles, bubble => (
          <ellipse
            key={bubble}
            className={
              `house__shrub__bubble house__shrub__bubble--${bubble}`
            }
            rx={width}
            ry={height}
            cx={x + width * _.random(-0.5, 0.5, true)}
            cy={STORY_HEIGHT * 3 - height + height * _.random(-0.6, 0.1, true)}
            fill={color}
          />
        ))}
    </g>
    )
  }

  getTrees = () => {
    const { iteration } = this.state

    const numTrees = _.random(6, 25)
    const treeColor = _.sample(shrubColors)
    const isTreesCircles = !!_.random(0, 1)
    let trees = _.times(numTrees, i => this.createTree(i, treeColor))
    trees = _.sortBy(trees, ["y", "x"])

    return <g>
      {_.map(trees, (tree, i) => (
        <g
          key={`${i},${iteration}`}
          className = {`house__tree house__tree--${i}`}>
          <g style={{
              transform: `translate3d(${tree.x}px, ${tree.y}px, 0)`
          }}>
            {this.renderTree(tree, isTreesCircles, i)}
          </g>
        </g>
      ))}
    </g>
  }

  createTree = (i, color) => {
    const x = getHouseDimWithinRange(-0.5, 1.5, true)
    const y = getHouseDimWithinRange(-0.3, 0, true)
    const height = getHouseDimWithinRange(0.4, 0.7)
    const width = height * _.random(0.4, 0.55, true)
    const bushHeight = height * _.random(0.3, 0.9, true)
    const numBushes = Math.floor(height / bushHeight)

    return {
      x,
      y,
      height,
      width,
      trunkWidth: width * _.random(0.05, 0.13, true),
      trunkHeight: height * _.random(0.6, 0.9, true),
      bushHeight,
      numBushes,
      bushOffset: numBushes > 1 ? _.random(1, 1.5) : 1,
      bushColor: d3.color(color).brighter(_.random(-0.4, 0.4, true)),
    }
  }

  renderTree = (treeArgs, isCircles, i) => (
    <g key={i}>
      <rect
        x={(treeArgs.width - treeArgs.trunkWidth) / 2}
        y={HOUSE_DIMENSION - treeArgs.trunkHeight}
        width={treeArgs.trunkWidth}
        height={treeArgs.trunkHeight}
      />
      {_.times(treeArgs.numBushes, i => {
        return isCircles ? (
          <ellipse
            cx={treeArgs.width / 2}
            cy={
              HOUSE_DIMENSION - treeArgs.height +
              ((treeArgs.bushHeight * (1 - treeArgs.bushOffset / 2)) * (i + 0.5))
            }
            rx={treeArgs.width / 2}
            ry={(treeArgs.bushHeight * treeArgs.bushOffset) / 2}
            fill={treeArgs.bushColor}
          />
        ) : (
          <g style={{
            transform: `translate3d(${
              (treeArgs.width - treeArgs.width) / 2
            }px, ${
              HOUSE_DIMENSION - treeArgs.height +
              ((treeArgs.bushHeight * (1 - treeArgs.bushOffset / 2)) * i)
            }px, 0)`
          }}>
            <path
              d={getTriangle(treeArgs.width, treeArgs.bushHeight * treeArgs.bushOffset)}
              fill={treeArgs.bushColor}
            />
          </g>
        )})}
      </g>
    )

  getClassName() {
    return classNames("Day25")
  }

  render() {
    let { height, width, houses, numHouses } = this.state
    const earthHeight = height * 0.5 - HOUSE_DIMENSION * 0.2

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <rect
            className="Day25__background"
            height={height}
            width={width}
          />
          <rect
            className="Day25__earth"
            y={height - earthHeight}
            height={earthHeight}
            width={width}
          />
          <g className="houses" style={{
            transform: `translate3d(-${HOUSE_DIMENSION / 2}px, 0, 0)`
          }} s>
            {_.map(houses, (house, i) => {
              return (
                <g
                  className="house"
                  key={i} style={{
                    transform: `translate3d(${(width) / 2}px, ${height * 0.25 + STORY_HEIGHT / 4}px, 0)`,
                  }}>
                  {house}
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    )
  }
}

export default Day25
