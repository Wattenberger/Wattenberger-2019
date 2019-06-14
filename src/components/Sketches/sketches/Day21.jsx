import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"

require('./Day21.scss')

const coordinatesToPath = points => [
  "M",
  _.map(points, point => `${point.x} ${point.y}`).join(" L "),
  // " Z"
].join("")
const getAngle = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
const getPointFromAngleAndDistance = (coordinates, angle, distance) => ({
  x: Math.round(Math.cos(angle * Math.PI / 180) * distance + coordinates.x),
  y: Math.round(Math.sin(angle * Math.PI / 180) * distance + coordinates.y),
})

const TRIANGLE_WIDTH = 72
const TRIANGLE_HEIGHT = 366
const BOARD_HEIGHT = 930
const BOARD_WIDTH = TRIANGLE_WIDTH * 6

const getTriangleHubs = () => [
  ..._.times(6, (i) => ({
    team: i % 2 ? "a" : "b",
    x: (i + 0.5) * TRIANGLE_WIDTH,
    y: TRIANGLE_HEIGHT * 0.8,
  })),
  ..._.times(6, (i) => ({
    team: i % 2 ? "b" : "a",
    x: (i + 0.5) * TRIANGLE_WIDTH,
    y: BOARD_HEIGHT - TRIANGLE_HEIGHT * 0.8,
  }))
]
const triangleHubs = getTriangleHubs()

class Day21 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: BOARD_HEIGHT,
      width: BOARD_WIDTH,
      svg: null,
      neurons: null,
    }
  }

  componentDidMount() {
    let svg = this.svg
    this.setState({ svg })
    this.createTriangles()
  }

  getClassName() {
    return classNames("Day21")
  }

  createTriangles = () => [
    ..._.times(6, (i) => ({
      team: i % 2 ? "a" : "b",
      x: i * TRIANGLE_WIDTH,
      y: 0,
      flipped: false,
    })),
    ..._.times(6, (i) => ({
      team: i % 2 ? "b" : "a",
      x: i * TRIANGLE_WIDTH,
      y: BOARD_HEIGHT - TRIANGLE_HEIGHT,
      flipped: true,
    }))
  ]

  createNeurons = () => _.times(6, i => ({
    ...this.createNeuron(i >= 3 ? "a" : "b"),
  }))

  createNeuron = team => {
    const buffer = TRIANGLE_WIDTH * 0.5
    const coordinates = {
      x: _.random(buffer, BOARD_WIDTH - buffer, true),
      y: _.random(TRIANGLE_HEIGHT, BOARD_HEIGHT - TRIANGLE_HEIGHT, true),
    }
    const teamTriangleHubs = _.filter(triangleHubs, {team})
    const offshoots = this.createOffshoots(coordinates, teamTriangleHubs)
    return {
      team,
      ...coordinates,
      offshoots
    }
  }

  createOffshoots = (coordinates, teamTriangleHubs) => {
    var offshoots = _.times(_.random(2, 3), () => (
      this.createOffshoot(coordinates, _.sample(teamTriangleHubs))
    ))
    offshoots = [...offshoots, ..._.filter(_.map(_.flatMap(offshoots), "offshoot"))]
    return offshoots
  }

  createOffshoot = (coordinates, target) => {
    let points = [{ x: coordinates.x, y: coordinates.y }]
    const isGoingUp = target.y < coordinates.y
    const hasPassedTarget = y => isGoingUp ? y < target.y : y > target.y
    let lastAngle
    let iterations = 0
    const maxMovement = TRIANGLE_WIDTH * 0.1
    const maxAngleChange = 60
    const chanceOfOffshoot = 0.02

    do {
      const targetAngle = getAngle(_.last(points), target)
      const angleDiff = _.random(-maxAngleChange * 0.6, maxAngleChange, true)
      const angle = (lastAngle || targetAngle) + angleDiff * (targetAngle < lastAngle ? -1 : 1)
      const newPoint = getPointFromAngleAndDistance(
        _.last(points),
        angle,
        _.random(maxMovement * 0.1, maxMovement, true)
      )
      points.push(newPoint)
      iterations++
      lastAngle = angle

      const hasOffshoot = _.random(0, 1, true) < chanceOfOffshoot
      if (hasOffshoot) {
        _.last(points).offshoot = this.createOffshoot(_.last(points), target)
      }
    } while (iterations < 100 && !hasPassedTarget(_.last(points).y))

    return points
  }

  render() {
    let { height, width } = this.state
    const triangles = this.createTriangles()
    const neurons = this.createNeurons()

    return (
      <div className={this.getClassName()}>
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <rect
            className="Day21__background"
            height={height}
            width={width}
          />
          {triangles.map((triangle, i) => (
            <Triangle
              key={i}
              {...triangle}
            />
          ))}
          {neurons.map((neuron, i) => (
            <Neuron
              key={i}
              {...neuron}
            />
          ))}
        </svg>
      </div>
    )
  }
}

export default Day21

const Triangle = props => {
  const points = [
    {x: props.x,                      y: props.y + TRIANGLE_HEIGHT * (props.flipped ? 1 : 0)},
    {x: props.x + TRIANGLE_WIDTH,     y: props.y + TRIANGLE_HEIGHT * (props.flipped ? 1 : 0)},
    {x: props.x + TRIANGLE_WIDTH / 2, y: props.y + TRIANGLE_HEIGHT * (props.flipped ? 0 : 1)},
  ]
  return (
    <path
      className={`Day21__triangle Day21--team-${props.team}`}
      d={coordinatesToPath(points)}
    />
  )
}

const Neuron = props => {
  return (
    <g className={`Day21__neuron Day21--team-${props.team}`}>
      <circle
        cx={props.x}
        cy={props.y}
        r={TRIANGLE_WIDTH * 0.14}
      />
      {_.map(props.offshoots, (offshoot, i) => (
        <path
          key={i}
          d={coordinatesToPath(offshoot)}
        />
      ))}
    </g>
  )
}