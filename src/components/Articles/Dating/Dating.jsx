import React, { useState, useMemo, useEffect, useRef } from "react"
import * as d3 from "d3"
import { countBy, times, identity } from "lodash"
import datingUrl from "./hcmst.csv"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"

import Link from "components/_ui/Link/Link"

import './Dating.scss';

const raceMapping = {
  "American Indian, Aleut, or Eskimo:": "Other, Non-Hispanic",
  "Asian or Pacific Islander": "Other, Non-Hispanic",
  "Black or African American": "Black, Non-Hispanic",
  "Other (please specify)": "Other, Non-Hispanic",
  "Refused": "",
  "White": "White, Non-Hispanic",
}
const singleFields = [ "S1", "S2", "S3", "ppgender", "ppethm", "ppeducat", "partyid7", "Q32", "Q32_2", "Q40", "Q40_2", "Q34", "w6_sex_frequency", "w6_identity", "Q25", "Q26", "Q27", ]
const fieldPairs = [
  ["Gender", "ppgender", "Q4", d => d.replace("[Partner Name] is ", "")], // gender
  ["Race", "ppethm", "Q6B", d => raceMapping[d] || ""], // race
  ["Political Party", "partyid7", "Q12"], // party
]
const numOfIterationsInAnimation = 130
const Dating = () => {
  const [data, setData] = useState([])
  // const [group, setGroup] = useState("S1")
  const [groupIndex, setGroupIndex] = useState(1)
  const currentGroup = useRef()
  const iterationsToGo = useRef(0)
  const [ref, dms] = useChartDimensions()
  const canvas = useRef()
  const lastRaf = useRef()
  const targetPositions = useRef([])
  const cachedPositions = useRef([])
  const group = fieldPairs[groupIndex][1]
  const partnerGroup = fieldPairs[groupIndex][2] || group
  const partnerGroupTransform = fieldPairs[groupIndex][3] || identity

  useEffect(() => {
    (async () => {
      const dating = await d3.csv(datingUrl)
      setData(dating)
    })()
  }, [])

  const groupedData = useMemo(() => (
    countBy(data, group)
  ), [data, group])

  const groupNames = Object.keys(groupedData)

  const uncollidedHubPositions = groupNames.map((groupName, i) => {
    return [
      dms.width / 2,
      0,
      rFromPos(spiralPositions[groupedData[groupName]]), // r
    ]
  })

  const hubPositions = uncollideCircles(uncollidedHubPositions, dms)

  const render = () => {
    const context = canvas.current.getContext('2d')
    context.clearRect(0, 0, dms.width, dms.height)

    const newPositions = targetPositions.current.map(([x, y, color, color2], index) => ([
      d3.interpolate(
        x,
        (cachedPositions.current[index] || {})[0]
          || dms.width / 2,
      )(
        getIterationProgress(iterationsToGo.current, index)
      ),
      d3.interpolate(
        y,
        (cachedPositions.current[index] || {})[1]
          || dms.height / 2,
      )(
        getIterationProgress(iterationsToGo.current, index)
      ),
      color,
      color2,
    ]))
    newPositions.forEach(([ x, y, color, color2 ]) => {
      drawHeart(context, [x, y], 3, color, color2)
    })

    hubPositions.forEach(({ x, y, r }, i) => {
      const name = groupNames[i] || `" "`
      const shiftedX = x - name.length * 2
      drawHeart(context, [shiftedX - 5, y - r - 10 - 3], 6, groupColors[i], "white")
      context.font = '13px sans-serif bold';
      context.fillStyle = "black"
      context.fillText(name, shiftedX, y - r - 10)
    })
    cachedPositions.current = newPositions
  }

  const setUpUpdates = () => {
    if (!data.length) return
    if (!hubPositions || !hubPositions.length) return

    let dotsInLocations = {}

    targetPositions.current = data.map(d => {
      const locationIndex = groupNames.indexOf(d[group])
      const pairLocationIndex = groupNames.indexOf(partnerGroupTransform(d[partnerGroup]))
      const indexInLocation = (dotsInLocations[locationIndex] || 0) + 1
      const spiralOffset = spiralPositions[indexInLocation]

      dotsInLocations[locationIndex] = indexInLocation
      const color = groupColors[locationIndex]
      const color2 = groupColors[pairLocationIndex]

      return [
        hubPositions[locationIndex].x + spiralOffset[0],
        hubPositions[locationIndex].y + spiralOffset[1],
        color,
        color2,
      ]
    })

    iterationsToGo.current = numOfIterationsInAnimation
    currentGroup.current = group

    if (lastRaf.current) cancelAnimationFrame(lastRaf.current)

    const tick = () => {
      iterationsToGo.current -= 1
      if (currentGroup.current != group) return
      if (iterationsToGo.current <= 0) return

      render()
      lastRaf.current = requestAnimationFrame(tick)
    }
    tick()
  }

  if (
    !currentGroup.current // on init
    || currentGroup.current != group // on update
  ) {
    setUpUpdates()
  }

  return (
    <div className="Dating">
      <div className="Dating__viz" ref={ref}>
        <canvas
          width={dms.width}
          height={dms.height}
          ref={canvas}
        />
      </div>

      <div className="Dating__content">
        <h1>Dating survey</h1>
        <h6>Left side = surveyee, right side = partner</h6>
        <select defaultValue={groupIndex}
            onChange={e => setGroupIndex(e.target.value)}>
          {fieldPairs.map(([d], i) => (
            <option value={i}>{ d }</option>
          ))}
        </select>
        {groupNames.map((name, index) => (
          <div className="Dating__group" key={name} style={{
            color: groupColors[index]
          }}>
            { name || `" "` }
          </div>
        ))}
        <p className="Dating__note">
          Using data from <Link to="https://data.stanford.edu/hcmst2017">How Couples Meet and Stay Together 2017</Link>
        </p>
      </div>
    </div>
  )
}

export default Dating


const groupColors = ["#0fb9b1", "#778beb", "#e77f67", "#FDA7DF", "#cf6a87", "#58B19F", "#A3CB38", "#786fa6", "#4b7bec", "#778ca3"]

const getSpiralPositions = (n=3000) => {
  let angle = 0
  return times(n, i => {
    const radius = Math.sqrt(i + 1) * 4.6
    angle += Math.asin(1 / radius) * 8.2
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
    ]
  })
}
const spiralPositions = getSpiralPositions()


const drawHeart = (context, [x, y], radius=3, color="black", color2) => {
  const heartRX = radius * 1.3
  const heartRY = radius

  // left side
  context.moveTo(x + 0.2, y)
  context.beginPath()
  context.moveTo(x + 0.2, y)
  context.quadraticCurveTo(
    x + 0.2,           y - heartRY,
    x - heartRX * 0.8, y - heartRY
  )
  context.quadraticCurveTo(
    x - heartRX * 1.5, y - heartRY / 2,
    x + 0.2,           y + heartRY
  )
  context.fillStyle = color
  context.fill()

  // right side
  context.moveTo(x - 0.2, y)
  context.beginPath()
  context.moveTo(x - 0.2, y)
  context.quadraticCurveTo(
    x - 0.2,           y - heartRY,
    x + heartRX * 0.8, y - heartRY
  )
  context.quadraticCurveTo(
    x + heartRX * 1.5, y - heartRY / 2,
    x - 0.2,           y + heartRY
  )
  context.fillStyle = color2 || color
  context.fill()
}

const getIterationProgress = (iterationsLeft, index) => (
  d3.easeSinInOut(
    Math.max(0,
      Math.min(1,
        iterationsLeft / numOfIterationsInAnimation
          + (index / 30000) // slight stagger
      ),
    )
  )
)

const rFromPos = ([x, y]) => (
  Math.sqrt(
    Math.pow(x, 2)
    + Math.pow(y, 2)
  )
)

const uncollideCircles = (circles, dms) => {
  var simulation = d3.forceSimulation(circles)
    .force("x", d3.forceX(([x]) => x).strength(0.2))
    .force("y", d3.forceY(dms.height / 2).strength(0.2))
    .force("collide", d3.forceCollide(([x, y, r]) => r + 19))
    .force("center", d3.forceCenter(
        dms.width / 2,
        dms.height / 2,
    ))
    .stop()

  times(10, () => simulation.tick())

  return simulation.nodes().map((d, i) => ({
    ...d,
    r: circles[i][2],
  }))
}

// const uncollideCircles = (circles, dms) => {
//   const children = circles.map(([x, y, r]) => ({
//     x,
//     y,
//     value: r * 3,
//     children: null,
//   }))
//   const pack = d3.pack()
//     .size([dms.width, dms.height])
//     .padding(2)(
//     d3.hierarchy({name: "root", children})
//         .sum(d => d.value)
//         // .sort((a, b) => b.size - a.size)
//   )

//   const nodes = pack.children.map(({x, y, r}) => ({
//     x, y, r
//   }))
//   console.log(nodes)

//   return nodes
// }