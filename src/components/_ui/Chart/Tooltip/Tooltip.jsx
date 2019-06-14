import React, {Component} from "react"
import {findDOMNode} from "react-dom"
import PropTypes from "prop-types"
import classNames from "classnames"
import {mouse, select} from "d3"

require('./Tooltip.scss')
const orientations = {
  x: "bottom",
  y: "left"
}
const typeMap = {
  scatter: ".dot",
  map: ".Map__path",
  line: ".Line__path",
  chart: ".Chart__svg",
}

class Tooltip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hovered: null,
      showing: false
    }
  }

  static propTypes = {
    type: PropTypes.oneOf(["scatter", "map", "line", "chart"]),
    elem: PropTypes.object,
    renderElem: PropTypes.func,
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
  };

  static defaultProps = {
  };
  elem = React.createRef()

  getStyle() {
    let {xAccessor, yAccessor} = this.props
    let {hoveredPoint, showing} = this.state
    if (!hoveredPoint) return {opacity: 0}

    return {
      left: `${hoveredPoint[0]}px`,
      top: `${hoveredPoint[1]}px`,
      opacity: showing ? 1 : 0
    }
  }

  update() {
    let {type, elem} = this.props
    if (!elem || !elem.current) return
    this._onMouseover = ::this.onMouseover
    this._onMouseout = ::this.onMouseout
    this._listener = select(elem.current).selectAll(typeMap[type])
    this._listener.on("mouseover", this._onMouseover)
    this._listener.on("mouseout", this._onMouseout)
  }

  onMouseover(d) {
    let {type, elem} = this.props
    let p = d
    if (!p) {
      const domElem = elem.current
      p = mouse(domElem)
    }
    this.setState({hoveredPoint: p})
    this.setState({showing: true})
  }

  onMouseout(d, e) {
    this.setState({showing: false})
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(newProps) {
    this.update()
  }

  componentWillUnmount() {
    this._listener.on("mouseover", null)
    this._listener.on("mouseout", null)
  }

  getClassName() {
    let {id} = this.props

    let domElem = select(this.elem.current)._groups[0][0] || {}
    let offset = domElem.offsetTop
    let height = domElem.offsetHeight
    let scroll = window.scrollY

    return classNames(
      "Tooltip", {
        "Tooltip--flipY": offset - height < scroll,
      },
      this.props.className
    )
  }

  render() {
    let {hoveredPoint} = this.state

    return (
      <div ref={this.elem} className={this.getClassName()} style={this.getStyle()}>
        {hoveredPoint && this.props.renderElem(hoveredPoint)}
      </div>
    )
  }
}

export default Tooltip
