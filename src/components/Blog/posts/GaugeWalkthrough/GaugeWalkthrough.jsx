import React, { useState } from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Gauge from "components/_ui/Gauge/Gauge"
import Code from "components/_ui/Code/Code"

import "./GaugeWalkthrough.scss"

const GaugeWalkthrough = () => {
  const [value, setValue] = useState(50)

  return (
    <div className="GaugeWalkthrough">
      <h1>
        Gauges
      </h1>

      <div className="GaugeWalkthrough__content">
        <div className="GaugeWalkthrough__metrics">
          {/* <input value={value} onChange={e => setValue(+e.target.value)} type="number" /> */}

          <GaugeWalkthroughMetric
            label="Wind speed"
            units="meters per second"
          />
          <GaugeWalkthroughMetric
            max={20}
            label="Visibility"
            units="kilometers"
          />
          <GaugeWalkthroughMetric
            max={3000}
            label="Atmospheric Pressure"
            units="hectopascals"
          />

        </div>

        <div className="GaugeWalkthrough__section">
          <Code fileName="Guage.jsx">
            { gaugeJs }
          </Code>
          <Code fileName="Guage.scss" theme="light" language="css">
            { gaugeScss }
          </Code>
        </div>

      </div>
    </div>
  )
}

export default GaugeWalkthrough


const GaugeWalkthroughMetric = ({ name, min=0, max=100, label, units }) => {
  const [value, setValue] = useState(randomInRange(min, max))

  return (
    <div className="GaugeWalkthroughMetric">

      <Gauge
        {...{value, min, max, label, units}}
      />

      <h6>Update value</h6>

      <Slider
        className="GaugeWalkthrough__slider"
        {...{value, min, max}}
        onChange={setValue}
      />

    </div>
  )
}

const randomInRange = (from, to) => Math.floor(Math.random()*(to-from+1)+from)



const gaugeJs = `import React from "react"
import { arc, format, scaleLinear } from "d3"

import "./Gauge.scss"

const Gauge = ({
  value=50,
  min=0,
  max=100,
  label,
  units,
}) => {
  const percentScale = scaleLinear()
    .domain([min, max])
    .range([0, 1])
  const percent = percentScale(value)

  const angle = angleScale(percent)

  const filledArc = arc()
    .cornerRadius((d,i) => {console.log(d,i); return i < 3 ? 0 : 1})
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
                offset={\`\${i * 100 / (gradientSteps.length - 1)}%\`}
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
            transform={\`rotate(\${angle * (180 / Math.PI)} -1 -1) translate(-0.2, -0.33)\`}
            d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
        />
      </svg>

      <div className="Gauge__metric">
        { formatNumber(value) }
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

const formatNumber = format(",")

const getPositionFromPoint = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]`



const gaugeScss = `@import "src/styles/lib";

.Gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &__svg {
    width: 9em;
    height: 6em;
    overflow: visible;
  }

  &__midpoint {
    stroke: #fff;
    stroke-width: 0.027;
  }

  &__background {
    fill: #dbdbe7;
  }

  &__filled {
    fill: url(#Gauge__gradient);
  }

  &__marker {
    stroke: #292e31;
    stroke-width: 0.01;
    transition: all 0.1s ease-out;
  }

  &__arrow {
      transform-origin: 50% 100%;
      fill: #6a6a85;
      transition: all 0.1s ease-out;
  }

  &__metric {
    margin-top: 0.6em;
    font-size: 3em;
    font-weight: 900;
    font-feature-settings: 'zero', 'tnum' 1;
  }

  &__label {
    color: #8b8ba7;
    margin-top: 1em;
    font-size: 1.3em;
    line-height: 1.3em;
    font-weight: 700;
  }

  &__units {
    color: #8b8ba7;
    line-height: 1.3em;
    font-weight: 300;
  }
}`