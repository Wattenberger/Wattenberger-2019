import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from "lodash"

const colors = [
  // "#A70267","#F10C49","#FB6B41","#F6D86B","#339194"
  // "#4B3E4D","#1E8C93","#DBD8A2","#f4f4f4","#D74F33"
  "#006266", "#5758BB", "#6F1E51", "#F79F1F", "#1289A7", "#eaeaea", "#D980FA",
]
const sizeDimensions = {
  small: 50,
  medium: 100,
  large: 200,
}
class Logo extends PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(_.keys(sizeDimensions)),
  }
  static defaultProps = {
    size: "medium",
  }
  state = {
    triangleColors: [0, 0, 0],
    lastHoveredTriangleIndex: null,
  }

  onHoverTriangle = i => e => {
    const { triangleColors } = this.state
    const newTriangleColors = _.map(triangleColors, (colorIndex, j) =>
      j == i
        ? (colorIndex + 1) % (colors.length)
        : colorIndex
    )
    this.setState({
      triangleColors: newTriangleColors,
      lastHoveredTriangleIndex: i,
    })
  }
  
  onMouseOutTriangle = i => () => {
    const { hoveredTriangles } = this.state
    this.setState({ hoveredTriangles: _.without(hoveredTriangles, i) })
  }

  render() {
    const { size, style } = this.props
    const { triangleColors, lastHoveredTriangleIndex } = this.state

    const width = sizeDimensions[size]
    const height = width * 0.8

    const trianglePoints = [
    [
      [width * 0.5, 0].join(" "),
      [width * (5/6), height * (2/3)].join(" "),
      [width * (1/6), height * (2/3)].join(" "),
    ],[
      [0, height * (1/3)].join(" "),
      [width * (4/6), height * (1/3)].join(" "),
      [width * (2/6), height].join(" "),
    ],[
      [width * (2/6), height * (1/3)].join(" "),
      [width, height * (1/3)].join(" "),
      [width * (4/6), height].join(" "),
    ]
  ]

    return (
      <div style={{...style, display: "flex"}} >
        <svg height={height} width={width}>
          {trianglePoints.map((points, i) => (
            <path
              key={i}
              d={`M${points.join("L")}`}
              fill={colors[triangleColors[i]]}
              fill-opacity="0.5"
              style={{
                mixBlendMode: "multiply",
                // pointerEvents: lastHoveredTriangleIndex == i ? "none" : "all",
              }}
              onMouseEnter={this.onHoverTriangle(i)}
              // onMouseOut={this.onMouseOutTriangle(i)}
            />
          ))}
        </svg>
      </div>
    )
  }
}

export default Logo
