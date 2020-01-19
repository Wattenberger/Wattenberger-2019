import React, { useMemo, useState } from "react"
import * as d3 from "d3"
import Gauge from "components/_ui/Gauge/Gauge"

export const codeExamples = [[
`import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  return (
    <div>
    </div>
  )
}

export default Gauge`,
({ value }) => {
  return (
    <div>
    </div>
  )
}
],[
`import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  return (
    <div>
      <svg style={{
        border: "1px solid pink"
      }}>
      </svg>
    </div>
  )
}

export default Gauge`,
({ value }) => {
  return (
    <div>
      <svg style={{
        border: "1px solid pink"
      }}>
      </svg>
    </div>
  )
},
d3.range(12, 16)
],[
`import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  return (
    <div>
      <svg
        width="9em"
        style={{
          border: "1px solid pink"
        }}>
      </svg>
    </div>
  )
}

export default Gauge`,
({ value }) => {
  return (
    <div>
      <svg
        width="9em"
        style={{
          border: "1px solid pink"
          }}>
      </svg>
    </div>
  )
},
[13]
],[
`import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}
        style={{
          border: "1px solid pink"
        }}>
      </svg>
    </div>
  )
}

export default Gauge`,
({ value }) => {
  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}
        style={{
          border: "1px solid pink"
          }}>
      </svg>
    </div>
  )
},
d3.range(14, 18)
],[
`import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  const backgroundArc = d3.arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    ()

  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}
        style={{
          border: "1px solid pink"
        }}>
      </svg>
    </div>
  )
}

export default Gauge`,
({ value }) => {
  const backgroundArc = d3.arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    ()

  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}
        style={{
          border: "1px solid pink"
          }}>
      </svg>
    </div>
  )
},
d3.range(10, 17)
],[
`import React from "react"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  const backgroundArc = d3.arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    ()

  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}
        style={{
          border: "1px solid pink"
        }}>
        <path
          d={backgroundArc}
          fill="#dbdbe7"
        />
      </svg>
    </div>
  )
}

export default Gauge`,
({ value }) => {
  const backgroundArc = d3.arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    ()

  return (
    <div>
      <svg
        width="9em"
        viewBox={[
          -1, -1,
          2, 1,
        ].join(" ")}
        style={{
          border: "1px solid pink"
          }}>
        <path
          d={backgroundArc}
          fill="#dbdbe7"
        />
      </svg>
    </div>
  )
},
d3.range(29, 33)
]]