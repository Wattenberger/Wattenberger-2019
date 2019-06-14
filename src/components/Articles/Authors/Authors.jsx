import { useState, usePrevious, useEffect } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip-old/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"
import sortedAuthors from "./sortedAuthors"
import booksFile from "./books.csv"
import './Authors.scss';

const flagsToExclude = [
  "Boxset",
  "Box Set",
  "Boxed Set",
  "Movie Companion",
  "Film Diary",
  "Four Great Tragedies:",
  "Complete Works",
  "The Complete Wreck",
  "Complete Collection",
]


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
d3.csv(booksFile).then(books => {
  const booksByCount = _.countBy(_.flatMap(books, d => d.authors.split(", ")))
  const newSortedAuthors = _.orderBy(_.toPairs(booksByCount), 1, "desc")
  const newSortedAuthorsEnhanced = _.map(newSortedAuthors.slice(100), author => ({
    name: author[0],
    count: author[1],
    books: _.orderBy(_.filter(books, book => _.includes(book.authors, author[0])), d => d.original_publication_year, "desc"),
    annotations: author.name == "Stephen King" ? annotations : [],
  }))
  // setSortedAuthors(newSortedAuthorsEnhanced)
})
const Authors = () => {
  // const [sortedAuthors, setSortedAuthors] = useState([])
  useEffect(() => {
  })

  return (
    <div className="Authors">
      <div className="Authors__title-container">
        <h2 className="Authors__title">
          Top Authors
        </h2>
      </div>
      <div className="Authors__contents">

        <div className="Authors__books">
          {_.map(sortedAuthors.slice(0, 6), author => (
            <div key={author.name}>
              <AuthorsBooksList
                {...author}
              />
              <AuthorsDots name={author.name} books={author.books} annotations={author.name == "Stephen King" ? annotations : []} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Authors


const yearToDate = d => d3.timeParse("%Y")(+d)
const toYear = d3.timeFormat("%-Y")
const AuthorsDots = ({ name, books, annotations }) => {
    const [voronoi, setVoronoi] = useState([]);
    const [ref, dimensions] = useChartDimensions({
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        height: 600,
    })

    let radiusMetric = "work_ratings_count"
    let colorMetric = "average_rating"

    let enhancedBooks = _.filter(books, book => !_.some(
      _.map(flagsToExclude, flag => _.includes(book.title, flag))
    ))

    let radiusScale = d3.scaleSqrt()
      .domain(d3.extent(enhancedBooks.map(d => +d[radiusMetric])))
      .range([6, 70])

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(enhancedBooks.map(d => +d[colorMetric])))
        .range(["#f7d794", "#778beb"]).nice()

    const xScale = d3.scaleTime()
        .domain(
          d3.extent(enhancedBooks.map(d => yearToDate(d.original_publication_year)))
        //   [
        //   yearToDate(_.last(enhancedBooks).original_publication_year),
        //   yearToDate(_.first(enhancedBooks).original_publication_year),
        // ]
        )
        .range([0, dimensions.width])

    useEffect(function() {
        // const maxViews = _.maxBy(enhancedBooks, metric)[metric]
        var simulation = d3.forceSimulation(enhancedBooks)
            .force("x", d3.forceX(d => xScale(yearToDate(d.original_publication_year))).strength(1))
            //   .force("y", d3.forceY(d => radiusScale))
            .force("y", d3.forceY(dimensions.height / 2))
            .force("collide", d3.forceCollide(d => radiusScale(+d[radiusMetric]) + 2))
            .stop();

        _.times(100, () => simulation.tick())

        const newVoronoi = d3.voronoi()
            .extent([[0, 0], [dimensions.width, dimensions.height]])
            .x(d => d.x)
            .y(d => d.y)
            .polygons(enhancedBooks)
            .filter(d => !!d)
        setVoronoi(newVoronoi)
    }, [dimensions])

    return (
        <div className="AuthorsDots" ref={ref}>
          <h3 className="AuthorsDots__name">{ name }</h3>
          <div className="AuthorsDots__legend">
            <div className="AuthorsDots__legend__item">
              <h6>Average Rating</h6>
              <div className="AuthorsDots__scale">
                { formatNumberWithDecimal(colorScale.domain()[0]) }
                <div className="AuthorsDots__scale__color" style={{
                  background: `linear-gradient(to right, ${colorScale.range()[0]}, ${colorScale.range()[1]})`
                }} />
                { formatNumberWithDecimal(colorScale.domain()[1]) }
              </div>
            </div>

            <div className="AuthorsDots__legend__item">
              <h6>Ratings Count</h6>
              <div className="AuthorsDots__circle-scale">
                {_.map(radiusScale.ticks(3), tick => (
                  <div className="AuthorsDots__circle-scale__item" key={tick} style={{
                    height: radiusScale(tick) * 2 + "px",
                    width: radiusScale(tick) * 2 + "px",
                  }}>
                    <div className="AuthorsDots__circle-scale__item__text">
                      { formatNumber(tick) }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            {_.map(voronoi, book => {
                if (!book || !book.data) return null;
                // const peakTime = dateAccessor(_.maxBy(book.timeline, viewsAccessor))
                return (
                    <Tooltip
                        key={book.data.id}
                        className="AuthorsDots__item"
                        style={{
                            height: radiusScale(+book.data[radiusMetric]) * 2 + "px",
                            width: radiusScale(+book.data[radiusMetric]) * 2 + "px",
                            transform: `translate(${book.data.x - radiusScale(+book.data[radiusMetric])}px, ${book.data.y - radiusScale(+book.data[radiusMetric])}px)`,
                            background: colorScale(+book.data[colorMetric]),
                        }}
                    >
                      { book.data.title }
                      <div>{ book.data.average_rating }</div>
                      <div>{ +book.data.original_publication_year }</div>
                  </Tooltip>
                )
            })}
            {_.map(_.orderBy(voronoi, d => +d.data[radiusMetric], "desc").slice(0, 6), book => (
              <div key={book.data.id} className="AuthorsDots__item-text" style={{
                transform: `translate(${book.data.x}px, ${book.data.y}px)`,
              }}>{ book.data.title.split(" (")[0].split(":")[0] }</div>
            ))}

            {_.map(annotations, annotation => (
              <div key={annotation.label} className="AuthorsDots__annotation" style={{
                transform: `translate(${xScale(annotation.date)}px)`,
              }}>
                <div className="AuthorsDots__annotation__label">
                  { annotation.label }
                </div>
              </div>
            ))}

            <div className="AuthorsDots__x-axis">
              {_.map(xScale.ticks(), tick => (
                <div className="AuthorsDots__x-axis__tick" key={toYear(tick)} style={{
                  transform: `translate(${xScale(tick)}px)`,
                }}>
                  { toYear(tick) }
                </div>
              ))}
            </div>
        </div>
    )
}

const AuthorsBooksList = ({ books, name, count }) => (
  <div className="AuthorsBooksList">
    <h4>{ name } <span className="AuthorsBooksList__count">{ count } books</span></h4>
    <div className="AuthorsBooksList__list">
      {_.map(books, book => (
        <div className="AuthorsBooksList__list__item" key={book.id}>
          <div style={{backgroundImage: `url(${book.image_url})`}} className="AuthorsBooksList__list__item__image" />
          <h5>{ book.title }</h5>
          <div>{ +book.original_publication_year }</div>
          <div>★ { book.average_rating }</div>
        </div>
      ))}
    </div>
  </div>
)
