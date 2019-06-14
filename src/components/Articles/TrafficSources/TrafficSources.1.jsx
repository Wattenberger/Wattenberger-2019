import { useState, usePrevious, useEffect, useMemo } from 'react';
import React, {Component} from "react"
import {useSpring, animated, config as SpringConfig} from 'react-spring'

import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from "components/_ui/Chart/Chart"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import Slider from 'rc-slider';
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
import siteIcons from "./iconPaths.json"
import { getPointFromAngleAndDistance } from "utils/utils"
import data from "./data.json"
import { useInterval } from "utils/utils"

import './TrafficSources.scss';


const timeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const viewsAccessor = d => d && (d[1] || {}).views
const articlesAccessor = d => d && (d[1] || {}).published
const firstTime = timeAccessor(data["facebook"][0])
const lastTime = timeAccessor(_.last(data["facebook"]))
const formatDateTime = d3.timeFormat("%A, %B %-d, %-I:%m %p")
const TrafficSources = () => {
  const [time, setTime] = useState(firstTime)

  useInterval(() => {
    // setTime(d3.timeMinute.offset(time, 15))
    setTime(d3.timeMinute.offset(time, 15 * 3))
  }, time < lastTime ? 100 : null)


  return (
    <div className="TrafficSources">
      <h2 className="TrafficSources__title">
        Traffic Sources
      </h2>

      <div className="TrafficSources__contents">

        <TrafficSourcesDates time={time} />
        <h4 className="TrafficSources__time">
          { formatDateTime(time) } EST
        </h4>

        <TrafficSourcesDiagram time={time} />
      </div>
    </div>
  )
}

export default TrafficSources


const dates = d3.timeDay.range(firstTime, lastTime)
const dateScale = d3.scaleTime()
  .domain([firstTime, lastTime])
  .range([0, 100])
const ticks = dateScale.ticks(6)
const formatDatePretty = d3.timeFormat("%B %-d")
const TrafficSourcesDates = ({ time }) => {
  return (
    <div className="TrafficSourcesDates">
      {ticks.map(tick => (
        <div key={tick} className="TrafficSourcesDates__tick" style={{
          left: `${dateScale(tick)}%`
        }}>
          { formatDatePretty(tick) }
        </div>
      ))}
      <div className="TrafficSourcesDates__indicator" style={{
        transform: `translateX(${dateScale(time)}px)`
      }} />
    </div>
  )
}


const siteColors = {
  "google": "#4285f4",
  "pinterest": "#bd081c",
  "facebook": "#3b5998",
  "twitter": "#1da1f2",
  "instagram": "#5851db",
  "linkedin": "#0077b5",
  "reddit": "#ff4500",
}
// const sites = _.keys(data)
const sites = _.keys(data).filter(d => !["google", "facebook"].includes(d))
const maxViews = d3.max(
  _.flatMap(_.values(_.omit(data, ["google", "facebook"]))).map(viewsAccessor)
)
const viewsScale = d3.scaleSqrt()
  .domain([0, maxViews])
  .range([20, 200])
const viewsCirclesScale = d3.scaleQuantize()
  .domain([0, maxViews])
  .range(d3.range(0, 30))

const siteAngles = _.fromPairs(
  sites.map((site, i) => [
    site,
    i * (360 / (sites.length)),
  ])
)
const formatTime = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ")
const TrafficSourcesDiagram = ({ time }) => {
  const [ref, dimensions] = useChartDimensions({
    height: 800,
    width: 800,
    marginTop: 100,
    marginRight: 100,
    marginBottom: 100,
    marginLeft: 100,
  })

  const centerCircleRadius = dimensions.height * 0.2
  const radius = dimensions.boundedHeight / 2

  const timeString = formatTime(time)
  const viewsPerSite = _.map(sites, site => ({
    site,
    views: viewsAccessor(data[site].filter(d => d[0] == timeString)[0] || {}) || 0
  }))
  const mostViewedIndex = _.findIndex(sites, d => d == _.maxBy(viewsPerSite, d => d.views).site)
  const angle = mostViewedIndex * (360 / (sites.length))

  return (
    <div ref={ref} className="TrafficSourcesDiagram">
      <svg width={dimensions.width} height={dimensions.height}>
        <g style={{transform: `translate(${dimensions.marginLeft}px, ${dimensions.marginTop}px)`}}>
          <g style={{transform: `translate(${radius}px, ${radius}px)`}}>


            {sites.map((site, index) => (
              <Site
                {...{site, time, timeString, radius}}
              />
            ))}
            <Eye angle={angle} />

          </g>
        </g>
      </svg>
    </div>
  )
}


const Eye = ({ angle }) => {
  const delta = getPointFromAngleAndDistance(angle, 30)

  return (
    <>
      <circle r="100" fill="white" />
      <circle r="50" cx={delta.x} cy={delta.y} />
      <circle r="6" cx={-10 + delta.x} cy={-20 + delta.y} fill="white" />
    </>
  )
}

const Site = ({ site, time, timeString, radius, placement }) => {
  const [people, setPeople] = useState([])


  const { angle, fill, center } = useMemo(() => {
    const angle = siteAngles[site]

    const fill = siteColors[site]
    const center = getPointFromAngleAndDistance(angle, radius)

    return {
      angle, fill, center
    }
  }, [])

  const expirationDate = d3.timeMinute.offset(time, -15 * 20)
  const distanceScale = d3.scaleLinear()
    .domain([time, expirationDate])
    .range([60, radius - 50])

  const views = viewsAccessor(data[site].filter(d => d[0] == timeString)[0] || {}) || 0
  const numberOfPeople = viewsCirclesScale(views)

  useEffect(() => {
    const newPeople = [
      ...people.filter(d => d.time > expirationDate),
      ..._.times(numberOfPeople, i => ({
        id: _.uniqueId(),
        time,
        xOffset: d3.randomNormal(0, 12)(),
        yOffset: d3.randomNormal(0, 12)(),
      }))
    ]
    setPeople(newPeople)
  }, [time])

  const getPersonPosition = person => {
    const distance = distanceScale(person.time)
    const coords = getPointFromAngleAndDistance((angle - 180) % 360, distance)
    return {
      x: coords.x + person.xOffset,
      y: coords.y + person.yOffset,
    }
  }

  const {x: x2, y: y2} = getPointFromAngleAndDistance(angle, 20)

  return (
    <g key={site} style={{transform: `translate(${center.x}px, ${center.y}px)`}}>
      {people.map(person => {
        const position = getPersonPosition(person)
        return (
          <line
            className="TrafficSourcesDiagram__person"
            style={{
              opacity: (radius - distanceScale(person.time)) / 300,
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            x1={0}
            y1={0}
            x2={x2}
            y2={y2}
            key={person.id}
            stroke={fill}
          />
        )
      })}
      <circle
        className="TrafficSourcesDiagram__circle"
        r={viewsScale(views)}
        fill={fill}
      />
      <path
        className="TrafficSourcesDiagram__icon"
        d={siteIcons[site]}
        fill={fill}
        transform="translate(-12.5, -12.5)"
      />

    </g>
  )
}