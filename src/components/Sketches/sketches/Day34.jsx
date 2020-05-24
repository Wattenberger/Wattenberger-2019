import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSpring, animated } from "react-spring"
import { line as d3Line, area, range, curveNatural, curveStep, curveBasis, scaleLinear, interpolateHcl } from "d3"

require('./Day34.scss')

const SVG_HEIGHT = 600
const SVG_WIDTH = 1500
const UNIT_SIZE = 20
const HOUSE_SPACING = 60
const COLORS = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF"];

const minTerrace = 3
const maxTerraces = Math.floor(SVG_HEIGHT / HOUSE_SPACING * 0.9)
const colorScale = scaleLinear()
    .domain([minTerrace, maxTerraces])
    .range(["#076173", "#7E9ED6"])
    // .range(["#076173", "#E0E7DA"])
    // .range(["#9980FA", "#778beb", "#dff9fb"])
    .interpolate(interpolateHcl)
    .clamp(true)

const Day34 = () => {
    const [houses, setHouses] = useState([])
    const [terraces, setTerraces] = useState([])
    const [iteration, setIteration] = useState(0)

    useEffect(() => {
        const housePositions = []
        range(HOUSE_SPACING * 2, SVG_WIDTH - HOUSE_SPACING * 2, HOUSE_SPACING * 2).forEach(x => {
            range(HOUSE_SPACING * 2, SVG_HEIGHT - HOUSE_SPACING * 2, HOUSE_SPACING).forEach(y => {
                if (y < (SVG_HEIGHT * 1/3)) return
                if (getRandomInRange(0, 10) < 6) return
                housePositions.push({x, y})
            })
        })
        const houses = housePositions.map(({ x, y }) => ({
            x: x,
            y: y,
            width: Math.round(getRandomInRange(1, 5)) * UNIT_SIZE,
            height: Math.round(getRandomInRange(1, 5)) * UNIT_SIZE,
            color: getRandomFromArray(COLORS),
        })).sort((a,b) => a.y - b.y)
        setHouses(houses)

        const terraces = range(minTerrace, maxTerraces + 1).map(i => {
            let runningY = i
            const points = range(-HOUSE_SPACING, SVG_WIDTH + HOUSE_SPACING, HOUSE_SPACING).map(x => {
                runningY = Math.max(3, Math.min(maxTerraces, runningY + Math.round(getRandomInRange(-0.8, 0.8))))
                return [x, SVG_HEIGHT - HOUSE_SPACING * runningY]
            })
            const path = area()
                .x1(d => d[0])
                .y0(SVG_HEIGHT)
                .y1(d => d[1])
                .curve(curveBasis)
                (points)

            return path
        })
        setTerraces(terraces.reverse())
    }, [iteration])

    return (
        <div
            className="Day34"
            onClick={() => setIteration(iteration + 1)}>
            <svg
                className="Day34__svg"
                viewBox={[0, 0, SVG_WIDTH, SVG_HEIGHT].join(" ")}
                preserveAspectRatio="xMidYMid"
            >
                {terraces.map((d, i) => (
                    <path
                        key={i}
                        d={d}
                        fill={colorScale(minTerrace + i)}
                    />
                ))}
                {houses.map((d, i) => (
                    <g key={i} className="Day34__house" style={{ animationDelay: `${i * 0.05}s` }}>
                        <g transform={`translate(${d.x}, ${d.y}) scale(${d.y * 2 / SVG_HEIGHT})`}>
                            <House {...d} />
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    )
}

export default Day34

const House = ({ width, height, color }) => {
    const doorUnit = UNIT_SIZE * 2 / 3
    const doorHeight = UNIT_SIZE * 1.5
    const hillWidth = getRandomInRange(1, 5) * UNIT_SIZE
    return (
        <g>
            <path d={[
                    ["M", - hillWidth - HOUSE_SPACING * 0.5, SVG_HEIGHT].join(" "),
                    ["L", -hillWidth, height + SVG_HEIGHT * 0.2].join(" "),
                    ["C",
                        -hillWidth, height - SVG_HEIGHT * 0.1,
                        width + hillWidth + UNIT_SIZE * 2, height - SVG_HEIGHT * 0.1,
                        width + hillWidth + UNIT_SIZE * 2, height + SVG_HEIGHT * 0.2,
                    ].join(" "),
                    ["L", width + hillWidth + HOUSE_SPACING * 0.5, SVG_HEIGHT].join(" "),
                ].join("")}
                fill={colorScale(maxTerraces)}
            />
            <path d={[
                    ["M", UNIT_SIZE, -UNIT_SIZE].join(" "),
                    [width + UNIT_SIZE, -UNIT_SIZE].join(" "),
                    [width, 0].join(" "),
                    [0, 0].join(" "),
                ].join(" L ")}
                fill={color}
            />
            <path d={[
                    ["M", width, 0].join(" "),
                    [width + UNIT_SIZE, -UNIT_SIZE].join(" "),
                    [width + UNIT_SIZE * 2, 0].join(" "),
                    [width + UNIT_SIZE * 2, height].join(" "),
                    // [width + UNIT_SIZE * 2, height - UNIT_SIZE].join(" "),
                    [width, height].join(" "),
                    [0, 0].join(" "),
                ].join(" L ")}
                fill="#CECCD9"
            />
            <path d={[
                    ["M", width + UNIT_SIZE * 2, height].join(" "),
                    [width + UNIT_SIZE * 2 - height, height + height].join(" "),
                    [UNIT_SIZE * 2 - height, height + height].join(" "),
                    [0, height].join(" "),
                ].join(" L ")}
                fill="#503A4B"
                opacity="0.1"
                style={{ mixBlendMode: "multiply "}}
            />
            <path d={[
                    ["M", width + doorUnit, height].join(" "),
                    ["L", width + doorUnit, height - doorHeight * 0.7].join(" "),
                    ["C",
                        width + doorUnit, height - doorHeight,
                        width + doorUnit * 2, height - doorHeight,
                        width + doorUnit * 2, height - doorHeight * 0.7,
                    ].join(" "),
                    ["L", width + doorUnit * 2, height - doorHeight * 0.7].join(" "),
                    ["L", width + doorUnit * 2, height].join(" "),
                ].join("")}
                fill="#503A4B"
            />
            <rect
                width={width}
                height={height}
                fill="#fff"
            />
            {range(0, height / UNIT_SIZE - 1).map(i => (
                <>
                    {range(0, width / UNIT_SIZE - 1).map(j => (
                        <circle
                            key={j}
                            cx={(j + 1) * UNIT_SIZE}
                            cy={height - UNIT_SIZE * (i + 1)}
                            r="3"
                            fill="#503A4B"
                            opacity={1 - i * 0.3}
                        />
                    ))}
                    <circle
                        key={i}
                        cx={width + UNIT_SIZE}
                        cy={height - UNIT_SIZE * (i + 2)}
                        r="3"
                        fill="#503A4B"
                        opacity={1 - i * 0.3}
                    />
                </>
            ))}
        </g>
    )
}


const getRandomInRange = (min=0, max=100) => (
    Math.random() * (max - min) + min
)

const getRandomFromArray = array => array[
    Math.floor(getRandomInRange(0, array.length))
]


const getPositionFromPoint = (angle, offset=10) => [
    Math.cos(angle - (Math.PI / 2)) * offset,
    Math.sin(angle - (Math.PI / 2)) * offset,
  ]
