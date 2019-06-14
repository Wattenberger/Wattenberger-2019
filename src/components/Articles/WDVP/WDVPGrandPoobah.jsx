import React, {Component, PureComponent} from "react"
import PropTypes from "prop-types"
import * as THREE from "three"
import OrbitControlsGenerator from "three-orbit-controls"
import TWEEN from "@tweenjs/tween.js"
import * as d3 from "d3"
import ReactSlider from "react-slider"
import { interpolateRdYlGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';
import Tooltip from 'components/_ui/Tooltip/Tooltip';
import Select from 'react-select';
import selectStyles from './selectStyles';

import rawData from "./Wdvp_gov_score.json"
import presets from "./Wdvp_nnmf.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
import WDVPMetrics from "./WDVPMetrics"
import WDVPScatter from './WDVPScatter'

import './WDVPGrandPoobah.scss'
const OrbitControls = OrbitControlsGenerator(THREE)

const ordinalColors = ["#63cdda", "#cf6a87", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]; // "#e77f67", "#778beb",
const numberFromValue = value =>
  _.isFinite(value) ? value :
  _.isString(value) ? +value.replace(/,/g, "") :
  null

const valueToNumber = d => _.isFinite(d) ? d : 0
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
const continentColorScales = _.fromPairs(
  _.map(continents, continent => [
    continent.code,
    createScale({
      domain: [-0.3, 0.6, 1.2],
      range: ["#fff", continent.color, "#000"],
    }),
  ])
)
const percentileOrRawOptions = [{
  value: true,
  label: "Percentile",
},{
  value: false,
  label: "Value",
}]
const colorModeOptions = [{
  value: "normal",
  label: "All the same",
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
const presetNames = [
  "Generally Good",
  "Politically Stable",
  "Large",
  "Reckless Growth",
  "Taxation Nation"
]
const presetOptions = _.map(presets, (preset, index) => ({
  value: presetNames[index],
  label: presetNames[index],
  name: presetNames[index],
  metricWeights: _.zipObject(
    _.map(defaultMetrics, m => m[0]),
    _.map(preset.factor, d => d * 4),
  ),
  color: "#114D4D",
}))
const getRandomWeight = () => _.round(d3.randomUniform(0, 3)(), 2)
const defaultMetricWeights = _.fromPairs(_.map(defaultMetrics, metric => [
  metric,
  0,
  // getRandomWeight(),
]))
class WDVPGrandPoobah extends Component {
  constructor(props) {
    super(props)
    this.state = {
      xMetricWeights: defaultMetricWeights,
      yMetricWeights: defaultMetricWeights,
      xMetric: defaultMetrics[0],
      yMetric: defaultMetrics[1],
      dataWithWeights: [],
      highlightedCountries: [],
      angleOfMostVariance: 0,
    }
  }

  getClassName() {
    return classNames("WDVPGrandPoobah", this.props.className)
  }

  componentDidMount() {
    this.generateWeightedData()
  }
  chart = React.createRef()

  onMetricWeightsChange = (axis, newWeights) => this.setState({ [`${axis}MetricWeights`]: newWeights }, this.debouncedGenerateWeightedData)
  onMetricWeightsChangeForAxisLocal = axis => newWeights => this.onMetricWeightsChange(axis, newWeights)

  randomizeMetrics = () => this.setState({
    xMetric: _.sample(defaultMetrics),
    yMetric: _.sample(defaultMetrics),
  })

  generateWeightedData = () => {
    const { xMetricWeights, yMetricWeights } = this.state

    const dataWithWeights = _.map(rawData, country => ({
        ...country,
        xValue: this.getWeightedValue(country, xMetricWeights),
        yValue: this.getWeightedValue(country, yMetricWeights),
    }))

    const hasAnyWeights = _.sum(_.values(xMetricWeights)) && _.sum(_.values(yMetricWeights))

    if (!hasAnyWeights) {
      const filledWeightMetric = _.sum(_.values(xMetricWeights)) ? "xValue" : "yValue"
      const updateDataWithWeights = _.map(dataWithWeights, country => ({
        ...country,
        ["axis of good rankings"]: country[filledWeightMetric],
      }))

      this.setState({ dataWithWeights: updateDataWithWeights, angleOfMostVariance: 0 })
      return
    }

    const xValues = _.map(dataWithWeights, "xValue")
    const yValues = _.map(dataWithWeights, "yValue")
    const xDifferences = this.getDifferences(xValues)
    const yDifferences = this.getDifferences(yValues)
    const meanOfXAndY = _.mean(_.map(xDifferences, (d,i) => d * yDifferences[i]))
    const covarianceMatrix = [
      _.mean(_.map(xDifferences, d => d * d)),
      meanOfXAndY,
      meanOfXAndY,
      _.mean(_.map(yDifferences, d => d * d)),
    ]

    const magicA = 1
    const magicB = -covarianceMatrix[3] - covarianceMatrix[0]
    const magicC = covarianceMatrix[0] * covarianceMatrix[3] - covarianceMatrix[1] * covarianceMatrix[2]

    const sqB = Math.sqrt(magicB * magicB - 4 * magicA * magicC)
    // const lambda1 = 2 * magicC / (-magicB + sqB)
    // const lambda2 = 2 * magicC / (-magicB - sqB)
    const lambda1 = (-magicB + sqB) / 2
    const lambda2 = (-magicB - sqB) / 2
    const largerLambda = Math.max(lambda1, lambda2)

    // const magicD = [
    //   covarianceMatrix[0] - largerLambda,
    //   covarianceMatrix[1],
    //   covarianceMatrix[2],
    //   covarianceMatrix[3] - largerLambda,
    // ]
    let magicR1 = [
      covarianceMatrix[0] - largerLambda,
      covarianceMatrix[2],
    ]
    let magicR2 = [
      covarianceMatrix[1],
      covarianceMatrix[3] - largerLambda,
    ]
    let magicR3 = _.map(magicR1, d =>
      d * (magicR2[0] / magicR1[0])
    )
    magicR2 = [
      magicR2[0] - magicR3[0],
      magicR2[1] - magicR3[1],
    ]
    if (_.sum(magicR2) > 0.001) {
      magicR3 = _.map(magicR3, d =>
        d * (magicR1[1] / magicR2[1])
      )
      magicR1 = [
        magicR1[0] - magicR3[0],
        magicR1[1] - magicR3[1],
      ]
    }

    const vectorOfMostVariance = [
      -magicR1[1] / magicR1[0],
      1,
    ]

    const angleOfMostVariance = Math.atan2(vectorOfMostVariance[1], vectorOfMostVariance[0]) / Math.PI * 180

    const updateDataWithWeights = _.map(dataWithWeights, country => ({
      ...country,
      ["axis of good rankings"]: vectorOfMostVariance[0] * country.xValue + vectorOfMostVariance[1] * country.yValue,
    }))

    this.setState({ dataWithWeights: updateDataWithWeights, angleOfMostVariance })
  }
  debouncedGenerateWeightedData = _.debounce(this.generateWeightedData, 400)

  getDifferences = arr => {
    const values = _.map(arr, valueToNumber)
    const mean = _.mean(arr)
    const differences = _.map(values, (d, i) => d - mean)
    return differences
  }

  getWeightedValue = (country, metricWeights) => {
    const weightedCountryMetricValues = _.map(
      _.keys(metricWeights),
      metric => valueToNumber(country[`${metric}__percentile`]) * metricWeights[metric]
    )
    return _.mean(weightedCountryMetricValues)
  }

  onHighlightedCountriesChange = countries => this.setState({ highlightedCountries: _.map(countries, "value") })

  render() {
    const { dataWithWeights, xMetricWeights, yMetricWeights, xMetric, yMetric, angleOfMostVariance, highlightedCountries } = this.state

    return (
      <div className={this.getClassName()}>
        <div className="WDVPGrandPoobah__content">
          <div className="WDVPGrandPoobah__sliders">
            <div className="WDVPGrandPoobah__sliders-wrapper">
              <WDVPGrandPoobahSliders
                metricWeights={xMetricWeights}
                onChange={this.onMetricWeightsChangeForAxisLocal("x")}
                title="x axis weights"
                startingPresetName={presetNames[1]}
                isShowingLabels
              />
              <WDVPGrandPoobahSliders
                metricWeights={yMetricWeights}
                onChange={this.onMetricWeightsChangeForAxisLocal("y")}
                startingPresetName={presetNames[2]}
                title="y axis weights"
              />
            </div>
            <div className="WDVPGrandPoobah__note">
              Note: These presets were discovered automatically using <a href="https://en.wikipedia.org/wiki/Non-negative_matrix_factorization" target="_blank" ref="noopener noreferrer">non-negative matrix factorization</a> and manually named.
            </div>

          </div>
          <WDVPScatter
            data={dataWithWeights}
            xMetric={"xValue"}
            yMetric={"yValue"}
            angleOfMostVariance={angleOfMostVariance}
            onHighlightedCountriesChange={this.onHighlightedCountriesChange}
          />
        </div>

        <WDVPMetrics metrics={["axis of good rankings"]} data={dataWithWeights} highlightedCountries={highlightedCountries} />

      </div>
    )
  }
}

export default WDVPGrandPoobah


const formatNumber = d3.format(",")
class WDVPGrandPoobahSliders extends PureComponent {
  state = {
    isDragging: false,
    activePreset: null,
  }

  componentDidMount() {
    if (this.props.startingPresetName) {
      const startingPreset = _.filter(presetOptions, {name: this.props.startingPresetName})[0]
      if (startingPreset) this.onPresetSelect(startingPreset)
    }
  }

  componentWillUnmount() {
    if (this.listener) window.removeEventListener(this.listener)
  }

  onChangeMetricWeightLocal = (selectedMetric, doesNeedDragging=true) => newWeight => {
    if (doesNeedDragging && !this.state.isDragging) return
    const newMetricWeights = _.fromPairs(
      _.map(this.props.metricWeights, (weight, metric) => [
        metric,
        metric == selectedMetric ? newWeight : weight
      ])
    )
    this.props.onChange(newMetricWeights)
  }

  onStartDragging = () => {
    this.setState({ isDragging: true })
    this.listener = window.addEventListener("mouseup", this.onStopDragging)
  }
  onStopDragging = () => this.setState({ isDragging: false })

  onPresetSelect = preset => {
    this.props.onChange(preset.metricWeights)
    this.setState({activePreset: preset.name})
  }

  render() {
    const { title, metricWeights, isShowingLabels, onChange } = this.props
    const { isDragging, activePreset } = this.state

    return (
      <div className={`WDVPGrandPoobahSliders WDVPGrandPoobahSliders--has-${isShowingLabels ? "labels" : "no-labels"}`}
        onMouseDown={this.onStartDragging}
        onMouseMove={this.onDrag}
      >
        <h6 className="WDVPGrandPoobahSliders__title">
          { title }
        </h6>

        <div className="WDVPGrandPoobahSliders__select-wrapper">
          <Select
            className="WDVPGrandPoobahSliders__select"
            classNamePrefix="WDVPGrandPoobahSliders__select"
            options={presetOptions}
            value={{value: activePreset, label: activePreset}}
            styles={selectStyles}
            onChange={this.onPresetSelect}
          />
        </div>

        {_.map(metricWeights, (weight, metric) => (
          <WDVPGrandPoobahSlidersItem
            key={metric}
            metric={metric}
            weight={weight}
            isShowingLabels={isShowingLabels}
            onChange={this.onChangeMetricWeightLocal(metric, false)}
            onChangeNeedsDragging={this.onChangeMetricWeightLocal(metric)}
          />
        ))}
      </div>
    )
  }
}

class WDVPGrandPoobahSlidersItem extends PureComponent {
  elem = React.createRef()

  componentDidMount() {
    d3.select(this.elem.current).on("mousemove", this.onMouseMove)
    d3.select(this.elem.current).on("mousedown", this.onMouseMove)
  }
  componentWillUnmount() {
    d3.select(this.elem.current).on("mousemove", null)
    d3.select(this.elem.current).on("click", null)
  }

  onMouseMove = e => {
    const element = d3.select(this.elem.current).node()
    const mousePosition = d3.mouse(element)
    const width = element.getBoundingClientRect().width
    const weight = mousePosition[0] * 3 / width
    this.props.onChangeNeedsDragging(weight)
  }

  render() {
    const { metric, weight, isShowingLabels, onChange, onChangeNeedsDragging, ...props } = this.props
    return (
      <div {...props}
        className={`WDVPGrandPoobahSlidersItem WDVPGrandPoobahSlidersItem--is-${weight < 0 ? "negative" : "positive"}`}>
        {isShowingLabels && (
          <div className="WDVPGrandPoobahSlidersItem__label">
            { metric }
          </div>
        )}

        <div className="WDVPGrandPoobahSlidersItem__slider"
        ref={this.elem}>
            <ReactSlider
              value={weight}
              min={0}
              max={3}
              step={0.1}
              withBars
              onChange={onChange}
            />
        </div>
      </div>
    )
  }
}
// const WDVPGrandPoobahSlidersItem = React.memo(({ metric, weight, isShowingLabels, onChange, ...props }) => {
//   const onChangeLocal = () => onChange(getRandomWeight())
//   return (
//     <div {...props}
//       className={`WDVPGrandPoobahSlidersItem WDVPGrandPoobahSlidersItem--is-${weight < 0 ? "negative" : "positive"}`}>
//       {isShowingLabels && (
//         <div className="WDVPGrandPoobahSlidersItem__label">
//           { metric }
//         </div>
//       )}
//       <div className="WDVPGrandPoobahSlidersItem__slider">
//           <ReactSlider
//             value={weight}
//             min={0}
//             max={3}
//             step={0.1}
//             withBars
//             onChange={onChange}
//           />
//       </div>
//     </div>
//   )
// })