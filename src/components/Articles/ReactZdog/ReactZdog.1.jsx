import React, { useState, useEffect, useRef, useMemo } from "react"
import { Illustration, Anchor, Ellipse, Shape, useRender } from 'react-zdog'
import { a, useSpring } from 'react-spring'
import _ from "lodash"
import * as d3 from "d3"

import "./ReactZdog.scss"

const TAU = Math.PI * 2
const ReactZdog = () => {
    return (
        <div className="ReactZdog">
            <Illustration zoom={60}>
                <Ellipse diameter={25} rotate={{ x: -TAU / 3 }} translate={{ y: 15, z: -100 }} stroke={4} color="#fff" fill />
                <Dogs />
            </Illustration>
        </div>
    )
}


export default ReactZdog


const AnimShape = a(Shape)
const AnimAnchor = a(Anchor)
const AnimEllipse = a(Ellipse)

const columns = 4
const rows = 3
const spacing = 4
const numberOfDogs = columns * rows


let dogs = _.times(numberOfDogs, {})
const Dogs = () => {

  let group = useRef()
  dogs = _.map(dogs, (dog, i) => ({
    ...dog,
    ref: useRef(),
    position: {
      x: (-(rows / 2) + (i % rows)) * spacing,
      y: (-(columns / 2) + Math.floor(i / columns)) * (spacing),
      // x: getPointFromAngleAndDistance(i * (360 / 8), 3.5).x,
      // y: getPointFromAngleAndDistance(i * (360 / 8), 3.5).y,
    },
    // color: colorScale(Math.random()),
    color: _.sample([
      "#dadada", "#e1b12c", "#40739e", "#a5b1c2", "#4b6584", "#22a6b3", "#c7ecee", "#686de0"
    ]),
  }))

  return (
    <group ref={group}>
      {_.map(dogs, (dog, i) => (
        <group ref={dog.ref}  key={i}>
          <Dog {...dog} />
        </group>
      ))}
    </group>
  )
}


const colorScale = d3.scaleLinear()
  .domain([0,1])
  .range(["#e1b12c", "#40739e"])

function Dog({ color, position }) {
  // Change motion every second
  const [up, setUp] = useState(true)
  useEffect(() => void setInterval(() => setUp(previous => !previous), 500), [])
  // Turn static values into animated values
  const { rotation, size } = useSpring({
    size: up ? 1.2 : 0.2,
// : up ? '#fff' : '#45aeb1',
    rotation: up ? 0 : Math.PI
  })
  // useRender allows us to hook into the render-loop
  const group = useRef()
  let time = 0
  useRender(() => (
    group.current.rotate.y = Math.cos((time += 0.1) / TAU)
  ))
  return (
    <Shape ref={group}  stroke={0} color="#747B9E">
      <AnimAnchor rotate={rotation.interpolate(r => ({ x: TAU / 18 + -r / 40 }))}>
          <AnimShape stroke={0} translate={position} color={color}>
            <DogHead color={color} />
            <DogNose color={color} />
            <DogEyes color={color} />
            <DogEars color={color} />
          </AnimShape>
      </AnimAnchor>
    </Shape>
  )
}


const DogHead = ({ color }) => (
    <Shape path={[{ z: -0.1 }, { z: 0.1 }]} color={color} stroke={2} />
)

const DogNose = ({ color }) => {
  const {position, noseLength, noseballRadius} = useMemo(() => {
    const position = { y: d3.randomNormal(0.3, 0.1)(), z: d3.randomNormal(0.3, 0.1)()}
    const noseLength = d3.randomNormal(0.6, 0.1)()
    const noseballRadius = d3.randomNormal(0.5, 0.05)()
    return {position, noseLength, noseballRadius}
  }, [])

  return (
    <Shape translate={position} stroke={0}>
      <Shape stroke={noseLength * 2} path={[{ z: 0.3 }, { z: 0.7 }]} color={color} />
      <Shape stroke={noseballRadius} path={[{ y: -0.1, z: noseLength * 1.8 }]} color="#2f3640" />

      <Ellipse
        diameter={0.44}
        quarters={1}
        translate={{ y: 0.3, z: noseLength * 1.3 }}
        rotate={{ x: -TAU / 10, z: TAU / 2.7 }}
        color="#2f3640"
        stroke={0.07}
      />
    </Shape>
  )
}

const DogEyes = ({ color }) => {
  const {
    eyeRadius, eyeBallRadius, eyeSpeckRadius, eyebrowRadius, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ
  } = useMemo(() => {
    const eyeRadius = d3.randomNormal(0.5, 0.05)()
    const eyeBallRadius = eyeRadius * d3.randomNormal(0.6, 0.1)()
    const eyeSpeckRadius = d3.randomNormal(0.02, 0.005)()
    const eyebrowRadius = d3.randomNormal(0.16, 0.1)()
    const eyebrowRotation = d3.randomNormal(0, 0.6)()
    const offset = d3.randomNormal(0.55, 0.05)()
    const eyeballX = d3.randomNormal(0, 0.05)()
    const eyeballY = -d3.randomNormal(0, 0.05)()

    const groupY = -d3.randomNormal(0.36, 0.1)()
    const groupZ = d3.randomNormal(0.5, 0.05)()
    return {
      eyeRadius, eyeBallRadius, eyeSpeckRadius, eyebrowRadius, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ, groupY, groupZ
    }
  }, [])

  return (
    <Shape translate={{ y: groupY, z: groupZ }} stroke={0}>
      {_.times(2, i => (
        <Shape key={i} translate={{ x: offset * (i ? 1 : -1) }} stroke={0}>
          <Shape stroke={eyeRadius} color="#fff" />
          <Shape stroke={eyebrowRadius}
            path={[{ x: -0.1, z: -0.1 }, { x: 0.1, z: 0.1 }]}
            translate={{
              x: (eyebrowRotation > 0 ? 0.3 : -0.3) * (i ? 1 : -1),
              y: -0.2,
              z: eyebrowRotation > 0 ? -0.4 : -0.2
            }} color={color}
          />
          <Shape stroke={eyeBallRadius} translate={{
            x: eyeballX,
            y: eyeballY,
            z: (eyeRadius / 2) - (
                Math.abs(eyeballX) + Math.abs(eyeballY)
            ) * 0.9
            }} color="#353b48"
          />
          <Shape stroke={eyeSpeckRadius} translate={{
            x: eyeballX,
            y: eyeballY,
            z: (eyeRadius / 2) - (
                Math.abs(eyeballX) + Math.abs(eyeballY)
            ) * 0.9
            }} color="#fff"
          />
        </Shape>
      ))}
    </Shape>
  )
}

const DogEars = ({ color }) => {
  const {
    areDown, earRadius, earRotation, offset, groupY, groupZ
   } = useMemo(() => {
    const areDown = !!Math.round(Math.random())
    const earRadius = d3.randomNormal(areDown ? 0.5 : 0.5, 0.1)()
    const earRotation = d3.randomNormal(0, 2)()
    const offset = d3.randomNormal(areDown ? 1.1 : 0.9, 0.1)()
    const groupY = d3.randomNormal(0.5, 0.1)()
    const groupZ = d3.randomNormal(-0.2, 0.05)()

    return {
      areDown, earRadius, earRotation, offset, groupY, groupZ
    }
  }, [])

  return (
    <Shape translate={{ y: groupY, z: groupZ }} stroke={0}>
      {_.times(2, i => (
          <Shape
            key={i}
            stroke={earRadius}
            path={[
              { x: -0.05, y: areDown ? -0.05 : 0, z: -0.03 },
              { x:  0.05, y: areDown ?  0.05 : 0, z:  0.03 },
            ]}
            translate={{
              x: offset * (i ? -1 : 1),
              y: areDown ? -0.8 : 0,
            }}
            rotate={{
              z: areDown
                ? earRotation * i ?  1 : -1
                : earRotation * i ? -1 :  1
            }}
            color={color}
          />
      ))}
    </Shape>
  )
}

function getPointFromAngleAndDistance(angle, distance) {
  return {
    x: Math.round(Math.cos(angle * Math.PI / 180) * distance),
    y: Math.round(Math.sin(angle * Math.PI / 180) * distance),
  }
}