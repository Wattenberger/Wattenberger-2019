import React, { useState, useMemo } from "react"
import { Canvas, useThree } from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import * as THREE from 'three'
import image1 from "./lady.jpg"
import imageMap1 from "./lady-map.jpg"
import image2 from "./mount.jpg"
import imageMap2 from "./mount-map.jpg"
import image3 from "./canyon.jpg"
import imageMap3 from "./canyon-map.jpg"
import image4 from "./ball.jpg"
import imageMap4 from "./ball-map.jpg"
import Toggle from "components/_ui/Toggle/Toggle";

import './WebGLDemo.scss';

const aspectRatio = 781 / 1173
const WebGLDemo = () => {
  const [mouse, setMouse] = useState([0, 0])
  const [selectedOption, setSelectedOption] = useState(0)

  const onMouseMove = ({ clientX: x, clientY: y }) => {
    setMouse([
      x / window.innerWidth,
      y / window.innerHeight,
    ])
  }

  return (
    <div className="WebGLDemo">
      <Toggle
        className="WebGLDemo__toggles"
        value={selectedOption}
        options={options}
        onChange={setSelectedOption}
      />

      <div className="WebGLDemo__scene" onMouseMove={onMouseMove}>
        <Scene {...{mouse, selectedOption}} />

        <div className="WebGLDemo__overlay">
            { options[selectedOption].text }
        </div>
      </div>

    </div>
  )
}

export default WebGLDemo

const Scene = ({ mouse, selectedOption, ...props }) => (
  <Canvas {...props}>
    <MainImage {...{mouse, selectedOption}} />
  </Canvas>
)

const planeGeomArgs = [8, 8]
const scale = [1, aspectRatio, 1]
const MainImage = ({ mouse, selectedOption }) => {
  const { invalidate } = useThree()

  const { dispX, dispY } = useSpring({
    dispX: mouse[0],
    dispY: mouse[1],
  })

  const args = useMemo(() => {
    const loader = new THREE.TextureLoader()

    const option = options[selectedOption]

    return [{
      uniforms: {
        texture: { type: 't', value: loader.load(option.image, invalidate) },
        map: { type: 't', value: loader.load(option.imageMap, invalidate) },
        threshold: {type: '2f', value: [
          option.horizontalThreshold,
          option.verticalThreshold,
        ] },
        dispX: { type: 'f', value: 0 },
        dispY: { type: 'f', value: 0 },
      },
      vertexShader,
      fragmentShader
    }]
  }, [selectedOption, invalidate])

  return (
    <mesh scale={scale}>
      <planeBufferGeometry attach="geometry" args={planeGeomArgs} />
      <a.shaderMaterial
        attach="material"
        args={args}
        uniforms-dispX-value={dispX}
        uniforms-dispY-value={dispY}
    />
    </mesh>
  )
}

const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `

const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;
  uniform vec2 threshold;
  uniform sampler2D texture;
  uniform sampler2D map;
  uniform float dispX;
  uniform float dispY;
  uniform float _rot;

  vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.);
    return mix(m, 2.0 - m, step(1.0, m));
  }
  void main() {
    vec4 tex1 = texture2D(map, mirrored(vUv));
    vec2 fake3d = vec2(vUv.x + (tex1.r - 0.5) * dispX / threshold.x, vUv.y + (tex1.r - 0.5) * dispY / threshold.y);
    gl_FragColor = texture2D(texture, mirrored(fake3d));
  }
`


const options = [
  {id: 0, label: "Lady", image: image1, imageMap: imageMap1, horizontalThreshold: 35, verticalThreshold: 15, text: "QO" },
  {id: 1, label: "Mountain", image: image2, imageMap: imageMap2, horizontalThreshold: 15, verticalThreshold: 25, text: "W" },
  {id: 2, label: "Canyon", image: image3, imageMap: imageMap3, horizontalThreshold: 35, verticalThreshold: 25, text: "S" },
  {id: 3, label: "Ball", image: image4, imageMap: imageMap4, horizontalThreshold: 15, verticalThreshold: 25, text: "BALL" },
]