import React, { useMemo, useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { useInterval } from "utils/utils.js"
import { format, area, arc, curveBasis, curveMonotoneY, scaleLinear } from "d3"
import { times } from "lodash"
import Gauge from "components/_ui/Gauge/Gauge"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import constructionGif from "components/_shared/construction.gif"

import "./GaugeWalkthrough.scss"

const GaugeWalkthrough = () => {
  return (
    <div className="GaugeWalkthrough">

      <JourneyBackground />
      <h1>
        Creating a Gauge in React
      </h1>

      <div className="GaugeWalkthrough__content">
        <div className="GaugeWalkthrough__section">
          <div className="GaugeWalkthrough__section__left">
            <p>
              Let's embark on a journey.
              <br />
              <br />
              At the end of this journey, we'll have created a gauge component in React.js. However, as our good friend Ursula K. Le Guin puts it,
            </p>

            <Blockquote source="Ursula K. Le Guin, The Left Hand of Darkness">
            It is good to have an end to journey toward; but it is the journey that matters, in the end.
            </Blockquote>
            <p>
              On this journey, we'll defeat dragons, monsters, and the most powerful foe of all: drawing arcs in the browser.
            </p>
          </div>

          <div className="GaugeWalkthrough__section__right" style={{width: "22em", flex: "0 0 22em"}}>
            <ReadingGauge />
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="note">
                        <img alt="under construction" src={constructionGif} />
                        <p>
                            Please excuse our dust! This blog post is under construction.
                            <br />
                            We'll be finishing up here in the next few weeks.
                        </p>
                    </div>



        <div className="GaugeWalkthrough__metrics">
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

          {/* <p>
            When is the best time to use a gauge?
          </p>

          <List items={[
            <>
              On a dashboard, so power users can quickly process the most important metrics
            </>,
            <>
              When users need to quickly
            </>,
          ]} />

          <p>

          </p>

        <div className="GaugeWalkthrough__code">
          <Code fileName="Guage.jsx">
            { gaugeJs }
          </Code>
        </div> */}





      </div>
    </div>
  )
}

export default GaugeWalkthrough


const GaugeWalkthroughMetric = ({ name, min=0, max=100, label, units }) => {
  const [value, setValue] = useState(Math.floor(randomInRange(min, max)))

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

const randomInRange = (from, to) => Math.random()*(to-from)+from



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

const formatSeconds = d => d > 60 ? "more than 60!" : format(".0f")(d)

const ReadingGauge = () => {
  const [secondsSpent, setSecondsSpent] = useState(0)

  const initTime = useMemo(() => (
    new Date()
  ), [])

  useInterval(() => {
    setSecondsSpent((new Date() - initTime) / 1000)
  }, secondsSpent <= 61 ? 1000 : null)

  return (
    <Gauge
      value={secondsSpent}
      max={60}
      format={formatSeconds}
      label="Time spent reading"
      units="seconds"
    />
  )
}


const NUMBER_OF_POINTS_PER_MOUNTAIN = 5
const NUMBER_OF_MOUNTAINS = 6
const NUMBER_OF_CLOUDS = 6
const mountainAreaGenerator = area()
  .x(d => d[0])
  .y0(8)
  .y1(d => d[1])
  .curve(curveBasis)
const mountainRiverAreaGenerator = area()
  .x0((d, i) => d[0] - i * 0.03 + 0.01)
  .x1((d, i) => d[0] + i * 0.03 + 0.01)
  .y(d => d[1])
  .curve(curveBasis)
const mountainColors = scaleLinear()
  .domain([0, NUMBER_OF_MOUNTAINS])
  .range(["#ACC5DD", "#06051D"])

const JourneyBackground = () => {
  const [iteration, setIteration] = useState(0)

  const mountains = useMemo(() => (
    times(NUMBER_OF_MOUNTAINS, mountainI => {
      const MOUNTAIN_WIDTH = randomInRange(5, 20)
      const MOUNTAIN_X_START = randomInRange(-9, 6)
      const xScale = scaleLinear()
        .domain([0, NUMBER_OF_POINTS_PER_MOUNTAIN])
        .range([
          MOUNTAIN_X_START,
          MOUNTAIN_X_START + MOUNTAIN_WIDTH,
        ])
      const mountainsDimensions = times(NUMBER_OF_POINTS_PER_MOUNTAIN, pointI => [
          xScale(pointI),
          !pointI || pointI == NUMBER_OF_POINTS_PER_MOUNTAIN - 1
            ? 8
            : randomInRange(Math.max(2, mountainI - 3.5), mountainI),
        ]
      )
      const centerPoint = mountainsDimensions
        .filter(([x, y]) => x > 0 && x < 10)
        .sort((a, b) => a[1] - b[1])
        [0] || []
      const NUMBER_OF_RIVER_POINTS = Math.floor(randomInRange(6, 10))
      const riverYScale = scaleLinear()
        .domain([0, NUMBER_OF_RIVER_POINTS - 1])
        .range([centerPoint[1], 8])
      const riverDimensions = times(NUMBER_OF_RIVER_POINTS, i => [
        i ? randomInRange(centerPoint[0] - 2, centerPoint[0] + 2) : centerPoint[0],
        riverYScale(i),
      ])
      return [
        mountainAreaGenerator(mountainsDimensions),
        mountainRiverAreaGenerator(riverDimensions),
      ]
    })
  ), [iteration])

  const groundPath = useMemo(() => (
    area()
      .x(d => d[0])
      .y0(10)
      .y1(d => d[1])
      .curve(curveBasis)
      (times(4, i => [
        i * 4,
        randomInRange(4, 5),
      ]))
  ), [iteration])

  const roadPath = useMemo(() => (
    area()
      .x0((d, i) => i == 6 ? 0 : d[0] - Math.max(0.01, i - 1))
      .x1((d, i) => i == 6 ? 10 : d[0] + Math.max(0.01, i - 1))
      .y(d => d[1])
      .curve(curveBasis)
      (times(7, i => [
        randomInRange(2, 8),
        4 + i,
      ]))
  ), [iteration])

  const treesPath = useMemo(() => {
    const NUMBER_OF_PEAKS = Math.floor(randomInRange(20, 30))
    const TREES_X_START = randomInRange(-5, 10)
    const TREE_WIDTH = 0.2
    return [
      ...times(NUMBER_OF_PEAKS, i => [
        i ? "L" : "M",
        TREES_X_START + TREE_WIDTH * i,
        5,
        "L",
        TREES_X_START + TREE_WIDTH * (i + 0.5),
        randomInRange(3.5, 4.5),
      ].join(" ")),
      "L",
      TREES_X_START + TREE_WIDTH * NUMBER_OF_PEAKS,
      5,
    ].join(" ")
  }, [iteration])

  const clouds = useMemo(() => (
    times(NUMBER_OF_CLOUDS, cloudI => {
      // const NUMBER_OF_POINTS_PER_CLOUD = Math.floor(randomInRange(1, 4)) * 2 + 1
      const NUMBER_OF_POINTS_PER_CLOUD = Math.floor(randomInRange(3, 6))
      const CLOUD_HEIGHT = randomInRange(0.1, 1.6)
      const CLOUD_Y_POSITION = randomInRange(-4, 2)
      // const cloudGenerator = area()
      //   .x(d => d[0])
      //   .y0(CLOUD_Y_POSITION + CLOUD_HEIGHT)
      //   .y1(d => d[1] + CLOUD_Y_POSITION)
      //   .curve(curveBasis)
      const xScale = scaleLinear()
        .domain([0, NUMBER_OF_POINTS_PER_CLOUD])
        .range([0, randomInRange(1, 6)])
      return [
        `M 0 ${CLOUD_Y_POSITION + CLOUD_HEIGHT}`,
        ...times(NUMBER_OF_POINTS_PER_CLOUD, pointI => [
          "A",
          xScale(1) * 0.3, // rx
          randomInRange(2, CLOUD_HEIGHT - randomInRange(0.5, 1)) * 0.26, // ry
          0, // x-axis-rotation
          0, // large-arc-flag
          1, // sweep-flag
          xScale(pointI), // x
          pointI == (NUMBER_OF_POINTS_PER_CLOUD - 1)
            ? CLOUD_Y_POSITION + CLOUD_HEIGHT
            : CLOUD_Y_POSITION + CLOUD_HEIGHT - randomInRange(0.1, 0.6), // y
        ].join(" ")),
        // `L ${xScale(NUMBER_OF_POINTS_PER_CLOUD)} ${CLOUD_Y_POSITION + CLOUD_HEIGHT}`,
      ].join(" ")
      // return cloudGenerator(
      //   times(NUMBER_OF_POINTS_PER_CLOUD, pointI => [
      //     xScale(pointI),
      //     pointI % 2 ? randomInRange(0, CLOUD_HEIGHT - 0.5) : CLOUD_HEIGHT,
      //   ])
      // )
    })
  ), [iteration])

  return (
    <div className="JourneyBackground">
      <Explorer />
      <svg className="JourneyBackground__svg" viewBox="0 0 10 10" preserveAspectRatio="none" onClick={() => setIteration(iteration + 1)}>
        <defs>
          <clipPath id="JourneyBackground__ground">
            <path
              d={groundPath}
            />
          </clipPath>
          {mountains.map(([mountain], i) => (
            <clipPath id={`JourneyBackground__mountain--${i}`} key={i}>
              <path
                d={mountain}
              />
            </clipPath>
          ))}
          {times(NUMBER_OF_MOUNTAINS, i => (
            <linearGradient id={`JourneyBackground__mountain-color-${i}`} gradientTransform="rotate(90)" key={i} x1="-1.6" x2="0.5">
              <stop stopColor="#F3CCBC" offset="0" />
              <stop stopColor={mountainColors(i)} offset="100%" />
            </linearGradient>
          ))}
        </defs>
        <g className="JourneyBackground__clouds">
          {clouds.map((cloud, i) => (
            <path
              key={i}
              className="JourneyBackground__cloud"
              d={cloud}
            />
          ))}
        </g>
        <g>
          {mountains.map(([mountain, road], i) => (
            <React.Fragment key={i}>
              <path
                className="JourneyBackground__mountain"
                d={mountain}
                // fill={mountainColors(i)}
                fill={`url(#JourneyBackground__mountain-color-${i})`}
                />
              <path
                className="JourneyBackground__mountain-road"
                d={road}
                clipPath={`url(#JourneyBackground__mountain--${i})`}
                fillOpacity={i / 4}
              />
            </React.Fragment>
          ))}
        </g>
        <path
          className="JourneyBackground__ground"
          d={groundPath}
        />
        <path
          className="JourneyBackground__trees"
          d={treesPath}
        />
        <path
          className="JourneyBackground__road"
          d={roadPath}
          clipPath="url(#JourneyBackground__ground)"
        />
      </svg>
    </div>
  )
}

const Explorer = () => (
  <svg className="Explorer" width="279" height="417" viewBox="0 0 279 417" fill="none">
    <path d="M122.262 42.4901C117.654 37.0814 114.536 30.4529 115.057 23.0255C116.558 1.62498 146.349 6.33281 152.143 17.1339C157.938 27.9351 157.25 55.333 149.76 57.2635C146.774 58.0333 140.411 56.1475 133.935 52.2443L138 81H114L122.262 42.4901Z" fill="#79392c"/>
    <path d="M154.409 21.9836C154.171 20.5836 153.59 19.0288 153.122 17.7043C152.517 15.9967 151.603 14.4571 150.596 13.0061C148.701 10.2744 146.428 7.80749 143.918 5.76006C139.333 2.02023 133.497 -0.136915 127.757 0.563621C124.86 0.917296 122.047 2.02262 119.653 3.86238C117.489 5.52461 115.409 7.97155 112.608 8.14737C109.56 8.33851 106.766 5.64847 104.322 3.98708C101.566 2.1141 98.6342 0.749318 95.4132 0.218805C90.0173 -0.669642 84.9482 1.15342 81.2294 5.58049C77.2722 10.2916 74.3955 17.2003 76.9943 23.4425C77.4773 24.6028 78.0988 25.581 78.9907 26.3918C79.8086 27.1353 81.0579 27.9263 81.3895 29.1142C81.7418 30.3769 80.6895 32.006 80.2815 33.1454C79.6969 34.7778 79.2169 36.4913 79.3876 38.2656C79.6679 41.1795 81.4991 43.9612 83.4327 45.8765C85.4004 47.8254 87.8222 48.943 90.4089 49.4582C92.1361 49.8022 93.9013 49.992 95.6567 49.8628C96.5281 49.7988 97.2971 49.5567 98.1414 49.3642C98.9625 49.1769 99.4213 49.395 100.118 49.8453C103.354 51.9373 106.833 52.7467 110.57 52.4357C113.724 52.173 117.358 51.4087 119.931 49.248C122.788 46.8482 122.731 43.5391 122.059 40.0035C122.771 40.3565 124.742 40.5751 123.564 39.1681C123.098 38.6108 122.216 38.384 121.618 38.0563C120.921 37.6747 120.213 37.1814 119.672 36.5589C117.487 34.0454 119.694 28.93 122.44 28.0871C126.521 26.8347 127.434 32.6055 130.347 34.0982C132.022 34.9565 133.774 33.7834 135.029 32.5855C136.71 30.9809 137.855 28.8551 138.844 26.6918C139.659 24.9103 140.417 23.1038 141.248 21.3311C141.635 20.5033 142.978 18.1632 142.304 17.2272C145.226 16.6444 148.482 17.859 150.999 19.4517C152.039 20.1101 152.832 20.8361 153.387 21.9985C153.506 22.2475 153.765 22.9879 154.09 23.0183C154.695 23.0748 154.469 22.3354 154.409 21.9836Z" fill="#05112C"/>
    <path d="M110 178L146.631 304.227L163.86 399H181.153L163.891 178H110Z" fill="#64211c"/>
    <path d="M93.5377 178C96.0937 243.574 95.0857 279.34 94.5136 285.298C93.9415 291.256 90.6939 331.156 68.5637 401H86.55C115.858 333.997 126.089 294.096 129.45 285.298C132.812 276.5 142.739 240.734 157.233 178H93.5377Z" fill="#79392c"/>
    <path d="M109.214 178C118.742 221.435 135.222 290.768 158.653 386H183.946C185.814 288.254 177.867 223.92 164.105 178H109.214Z" fill="#C7C5E4"/>
    <path d="M93.4099 178C95.9132 243.574 89.4258 308.177 69.3305 387.021H96.3168C125.679 321.018 146.723 256.734 161.106 178H93.4099Z" fill="#DBDBE7"/>
    <path d="M66 414L66.9924 398C72.8029 399.699 80.0807 399.033 88.8257 396C98.2288 402.661 110.066 407.209 124.337 409.644L124.337 409.644C125.426 409.83 126.158 410.863 125.972 411.952C125.96 412.023 125.944 412.092 125.925 412.161L124.553 417H88.8257H67.9848L66 414Z" fill="#DBDBE7"/>
    <path d="M160 414L160.992 398C166.803 399.699 174.081 399.033 182.826 396C192.229 402.661 204.066 407.209 218.337 409.644L218.337 409.644C219.426 409.83 220.158 410.863 219.972 411.952C219.96 412.023 219.944 412.092 219.925 412.161L218.553 417H182.826H161.985L160 414Z" fill="#DBDBE7"/>
    <path d="M196 149.617L232.235 133.704C238.582 127.379 239.089 125.29 245 122C246.768 121.437 246.722 122.294 243.5 127C240.278 131.706 245.789 133.056 247.076 134.705C248.364 136.355 243.527 136.318 245 139C245.982 140.788 248.262 141.143 234.707 143.633L207.57 164.439L196 149.617ZM49.5083 154L70 158.066C49.3921 196.471 38.3404 216.826 36.845 219.13C33.4804 224.315 36.6197 233.817 37.7793 238.821C30.5044 240.515 33.3734 229.565 24.1672 231.851C15.7641 233.938 8.63936 239.293 0.803878 232.071C-0.159448 231.183 -0.864649 228.407 2.41982 226.984C10.6026 223.437 22.692 216.796 24.6523 214.218C27.3256 210.702 35.6109 190.63 49.5083 154Z" fill="#79392c"/>
    <path d="M125.695 77.332L134.342 75.8489C153.176 94.119 160.862 138.012 173.414 143.822C185.281 149.316 202.104 144 222.1 136.823L228.224 150.505C210.055 170.161 171.349 186.767 155.66 177.287C130.576 162.13 124.786 107.994 125.695 77.332Z" fill="#7567DA"/>
    <path d="M88 186C122.672 186 148.176 186 164.511 186C168.008 186 167.349 180.952 166.843 178.404C161.011 149.004 138.241 117.312 138.241 75.4607L116.172 72C97.9175 101.358 91.6048 137.505 88 186Z" fill="#DBDBE7"/>
    <path d="M80.3688 156.233C64.7714 184.368 51.6609 204.623 41.0374 217L25 213.859C35.3306 149.791 65.2466 102.504 114.748 72L115 72L123.486 72C143.299 139.537 148.761 184.537 139.872 207H71C72.0896 190.563 75.5834 173.181 80.3688 156.233H80.3688Z" fill="#8478DC"/>
    <path d="M271.336 75.2109C272.529 63.6745 264.145 53.3548 252.609 52.1612C241.072 50.9676 230.752 59.3521 229.559 70.8885" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
    <path d="M250.55 72.055L217 396.324" stroke="#C6D2DE" stroke-width="9" stroke-linecap="round"/>
    <path d="M241.275 131.425C241.445 128.761 247.99 128.553 250.664 128.781C251.64 128.974 254.408 128.171 253.531 131.595C252.91 134.016 241.104 134.089 241.275 131.425Z" fill="#79392c"/>
    <path d="M239.984 136.468C240.116 133.852 246.965 133.735 249.77 133.995C250.795 134.197 253.68 133.446 252.82 136.799C252.213 139.169 239.852 139.083 239.984 136.468Z" fill="#79392c"/>
    <path d="M240.265 139.82C240.71 137.7 246.301 138.475 248.552 139.044C249.36 139.339 251.805 139.092 250.674 141.721C249.873 143.58 239.821 141.939 240.265 139.82Z" fill="#79392c"/>
    <path d="M241.592 127.27C241.201 124.624 247.591 123.364 250.268 123.157C251.267 123.189 253.82 121.953 253.675 125.46C253.572 127.94 241.983 129.917 241.592 127.27Z" fill="#79392c"/>
    <path d="M249.362 119.83C248 117.5 241.088 119 239.404 121.203C236.5 125 234 125 234 133C234 134.921 238.5 129.5 242 123.5C243.34 121.203 250.724 122.16 249.362 119.83Z" fill="#79392c"/>
    </svg>
)