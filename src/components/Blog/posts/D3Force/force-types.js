import { forceCenter, forceCollide, forceManyBody, forceX, forceY, forceLink, forceRadial } from "d3-force"
import { fromPairs } from "lodash"
import forceRectCollide from "./rect-collide"

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
    ]
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
    ]
  ],
  [
    "radial",
    forceRadial,
    [
      {name: "x", min: -300, max: 300, defaultValue: 0},
      {name: "y", min: -300, max: 300, defaultValue: 0},
      {name: "radius", min: 0, max: 300, defaultValue: 100},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ]
  ],
  [
    "center",
    forceCenter,
    [
      {name: "x", min: -300, max: 300, defaultValue: 0},
      {name: "y", min: -300, max: 300, defaultValue: 0},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ],
    []
  ],
  [
    "collide",
    forceCollide,
    [
      {name: "radius", min: 0, max: 50, defaultValue: 13},
      {name: "iterations", min: 0, max: 50, defaultValue: 1},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 1, format: "0.2f"},
    ]
  ],
  [
    "link",
    forceLink,
    [
      {name: "links", defaultValue: []},
      {name: "id", min: 0, max: 50, defaultValue: 0},
      {name: "distance", min: 0, max: 50, defaultValue: 30},
      {name: "iterations", min: 0, max: 50, defaultValue: 1},
      {name: "strength", min: 0, max: 1, step: 0.05, defaultValue: 0.1, format: "0.2f"},
    ],
    []
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
      {name: "padding", min: 0, max: 50, defaultValue: 3},
      {name: "strength", min: -100, max: 100, step: 1, defaultValue: -30, format: "0.2f"},
    ]
  ],
]

export default forceTypes


export const forceTypesMap = fromPairs(
  forceTypes.map(type => ([
    type[0], type
  ]))
)