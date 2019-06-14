import { useState, usePrevious, useEffect, useMemo } from 'react';
import React, {Component} from "react"
import {useSpring, animated, config as SpringConfig, useTrail} from 'react-spring'

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

const rawTimeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const timeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
// const timeAccessor = d => d[0]
const viewsAccessor = d => d && (d[1] || {}).views
const articlesAccessor = d => d && (d[1] || {}).published

const ends = ["All"]

const minutesPerSlice = 60 * 2
const slicedData = _.fromPairs(_.map(data, (d, site) => [
  site,
  d.slice(0, 95 * 7)
]))
const bucketedData = _.fromPairs(
  _.map(slicedData, (d, site) => [
    site,
    downsampleData(d, minutesPerSlice, rawTimeAccessor, ["1.views", "1.published"]),
  ])
)

const firstTime = timeAccessor(slicedData["facebook"][0])
const lastTime = timeAccessor(_.last(slicedData["facebook"]))
const formatDateTime = d3.timeFormat("%A, %B %-d, %-I:%m %p")
const TrafficSources = () => {
  const [time, setTime] = useState(firstTime)

  useInterval(() => {
    // setTime(d3.timeMinute.offset(time, 15))
    setTime(d3.timeMinute.offset(time, 15))
  }, time < lastTime ? 150 : null)

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
  // _.flatMap(_.values(data)).map(viewsAccessor)
  _.flatMap(_.values(_.omit(data, ["google", "facebook"]))).map(viewsAccessor)
)
const viewsScale = d3.scaleSqrt()
  .domain([0, maxViews])
  .range([20, 200])
const viewsCirclesScale = d3.scaleQuantize()
  .domain([0, maxViews])
  .range(d3.range(0, 30))


// const siteAngles = _.fromPairs(
//   sites.map((site, i) => [
//     site,
//     i * (360 / (sites.length)),
//   ])
// )
const angleScale = d3.scaleLinear()
  .domain([0, maxViews])
  .range([0, (360 / sites.length) * 6])

const distanceScale = d3.scaleLinear()
  .domain([firstTime, lastTime])
  .range([0, 1])
  // .range(d3.range(0.1, 1, (1 - 0.1) / sites.length))
  // console.log(d3.range(0.1, 1, (1 - 0.1) / sites.length))

const formatTime = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ")
const generatePerson = (siteIndex, time) => ({
  id: _.uniqueId(),
  start: siteIndex,
  end: 0,
  fill: siteColors[sites[siteIndex]],
  xOffset: d3.randomNormal(-30, 15)(),
  yOffset: d3.randomNormal(0, 10)(),
  startTime: time,
})

const yOffsetScale = d3.scaleLinear()
  .domain([0.55, 0.6])
  .range([0, 1])
  .clamp(true)

const TrafficSourcesDiagram = ({ time }) => {
  const [people, setPeople] = useState([])
  const [ref, dimensions] = useChartDimensions({
    height: 900,
    marginTop: 20,
    marginRight: 80,
    marginBottom: 20,
    marginLeft: 80,
  })

  const { siteYScale, endYScale, xScale } = useMemo(() => {
    const siteYScale = d3.scaleLinear()
      .domain([-1, sites.length])
      .range([0, dimensions.boundedHeight])

    const endYScale = d3.scaleLinear()
      .domain([-1, ends.length])
      .range([0, dimensions.boundedHeight])

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, dimensions.boundedWidth])

    return { siteYScale, endYScale, xScale }
  }, [dimensions])

  const { timeXScale } = useMemo(() => {
    const timeString = formatTime(time)
    const endTime = d3.timeMinute.offset(time, -60 * 5)
    const viewsPerSite = _.fromPairs(_.map(sites, site => [
      site,
      viewsAccessor(data[site].filter(d => d[0] == timeString)[0] || {}) || 0
    ]))

    setPeople([
      ...people.filter(d => d.startTime >= d3.timeMinute.offset(endTime, -60)),
      ..._.flatMap(sites, (site, index) => (
        _.times(Math.floor(viewsPerSite[site] / 1000)).map(() => generatePerson(index, time))
      ))
    ])

    const timeXScale = d3.scaleLinear()
      .domain([time, endTime])
      .range([0, 1])
      // .clamp(true)

    return {
      timeXScale
    }

  }, [time])

  return (
    <div ref={ref} className="TrafficSourcesDiagram">
      <svg width={dimensions.width} height={dimensions.height}>
        <g style={{transform: `translate(${dimensions.marginLeft}px, ${dimensions.marginTop}px)`}}>

            {sites.map((site, index) => (
              <g key={site}>
                <SitePath
                  yStart={siteYScale(index)}
                  yEnd={endYScale(0)}
                  xScale={xScale}
                  {...{site}}
                />
                <path className="TrafficSourcesDiagram__site" d={siteIcons[site]} style={{
                  transform: `translate(-50px, ${siteYScale(index) - 12.5}px)`
                }} fill={siteColors[site]} />
              </g>
            ))}

            {people.map(person => {
              const xProgression = timeXScale(person.startTime)
              const yStart = siteYScale(person.start)
              const yEnd = endYScale(person.end)

              return (
                <Person
                  key={person.id}
                  x={xProgression * dimensions.boundedWidth + person.xOffset}
                  y={yOffsetScale(xProgression) * (yEnd - yStart) + yStart + person.yOffset}
                  fill={person.fill}
                  boundedWidth={dimensions.boundedWidth}
                />
              )
            })}
            {/* <Eye angle={angle} /> */}

        </g>
      </svg>
    </div>
  )
}

const Person = ({ x, y, fill, boundedWidth }) => {
  // const trail = useTrail(2, {x, y})

  return <animated.circle
    className="Person"
    r={6}
    cx={x}
    cy={y}
    fill={fill}
    opacity={x > 30 && x < (boundedWidth - 30) ? 1 : 0}
  />
}


const pathPoints = d3.range(6).map(d => d / 5)
const SitePath = ({ site, yStart, yEnd, xScale }) => {
  const pathGenerator = d3.line()
    .x((d,i) => xScale(d))
    .y((d,i) => i < 3 ? yStart : yEnd)
    .curve(d3.curveMonotoneX)

  const path = pathGenerator(pathPoints)
  return (
    <path
      className="SitePath"
      d={path}
    />
  )
}
const Site = ({ site, time, timeString, radius, placement }) => {

  const { angle, fill, center } = useMemo(() => {
    const angle = degreesToRadius(siteAngles[site])

    const fill = siteColors[site]
    const center = getPointFromAngleAndDistance(angle, radius)

    return {
      angle, fill, center
    }
  }, [])


  const arcGenerator = d3.arc()

  // <g key={site} style={{transform: `translate(${center.x}px, ${center.y}px)`}}>
  return (
    <g key={site}>
      {slicedData[site].map(d => {
        const distance = distanceScale(timeAccessor(d)) * radius
        const timeString = formatTime(timeAccessor(d))
        const views = viewsAccessor(data[site].filter(d => d[0] == timeString)[0] || {}) || 0
        const degrees = degreesToRadius(angleScale(views))

        const {x, y} = getPointFromAngleAndDistance(angle, distance)

        return (
          <path
            key={d[0]}
            d={arcGenerator({
              innerRadius: distance,
              outerRadius: distance + 3,
              startAngle: angle - (degrees / 2),
              endAngle: angle + (degrees / 2)
            })}
            fill={fill}
          />
        )
      })}

    </g>
  )
}


function downsampleData(data, interval, timeAccessor, selectors) {
  const start = timeAccessor(data[0]);
  const end = d3.timeMinute.offset(timeAccessor(data[data.length - 1]), 5);
  const intervals = interval > 60 ? d3.timeHour.every(interval / 60).range(start, end) :
                                    d3.timeMinute.every(interval).range(start, end);
  const firstDataIndex = _.findIndex(data, d => timeAccessor(d) >= intervals[0]);
  const lastDataIndex = _.findLastIndex(data, d => timeAccessor(d) <= _.last(intervals)) + 1;
  let remainingData = _.cloneDeep(data.slice(firstDataIndex, lastDataIndex));

  let downsampledData = _.filter(_.map(intervals, (time, index) => {
      const endOfInterval = _.get(intervals, index + 1, end);
      const dataPointsInInterval = _.takeWhile(remainingData, d => timeAccessor(d) < endOfInterval);

      // if (_.isEmpty(dataPointsInInterval)) return nullDataPoint;
      remainingData = remainingData.slice(dataPointsInInterval.length);

      let parsedDataPoint = _.assignIn({},
          _.cloneDeep(_.get(dataPointsInInterval, 0, [time, {}])),
          [time]
      );
      _.each(selectors, selector => {
          _.set(parsedDataPoint, selector, _.isEmpty(dataPointsInInterval) ? 0 : _.sumBy(dataPointsInInterval, d => _.get(d, selector, 0)));
      });
      return parsedDataPoint;
  }));

  const lastDataPointViews = _.get(_.last(downsampledData), _.get(selectors, "0"), 0);
  if (!lastDataPointViews) downsampledData = downsampledData.slice(0, -1);
  // the first point of timelines is bucketed strangely in the api
  // downsampledData = downsampledData.slice(1);

  return downsampledData;
}


function degreesToRadius(degrees) {
  return degrees * (Math.PI / 180)
}