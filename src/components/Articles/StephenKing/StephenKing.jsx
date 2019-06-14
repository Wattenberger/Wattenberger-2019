import { useState, usePrevious, useEffect } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from "components/_ui/Chart/Chart"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import stephenKingBooks from "./kingBooks"
import textInfo from "./textInfo"


// "Face in the Crowd, A",
// "Big Driver",
// "Good Marriage",
// "Guns (Kindle Single)",
// "Dark Tower, The",
// "Uncollected Stories 2003",
const bookNameMap = { "11_22_63_ A Novel": "11/22/63", "Nightmares & Dreamscapes": "Nightmares and Dreamscapes", "Finders Keepers": "Finders Keepers (Bill Hodges Trilogy, #2)", "Black House": "Black House (The Talisman, #2)", "Four Past Midnight": "Four Past Midnight ", "Colorado Kid, The": "The Colorado Kid (Hard Case Crime #13)", "Salem's Lot": "'Salem's Lot", "Shining, The": "The Shining (The Shining #1)", "Gunslinger, The": "The Gunslinger (The Dark Tower, #1)", "Dark Tower IV Wizard and Glass, The": "Wizard and Glass (The Dark Tower, #4)", "Dark Tower, The": "The Dark Tower (The Dark Tower, #7)", "Hearts In Atlantis": "Hearts in Atlantis", "Song of Susannah": "Song of Susannah (The Dark Tower, #6)", "IT": "It", "Talisman 01 - The TalismanCL Peter Straub": "The Talisman (The Talisman, #1)", "Doctor Sleep": "Doctor Sleep (The Shining, #2)", "Drawing of the Three, The": "The Drawing of the Three (The Dark Tower, #2)", "Wind Through the Keyhole, The": "The Wind Through the Keyhole (The Dark Tower, #4.5)", "End of Watch (The Bill Hodges Trilogy Book 3)": "End of Watch (Bill Hodges Trilogy, #3)", "Mr. Mercedes": "Mr. Mercedes (Bill Hodges Trilogy, #1)", "Wolves of the Calla": "Wolves of the Calla (The Dark Tower, #5)", "Everything's Eventual": "Everything's Eventual: 14 Dark Tales", "Waste Lands, The": "The Waste Lands (The Dark Tower, #3)", "Ur": "UR", "Green Mile, The": "The Green Mile, Part 1: The Two Dead Girls", "On Writing": "On Writing: A Memoir of the Craft" }

const stephenKingBooksEnhanced = _.orderBy(_.map(stephenKingBooks, book => {
  const name = book.title
  const bookInfo = textInfo.filter(info => _.includes([
    info.book,
    bookNameMap[info.book],
    `The ${info.book.slice(0, -5)}`,
    `A ${info.book.slice(0, -3)}`,
  ], name))[0]
  if (!bookInfo) return book

  return {
    ...book,
    ...bookInfo,
    percent_swears: _.sum(_.values(bookInfo.swear_types)) / bookInfo.number_of_words,
  }
}), "original_publication_year", "desc")
console.log(stephenKingBooksEnhanced)

import './StephenKing.scss';

const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const annotations = [{
  date: d3.timeParse("%m/%d/%Y")("06/19/1999"),
  label: "Car accident",
},{
  date: d3.timeParse("%m/%d/%Y")("01/01/1982"),
  label: "Intervention",
}]
const StephenKing = () => {
  // const [sortedAuthors, setSortedAuthors] = useState([])
  useEffect(() => {
  })

  return (
    <div className="StephenKing">
      <div className="StephenKing__title-container">
        <h2 className="StephenKing__title">
          Stephen King: Swears over Time
        </h2>
      </div>
      <div className="StephenKing__contents">

        <div className="StephenKing__scatters">
          <StephenKingScatter />
          {/* <StephenKingScatter metric="work_ratings_count" />
          <StephenKingScatter metric="average_rating" />
          <StephenKingScatter metric="average_sentence_length" />
          <StephenKingScatter metric="average_word_length" />
          <StephenKingScatter metric="percent_swears" />
          <StephenKingScatter metric="sentiment.polarity" />
          <StephenKingScatter metric="sentiment.subjectivity" /> */}
        </div>
      </div>
    </div>
  )
}

export default StephenKing


const yearToDate = d => d3.timeParse("%Y")(+d)
const toYear = d3.timeFormat("%-Y")
// const formatPercent = d3.format(",.1%")

const margin = {
  top: 2,
  right: 2,
  bottom: 30,
  left: 60,
}
const metric = "percent_swears"
const data = _.filter(stephenKingBooksEnhanced, d => _.isFinite(_.get(d, metric)))
let swearOccurances = {}
_.each(data, d => {
  _.each(d.swear_occurrences, (count, swear) => {
    if (!swearOccurances[swear]) swearOccurances[swear] = 0
    swearOccurances[swear] += count
  })
})
console.log(swearOccurances, data)
const topSwears = _.sortBy(_.toPairs(swearOccurances), d => -d[1])
const colors = ["#0fb9b1", "#778beb", "#e77f67", "#FDA7DF", "#cf6a87", "#58B19F", "#A3CB38", "#786fa6", "#4b7bec", "#778ca3"]
const topSwearColors = _.fromPairs(
  _.zip(topSwears.map(d => d[0]).slice(0,colors.length - 1), colors)
)
console.log(topSwearColors)

const getTopSwear = book => _.sortBy(
  _.toPairs(book.swear_occurrences),
  d => -d[1]
)[0][0]
const StephenKingScatter = ({ height=500, width }) => {
  const xAccessor = d => yearToDate(d.original_publication_year)
  const yAccessor = d => +_.get(d, metric)

  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [hoveredBook, setHoveredBook] = useState(null)

  const [ref, dimensions] = useChartDimensions({
    height,
    marginTop: margin.top,
    marginRight: margin.right,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
  })

  const yScale = d3.scaleLinear()
      .domain(d3.extent(data.map(d => +_.get(d, metric))))
      .range([dimensions.boundedHeight - margin.top - margin.bottom, 0])
      .nice()
  const xScale = d3.scaleTime()
      .domain([
        yearToDate((_.last(data) || {}).original_publication_year),
        yearToDate((_.first(data) || {}).original_publication_year),
      ])
      .range([0, dimensions.boundedWidth - margin.left - margin.right])

  const onMouseEnter = d => {
    const coordinates = [
      xScale(xAccessor(d)) + margin.left,
      yScale(yAccessor(d)) + margin.top,
    ]
    setHoveredPoint(coordinates)
    setHoveredBook(d)
  }

  const onMouseEnterLocal = d => () => onMouseEnter(d)
  const onMouseLeave = () => {
    setHoveredPoint(null)
    setHoveredBook(null)
  }

  return (
    <div className="StephenKingScatter" ref={ref}>
      <Chart
        height={dimensions.height}
        width={dimensions.width}
        margin={margin}
        hasNoListener
      >
        <rect
          width={dimensions.boundedWidth}
          height={dimensions.boundedHeight}
          fill="white"
        />
        <Axis
          width={dimensions.width}
          height={dimensions.height}
          margin={margin}
          scale={xScale}
          dimension="x"
          label="Publication Date"
        />
        <Axis
          width={dimensions.width}
          height={dimensions.height}
          margin={margin}
          scale={yScale}
          format={formatPercent}
          dimension="y"
          label={"of words are swears"}
          hasInlineLabel
        />
        {_.map(data.reverse(), d => (
          <Asterisk
            key={d.id}
            x={xScale(xAccessor(d))}
            y={yScale(yAccessor(d))}
            stroke={topSwearColors[getTopSwear(d)]}
            isHovered={hoveredBook && d.id == hoveredBook.id}
          />
        ))}
        {_.map(data.reverse(), d => (
          <circle
            cx={xScale(xAccessor(d))}
            cy={yScale(yAccessor(d))}
            r="20"
            fill="transparent"
            onMouseEnter={onMouseEnterLocal(d)}
            onMouseLeave={onMouseLeave}
          />
        ))}
      </Chart>
      {hoveredPoint && (
        <StephenKingScatterTooltip
          book={hoveredBook}
          x={hoveredPoint[0]}
          y={hoveredPoint[1]}
        />
      )}
    </div>
  )
}

const StephenKingBooksList = ({ books, name, count }) => (
  <div className="StephenKingBooksList">
    <h4>{ name } <span className="StephenKingBooksList__count">{ count } books</span></h4>
    <div className="StephenKingBooksList__list">
      {_.map(books, book => (
        <div className="StephenKingBooksList__list__item" key={book.id}>
          <div style={{backgroundImage: `url(${book.image_url})`}} className="StephenKingBooksList__list__item__image" />
          <h5>{ book.title }</h5>
          <div>{ +book.original_publication_year }</div>
          <div>★ { book.average_rating }</div>
          {name == "Stephen King" && (
            <StephenKingBookListInfo name={book.title} />
          )}
        </div>
      ))}
    </div>
  </div>
)

const formatPercent = d3.format(".1%")
const StephenKingBookListInfo = ({ name }) => {
  const book = textInfo.filter(info => _.includes([
    info.book,
    bookNameMap[info.book],
    `The ${info.book.slice(0, -5)}`,
    `A ${info.book.slice(0, -3)}`,
  ], name))[0]
  if (!book) return null

  const sortedSwears = _.orderBy(_.toPairs(book.swear_occurrences), 1, "desc").slice(0, 3)
  const sortedSwearTypes = _.orderBy(_.toPairs(book.swear_types), 1, "desc").slice(0, 3)
  const commonSentences = _.orderBy(_.toPairs(book.common_sentences), 1, "desc").slice(0, 3)
  const percentSwears = _.sum(_.values(book.swear_types)) / book.number_of_words

  return (
    <div>
        <div>{ book.number_of_words }</div>
        <div>{ formatPercent(percentSwears) } swears</div>
        {_.map(sortedSwears, swear => (
          <div>{ swear[0] }: { swear[1] }</div>
        ))}
        {_.map(commonSentences, sentence => (
          <div>{ sentence[0] }: { sentence[1] }</div>
        ))}
        {_.map(sortedSwearTypes, swearType => (
          <div>{ swearType[0] }: { swearType[1] }</div>
        ))}
    </div>
  )
}


const Asterisk = ({ x, y, isHovered, ...props }) => {
  const lineWidth = 10
  return (
    <g className="Asterisk-wrapper">
      <g className={`Asterisk Asterisk--is-${isHovered ? "hovered" : "not-hovered"}`} transform={`translate(${x},${y})`}>
        {_.map(_.times(4), i => {
          const [x1, y1] = getPositionFromPoint(i * (Math.PI * 2) / 3)
          return (
            <line {...props}
              x1={x1}
              y1={y1}
              x2={-x1}
              y2={-y1}
            />
          )
        })}
      </g>
    </g>
  )
}

const getPositionFromPoint = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]


const StephenKingScatterTooltip = ({ x, y, book }) => {
  const topSwears = _.sortBy(
    _.toPairs(book.swear_occurrences),
    d => -d[1]
  )

  return (
    <div className="StephenKingScatterTooltip" style={{
      transform: `translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`
    }}>
      <div className="StephenKingScatterTooltip__title">
        { book.title }
      </div>

      <div className="StephenKingScatterTooltip__swears">
        {_.map(topSwears.slice(0, 4), swear => (
          <div className="StephenKingScatterTooltip__swear" key={swear[0]} style={{
            color: topSwearColors[swear[0]]
          }}>
            {/* <div>{ swear[0].split("").map((d,i) => i ? "*" : d).join("") }</div> */}
            <div>{ swear[0] }</div>
            <div>{ swear[1] }</div>
          </div>
        ))}
      </div>

      <div className="StephenKingScatterTooltip__metric">
        { formatPercent(book.percent_swears) } of words are swears
      </div>
    </div>
  )
}