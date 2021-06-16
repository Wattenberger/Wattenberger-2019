import { forwardRef, useState, useMemo, useEffect, useRef, memo } from 'react';
import React from "react"
// import { Extrude } from '@react-three/drei/Extrude'
// import { Text } from '@react-three/drei/Text'
import { a } from 'react-spring/three'
import { extend, Canvas, useThree, useFrame } from 'react-three-fiber'
import { Text } from "troika-three-text";
import FlipMove from 'react-flip-move';

import * as THREE from 'three'
import OrbitControls from "./../HypeCycle/OrbitControls"
import {range, csv, scaleLinear } from "d3"
import {countBy, fromPairs, kebabCase} from "lodash"
import dataUrl from "./data.csv"

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
const yearsScale = scaleLinear()
  .domain([years[0], years.slice(-1)[0]])
  .range([0, curveDepth])

const HypeCycle = () => {
  const [data, setData] = useState([])
  const [hoveredDot, setHoveredDot] = useState(null)
  const [showingCategories, setShowingCategories] = useState(categories)

  const loadData = async () => {
    const res = await csv(dataUrl)
    const data = res.map((d, i) => {
      let hasHadIndex = false
      const pointIndex = years.map(year => {
        const percent = d[`dist${year}`]
        if (!percent || !Number.isFinite(+percent)) return hasHadIndex ? 100 : 0
        const index = Math.round(+percent * 100)
        hasHadIndex = true
        return index
      })
      const firstYearIndex = pointIndex.map((d, i) => [d, i]).filter(d => d[0])[0][1]

      let runningIndex = 0
      let points = []
      pointIndex.forEach((index, i) => {
        const [x, y] = curvePoints[index]
        const z = yearsScale(years[i])
        const newPoint = new THREE.Vector3(x, y, z)
        if (Math.abs(runningIndex - index) > 1) {
          absRange(runningIndex, index).map(index => {
            const newPoint = new THREE.Vector3(...curvePoints[index], z)
            points.push(newPoint)
          })
        }
        points.push(newPoint)
        runningIndex = index
      })
      const path = new THREE.CatmullRomCurve3(points)

      return {
        name: d["Unified Technology Name"],
        pointIndex,
        // z: zScale(i),
        names: years.map(year => d[`name${year}`]),
        time: years.map(year => d[`time${year}`]),
        category: d["Technology Category"],
        color: categoryColors[d["Technology Category"]],
        path,
        i,
        firstYearIndex,
      }
    })
    setData(data)
    setHoveredDot(data[0]["name"])
  }
  useEffect(() => {loadData()}, [])

  // const filteredDots = useMemo(() => (
  //   data.filter(d => showingCategories.includes(d["category"]))
  // ), [data, showingCategories])

  // useEffect(() => {
  //   if (!hoveredDot) return
  //   if (!filteredDots.filter(d => (
  //     d["pointIndex"][yearIndex] > 0 && d["pointIndex"][yearIndex] < 100
  //   )).find(d => d["name"] == hoveredDot)) {
  //     setHoveredDot(false)
  //   }
  // }, [filteredDots, yearIndex])

  const data3d = useMemo(() => (
    showingCategories.length == 1
      ? data.filter(d => showingCategories[0] == d["category"])
      : data.filter(d => d["name"] == hoveredDot)
  ), [hoveredDot, showingCategories.join(", ")])

  return (
    <div className={`HypeCycle`}>
      {/* <Timeline {...{yearIndex, setYearIndex, isPlaying, setIsPlaying}} /> */}
      <List {...{data, hoveredDot, setHoveredDot}} />
      <Categories {...{data, showingCategories, setShowingCategories}} />

      {!!hoveredDot && (
        <div className="HypeCycle__tooltip">
          {hoveredDot}
        </div>
      )}

      <div className="HypeCycle__contents">
        <Wrapper data={data3d} {...{showingCategories, hoveredDot, setHoveredDot}} />
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
// extend({ Text });

function Wrapper({ vertices, color, data, showingCategories, hoveredDot, setHoveredDot, ...props }) {
  const onHoverDot = (d) => {
    setHoveredDot(d["name"])
  }

  const [hoveredDotPosition, setHoveredDotPosition] = useState([])

  return (
    <Canvas camera={camera} pixelRatio={window.devicePixelRatio} {...props}>
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

        <mesh rotation-x={90 / 180 * Math.PI} position={[0, -curveDepth * 0.4, 0]}>
          <planeGeometry attach="geometry" args={[30, 30]} />
          <meshBasicMaterial attach="material" color="#fff" side={THREE.BackSide} />
        </mesh>

        {years.map((year, i) => !(i % 5) && (
          <Text
            key={year}
            position={[0, -curveDepth * 0.2, yearsScale(year) - curveDepth]}
            // position-x={-curveWidth / 2}
            // rotation-x={-90 / 180 * Math.PI}
            // position-x={-curveDepth / 2}
            text={year}
            // font="Arial"
            color="#292e31"
            fontSize="0.3"
            anchorX="right"
            anchorY="middle"
          >
            {/* <meshPhongMaterial attach="material" color="black" /> */}
          </Text>
        ))}

        <group position={[-curveDepth / 2, -curveDepth * 0.4, -curveDepth]}>
          {years.map(year => (
            <CurveLine
              key={year}
              z={yearsScale(year)}
            />
          ))}

          {data.map(d => (
            <Path
              key={d["name"]}
              path={d["path"]}
              color={d["color"]}
              isHovered={hoveredDot == d["name"] && showingCategories.length == 1}
              onHover={(e) => onHoverDot(d, e)}
            />
            // <Point
            //   key={d["name"]}
            //   pointIndex={d["pointIndex"][yearIndex]}
            //   time={d["time"][yearIndex]}
            //   name={d["names"][yearIndex] || d["name"]}
            //   color={d["color"]}
            //   z={d["z"]}
            //   isHovered={hoveredDot == d["name"]}
            //   onHover={(e) => onHoverDot(d, e)}
            // />
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

// const pointGeometry = new THREE.SphereGeometry(0.2, 32, 32)
// // const pointMaterial = new THREE.MeshLambertMaterial({color: "#45aeb1", side: THREE.DoubleSide})
// const Point = ({ name, color, pointIndex=0, z, time, isHovered, onHover }) => {

//   const {pointIndex: pointIndexTweened} = useSpring({
//     config: {
//       mass: 10, tension: 30, friction: 34,
//     },
//     pointIndex,
//   })

//   const {colorTweened} = useSpring({
//     config: {
//       mass: 1, tension: 30, friction: 34,
//     },
//     colorTweened: pointIndex > 0 && pointIndex < 100 ? color || "#fff" : "#fff",
//   })

//   return (
//     <a.group
//       position-x={pointIndexTweened.interpolate(d => (curvePoints[Math.round(d)] || [])[0])}
//       position-y={pointIndexTweened.interpolate(d => (curvePoints[Math.round(d)] || [])[1])}
//       position-z={ * 0.01z}
//       onPointerOver={onHover}
//     >
//       <mesh geometry={pointGeometry}>
//         <a.meshLambertMaterial attach="material" color={isHovered ? "#000" : colorTweened} />
//       </mesh>
//     </a.group>
//   )
// }

const Path = ({ path, color, isHovered, onHover }) => {
  const geometry = useMemo(() => {
    // const points = path.getPoints(250)
    // const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const geometry = new THREE.TubeGeometry( path, 120, 0.03, 60, true )
    return geometry
  }, [path])

      // var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

  return (
    <a.group
      onPointerOver={onHover}
    >
      <mesh geometry={geometry}>
        <a.lineBasicMaterial attach="material" color={isHovered ? "#000" : color} />
      </mesh>
    </a.group>
  )
}

const path = new THREE.CatmullRomCurve3(curvePoints.map(d => (
  new THREE.Vector3(...d, 0)
)))
const geometry = new THREE.TubeGeometry( path, 120, 0.01, 60, true )
const CurveLine = ({ z }) => {
  return (
    <group position-z={z}>
      <mesh geometry={geometry}>
        <lineBasicMaterial attach="material" color="#fff" />
      </mesh>
    </group>
  )
}

const List = memo(({ data, hoveredDot, setHoveredDot }) => {
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
      // value: d["pointIndex"][yearIndex],
      // color: yearsToMainstreamColorMap[d["time"][yearIndex]],
      color: d["color"],
      category: d["category"],
    }))
    // .filter(d => d["value"] && d["value"] < 100)
    // .sort((a,b) => a["firstYearIndex"] - b["firstYearIndex"])
  ), [data])

  return (
    <div ref={wrapperElement} className="HypeCycle__list" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(true)}>
      <FlipMove>
        {sortedItems.map(({ name, color, category }) => (
          <ListItem
            key={name}
            isHovered={hoveredDot == name}
            onHover={() => setHoveredDot(name)}
            {...{name, color, category}}
          />
        ))}
      </FlipMove>
    </div>
  )
})

const ListItem = forwardRef(({ name, color, category, isHovered, onHover }, ref) => (
  <div ref={ref} className={`item--${kebabCase(name)} HypeCycle__list__item HypeCycle__list__item--is-${isHovered ? "hovered" : "not-hovered"}`} style={{
    "--color": color,
  }} onMouseEnter={onHover}>
    <h6 className="HypeCycle__list__item__category">
      { category }
    </h6>
    {name}
  </div>
))

const Categories = ({ data, showingCategories, setShowingCategories }) => {
  const counts = useMemo(() => (
    countBy(data, "category")
  ), [data])

  const sortedCategories = useMemo(() => (
    [...categories].sort((a,b) => counts[b] > counts[a] ? 1 : -1)
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

const absRange = (start, end) => (
  start < end ? range(start, end + 1) : range(end, start + 1).reverse()
)