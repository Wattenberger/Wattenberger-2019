import React, { useState, useEffect, useRef, useMemo } from "react"
import { Illustration, Anchor, Ellipse, Shape, Hemisphere, RoundedRect, useRender } from 'react-zdog'
import { a, useSpring } from 'react-spring'
import _ from "lodash"
import * as d3 from "d3"

import "./ReactZdog.scss"

const TAU = Math.PI * 2
const ReactZdog = () => {
    return (
        <div className="ReactZdog">
            <Illustration zoom={120}>
                <Ellipse diameter={1} rotate={{ x: -TAU / 3 }} translate={{ y: 2 }} stroke={1} color="#fff" fill />
                <Ellipse diameter={0.5} rotate={{ x: -TAU / 3 }} translate={{ x: -1, y: 2 }} stroke={1} color="#fff" fill />
                <Ellipse diameter={0.1} rotate={{ x: -TAU / 3 }} translate={{ x: 1, y: 2 }} stroke={1} color="#fff" fill />
                <Dogs />
            </Illustration>
        </div>
    )
}

export default ReactZdog


const AnimShape = a(Shape)
const AnimAnchor = a(Anchor)
const AnimEllipse = a(Ellipse)
const AnimHemisphere = a(Hemisphere)

const columns = 4
const rows = 3
const spacing = 4
const numberOfDogs = columns * rows


const colors = ["#dadada", "#e1b12c", "#40739e", "#a5b1c2", "#4b6584", "#22a6b3", "#c7ecee", "#686de0"]
let dogs = _.times(numberOfDogs, {})
const Dogs = () => {
  return (
    <group>
        <Dog />
    </group>
  )
}


const colorScale = d3.scaleLinear()
  .domain([0,1])
  .range(["#e1b12c", "#40739e"])

function Dog() {
  const [up, setUp] = useState(true)
  const [iteration, setIteration] = useState(0)
  useEffect(() => void setInterval(() => {
    setUp(previous => !previous)
    setIteration(iteration => iteration + 1)
  }, 1500), [])
  // Turn static values into animated values
  const { rotation, color, size } = useSpring({
    size: up ? 1.2 : 1.5,
    color: up ? _.sample(colors) : _.sample(colors),
    rotation: up ? 0 : Math.PI
  })

  const group = useRef()
  let time = 0
  useRender(() => (
    group.current.rotate.y = Math.cos((time += 0.3) / TAU) * 0.3
  ))

  return (
    <Shape ref={group} stroke={0}>
      <AnimAnchor rotate={rotation.interpolate(r => ({ x: TAU / 1 + r / 40 }))}>
          <AnimShape stroke={0}>
            <DogHead {...{color, iteration}} />
            <DogNose {...{color, iteration}} />
            <DogEyes {...{color, iteration}} />
            <DogEars {...{color, iteration}} />
          </AnimShape>
      </AnimAnchor>
    </Shape>
  )
}


const DogHead = ({ color }) => (
    <AnimShape path={[{ z: -0.1 }, { z: 0.1 }]} color={color} stroke={2} />
)

const DogNose = ({ color, iteration }) => {
  const {position, noseLength, noseballRadius} = useMemo(() => {
    const position = { y: d3.randomNormal(0.4, 0.1)(), z: d3.randomNormal(0.3, 0.1)()}
    const noseLength = d3.randomNormal(1.2, 0.1)()
    const noseballRadius = d3.randomNormal(0.5, 0.05)()
    return {position, noseLength, noseballRadius}
  }, [iteration])

  const anim = useSpring({
    noseLength,
    noseballRadius,
  })

  return (
    <Shape translate={position} stroke={0}>
      <AnimShape
        stroke={anim.noseLength}
        path={[{ z: 0 }, { z: 0.1 }]}
        color={color.interpolate(color => {
          return d3.color(color) ? d3.color(color).brighter(0.5).toString() : color
        })}
      />
      <AnimShape
        stroke={anim.noseballRadius}
        path={[{ y: -0.15, z: noseLength * 0.6 }]}
        color="#2f3640"
      />

      <AnimEllipse
        diameter={0.44}
        quarters={1}
        translate={{ y: 0.3, z: noseLength * 0.5 }}
        rotate={{ x: -TAU / 10, z: TAU / 2.7 }}
        color="#2f3640"
        stroke={0.07}
      />
    </Shape>
  )
}

const DogEyes = ({ color, iteration }) => {
  const [isBlinking, setIsBlinking] = useState(false)
  useEffect(() => void setInterval(() => {
    setIsBlinking(true)
    const timeout = setTimeout(() => {
      setIsBlinking(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, 1500), [])

  const {
    eyeRadius, eyeBallRadius, eyeSpeckRadius, eyebrowRadius, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ
  } = useMemo(() => {
    const eyeRadius = d3.randomNormal(0.5, 0.05)()
    const eyeBallRadius = eyeRadius * d3.randomNormal(0.6, 0.1)()
    const eyeSpeckRadius = d3.randomNormal(0.02, 0.005)()
    const eyebrowRadius = d3.randomNormal(0.3, 0.03)()
    const eyebrowRotation = d3.randomNormal(0, 0.6)()
    const offset = d3.randomNormal(0.55, 0.05)()
    const eyeballX = d3.randomNormal(0, 0.05)()
    const eyeballY = -d3.randomNormal(0, 0.05)()

    const groupY = -d3.randomNormal(0.3, 0.1)()
    const groupZ = d3.randomNormal(0.6, 0.05)()
    return {
      eyeRadius, eyeBallRadius, eyeSpeckRadius, eyebrowRadius, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ, groupY, groupZ
    }
  }, [iteration])

  const anim = useSpring({
    eyeRadius, eyeBallRadius, eyeSpeckRadius, eyebrowRadius, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ,
    eyeLidQuarters: isBlinking ? 1 : 0.1,
  })
  return (
    <AnimShape translate={{ y: groupY, z: groupZ }} stroke={0}>
      {_.times(2, i => (
        <AnimShape key={i} translate={{ x: offset * (i ? 1 : -1) }} stroke={0}>
          <AnimShape stroke={anim.eyeRadius} color="#fff" />
          <AnimShape stroke={anim.eyeBallRadius} translate={{
            x: eyeballX,
            y: eyeballY,
            z: (eyeRadius / 2) - (
                  Math.abs(eyeballX) + Math.abs(eyeballY)
              ) * 0.96
            }}
            color="#353b48"
          />
          <AnimShape stroke={anim.eyeSpeckRadius} translate={{
            x: eyeballX,
            y: eyeballY,
            z: (eyeRadius / 2) - (
                  Math.abs(eyeballX) + Math.abs(eyeballY)
              ) * 0.9
            }}
            color="#fff"
          />
          {/* <AnimShape stroke={anim.eyebrowRadius}
            path={[{ x: -0.1, z: -0.1 }, { x: 0.1, z: 0.1 }]}
            translate={{
              x: (eyebrowRotation > 0 ? 0.3 : -0.3) * (i ? 1 : -1),
              y: -0.2,
              z: eyebrowRotation > 0 ? -0.4 : -0.2
            }} color={color}
          /> */}
          <AnimHemisphere
            // stroke={0.7}
            stroke={0.1}
            // diameter={anim.eyeRadius}
            // diameter={(anim.eyeRadius * 2.5)}
            translate={{ y: -0.1, z: 0 }}
            quarters={anim.eyeLidQuarters}
            scale={{x: 0.8, y: 0.8}}
            // rotate={{ x: TAU * 0, z: TAU * 0.875 }}
            rotate={
              anim.eyebrowRotation.interpolate(eyebrowRotation => ({
                z: TAU * (eyebrowRotation * (i ? -1 : 1)),
              }))
            }
            fill={false}
            color={color.interpolate(color => {
              return d3.color(color) ? d3.color(color).brighter(2.5).toString() : color
            })}
            // color={"green"}
          />
        </AnimShape>
      ))}
    </AnimShape>
  )
}

const DogEars = ({ color, iteration }) => {
  const {
    areDown, earRadius, earRotation, offset, groupY, groupZ
   } = useMemo(() => {
    const areDown = !!Math.round(Math.random())
    const earRadius = d3.randomNormal(areDown ? 0.5 : 0.5, 0.1)()
    const earRotation = d3.randomNormal(0, 2)()
    const offset = d3.randomNormal(areDown ? 1.1 : 0.9, 0.1)()
    const groupY = d3.randomNormal(0.5, 0.1)()
    const groupZ = d3.randomNormal(-0.4, 0.05)()

    return {
      areDown, earRadius, earRotation, offset, groupY, groupZ
    }
  }, [iteration])

  const anim = useSpring({
    earRadius, earRotation, offset, groupY, groupZ
  })

  return (
    <Shape translate={{ y: groupY, z: groupZ }} stroke={0}>
      {_.times(2, i => (
          <AnimShape
            key={i}
            stroke={anim.earRadius}
            path={[
              { x: -0.05, y: areDown ? -0.05 : 0, z: -0.03 },
              { x:  0.05, y: areDown ?  0.05 : 0, z:  0.03 },
            ]}
            translate={
              anim.offset.interpolate(offset => ({
                x: offset * (i ? -1 : 1),
                y: areDown ? -0.8 : 0,
              }))
            }
            rotate={
              anim.earRotation.interpolate(earRotation => ({
                z: areDown
                  ? anim.earRotation * i ?  1 : -1
                  : anim.earRotation * i ? -1 :  1
              }))
            }
            color={color.interpolate(color => {
              return d3.color(color) ? d3.color(color).darker(0.5).toString() : color
            })}
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