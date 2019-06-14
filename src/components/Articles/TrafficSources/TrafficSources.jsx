import { useState, usePrevious, useEffect, useMemo, useRef } from 'react';
import React, {Component} from "react"
import {weightedVoronoi} from "d3-weighted-voronoi";
import {useSpring, animated, config as SpringConfig, useTrail} from 'react-spring'

import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import InterpolatedNumber from "components/_ui/InterpolatedNumber/InterpolatedNumber"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"
import siteIcons from "./iconPaths.json"
import { getPointFromAngleAndDistance } from "utils/utils"
import stories from "./stories.json"
import { useInterval } from "utils/utils"
import './TrafficSources.scss';

console.log(stories)

const slicedStories = stories
// const slicedStories = _.shuffle(stories.slice(0, 38))
const storyColors = d3.scaleLinear()
  .domain([0, slicedStories.length])
  // .interpolator(d3.interpolateRainbow)
  // .interpolator(d3.interpolateRainbow)
  .interpolate(d3.interpolateHcl)
  // .range(["#FDA7DF", "#FFC312"])
  // .range(["#dff9fb", "#686de0"])
  .range(["rgb(182, 148, 247)", "rgb(238, 162, 76)"])
  // .range(["#f7d794", "#63cdda"])
const rawTimeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const timeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const viewsAccessor = d => d && d[1]

const firstTime = d3.timeMinute.offset(timeAccessor(stories[0].timeline[0]), 60 * 24 * 2)
const lastTime = timeAccessor(_.last(stories[0].timeline))
const formatDate = d3.timeFormat("%A, %B %-d")
const formatHour = d3.timeFormat("%-I:")
const formatMinute = d => +d3.timeFormat("%-M")(d)
const formatAmPm = d3.timeFormat("%p")
const TrafficSources = () => {
  const [time, setTime] = useState(firstTime)

  useInterval(() => {
    // setTime(d3.timeMinute.offset(time, 15))
    setTime(d3.timeMinute.offset(time, 15))
  }, time < lastTime ? 600 : null)

  return (
    <div className="TrafficSources">
      <h2 className="TrafficSources__title">
        Traffic Sources
      </h2>

      <div className="TrafficSources__contents">

        <TrafficSourcesDates time={time} />
        <h4 className="TrafficSources__time">
          { formatDate(time) } { formatHour(time) }
          <InterpolatedNumber number={formatMinute(time)} format={d => numeral(d).format("00")} /> { formatAmPm(time) } EST
        </h4>

        <TrafficSourcesWindow time={time} />
      </div>
    </div>
  )
}

export default TrafficSources


const dates = d3.timeDay.range(firstTime, lastTime)
const dateScale = d3.scaleTime()
  .domain([firstTime, lastTime])
  .range([0, 1])
const ticks = dateScale.ticks(6)
const formatDatePretty = d3.timeFormat("%B %-d")
const formatDatePrettyShort = d3.timeFormat("%A %-d")
const formatDateDay = d3.timeFormat("%-d")
const TrafficSourcesDates = ({ time }) => {
  const [ref, dimensions] = useChartDimensions({
  })
  return (
    <div className="TrafficSourcesDates" ref={ref}>
      {ticks.map((tick, index) => (
        <div key={tick} className="TrafficSourcesDates__tick" style={{
          left: `${dateScale(tick) * 100}%`
        }}>
          { index ? formatDatePrettyShort(tick) : formatDatePretty(tick) }
          { getOrdinal(+formatDateDay(tick)) }
        </div>
      ))}
      <div className="TrafficSourcesDates__indicator" style={{
        transform: `translateX(${dateScale(time) * dimensions.width}px)`
      }} />
      <div className="TrafficSourcesDates__days" />
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
// const sites = _.keys(story.timeline)
// const sites = _.keys(data).filter(d => !["google", "facebook"].includes(d))
const maxViews = d3.max(
  _.flatMap(stories, d => d.timeline).map(viewsAccessor)
  // _.flatMap(_.values(data)).map(viewsAccessor)
  // _.flatMap(_.values(_.omit(data, ["google", "facebook"]))).map(viewsAccessor)
)
const maxTotalViews = d3.max(
  _.map(stories[0].timeline, (d, i) => d3.sum(stories.map(d => viewsAccessor(d.timeline[i]))))
  // _.flatMap(_.values(data)).map(viewsAccessor)
  // _.flatMap(_.values(_.omit(data, ["google", "facebook"]))).map(viewsAccessor)
) * 0.5
const viewsScale = d3.scaleSqrt()
  .domain([0, maxViews])
  .range([20, 200])
const viewsCirclesScale = d3.scaleQuantize()
  .domain([0, maxViews])
  .range(d3.range(0, 60))


const columns = 5
const rows = stories.length / columns
const storyPositions = slicedStories.map((story, i) => [
  (i % columns),
  Math.floor(i / columns)
])
console.log(storyPositions)

const formatTime = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ")

const yOffsetScale = d3.scaleLinear()
  .domain([0.55, 0.6])
  .range([0, 1])
  .clamp(true)

const TrafficSourcesWindow = ({ time }) => {
  let lastCells = useRef([])

  const [ref, dimensions] = useChartDimensions({
    height: 600,
    width: 800,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
  })


  const { xToCenterScale, yScale, scaledStoryPositions } = useMemo(() => {
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([dimensions.boundedHeight, 0])

    const xToCenterScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, dimensions.boundedWidth / 2])

    const scaledXScale = d3.scaleLinear()
      .domain([-1, columns])
      .range([0, dimensions.boundedWidth])
    const scaledYScale = d3.scaleLinear()
      .domain([-1, storyPositions[storyPositions.length - 1][1] + 1])
      .range([0, dimensions.boundedHeight])

    const scaledStoryPositions = storyPositions.map(position => position && [
      scaledXScale(position[0]),
      scaledYScale(position[1]),
    ])
    return {
      xToCenterScale, yScale, scaledStoryPositions
    }
  }, [dimensions])

  const { viewsPerStory, timeString, storyProportions, cells } = useMemo(() => {
    const timeString = formatTime(time)
    const viewsPerStory = _.fromPairs(_.map(slicedStories, story => [
      story.id,
      viewsAccessor(story.timeline.filter(d => d[0] == timeString)[0] || {}) || null
    ]))
    const totalViews = d3.sum(_.values(viewsPerStory))
    const proportion = stories.length / maxTotalViews

    const storyProportions = slicedStories.map(story => (
      viewsPerStory[story.id] / totalViews
    ))

    const voronoi = weightedVoronoi()
      .x(d => d[0])
      .y(d => d[1])
      .weight(d => d[2] * 400000)
      .clip([[0,0], [0,dimensions.boundedHeight], [dimensions.boundedWidth, dimensions.boundedHeight], [dimensions.boundedWidth,0]])  // set the clipping polygon

    let cells = voronoi(scaledStoryPositions.map((d, i) => [
      ...d,
      storyProportions[i],
      i,
      slicedStories[i],
    ]))

    if (lastCells.current) {
      cells = cells.map(points => {
        const orientations = points.map((d, pointsIndex) => {
          const newPoints = pointsIndex ? [
            ...points.slice(pointsIndex),
            ...points.slice(0, pointsIndex),
          ] : points
          const lastCell = lastCells.current.filter(d => (d && d.site.originalObject[3] == points.site.originalObject[3]))[0] || []
          if (!lastCell) {
            return {
              points: _.times(points.length, () => points[0]),
              distance: 0,
            }
          }

          const difference = d3.sum(newPoints.map((d, index) => (
            distanceBetweenPoints(d, lastCell[index] || [])
          )))
          return {
            points: newPoints,
            difference,
          }
        })
        let bestOrientation = _.minBy(orientations, d => d.difference).points
        bestOrientation.site = points.site
        return bestOrientation
      })
    }
    lastCells.current = cells

    return {
      viewsPerStory, timeString, storyProportions, cells
    }
  }, [time])

  return (
    <div className="TrafficSourcesWindow" ref={ref}>

      <svg width={dimensions.width} height={dimensions.height}>
        <defs>
          <filter id="blur">
            {/* <feGaussianBlur in="SourceGraphic" stdDeviation="5" /> */}
            {/* <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="shadow" />
            <feOffset in="shadow" dx="3" dy="4" result="shadow" />
            <feColorMatrix in="shadow" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="shadow" />
            <feBlend in="SourceGraphic" in2="shadow" /> */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>


          </filter>
        </defs>

          <g style={{transform: `translate(${dimensions.marginLeft}px, ${dimensions.marginTop}px)`}}>
            <rect
              className="TrafficSourcesWindow__window"
              height={dimensions.boundedHeight}
              width={dimensions.boundedWidth}
            />

            <g className="TrafficSourcesWindow__polygons" filter="url(#blur)">
              {_.map(cells, (points, i) => (
                <path
                  className="TrafficSourcesWindow__polygon"
                  key={storyColors(points.site && points.site.originalObject[3])}
                  d={pointsToD(points)}
                  fill={storyColors(points.site && points.site.originalObject[3])}
                  stroke={storyColors(points.site && points.site.originalObject[3])}
                />
              ))}
            </g>
            <g className="TrafficSourcesWindow__polygons">
              {_.map(cells, (points, i) => (
                <path
                  className="TrafficSourcesWindow__polygon TrafficSourcesWindow__polygon--blank"
                  key={storyColors(points.site && points.site.originalObject[3])}
                  d={pointsToD(points)}
                />
              ))}
            </g>

        </g>
      </svg>

      {_.map(cells, points => {
        const storyIndex = points.site && points.site.originalObject[3]
        const story = points.site && points.site.originalObject[4] || {}
        return (
          <TrafficSourcesWindowStory
            key={story.id}
            story={story}
            storyIndex={storyIndex}
            views={viewsPerStory[story.id]}
            proportion={storyProportions[storyIndex]}
            position={getCenterOfPoints(points)}
            dimensions={dimensions}
            yScale={yScale}
            {...{time, timeString, xToCenterScale, scaledStoryPositions}}
          />
        )
      })}

    </div>
  )
}
const pointsToD = points => [
  "M",
  ...points.map(point => [
    point.join(",")
  ].join("L "))
].join(" ")
const getCenterOfPoints = points => {
  const xExtent = d3.extent(points, d => d[0])
  const yExtent = d3.extent(points, d => d[1])
  return [
    d3.mean(xExtent),
    d3.mean(yExtent),
  ]
}


const radiusScale = d3.scaleLinear()
  .domain([0, 1])
  .range([1, 90])
const TrafficSourcesWindowStory = ({ time, dimensions, story, storyIndex, views, yScale, xToCenterScale, proportion, position, scaledStoryPositions, radius }) => {
  // let x = xToCenterScale(proportion)
  // if (storyIndex % 2) {
  //   x = x * -1 + dimensions.boundedWidth
  // }
  // const y = yScale(proportion)
  // const [x, y] = scaledStoryPositions[storyIndex]
  const [x, y] = position

  return (
    <div className="TrafficSourcesWindowStory" style={{transform: `translate(${x}px, ${y}px)`}}>
      {/* <circle className="TrafficSourcesWindowStory__circle" r={r} /> */}
      { story.label }
      {/* <text className="TrafficSourcesWindowStory__label">{ story.label.slice(0, 20) }</text> */}
    </div>
  )
}

const Person = ({ id, x, y, fill }) => {
  return (
    <circle
      className="Person"
      cx={x}
      cy={y}
      r={3}
      fill={fill}
    />
  )
}


const distanceBetweenPoints = (p1, p2) => (
  Math.sqrt(
    (p1[0] - p2[0]) ** 2
    + (p1[1] - p2[1]) ** 2
  )
)

export const getOrdinal = d => {
  const t = d % 10;
  return (d % 100 / 10) === 1 ? "th" : t === 1 ? "st" : t === 2 ? "nd" : t === 3 ? "rd" : "th"
}