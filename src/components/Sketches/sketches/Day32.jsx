import React, { useEffect, useMemo, useRef, useState } from 'react'
import { extend, Canvas, useThree } from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import OrbitControls from "utils/OrbitControls"
import * as THREE from 'three'

require('./Day32.scss')

const SVG_HEIGHT = 600
const SVG_WIDTH = 1500
const NUMBER_OF_LARGE_CONFETTI = 9
const NUMBER_OF_SMALL_CONFETTI = 290
const COLORS = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]

const Day32 = () => {
    const [confetti, setConfetti] = useState([])
    const [mousePosition, setMousePosition] = useState(null)
    const throttledMousePosition = useThrottle(mousePosition, 600)
    const container = useRef()

    useEffect(() => {
        setConfetti(getConfetti())
    }, [])

    const onMouseMove = e => {
        if (!e) return
        const x = e.clientX - container.current.offsetLeft
        const y = e.clientY - container.current.offsetTop
        if (!Number.isFinite(x) || !Number.isFinite(y)) return
        setMousePosition([x, y])
    }

    const onMouseLeave = () => {
        setTimeout(() => {
            setMousePosition(null)
        }, 300)
    }

    return (
        <div
            className="Day32"
            ref={container}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}>
            <Wrapper
                {...{confetti}}
            />
        </div>
    )
}

export default Day32




const camera = {
  fov: 75, near: 0.1, far: 1000,
  position: [0, 0, -90],
}
extend({ OrbitControls })

function Controls(props) {
    const ref = useRef()
    const { camera, scene } = useThree()
    // useFrame(() => ref.current.obj.update())
    scene.fog = new THREE.Fog(new THREE.Color("#f1f2f6"), 60, 230)

    return <orbitControls ref={ref} args={[camera]} {...props} />
}
// const Controls = () => {
//     const controls = useRef()
//     return <orbitControls ref={controls} />
// }

const Wrapper = ({ confetti }) => {
    return (
        <Canvas {...{camera}}>
            <Controls />

            <ambientLight color="#f1f2f6" intensity={0.7} />

        <pointLight
          position={[0,0,-90]}
          color="#9980FA"
          intensity={0.5}
          />
        <pointLight
          position={[0,0,4]}
          color="#9c88ff"
          intensity={0.2}
          />
        <pointLight
          position={[-120,-1,-1]}
          color="#FFC312"
          intensity={0.1}
        />
        <pointLight
          position={[60,3,-3]}
          color="#12CBC4"
          intensity={0.1}
          />

            {confetti.map((flake, i) => (
                <ConfettiFlake
                    key={i}
                    {...flake}
                    // mousePosition={throttledMousePosition}
                />
            ))}
        </Canvas>
    )
}


const getTransform = (x, y, rotation) => `translate(${ x }px, ${ y }px) rotate(${ rotation }deg)`

const defaultAttrs = {
    x: 0,
    y: 0,
    rotation: 0,
    color: "white",
    size: 0.01,
}
const ConfettiFlake = ({ type, sizeType, isHollow, mousePosition }) => {
    const [attrs, setAttrs] = useState(defaultAttrs)

    const updateAttrs = () => {
        const _attrs = {
            x: mousePosition
                ? getRandomInRange(mousePosition[0] - 300, mousePosition[0] + 300)
                : getRandomInRange(-xRange, xRange),
            y: mousePosition
                ? getRandomInRange(mousePosition[1] - 300, mousePosition[1] + 300)
                : getRandomInRange(-yRange, yRange),
            z: getRandomInRange(0, zRange),
            rotation: getRandomInRange(-3, 3),
            color: getRandomFromArray(COLORS),
            size: Math.floor(getRandomInRange(1, sizeType == "s" ? 6 : 60),)
        }
        setAttrs(_attrs)
    }
    useEffect(updateAttrs, [mousePosition])

    useInterval(
        updateAttrs,
        !attrs.rotation ? getRandomInRange(10, 9000) : getRandomInRange(2000, 27000)
    )

    const Component = useMemo(() => typeElements[type], [])
    const sizeProps = useMemo(() => getPropsForType[type](1))

    const [spring, set] = useSpring(() => ({
        config: {
            mass: attrs.size * 1.6 + 5,
            tension: 500,
            friction: 140,
        },
        // scale: [1, 1, 1],
        // position: [attrs.x, attrs.y, attrs.z],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [0.01, 0.01, 0.01],
    }))
    // const [colorSpring] = useSpring(() => ({
    //     config: {
    //         mass: 50,
    //         tension: 100,
    //         friction: 50,
    //     },
    //     color: attrs.color,
    // }))

    useEffect(() => {
        set({
            position: [attrs.x, attrs.y, attrs.z],
            rotation: [attrs.rotation, 0, 0],
            scale: [attrs.size, attrs.size, attrs.size],
        })
    }, [attrs])

    // const group = useRef()
    // useFrame((state, delta) => {
    //     const {x, y, z} = attrs
    //     group.current.position.set(x, y, z)
    //     // group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
    //     // mixer.update(delta * speed)
    // })

    return (
        <a.mesh {...spring}>
            <Component attach="geometry" {...sizeProps} />
            <meshLambertMaterial
                attach="material"
                opacity={0.9}
                color={attrs.color}
                transparent
            />
        </a.mesh>
    )
}


const typeElements = {
    circle: "sphereBufferGeometry",
    rect: "boxBufferGeometry",
    dodecahedron: "dodecahedronBufferGeometry",
    octahedron: "octahedronBufferGeometry",
    tetrahedron: "tetrahedronBufferGeometry",
    // text: "textBufferGeometry",
    // torusKnot: "torusKnotBufferGeometry",
    cone: "coneBufferGeometry",
}
const getPropsForType = {
    circle: size => ({
        args: [size, 50, 50],
    }),
    rect: size => ({
        args: [size, size, size],
    }),
    dodecahedron: size => ({
        args: [size, 0],
    }),
    octahedron: size => ({
        args: [size, 0],
    }),
    tetrahedron: size => ({
        args: [size, 0],
    }),
    text: size => ({
        args: ["~", 0],
    }),
    torusKnot: size => ({
        args: [size, size / 2],
    }),
    cone: size => ({
        args: [size, size / 2],
    }),
}
const TYPES = Object.keys(typeElements)


const xRange = 260
const yRange = 60
const zRange = 90
const getConfetti = () => (
    [
        ...new Array(NUMBER_OF_LARGE_CONFETTI).fill(0).map(() => ({
            sizeType: "l",
            type: getRandomFromArray(TYPES),
            x: getRandomInRange(-xRange, xRange),
            y: getRandomInRange(-yRange, yRange),
            z: getRandomInRange(0, zRange),
            rotation: getRandomInRange(-3, 3),
            size: getRandomInRange(0, 60),
            color: getRandomFromArray(COLORS),
            isHollow: !Math.round(getRandomInRange(0, 1)),
        })),
        ...new Array(NUMBER_OF_SMALL_CONFETTI).fill(0).map(() => ({
            sizeType: "s",
            type: getRandomFromArray(TYPES),
            x: getRandomInRange(-xRange, xRange),
            y: getRandomInRange(-yRange, yRange),
            z: getRandomInRange(0, zRange),
            rotation: getRandomInRange(-3, 3),
            size: getRandomInRange(0, 6),
            color: getRandomFromArray(COLORS),
            isHollow: false,
        })),
    ]
)

const getRandomInRange = (min=0, max=100) => (
    Math.random() * (max - min) + min
)

const getRandomFromArray = array => array[
    Math.floor(getRandomInRange(0, array.length))
]

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}


// from https://github.com/bhaskarGyan/use-throttle/blob/master/src/index.js
const useThrottle = (value, limit) => {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastRan = useRef(Date.now());

    useEffect(
      () => {
        const handler = setTimeout(function() {
          if (Date.now() - lastRan.current >= limit) {
            setThrottledValue(value);
            lastRan.current = Date.now();
          }
        }, limit - (Date.now() - lastRan.current));

        return () => {
          clearTimeout(handler);
        };
      },
      [value, limit]
    );

    return throttledValue;
  };