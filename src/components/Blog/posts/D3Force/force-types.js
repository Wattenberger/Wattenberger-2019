import { forceCenter, forceCollide, forceManyBody, forceX, forceY, forceLink, forceRadial } from "d3-force"
import { fromPairs } from "lodash"
import forceRectCollide from "./rect-collide"
import forceBounds from "./bounds"

const forceTypes = [
  [
    "x",
    forceX,
    [
      {name: "x", min: -300, max: 300, defaultValue: 0, options: [
        { name: "buckets", value: (d, i) => (i % 5) * 150 - 300 },
        { name: "in a line", value: (d, i) => i * 5 - 300},
      ]},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ],
    "forceX",
  ],
  [
    "y",
    forceY,
    [
      {name: "y", min: -300, max: 300, defaultValue: 0, options: [
        { name: "buckets", value: (d, i) => (i % 5) * 150 - 300 },
        { name: "in a line", value: (d, i) => i * 5 - 300},
      ]},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ],
    "forceY",
  ],
  [
    "radial",
    forceRadial,
    [
      {name: "x", min: -300, max: 300, defaultValue: 0},
      {name: "y", min: -300, max: 300, defaultValue: 0},
      {name: "radius", min: 0, max: 300, defaultValue: 100},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ],
    "forceRadial",
  ],
  [
    "center",
    forceCenter,
    [
      {name: "x", min: -300, max: 300, defaultValue: 0},
      {name: "y", min: -300, max: 300, defaultValue: 0},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 1, format: "0.2f"},
    ],
    "forceCenter",
  ],
  [
    "collide",
    forceCollide,
    [
      {name: "radius", min: 0, max: 50, defaultValue: 13},
      {name: "iterations", min: 0, max: 50, defaultValue: 1},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 1, format: "0.2f"},
    ],
    "forceCollide",
  ],
  [
    "link",
    forceLink,
    [
      {
        name: "links", type: "array", getDefaultValue: getLinks, options: [
          {name: "random links", getValue: getLinks},
        ],
      },
      // {name: "id", min: 0, max: 50, defaultValue: (d, i) => i},
      {name: "distance", min: 0, max: 500, defaultValue: 30},
      {name: "iterations", min: 0, max: 50, defaultValue: 1},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ],
    "forceLink",
  ],
  [
    "many body", forceManyBody,
    [
      {name: "theta", min: 0, max: 50, defaultValue: 0.81},
      {name: "distanceMin", min: 0, max: 50, defaultValue: 1},
      {name: "distanceMax", min: 0, max: 1000, defaultValue: 500},
      {name: "strength", min: -100, max: 100, step: 1, defaultValue: -30, format: "0.2f"},
    ]
  ],
  [
    "rect collide", forceRectCollide,
    [
      // {name: "width", min: 0, max: 50, defaultValue: d => d["width"]},
      // {name: "height", min: 0, max: 50, defaultValue: d => d["height"]},
      {name: "padding", min: 0, max: 50, defaultValue: 13},
      {name: "iterations", min: 0, max: 50, defaultValue: 1},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 1, format: "0.2f"},
    ]
  ],
  [
    "bounds", forceBounds,
    [
      {name: "minX", min: -500, max: 0, defaultValue: -100},
      {name: "maxX", min: 0, max: 500, defaultValue: 100},
      {name: "minY", min: -500, max: 0, defaultValue: -100},
      {name: "maxY", min: 0, max: 500, defaultValue: 100},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 1, format: "0.2f"},
    ]
  ],
]

export default forceTypes

export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max - min))
let runningLinkIndex = 0
function getLinks() {
  return new Array(50).fill(0).map((_, i) => {
    const doStartNewChain = Math.random() < 0.1
    const sourceIndex = doStartNewChain ? getRandomInteger(0, 100) : runningLinkIndex
    const targetIndex = getRandomInteger(0, 100)
    runningLinkIndex = targetIndex
    return {
      source: sourceIndex,
      target: targetIndex,
    }
  })
}

export const forceTypesMap = fromPairs(
  forceTypes.map(type => ([
    type[0], type
  ]))
)