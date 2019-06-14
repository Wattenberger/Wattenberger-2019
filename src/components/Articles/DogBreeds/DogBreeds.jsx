import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import ReactSelect from 'react-select';
import Select from 'react-select';
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from 'components/_ui/Chart/Chart';
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Axis from 'components/_ui/Chart/Axis/Axis';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

import data from "./breeds.json"

import './DogBreeds.scss'

// console.log(data)
const dataByBreed = _.fromPairs(_.map(data, d => [
  d.breed,
  d,
]))

const margin = {
  top: 2,
  right: 0,
  bottom: 30,
  left: 50,
}
const formatXAxis = (d, i) => d + 1926
const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0")
const formatNumberShort = d => numeral(d).format("0,0a")
const ordinalColors = ["#778beb", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const breeds = _.map(data, "breed")
const breedColors = _.fromPairs(
  _.map(breeds, (breed, i) => [
    breed,
    ordinalColors[i % ordinalColors.length],
  ])
)
const breedGroups = _.uniqBy(_.map(data, "group"))
const breedGroupColors = _.fromPairs(
  _.map(breedGroups, (group, i) => [
    group,
    ordinalColors[i % ordinalColors.length],
  ])
  )
const breedGroupOptions = _.map(breedGroups, group => ({ value: group, label: group, color: breedGroupColors[group] }))

const breedOptions = _.map(breeds, breed => ({ value: breed, label: breed, color: breedGroupColors[dataByBreed[breed].group] }))
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const selectStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? `${data.color}22` : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? "white"
          : data.color,
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: `${data.color}22`,
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  })
}
class DogBreeds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
      xScale: null,
      yScale: null,
      filteredData: [],
      tooltipInfo: null,
      closestBreed: null,
      selectedBreeds: [],
      selectedGroups: [],
      iteration: 0,
    }
  }

  getClassName() {
    return classNames("DogBreeds", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }

  chart = React.createRef()

  createScales = () => {
    const { selectedBreeds, selectedGroups } = this.state

    const height = 500
    const width = window.innerWidth * 0.95
    const xScale = createScale({
      // type: "time",
      width,
      margin,
      dimension: "x",
      domain: [0, data[0].counts.length],
    })
    const selectedBreedValues = _.map(selectedBreeds, "value")
    const selectedGroupValues = _.map(selectedGroups, "value")
    const filteredData = _.filter(data, d => (
      (_.isEmpty(selectedBreeds) || _.includes(selectedBreedValues, d.breed)) &&
      (_.isEmpty(selectedGroups) || _.includes(selectedGroupValues, d.group))
    ))

    const maxCount = _.max(_.flatMap(filteredData, "counts"))
    const yScale = createScale({
      height,
      margin,
      dimension: "y",
      domain: [0, maxCount],
    })
    const iteration = this.state.iteration + 1
    this.setState({ height, width, xScale, yScale, filteredData, iteration })
  }

  xAccessor = (d,i) => this.state.xScale && this.state.xScale(i)
  yAccessor = d => this.state.yScale && this.state.yScale(+d)

  onMouseMove = (clientX, clientY) => {
    if (!this.chart || !this.chart.current) return
    const { width, xScale, yScale, filteredData } = this.state
    if (!this.isHoveringChart) return

    const mouseX = clientX - this.chart.current.getBoundingClientRect().left - margin.left
    const yearIndex = Math.round(xScale.invert(mouseX))
    const year = yearIndex + 1926

    const mouseY = clientY - this.chart.current.getBoundingClientRect().top - margin.top
    const mouseYVal = yScale.invert(mouseY)

    const parsedBreeds = _.map(filteredData, breed => ({
      ...breed,
      breed: breed.breed,
      value: +breed.counts[yearIndex],
      distanceFromY: mouseYVal - breed.counts[yearIndex],
      absDistanceFromY: Math.abs(mouseYVal - breed.counts[yearIndex]),
    }))
    const orderedBreeds = _.map(_.orderBy(parsedBreeds, "value", "desc"), (d, i) => ({...d, index: i + 1}))
    const breedsByYCloseness = _.orderBy(orderedBreeds, "distanceFromY", "asc")
    const breedsByYAbsCloseness = _.orderBy(orderedBreeds, "absDistanceFromY", "asc")
    const closestBreed = _.get(breedsByYAbsCloseness, [0, "breed"])
    const closestBreedIndex = _.findIndex(breedsByYCloseness, {breed: closestBreed})
    const neighborsOnEachSide = 3
    const closestBreedIndexCenter = Math.max(Math.min(closestBreedIndex, breedsByYCloseness.length - neighborsOnEachSide), neighborsOnEachSide)
    const closestBreeds = _.map(
      breedsByYCloseness.slice(closestBreedIndexCenter - neighborsOnEachSide, closestBreedIndexCenter + neighborsOnEachSide),
      (breed, i) => ({...breed, isSelected: closestBreedIndexCenter + i - neighborsOnEachSide == closestBreedIndex }),
    )
    const x = xScale(yearIndex)
    const boundedX = Math.max(Math.min(width - 200, x), 0)

    const tooltipInfo = {
      breeds: closestBreeds,
      year,
      y: mouseY,
      x,
      boundedX,
    }

    this.setState({ tooltipInfo, closestBreed })
  }
  throttledOnMouseMove = _.throttle(this.onMouseMove, 90)
  persistedOnMouseMove = e => this.throttledOnMouseMove(e.clientX, e.clientY)

  onMouseEnter = () => this.isHoveringChart = true;
  clearTooltip = () => {
    this.isHoveringChart = false;
    this.setState({ tooltipInfo: null, closestBreed: null })
  }
  onBreedsSelect = breeds => this.setState({ selectedBreeds: breeds }, this.createScales)
  onSelectedGroupsChange = groups => this.setState({ selectedGroups: groups || [] }, this.createScales)

  render() {
    const { height, width, xScale, yScale, tooltipInfo, closestBreed, selectedBreeds, selectedGroups, filteredData, iteration } = this.state
    const selectedBreedValues = _.map(selectedBreeds, "value")
    const highlightedBreeds = _.uniqBy(_.filter([closestBreed, ...selectedBreedValues]), _.identity)

    return (
      <div className={this.getClassName()}>
        <div className="DogBreeds__title-container">
          <h2 className="DogBreeds__title">
            Dog breed popularity
          </h2>
        </div>
        <div className="DogBreeds__contents">
          <div className="DogBreeds__controls">
            <Select
              placeholder="Explore specific breeds"
              isMulti
              name="breeds"
              options={breedOptions}
              value={selectedBreeds}
              className="DogBreeds__select"
              classNamePrefix="DogBreeds__select"
              styles={selectStyles}
              onChange={this.onBreedsSelect}

            />

            <RadioGroup
              className="DogBreeds__toggle"
              options={breedGroupOptions}
              value={selectedGroups}
              onChange={this.onSelectedGroupsChange}
              isMulti
              canClear
            />
          </div>
          <div className={`DogBreeds__chart DogBreeds__chart--has-${selectedBreedValues.length ? "selected-breeds" : "no-selected-breeds"}`} ref={this.chart}>
            <Chart
              width={width}
              height={height}
              margin={margin}
              onMouseMove={this.persistedOnMouseMove}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.clearTooltip}>
              {_.map(filteredData, breed => (
                <Line
                  key={breed.breed}
                  data={breed.counts}
                  xAccessor={this.xAccessor}
                  yAccessor={this.yAccessor}
                  style={{
                    stroke: breedGroupColors[breed.group],
                    strokeWidth: 1.6,
                  }}
                  iterator={iteration}
                />
              ))}
              {highlightedBreeds.map(breed => (
                <Line
                  key={breed}
                  data={dataByBreed[breed].counts}
                  xAccessor={this.xAccessor}
                  yAccessor={this.yAccessor}
                  style={{
                    stroke: breedGroupColors[dataByBreed[breed].group],
                    strokeWidth: 4,
                    opacity: 1,
                    transition: "none",
                  }}
                  iterator={iteration}
                />
              ))}

              <Axis
                dimension="x"
                height={height}
                width={width}
                margin={margin}
                scale={xScale}
                format={formatXAxis}
              />
              <Axis
                dimension="y"
                height={height}
                margin={margin}
                scale={yScale}
                format={formatNumberShort}
              />

              {tooltipInfo && (
                <rect
                  className="DogBreeds__crosshair"
                  x={tooltipInfo.x}
                  y={margin.top}
                  width={1}
                  height={height - margin.top - margin.bottom}
                />
              )}
            </Chart>

            {tooltipInfo && (
              <DogBreedsTooltip
                style={{transform: `translate3d(calc(-50% + ${tooltipInfo.boundedX}px), calc(-100% + ${tooltipInfo.y}px), 0)`}}
                {...tooltipInfo}
              />
            )}
          </div>
        </div>
    </div>
    )
  }
}

export default DogBreeds


const DogBreedsTooltip = ({ breeds, year, x, boundedX, y, ...props }) => (
  <div className="DogBreedsTooltip" {...props}>
    <h6 className="DogBreedsTooltip__header">{ year }</h6>
    <div className="DogBreedsTooltip__breeds">
      {_.map(breeds, breed => _.isObject(breed) && (
        <div className={`DogBreedsTooltip__breed DogBreedsTooltip__breed--is-${breed.isSelected ? "selected" : "not-selected"}`} key={breed.breed}>
          <div className="DogBreedsTooltip__breed-color" style={{background: breedGroupColors[breed.group]}} />
          <div className="DogBreedsTooltip__breed__index">
            { breed.index }.
          </div>
          <div className="DogBreedsTooltip__breed__label">
            { breed.breed }
          </div>
          <div className="DogBreedsTooltip__breed__value">
            { formatNumber(breed.value) }
          </div>
        </div>
      ))}
    </div>
  </div>
)