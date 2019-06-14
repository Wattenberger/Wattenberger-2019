import React, {Component} from "react"
import classNames from "classnames"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Filter from "components/_ui/Chart/Filter/Filter"

require('./Day2.scss')

let interval
const INTERVAL_LENGTH = 90
const CHART_HEIGHT = 400
const MAX_MOVEMENT = 1
const MAX_RADIUS = 20
let dots = []
_.times(430, i => {
  const speed = _.random(0.2, 3, true)
  const dir = _.random(2 * Math.PI, true)

  let dot = {
    x: _.random(window.innerWidth),
    y: _.random(CHART_HEIGHT),
    speed: speed,
    dir: dir,
    dx: speed * Math.cos(dir),
    dy: speed * -Math.sin(dir),
    // rx: Math.cos(_.random(0.1)),
    // ry: Math.sin(_.random(0.1)),
    r: _.random(2, MAX_RADIUS),
  }
  dots.push(dot)
})

class Day2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: CHART_HEIGHT,
      width: window.innerWidth,
      chart: {},
      dots: dots,
      iterator: 0,
    }
  }

  getClassName() {
    return classNames("Day2")
  }

  componentDidMount() {
    this.setState({chart: this.chart})
    interval = window.setInterval(this.moveDots, INTERVAL_LENGTH)
  }

  componentWillUnmount() {
    window.clearInterval(interval)
  }

  filters = [
    {
      type: "feTurbulence",
      attrs: {
        type:"turbulence",
        baseFrequency:"0.05",
        numOctaves:"2",
        result:"turbulence",
      },
    },{
      type: "feDisplacementMap",
      attrs: {
        in2: "turbulence",
        in: "SourceGraphic",
        scale: "10",
        xChannelSelector: "R",
        yChannelSelector: "G",
      },
    }
  ];

  movement(pos, bound, padding = 0) {
    let sign = pos >= bound - padding ? -1 :
               pos <= padding         ?  1 :
               _.random()             ?  1 : -1

    return _.random(MAX_MOVEMENT, true) * sign
  }

  movementFromDir = (dot) => {
    let {height, width} = this.state
    dot = _.clone(dot)
    const padding = 0

    dot.dir += 0.03
    dot.dx = dot.speed * Math.cos(dot.dir)
    dot.dy = dot.speed * -Math.tan(dot.dir)
    // dot.dx = dot.dx * dot.rx - dot.dy * dot.ry
    // dot.dy = dot.dy * dot.rx + dot.dx * dot.ry

    if (dot.x + dot.dx >= width - padding) dot.dx = -dot.dx
    if (dot.x + dot.dx <= padding) dot.dx = -dot.dx
    dot.x = dot.x + dot.dx

    if (dot.y + dot.dy >= height - padding) dot.dy = -dot.dy
    if (dot.y + dot.dy <= padding) dot.dy = -dot.dy
    dot.y = dot.y + dot.dy

    return dot
  }

  moveDots = () => {
    let {dots, height, width, iterator} = this.state
    const pctChangeChangeDir = 0.01

    dots = dots.map(this.movementFromDir)
    this.setState({dots, iterator: iterator + 1})
  }
  //
  // getWidth() {
  //   return window.innerWidth
  // }

  render() {
    let {chart, dots, height, width, iterator} = this.state

    return (
      <div className={this.getClassName()}>
        <Chart
          height={height}
          width={width}
          ref={Chart => this.chart = Chart}
        >
          <Filter
            id="goo"
            filters={this.filters}
          />
          <Scatter
            chart={chart}
            data={dots}
            xAccessor={d => d.x}
            yAccessor={d => d.y}
            radius={d => d.r}
            transition={INTERVAL_LENGTH}
            iterator={iterator}
            // easing={d3.linear}
          />
        </Chart>
      </div>
    )
  }
}

export default Day2
