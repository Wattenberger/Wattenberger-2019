import React, { Component } from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import * as d3 from 'd3'

import Gradient from 'components/_ui/Chart/Gradient/Gradient'
const colors = [
  '#487c60',
  '#295b50',
  '#447061',
  '#769b8e',
  '#3a6362',
  '#5f8970',
  '#13547a',
  '#99c99c',
  '#537895',
  '#50c9c3',
  '#16a085',
  '#ff5858',
  '#874da2',
  '#bdc2e8',
  '#9bc5c3',
  '#304352'
]
const maxWidth = 0.4
const maxHeight = 0.6

require('./Day29.scss')

const SVG_HEIGHT = 400
const INTERVAL = 2 * 1000

class Day29 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height   : Math.max(400, window.innerWidth * 0.8),
      width    : window.innerWidth,
      svg      : null,
      interval : null,
      turtle   : null
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    const width = elem.offsetWidth
    const height = Math.max(400, width * 0.54)
    this.setState({ svg, height, width })

    const interval = window.setInterval(this.makeTurtles, INTERVAL)
    this.setState({ interval })
  }

  componentWillUnmount() {
    const { interval } = this.state
    if (interval) window.clearInterval(interval)
  }

  makeTurtles = () => {
    const turtle = this.renderTurtle()
    this.setState({ turtle })
  }

  renderTurtle = () => {
    const { height, width } = this.state
    const shellColor = _.sample(colors)
    const skinColor = _.sample(_.omit(colors, shellColor))
    const turtleHeight = _.random(0.3, maxHeight, true) * height
    const shellHeightRatio = _.random(0.6, 0.9, true)
    const turtleWidth = _.random(0.3, maxWidth, true) * width
    const yToGround = _.random(0.5, 0.6, true) * turtleHeight
    const minLegAngle = Math.atan2(turtleHeight * (shellHeightRatio - 0.5), turtleWidth / 2)

    return (
      <g
        className="Day29__turtle"
        key="turt"
        style={{
          transform : `translate3d(${(width - turtleWidth) / 2}px, ${height * 0.7 - turtleHeight}px, 0)`
        }}>
        {_.times(2, (index) => (
          <TurtleLeg
            key={index}
            center={[ turtleWidth / 2, turtleHeight / 2 ]}
            yToGround={yToGround}
            color={skinColor}
            minAngle={minLegAngle}
            isFront={index % 2}
          />
        ))}
        <TurtleShell
          key="shell-inner"
          height={turtleHeight}
          width={turtleWidth}
          heightRatio={shellHeightRatio}
          color={shellColor}
          isInner={true}
        />
        {_.times(2, (index) => (
          <TurtleLeg
            key={index}
            center={[ turtleWidth / 2, turtleHeight / 2 ]}
            yToGround={yToGround}
            color={skinColor}
            minAngle={minLegAngle}
            isFront={index % 2}
            isRight
          />
        ))}
        <TurtleTail
          width={turtleWidth * _.random(0.13, 0.3, true)}
          height={turtleHeight * _.random(0.03, 0.12, true)}
          color={skinColor}
          style={{
            transform : `translate3d(
              ${turtleWidth * _.random(0.1, 0.16, true)}px,
              ${turtleHeight * (shellHeightRatio * _.random(0.85, 0.95, true))}px,
              0) rotate(${_.random(-27, 0, true)}deg)`
          }}
        />
        <TurtleShell
          key="shell-outer"
          height={turtleHeight}
          width={turtleWidth}
          heightRatio={shellHeightRatio}
          color={shellColor}
        />
        <TurtleHead
          width={turtleWidth * _.random(0.3, 0.4, true)}
          height={turtleHeight * _.random(0.2, 0.3, true)}
          color={skinColor}
          style={{
            transform : `translate3d(
              ${turtleWidth * _.random(0.88, 0.96, true)}px,
              ${turtleHeight * (shellHeightRatio * _.random(0.8, 0.95, true))}px,
              0) rotate(${_.random(-40, 10, true)}deg)`
          }}
        />
      </g>
    )
  }

  getClassName() {
    return classNames('Day29')
  }

  render() {
    let { height, width, turtle } = this.state

    return (
      <div className={this.getClassName()} ref="elem">
        <svg height={height + 50} width={width} ref={(svg) => (this.svg = svg)}>
          <Gradient
            id="TurtleGradient"
            stops={[
              {
                color : _.sample(colors)
              },
              {
                color  : _.sample(colors),
                offset : '100%'
              }
            ]}
            height={height}
            width={0}
          />
          {turtle}
        </svg>
      </div>
    )
  }
}

export default Day29

const TurtleShell = ({ height, width, heightRatio, isInner, color, ...props }) => {
  // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
  // Q x1 y1, x y (or q dx1 dy1, dx dy)

  const midY = height * heightRatio
  const parsedY = height * (isInner ? _.random(1, 1.1, true) : 1)
  const parsedColor = isInner ? d3.hsl(color).darker(_.random(0.5, 1.4, true)) : 'url(#TurtleGradient)'
  const path = [
    'M',
    [ 0, midY ].join(' '),
    'Q',
    [ width / 2, 0 ].join(' '),
    [ width, midY ].join(' '),
    'Q',
    [ width / 2, parsedY ].join(' '),
    [ 0, midY ].join(' ')
  ].join(' ')

  return <path {...props} className="TurtleShell" d={path} fill={parsedColor} />
}
const TurtleTail = ({ height, width, color, ...props }) => {
  // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
  // Q x1 y1, x y (or q dx1 dy1, dx dy)
  const parsedColor = d3.hsl(color).brighter(_.random(0.7, 1.4, true))

  const path = [ 'M', [ 0, 0 ].join(' '), 'L', [ 0, height ].join(' '), 'L', [ -width, height ].join(' ') ].join(' ')

  return (
    <g {...props}>
      <path className="TurtleTail" d={path} fill={parsedColor} />
    </g>
  )
}

const TurtleHead = ({ height, width, color, ...props }) => {
  // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
  // Q x1 y1, x y (or q dx1 dy1, dx dy)
  const parsedColor = d3.hsl(color).brighter(_.random(0.1, 1, true))
  const eyelidColor = d3.hsl(parsedColor).darker(_.random(0, 0.3, true))
  const eyeColor = d3.hsl(eyelidColor).darker(_.random(1.3, 3.4, true))
  const startingHeight = height * _.random(0.3, 0.5, true)

  const path = [
    'M',
    [ 0, startingHeight ].join(' '),
    'Q',
    [ width, height ].join(' '),
    [ width, 0 ].join(' '),
    'T',
    [ 0, 0 ].join(' '),
    'Q',
    [ -10, 0 ].join(' '),
    [ 0, startingHeight ].join(' ')
  ].join(' ')

  const eyeCenter = [ width * _.random(0.5, 0.8, true), -height * _.random(0.2, 0.4, true) ]
  const eyeWidth = height * _.random(0.2, 0.3, true)
  const eyeHeight = height * _.random(0.2, 0.33, true)

  return (
    <g {...props}>
      <path className="TurtleHead" d={path} fill={parsedColor} />
      <ellipse
        className="TurtleHead__eye"
        cx={eyeCenter[0]}
        cy={eyeCenter[1] * 0.9}
        rx={eyeWidth}
        ry={eyeHeight}
        fill={eyeColor}
      />
      <ellipse
        className="TurtleHead__eyelid"
        cx={eyeCenter[0]}
        cy={eyeCenter[1] * 1.1}
        rx={eyeWidth}
        ry={eyeHeight}
        fill={eyelidColor}
      />
    </g>
  )
}

const TurtleLeg = ({ center, yToGround, isFront, minAngle, color, isRight }) => {
  const parsedColor = d3.hsl(color).brighter(isRight ? _.random(0.5, 1.4, true) : 0)
  const width = _.random(0.2, 0.4, true) * center[0]
  // const angle = _.random(Math.PI * 1.1 + minAngle, Math.PI * 1.5, true)
  const midFootPoint = [
    isFront ? center[0] * 2 - center[0] * _.random(0.1, 0.5) : center[0] * _.random(0.1, 0.5),
    center[1] + yToGround * (isRight ? 1 : _.random(0.9, 1, true))
  ]

  const path = [
    'M',
    center.join(' '),
    'L',
    [ midFootPoint[0] - width / 2, midFootPoint[1] ].join(' '),
    'L',
    [ midFootPoint[0] + width / 2, midFootPoint[1] ].join(' '),
    'Z'
  ].join(' ')

  return <path className="TurtleLeg" d={path} fill={parsedColor} stroke={parsedColor} />
}
