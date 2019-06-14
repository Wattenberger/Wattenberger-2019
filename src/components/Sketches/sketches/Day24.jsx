import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day24.scss')

const SVG_HEIGHT = 400
const HOUSE_DIMENSION = 200
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
  "#554971",
  "#63768d",
  "#8ac6d0",
  "#b8f3ff",
  "#1693A5",
  "#FBB829",
  "#ADD8C7",
  "#CDD7B6",
  "#FF9999",
  "#CCCCCC",
  "#7F94B0",
  "#E7807B",
  "#C5E0DC",
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
const getRadiusFromChord = (height, width) => (height * height + width * width) / (2 * height)

class Day24 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: Math.max(400, window.innerWidth * 0.4),
      width: window.innerWidth,
      svg: null,
      houses: [],
      numHouses: 0,
      r: 0,
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const height = Math.max(400, width * 0.4)
    const h = height * 0.25
    const w = width * 0.5
    const r = getRadiusFromChord(h, w)
    const numHouses = Math.floor(2 * Math.PI * r / TOTAL_HOUSE_DIMENSION)
    this.setState({ svg, height, width, r, numHouses })

    const houses = _.times(numHouses, d => this.getHouse())
    this.setState({ houses })
  }

  getHouse = () => {
    const mainColor = _.sample(houseColors)
    const roofColor = _.sample(roofColors)
    const width = getHouseDimWithinRange(0.6)
    const stories = _.random(1, 2)
    const additionWidth = !_.random(0, 4) ? _.random(HOUSE_DIMENSION * 0.2, width * 0.8, true) : 0
    const additionStories = additionWidth ? _.random(1, stories) : stories
    const additionXOffset = _.random(-(width - additionWidth) / 2, (width - additionWidth) / 2)
    const chimneyWidth = !_.random(0, 6) ? _.random(HOUSE_DIMENSION * 0.05, width * 0.2, true) : 0
    const shutterColor = _.sample(houseColors)
    const shutterWidth = ORIFICE_WIDTH * _.random(0.1, 0.33, true)

    return (
      <g>
        {chimneyWidth && this.getChimney(
          chimneyWidth,
          stories,
          (HOUSE_DIMENSION - width) / 2 + width * _.random(0, 0.9, true)
        )}
        {this.getStructure(width, stories, roofColor, mainColor)}
        {_.times(additionStories + 1, story => {
          const numOrifices = story == additionStories ? (!_.random(0, 3) ? 1 : 0) : Math.floor(width / TOTAL_ORIFICE_WIDTH)
          const doorIndex = !story ? _.random(0, numOrifices - 1) : -1
          const orificeXStart = TOTAL_HOUSE_DIMENSION / 2 - (numOrifices * TOTAL_ORIFICE_WIDTH + ORIFICE_BUFFER) / 2
          const numShrubs = !story && _.random(0, 2)
          const shrubColor = _.sample(shrubColors)

          return (
            <g key={story}>
              {_.times(numOrifices, i => (
                <g className={story == additionStories ? "house__orifice--attic" : ""} key={i}>
                  <g style={{
                      transform: [
                        "translate3d(",
                        [
                          orificeXStart + i * TOTAL_ORIFICE_WIDTH + (story == additionStories ? ORIFICE_WIDTH : 0),
                          HOUSE_DIMENSION - (STORY_HEIGHT * (story + 1)) + (story == additionStories ? ORIFICE_WIDTH : 0),
                          0
                        ].join("px, "),
                        ")"
                      ].join("")
                    }}
                  >
                    {this.getOrifice(i == doorIndex && "door", shutterColor, shutterWidth)}
                  </g>
                </g>
            ))}
            {numShrubs && _.times(numShrubs, i => (
                this.getShrub(
                  TOTAL_ORIFICE_WIDTH * ((i ? _.random(1.3, 1.6) : -_.random(0, 0.3)) + doorIndex),
                  shrubColor
                )
            ))}
            </g>
          )
        })}
        {!!additionWidth && this.getStructure(
          additionWidth,
          additionStories,
          roofColor,
          d3.color(mainColor).brighter(_.random(0.3, 1.2)),
          additionXOffset
        )}
        {additionWidth && _.times(additionStories, story => {
          const isDoor = !story && !_.random(0, 1)

          return (
            <g style={{
              transform: [
                "translate3d(",
                [
                  (HOUSE_DIMENSION - additionWidth) / 2 + additionXOffset + ((additionWidth - ORIFICE_WIDTH) / 2),
                  HOUSE_DIMENSION - (STORY_HEIGHT * (story + 1)),
                  0
                ].join("px, "),
                ")"
              ].join("")
            }}>
              {this.getOrifice(isDoor && "door", shutterColor, shutterWidth)}
            </g>
          )
        })}
      </g>
    )
  }

  getChimney = (chimneyWidth, stories, x) => {
    const height = STORY_HEIGHT * (stories + _.random(0.6, 1.1))
    const CHIMNEY_TOP_OVERHANG = 0.04

    return (
      <g>
        <rect
          className="house__chimney__top"
          height={HOUSE_DIMENSION * 0.05}
          width={chimneyWidth * (1 + CHIMNEY_TOP_OVERHANG * 2)}
          x={x - chimneyWidth * CHIMNEY_TOP_OVERHANG}
          y={HOUSE_DIMENSION - height - HOUSE_DIMENSION * 0.043}
          fill="grey"
        />
        <rect
          className="house__chimney"
          height={height}
          width={chimneyWidth}
          x={x}
          y={HOUSE_DIMENSION - height}
          fill="black"
        />
      </g>
    )
  }

  getStructure = (width, stories, roofColor, mainColor, xOffset=0) => (
    <g>
      <rect
        height={stories * STORY_HEIGHT + 1}
        width={width}
        x={(HOUSE_DIMENSION - width) / 2 + xOffset}
        y={HOUSE_DIMENSION - (STORY_HEIGHT * stories) - 1}
        fill={mainColor}
      />
      {this.getRoof(width, stories, roofColor, mainColor, xOffset)}
    </g>
  )

  getRoof = (width, stories, roofColor, mainColor, xOffset=0) => {
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
        className="house__roof"
        d={"M " + paths.join("L ")}
        stroke={roofColor}
        fill={isRotated ? roofColor : mainColor}
      />
    )
  }

  getOrifice = (type, shutterColor, shutterWidth) => {
    type = type || _.random(0, 5) && _.sample(orificeTypes)
    if (!type) return null
    const range = type == "door" ? [0.7, 0.9] : [0.3, 0.6]
    const height = STORY_HEIGHT * _.random(range[0], range[1], true)
    const width = ORIFICE_WIDTH * _.random(0.7, 1, true)

    return (
      <g>
        <rect
          className={`house__orifice house__orifice--${type}`}
          height={height}
          width={width}
          x={(ORIFICE_WIDTH - width) / 2}
          y={type == "door" ? STORY_HEIGHT - height : (STORY_HEIGHT - height) / 2}
          fill={type == "door" ? _.sample(roofColors) : "white"}
        />
        {type == "window" && _.times(2, i => (
          <rect
            key={i}
            width={shutterWidth}
            height={height}
            x={(ORIFICE_WIDTH - width) / 2 + (i ? -shutterWidth / 2 : width - shutterWidth / 2)}
            y={(STORY_HEIGHT - height) / 2}
            fill={shutterColor}
          />
        ))}
      </g>
    )
  }

  getShrub = (x, color) => {
    const height = getHouseDimWithinRange(0.01, 0.12)
    return (
      <ellipse
        rx={getHouseDimWithinRange(0.01, 0.12)}
        ry={height}
        cx={x}
        cy={STORY_HEIGHT * 3 - height}
        fill={color}
      />
    )
  }

  renderWorld = () => {
    const { height, width, r } = this.state
    const h = height * 0.25
    const w = width * 0.5

    return (
      <circle
        className="world"
        cx={w}
        cy={height - h + r}
        r={r}
      />
    )
  }

  getClassName() {
    return classNames("Day24")
  }

  render() {
    let { height, width, r, houses, numHouses } = this.state

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <rect
            className="Day24__background"
            height={height}
            width={width}
          />
          <g style={{
            transform: `translate3d(0, -${height * 0.1}px, 0)`
          }}>
            <g className="rotater" style={{
              transformOrigin: `center center`,
              animationDuration: `${numHouses}s`,
            }}>
              {this.renderWorld()}
              <g className="houses">
                {_.map(houses, (house, i) => {
                  return (
                    <g
                      className="house"
                      key={i} style={{
                        transform: `translate3d(${(width) / 2}px, ${height * 0.25 + STORY_HEIGHT / 4}px, 0)`,
                      }}>
                      <g style={{
                          transform: [
                            `rotate(${_.round(360 / numHouses * i, 3)}deg)`,
                          ].join(" "),
                          transformOrigin: `center ${r + TOTAL_HOUSE_DIMENSION}px`,
                        }}>
                        {house}
                      </g>
                    </g>
                  )
                })}
              </g>
            </g>
          </g>
        </svg>
      </div>
    )
  }
}

export default Day24
