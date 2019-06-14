import React, {Component} from "react"
import classNames from "classnames"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Filter from "components/_ui/Chart/Filter/Filter"

require('./Day1.scss')

let interval
const INTERVAL_LENGTH = 90
const CHART_HEIGHT = 400
const MAX_MOVEMENT = 10
const MAX_RADIUS = 60
let dots = []
_.times(160, i => {
  const speed = _.random(2, 10, true)
  const dir = _.random(2 * Math.PI, true)

  let dot = {
    x: window.innerWidth / 2,
    y: CHART_HEIGHT / 2,
    speed: speed,
    dir: dir,
    dx: speed * Math.cos(dir),
    dy: speed * Math.sin(dir),
    rx: Math.cos(.03),
    ry: Math.sin(.03),
    r: _.random(2, MAX_RADIUS),
  }
  dots.push(dot)
})

class Day1 extends Component {
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
    return classNames("Day1")
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
      type: "feGaussianBlur",
      attrs: {
        in: "SourceGraphic",
        stdDeviation: 10,
        result: "blur",
      }
    },{
      type: "feColorMatrix",
      attrs: {
        in: "blur",
        mode: "matrix",
        values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
        result: "goo",
      }
    },{
      type: "feBlend",
      attrs: {
        in: "SourceGraphic",
        in2: "goo",
        operator: "atop",
      }
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

    // dot.dir += 0.03
    // dot.dx = dot.speed * Math.cos(dot.dir)
    // dot.dy = dot.speed * Math.sin(dot.dir)
    dot.dx = dot.dx * dot.rx - dot.dy * dot.ry
    dot.dy = dot.dy * dot.rx + dot.dx * dot.ry

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
            iterator={iterator}
            transition={INTERVAL_LENGTH}
            // easing={d3.linear}
          />
        </Chart>
      </div>
    )
  }
}

export default Day1
