import { forwardRef, useState, useMemo, useEffect, useRef, memo } from 'react';
import React from "react"
// import { Extrude } from '@react-three/drei/Extrude'
import { useSpring, a } from 'react-spring/three'
import { extend, Canvas, useThree, useFrame } from 'react-three-fiber'
import { useInterval } from "utils/utils"
import FlipMove from 'react-flip-move';

import * as THREE from 'three'
import OrbitControls from "./OrbitControls"
import {range, csv, scaleLinear } from "d3"
import {countBy, fromPairs, kebabCase} from "lodash"
import dataUrl from "./data.csv"
import Icon from "components/_ui/Icon/Icon"

import './HypeCycle.scss';

const ordinalColors = [
  "#1289A7", "#778beb", "#22a6b3", "#5758BB", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3","#12CBC4",
];
const yearsToMainstreamInfo = [
  {slug: "LT2", label: "Less than 2 years", color: "#e77f67",},
  {slug: "2T5", label: "Two to five years", color: "#cf6a87",},
  {slug: "5T10", label: "Five to ten years", color: "#778beb",},
  {slug: "GT10", label: "Greater than 10 years", color: "#786fa6",},
  {slug: "UNDF", label: "No time scale specified (1995-1998)", color: "#778ca3",},
  {slug: "INTP", label: "Interpolated values", color: "#778ca3",},
]
const yearsToMainstreamColorMap = fromPairs(yearsToMainstreamInfo.map(d => [
  d.slug, d.color
]))

// LT2 - Less than 2 years
// 2T5 - Two to five years
// 5T10 - Five to ten years
// GT10 - Greater than 10 years
// UNDF - No time scale specified (1995-1998)
// INTP - Interpolated values
// const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const categories = [ "Artificial Intelligence", "Human-Computer Interface", "Methodology", "Software Architecture", "Communications", "Networking Technology", "Mobile Technology", "Computer Architecture", "Information Technology", "Platforms", "Web Technology", "Cyber Security", "Financial Technology", "Display Technology", "Wireless Technology", "Analytics", "Energy Technology", "Sensing/Tracking", "Physical Actuation", "Manufacturing", "Vehicle Technology" ]
const categoryColors = fromPairs(categories.map((category, i) => [
  category, ordinalColors[i % ordinalColors.length]
]))

const curveDepth = 9
const curveWidth = 1

const years = range(1995, 2020)

const HypeCycle = () => {
  const [data, setData] = useState([])
  const [isPlaying, setIsPlaying] = useState(true)
  const [yearIndex, setYearIndex] = useState(0)
  const [hoveredDot, setHoveredDot] = useState(null)
  const [showingCategories, setShowingCategories] = useState(categories)

  const incrementYear = () => {
    let newYearIndex = yearIndex + 1
    if (!years[newYearIndex]) {
      setIsPlaying(false)
    } else {
      setYearIndex(newYearIndex)
    }
  }
  useInterval(incrementYear, isPlaying ? 1500 : null)
  const year = years[yearIndex]

  const loadData = async () => {
    const res = await csv(dataUrl)
    const zScale = scaleLinear()
      .domain([-2, res.length + 2])
      .range([0, curveDepth])
    // const categories = [...new Set(res.map(d => d["Technology Category"]))]
    const data = res.map((d, i) => {
      let hasHadIndex = false
      const pointIndex = years.map(year => {
        const percent = d[`dist${year}`]
        if (!percent || !Number.isFinite(+percent)) return hasHadIndex ? 100 : 0
        const index = Math.round(+percent * 100)
        hasHadIndex = true
        return index
      })
      return {
        name: years.map(year => d[`name${year}`]).filter(d => d)[0] || "",
        pointIndex,
        z: zScale(i),
        names: years.map(year => d[`name${year}`]),
        time: years.map(year => d[`time${year}`]),
        category: d["Technology Category"],
        color: categoryColors[d["Technology Category"]],
        i,
      }
    })
    setData(data)
  }
  useEffect(() => {
    loadData()
  }, [])

  const filteredDots = useMemo(() => (
    data.filter(d => showingCategories.includes(d["category"]))
  ), [data, showingCategories])

  useEffect(() => {
    if (!hoveredDot) return
    if (!filteredDots.filter(d => (
      d["pointIndex"][yearIndex] > 0 && d["pointIndex"][yearIndex] < 100
    )).find(d => d["name"] == hoveredDot)) {
      setHoveredDot(false)
    }
  }, [filteredDots, yearIndex])

  return (
    <div className={`HypeCycle`}>
      <Timeline {...{yearIndex, setYearIndex, isPlaying, setIsPlaying}} />
      <List data={filteredDots} {...{yearIndex, hoveredDot, setHoveredDot}} />
      <Categories data={filteredDots} {...{yearIndex, showingCategories, setShowingCategories}} />

      {!!hoveredDot && (
        <div className="HypeCycle__tooltip">
          {hoveredDot}
        </div>
      )}

      <div className="HypeCycle__contents">
        <Wrapper data={filteredDots} {...{year, yearIndex, showingCategories, hoveredDot, setHoveredDot}} />
      </div>
      <div className="HypeCycle__attr">
        This is a visualization of how new technologies traverse <a href="https://www.gartner.com/en/documents/3887767" target="_blank" rel="noopener">the Gartner Hype Cycle</a>.
        <br />
        Data and original idea from <a href="https://vimeo.com/464835556" target="_blank" rel="noopener">Mark Mine</a>.
      </div>
    </div>
  )
}

export default HypeCycle

const camera = {
  fov: 75, near: 0.1, far: 1000,
  "position.z": 2,
}
const HoveredDot = ({ hoveredDot, data, yearIndex, setHoveredDotPosition }) => {
  const { camera, size } = useThree()

  useFrame(() => {
    if (!hoveredDot) return
    const point = data.find(d => d["name"] == hoveredDot)
    if (!point) return
    const [x, y] = curvePoints[Math.round(point["pointIndex"][yearIndex])] || []
    if (!x || !y) return
    let p = new THREE.Vector3(x, y, point["z"]);
    let vector = p.project(camera);

    vector.x = (vector.x + 1) / 2 * size.width;
    vector.y = -(vector.y - 1) / 2 * size.height;
    vector.z = 0

    setHoveredDotPosition([vector.x, vector.y]);
  })
  return null
}
const Controls = () => {
  const { camera, gl, invalidate } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  useEffect(() => void ref.current.addEventListener('change', invalidate), [])
  return <orbitControls ref={ref} args={[camera, gl.domElement]} />
}
// function Controls(props) {
//   const ref = useRef()
//   const { camera } = useThree()
//   // useFrame(() => ref.current.obj.update())
//   return <orbitControls ref={ref} args={[camera]} {...props} />
// }

extend({ OrbitControls })

function Wrapper({ vertices, color, year, yearIndex, data, showingCategories, hoveredDot, setHoveredDot, ...props }) {
  const onHoverDot = (d) => {
    setHoveredDot(d["name"])
  }

  const [hoveredDotPosition, setHoveredDotPosition] = useState([])

  return (
    <Canvas camera={camera} {...props}>
      {/* <HoveredDot {...{hoveredDot, data, yearIndex, setHoveredDotPosition}} /> */}
      <Controls />
      <group>

        <pointLight
          position={[0,0,4]}
          color="#fff"
          intensity={0.3}
        />
        <pointLight
          position={[-2,0,-2]}
          color="#fff"
          intensity={0.3}
        />
        <pointLight
          position={[3,3,3]}
          color="#12CBC4"
          intensity={0.1}
        />
        <ambientLight color="0xFFC312" intensity={0.4} />
        <ambientLight color="#5758BB" intensity={0.4} />

        <group position={[-curveDepth / 2, -curveDepth * 0.4, -curveDepth]}>
          {data.map(d => (
            <Point
              key={d["name"]}
              pointIndex={d["pointIndex"][yearIndex]}
              time={d["time"][yearIndex]}
              name={d["names"][yearIndex] || d["name"]}
              color={d["color"]}
              z={d["z"]}
              isHovered={hoveredDot == d["name"]}
              onHover={(e) => onHoverDot(d, e)}
            />
          ))}

          <Curve />
        </group>
      </group>
    </Canvas>
  )
}

const extrudeSettings = {
  steps: 2,
  depth: curveDepth,
  bevelEnabled: true,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 10,
  curveSegments: 60,
}

const curve = new THREE.Shape()

const width = curveWidth

curve.moveTo(0, 0)
curve.bezierCurveTo(...[
  1.185, 0, // cp1
  1.226, 5.496, // cp2
  2.121, 5.496 // end
].map(d => d * width))
curve.bezierCurveTo(...[
  3.017, 5.496, // cp1
  2.493, 1.075, // cp2
  3.939, 1.075, // end
].map(d => d * width))
curve.bezierCurveTo(...[
  5.386, 1.075, // cp1
  6.928, 3.113, // cp2
  10, 3.113 // end
].map(d => d * width))
curve.lineTo(...[
  10, 0
].map(d => d * width))
const curvePoints = range(0, 1.01, 0.01).map(d => {
  const point = curve.getPointAt(d)
  if (!point) return null
  return [point.x, point.y]
})


const Curve = () => (
  <mesh>
    <extrudeGeometry attach="geometry" args={[curve, extrudeSettings]} />
    <meshLambertMaterial
      attach="material"
      color="#fff"
      transparent="true"
      opacity="0.5"
      side={THREE.DoubleSide}
    />
  </mesh>
)

const pointGeometry = new THREE.SphereGeometry(0.2, 32, 32)
// const pointMaterial = new THREE.MeshLambertMaterial({color: "#45aeb1", side: THREE.DoubleSide})
const Point = ({ name, color, pointIndex=0, z, time, isHovered, onHover }) => {

  const {pointIndex: pointIndexTweened} = useSpring({
    config: {
      mass: 10, tension: 30, friction: 34,
    },
    pointIndex,
  })

  const {colorTweened} = useSpring({
    config: {
      mass: 1, tension: 30, friction: 34,
    },
    colorTweened: pointIndex > 0 && pointIndex < 100 ? color || "#fff" : "#fff",
  })

  return (
    <a.group
      position-x={pointIndexTweened.interpolate(d => (curvePoints[Math.round(d)] || [])[0])}
      position-y={pointIndexTweened.interpolate(d => (curvePoints[Math.round(d)] || [])[1])}
      position-z={z}
      onPointerOver={onHover}
    >
      <mesh geometry={pointGeometry}>
        <a.meshLambertMaterial attach="material" color={isHovered ? "#000" : colorTweened} />
      </mesh>
    </a.group>
  )
}

const List = memo(({ yearIndex, data, hoveredDot, setHoveredDot }) => {
  const [isHovering, setIsHovering] = useState(false)
  const wrapperElement = useRef()

  useEffect(() => {
    if (isHovering) return
    if (!wrapperElement.current) return
    if (!hoveredDot) return
    const elem = wrapperElement.current.getElementsByClassName(`item--${kebabCase(hoveredDot)}`)[0]
    if (!elem) return
    elem.scrollIntoView()
  }, [hoveredDot])

  const sortedItems = useMemo(() => (
    data.map(d => ({
      name: d["name"],
      value: d["pointIndex"][yearIndex],
      // color: yearsToMainstreamColorMap[d["time"][yearIndex]],
      color: d["color"],
      category: d["category"],
    }))
    // .filter(d => d["value"] && d["value"] < 100)
    .sort((a,b) => a.value - b.value)
  ), [yearIndex, data])

  return (
    <div ref={wrapperElement} className="HypeCycle__list" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(true)}>
      <FlipMove>
        {sortedItems.map(({ name, color, value, category }) => (
          <ListItem
            key={name}
            isHovered={hoveredDot == name}
            onHover={() => setHoveredDot(name)}
            {...{name, color, value, category}}
          />
        ))}
      </FlipMove>
    </div>
  )
})

const ListItem = forwardRef(({ name, color, value, category, isHovered, onHover }, ref) => (
  <div ref={ref} className={`item--${kebabCase(name)} HypeCycle__list__item HypeCycle__list__item--is-${!value || value >= 100 ? "hidden" : "showing"} HypeCycle__list__item--is-${isHovered ? "hovered" : "not-hovered"}`} style={{
    "--color": color,
  }} onMouseEnter={onHover}>
    <h6 className="HypeCycle__list__item__category">
      { category }
    </h6>
    {name}
  </div>
))

const Timeline = memo(({ yearIndex, setYearIndex, isPlaying, setIsPlaying}) => {
  return (
    <div className="HypeCycle__years">
      <button className="HypeCycle__years__toggle" onClick={() => setIsPlaying(!isPlaying)}>
        <Icon name={isPlaying ? "pause" : "play"} />
      </button>
      {years.map((year, i) => (
        <button className={`HypeCycle__years__item HypeCycle__years__item--is-${i == yearIndex ? "selected" : "unselected"}`} key={year} onClick={() => {
          setYearIndex(i)
          setIsPlaying(false)
        }}>
          <div className="HypeCycle__years__item__text">
            { year }
          </div>
        </button>
      ))}
    </div>
  )
})

const Categories = ({ data, yearIndex, showingCategories, setShowingCategories }) => {
  const counts = useMemo(() => (
    countBy(data.filter(d => (
      d["pointIndex"][yearIndex] > 0 && d["pointIndex"][yearIndex] < 100
    )), "category")
  ), [data, yearIndex])

  const sortedCategories = useMemo(() => (
    [...categories].sort((a,b) => counts[b] ? counts[b] > counts[a] ? 2 : 1 : b > a ? -100 : -50)
  ), [counts])

  return (
    <div className="HypeCycle__categories">
      <FlipMove>
        {sortedCategories.map(category => (
          <div className={`HypeCycle__categories__item HypeCycle__categories__item--is-${showingCategories.includes(category) ? "showing" : "not-showing"} HypeCycle__categories__item--is-${counts[category] ? "visible" : "not-visible"}`} key={category} style={{
            color: categoryColors[category]
          }} onClick={() => {
            const isShowing = showingCategories.includes(category)
            if (!isShowing || showingCategories.length > 1) {
              setShowingCategories([category])
            } else {
              setShowingCategories(categories)
            }
          }}>
            { category }
            <div className="HypeCycle__categories__item__count">
              { counts[category] }
            </div>
          </div>
        ))}
      </FlipMove>
    </div>
  )
}