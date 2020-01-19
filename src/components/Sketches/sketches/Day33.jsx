import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSpring, animated } from "react-spring"
import { last, times } from "lodash"
import { line as d3Line, curveNatural, curveStep, scaleLinear } from "d3"

require('./Day33.scss')

const SVG_HEIGHT = 600
const SVG_WIDTH = 1500
const COLORS = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF"];
const NUMBER_OF_LINES = 70
const POINTS_PER_LINE = 70
const NUMBER_OF_COLOR_STEPS = 70
const colorScale = scaleLinear()
    .domain([0, NUMBER_OF_COLOR_STEPS / 2, NUMBER_OF_COLOR_STEPS])
    .range(["#9980FA", "#778beb", "#dff9fb"])
    .clamp(true)
const angleScale = scaleLinear()
    .domain([0, NUMBER_OF_LINES])
    .range([Math.PI / 2, Math.PI])
    .clamp(true)

const Day33 = () => {
    const [lines, setLines] = useState([])
    const [iteration, setIteration] = useState(0)

    useEffect(() => {
        let lastPoints = times(POINTS_PER_LINE, () => 0)
        const _lines = times(NUMBER_OF_LINES, lineI => {
            const points = times(POINTS_PER_LINE, i => {
                const angle = angleScale(i)
                const distance = lastPoints[i] + getRandomInRange(13, 33)
                const newPoint = getPositionFromPoint(
                    angle,
                    // lineI * 15
                    distance
                        // + getRandomInRange(-9, 9)
                )
                lastPoints[i] = distance
                return newPoint
                return [
                    lastPoints[i][0]
                        + Math.random() * 20,
                    lastPoints[i][0]
                        + Math.random() * 20,
                ]
            })
            // lastPoints = points
            const fullPoints = [
                [0, 0],
                ...points,
                // [last(points)[0], SVG_HEIGHT],
                [0, 0],
            ]
            return pointsToLine(fullPoints)
        }).reverse()
        setLines(_lines)
    }, [iteration])

    return (
        <div
            className="Day33"
            onClick={() => setIteration(iteration + 1)}>
            <svg
                height={SVG_HEIGHT}
                className="Day33__svg"
                viewBox={[0, 0, SVG_WIDTH, SVG_HEIGHT].join(" ")}
                preserveAspectRatio="xMidYMid"
            >
                {lines.map((line, i) => (
                    <path
                        key={i}
                        d={line}
                        fill={colorScale(i % (NUMBER_OF_COLOR_STEPS + 1))}
                    />
                ))}
            </svg>
        </div>
    )
}

export default Day33


const pointsToLine = d3Line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveNatural)
    // .curve(curveStep)


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
