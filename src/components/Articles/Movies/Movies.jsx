import { useState, useMemo, usePrevious, useEffect } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import { csv, json, timeFormat } from "d3"

import classNames from "classnames"
import { uniq, uniqueId } from "lodash"
import { useInterval } from 'utils/utils.js';
import moviesUrl from "./movies.csv"
import creditsUrl from "./credits.csv"
// import moviesUrl from "./movies2.csv"
import moviesShortUrl from "./movies-short.json"

import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import Button from "components/_ui/Button/Button"

import './Movies.scss';

const Movies = () => {
  const [movies, setMovies] = useState([])
  // const [creditsById, setCreditsById] = useState({})

  const fetchMovies = async () => {
    const basicMovies = await csv(moviesUrl)
    const credits = await csv(creditsUrl)
    const parsedCredits = parseRawArray(credits)
    let creditsObect = {}
    parsedCredits.forEach(credit => {
      creditsObect[credit.movie_id] = credit
    })
    const parsedMovies = parseRawArray(basicMovies)
      // .sort((a,b) => (
      //   +a.popularity - +b.popularity
      // ))
      // .slice(0, 300)
      .map(d => ({
        ...d,
        ...parsedCredits[d.id],
        release_date: new Date(d.release_date),
      }))
      .filter(d => d.cast)
      .sort((a,b) => (
        a.release_date - b.release_date
      ))
      // .slice(0, 500)
    // const res = await json(moviesShortUrl)
    console.log({
      parsedMovies,
parsedCredits
    })
    setMovies(parsedMovies)
    // setCreditsById(creditsObect)
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <div className="Movies">
    <div className="Movies__title">
      <h1>
        Gender in Movies
      </h1>
      <div className="Movies__key">
        {[
          ["#9980FA", "Female"],
          ["#2c3e50", "Male"],
        ].map(([color, label]) => (
          <div className="Movies__key__item" key={label} style={{color}}>
            { label }
          </div>
        ))}

      </div>
      </div>

      <div className="Movies__list">
        {movies.map((movie, index) => (
          <Movie
            key={movie.id}
            {...movie}
            lastYear={getYear((movies[index - 1] || {}).release_date)}
          />
        ))}
      </div>
    </div>
  )
}

export default Movies

        // {
        //   "cast_id": 242,
        //   "character": "Jake Sully",
        //   "credit_id": "5602a8a7c3a3685532001c9a",
        //   "gender": 2,
        //   "id": 65731,
        //   "name": "Sam Worthington",
        //   "order": 0
        // },

const genderColors = [
  "#dbdbe7",
  "#9980FA",
  "#2c3e50",
]
const formatDate = timeFormat("%M/%Y")
const getYear = date => date ? +timeFormat("%Y")(date) : 0
const Movie = ({ id, title, cast=[], release_date, lastYear }) => {
  const year = getYear(release_date)
  return (
    <div className="Movie" key={id}>
      <div className="Movie__year">
        { year != lastYear && year }
        {/* ({ formatDate(release_date) }) */}
      </div>
      <div className="Movie__title">
        { title }
        {/* ({ formatDate(release_date) }) */}
      </div>
      <div className="Movie__cast">
        {cast && cast.map && cast.map(({ id, character, gender, name }={}) => (
          <div className="Movie__cast__item" key={id} style={{
            background: genderColors[gender] || "#fff"
          }} alt={`${ name } - ${ gender }`}>
          </div>
        ))}
      </div>
    </div>
  )
}

const parseRawArray = array => (
  array.map(d => {
    let parsedD = {}
    Object.keys(d).forEach(key => {
      if (d[key].startsWith("[{" || d[key] == "[]")) {
        parsedD[key] = JSON.parse(d[key])
      } else {
        parsedD[key] = d[key]
      }
    })
    return parsedD
  })
)
