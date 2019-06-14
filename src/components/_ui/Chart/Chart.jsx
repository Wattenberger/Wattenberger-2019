import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import * as d3 from "d3"

require('./Chart.scss')

export const getHeight = (height, margin={top: 0, bottom: 0}) => Math.max(height - margin.top - margin.bottom, 0)
export const getWidth = (width, margin={left: 0, right: 0}) => Math.max(width - margin.left - margin.right, 0)

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.height,
      width: this.props.width,
      isLoaded: false,
    }
  }

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    hasNoListener: PropTypes.bool,
    onMouseMove: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseEnter: PropTypes.func,
  };

  static defaultProps = {
    height: 200,
    width: 600,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    onMouseMove: _.noop,
    onMouseEnter: _.noop,
    onMouseEnter: _.noop,
};

  getClassName() {
    return classNames("Chart", this.props.className)
  }

  getWrapperStyle() {
    let {margin} = this.props
    let translate = `translate3d(${margin.left}px, ${margin.top}px, 0)`
    return {
      transform: translate,
      WebkitTransform: translate
    }
  }

  setSize = () => {
    if (!this._isMounted) return
    let {height, width, margin} = this.props
    this.setState({height: getHeight(height, margin)})
    this.setState({width: getWidth(width, margin)})
  }

  componentWillMount() {
    this.setSize()
  }

  componentDidMount() {
    this._isMounted = true
    this._setSize = this.setSize
    window.addEventListener("resize", this._setSize)
    setTimeout(() => {
      this.setState({isLoaded: true})
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener("resize", this._setSize)
  }

  renderClipPath() {
    let {height, width} = this.state
    let {margin} = this.props

    return <clipPath id="chartPath-clip">
      <rect className="Chart__clip-path"
        x={margin.left}
        y={margin.top}
        height={height}
        width={width}
      />
    </clipPath>
  }


  render() {
    const {height, width, margin, hasNoListener, children, line, area, bar, xAxis, yAxis, brush, hasTooltip, onMouseMove, onMouseEnter, onMouseLeave} = this.props

    return (
      <div ref="elem" className={this.getClassName()}>
        <svg className="Chart__svg" height={height} width={width}>
          <defs>
            {this.renderClipPath()}
          </defs>
          <g className="Chart__wrapper" style={this.getWrapperStyle()}>
            {children}
          </g>
          {!hasNoListener && (
            <rect
              className="Chart__listener"
              x={margin.left}
              y={margin.top}
              height={getHeight(height, margin)}
              width={getWidth(width, margin)}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onMouseEnter={onMouseEnter}
            />
          )}
        </svg>
      </div>
    )
  }
}

export default Chart
