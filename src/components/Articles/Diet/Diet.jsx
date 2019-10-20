import { useState, useMemo, usePrevious, useEffect } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import * as d3 from "d3"
import * as d3GeoProjection from "d3-geo-projection"
import countryShapes from "./countries.json"
import classNames from "classnames"
import { uniq, uniqueId } from "lodash"
import dataFile from "./data.csv"
import { useInterval } from 'utils/utils.js';

import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import Button from "components/_ui/Button/Button"

import './Diet.scss';

const yearOptions = d3.range(1961, 2010)

const Diet = () => {
  const [allData, setAllData] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2009")
  const [food, setFood] = useState()

  useInterval(() => {
    const newSelectedYear = selectedYear + 1
    if (newSelectedYear > 2009) {
      setIsPlaying(false)
      return
    }
    setSelectedYear(newSelectedYear)
  }, isPlaying ? 100 : null)

  const loadData = async () => {
    const data = await d3.csv(dataFile)
    const possibleFoods = uniq(data.map(d => d.Item))
    setAllData(data)
    setFood(possibleFoods[0])
  }

  const countryData = useMemo(() => {
    const filteredData = allData.filter(d => d.Item == food)
    let countries = {}
    filteredData.forEach(d => {
      const value = +d[`Y${selectedYear}`] || 0
      countries[d.Country] = Number.isFinite(value) ? value : 0
    })
    return countries
  }, [food, selectedYear, allData])

  useEffect(() => {
    loadData()
  }, [])
  console.log(foodOptions)

  return (
    <div className="Diet">
      <div className="Diet__content">
        <h1>In which countries are most people eating...</h1>

        <div className="Diet__select-wrapper">
          <select
              className="Diet__select"
              defaultValue={null}
              onChange={e => setFood(e.target.value)}
          >
            {foodOptions.map(d => (
              <option key={d} value={d}>{ foodEmoji[d] } { d }</option>
            ))}
          </select>
            <Button className="Diet__play" onClick={() => {
              if (!isPlaying && selectedYear == 2009) setSelectedYear(yearOptions[0])
              setIsPlaying(!isPlaying)
            }}>
              {isPlaying ? "Stop" : (
                <>
                  <Icon name="play" size="xs" style={{marginRight: "0.6em"}} />
                  Play
                </>
              )}
            </Button>
          </div>

        <div className="Diet__years">
          {yearOptions.map((year, i) => (
            <div className={`Diet__years__item Diet__years__item--is-${year == selectedYear ? "selected" : "unselected"}`} key={year} onClick={() => {
              setSelectedYear(year)
              setIsPlaying(false)
            }}>
              <div className="Diet__years__item__text">
                { year }
              </div>
            </div>
          ))}
        </div>

        <Map data={countryData} />

        <div className="Diet__note">
          Food supply from plants represents national production plus imports plus or minus stock changes over the survey period; minus exports, quantities used for seed, animal feed, and in the manufacture of nonfood products, and losses during storage and transport
          <br />
          Data from <Link to="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/HYOWIC">Replication Data for: Increasing homogeneity in global food supplies and the implications for food security</Link>
        </div>
      </div>
    </div>
  )
}

export default Diet


const width = 900
const maxHeight = 500
const sphere = ({type: "Sphere"})
const Map = ({ projectionName="geoInterruptedHomolosine", data }) => {
  const id = uniqueId()
  const clipPathId = `GeoExample__clip-${id}`

  const {
    height, pathGenerator, earthPath, graticulePath
  } = useMemo(() => {
    try {
      const currentProjection = d3[projectionName]
      || d3GeoProjection[projectionName]
      if (!currentProjection) return {}

      const projection = currentProjection()
        .fitSize([width, maxHeight], sphere)

      const pathGenerator = d3.geoPath(projection)
      const earthPath = pathGenerator(sphere)
      const graticulePath = pathGenerator(d3.geoGraticule10())
      const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)
      const height = y1

      return {
        height, pathGenerator, earthPath, graticulePath
      }
    } catch (e) {
      console.log(e)
      return {}
    }
  }, [projectionName])

  const colorScale = useMemo(() => (
    !data
      ? null
      : d3.scaleLinear()
        .domain([0, 100])
        .range(["#dcdde1", "#5758BB"])
        .clamp(true)
  ), [data])

  return (
    <div className="Map">
      <svg viewBox={`0 0 ${width} ${maxHeight}`}>
        {/* <g transform={`translate(0, ${(maxHeight - height) / 2})`}> */}
          <clipPath id={clipPathId}>
            <path d={earthPath} />
          </clipPath>
          <path className="Map__earth" d={earthPath} />
          <path className="Map__graticules" d={graticulePath} clipPath={`url(#${clipPathId})`} />

          <g className="Map__countries">
            {pathGenerator && countryShapes.features.map(country => (
              <path
                key={country.properties.su_a3}
                className="Map__country"
                d={pathGenerator(country)}
                clipPath={`url(#${clipPathId})`}
                fill={colorScale && colorScale(
                  data[country.properties.name_long]
                  || data[country.properties.geounit]
                  || 0
                ) || "#dcdde1"}
              >
                <title>{ country.properties.name_long }: {
                  data[country.properties.name_long]
                  || data[country.properties.geounit]
                  || 0
                }%</title>
              </path>
            ))}
          </g>
        {/* </g> */}
      </svg>

      <div className="Map__legend">
        <div className="Map__legend__value">0%</div>
        <div className="Map__legend__fill"></div>
        <div className="Map__legend__value">100%</div>
      </div>
    </div>
  )
}


const foodEmoji = {
  "Apples": "🍎",
  "Bananas & plantains": "🍌",
  "Barley": "🌾",
  "Beans": "🌯",
  "Beverages, alcoholic": "🍷",
  "Beverages, fermented": "🍶",
  "Cassava": "🍠",
  "Cereals, other": "🥣",
  "Citrus, other": "🍈",
  "Cloves": "🍀",
  "Cocoa beans": "🍫",
  "Coconuts": "🥥",
  "Coffee": "☕",
  "Cottonseed oil": "🧶",
  "Dates": "📅",
  "Fruits, other": "🥝",
  "Grapefruit": "🍈",
  "Grapes": "🍇",
  "Groundnut": "🥜",
  "Lemons & limes": "🍋",
  "Maize": "🌾",
  "Millets": "🌾",
  "Oats": "🌾",
  "Oilcrops, other": "🌾",
  "Olives": "🍸",
  "Onions": "🧅",
  "Oranges & mandarines": "🍊",
  "Palm oil": "🌾",
  "Peas": "🥗",
  "Pepper": "🌶",
  "Pimento": "🌶️",
  "Pineapples": "🍍",
  "Potatoes": "🥔",
  "Pulses, other": "🌯",
  "Rape & mustard": "🥬",
  "Rice": "🍚",
  "Roots, other": "🥕",
  "Rye": "🥃",
  "Sesame ": "🌾",
  "Sorghum": "🌾",
  "Soybean": "🌱",
  "Spices, other": "🌿",
  "Sugar": "🍬",
  "Sunflower": "🌻",
  "Sweet potatoes": "🍠",
  "Sweeteners, other": "🍬",
  "Tea": "🍵",
  "Tomatoes": "🍅",
  "Vegetables, other": "🍆",
  "Wheat": "🌾",
  "Yams": "🥔",
  "Animal Products (Total)": "🐮",
  "Treenuts": "🌰",
  "Miscellaneous": "🌱",
  "Vegetal Products (Total)": "🥗",
}
const foodOptions = Object.keys(foodEmoji)