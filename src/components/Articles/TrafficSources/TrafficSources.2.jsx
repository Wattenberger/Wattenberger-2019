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

const rawTimeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const timeAccessor = d => d[0]
const viewsAccessor = d => d && (d[1] || {}).views
const articlesAccessor = d => d && (d[1] || {}).published

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

const firstTime = timeAccessor(bucketedData["facebook"][0])
const lastTime = timeAccessor(_.last(bucketedData["facebook"]))
const formatDateTime = d3.timeFormat("%A, %B %-d, %-I:%m %p")
const TrafficSources = () => {
  const [time, setTime] = useState(firstTime)

  // useInterval(() => {
  //   // setTime(d3.timeMinute.offset(time, 15))
  //   setTime(d3.timeMinute.offset(time, 15 * 3))
  // }, time < lastTime ? 100 : null)


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
const sites = _.keys(data)
// const sites = _.keys(data).filter(d => !["google", "facebook"].includes(d))
const maxViews = d3.max(
  _.flatMap(_.values(data)).map(viewsAccessor)
  // _.flatMap(_.values(_.omit(data, ["google", "facebook"]))).map(viewsAccessor)
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
const siteAngles = {
  "google": 0,
  "facebook": 167.42857142857143,
  "pinterest": 195.85714285714286,
  "twitter": 200.28571428571428,
  "instagram": 205.71428571428572,
  "linkedin": 210.14285714285717,
  "reddit": 215.57142857142856
}
const angleScale = d3.scaleLinear()
  .domain([0, maxViews])
  .range([0, (360 / sites.length) * 6])

const distanceScale = d3.scaleLinear()
  .domain([firstTime, lastTime])
  .range([0, 1])
  // .range(d3.range(0.1, 1, (1 - 0.1) / sites.length))
  // console.log(d3.range(0.1, 1, (1 - 0.1) / sites.length))

const formatTime = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ")
const TrafficSourcesDiagram = ({ time }) => {
  const [ref, dimensions] = useChartDimensions({
    height: 900,
    width: 900,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
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
            {/* <Eye angle={angle} /> */}

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
      {bucketedData[site].map(d => {
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