import React, { useEffect, useMemo, useRef, useState } from "react"
import dataUrl from "./data.csv"
import uniqueId from "lodash/uniqueId"
import * as d3 from "d3"
import * as d3GeoProjection from "d3-geo-projection"
import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"
import Select from 'react-select';
import countryShapes from "./countries.json"
import "./Immigration.scss"
import { scaleLinear, scaleSequential } from "d3"
import iso3ToIso2Map from "./iso3ToIso2Map.json"

const stateNameKey = "States and territories"
const Immigration = () => {
  const [data, setData] = useState([])
  const [state, setState] = useState(["The United States", true])
  console.log(data)

  useEffect(() => {
    d3.csv(dataUrl).then(d => {
      let processedData = d
      let keys = []
      Object.keys(processedData[0]).forEach(key => {
        if (key === stateNameKey) return
        const simplifiedKey = key.split(" (")[0]
        if (keys[simplifiedKey]) {
          processedData = processedData.map(d => {
            d[simplifiedKey] = +d[simplifiedKey] + d[key]
            delete d[key]
            return d
          })
        } else {
          processedData = processedData.map(d => {
            d[simplifiedKey] = +d[key]
            if (simplifiedKey !== key) delete d[key]
            return d
          })
        }
      })
      setData(d)
    })
  }, [])

  const stateData = state[1]
   ? data.find(d => d[stateNameKey] === state[0])
    : data.reduce((acc, d) => {
      if (d[state[0]]) {
        acc[d[stateNameKey]] = d[state[0]]
      }
      return acc
    }, {})

  return (
    <div className="Immigration">
      <h2 className="Immigration__title">
        US immigrants {state[1] ? "to" : "from"} {state[0]} in 1900
      </h2>
      <Map
        data={stateData}
        focusedState={state}
        setFocusedState={setState}
      />
    </div>
  )

}

export default Immigration


const sphere = ({type: "Sphere"})
const Map = ({ projectionName = "geoInterruptedMollweide", focusedState, data = {}, setFocusedState}) => {
  const id = uniqueId()
  const clipPathId = `Immigration__Map__clip-${id}`
  const [countryPaths, setCountryPaths] = useState([])
  const [earthPath, setEarthPath] = useState("")
  const [graticulePath, setGraticulePath] = useState("")
  const projection = useRef()
  const [isPending, startTransition] = React.useTransition()
  const [focusedStateName, isFocusState] = focusedState
  const maxHeight = window.innerHeight * 0.7
  const width = window.innerWidth * 0.8
  const [height, setHeight] = useState(maxHeight)

  useEffect(() => {
    try {
      startTransition(() => {
        const parsedProjectionName = projectionName.split(" (")[0]
        const currentProjection = d3[parsedProjectionName]
          || d3GeoProjection[parsedProjectionName]
        if (!currentProjection) return {}

        projection.current = currentProjection()
          .fitSize([width, maxHeight], sphere)

        // projection.current.center([-98.5795,39.8283])
        // projection.current.rotate([100,-40])
        const pathGenerator = d3.geoPath(projection.current)
        const earthPath = pathGenerator(sphere)
        const graticulePath = pathGenerator(d3.geoGraticule10())
        const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)
        const height = y1
        const countryPaths = countryShapes.features.map(country => ({
          key: country.properties.su_a3|| country.properties.stateName,
          name: country.properties.name_long || country.properties.stateName,
          path: pathGenerator(country),
          center: projection.current(d3.geoCentroid(country)),
          isState: !!country.properties.stateName,
        }))

        setHeight(height)
        setCountryPaths(countryPaths)
        setEarthPath(earthPath)
        setGraticulePath(graticulePath)
      })
    } catch (e) {
      console.log(e)
    }
  }, [startTransition, projectionName, width, maxHeight])

  const getValue = name => {
    let value = data[name]
    if (value) return +value
    let key = Object.keys(data).find(key => {
      return key.includes(name) || name.includes(key)
    })
    if (Number.isFinite(+data[key])) return +data[key]
    return null
  }

  const {
    topCountries,
    colorScale
  } = useMemo(() => {
    const nonStates = [
      "Total foreign born", stateNameKey, "Europe (not otherwise specified)", "Central America", "Asia (except China, Japan, and India)", "Africa", "Born at Sea", "Other Countries",
      "Central America"
    ]
    // const max = Object.keys(data).reduce((max, key) => {
    //   if (nonStates.includes(key)) return max
    //   return Math.max(max, +data[key])
    // }, 0)
    const topCountries = !isFocusState ? [] :
      countryPaths.map(d => {
      const value = getValue(d.name)
      return [d.name, d.isState ? 0 : value, d.center, d.key]
    }).sort((a, b) => b[1] - a[1]).slice(0, 3)

    return {
      topCountries,
      colorScale: scaleSequential()
        .domain([0, 15000])
        // .domain([0, max])
        .interpolator(d3.interpolatePuBuGn)
    }
  }, [data])

  return (
    <div className="Immigration__Map">
      <Legend colorScale={colorScale} topCountries={topCountries} />
      {/* {topCountries.map(([name, value, center]) => {
        return (
          <div className="Immigration__Map__label" style={{
            transform: `translate(-50%, -100%) translate(${center[0]}px, ${center[1]}px)`
          }}>
            <strong>{name}</strong>
            <div><number>{d3.format(",")(value)} people</number></div>
          </div>
        )
      })} */}
      <svg viewBox={`0 0 ${width} ${maxHeight}`} style={{
        transition: "opacity 0.3s ease-out",
        opacity: isPending ? 0.5 : 1,
      }}>
        {/* <g transform={`translate(0, ${(maxHeight - height) / 2})`}> */}
          <clipPath id={clipPathId}>
            <path d={earthPath} />
          </clipPath>
          <path className="Immigration__Map__earth" d={earthPath} />
          <path className="Immigration__Map__graticules" d={graticulePath} clipPath={`url(#${clipPathId})`} />

          <g className="Immigration__Map__countries">
            {countryPaths.map(({ key, name, path, isState }) => {
              const canBeFocused = isState === isFocusState
              const isFocused = canBeFocused && focusedStateName === name
              const value = getValue(name)
              return (
                <path
                  key={key}
                  className="Immigration__Map__country"
                  d={path}
                  clipPath={`url(#${clipPathId})`}
                  fill={isFocused ? "#82C8D1" : canBeFocused ? "#f4f4f4" : colorScale(value,) || "#eee"}
                  stroke={canBeFocused ? "#444" : "#444"}
                  onMouseEnter={() => {
                    setFocusedState([name, isState])
                  }}
                >
                  <title>{name}{Number.isFinite(value) ? ` (${value})` : ""}</title>
                </path>
              )
            })}

      {topCountries.map(([name, value, center]) => {
        return (
          <g key={name} style={{
            transform: `translate(${center[0]}px, ${center[1] - 30}px)`
          }}>
          <text
          className="Immigration__Map__label"
              textAnchor="middle"
              stroke="white"
              strokeWidth={3}
          >
          {name}
          </text>
          <text
          className="Immigration__Map__label"
          textAnchor="middle"
          >
          {name}
            </text>
          <rect y="1" x="-33" width="66" height="11" fill="white" />
          <text
          className="Immigration__Map__number"
          dy="9"
          textAnchor="middle"
          >
            {d3.format(",")(value)} people
          </text>
      </g>
        )
      })}
          </g>
        {/* </g> */}
      </svg>
    </div>
  )
}

const Legend = ({ colorScale, topCountries }) => {
  const ticks = colorScale.ticks()
  const tickNumbers = colorScale.ticks(4)
  const scaleDomain = colorScale.domain()

  return (
    <div className="Immigration__Legend">
      <svg width="16em" height="1em" viewBox="0 0 1 1" preserveAspectRatio="none">
        <defs>
          <linearGradient id="Immigration__Legend">
            {ticks.map((tick,i) => (
              <stop key={tick} stopColor={colorScale(tick)} offset={i / ticks.length} />
            ))}
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#Immigration__Legend)" />
      </svg>

    <div className="Immigration__Legend__countries">
        {topCountries.map(([_, value, center, key], i) => (
          <div className="Immigration__Legend__countries__country" key={key} style={{
      left: `${Math.min(100,value * 100 / scaleDomain[1])}%`
    }}>
      <img width="19em" height="19em" src={`https://flagcdn.com/${iso3ToIso2Map[key.toLowerCase()]}.svg`} alt="flag" />
      </div>
      ))}
    </div>

    <div className="Immigration__Legend__ticks">
        {tickNumbers.map((value,i) => (
          <div className="Immigration__Legend__ticks__tick" key={i} style={{
      left: `${i * 100 / tickNumbers.length}%`
    }}>
      {d3.format(",")(value)}
      </div>
      ))}
    </div>

    </div>
  )
}


const builtInProjections = [ "geoAzimuthalEqualArea", "geoAzimuthalEquidistant", "geoGnomonic", "geoOrthographic", "geoStereographic", "geoEqualEarth", "geoAlbersUsa", "geoAlbers", "geoConicConformal", "geoConicEqualArea", "geoConicEquidistant", "geoEquirectangular", "geoMercator", "geoTransverseMercator", "geoNaturalEarth1", ]
const geoProjectionProjections = [ "geoAiry", "geoAitoff", "geoArmadillo", "geoAugust", "geoBaker", "geoBerghaus", "geoBertin1953", "geoBoggs", "geoBonne", "geoBottomley", "geoBromley", "geoChamberlin", "geoChamberlinAfrica", "geoCollignon", "geoCraig", "geoCraster", "geoCylindricalEqualArea", "geoCylindricalStereographic", "geoEckert1", "geoEckert2", "geoEckert3", "geoEckert4", "geoEckert5", "geoEckert6", "geoEisenlohr", "geoFahey", "geoFoucaut", "geoFoucautSinusoidal", "geoGilbert", "geoGingery", "geoGinzburg4", "geoGinzburg5", "geoGinzburg6", "geoGinzburg8", "geoGinzburg9", "geoGringorten", "geoGuyou", "geoHammer", "geoHammerRetroazimuthal", "geoHealpix", "geoHill", "geoHomolosine", "geoHufnagel", "geoHyperelliptical", "geoKavrayskiy7", "geoLagrange", "geoLarrivee", "geoLaskowski", "geoLittrow", "geoLoximuthal", "geoMiller", "geoModifiedStereographic", "geoModifiedStereographicAlaska", "geoModifiedStereographicGs48", "geoModifiedStereographicGs50", "geoModifiedStereographicMiller", "geoModifiedStereographicLee", "geoMollweide", "geoMtFlatPolarParabolic", "geoMtFlatPolarQuartic", "geoMtFlatPolarSinusoidal", "geoNaturalEarth2", "geoNellHammer", "geoNicolosi", "geoPatterson", "geoPolyconic", "geoRectangularPolyconic", "geoRobinson", "geoSatellite", "geoSinusoidal", "geoSinuMollweide", "geoTimes", "geoTwoPointAzimuthal", "geoTwoPointAzimuthalUsa", "geoTwoPointEquidistant", "geoTwoPointEquidistantUsa", "geoVanDerGrinten", "geoVanDerGrinten2", "geoVanDerGrinten3", "geoVanDerGrinten4", "geoWagner", "geoWagner4", "geoWagner6", "geoWagner7", "geoWiechel", "geoWinkel3", "geoInterrupt", "geoInterruptedHomolosine", "geoInterruptedSinusoidal", "geoInterruptedBoggs", "geoInterruptedSinuMollweide", "geoInterruptedMollweide", "geoInterruptedMollweideHemispheres", "geoPolyhedral", "geoPolyhedralButterfly", "geoPolyhedralCollignon", "geoPolyhedralWaterman", "geoQuincuncial", "geoGringortenQuincuncial", "geoPeirceQuincuncial", ]

const projectionOptions = [
  ...builtInProjections.map(d => ({ value: d, label: `${d}`})),
  ...geoProjectionProjections.map(d => ({ value: d, label: `${d} (d3-geo-projection)`})),
  // ...geoPolygonProjections.map(d => ({ value: d, label: `${d} (d3-geo-polygon)`})),
]
const MapSelect = ({data,focusedState,setFocusedState}) => {
  const [projectionName, setProjectionName] = useState("geoInterruptedMollweide")

  const onSetProjectionName = newProjectionName => {
    React.startTransition(() => {
      setProjectionName(newProjectionName.value)
    })
  }

  const onProjectionNameDiff = (diff = 1) => {
    const projectionNameIndex = projectionOptions.findIndex(({value}) => value === projectionName)
    const newIndex = (projectionNameIndex + diff) % projectionOptions.length
    setProjectionName(projectionOptions[newIndex].value)
  }

  return (
    <div className="GeoExampleSelect">
      <div className="GeoExampleSelect__controls">
        <Button onClick={() => onProjectionNameDiff(-1)}>
          <Icon name="arrow" direction="w" />
        </Button>
        <div className="GeoExampleSelect__select">
          <Select
            name="countries"
            options={projectionOptions}
            value={projectionOptions.find(d => d.value === projectionName)}
            onChange={onSetProjectionName}
            />
        </div>
        <Button onClick={() => onProjectionNameDiff(1)}>
          <Icon name="arrow" direction="e" />
        </Button>
      </div>

      <Map {...{projectionName,data,focusedState,setFocusedState}} />
    </div>
  )
}

