import { useState, usePrevious, useEffect } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import dataFile from "./data.csv"

import './DVS.scss';

const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const axes = [
  "society",
  "visualization",
  "data",
]
const colorAxisScale = d3.scaleLinear()
  .domain([0, 5])
  .range([0, 1])
const colors = [
  d3.interpolateRainbow(0.43),
  d3.interpolateRainbow(0.76),
  d3.interpolateRainbow(0.1),
]
const grabColor = (values) => {
  const valueIndices = _.map(axes, (axis, i) => [
    i,
    values[i]
  ])
  const mainAxis = _.maxBy(valueIndices, "1")
  return colorAxisScales[mainAxis[0]](mainAxis[1])
}
const colorAxisScales = colors.map(color => (
  d3.interpolateHsl("#e2e4e7", color)
))
const dateAccessor = d => d3.timeParse("%m/%d/%Y")(d.date)
const DVS = () => {
  const [data, setData] = useState([])
  const [location, setLocation] = useState([0, 0])

  useEffect(() => {
    d3.csv(dataFile).then(rows => {
      const sortedData = _.orderBy(_.map(rows, d => ({
        ...d,
        color: grabColor(_.map(axes, axis => colorAxisScale(+d[axis] || 0))),
      })), dateAccessor, "asc")
      setData(sortedData)
    })
  }, [])

  return (
    <div className="DVS">
      <h2 className="DVS__title">
        Data Visualization Society
      </h2>
      <div className="DVS__contents">
      <div className="DVS__map">

        <div className="DVS__description">
          <p>
            Over the past few weeks, 3,500 people have signed up for an invite to the <b>Data Visualization Society</b> to discuss, envision, and engage. Explore their expertise and location (log scaled and converted to polar coordinates) relative to you.
          </p>

          <DVSLegend />
        </div>
        {!data.length ? <div className="DVS__loading">Loading...</div> : (
          <DVSMap
            data={data}
            location={location}
          />
        )}
        </div>
        <DVSLocation
          location={location}
          setLocation={setLocation}
        />
      </div>
    </div>
  )
}

export default DVS


const cities = [
  ["Amsterdam", "Netherlands", 52.3680, 4.9036],
  ["Bangkok", "Thailand", 13.7563, 100.5018],
  ["Barcelona", "Spain", 41.3851, 2.1734],
  ["Beijing", "China", 39.9042, 116.4074],
  ["Berlin", "Germany", 52.5200, 13.4050],
  ["Bombay", "India", 19.0760, 72.8777],
  ["Cape Town", "South Africa", -33.9249, 18.4241],
  ["Copenhagen", "Denmark", 55.6761, 12.5683],
  ["Helsinki", "Finland", 60.1699, 24.9384],
  ["Lima", "Peru", -12.0464, -77.0428],
  ["London", "England", 51.5074, -0.1278],
  ["NYC", "USA", 40.7128, -74.0060],
  ["Paris", "France", 48.8566, 2.3522],
  ["Reykjavík", "Iceland", 64.1466, -21.9426],
  ["Rio de Janeiro", "Brazil", -22.9068, -43.1729],
  ["Rome", "Italy", 41.9028, 12.4964],
  ["San Francisco", "USA", 37.7749, -122.4194],
  ["Stockholm", "Sweden", 59.3293, 18.0686],
  ["Sydney", "Australia", -33.8688, 151.2093],
  ["Tokyo", "Japan", 35.6895, 139.6917],
  ["Vancouver", "Canada", 49.2827, -123.1207],
  ["Venice", "Italy", 45.4408, 12.3155],
  ["Vienna", "Austria", 48.2082, 16.3738],
  ["Zürich", "Switzerland", 47.3769, 8.5417],
]
// [{
//   name: "NYC",
//   location: [40.7128, -74.0060],
// },{
//   name: "LA",
//   location: [34.0522, -118.2437],
// },{
//   name: "Philadelphia",
//   location: [39.9526, -75.1652],
// // },{
// //   name: "Rochester",
// //   location: [43.1566, -77.6088],
// },{
//   name: "Lima",
//   location: [-12.0464, -77.0428],
// },{
//   name: "Berlin",
//   location: [52.5200, 13.4050],
// },{
//   name: "Tokyo",
//   location: [35.6895, 139.6917],
// }]
const logScaleDistance = d => d ? Math.log10(d) * 150 : 0
const DVSMap = ({ data=[], location }) => {
  const [state, setState] = useState({
    thisCity: null,
    cities: [],
    dots: [],
  })

  useEffect(() => {
      const relativeLocations = _.map(data, d => ({
          ...d,
          location: findNewPoint(
            0,
            0,
            findAngle(wrapAroundLongitude(location[1], +d.long), +d.lat - location[0]),
            logScaleDistance(findDistance(wrapAroundLongitude(location[1], +d.long), +d.lat - location[0])),
          ),
      }))

      const enhancedCities = cities.map(city => {
        const baseDistance = findDistance(wrapAroundLongitude(location[1], city[3]), city[2] - location[0])
        const angle = findAngle(wrapAroundLongitude(location[1], city[3]), city[2] - location[0])
        const newLocation = findNewPoint(
          0,
          0,
          angle,
          logScaleDistance(baseDistance) + 50,
        )

        return {
          angle,
          location: newLocation,
          baseDistance: baseDistance,
          name: `${ city[0] }, ${ city[1] }`,
          city: city[0],
          country: city[1],
        }
      })

      const numAngleSteps = 10
      const angleSteps = (Math.PI * 2) / (numAngleSteps- 1)
      const anglePadding = angleSteps * 0.1
      const angleCities = _.filter(_.map(_.times(numAngleSteps), i => {
        const startAngle = angleSteps * i - Math.PI + anglePadding
        const endAngle = angleSteps * (i + 1) - Math.PI - anglePadding
        const city = _.find(enhancedCities, d => d.baseDistance > 50 && d.angle > startAngle && d.angle < endAngle)
        return city
      }), d => d)

      const thisCity = _.find(enhancedCities, d => d.baseDistance < 2)

      setState({
        thisCity,
        cities: angleCities,
        dots: relativeLocations,
      })
    }, [data, location])


  return (
    <div className="DVSMap">
      <div className="DVSMap__center">
        <div className="DVSMap__center__text">
        { state.thisCity && state.thisCity.city }
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </div>
      {_.map(state.cities, (d, i) => (
        <div
          className="DVSMap__location"
          key={d.name}
          style={{
            transform: `translate(${d.location[0]}px, ${d.location[1] * -1}px)`,
          }}
        >
          <div className="DVSMap__location__arrow" style={{
            transform: `rotate(${-d.angle * (180 / Math.PI) - 90}deg)`
          }} />
          <div className="DVSMap__location__city">{ d.city }</div>
          <div className="DVSMap__location__country">{ d.country }</div>
        </div>
      ))}
      {_.map(state.dots, (d, i) => (
        <DvsMapDot
          key={i}
          i={i}
          color={d.color}
          location={d.location}
        />
      ))}
    </div>
  )
}

const DvsMapDot = React.memo(({ color, location, i }) => (
  <div
    className="DVSMap__dot"
    style={{
      background: color,
      transform: `translate(${location[0]}px, ${location[1] * -1}px)`,
      animationDelay: `${i * 0.003}s`,
    }}
  />
))

const findAngle = (xDelta, yDelta) => (
  Math.atan2(yDelta, xDelta)
)
const findDistance = (xDelta, yDelta) => (
  Math.sqrt(Math.pow(xDelta, 2) + (Math.pow(yDelta, 2)))
)

const findNewPoint = (x, y, angle, distance) => [
  Math.round(Math.cos(angle) * distance + x),
  Math.round(Math.sin(angle) * distance + y),
]

const wrapAroundLongitude = (center, value) => {
  const bounds = [center - 180, center + 180]
  return value < bounds[0] ? (bounds[1] - (bounds[0] - value)) - center :
         value > bounds[1] ? (center - (bounds[0] + (value - bounds[1]))) * -1 :
         value - center
}

const DVSLocation = ({ location, setLocation }) => {
  const [selectedCity, setSelectedCity] = useState()

  const grabLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      setLocation([
        position.coords.latitude,
        position.coords.longitude,
      ])
      setSelectedCity()
    })
  }

  useEffect(() => {
    grabLocation()
  }, [])

  // const onLocationChange = index => value => {
  //   const newLocation = index
  //     ? [location[0], value]
  //     : [value, location[1]]
  //   setLocation(newLocation)
  // }
  const onSelectCity = city => () => {
    setLocation(city.slice(2))
    setSelectedCity(city[0])
  }

  return (
    <div className="DVSLocation">
      <div className="DVSLocation__current">
        <i>Centered at { location.map(formatNumberWithDecimal).join(", ") }</i>
      </div>

      <Button onClick={grabLocation}>
        Grab my location
      </Button>

      <h6>
        What about in...
      </h6>

      {_.map(cities, d => (
        <Button className={`DVSLocation__city DVSLocation__city--is-${selectedCity == d[0] ? "selected" : "not-selected"}`} onClick={onSelectCity(d)}>
          <div>{ d[0] }</div>
          <div>{ d[1] }</div>
        </Button>
      ))}


      {/* <Slider
        value={[location[0]]}
        min={-90}
        max={90}
        onChange={onLocationChange(0)}
        pushable
      />
      <Slider
        value={[location[1]]}
        min={-180}
        max={180}
        onChange={onLocationChange(1)}
        pushable
      /> */}
    </div>
  )
}


const DVSLegend = () => (
  <div className="DVSLegend">
    <h6>Top skill</h6>
    <div className="DVSLegend__axes">
      {_.map(axes, (axis, axisIndex) => (
        <div className="DVSLegend__axis" key={axis}>
          <div className="DVSLegend__axis__name">
            { axis }
          </div>
          <div className="DVSLegend__axis__gradient" style={{
            background: `linear-gradient(to right, ${
              _.map(_.times(10, i => colorAxisScales[axisIndex](i / 9))).join(", ")
            })`
          }}>
          </div>
        </div>
      ))}
    </div>
  </div>
)