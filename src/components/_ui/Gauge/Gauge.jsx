import React from "react"
import { arc, format as d3Format, scaleLinear } from "d3"

import "./Gauge.scss"

const baseArc = arc()
  .cornerRadius(1)
  ({
    innerRadius: 0.65,
    outerRadius: 1,
    startAngle: -Math.PI / 2,
    endAngle: Math.PI / 2,
  })

const colorScale = scaleLinear()
  .domain([0, 1])
  .range(["#dbdbe7", "#4834d4"])

const gradientSteps = colorScale.ticks(10)
  .map(value => colorScale(value))

const angleScale = scaleLinear()
  .domain([0, 1])
  .range([-Math.PI / 2, Math.PI / 2])
  .clamp(true)

const formatNumber = d3Format(",")

const Gauge = ({
  value=50,
  min=0,
  max=100,
  format=formatNumber,
  label,
  units,
}) => {
  const percentScale = scaleLinear()
    .domain([min, max])
    .range([0, 1])
  const percent = percentScale(value)

  const angle = angleScale(percent)

  const filledArc = arc()
    .cornerRadius(3)
    ({
      innerRadius: 0.65,
      outerRadius: 1,
      startAngle: -Math.PI / 2,
      endAngle: angle,
    })

  const markerLocation = getPositionFromPoint(
    angle,
    0.825,
  )

  return (
    <div className="Gauge">
      <svg className="Gauge__svg" viewBox={[
        -1, -1,
        2, 1,
      ].join(" ")}>
        <defs>
          <linearGradient
            id="Gauge__gradient"
            gradientUnits="userSpaceOnUse"
            x1="-1"
            x2="1"
            y2="0">
            {gradientSteps.map((color, i) => (
              <stop
                key={color}
                stopColor={color}
                offset={`${i * 100 / (gradientSteps.length - 1)}%`}
              />
            ))}
          </linearGradient>
        </defs>
        <path
          className="Gauge__background"
          d={baseArc}
        />
        <path
          className="Gauge__filled"
          d={filledArc}
        />
        <line
          className="Gauge__midpoint"
          y1={-1}
          y2={-0.5}
        />
        <circle
          className="Gauge__marker"
          cx={markerLocation[0]}
          cy={markerLocation[1]}
          r="0.2"
          fill={colorScale(percent)}
        />
        <path
            className="Gauge__arrow"
            transform={`rotate(${angle * (180 / Math.PI)}) translate(-0.2, -0.33)`}
            d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
        />
      </svg>

      <div className="Gauge__metric">
        { format(value) }
      </div>

      {!!label && (
        <div className="Gauge__label">
          { label }
        </div>
      )}

      {!!units && (
        <div className="Gauge__units">
          { units }
        </div>
      )}
    </div>
  )

}

export default Gauge


const getPositionFromPoint = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]
