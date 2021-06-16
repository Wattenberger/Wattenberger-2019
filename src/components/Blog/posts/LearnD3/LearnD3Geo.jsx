import React, { useEffect, useMemo, useState } from "react"
import { Twemoji } from "react-emoji-render"
import * as d3 from "d3"
import * as d3GeoProjection from "d3-geo-projection"
import * as d3GeoPolygon from "d3-geo-polygon"
import { uniqueId } from "lodash"
import Select from 'react-select';

import Aside from "components/_ui/Aside/Aside"
import Button from "components/_ui/Button/Button"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, ReadMore, P } from "./LearnD3"
import bookImage from "images/book.png";
import countryShapes from "./countries.json"
import { useInterval } from "utils/utils"

const numberOfDataPoints = 4
const LearnD3Geo = ({ onScrollToSectionLocal }) => {
  const [initialProjection, setInitialProjection] = useState(null)

    return (
        <div className="LearnD3Geo">
            <p>
              Drawing maps and globes is a topic that you could spend a lifetime exploring - you can tell how much there is to learn by th size of these d3 modules. Before drawing any map, we should understand the basics, but thankfully <DocsLink repo="geo" /> is here to do most of the heavy lifting for us.
            </p>

            {/* <Code size="s" fileName="data.json">
            </Code> */}


            <h3>d3-geo</h3>

            <p>
              Because our goal is to represent a 3d sphere (Earth) onto a 2d plane (a computer screen), we’re going to have to decide on a set of rules for how to handle the transformation. This set of rules is called a <b>projection</b>.
            </p>

            <p>
              Part of the reason that <DocsLink repo="geo" /> is so large (it’s the largest module in the core build) is because it contains {builtInProjections.length} projections.
            </p>

            <p>
              There are even two d3 modules that aren’t in the core build that provide extra projections:
            </p>

            <List items={[
              <><DocsLink repo="geo-projection" />
              <p>the <i>largest</i> d3 module, adding {geoProjectionProjections.length} projections</p>
              </>,
              <><DocsLink repo="geo-polygon" />
              <p>a d3 module that handles spherical polygons, adding {geoPolygonProjections.length} projections</p>
              </>,
            ]} />

            <p>
              Change the projection in the dropdown below to see how they differ.
            </p>

            <GeoExampleSelect />

            <p>
              As you can see, things get pretty wild! Here are a few of the crazier examples:
            </p>

            <GeoExampleCycle projections={exampleProjections} />

            <Aside>
              Want to learn more about geographic projections? <Link to="https://mercator.tass.com/ancient-maps">Here’s a great article</Link> that covers the history of Mercator, and <Link to="https://www.atlasandboots.com/map-projections/">another article</Link> that covers a few common projections.
            </Aside>

            <p>
              When creating a map with <DocsLink repo="geo" />, you’ll want to be familiar with two concepts:
            </p>

            <List items={[
              "importing the geographic shapes",
              "projecting those shapes onto the world",
            ]} hasNumbers />

            <p>
              <DocsLink repo="geo" /> has a <DocsLink repo="geo" id="geoPath" /> method that will take a <b>d3 projection</b> and create a <b>path generator</b>. We can then take our <b>path generator</b> and use it to transform our geographic shapes into a <P>{`<path>`}</P>’s <P>d</P> attribute string.
            </p>

            <Aside>
              For a nice getting started guide of drawing a map, check out <Link to="https://bost.ocks.org/mike/map/">Mike Bostock’s Let’s Make a Map article</Link>.
            </Aside>

        </div>
    )
}

export default LearnD3Geo


const builtInProjections = [ "geoAzimuthalEqualArea", "geoAzimuthalEquidistant", "geoGnomonic", "geoOrthographic", "geoStereographic", "geoEqualEarth", "geoAlbersUsa", "geoAlbers", "geoConicConformal", "geoConicEqualArea", "geoConicEquidistant", "geoEquirectangular", "geoMercator", "geoTransverseMercator", "geoNaturalEarth1", ]
const geoProjectionProjections = [ "geoAiry", "geoAitoff", "geoArmadillo", "geoAugust", "geoBaker", "geoBerghaus", "geoBertin1953", "geoBoggs", "geoBonne", "geoBottomley", "geoBromley", "geoChamberlin", "geoChamberlinAfrica", "geoCollignon", "geoCraig", "geoCraster", "geoCylindricalEqualArea", "geoCylindricalStereographic", "geoEckert1", "geoEckert2", "geoEckert3", "geoEckert4", "geoEckert5", "geoEckert6", "geoEisenlohr", "geoFahey", "geoFoucaut", "geoFoucautSinusoidal", "geoGilbert", "geoGingery", "geoGinzburg4", "geoGinzburg5", "geoGinzburg6", "geoGinzburg8", "geoGinzburg9", "geoGringorten", "geoGuyou", "geoHammer", "geoHammerRetroazimuthal", "geoHealpix", "geoHill", "geoHomolosine", "geoHufnagel", "geoHyperelliptical", "geoKavrayskiy7", "geoLagrange", "geoLarrivee", "geoLaskowski", "geoLittrow", "geoLoximuthal", "geoMiller", "geoModifiedStereographic", "geoModifiedStereographicAlaska", "geoModifiedStereographicGs48", "geoModifiedStereographicGs50", "geoModifiedStereographicMiller", "geoModifiedStereographicLee", "geoMollweide", "geoMtFlatPolarParabolic", "geoMtFlatPolarQuartic", "geoMtFlatPolarSinusoidal", "geoNaturalEarth2", "geoNellHammer", "geoNicolosi", "geoPatterson", "geoPolyconic", "geoRectangularPolyconic", "geoRobinson", "geoSatellite", "geoSinusoidal", "geoSinuMollweide", "geoTimes", "geoTwoPointAzimuthal", "geoTwoPointAzimuthalUsa", "geoTwoPointEquidistant", "geoTwoPointEquidistantUsa", "geoVanDerGrinten", "geoVanDerGrinten2", "geoVanDerGrinten3", "geoVanDerGrinten4", "geoWagner", "geoWagner4", "geoWagner6", "geoWagner7", "geoWiechel", "geoWinkel3", "geoInterrupt", "geoInterruptedHomolosine", "geoInterruptedSinusoidal", "geoInterruptedBoggs", "geoInterruptedSinuMollweide", "geoInterruptedMollweide", "geoInterruptedMollweideHemispheres", "geoPolyhedral", "geoPolyhedralButterfly", "geoPolyhedralCollignon", "geoPolyhedralWaterman", "geoQuincuncial", "geoGringortenQuincuncial", "geoPeirceQuincuncial", ]
const geoPolygonProjections = ["geoCubic", "geoDodecahedral", "geoIcosahedral", "geoAirocean", "geoCahillKeyes", "geoImago", "geoTetrahedralLee", "geoCox", ]
const projections = [
  ...builtInProjections,
  ...geoProjectionProjections,
  ...geoPolygonProjections,
]
const exampleProjections = [
  "geoGringortenQuincuncial (d3-geo-projection)",
  "geoModifiedStereographicGs50 (d3-geo-projection)",
  "geoInterruptedMollweide (d3-geo-projection)",
  "geoHealpix (d3-geo-projection)",
  "geoBerghaus (d3-geo-projection)",
  "geoGingery (d3-geo-projection)",
]


const width = 500
const maxHeight = 500
const sphere = ({type: "Sphere"})
const GeoExample = ({ projectionName="geoMercator" }) => {
  const id = uniqueId()
  const clipPathId = `GeoExample__clip-${id}`
  const [height, setHeight] = useState(maxHeight)
  const [countryPaths, setCountryPaths] = useState([])
  const [earthPath, setEarthPath] = useState("")
  const [graticulePath, setGraticulePath] = useState("")
  const [isPending, startTransition] = React.useTransition()

  useEffect(() => {
    try {
      startTransition(() => {
        const parsedProjectionName = projectionName.split(" (")[0]
        const currentProjection = d3[parsedProjectionName]
          || d3GeoProjection[parsedProjectionName]
          || d3GeoPolygon[parsedProjectionName]
        if (!currentProjection) return {}

        const projection = currentProjection()
          .fitSize([width, maxHeight], sphere)

        const pathGenerator = d3.geoPath(projection)
        const earthPath = pathGenerator(sphere)
        const graticulePath = pathGenerator(d3.geoGraticule10())
        const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)
        const height = y1
        const countryPaths = countryShapes.features.map(country => ({
          key: country.properties.su_a3,
          name: country.properties.name_long,
          path: pathGenerator(country),
        }))

        setHeight(height)
        setCountryPaths(countryPaths)
        setEarthPath(earthPath)
        setGraticulePath(graticulePath)
      })
    } catch (e) {
      console.log(e)
    }
  }, [startTransition, projectionName])

  return (
    <div className="GeoExample">
      <svg viewBox={`0 0 ${width} ${maxHeight}`} style={{
        transition: "opacity 0.3s ease-out",
        opacity: isPending ? 0.5 : 1,
      }}>
        <g transform={`translate(0, ${(maxHeight - height) / 2})`}>
          <clipPath id={clipPathId}>
            <path d={earthPath} />
          </clipPath>
          <path className="GeoExample__earth" d={earthPath} />
          <path className="GeoExample__graticules" d={graticulePath} clipPath={`url(#${clipPathId})`} />

          <g className="GeoExample__countries">
            {countryPaths.map(({key, name, path}) => (
              <path
                key={key}
                className="GeoExample__country"
                d={path}
                clipPath={`url(#${clipPathId})`}
              >
                <title>{ name }</title>
              </path>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}


const projectionOptions = [
  ...builtInProjections.map(d => ({ value: d, label: `${d}`})),
  ...geoProjectionProjections.map(d => ({ value: d, label: `${d} (d3-geo-projection)`})),
  ...geoPolygonProjections.map(d => ({ value: d, label: `${d} (d3-geo-polygon)`})),
]
const GeoExampleSelect = () => {
  const [projectionName, setProjectionName] = useState("geoMercator")

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

      <GeoExample {...{projectionName}} />
    </div>
  )
}


const GeoExampleCycle = ({ projections }) => {

  return (
    <div className="GeoExampleCycle">
      {projections.map(projection => (
        <div className="GeoExampleCycle__item" key={projection}>
          <b>{ projection.split(" (")[0] }</b>
          <GeoExample projectionName={projection} />
        </div>
      ))}
    </div>
  )
}
