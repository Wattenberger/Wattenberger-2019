import React, {Component} from "react"
import * as d3 from "d3"
import * as topojson from "topojson-client"
import classNames from "classnames"
import _ from "lodash"

import worldData from "./world.json"

const land = topojson.feature(worldData, worldData.objects.land)
const countries = topojson.feature(worldData, worldData.objects.countries)

const water = {type: 'Sphere'}
const graticule = d3.geoGraticule10()

import './WDVPGlobe.scss'

const scaleFactor = 0.9
const angles = { x: -20, y: 40, z: 0}
const degPerPx = 1
const colorWater = '#fff'
const colorLand = '#111'
const colorGraticule = '#ccc'
const colorCountry = '#a00'


class WDVPGlobe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: Math.min(window.innerWidth * 0.6, window.innerHeight * 0.7),
      width: Math.min(window.innerWidth * 0.6, window.innerHeight * 0.7),
    }
  }
  container = React.createRef()

  getClassName() {
    return classNames("WDVPGlobe", this.props.className)
  }

  componentDidMount() {
    this.initGlobe()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
  }

  onResize = () => {
    const width = Math.min(
      window.innerWidth * 0.6,
      window.innerHeight * 0.7
    )
    const height = width

    this.setState({width, height}, () => {
      this.drawGlobe()
      this.scale()
    })
  }

  projection = d3.geoOrthographic().precision(0.1)

  setAngles = () => {
    let rotation = this.projection.rotate()
    rotation[0] = angles.y
    rotation[1] = angles.x
    rotation[2] = angles.z
    this.projection.rotate(rotation)
  }

  scale = () => {
    const { width, height } = this.state
    console.log( width, height)

    // const bounds  = this.path.bounds(this.projection)
    // console.log(bounds)
    // const hScale  = 150 * width  / (bounds[1][0] - bounds[0][0])
    // const vScale  = 150 * height / (bounds[1][1] - bounds[0][1])
    // const scale   = (hScale < vScale) ? hScale : vScale;
    // const offset  = [width - (bounds[0][0] + bounds[1][0])/2,
    //                   height - (bounds[0][1] + bounds[1][1])/2];

    // this.projection
    //   .scale(scale).translate(offset)

    this.projection
      .fitExtent([[0, 0], [width * 0.2, height * 0.2]], countries)
      // .scale((scaleFactor * Math.min(width, height)) / 2)
      // .translate([width, height])
    this.path = this.path.projection(this.projection)
  }

  fill = (obj, color) => {
    this.context.beginPath()
    this.path(obj)
    this.context.fillStyle = color
    this.context.fill()
  }

  stroke = (obj, color) => {
    this.context.beginPath()
    this.path(obj)
    this.context.strokeStyle = color
    this.context.stroke()
  }

  rotate = yPosition => {
    const rotation = this.projection.rotate()
    rotation[0] += yPosition * degPerPx
    this.projection.rotate(rotation)
    this.drawGlobe()
  }
  onScroll = e => {
    this.rotate(window.scrollY)
  }

  initGlobe = () => {
    this.context = this.container.current.getContext('2d')
    this.context.imageSmoothingEnabled = false
    this.path = d3.geoPath(this.projection).context(this.context)
    this.setAngles()
    this.scale()
    this.drawGlobe()
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
  }

  drawGlobe = () => {
    if (_.isEmpty(this.context)) this.context = this.container.current.getContext('2d')
    const { width, height } = this.state
    this.context.clearRect(0, 0, width, height)
    this.fill(water, colorWater)
    this.stroke(graticule, colorGraticule)
    this.fill(land, colorLand)
  }

  render() {
    const { height, width } = this.state

    return (
      <canvas
        className={this.getClassName()}
        ref={this.container}
        style={{
          height: height + "px",
          width: width + "px",
        }}
      />
    )
  }
}

export default WDVPGlobe
