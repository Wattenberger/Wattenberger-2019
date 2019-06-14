import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Axis from "./../Axis/Axis"
import * as d3 from "d3"
import * as topojson from "./topojson"
import Gradient from "components/_ui/Chart/Gradient/Gradient"

require('./Map.scss')

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      map: null,
      states: null,
    }
  }

  static propTypes = {
    mapJson: PropTypes.object,
    chart: PropTypes.object,
    data: PropTypes.array,
    colorAccessor: PropTypes.func,
    initTransition: PropTypes.number,
    transition: PropTypes.number,
    legend: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      colors: PropTypes.array,
    }),
  };

  static defaultProps = {
    colorAccessor: _.noop,
    initTransition: 1000,
    transition: 300,
  };

  update(props) {
    let {mapJson, chart, data, colorAccessor, initTransition, transition, legend} = props
    let {map, states} = this.state
    let {elem} = this.refs
    if (!chart) return

    let init = !map
    let path = d3.geoPath()
    map = d3.select(elem).selectAll("path")
      .data(topojson.feature(mapJson, mapJson.objects.counties).features)
    map.enter().append("path")
      .attr("class", "Map__path")
      .attr("d", path)
    if (init) map.attr("fill", "#fff")

    map.transition().duration(init ? initTransition : transition)
       .attr("fill", colorAccessor)

   if (!states) {
     states = d3.select(elem).append("path")
                .datum(topojson.mesh(mapJson, mapJson.objects.states, function(a, b) { return a !== b; }))
                .attr("class", "Map__states")
                .attr("d", path);
     this.setState({states})
   }

    this.setState({map})
  }

  componentDidMount() {
    this.update(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps)
  }

  getClassName() {
    let {id} = this.props
    return classNames(
      "Map",
      this.props.className
    )
  }

  getLegendConfig() {
    let {legend, chart} = this.props
    let defaultConfig = {
      x: chart.state ? chart.state.width - 200 : 0,
      y: 0,
      width: 200,
      height: 20,
      colors: legend.colors || []
    }
    return Object.assign({}, defaultConfig, legend)
  }

  renderLegend() {
    let {chart} = this.props
    let config = this.getLegendConfig()

    if (!chart) return

    if (chart._createScales) {
      chart._createScales([{
        id: "legend",
        domain: chart && chart.state && chart.state.scales && chart.state.scales.color && chart.state.scales.color.domain(),
        range: [0, config.width],
      }]);
    }

    return <g ref="legend" className="Map__legend">
      <rect
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        fill="url(#legendGradient)"
      />
      <Gradient
        id="legendGradient"
        x={[config.x, config.x]}
        y={[config.y, config.y + config.height]}
        stops={config.colors.map((color, i) => ({
          offset: `${100 / (config.colors.length - 1) * i}%`,
          color: color,
        }))}
      />
      <g style={{transform: `translate3d(-${config.width}px, ${config.y + config.height}px, 0)`}}>
        <Axis
          className="Axis__legend"
          ref="legend-axis"
          chart={chart}
          scale="legend"
          orientation="bottom"
          tickSizeInner={-5}
          tickSizeOuter={-8}
        />
      </g>
    </g>
  }

  render() {
    let {legend} = this.props

    return (
      <g className={this.getClassName()}>
        <g ref="elem" className="Map__paths" />
        {!!legend && this.renderLegend()}
      </g>
    )
  }
}

export default Map
