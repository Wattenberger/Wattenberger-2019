import React, {Component, PureComponent} from "react"
import * as THREE from "three"
// import Stats from "stats-js"
import OrbitControlsGenerator from "three-orbit-controls"
import TWEEN from "@tweenjs/tween.js"
import * as d3 from "d3"
import { interpolateRdYlGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

// import data from "./WDVP Datasets - the future of government"
import rawData from "./Wdvp_gov_score.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
import metricsInfo from "./metric-info.json"
// import data from "./WDVP Datasets - small countries are beautiful"

import './WDVPBars.scss'
const OrbitControls = OrbitControlsGenerator(THREE)

// console.log(rawData)

let continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const continentColors = _.fromPairs(_.map(continents, continent => [
  continent.code,
  continent.color,
]))
const blackAndWhiteColorScale = d3.scaleSequential(interpolateRdYlGn)
continents = _.map(continents, (continent, i) => ({...continent, color: d3.interpolatePlasma(i /( continents.length - 1))}))
const percentileOrRawOptions = [{
  value: true,
  label: "Percentile",
},{
  value: false,
  label: "Value",
}]
const colorModeOptions = [{
  value: "normal",
  label: "Red ⇄ Green",
},{
  value: "continents",
  label: "Continents",
}]
const defaultMetrics = _.map(metricRankedCorrelationData, "fieldname")
const filteredMetrics = _.sortBy(
  _.without(_.map(metricRankedCorrelationData, "fieldname"), "Area in km²"),
  _.toLower,
)
const metricCorrelationSorts = _.fromPairs(
  _.map(metricRankedCorrelationData, metric => [
    metric.fieldname,
    metric.RankedCorrelationWithOtherFields,
  ])
)
const formatNumber = d3.format(",")
class WDVPBars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      metrics: defaultMetrics,
      metricsOrder: _.fromPairs(_.map(defaultMetrics, (metric, index) => [
        metric,
        index,
      ])),
      countryOrder: _.fromPairs(_.map(rawData, (country, index) => [
        country.Country,
        index,
      ])),
      scales: {},
      sort: defaultMetrics[3],
      processedData: [],
      selectedContinents: [],
      hoveredCountry: null,
      isAscending: true,
      colorMode: "normal",
      isShowingPercentile: true,
    }
  }

  getClassName() {
    return classNames("WDVPBars", "WDVP__full-width", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }
  chart = React.createRef()

  createScales = () => {
    const { sort, selectedContinents, isAscending } = this.state

    const sortedMetrics = _.map(metricCorrelationSorts[sort], index => defaultMetrics[index - 1])
    // const metricIndices = _.zipObject(defaultMetrics, metricCorrelationSorts[sort])
    // console.log(metricCorrelationSorts, defaultMetrics)
    // const sortedMetrics = _.orderBy(
    //   defaultMetrics,
    //   metric => {console.log(metric, metricIndices[metric]); return metricIndices[metric]},
    //   "asc",
    // )

    const selectedContinentValues = _.map(selectedContinents, "code")

    const sortedData = _.orderBy(
      rawData,
      [d => d[`${sort}__percentile`]],
      [isAscending ? "asc" : "desc"]
    )
    const metricsOrder = _.fromPairs(_.map(sortedMetrics, (metric, index) => [
      metric,
      index,
    ]))
    const countryOrder = _.fromPairs(_.map(sortedData, (country, index) => [
      country.Country,
      index,
    ]))

    const filteredData = _.isEmpty(selectedContinents) ? sortedData :
      _.filter(sortedData, d => _.includes(selectedContinentValues, d.Continent))

    const scales = _.fromPairs(
      _.map(defaultMetrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(sortedData, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ scales, processedData: filteredData, metrics: sortedMetrics, countryOrder, metricsOrder })
  }

  onChangeSort = metric => () => metric == this.state.sort ?
    this.setState({ isAscending: !this.state.isAscending }, this.createScales) :
    this.setState({ sort: metric, isAscending: this.state.isShowingPercentile ? true : false }, this.createScales)

  onContinentsSelect = continents => this.setState({ selectedContinents: continents }, this.createScales)
  onColorModeOptionsSelect = newVal => this.setState({ colorMode: newVal.value })
  // onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value, isAscending: !this.state.isAscending }, this.createScales)
  onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value }, this.createScales)
  onCountryHover = country => this.setState({ hoveredCountry: country })

  onChangeHoveredCountry = country => this.setState({ hoveredCountry: country })

  render() {
    const { processedData, metrics, metricsOrder, countryOrder, selectedContinents, scales, sort, hoveredCountry, colorMode, isAscending, isShowingPercentile } = this.state

    return (
      <div className={this.getClassName()}>

        <div className="WDVPBars__chart">
          <WDVPBarsChart
            data={processedData}
            metrics={metrics}
            sort={sort}
            scales={scales}
            colorMode={colorMode}
            metricsOrder={metricsOrder}
            countryOrder={countryOrder}
            visibleContinents={selectedContinents}
            visibleContinents={selectedContinents}
            isShowingPercentile={isShowingPercentile}
            onChangeHoveredCountry={this.onChangeHoveredCountry}
          />
        </div>

        <div className="WDVPBars__controls">
          <div className="WDVPBars__toggles">
            <RadioGroup
              className="WDVPBars__toggle"
              options={percentileOrRawOptions}
              value={isShowingPercentile}
              onChange={this.onIsShowingPercentileSelect}
            />

            <RadioGroup
              className="WDVPBars__toggle"
              options={colorModeOptions}
              value={colorMode}
              onChange={this.onColorModeOptionsSelect}
            />
          </div>

          <div className="WDVPBars__metrics">
            {_.map(filteredMetrics, metric => !!metricsInfo[metric] && (
              <div style={{ order: metricsOrder[metric] }} className={`WDVPBars__metrics__item WDVPBars__metrics__item--is-${metric == sort ? "selected" : "not-selected"}`} key={metric} onClick={this.onChangeSort(metric)}>
                <div className="WDVPBars__metrics__item__label">
                  <span className="WDVPBars__metrics__item__index">
                    { metricsOrder[metric] + 1 }.
                  </span>
                  { metric }
                </div>
                {sort == metric && (
                  <div className="WDVPBars__metrics__item__details">
                    <div>{ metricsInfo[metric].notes }</div>
                    <div>Source: { metricsInfo[metric].source }, { metricsInfo[metric].year }</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {!!hoveredCountry && !!hoveredCountry.country && (
          <div className="WDVPBars__tooltip">
              <h6 className="WDVPBars__tooltip__title">
                { hoveredCountry.country.Country }
              </h6>
              <div className="WDVPBars__tooltip__metric">
                { hoveredCountry.metric }: <b>{ formatNumber(hoveredCountry.country[hoveredCountry.metric]) }</b>
              </div>
          </div>
        )}

      </div>
    )
  }
}

export default WDVPBars


const barDimension = 10
const xBarGap = 0
const zBarGap = 12
const xBarTotalDimension = barDimension + xBarGap
const zBarTotalDimension = barDimension + zBarGap
const xAxisLength = rawData.length * xBarTotalDimension
const zAxisLength = defaultMetrics.length * zBarTotalDimension
const yScale = createScale({
  domain: [0, 1],
  range: [0, 200],
})
const yPercentileScale = createScale({
  domain: [0, 1],
  range: [0, 60],
})
const metricIndexScale = createScale({
  domain: [0, defaultMetrics.length - 1],
  range: [-defaultMetrics.length / 2 * zBarTotalDimension, defaultMetrics.length / 2 * zBarTotalDimension],
})
class WDVPBarsChart extends PureComponent {
  state = {
    width: window.innerWidth - 300,
    height: window.innerWidth * 0.6,
    margins: {
      top: 150,
      right: 0,
      bottom: 50,
      left: 160,
    }
  }
  container = React.createRef()
  xLabel = React.createRef()
  zLabel = React.createRef()
  mouse = {x: -9999, y: -9999}
  hoveredCountryObject = []
  isInView = true

  componentDidMount() {
    this._isMounted = true
    this.initScene()
    this.containerBounds = this.container.current.getBoundingClientRect()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data != this.props.data) this.drawData()
    if (prevProps.isShowingPercentile != this.props.isShowingPercentile) this.drawData()
    if (prevProps.Continent != this.props.Continent) this.drawData()
    if (prevProps.colorMode != this.props.colorMode) this.drawData()
  }
  componentWillUnmount() {
    this._isMounted = false
    document.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onResize)
    if (this.observer) this.observer.disconnect()
  }
  countryIndexScale = createScale({
    domain: [0, rawData.length - 1],
    range: [-rawData.length / 2  * xBarTotalDimension, rawData.length / 2  * xBarTotalDimension]
  })

  onMouseMove = e => {
    // e.preventDefault();
    // const containerBounds = this.container.current.getBoundingClientRect()
    this.mouse.x = (e.offsetX / this.containerBounds.width) * 2 - 1;
    this.mouse.y = -(e.offsetY / this.containerBounds.height) * 2 + 1;
    this.updateIntersects()
  }

  onResize = () => {
    this.containerBounds = this.container.current.getBoundingClientRect()
    const width = this.containerBounds.width
    const height = width * 0.7
    this.setState({
      width,
      height,
    })
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderScene()
  }

  initScene = () => {
    if (!this.container.current) return
    const { width, height } = this.state

    if (this.scene) return

    this.camera = new THREE.PerspectiveCamera(53, width / height, 1, 10000)
    this.camera.position.set(
      xAxisLength * 0.27,
      660,
      zAxisLength * -1.2,
    );

    this.scene = new THREE.Scene()
    // this.scene.background = new THREE.Color(0xf4f4f4)
    // this.scene.background = new THREE.Color(0x1d1d27)
    this.scene.background = new THREE.Color(0x282A38)
    // this.scene.fog = new THREE.FogExp2( 0x686B89, 0.0005 );

    var light1 = new THREE.DirectionalLight( 0x686B89, 0.3 );
    light1.position.set( 1, 100, 1 );
    this.scene.add( light1 );
    var light2 = new THREE.DirectionalLight( 0xFE2E24, 1 );
    light2.position.set( 0, 200, 0 );
    var light3 = new THREE.AmbientLight( 0xf4f4f4, 0.9 );
    this.scene.add( light3 );
    var light4 = new THREE.DirectionalLight( 0x30336b, 1.8 );
    light4.position.set( 0, 100, zAxisLength );
    this.scene.add( light4 );


    this.raycaster = new THREE.Raycaster()
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.container.current.appendChild(this.renderer.domElement)

    // this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), 45)
    this.camera.updateMatrixWorld();

    // this.stats = new Stats()
    // this.container.current.appendChild( this.stats.dom )
    this.controls = new OrbitControls( this.camera, this.renderer.domElement )
    this.controls.enableZoom = false

    this.camera.lookAt(
      xAxisLength * 0.15,
      0,
      zAxisLength * -0.2,
    );

    window.addEventListener('resize', this.onResize)
    document.addEventListener('mousemove', this.onMouseMove, false)
    this.controls.addEventListener("change", this.renderScene);

    const options = {
      threshold: 0.01,
    }

    this.observer = new IntersectionObserver(this.debouncedOnVisibilityChange, options);
    this.observer.observe(this.container.current);

    this.drawAxes()
    this.initBars()
    this.renderScene()
    // this.animate()
  }

  onVisibilityChange = e => {
      if (!this._isMounted) return
      const bounds = e[0].boundingClientRect
      const threshold = window.innerHeight * 2
      const isInView = !!e[0].isIntersecting ||
                        Math.abs(bounds.top)    < threshold ||
                        Math.abs(bounds.bottom) < threshold
      if (isInView != this.isInView) {
        this.isInView = isInView
        if (isInView && TWEEN.getAll().length) this.animate()
      }
  }
  debouncedOnVisibilityChange = _.debounce(this.onVisibilityChange, 60);

  drawAxes = () => {
    const material = new THREE.MeshBasicMaterial ({
      color: 0x666666
    });

    var xGeometry = new THREE.BufferGeometry();
    const xVertices = new Float32Array([
      -xAxisLength / 2, 0, -zAxisLength / 2 - barDimension * 4,
      xAxisLength / 2, 0, -zAxisLength / 2 - barDimension * 4,
    ]);
    xGeometry.setAttribute( 'position', new THREE.BufferAttribute( xVertices, 3 ) );
    const xAxis = new THREE.Line( xGeometry, material );
    this.scene.add( xAxis );

    var zGeometry = new THREE.BufferGeometry();
    const zVertices = new Float32Array([
      xAxisLength / 2 + barDimension * 4, 0, -zAxisLength / 2,
      xAxisLength / 2 + barDimension * 4, 0, zAxisLength / 2,
    ]);
    zGeometry.setAttribute( 'position', new THREE.BufferAttribute( zVertices, 3 ) );
    const zAxis = new THREE.Line( zGeometry, material );
    this.scene.add( zAxis );
  }


  animate = (time) => {
    if (!this.isInView) return
    TWEEN.update(time);
    this.renderScene();
    // this.updateAxisLabelsPosition();
    // this.stats.update();

    const tweens = TWEEN.getAll()
    if (tweens.length) requestAnimationFrame( this.animate );

    // this.updateIntersects()
  }

  updateIntersects = () => {
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects = this.raycaster.intersectObjects( this.scene.children );
    const closestIntersect = intersects[0];
    const intersectName = closestIntersect && closestIntersect.object.name
    if (intersectName != this.hoveredCountry) {
      const { colorMode, scales, isShowingPercentile, onChangeHoveredCountry } = this.props

      if (!closestIntersect) {
        this.props.onChangeHoveredCountry(null)
        this.hoveredCountry = null
        this.hoveredCountryObject = null
        if (this.onFinishedHoveringCountry) this.onFinishedHoveringCountry()
        return
      }

      closestIntersect.object.material.color.setStyle("#ffffff")

      if (this.onFinishedHoveringCountry) this.onFinishedHoveringCountry()
      this.onFinishedHoveringCountry = () => {
        const barData = closestIntersect.object.userData
        const color = !_.isFinite(barData.country && barData.country[barData.metric])  ? "#ccc" :
          colorMode == "continents" ? continentColors[barData.country.Continent] :
                                    blackAndWhiteColorScale(isShowingPercentile ? (barData.country[`${barData.metric}__percentile`] - 1) / 100 : scales[barData.metric](barData.country[barData.metric]))
        closestIntersect.object.material.color.setStyle(color)
        this.onFinishedHoveringCountry = null
        this.renderScene()
      }

      this.hoveredCountry = intersectName
      this.props.onChangeHoveredCountry(closestIntersect.object.userData)

      this.renderScene()
    }
  }

  updateAxisLabelsPosition = () => {
    const xVector =  this.get2DCoords(new THREE.Vector3( 0, 0, -zAxisLength / 2 - barDimension * 4), this.camera)
    const x2Vector = this.get2DCoords(new THREE.Vector3(10, 0, -zAxisLength / 2 - barDimension * 4), this.camera)
    const zVector =  this.get2DCoords(new THREE.Vector3(xAxisLength / 2 + barDimension * 4 + 50, 0,   0), this.camera)
    const z2Vector = this.get2DCoords(new THREE.Vector3(xAxisLength / 2 + barDimension * 4 + 50, 0, -10), this.camera)
    const xRotation = Math.atan2(xVector.y - x2Vector.y, xVector.x - x2Vector.x) / Math.PI * 180
    const zRotation = Math.atan2(zVector.y - z2Vector.y, zVector.x - z2Vector.x) / Math.PI * 180
    if (this.xLabel.current) this.xLabel.current.style.transform = `translate(${xVector.x}px, ${xVector.y}px) rotate(${xRotation}deg)`
    if (this.zLabel.current) this.zLabel.current.style.transform = `translate(${zVector.x}px, ${zVector.y}px) rotate(${zRotation}deg)`
  }

  get2DCoords = (position, camera) => {
    const vector = position.project(camera);
    vector.x = (vector.x + 1)/2 * this.state.width;
    vector.y = -(vector.y - 1)/2 * this.state.height;
    return vector;
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
    this.updateAxisLabelsPosition();
    // this.controls.update()
  }

  createBar = (countryIndex, metricIndex, country, metric) => {
    const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 )
    geometry.translate( 0, 0, 0 )
    let object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({color: continentColors[country.Continent]})
    )

    object.position.x = this.countryIndexScale(countryIndex)
    object.position.y = 0
    object.position.z = metricIndexScale(metricIndex)
    object.scale.x = barDimension
    object.scale.y = 1
    object.scale.z = barDimension
    object.name = `${country.Country}--${metric}`
    object.userData = {
      country,
      metric,
    }

    this.scene.add(object)

    return object
  }

  initBars = () => {
    const { data, metrics } = this.props

    if (_.isEmpty(data)) return;

    this.countries = _.map(data, (country, countryIndex) => ({
      country,
      countryIndex,
      metrics: _.map(metrics, (metric, metricIndex) => ({
        name: metric,
        metricIndex,
        percentileValue: (country[`${metric}__percentile`] - 1) / 100,
        bar: this.createBar(countryIndex, metricIndex, country, metric),
      }))
    }))

    this.drawData()
  }

  drawData = () => {
    const { data } = this.props

    if (_.isEmpty(data)) return;

    if (!this.camera) this.initScene()

    // const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 )
    if (!this.countries) this.initBars()

    _.map(this.countries, country => {
      _.map(country.metrics, metric => {
        this.drawBar({ country, metric, bar: metric.bar })
      })
    })

    // this.renderScene()
    this.animate()
  }

  drawBar = ({ country, metric, bar }) => {
    const { metricsOrder, countryOrder, scales, sort, colorMode, isShowingPercentile, onCountryHover, onMetricClick } = this.props

    if (!bar) return
    // const scaledValue = scales[metric.name](country.country[metric.name])

    const value = isShowingPercentile ?
      yPercentileScale(metric.percentileValue) + 1 :
      yScale(scales[metric.name](country.country[metric.name]))

    metric.xTweenCoords = bar.position
    metric.xTween = new TWEEN.Tween(metric.xTweenCoords)
        .to({ x: this.countryIndexScale(countryOrder[country.country.Country]) }, 1200)
        // .easing(TWEEN.Easing.Quadratic.Out)
        .delay(200)
        .onUpdate(function() {
            bar.position.x = metric.xTweenCoords.x
        })

    metric.zTweenCoords = bar.position
    metric.zTween = new TWEEN.Tween(metric.zTweenCoords)
        .to({ z: metricIndexScale(metricsOrder[metric.name]) }, 1200)
        // .easing(TWEEN.Easing.Quadratic.Out)
        .delay(200)
        .onUpdate(function() {
            bar.position.z = metric.zTweenCoords.z
        })
        .chain(metric.xTween)
        .start()


    metric.yTweenCoords = bar.position
    metric.yTween = new TWEEN.Tween(metric.yTweenCoords)
        .to({ y: value }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function() {
            bar.scale.y = metric.yTweenCoords.y
            bar.position.y = metric.yTweenCoords.y / 2
        })
        .start()

    const color = !_.isFinite(country.country[metric.name])  ? "#ccc" :
      colorMode == "continents" ? continentColors[country.country.Continent] :
                                  blackAndWhiteColorScale(isShowingPercentile ? metric.percentileValue : scales[metric.name](country.country[metric.name]))
    bar.material.color.setStyle(color)
  }

  changeZoom = (diff) => () => {
    const newZoom = Math.min(Math.max(this.camera.zoom + diff, 0.2), 6.5)

    let zoomTweenAmount = { zoom: this.camera.zoom }
    this.zoomTween = new TWEEN.Tween(zoomTweenAmount)
        .to({ zoom: newZoom }, 300)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.camera.zoom = zoomTweenAmount.zoom
          this.camera.updateProjectionMatrix()
        })
        .start()

    this.animate()
  }

  render () {
    return (
      <div className="WDVPBarsChart" ref={this.container}>
        <div className="WDVPBarsChart__zooms">
          <div className="WDVPBarsChart__zoom WDVPBarsChart__zoom--up" onClick={this.changeZoom(0.3)}>
            +
          </div>
          <div className="WDVPBarsChart__zoom WDVPBarsChart__zoom--down" onClick={this.changeZoom(-0.3)}>
            −
          </div>
        </div>

        <div className="WDVPBarsChart__label" ref={this.xLabel}>Countries</div>
        <div className="WDVPBarsChart__label" ref={this.zLabel}>Metrics</div>
        {/* <g
          ref={this.container}
          style={{
            transform: `translate(${margins.left}px, ${margins.top}px)`,
          }}
        /> */}
      </div>
    )
  }
}

