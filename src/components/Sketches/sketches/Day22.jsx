import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Day22.scss')

const SVG_HEIGHT = 400
const Y_OFFSET = 7
const X_OFFSET = 40
const whale = <g>
    <path fill="white" d="M35.074,79.383c-13.096-1.317-17.648-4.031-22.794-12.675l-0.672-1.266"/>
    <path fill="skyblue" d="M32.656,61.833c0,0-2.906,3.563-8.625,3.875c-2.719,0.219-7,0.125-9.125,0s-6.375-0.875-7.125-3  c-0.75-2.125,3.625-3.625,3.625-7.125s1.289-13.5,8.769-16.625s18.731-2.5,23.481,0s17.375,14.625,21.125,15.25s6.125-0.875,8.375-6  s5-7.75,10.5-9.125s7.5-6,7.5-6s4.125,8.375-3.25,13.875s-2.25,9.917-9.125,18.75c-3.278,3.304-13.125,15.5-34,14.375  c-0.92-0.05-1.809-0.1-2.67-0.153"/>
    <path fill="skyblue" d="M28.4,64.738c0,0,1.173,5.137,7.089,5.47c0,0-5.25,11.417,6.583,14.083c0,0-0.917-6.75,2.667-11.167c0,0,2.25-2.333,1.75-5.417"/>
    <path fill="white" d="M20.239,65.838c0,0,2.853,7.365,14.097,10.118"/>
    <path d="M42.901,76.48c0,0,14.255-0.395,23.755-5.583s13.302-9.933,16.735-17.061"/>
    <path d="M45.913,71.342c0,0,11.993,1.033,20.826-4.217s16.327-12.741,17.664-16.287"/>
    <circle cx="25.989" cy="58.042" r="0.833"/>
    <ellipse cx="31.656" cy="39.625" rx="1.125" ry="0.208"/>
    <path fill="skyblue" d="M70.689,52.326c0,0,0.466-2.306-2.784-3.993s-7.771-5.562-4.76-12.5c0,0,3.073,4.625,8.948,4.062s5.979,1.635,5.979,1.635"/>
    <g className="spout">
      <path stroke="white" d="M24.718,29.177  c0-1.916,1.553-3.469,3.469-3.469s3.469,1.553,3.469,3.469v5.031"/>
      <path stroke="white" d="M26.552,22.925  c0-1.409,1.143-2.552,2.552-2.552c1.409,0,2.552,1.143,2.552,2.552v5.173"/>
      <path stroke="white" d="M38.593,29.177  c0-1.916-1.553-3.469-3.469-3.469s-3.469,1.553-3.469,3.469v5.031"/>
      <path stroke="white" d="M36.76,22.558  c0-1.409-1.143-2.552-2.552-2.552c-1.409,0-2.552,1.143-2.552,2.552v5.173"/>
      <line stroke="white" x1="31.656" y1="15.708" x2="31.656" y2="17.646"/>
      <line stroke="white" x1="20.718" y1="28.771" x2="20.718" y2="30.552"/>
      <line stroke="white" x1="22.843" y1="23.021" x2="22.843" y2="24.802"/>
      <line stroke="white" x1="40.468" y1="23.021" x2="40.468" y2="24.802"/>
      <line stroke="white" x1="42.656" y1="28.771" x2="42.656" y2="30.552"/>
    </g>
  </g>

class Day22 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: SVG_HEIGHT,
      width: window.innerWidth,
      svg: null,
      lines: [],
    }
  }

  componentDidMount() {
    let svg = this.svg
    const { elem } = this.refs
    this.setState({ svg })
    const width = elem.offsetWidth
    this.setState({ width })

    const lines = this.getLines()
    this.setState({ lines })
  }

  getLines = () => {
    const numLines = Math.floor(SVG_HEIGHT / Y_OFFSET) - 1
    let lines = _.times(numLines, i => this.getLine((i + 1) * Y_OFFSET))
    const maxOffsetFromCenter = Math.floor(numLines * 0.1)
    let whalePath = _.get(lines, Math.floor(numLines / 2) + _.random(-maxOffsetFromCenter, maxOffsetFromCenter))
    whalePath.id = "whalePath"
    return lines
  }

  getLine = yOffset => {
    const { width } = this.state
    const dataPoints = _.reverse(_.times(Math.floor(width / X_OFFSET) - 1, i => (i + 0.5) * X_OFFSET))
    const path = d3.line()
                   .x(d => d)
                   .y((d, i) => yOffset + Y_OFFSET * (i % 2 ? -1 : 1))
                   .curve(d3.curveBasis)

    return {
      path: path(dataPoints),
      dashArray: this.getRandomDashArray(),
      animationDuration: _.random(30, 60, true),
      animationDirection: _.random(0, 1) ? "reverse, normal" : "normal, reverse",
    }
  }

  getRandomDashArray = () => (
    _.times(_.random(3, 6), d => [_.random(6, 230, true), 8].join(", ")).join(", ")
  )

  getClassName() {
    return classNames("Day22")
  }

  render() {
    let { height, width, lines } = this.state
    const stops = [
      {
        color: "#45aeb1",
      },
      {
        color: "#c6d7c7",
        offset: "100%",
      },
    ]
    // _.times(20, i => ({
    //   color: _.random(0, 1) ? "#45aeb1" : "#5db9a4",
    //   offset: i * (100 / 20) + "%"
    // }))

    return (
      <div className={this.getClassName()} ref="elem">
        <svg
          height={height}
          width={width}
          ref={svg => this.svg = svg}
        >
          <defs>
            <Gradient
              id="gradient"
              stops={stops}
              height={height}
              width={width}
            />
          </defs>
          <rect
            className="Day22__background"
            height={height}
            width={width}
          />
          {_.map(lines, (line, i) => (
            <path
              key={i}
              d={line.path}
              className="Day22__line Day22__line--background"
            />
          ))}

          {_.map(lines, (line, i) => (
            <g>
              {line.id == "whalePath" && (
                <g className="Day22__whale">
                  {whale}
                  <animateMotion dur="12s" repeatCount="indefinite">
                    <mpath xlinkHref="#whalePath" />
                  </animateMotion>
                </g>
              )}
              <path
                key={i}
                id={line.id}
                d={line.path}
                className="Day22__line"
                style={{
                  strokeDasharray: line.dashArray,
                  animationDuration: line.animationDuration + "s",
                  // animationDirection: line.animationDirection,
                }}
              />
            </g>
          ))}
        </svg>
      </div>
    )
  }
}

export default Day22
