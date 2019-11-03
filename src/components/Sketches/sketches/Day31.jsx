import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSpring, animated } from 'react-spring'

require('./Day31.scss')

const SVG_HEIGHT = 600
const SVG_WIDTH = 1500
const NUMBER_OF_LARGE_CONFETTI = 9
const NUMBER_OF_SMALL_CONFETTI = 50
const COLORS = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF"];

const Day31 = () => {
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
            className="Day31"
            ref={container}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}>
            <svg
                height={SVG_HEIGHT}
                className="Day31__svg"
                viewBox={[0, 0, SVG_WIDTH, SVG_HEIGHT].join(" ")}
                preserveAspectRatio="xMidYMid"
            >
                {confetti.map((flake, i) => (
                    <ConfettiFlake
                        key={i}
                        {...flake}
                        mousePosition={throttledMousePosition}
                    />
                ))}
            </svg>
        </div>
    )
}

export default Day31

const getTransform = (x, y, rotation) => `translate(${ x }px, ${ y }px) rotate(${ rotation }deg)`

const defaultAttrs = {
    x: SVG_WIDTH / 2,
    y: SVG_HEIGHT / 2,
    rotation: 0,
    color: "white",
}
const ConfettiFlake = React.memo(({ type, size, isHollow, mousePosition }) => {
    const [attrs, setAttrs] = useState(defaultAttrs)

    const updateAttrs = () => {
        const _attrs = {
            x: mousePosition
                ? getRandomInRange(mousePosition[0] - 300, mousePosition[0] + 300)
                : getRandomInRange(0, SVG_WIDTH),
            y: mousePosition
                ? getRandomInRange(mousePosition[1] - 300, mousePosition[1] + 300)
                : getRandomInRange(0, SVG_HEIGHT),
            rotation: getRandomInRange(0, 360),
            color: getRandomFromArray(COLORS),
        }
        setAttrs(_attrs)
    }
    useEffect(updateAttrs, [mousePosition])

    useInterval(
        updateAttrs,
        !attrs.rotation ? getRandomInRange(10, 9000) : getRandomInRange(2000, 27000)
    )

    const Component = useMemo(() => animated[typeElements[type]], [])
    const sizeProps = useMemo(() => getPropsForType[type](size), [])

    const spring = useSpring({
        config: {
            mass: size * 1.6 + 5,
            tension: 500,
            friction: 140,
        },
        settings: [attrs.x, attrs.y, attrs.rotation],
    })
    const colorSpring = useSpring({
        config: {
            mass: 50,
            tension: 100,
            friction: 50,
        },
        color: attrs.color,
    })

    return (
        <Component
            className="Flake"
            {...sizeProps}
            style={{ transform: spring.settings.interpolate(getTransform) }}
            fill={isHollow ? "none" : colorSpring.color}
            stroke={colorSpring.color}
            strokeWidth={isHollow ? size * 0.3 : 0}
        />
    )
})


const TRIANGLE_POINTS = [
    0, -0.5,
    0.6, 0.5,
    -0.6, 0.5,
]
const typeElements = {
    circle: "circle",
    rect: "rect",
    triangle: "polygon",
}
const getPropsForType = {
    circle: size => ({
        r: size / 2,
    }),
    rect: size => ({
        height: size,
        width: size,
        x: -size / 2,
        y: -size / 2,
    }),
    triangle: size => ({
        points: TRIANGLE_POINTS.map(d => (
            d * size
        )).join(" ")
    }),
}
const TYPES = Object.keys(typeElements)


const getConfetti = () => (
    [
        ...new Array(NUMBER_OF_LARGE_CONFETTI).fill(0).map(() => ({
            type: getRandomFromArray(TYPES),
            x: getRandomInRange(0, SVG_WIDTH),
            y: getRandomInRange(0, SVG_HEIGHT),
            rotation: getRandomInRange(0, 360),
            size: getRandomInRange(0, 400),
            color: getRandomFromArray(COLORS),
            isHollow: !Math.round(getRandomInRange(0, 1)),
        })),
        ...new Array(NUMBER_OF_SMALL_CONFETTI).fill(0).map(() => ({
            type: getRandomFromArray(TYPES),
            x: getRandomInRange(0, SVG_WIDTH),
            y: getRandomInRange(0, SVG_HEIGHT),
            rotation: getRandomInRange(0, 360),
            size: getRandomInRange(0, 60),
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