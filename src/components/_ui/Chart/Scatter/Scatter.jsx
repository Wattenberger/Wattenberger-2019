import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

require('./Scatter.scss')
const orientations = {
  x: "bottom",
  y: "left"
}

class Scatter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dots: null
    }
  }

  static propTypes = {
    data: PropTypes.array,
    radius: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.func,
    ]),
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
    dataKey: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    easing: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    radius: 8,
    initTransition: 1300,
    transition: 300,
    easing: d3.easeLinear,
    onUpdate: _.noop,
  };
  elem = React.createRef()

  update = () => {
    let {data, radius, xAccessor, yAccessor, dataKey, initTransition, transition, easing, onUpdate} = this.props
    let {dots} = this.state

    let init = !dots
    dots = d3.select(this.elem.current).selectAll(".dot")
      .data((data || []), dataKey)

    const newDots = dots.enter().append("circle")
      .attr("class", "dot")

    dots = newDots.merge(dots)

    if (init) {
      dots.attr("r", 0)
          .attr("cx", xAccessor)
          .attr("cy", yAccessor)
    }

    dots.transition().duration(init ? initTransition : transition).ease(easing)
        .attr("r", radius)
        .attr("cx", xAccessor)
        .attr("cy", yAccessor)

    dots.exit().remove()

    dots.on("mouseenter", d => console.log(d))

    this.setState({dots})
    onUpdate(dots)
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    if (
      // this.props.data != prevProps.data ||
      // this.props.xAccessor != prevProps.xAccessor ||
      // this.props.yAccessor != prevProps.yAccessor ||
      this.props.iterator != prevProps.iterator
    ) this.update()
  }

  getClassName() {
    return classNames(
      "Scatter",
      this.props.className
    )
  }

  render() {
    return (
      <g ref={this.elem} className={this.getClassName()} />
    )
  }
}

export default Scatter
