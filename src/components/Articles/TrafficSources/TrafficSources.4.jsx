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
import stories from "./stories.json"
import { useInterval } from "utils/utils"
console.log(stories)

import './TrafficSources.scss';

const slicedStories = stories.slice(0, 10)
const storyColors = d3.scaleSequential()
  .domain([0, slicedStories.length])
  .interpolator(d3.interpolateSinebow)
const rawTimeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const timeAccessor = d => d3.timeParse("%Y-%m-%dT%H:%M:%SZ")(d[0])
const viewsAccessor = d => d && d[1]

const firstTime = d3.timeMinute.offset(timeAccessor(stories[0].timeline[0]), 60 * 24 * 2)
const lastTime = timeAccessor(_.last(stories[0].timeline))
const formatDateTime = d3.timeFormat("%A, %B %-d, %-I:%M %p")
const TrafficSources = () => {
  const [time, setTime] = useState(firstTime)

  useInterval(() => {
    // setTime(d3.timeMinute.offset(time, 15))
    setTime(d3.timeMinute.offset(time, 15))
  }, time < lastTime ? 300 : null)

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

        <TrafficSourcesBubbles time={time} />
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


const storyAngles = _.fromPairs(
  slicedStories.map((story, index) => [
    index,
    index * (360 / (slicedStories.length)),
  ])
)
const numberOfPeople = 200
// const angleScale = d3.scaleLinear()
//   .domain([0, maxViews])
//   .range([0, (360 / sites.length) * 6])

// const distanceScale = d3.scaleLinear()
//   .domain([firstTime, lastTime])
//   .range([0, 1])
//   // .range(d3.range(0.1, 1, (1 - 0.1) / sites.length))

const formatTime = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ")

const yOffsetScale = d3.scaleLinear()
  .domain([0.55, 0.6])
  .range([0, 1])
  .clamp(true)

const TrafficSourcesBubbles = ({ time }) => {
  const [people, setPeople] = useState([])
  const [ref, dimensions] = useChartDimensions({
    height: 760,
    width: 760,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
    radius: 300,
  })

  const { storyCenters, storyCentersWider } = useMemo(() => {
    const storyCenters = _.fromPairs(
      slicedStories.map((story, index) => [
        index,
        getPointFromAngleAndDistance(index * (360 / (slicedStories.length)), dimensions.radius),
      ])
    )
    const storyCentersWider = _.fromPairs(
      slicedStories.map((story, index) => [
        index,
        getPointFromAngleAndDistance(index * (360 / (slicedStories.length)), dimensions.radius + 50),
      ])
    )

    return {
      storyCenters, storyCentersWider
    }
  }, [dimensions])


  const { viewsPerStory, timeString, parsedPeople } = useMemo(() => {
    const timeString = formatTime(time)
    const viewsPerStory = _.fromPairs(_.map(slicedStories, story => [
      story.id,
      viewsAccessor(story.timeline.filter(d => d[0] == timeString)[0] || {}) || null
    ]))
    const totalViews = d3.sum(_.values(viewsPerStory))
    const proportion = numberOfPeople / maxTotalViews
    let runningIndex = 0

    let storyBuckets = _.groupBy(people, d => d.storyIndex)
    console.log(storyBuckets)

    stories.forEach((story, storyIndex) => {
      const views = viewsPerStory[story.id]
      const numberOfPeopleNeeded = Math.round(proportion * views)
      const currentPeople = storyBuckets[storyIndex] || []
      if (numberOfPeopleNeeded > currentPeople.length) {
        storyBuckets[storyIndex] = [
          ...(storyBuckets[storyIndex] || []),
          ..._.times(numberOfPeopleNeeded - currentPeople.length, i => {
            runningIndex++

            // if (
            //   people[runningIndex - 1] && people[runningIndex - 1].storyIndex === storyIndex
            // ) return people[runningIndex - 1]

            const center = storyCenters[storyIndex]
            return {
              id: runningIndex,
              storyIndex,
              fill: storyColors(storyIndex),
              x: center.x,
              y: center.y,
            }
          })
        ]
      } else {
        storyBuckets[storyIndex] = (storyBuckets[storyIndex] || []).slice(0, numberOfPeopleNeeded)
      }
    })

    let parsedPeople = _.flatMap(_.values(storyBuckets))
    const totalNumberOfPeopleNeeded = Math.round(proportion * maxTotalViews)
    const numberOfPeopleForNoStory = totalNumberOfPeopleNeeded - parsedPeople.length
    parsedPeople = [
      ...parsedPeople,
      ..._.times(numberOfPeopleForNoStory, i => {
        runningIndex++

        // if (
        //   people[runningIndex - 1] && people[runningIndex - 1].storyIndex === null
        // ) return people[runningIndex - 1]

        return {
          id: runningIndex,
          storyIndex: null,
          fill: "#dadadd",
          x: 0,
          y: 0,
        }
      })
    ]

    const uncollidedPeople = getUncollidedDots(parsedPeople)
    setPeople(uncollidedPeople)

    return {
      viewsPerStory, timeString
    }
  }, [time])


  return (
    <div className="TrafficSourcesBubbles" ref={ref}>

      <svg width={dimensions.width} height={dimensions.height}>
          <g style={{transform: `translate(${dimensions.marginLeft}px, ${dimensions.marginTop}px)`}}>
            <g style={{transform: `translate(${dimensions.boundedWidth / 2}px, ${dimensions.boundedWidth / 2}px)`}}>
              <circle r={dimensions.radius} className="TrafficSourcesBubbles__center" />

              {_.map(slicedStories, (story, storyIndex) => (
                <TrafficSourcesStory
                  key={story.id}
                  story={story}
                  views={viewsPerStory[story.id]}
                  radius={dimensions.radius}
                  storyIndex={storyIndex}
                  position={storyCenters[storyIndex]}
                  {...{time, timeString}}
                />
              ))}

              {people.map(person => (
                <Person
                  key={person.id}
                  {...person}
                />
              ))}
          </g>
        </g>
      </svg>

      {_.map(slicedStories, (story, storyIndex) => {
        const center = storyCentersWider[storyIndex]
        const xOffset = (dimensions.radius + 50 - Math.abs(center.y)) / 10 * (center.x < 0 ? -1 : 1)

        return (
          <div className="TrafficSourcesBubbles__story-label" style={{
            // color: storyColors(storyIndex),
            transform: `translate(calc(${center.x + xOffset}px - 50%), calc(${center.y}px - 50%))`,
            textAlign: center.x > dimensions.radius ? "right" :
              center.x < 0 ? "left" :
              "middle",
          }}>
            { story.label }
          </div>
        )
      })}

    </div>
  )
}

const TrafficSourcesStory = ({ time, story, storyIndex, views, position, radius }) => {

  const fill = "#dadadd"

  return (
    <g className="TrafficSourcesStory" style={{transform: `translate(${position.x}px, ${position.y}px)`}}>
      <circle className="TrafficSourcesStory__circle" r={viewsCirclesScale(views)} fill={fill} />
    </g>
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

const Site = ({ site, time, timeString, radius, placement }) => {

  const { angle, fill, center } = useMemo(() => {
    const angle = degreesToRadians(siteAngles[site])

    const fill = siteColors[site]
    const center = getPointFromAngleAndDistance(angle, radius)

    return {
      angle, fill, center
    }
  }, [])

  return (
    <g key={site} style={{transform: `translate(${center.x}px, ${center.y}px)`}}>
      <circle
        className="TrafficSourcesDiagram__circle"
        r={viewsScale(views)}
        fill={fill}
      />
    </g>
  )
}


function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180)
}




function getUncollidedDots(dots, r=6) {
  let newDots = []
  dots.forEach(dot => {
    let {x,y} = dot

    let doesCollideWithAny = _.some(newDots.map(d => doesCircleCollide(d, {x, y}, r)))
    while (doesCollideWithAny) {
      x += (Math.random() - 0.5) * r
      y += (Math.random() - 0.5) * r
      doesCollideWithAny = _.some(newDots.map(d => doesCircleCollide(d, {x, y}, r)))
      // doesIntersectWithAny = _.some(dots.map(d => doesCircleCollide(d, {x, y}, r)))
    }

    newDots.push({
      ...dot,
      x,
      y,
    })
  })

  return newDots
}

function doesCircleCollide(dot1, dot2, r) {
  const xDelta = dot1.x - dot2.x
  const yDelta = dot1.y - dot2.y
  const h = Math.sqrt(xDelta ** 2 + yDelta ** 2)
  return h < r
}