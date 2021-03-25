import React, { useState } from "react"
import countryShapes from "./countries.json"
import * as d3 from "d3"
import * as d3GeoProjection from "d3-geo-projection"
import { range } from "d3"

import Aside from "components/_ui/Aside/Aside"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"
import { P, CodeAndExample } from "./examples"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"

const Maps = () => {
  const [projectionName, setProjectionName] = useState("geoArmadillo")

  return (
    <div className="Maps">
      <p>
        So you've seen awesome examples of people using d3 to create detailed
        maps, and globes that you can spin around. And you want to do that, too.
      </p>

      <p>
        Worry not! We can let d3 do a lot of the heavy lifting, and have a map
        in no time! First, let's look at our map! Try changing the projection,
        d3 comes with tons of fun options:
      </p>

      <div className="flex flex-col center">
        <select
          className="p-2 mb-2"
          value={projectionName}
          onChange={(e) => setProjectionName(e.target.value)}
        >
          {projectionOptions.map((projectionOption) => (
            <option key={projectionOption} value={projectionOption}>
              {projectionOption}
            </option>
          ))}
        </select>
        <MapExample projectionName={projectionName} />
      </div>

      <Aside>
        To play with all of the projections built in to d3, check them out{" "}
        <Link to="/blog/d3#maps-and-globes">in this blog post about d3</Link>.
      </Aside>

      <CodeAndExample
        code={MapExampleCode}
        size="s"
        markers={[
          range(8, 13),
          [...range(15, 20), 28],
          [...range(32, 35), 42],
          range(44, 49),
          range(37, 41),
          range(50, 64),
        ]}
        fileName="Map.jsx"
        example={(getHighlightedMarkerProps) => (
          <>
            {/* <br /> */}

            <p>
              There's a good amount of code in here, but really not much to
              create a whole map! Let's run through the highlights:
            </p>

            <List
              className="D3AndReact__marked-list"
              items={[
                <div {...getHighlightedMarkerProps(0)}>
                  First, we need to create a <P>projection</P>. This is our map
                  between our country shape definitions and the way we draw
                  those 3D shapes on our 2D screen.
                  <br />
                  We'll use the{" "}
                  <DocsLink id="projection_fitWidth">.fitWidth()</DocsLink>{" "}
                  method to size our map within the width of our component, and
                  also create a <P>pathGenerator</P> to generate path
                  definitions for our Earth & country shapes using{" "}
                  <DocsLink id="geoPath" />.
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  Next, we'll find the dimensions of the whole Earth (
                  <P>sphere</P>) in our projection, and assign the <P>height</P>{" "}
                  of our svg to the height of the sphere.
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  Some projections' shapes bleed outside of the edges of the
                  Earth, so we'll keep them in bounds using a <P>clipPath</P>.
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  We can use our <P>pathGenerator</P> function to turn{" "}
                  <Link to="https://macwright.com/2015/03/23/geojson-second-bite.html">
                    GeoJSON
                  </Link>
                  shape definitions into <P>{`<path>`}</P> <P>d</P> attribute
                  strings. First, we'll draw the whole Earth in a light gray.
                </div>,
                <div {...getHighlightedMarkerProps(4)}>
                  <DocsLink /> has some great methods, like{" "}
                  <DocsLink id="geoGraticule10" /> which will help us draw
                  graticule lines for reference.
                </div>,
                <div {...getHighlightedMarkerProps(5)}>
                  Last but not least, we'll draw our country shapes! We can draw
                  different types of geographic shapes by passing GeoJSON
                  definitions to our <P>pathGenerator</P> function. For example,
                  we're importing{" "}
                  <Link to="https://github.com/Wattenberger/Wattenberger-2019/tree/master/src/components/Blog/posts/D3AndReact/countries.json">
                    a list of country definitions
                  </Link>
                  , then creating <P>{`<path>`}</P> elements with their shape.
                </div>,
              ]}
              hasNumbers
            />
          </>
        )}
      />

      <p>
        Once you get the basics down, this is a really flexible way to draw
        geography! The trick is to think of d3 as a series of tools.
      </p>

      <Aside>
        I'll usually draw maps using Canvas, since rendering lots of SVG
        elements can get slow, and maps often have tons of shapes.
        <br />
        <br />
        If you want an example of Canvas rendering, as well as drawing bubbles
        on top of countries to visualize a metric, check out this{" "}
        <Link to="https://svelte.recipes/components/world-map">
          Svelte recipe
        </Link>
        . The code is in Svelte.js, but most of it will translate to React!
        Especially the <P>drawCanvas</P> function.
      </Aside>
    </div>
  )
}

export default Maps

const MapExampleCode = `const Map = ({ projectionName = "geoArmadillo" }) => {
  // grab our custom React hook we defined above
  const [ref, dms] = useChartDimensions({})

  // this is the definition for the whole Earth
  const sphere = { type: "Sphere" }

  const projectionFunction = d3[projectionName]
    || d3GeoProjection[projectionName]
  const projection = projectionFunction()
    .fitWidth(dms.width, sphere)
  const pathGenerator = d3.geoPath(projection)

  // size the svg to fit the height of the map
  const [
    [x0, y0],
    [x1, y1]
  ] = pathGenerator.bounds(sphere)
  const height = y1

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
      }}
    >
      <svg width={dms.width} height={height}>
        <defs>
{/* some projections bleed outside the edges of the Earth's sphere */}
{/* let's create a clip path to keep things in bounds */}
          <clipPath id="Map__sphere">
            <path d={pathGenerator(sphere)} />
          </clipPath>
        </defs>

        <path
          d={pathGenerator(sphere)}
          fill="#f2f2f7"
        />

        <g style={{ clipPath: "url(#Map__sphere)" }}>
          {/* we can even have graticules! */}
          <path
            d={pathGenerator(d3.geoGraticule10())}
            fill="none"
            stroke="#fff"
          />

          {countryShapes.features.map((shape) => {
            return (
              <path
                key={shape.properties.subunit}
                d={pathGenerator(shape)}
                fill="#9980FA"
                stroke="#fff"
              >
                <title>
                  {shape.properties.name}
                </title>
              </path>
            )
          })}
        </g>
      </svg>
    </div>
  )
}`

const MapExample = ({ projectionName = "geoArmadillo" }) => {
  // grab our custom React hook we defined above in #Sizing
  const [ref, dms] = useChartDimensions({})

  // this is the definition for the whole Earth sphere
  const sphere = { type: "Sphere" }

  const projectionFunction =
    d3[projectionName] || d3GeoProjection[projectionName]
  const projection = projectionFunction().fitWidth(dms.width, sphere)
  const pathGenerator = d3.geoPath(projection)

  // size the svg to fit the height of the map
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)
  const height = y1

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
      }}
    >
      <svg width={dms.width} height={height}>
        <defs>
          {/* some projections bleed outside the edges of the Earth's sphere */}
          {/* let's create a clip path to keep things in bounds */}
          <clipPath id="Map__sphere">
            <path d={pathGenerator(sphere)} />
          </clipPath>
        </defs>

        <path d={pathGenerator(sphere)} fill="#f2f2f7" />

        <g style={{ clipPath: "url(#Map__sphere)" }}>
          {/* we can even have graticules! */}
          <path
            d={pathGenerator(d3.geoGraticule10())}
            fill="none"
            stroke="#fff"
          />

          {countryShapes.features.map((shape) => {
            return (
              <path
                key={shape.properties.subunit}
                d={pathGenerator(shape)}
                fill="#9980FA"
                stroke="#fff"
              >
                <title>{shape.properties.name}</title>
              </path>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

const projectionOptions = [
  "geoNaturalEarth1",
  "geoMercator",
  "geoEqualEarth",
  "geoArmadillo",
  "geoBaker",
  "geoBerghaus",
  "geoEckert3",
  "geoFahey",
  "geoGilbert",
  "geoGingery",
  "geoHealpix",
  "geoGinzburg9",
  "geoHufnagel",
  "geoInterruptedHomolosine",
  "geoInterruptedMollweideHemispheres",
  "geoPolyhedralWaterman",
]

const Term = ({ name = "wrapper" }) => (
  <b className={`Term Term--name-${name}`}>{name}</b>
)

export const DocsLink = ({ id, repo = "geo", children }) => (
  <Link href={`https://github.com/d3/d3-${repo}${!!id ? `#${id}` : ""}`}>
    {children || id ? <P>{children || `d3.${id}()`}</P> : <b>d3-{repo}</b>}
  </Link>
)
