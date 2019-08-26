import React, { useState, useMemo, useEffect } from 'react';
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
import bookLabels from "./book-labels.json"
import bookInfo from "./book-info.json"

import './StephenKingMds.scss';
console.log(data)

const ignoreList = [
    "Uncollected Stories 2003", "Guns (Kindle Single)", "Riding the Bullet","End of Watch (The Bill Hodges Trilogy Book 3)"
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
// const clusterColors = ["#778beb", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const clusterColors = ["#c7ecee", "#f6e58d", "#ffcccc", "#00d2d3", "#c8d6e5", "#FDA7DF", "#4b7bec", "#778ca3"];
const clusterLabelColors = clusterColors.map(color => {
    let darkerColor = d3.hsl(color).darker(0.9)
   darkerColor.s -= 0.1
    return darkerColor
})

const StephenKingMds = () => {
    return (
        <div className="StephenKingMds">
            <h1>
                Stephen King universe
            </h1>
            <div className="StephenKingMds__wrapper">
                <StephenKingMdsChart
                />
            </div>
        </div>
    )
}

export default StephenKingMds


const height = 600
const width = 600
const lengthAccessor = d => d.length
const yearAccessor = d => d ? +d.original_publication_year : 0
const radiusScale = d3.scaleSqrt()
    .domain(d3.extent(filteredBooks.map(lengthAccessor)))
    // .range([6, 25])
    .range([1, 6])
    .range([10, 60])
const colorScale = d3.scaleLinear()
    .domain(d3.extent(bookInfo.map(yearAccessor)))
    .domain([2010, 2015])
    // .range([6, 25])
    .range(["#fff", "#0abde3"])
    console.log(d3.extent(bookInfo.map(yearAccessor)))
const StephenKingMdsChart = () => {
    const [hoveredBook, setHoveredBook] = useState(null)

    const [ref, dimensions] = useChartDimensions({
        height: 2000,
        width: 2000,
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20,
    })

    const {
        xScale, yScale, parsedBooks
    } = useMemo(() => {
        const xScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([0, dimensions.boundedWidth])

        const yScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([0, dimensions.boundedHeight])

        const parsedBooks = filteredBooks.map(d => ({
            ...d,
            unscaledX: xScale(d.x),
            unscaledY: yScale(d.y),
            r: radiusScale(lengthAccessor(d)),
            x: null,
            y: null,
            year: yearAccessor(
                bookInfo.find(info => (
                    info.title.toLowerCase() == d.title.toLowerCase()
                    || info.title.toLowerCase() == (bookLabels[d.title] || "").toLowerCase()
                    || info.original_title.toLowerCase() == d.title.toLowerCase()
                    || info.original_title.toLowerCase() == (bookLabels[d.title] || "").toLowerCase()
                    || (info.title == "Everything's Eventual: 14 Dark Tales" && d.title == "Everything's Eventual")
                ))
            )
        }))

        return {
            xScale, yScale, parsedBooks
        }
    }, [dimensions.width, dimensions.height])
    console.log(parsedBooks)

    const uncollidedBooks = useMemo(() => {
        let uncollidedBooks = [...parsedBooks]

        // var simulation = d3.forceSimulation(uncollidedBooks)
        //     .force("x", d3.forceX(d => d.unscaledX).strength(0.1))
        //     .force("y", d3.forceY(d => d.unscaledY))
        //     .force("collide", d3.forceCollide(d => d.r + 12))
        //     // .force("charge", d3.forceManyBody())
        //     // .force("center", d3.forceCenter(
        //     //     dimensions.boundedWidth / 2,
        //     //     dimensions.boundedHeight / 2,
        //     // ))
        //     .stop()

        // _.times(6, () => simulation.tick())

        return uncollidedBooks
    }, [xScale, parsedBooks])

    return (
        <div className="StephenKingMdsChart" ref={ref}>
            <svg
                width={dimensions.width}
                height={dimensions.height}
                className="StephenKingMdsChart__svg">
                <defs>

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


                    {series.map((books, seriesIndex) => (
                        books.map((bookName, bookIndex) => {
                            const nextBookName = books[bookIndex + 1]
                            if (!nextBookName) return null
                            const currentBook = uncollidedBooks.find(book => (
                                (bookLabels[book.title] || book.title) == bookName
                            ))
                            const nextBook = uncollidedBooks.find(book => (
                                (bookLabels[book.title] || book.title) == nextBookName
                            ))
                            if (!currentBook || !nextBook) return null

                            return (
                                <g key={[bookIndex, seriesIndex].join("-")}>
                                    <line
                                        className="StephenKingMdsChart__line"
                                        x1={currentBook.x || currentBook.unscaledX}
                                        y1={currentBook.y || currentBook.unscaledY}
                                        x2={nextBook.x || nextBook.unscaledX}
                                        y2={nextBook.y || nextBook.unscaledY}
                                    />
                                    <circle
                                        className="StephenKingMdsChart__line__cover"
                                        cx={currentBook.x || currentBook.unscaledX}
                                        cy={currentBook.y || currentBook.unscaledY}
                                        r={currentBook.r + 20}
                                    />
                                    <circle
                                        className="StephenKingMdsChart__line__cover"
                                        cx={nextBook.x || nextBook.unscaledX}
                                        cy={nextBook.y || nextBook.unscaledY}
                                        r={nextBook.r + 20}
                                    />
                                </g>
                            )
                        })
                    ))}

                    {uncollidedBooks.map(d => (
                        <circle
                            className="StephenKingMdsChart__circle"
                            key={d.title}
                            cx={d.x || d.unscaledX}
                            cy={d.y || d.unscaledY}
                            r={d.r}
                            stroke={clusterColors[d.cluster]}
                            // fill={clusterColors[d.cluster]}
                            // fill={colorScale(d.year)}
                            style={{
                                filter: `url(#glow-${d.cluster})`,
                            }}
                            onMouseEnter={() => setHoveredBook(d)}
                        >
                            <title>
                                { bookLabels[d.title] || d.title }
                            </title>
                        </circle>
                    ))}
                    {/* {uncollidedBooks.map(d => (
                        <g transform={`translate(${[
                            d.x,
                            d.y,
                        ].join(",")})`}>
                            <text
                                className="StephenKingMdsChart__title"
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
                    className="StephenKingMdsChart__label"
                    style={{
                        transform: `translate(${[
                            `calc(${(d.x || d.unscaledX) + dimensions.marginLeft}px - 50%)`,
                            `calc(${(d.y || d.unscaledY) + dimensions.marginTop}px - 50%)`,
                            // `${d.y - d.r + dimensions.marginTop}px`,
                        ].join(",")})`,
                        height: d.r * 2,
                        // width: d.r * 2,
                        // color: clusterLabelColors[d.cluster],
                }}>
                    { bookLabels[d.title] || d.title }
                    <div className="StephenKingMdsChart__label__year">
                        { d.year }
                    </div>
                </div>
            ))}

            {/* {hoveredBook && (
                <div
                    className="StephenKingMdsChart__tooltip"
                    style={{
                        transform: `translate(${
                            hoveredBook.x * (width / 2) + width / 2
                        }px, ${
                            hoveredBook.y * (height / 2) + height / 2
                        }px)`
                    }}>
                    <div className="StephenKingMdsChart__tooltip-wrapper">
                        { hoveredBook.title }
                    </div>
                </div>
            )} */}
        </div>
    )
}