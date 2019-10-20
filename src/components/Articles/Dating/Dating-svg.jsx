import { useState, useMemo, usePrevious, useEffect, useRef } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import { csv, json, timeFormat, scaleLinear, randomNormal } from "d3"
import * as d3 from "d3"
import {useSpring, useSprings, animated, config} from 'react-spring'

import classNames from "classnames"
import { uniq, uniqueId, countBy, times } from "lodash"
import { useInterval } from 'utils/utils.js';
import datingUrl from "./hcmst.csv"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"

import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import Button from "components/_ui/Button/Button"

import './Dating.scss';

const fields = [
  "S1",
  "S2",
  "S3",
  "ppgender",
  "ppethm",
  "ppeducat",
  "partyid7",
  "Q32",
  "Q32_2",
  "Q40",
  "Q40_2",
  "Q34",
  "w6_sex_frequency",
  "w6_identity",
  "Q25",
  "Q26",
  "Q27",
]
const Dating = () => {
  const [data, setData] = useState([])
  const [group, setGroup] = useState("S1")
  const [ref, dms] = useChartDimensions()

  useEffect(() => {
    (async () => {
      const dating = await csv(datingUrl)
      console.log(dating)
      setData(dating)
      // setCreditsById(creditsObect)
      // console.log()
      // _2 = currently single
    })()
  }, [])

  const groupedData = useMemo(() => (
    countBy(data, group)
  ), [data, group])

  const groupNames = Object.keys(groupedData)

  const positions = useMemo(() => {
    if (!data.length) return []


    const yScale = scaleLinear()
      .domain([-1, groupNames.length])
      .range([0, dms.height])
    // const basePositions = data.map(d => [
    //   dms.width / 2,
    //   yScale(groupNames.indexOf(d[group]))
    // ])

    let dotsInLocations = {}

    return data.map(d => {
      const locationIndex = groupNames.indexOf(d[group])
      const indexInLocation = (dotsInLocations[locationIndex] || 0) + 1
      const spiralOffset = spiralPositions[indexInLocation]
      // console.log(spiralOffset, dotsInLocations)
      dotsInLocations[locationIndex] = indexInLocation
      const color = groupColors[locationIndex]

      return [
        dms.width / 2 + spiralOffset[0],
        yScale(groupNames.indexOf(d[group])) + spiralOffset[1],
        color,
      ]
    })
    // var simulation = d3.forceSimulation(basePositions)
    //     .force("x", d3.forceX(dms.width / 2).strength(1.6))
    //     .force("y", d3.forceY(([x,y]) => y).strength(1))
    //     .force("collide", d3.forceCollide(5).strength(1))

    //     // .force("collide", rectCollide()
    //     //     .size([160, 90])
    //     // )
    //     // .force("radial", d3.forceRadial(12))
    //     // .force("charge", d3.forceManyBody())
    //     // .force("center", d3.forceCenter(
    //     //     dimensions.boundedWidth / 2,
    //     //     dimensions.boundedHeight / 2,
    //     // ))
    //     .stop()

    // times(200, () => simulation.tick())
    // return simulation.nodes()
  }, [data, group])
  console.log(positions[0])

  // const springs = useSprings(
  //   positions.length,
  //   positions.map(([x, y, color], i) => ({
  //     // config: config.slow,
  //     // config: {
  //     //   duration: 3000,
  //     // },
  //     // cx: x,
  //     // cy: y,
  //     to: async (next, cancel) => {
  //       await next({
  //         pos: [x, y],
  //       })
  //       await next({
  //         pos: [x, y],
  //         fill: color,
  //       })
  //     }
  //     // delay: i,
  //   }))
  // )
  // console.log(springs[0])

  return (
    <div className="Dating">

      <div className="Dating__viz" ref={ref}>
        <svg width={dms.width} height={dms.height}>
          {data.map((person, index) => (
            <Person
              key={person.CaseID}
              {...person}
              {...{ index, group, groupNames }}
              position={positions[index]}
              // spring={springs[index]}
            />
          ))}
        </svg>
      </div>

      <div className="Dating__content">
        <h1>Dating survey (svg)</h1>
        <select defaultValue={group}
            onChange={e => setGroup(e.target.value)}>
          {fields.map(d => (
            <option>{ d }</option>
          ))}
        </select>
        {groupNames.map((name, index) => (
          <div className="Dating__group" key={name} style={{
            color: groupColors[index]
          }}>
            { name }
          </div>
        ))}
        {/* <p>
          This is looking into the Harvard dataset
        </p> */}
      </div>
    </div>
  )
}

export default Dating


const groupColors = ["#0fb9b1", "#778beb", "#e77f67", "#FDA7DF", "#cf6a87", "#58B19F", "#A3CB38", "#786fa6", "#4b7bec", "#778ca3"]
const Person = ({ index, group, groupNames, position, spring, ...person }) => {

  // const [hasRendered, setHasRendered] = useState(false)

  // const style = useSpring({
  //   // config: config.slow,
  //   config: {
  //     duration: 3000,
  //   },
  //   delay: index * 0.0001,
  //   // // r: hasRendered ? 6 : 0,
  //   cx: position[0],
  //   cy: position[1],
  //   fill: color,
  //   // opacity: hasRendered ? 1 : 0,
  // })

  // useEffect(() => {
  //   setHasRendered(true)
  // }, [])
  return (
    <animated.circle
      className="Person"
      style={{fill: position[2]}}
      cx={position[0]}
      cy={position[1]}
      r="3"
    // {...style}
    // style={{
    //   transform: spring.pos && spring.pos.interpolate((x, y) => (
    //     `translate(${x}px, ${y}px)`
    //   )),
    //   fill: spring.fill,
    // }}
    // {...style}
    />
  )
}

// const increment = 5
// const getPositionInSpiral = index => ([
//   Math.cos(index) * increment * index,
//   Math.sin(index) * increment * index,
// ])

const getSpiralPositions = (n=3000) => {
  let angle = 0
  return times(n, i => {
    const radius = Math.sqrt(i + 1) * 2
    angle += Math.asin(1 / radius) * 6
    return [
      Math.cos(angle) * radius * 3,
      Math.sin(angle) * radius * 3,
    ]
  })
}
const spiralPositions = getSpiralPositions()