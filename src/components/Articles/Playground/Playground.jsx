import React, { Component, useState, usePrevious, useEffect, useRef, useMemo } from "react"
import { apply, Canvas, useRender, useThree, useUpdate } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three'
import * as THREE from 'three'
import OrbitControls from "./OrbitControls"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import _ from "lodash"

import './Playground.scss';
const Playground = () => {

  return (
    <div className={`Playground`}>
      <div className="Playground__contents">
          <Wrapper />
      </div>
    </div>
  )
}

export default Playground



apply({ OrbitControls })

function Controls(props) {
  const ref = useRef()
  const { camera, scene } = useThree()
  scene.fog = new THREE.Fog(new THREE.Color("#e1eeed"), 0, 20)

  // useRender(() => ref.current.obj.update())
  return <orbitControls ref={ref} args={[camera]} {...props} />
}

const camera = {
  fov: 75, near: 0.1, far: 1000,
  // "position.z": 2,
}

const colorScale = d3.scaleLinear()
  .domain([0,1])
  .range(["#e1b12c", "#40739e"])

function Wrapper({ ...props }) {
  const meshGeo = new THREE.SphereBufferGeometry(100, 50, 50)

  return (
    <Canvas camera={camera} {...props}>
      <Controls />
      <group>
        <pointLight
          position={[0,0,5]}
          color="#fafaff"
          intensity={0.5}
          />
        {/* <pointLight
          position={[-2,0,-2]}
          color="#ff007b"
          intensity={0.3}
          /> */}
        {/* <pointLight
          position={[1,10,1]}
          color="#ff007b"
          intensity={0.5}
          />
        <pointLight
          position={[0,0,7]}
          color="#9c88ff"
          intensity={0.2}
          /> */}
        {/* <pointLight
          position={[0,0,6]}
          color="#9c88ff"
          intensity={0.2}
          /> */}
        {/* <pointLight
          position={[-10,-1,-1]}
          color="#FFC312"
          intensity={1}
        /> */}
        {/* <pointLight
          position={[3,3,3]}
          color="#12CBC4"
          intensity={0.1}
          /> */}
        <pointLight
          position={[0,0,3]}
          color="#f7f3ce"
          intensity={0.1}
          />
        <ambientLight color="#fff" intensity={0.7} />
        {/* <ambientLight color="#5758BB" intensity={0.4} /> */}

        <Dogs />

        <Ground
        />

        {/* {_.map(_.times(100), i => (
          <mesh
            key={i}
            scale={_.times(3, d => i / 600)}
            position={new THREE.Vector3(
              Math.sin(i / 6),
              Math.cos(i / 6),
              Math.tan(i / 6),
            )}
            // geometry={meshGeo}
            >
            <octahedronGeometry attach="geometry" />
            <meshLambertMaterial
              attach="material"
              color={colorScale(Math.random())}
              // opacity={0.9}
              // transparent
            />
          </mesh>
        ))} */}

      </group>
    </Canvas>
  )
}

const Ground = () => {
  const geometry = new THREE.SphereBufferGeometry(30, 50, 50)
  // var geometry = new THREE.PlaneGeometry( 5, 20, 32 );

  return (
    <mesh geometry={geometry} position={[0, -31, 0]}>
      <meshBasicMaterial
        side={THREE.DoubleSide}
        attach="material"
        color="#228c7b"
      />
    </mesh>
  )

}

const rows = 9
const columns = 3
const spacing = 0.9
let dogs = _.times(rows * columns, {})
const Dogs = () => {
  const [rotation, setRotation] = useState(0)

  // useUpdate(() => {
  //   setRotation(rotation + 1)
  // })

  let group = useRef()
  dogs = _.map(dogs, (dog, i) => ({
    ...dog,
    // ref: useRef(),
    position: [
      (-(rows / 2) + (i % rows)) * spacing,
      0,
      (-5 + Math.floor(i / columns)) * (spacing / 2),
      // getPointFromAngleAndDistance(i * (360 / 8), 2).x,
      // 0,
      // getPointFromAngleAndDistance(i * (360 / 8), 1).y,
    ],
    rate: d3.randomNormal(0.0005, 0.005)(),
    y: -2,
  }))
  let theta = 0
  useRender(() => {
    theta++
    // const y = 4 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
    // group.current.rotation.set(0, 0, r)
    dogs.forEach((dog, i) => {
      // const y = 1 * Math.sin(THREE.Math.degToRad((theta + dog.rate)))
      if ((dog.y > 1 && Math.random() < 0.03)
      || (dog.y > 2.3 && dog.rate > 0)
      || (dog.y < 1 && dog.rate < 0)) {
        dog.rate = -dog.rate
      }
      dog.y += dog.rate
      if (!_.get(dog, "ref.current")) return
      dog.ref.current.position.set(dog.position[0], dog.y, dog.position[2])
    })
  })
  useEffect(() => {
    dogs.forEach((dog, i) => {
      if (!_.get(dog, "ref.current")) return

      dog.ref.current.applyMatrix( new THREE.Matrix4().makeTranslation(...dog.position))
    })

  }, [])

  const sun = new THREE.SphereBufferGeometry(6, 50, 50)
  const sky = new THREE.SphereBufferGeometry(25, 50, 50)

  return (
    <group ref={group}>
      <mesh geometry={sun} position-z={-8}>
        <meshBasicMaterial attach="material" color="#ffca61" side={THREE.BackSide} />
      </mesh>
      <mesh geometry={sky} position-z={10}>
        <meshLambertMaterial attach="material" color="#fe5f55" side={THREE.BackSide} />
      </mesh>
      {_.map(dogs, (dog, i) => (
        <group ref={dog.ref}  key={i} scale={[0.8, 0.8, 0.8]}>
        <Dog
          position={dog.position}
        />
        </group>
      ))}
    </group>
  )
}


const flowerColorScale = d3.interpolateHcl("#FDA7DF", "#FFC312")
const Dog = ({ position }) => {

  useUpdate(e => {
    // console.log(e)
  })
  const { rotation } = useSpring({
    from: {
      rotation: [THREE.Math.degToRad(180), 0, THREE.Math.degToRad(45)],
    },
    to: {
      rotation: [0, 0, 0],
    },
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  })

  const color = colorScale(Math.random())


  const curve = new THREE.EllipseCurve(
    0,  0,            // ax, aY
    10, 10,           // xRadius, yRadius
    0,  2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
  );

  const points = curve.getPoints( 50 );
  const circleGeometry = new THREE.BufferGeometry().setFromPoints( points );

  const petalsColor = flowerColorScale(d3.randomNormal(0.5, 0.2)())


  return (
    <animated.group position={position} scale={_.times(3, i => 0.5)}>
      <DogHead color={color} />
      <DogNose color={color} />
      <DogEyes color={color} />
      <DogEars color={color} />
      {_.times(6, i => (
        <DogPetal color={petalsColor} rotation-z={i * (Math.PI * 2 / 6)} />
      ))}
      <DogStem />
      {/* <line geometry={circleGeometry}>
        <lineBasicMaterial attach="material" color="#9c88ff" />
      </line> */}
    </animated.group>
  )
}

const DogHead = ({ color }) => {
  const meshGeo = new THREE.SphereBufferGeometry(1, 50, 50)
  return (
    <mesh geometry={meshGeo} scale={[
      d3.randomNormal(1.2, 0.2)(),
      1,
      1.3,
    ]}>
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  )
}

const DogNose = ({ color }) => {
  const [noseLength, noseGeo, noseballGeo] = useMemo(() => {
    const noseLength = d3.randomNormal(0.7, 0.1)()
    const noseGeo = new THREE.SphereBufferGeometry(noseLength, 20, 20)
    const noseballGeo = new THREE.SphereBufferGeometry(d3.randomNormal(0.3, 0.05)(), 20, 20)
    return [noseLength, noseGeo, noseballGeo]
  }, [])

  const curve = new THREE.EllipseCurve(
    0,  0,            // ax, aY
    0.35, 0.35,           // xRadius, yRadius
    0,  Math.PI,  // aStartAngle, aEndAngle
    true,            // aClockwise
    0                 // aRotation
  );

  const points = curve.getPoints( 50 );
  const mouthGeometry = new THREE.BufferGeometry().setFromPoints( points );


  return (
    <group position={[
      0,
      d3.randomNormal(-0.3, 0.1)(),
      d3.randomNormal(0.7, 0.1)(),
    ]}>
      <mesh geometry={noseGeo} scale={[1, 1, 1.3]}>
        <meshLambertMaterial attach="material" color={color} />
      </mesh>
      <mesh geometry={noseballGeo} position={[
        0,
        0.1,
        noseLength * 1.3
        // d3.randomNormal(0.6, 0.1)(),
      ]}>
        <meshLambertMaterial attach="material" color={"#2f3640"} />
      </mesh>

      <line geometry={mouthGeometry} position={[0, -0.1, noseLength]}>
        <lineBasicMaterial attach="material" color="#2f3640" />
      </line>
    </group>
  )
}

const DogEyes = ({ color }) => {
  const [eyeRadius, eyeGeo, eyeballGeo, eyeSpeckGeo, eyebrowGeo, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ] = useMemo(() => {
    const eyeRadius = d3.randomNormal(0.25, 0.05)()
    const eyeGeo = new THREE.SphereBufferGeometry(eyeRadius, 20, 20)
    const eyeballGeo = new THREE.SphereBufferGeometry(eyeRadius * d3.randomNormal(0.5, 0.1)(), 20, 20)
    const eyeSpeckGeo = new THREE.SphereBufferGeometry(d3.randomNormal(0.02, 0.005)(), 20, 20)
    const eyebrowGeo = new THREE.SphereBufferGeometry(d3.randomNormal(0.16, 0.1)(), 20, 20)
    const eyebrowRotation = d3.randomNormal(0, 0.6)()
    const offset = d3.randomNormal(0.55, 0.05)()
    const eyeballX = d3.randomNormal(0, 0.05)()
    const eyeballY = d3.randomNormal(0, 0.05)()

    const groupY = d3.randomNormal(0.36, 0.1)()
    const groupZ = d3.randomNormal(1, 0.05)()
    return [eyeRadius, eyeGeo, eyeballGeo, eyeSpeckGeo, eyebrowGeo, eyebrowRotation, offset, eyeballX, eyeballY, groupY, groupZ, groupY, groupZ]
  }, [])

  return (
    <group position={[0, groupY, groupZ]}>
      {_.times(2, i => (
        <group key={i} position={[offset * (i ? 1 : -1), 0, 0]}>
          <mesh
            geometry={eyebrowGeo}
            scale={[2, 1, 2]}
            position={[(eyebrowRotation > 0 ? 0.3 : -0.3) * (i ? 1 : -1), 0.2, eyebrowRotation > 0 ? -0.4 : -0.2]}
            rotation-z={eyebrowRotation * (i ? -1 : 1)}>
            <meshLambertMaterial attach="material" color={color} />
          </mesh>
          <mesh geometry={eyeGeo}>
            <meshLambertMaterial attach="material" color="#ffffff" />
          </mesh>
          <mesh geometry={eyeballGeo} position={[
            eyeballX,
            eyeballY,
            eyeRadius - (
              Math.abs(eyeballX) + Math.abs(eyeballY)
            ) / 2
          ]}>
            <meshLambertMaterial attach="material" color="#353b48" />
          </mesh>
          <mesh geometry={eyeSpeckGeo} position={[
            eyeballX,
            eyeballY,
            eyeRadius - (
              Math.abs(eyeballX) + Math.abs(eyeballY)
            ) / 2 + 0.15
          ]}>
            <meshLambertMaterial attach="material" color="white" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const DogEars = ({ color }) => {
  const [areDown, earRadius, earGeo, earRotation, offset, groupY, groupZ] = useMemo(() => {
    const areDown = !!Math.round(Math.random())
    const earRadius = d3.randomNormal(areDown ? 0.39 : 0.2, 0.1)()
    const earGeo = new THREE.SphereBufferGeometry(earRadius, 20, 20)
    const earRotation = d3.randomNormal(0, 2)()
    const offset = d3.randomNormal(areDown ? 1.1 : 0.9, 0.1)()
    const groupY = d3.randomNormal(0.5, 0.1)()
    const groupZ = d3.randomNormal(-0.2, 0.05)()

    return [areDown, earRadius, earGeo, earRotation, offset, groupY, groupZ]
  }, [])

  return (
    <group position={[0, groupY, groupZ]}>
      {_.times(2, i => (
          <mesh
            key={i}
            geometry={earGeo}
            scale={[2, areDown ? 0.5 : 1, 1.3]}
            position={[
              offset * (i ? -1 : 1),
              areDown ? -0.8 :
              0, 0
            ]}
            rotation-z={areDown
              ? earRotation * i ?  1 : -1
              : earRotation * i ? -1 :  1}>
            <meshLambertMaterial attach="material" color={color} />
          </mesh>
      ))}
    </group>
  )
}


const DogStem = () => {
  var geometry = new THREE.CylinderGeometry( 0.1, 0.1, 10, 32 );

  return (
    <mesh
      position={[0, -4.3, 0]}
      geometry={geometry}
    >
      <meshLambertMaterial attach="material" color="#228c7b" />
    </mesh>
  )
}

const DogPetal = ({ color, ...props }) => {
  // var curve = new THREE.EllipseCurve(0, 0, 3, 0.5, 0, Math.PI * 2, false, 0)
  // var points = curve.getPoints( 50 )
  // var geometry = new THREE.BufferGeometry().setFromPoints( points )

  const puffFactor = d3.randomNormal(1.5, 0.3)()
  const points = _.times(90 / 2, i => {
      const rad = Math.PI * (i * 2) / 90

      return new THREE.Vector3(
        (1.72 + 0.08 * Math.cos(rad))
          * (Math.sin(rad)
          * 1.6),
        - Math.cos(rad)
          * puffFactor,
          1.01
      )
    })

    const geometry = new THREE.LatheBufferGeometry( points, 32 );

  return (
    <mesh {...props}
      // position={[0, -4.3, 0]}
      geometry={geometry}
      scale={[1, 1, 0.2]}
      rotation-x={-0.2}
      position-z={-0.7}
    >
      <meshLambertMaterial side={THREE.DoubleSide} attach="material" color={color} opacity={0.9} transparent />
    </mesh>
  )
}


function getPointFromAngleAndDistance(angle, distance) {
  return {
    x: Math.round(Math.cos(angle * Math.PI / 180) * distance),
    y: Math.round(Math.sin(angle * Math.PI / 180) * distance),
  }
}