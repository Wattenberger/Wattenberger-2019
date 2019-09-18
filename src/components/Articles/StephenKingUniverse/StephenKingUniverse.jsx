import React, { useState, useMemo, useRef } from 'react';
import * as d3 from "d3"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import USMap from "components/_ui/USMap/USMap"
import Chart from "components/_ui/Chart/Chart"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import data from "./data.json"
import data3 from "./data3.json"
import bookLabels from "./book-labels.json"
import bookInfo from "./book-info.json"
import offsetsData from "./offsets.json"

import './StephenKingUniverse.scss';
console.log(data)

const ignoreList = [
    "Uncollected Stories 2003", "Guns (Kindle Single)", "Riding the Bullet","End of Watch (The Bill Hodges Trilogy Book 3)",
    "Face in the Crowd, A" // no info
]
const series = [
    ["The Talisman", "Black House"],
    [
        "The Gunslinger", "The Drawing of the Three", "The Waste Lands", "Wizard and Glass", "Wolves of the Calla", "Song of Susannah", "The Dark Tower", "The Wind Through the Keyhole"
    ],[
        "Mr. Mercedes", "Finders Keepers", "End of Watch"
    ],[
        "The Two Dead Girls", "The Mouse on the Mile", "Coffey's Hands", "The Bad Death of Eduard Delacroix", "Night Journey", "Coffey on the Mile"
    ],[
        "The Shining", "Doctor Sleep"
    ]
]

const filteredBooks = data.filter(d => !ignoreList.includes(d.title))
const clusters = _.range(9).map(i => (
    data3.filter(d => d.cluster == i).map(d => d.title)
)).filter(d => d.length < 20)
// const clusters = _.range(9).map(i => (
//     filteredBooks.filter(d => d.cluster == i).map(d => d.title)
// )).filter(d => d.length < 20)
console.log(clusters)
// const clusterColors = ["#778beb", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
// const clusterColors = ["#c7ecee", "#f6e58d", "#ffcccc", "#f3a683", "#c8d6e5", "#786fa6", "#4b7bec", "#55efc4"];
const clusterColors = ["#c7ecee", "#f6e58d", "#ffcccc", "#f3a683", "#cbc9ff", "#786fa6", "#4b7bec", "#55efc4", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#778ca3"];
const clusterLabelColors = clusterColors.map(color => {
    let darkerColor = d3.hsl(color).darker(0.9)
   darkerColor.s -= 0.1
    return darkerColor
})

const StephenKingUniverse = () => {
    return (
        <div className="StephenKingUniverse">
            <div className="StephenKingUniverse__wrapper">
                <h1>
                    Stephen King
                </h1>
                <StephenKingUniverseChart
                />
            </div>
        </div>
    )
}

export default StephenKingUniverse


const height = 600
const width = 600
const xAccessor = d => +d.x
const yAccessor = d => +d.y
const lengthAccessor = d => +d.length
const radiusAccessor = d => +d.work_ratings_count
const yearAccessor = d => d ? +d.original_publication_year : 0
const radiusScale = d3.scaleSqrt()
    .domain(d3.extent(bookInfo.map(radiusAccessor)))
    // .range([6, 25])
    .range([6, 41])
    // .range([27, 50])
const ratingsDelayScale = d3.scaleLinear()
    .domain(d3.extent(bookInfo.map(d => +d.average_rating)))
    .range([0, 10])
const radiusModScale = d3.scaleLinear()
    .domain(radiusScale.range())
    .range([0, 1.5])
const animationDelayScale = d3.scaleLinear()
    .domain(d3.extent(bookInfo.map(yearAccessor)))
    .range([0, 10])
const colorScale = d3.scaleLinear()
    .domain(d3.extent(bookInfo.map(yearAccessor)))
    .domain([2010, 2015])
    // .range([6, 25])
    .range(["#fff", "#0abde3"])
const StephenKingUniverseChart = () => {
    const [hoveredBook, setHoveredBook] = useState(null)
    const [stars, setStars] = useState([])
    const bookBeingDragged = useRef(null)
    const dragStartPosition = useRef({})
    const starPositions = useRef(null)
    const [iteration, setIteration] = useState(0)
    const iterationRef = useRef(0)
    const svg = useRef()
    iterationRef.current = iteration

    const [ref, dimensions] = useChartDimensions({
        height: 2000,
        width: 2000,
        marginTop: 100,
        marginRight: 100,
        marginBottom: 100,
        marginLeft: 100,
    })

    const offsets = useRef(offsetsData)

    const {
        xScale, yScale, parsedBooks
    } = useMemo(() => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(filteredBooks, xAccessor))
            .range([0, dimensions.boundedWidth])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filteredBooks, yAccessor))
            .range([0, dimensions.boundedHeight])

        const parsedBooks = filteredBooks.map(d => {
            const matchingBook = bookInfo.find(info => (
                info.title.toLowerCase() == d.title.toLowerCase()
                || info.title.toLowerCase() == (bookLabels[d.title] || "").toLowerCase()
                || (info.original_title && info.original_title.toLowerCase() == d.title.toLowerCase())
                || (info.original_title && info.original_title.toLowerCase() == (bookLabels[d.title] || "").toLowerCase())
                || (info.title == "Everything's Eventual: 14 Dark Tales" && d.title == "Everything's Eventual")
            ))
            if (!matchingBook) {
                // console.log(d)
                return null
            }
            const x = xScale(xAccessor(d))
            return {
                ...matchingBook,
                ...d,
                unscaledX: x + ((offsets.current[d.title] || {}).x || 0),
                unscaledY: yScale(yAccessor(d)) + ((offsets.current[d.title] || {}).y || 0),
                r: radiusScale(radiusAccessor(matchingBook)),
                x: null,
                y: null,
                year: yearAccessor(matchingBook),
                labelSide: x < (dimensions.boundedWidth * 0.5 - dimensions.marginLeft) ? "left" : "right",
            }
        })
        .filter(d => d)
        .sort((a,b) => b.year - a.year)

        return {
            xScale, yScale, parsedBooks
        }
    }, [dimensions.width, dimensions.height, iteration])

    function onDrag(e) {
        if (!offsets.current) return
        offsets.current[bookBeingDragged.current] = {
            x: e.clientX - dragStartPosition.current.x,
            y: e.clientY - dragStartPosition.current.y,
        }
        setIteration(iterationRef.current + 1)
    }

    const onDragEnd = () => {
        bookBeingDragged.current = null
        window.removeEventListener("pointerup", onDragEnd)
        window.removeEventListener("pointermove", onDrag)
        setIteration(iteration + 1)
        console.log("%coffsets", "color: #7083EC", offsets.current)
    }

    const onDragStartLocal = book => e => {
        bookBeingDragged.current = book.title
        dragStartPosition.current = {
            x: e.clientX,
            y: e.clientY,
        }
        window.addEventListener("pointerup", onDragEnd)
        window.addEventListener("pointermove", onDrag)
    }

    const onMouseDown = e => {
        console.log("onMouseDown")
        starPositions.current = svg.current.getBoundingClientRect()
        const pos = {
            x: e.clientX - starPositions.current.left - dimensions.marginLeft,
            y: e.clientY - starPositions.current.top - dimensions.marginTop,
        }
        setStars([
            ...stars,
            [pos, pos],
        ])

    }
    const onMouseMove = e => {
        console.log("onMouseMove")
        console.log(starPositions.current)
        if (!starPositions.current) return
        e.stopPropagation()
        const newStars = [
            ...stars.slice(0, -1),
            stars.slice(-1)[0].map((d,i) => !i ? d : ({
                x: e.clientX - starPositions.current.left - dimensions.marginLeft,
                y: e.clientY - starPositions.current.top - dimensions.marginTop,
            })),
        ]
        console.log(stars)
        console.log(newStars)
        setStars(newStars)
        setIteration(iterationRef.current + 1)

    }
    const onMouseUp = e => {
        console.log("onMouseUp")
        // setStars([
        //     ...stars,
        //     starPositions.current,
        // ])
        starPositions.current = null
        setIteration(iteration + 1)
        console.log("%coffsets", "color: #7083EC", offsets.current)

    }

    const uncollidedBooks = useMemo(() => {
        let uncollidedBooks = [...parsedBooks]

        // _.times(10, i => {
        //     uncollidedBooks = uncollidedBooks.map((book, bookIndex) => {
        //         const doesCollide =
        //     })
        // })

        // var simulation = d3.forceSimulation(uncollidedBooks)
        //     .force("x", d3.forceX(d => d.unscaledX).strength(1))
        //     .force("y", d3.forceY(d => d.unscaledY).strength(1))
        //     // .force("collide", d3.forceCollide(d => d.r + 13))
        //     // .force("collide", rectCollide()
        //     //     .size([160, 90])
        //     // )
        //     .force("radial", d3.forceRadial(60, width / 2, height / 2))
        //     // .force("charge", d3.forceManyBody())
        //     // .force("center", d3.forceCenter(
        //     //     dimensions.boundedWidth / 2,
        //     //     dimensions.boundedHeight / 2,
        //     // ))
        //     .stop()

        // _.times(16, () => simulation.tick())

        return uncollidedBooks
    }, [xScale, parsedBooks])

    return (
        <div className="StephenKingUniverseChart" ref={ref}>
            <svg
                width={dimensions.width}
                height={dimensions.height}
                className="StephenKingUniverseChart__svg"
                onPointerDown={onMouseDown}
                onPointerMove={onMouseMove}
                onPointerUp={onMouseUp}
                ref={svg}>
                <defs>
                    <path
                        id="heart"
                        fill="#b8cfcc"
                        // fill="#858cbf"
                        d="M7.08605 2.46083C6.93944 2.31416 6.76537 2.1978 6.57379 2.11842C6.3822 2.03904 6.17685 1.99818 5.96947 1.99818C5.76209 1.99818 5.55674 2.03904 5.36515 2.11842C5.17357 2.1978 4.9995 2.31416 4.85289 2.46083L4.54863 2.76509L4.24437 2.46083C3.94823 2.1647 3.54659 1.99833 3.12779 1.99833C2.70899 1.99833 2.30734 2.1647 2.01121 2.46083C1.71507 2.75697 1.54871 3.15861 1.54871 3.57741C1.54871 3.99621 1.71507 4.39786 2.01121 4.69399L2.31547 4.99825L4.54863 7.23141L6.78179 4.99825L7.08605 4.69399C7.23273 4.54739 7.34908 4.37332 7.42846 4.18173C7.50785 3.99014 7.54871 3.78479 7.54871 3.57741C7.54871 3.37003 7.50785 3.16468 7.42846 2.97309C7.34908 2.78151 7.23273 2.60744 7.08605 2.46083V2.46083Z"
                    />

                    <filter id="glow-background" x="-5" y="-5" width="20" height="20">
                        <feFlood result="flood" flood-color="#10273f" flood-opacity="1"></feFlood>
                        <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
                        <feMorphology in="mask" result="dilated" operator="dilate" radius="2"></feMorphology>
                        <feGaussianBlur in="dilated" result="blurred" stdDeviation="5"></feGaussianBlur>
                        <feMerge>
                            <feMergeNode in="blurred"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                    <filter id="glow-neutral">
                        <feGaussianBlur in="dilated" result="blurred" stdDeviation="0.5"></feGaussianBlur>
                    </filter>
                    {clusterColors.map((color, index) => (
                        <filter id={`glow-${index}`} x="-5" y="-5" width="20" height="20">
                            {/* <feFlood result="flood" flood-color={"#858cbf"} flood-opacity="1"></feFlood> */}
                            <feFlood result="flood" flood-color={color} flood-opacity="1"></feFlood>
                            <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
                            <feMorphology in="mask" result="dilated" operator="dilate" radius="2"></feMorphology>
                            <feGaussianBlur in="dilated" result="blurred" stdDeviation="5"></feGaussianBlur>
                            <feMerge>
                                <feMergeNode in="blurred"></feMergeNode>
                                <feMergeNode in="SourceGraphic"></feMergeNode>
                            </feMerge>
                        </filter>
                    ))}
                </defs>

                <g transform={`translate(${[
                    dimensions.marginLeft,
                    dimensions.marginTop,
                ].join(",")})`}>

                    {stars.map(([start, end], starIndex) => (
                        <g key={starIndex}>
                            {[end].map(({x, y}, i) => (
                                <circle
                                    key={[starIndex, i].join("-")}
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill="white"
                                    // filter="url(#glow-neutral)"
                                />
                            ))}
                            <path
                                className="StephenKingUniverseChart__line"
                                d={
                                    createPath([
                                        ["M", start.x, start.y],
                                        ["L", end.x - 5, end.y - 5],
                                        ["L", end.x + 5, end.y + 5],
                                    ])
                                }
                                fill="white"
                                // filter="url(#glow-0)"
                            />
                        </g>
                    ))}


                    <Annotations {...{dimensions}} />

                    {series.map((books, seriesIndex) => (
                        books.map((bookName, bookIndex) => {
                            const nextBookName = books[bookIndex + 1]
                            if (!nextBookName) return null
                            const currentBook = uncollidedBooks.find(book => (
                                bookLabels[book.title] == bookName
                                || book.title == bookName
                            ))
                            const nextBook = uncollidedBooks.find(book => (
                                bookLabels[book.title] == nextBookName
                                || book.title == nextBookName
                            ))
                            if (!currentBook || !nextBook) return null

                            return (
                                <g className="StephenKingUniverse__fade-in" key={[bookIndex, seriesIndex].join("-")} style={{
                                    animationDelay: `${animationDelayScale(currentBook.year)}s`
                                }}>
                                    <line
                                        className="StephenKingUniverseChart__line"
                                        x1={currentBook.x || currentBook.unscaledX}
                                        y1={currentBook.y || currentBook.unscaledY}
                                        x2={nextBook.x || nextBook.unscaledX}
                                        y2={nextBook.y || nextBook.unscaledY}
                                    />
                                    <circle
                                        className="StephenKingUniverseChart__line__cover"
                                        cx={currentBook.x || currentBook.unscaledX}
                                        cy={currentBook.y || currentBook.unscaledY}
                                        r={currentBook.r + 10}
                                    />
                                    <circle
                                        className="StephenKingUniverseChart__line__cover"
                                        cx={nextBook.x || nextBook.unscaledX}
                                        cy={nextBook.y || nextBook.unscaledY}
                                        r={nextBook.r + 10}
                                    />
                                </g>
                            )
                        })
                    ))}

                    {uncollidedBooks.map(d => (
                        <g key={d.title}
                            transform={`translate(${
                                d.x || d.unscaledX
                            }, ${
                                d.y || d.unscaledY
                            })`}
                        >
                            <circle
                                className="StephenKingUniverseChart__circle StephenKingUniverse__fade-in--fill"
                                r={d.r}
                                stroke={clusterColors[+d.cluster]}
                                // fill={colorScale(d.year)}
                                style={{
                                    // filter: `url(#glow-${+d.cluster})`,
                                    animationDelay: `${animationDelayScale(d.year)}s`,
                                }}
                                onMouseEnter={() => setHoveredBook(d)}
                                onMouseDown={onDragStartLocal(d)}
                            >
                                <title>
                                    { bookLabels[d.title] || d.title }
                                </title>
                            </circle>
                            {Number.isFinite(+d.average_rating) &&
                                // _.times(+d.average_rating, (_,i) => (
                                _.times(ratingsDelayScale(+d.average_rating)).map((_,i) => (
                                    <use href="#heart"
                                        key={i}
                                        className="StephenKingUniverseChart__rating StephenKingUniverse__fade-in--fill"
                                        x={Math.cos(
                                            1.85
                                            + i / (1.9 + radiusModScale(+d.r))
                                        )
                                        * (d.r + 10)
                                        - 4}
                                        y={-Math.sin(
                                            1.85
                                            + i / (1.9 + radiusModScale(+d.r))
                                        )
                                        * (d.r + 10)
                                        - 4}
                                        //     style={{
                                        //         animationDelay: `${animationDelayScale(d.year) + (i * 0.3)}s`,
                                        //     }}
                                    />
                                ))
                            }
                        </g>
                    ))}
                    {/* {uncollidedBooks.map(d => (
                        <g transform={`translate(${[
                            d.x,
                            d.y,
                        ].join(",")})`}>
                            <text
                                className="StephenKingUniverseChart__title"
                                // y={d.r + 3}
                            >
                                { bookLabels[d.title] || d.title }
                            </text>
                        </g>
                    ))} */}

                </g>
            </svg>

            {uncollidedBooks.map(d => (
                <div
                    className={`StephenKingUniverseChart__label StephenKingUniverse__fade-in StephenKingUniverseChart__label--side-${d.labelSide}`}
                    style={{
                        transform: `translate(${[
                            `calc(${
                                (d.x || d.unscaledX)
                                + (d.r * (d.labelSide == "left" ? -1 : 1))
                                + (d.labelSide == "left" ? -17 : 9)
                                + dimensions.marginLeft
                            }px - ${d.labelSide == "left" ? "100" : "0"}%)`,
                            `calc(${
                                (d.y || d.unscaledY)
                                + dimensions.marginTop
                            }px - 50%)`,
                            // `${d.y - d.r + dimensions.marginTop}px`,
                        ].join(",")})`,
                        height: d.r * 2,
                        // width: d.r * 2,
                        // color: clusterLabelColors[d.cluster],
                        animationDelay: `${animationDelayScale(d.year) + 0.5}s`,
                }}>
                    { bookLabels[d.title] || d.title }
                    <div className="StephenKingUniverseChart__label__year">
                        { d.year }
                    </div>
                </div>
            ))}

            {/* {hoveredBook && (
                <div
                    className="StephenKingUniverseChart__tooltip"
                    style={{
                        transform: `translate(${
                            hoveredBook.x * (width / 2) + width / 2
                        }px, ${
                            hoveredBook.y * (height / 2) + height / 2
                        }px)`
                    }}>
                    <div className="StephenKingUniverseChart__tooltip-wrapper">
                        { hoveredBook.title }
                    </div>
                </div>
            )} */}
        </div>
    )
}



const Annotations = ({ dimensions }) => (

    <g
        className="StephenKingUniverseAnnotation"
        transform={`translate(${
            dimensions.boundedWidth / 2 - 150
        }, ${
            dimensions.boundedHeight / 2 + 310
        })`}>
        <circle r={dimensions.boundedWidth * 0.46} />
        {/* <circle r={dimensions.boundedWidth * 0.05} /> */}
        <circle r={dimensions.boundedWidth * 0.06} />
        <circle r={dimensions.boundedWidth * 0.4} />
        <circle
            r={dimensions.boundedWidth * 0.42}
            style={{
                strokeWidth: "10"
            }}
        />
        {_.times(400).map(i => (
            <line
                key={i}
                x1={Math.cos((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.4}
                x2={Math.cos((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.42}
                y1={Math.sin((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.4}
                y2={Math.sin((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.42}
            />
        ))}
        {_.times(20).map(i => (
            <line
                key={i}
                x1={0}
                x2={Math.cos((Math.PI * 2 / 20) * i) * dimensions.boundedWidth * 0.42}
                y1={0}
                y2={Math.sin((Math.PI * 2 / 20) * i) * dimensions.boundedWidth * 0.42}
            />
        ))}
        {_.times(660).map(i => (
            <line
                key={i}
                x1={Math.cos((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.33}
                x2={Math.cos((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.34}
                y1={Math.sin((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.33}
                y2={Math.sin((Math.PI * 2 / 400) * i) * dimensions.boundedWidth * 0.34}
            />
        ))}
        {_.times(800).map(i => (
            <line
                key={i}
                x1={Math.cos((Math.PI * 2 / 800) * i) * dimensions.boundedWidth * 0.46}
                x2={Math.cos((Math.PI * 2 / 800) * i) * dimensions.boundedWidth * 0.47}
                y1={Math.sin((Math.PI * 2 / 800) * i) * dimensions.boundedWidth * 0.46}
                y2={Math.sin((Math.PI * 2 / 800) * i) * dimensions.boundedWidth * 0.47}
            />
        ))}
    </g>
)

const createPath = arr => arr.map(d => d.join(" ")).join(" ")