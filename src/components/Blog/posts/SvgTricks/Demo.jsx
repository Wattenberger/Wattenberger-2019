import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import fromPairs from "lodash/fromPairs"
import { Leva, useControls } from "leva"
import {
  interpolateLab,
  hcl,
  scaleLinear,
  range,
  Delaunay,
  line,
  curveCatmullRomClosed,
  area, forceSimulation, forceX, forceY, forceCollide,
  color
} from "d3"
import svgpath from "svgpath"
import rawRandom from "canvas-sketch-util/random"
import Persp from "./perspective-transform"
import DemoCloud from "./DemoCloud"
import DemoMountains from "./DemoMountains"
import DemoToriiGate from "./DemoToriiGate"

const width = 100
const height = 150
const Random = rawRandom

const Demo = () => {
  const svgElement = useRef()
  const hasMounted = useRef(false)

  const [noiseString, setNoiseString] = useState("")
  const [noiseStringLarge, setNoiseStringLarge] = useState("")

  const currentSeed = useRef(0)

  const parsedParams = params.map((d) => ({ ...d, id: `fields--${d.name}` }))
  const controlParams = useMemo(() => {
    return fromPairs(parsedParams.map(param => {
      let values = {
        ...param,
        value: param.value,
      }
      if (values.max) values.min = values.min || 0
      return [param.name, values]
    }))
  }, [])

  const [inputs, setControls] = useControls(() => (controlParams))

  useEffect(() => {
    if (!hasMounted.current) return
    Object.keys(inputs).forEach((key) => {
      const value = inputs[key]
      localStorage.setItem(controlParams[key].id, value)
    })
    if (currentSeed.current !== inputs.seed) {
      Random.setSeed(inputs.seed)
      currentSeed.current = inputs.seed
    }
  }, [inputs])

  const getFromLocalStorage = async () => {
    if (typeof localStorage === "undefined") return
    parsedParams.forEach((param) => {
      let value = localStorage.getItem(param.id)
      if (typeof param["value"] === "number") value = +value
      if (typeof param["value"] === "boolean") value = value === "true"
      if (value) {
        setControls({ [param.name]: value })
      }
    })

    hasMounted.current = true
    Random.setSeed(`fields--${inputs["seed"]}`)
  }

  useEffect(() => {
    getFromLocalStorage()
  }, [])

  const {
    pickedColors, backgroundColors,
    clouds,
    fields,
    sun,
    birdsPosition,
    fieldsGroupPaths,
  } = useMemo(() => {
    const perspective = Persp(
      [0, 0, width, 0, width, height, 0, height],
      [
        0,
        0,
        width,
        0,
        width * inputs.skew,
        height * inputs.yStretch,
        -width * (inputs.skew - 1),
        height * inputs.yStretch,
      ],
    )
    const pickedColors = [Random.pick(fieldColors), Random.pick(fieldColors), Random.pick(colors)]
    const backgroundColors = [Random.pick(skyColors), Random.pick(skyColors)]

    const colorScale = scaleLinear()
      .domain([-2, 2])
      .range([pickedColors[0], pickedColors[1]])
      .interpolate(interpolateLab)
      .clamp(true)
    const cloudColorScale = scaleLinear()
      .domain([-1, 1])
      .range(["white", getLightenedColor(backgroundColors[0])])
      .interpolate(interpolateLab)
    const clouds = [
      ...range(0, inputs.numberOfClouds).map(() => {
        const x = Random.gaussian(width / 2, width / 4)
        const y = Random.gaussian(height * 0.6, height * 0.2)
        const color = cloudColorScale(Random.noise2D(x, y, inputs.noiseFreq, inputs.noiseAmp))
        return {
          x,
          y,
          color,
          size: "l",
        }
      }),
      ...range(0, inputs.numberOfCloudsMid).map(() => {
        const x = Random.gaussian(Random.chance(0.5) ? width * 0.1 : width * 0.8, width / 4)
        const y = Random.gaussian(height * 0.63, height * 0.001)
        const color = cloudColorScale(Random.gaussian(-0.7, 0.1))
        return {
          x,
          y,
          color,
          size: "s",
          type: "horizontal",
        }
      }),
      ...range(0, inputs.numberOfCloudsFore).map(() => {
        const x = Random.gaussian(Random.chance(0.5) ? 0 : width, width * 0.2)
        const y = Random.gaussian(height * 0.7, height * 0.1)
        const color = cloudColorScale(Random.gaussian(-0.7, 0.1))
        return {
          x,
          y,
          color,
          type: "horizontal",
        }
      }),
    ]

    const fieldSize = Math.sqrt((width * height) / inputs.numberOfFields)
    let points = range(0, inputs.numberOfFields).map(() => {
      const x = Random.gaussian(width / 2, width / 4)
      const y = Random.gaussian(height / 2, height / 4)
      const color = colorScale(Random.noise2D(x, y, inputs.noiseFreq, inputs.noiseAmp))
      return {
        x,
        y,
        r: fieldSize / 2,
        color,
      }
    })
    points = separateItems(points, 3)
    const voronoi = Delaunay.from(points.map((d) => [d.x, d.y])).voronoi([0, 0, width, height])
    const fields = points
      .map((d, i) => {
        let points = voronoi.cellPolygon(i)
        if (!points) return null
        points = points.map((d) => perspective.transform(...d))

        const centerOfPoints = getCenterOfPoints(points)
        const path =
          points &&
          svgpath(
            line()
              .x((d) => d[0])
              .y((d) => d[1])
              .curve(curveCatmullRomClosed.alpha(0.8))(points),
          )
            .translate(-centerOfPoints[0], -centerOfPoints[1])
            .scale(1, 1)
            .translate(centerOfPoints[0], centerOfPoints[1] + height * inputs.fieldsYOffset)
            .toString()
        return {
          ...d,
          points,
          path,
        }
      })
      .filter(Boolean)

    const sun = {
      x: Random.gaussian(width / 2, width / 4),
      y: Random.gaussian(height * 0.3, height * 0.1),
      r: Random.gaussian(width / 4, width * 0.1),
      color: "white",
    }

    const birdsPosition = [Random.range(0, width), Random.range(0, height * 0.6)]

    const fieldsGroupPaths = range(0, 3).map((i) => {
      const points = [
        [-width, height * 2],
        [-width, height * 0.4],
        ...range(0, 3).map((j) => {
          const x = Random.gaussian(width * (j * 0.3) + 1, width * 0.1)
          const y = Random.gaussian(
            height * inputs.fieldsYOffset + i * height * 0.06,
            height * 0.02,
          )
          return [x, y]
        }),
        [width * 2, height * 0.7],
        [width * 2, height * 2],
      ]

      const pathArea = area()
        .x((d) => d[0])
        .y0((d) => d[1])
        .y1(height)
        .curve(curveCatmullRomClosed.alpha(0.8))(points)

      return pathArea
    })
    return {
      pickedColors,
      backgroundColors,
      clouds,
      fields,
      sun,
      birdsPosition,
      fieldsGroupPaths,
    }
  }, [inputs])

  const createNoise = async () => {
    const noiseString = await getNoiseString(width * 8, width * 8, pickedColors[1], pickedColors[0], 0.3, Random)
    setNoiseString(noiseString)
    const noiseStringLarge = await getNoiseString(width * 0.9, width * 0.9, "#000000", "#ffffff", 0.96, Random)
    setNoiseStringLarge(noiseStringLarge)
  }
  useEffect(() => {
    createNoise()
  }, [inputs])

  return (
    <>
      <Leva />
      <svg
        style={{
          margin: "auto", width: "100%", maxHeight: "100%",
        }}
        viewBox={`0 0 ${width} ${height}`}
        ref={svgElement}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <defs>
          <filter id="cloud" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={inputs.cloudBlurStdev} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${inputs.cloudBlur1} ${inputs.cloudBlur2}`}
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          <clipPath id="skyClip">
            <rect x="0" y="0" width={width} height={height * inputs.fieldsYOffset} />
          </clipPath>

          <linearGradient id="background" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={backgroundColors[0]} />
            <stop offset="100%" stopColor={backgroundColors[1]} />
          </linearGradient>
          <linearGradient id="atmosphere" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={backgroundColors[0]} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="vertical" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <linearGradient id="vertical-reverse" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <radialGradient id="radial" cx={0} cy={0} r="60%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </radialGradient>
          <mask
            id="gradient"
            x="0"
            y="0"
            width="100"
            height={height}
            maskUnits="userSpaceOnUse"
            preserveAspectRatio="none"
          >
            <rect x="0" y="0" width="100" height={height} fill="url(#vertical)" />
          </mask>
          <mask
            id="gradient-reverse"
            maskContentUnits="objectBoundingBox"
            x="0"
            y="0"
            width="1"
            height="1"
          >
            <rect x="0" y="0" width="1" height="1" fill="url(#vertical-reverse)" />
          </mask>
          <mask id="gradient2" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
            <rect x="0" y="0" width="1" height="1" fill="url(#vertical)" />
          </mask>
          <pattern
            id="noise-pattern"
            viewBox="0 0 1 1"
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="none"
            patternUnits="objectBoundingBox"
          >
            <image
              href={noiseString}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
            />
          </pattern>
          <pattern
            id="noise-pattern-speckles"
            viewBox="0 0 1 1"
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="none"
            patternUnits="objectBoundingBox"
          >
            <image
              href={noiseStringLarge}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
            />
          </pattern>
          <pattern
            id="noise-pattern-color"
            viewBox="0 0 1 1"
            x="0"
            y="0"
            width="1"
            height="1"
            preserveAspectRatio="none"
            patternUnits="objectBoundingBox"
          >
            <image
              href={noiseStringLarge}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
            />
            <rect
              x="0"
              y="0"
              width="1"
              height="1"
              fill={pickedColors[2]}
              style={{ mixBlendMode: "color" }}
            />
          </pattern>
          <pattern
            id="noise-pattern-full"
            viewBox={`0 0 ${width} ${height}`}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            patternContentUnits="objectBoundingBox"
            preserveAspectRatio="none"
          >
            <image href={noiseString} x="0" y="0" width={width} height={height} preserveAspectRatio="none" />
          </pattern>


          <g id="fields">
            {fields.map(({ x, y, r, color, path }, i) => (
              <g key={i}>
                <path d={path} fill={color} />
                <g style={{ mask: "url(#gradient)" }}>
                  <path d={path} fill="url(#noise-pattern)" style={{ mixBlendMode: "color-burn" }} />
                </g>

                {Random.chance(0.2) && (
                  <path d={path} fill="url(#noise-pattern-speckles)" style={{ mixBlendMode: "screen" }} />
                )}
                {Random.chance(0.2) && (
                  <path d={path} fill="url(#noise-pattern-color)" style={{ mixBlendMode: "screen" }} />
                )}
              </g>
            ))}
          </g>

          {fieldsGroupPaths.map((path, i) => (
            <clipPath id={`fields-group-${i + 1}`} key={i}>
              <path d={path} />
            </clipPath>
          ))}
        </defs>

        <rect width={width} height={height} fill="url(#background)" />

        <circle cx={sun.x} cy={sun.y} r={sun.r} fill={sun.color} />

        <use href="#fields" />
        <rect
          width={width}
          height={height}
          fill={backgroundColors[1]}
          transform={`translate(0, -${height * 0.04})`}
          style={{
            clipPath: "url(#fields-group-1)",
            mixBlendMode: "screen",
            opacity: 0.2,
          }}
        />

        {range(0, 10).map(i => (
          <g key={i}>
            <g
              transform={`translate(${Random.gaussian(
                birdsPosition[0],
                width * 0.1,
              )}, ${Random.gaussian(birdsPosition[1], width * 0.1)})`}
            >
              <path
                d={svgpath(birdPath).scale(Random.range(0, 1)).toString()}
                fill={backgroundColors[1]}
                style={{
                  mixBlendMode: "multiply"
                }}
                opacity={Random.range(0, 1)}
              />
            </g>
          </g>
        ))}

        <use
          href="#fields"
          style={{
            clipPath: "url(#fields-group-2)",
          }}
          transform={`translate(0, -${height * 0.02})`}
        />
        <rect
          width={width}
          height={height}
          fill={backgroundColors[1]}
          transform={`translate(0, -${height * 0.02})`}
          style={{
            clipPath: "url(#fields-group-2)",
            mixBlendMode: "overlay",
            opacity: 0.1,
          }}
        />

        <g clipPath="url(#skyClip)">
          {clouds.slice(0, -inputs.numberOfCloudsMid - inputs.numberOfCloudsFore).map(({ x, y, color }, i) => (
            <DemoCloud {...{ x, y, color, Random, inputs }} key={i} />
          ))}
        </g>

        <DemoMountains {...{ Random, inputs, width, height, backgroundColors }} />

        {clouds.slice(-inputs.numberOfCloudsMid, -inputs.numberOfCloudsFore).map(({ x, y, color, size, type }, i) => (
          <g opacity="0.3" key={i}>
            <DemoCloud {...{ x, y, color, size, type, Random, inputs }} />
          </g>
        ))}

        <rect
          y={inputs.fieldsYOffset * height - 2}
          width={width}
          height={height * (1 - inputs.fieldsYOffset) + 2}
          fill="url(#atmosphere)"
          opacity="0.5"
          style={{ mixBlendMode: "screen" }}
        />

        <DemoToriiGate {...{ Random, inputs }} colors={pickedColors} width={width} height={height} />

        <use href="#fields" style={{
          clipPath: "url(#fields-group-3)"
        }} />
        <rect
          width={width}
          height={height}
          fill={pickedColors[0]}
          style={{
            clipPath: "url(#fields-group-3)",
            mixBlendMode: "multiply",
            opacity: 0.1,
          }}
        />

        <rect width={width} height={height} fill="none" stroke="url(#background)" strokeWidth="12" />

        {clouds.slice(-inputs.numberOfCloudsFore).map(({ x, y, color }, i) => (
          <g opacity="0.2" key={i}>
            <DemoCloud {...{ x, y, color, Random, inputs }} />
          </g>
        ))}
      </svg>
    </>
  )
}
export default Demo


export const getOppositeColor = (color) => {
  const hclColor = hcl(color)
  hclColor.h += Random.gaussian(180, 20)
  hclColor.l = Random.gaussian(80, 9)
  hclColor.c = 55 - hclColor.c + Random.gaussian(0, 3)
  return hclColor.toString()
}
export const getLightenedColor = (color) => {
  const hclColor = hcl(color)
  hclColor.l = Random.gaussian(80, 9)
  hclColor.c += Random.gaussian(0, 20)
  return hclColor.toString()
}

const fieldColors = [
  "#20594C",
  "#F4B07C",
  "#446960",
  "#BEC689",
  "#5D8673",
  "#799390",
  "#EFDBB4",
  "#F3C5D2",
  // "#A4CC9C",
  "#716B59",
  "#3D8478",
  "#758369",
  "#E2E3DA",
  "#C9C77B",
  "#6F595A",
  "#DFC159",
  "#7A6165",
]
const skyColors = [
  "#AABBD0",
  "#B4D5D0",
  "#B6C7D7",
  "#253649",
  "#B8E2D7",
  "#7D70DF",
  "#C2D4DE",
  "#D6E8E6",
  "#83BBBE",
  "#BCC9CF",
  "#25415F",
  "#B2C1CA",
  "#B7BEE0",
  "#6E858E",
  "#859ED9",
  "#B9BCE2",
  "#2261F8",
  "#E3E8DF",
  "#384053",
  "#CDD7D9",
  "#EFE1DA",
  "#C0DCDF",
  "#C7E7E9",
  "#EFDDB9",
]
const birdPath = svgpath(
  "M2.75112 1.65667C2.30385 1.10445 1.12744 0 0 0C1.47526 0.587706 1.89155 2.03898 2.06147 2.66867C2.95102 2.49375 5 1.78411 5 0.104948C5 1.23238 3.50825 1.57421 2.75112 1.65667Z",
)
  .scale(0.6, 0.6)
  .toString()

export const separateItems = (items, numberOfTicks = 100) => {
  let movedItems = [...items]
  const simulation = forceSimulation(movedItems)
    .force('x', forceX(d => d.x).strength(0.05))
    .force('y', forceY(d => d.y).strength(0.05))
    .force('collide', forceCollide(d => d.r + 1))
    .stop()
  simulation.tick(numberOfTicks)
  return movedItems
}

export const getCenterOfPoints = points => {
  const x = points.reduce((a, b) => a + b[0], 0) / points.length
  const y = points.reduce((a, b) => a + b[1], 0) / points.length
  return [x, y]
}

export const snapToInterval = (value, interval) => {
  return Math.round(value / interval) * interval
}


export const colors = [
  "#CAE5EA",
  "#44465F",
  "#B1B4DC",
  "#214944",
  "#3F8692",
  "#6F73D9",
  "#208A7A",
  "#DBEE9D",
  "#4E3536",
  "#A9BBD1",
  "#7EA296",
  "#F4D3CE",
  "#75ADBB",
  "#8E7075",
  "#518EA1",
  "#30675F",
  "#8882AD",
  "#CEA9A9",
  "#B75508",
  "#E9C658",
  "#1A4F45",
  "#BFCCD9",
  "#8BB8A4",
  "#199D93",
  "#43435C",
  "#F8F0AE",
  "#956ADC",
  "#8D035A",
  "#E4E9AA",
  "#44827D",
  "#15326A",
  "#13798D",
  "#82C4B6",
  "#DFC663",
  "#915A1B",
  "#3F466C",
  "#D8E1E3",
  "#B4D7D6",
  "#8B86A4",
  "#EED3DC",
  "#6935FD",
  "#36374B",
  "#3B71FE",
  "#D8D9E1",
  "#275453",
  "#94D1CA",
  "#AFDBD7",
  "#4C4360",
  "#F0B278",
  "#162E5E",
  "#2E3950",
  "#E7E8E1",
  "#62194E",
  "#1D8E78",
]


export const blendingModes = [
  "source-over",
  "source-in",
  "source-out",
  "source-atop",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "normal",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]

let params = [
  { name: "seed", value: 0, max: 1300, step: 1 },
  // { name: "backgroundColor", value: "#0D0D0D" },
  { name: "blendMode", value: "color-burn", options: blendingModes },
  { name: "bgBlendMode", value: "color-burn", options: blendingModes },
  { name: "cloudBlendMode", value: "screen", options: blendingModes },
  { name: "numberOfFields", value: 174, max: 300, step: 1 },
  { name: "numberOfClouds", value: 20, max: 30, step: 1 },
  { name: "numberOfCloudsMid", value: 3, max: 8, step: 1 },
  { name: "numberOfCloudsFore", value: 3, max: 8, step: 1 },
  { name: "numberOfCloudPuffs", value: 16, max: 30, step: 1 },
  { name: "numberOfMountains", value: 4, max: 30, step: 1 },
  { name: "cloudPuffR", value: 7.5, max: 20, step: 0.01 },
  { name: "noiseFreq", value: 0.01, max: 0.6, step: 0.001 },
  { name: "noiseAmp", value: 3.25, max: 10, step: 0.001 },
  { name: "yStretch", value: 1.21, max: 3, step: 0.001 },
  { name: "skew", value: 6.2, max: 10, step: 0.001 },
  { name: "fieldsYOffset", value: 0.68, max: 1, step: 0.001 },
  { name: "cloudBlurStdev", value: 1.19, max: 3, step: 0.0001 },
  { name: "cloudBlur1", value: 9.89, max: 50, step: 0.0001 },
  { name: "cloudBlur2", value: -7.367, min: -50, max: 50, step: 0.0001 },
  // { name: "cloudFrequency", value: 0.01, max: 0.1, step: 0.0001 },
  // { name: "cloudBlur", value: 0.01, max: 3, step: 0.01 },
  // { name: "cloudOctaves", value: 0.01, min: -1, max: 6, step: 1 },
  // { name: "cloudTurbulence", value: 0.01, min: -1, max: 60, step: 0.001 },
  // { name: "k1", value: 0.01, min: -1, max: 6, step: 0.001 },
  // { name: "k2", value: 0.01, min: -1, max: 6, step: 0.001 },
]


export const getPointFromAngleAndDistance = (angle, distance) => {
  return [distance * Math.cos(angle), distance * Math.sin(angle)]
}

const getNoiseString = async (width, height, color1, color2, chance, Random) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    const d3Color1 = color(color1)
    const color1Rgb = [d3Color1.r, d3Color1.g, d3Color1.b]
    const d3Color2 = color(color2)
    const color2Rgb = [d3Color2.r, d3Color2.g, d3Color2.b]

    const imageData = ctx.getImageData(0, 0, width, height)
    let data = imageData.data
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        let index = (y * width + x) * 4

        const colorIndex = Random.chance(chance)
        const colorRgb = colorIndex ? color1Rgb : color2Rgb

        data[index] = colorRgb[0]
        data[++index] = colorRgb[1]
        data[++index] = colorRgb[2]
        data[++index] = 255 // alpha
      }
    }

    ctx.putImageData(imageData, 0, 0)

    const noiseString = canvas.toDataURL()
    canvas.remove()

    resolve(noiseString)
  }).catch(e => {
    console.log(e)
  })
}