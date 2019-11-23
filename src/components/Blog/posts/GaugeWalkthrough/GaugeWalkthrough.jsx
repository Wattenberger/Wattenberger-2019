import React, { useMemo, useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { useInterval } from "utils/utils.js"
import { format, area, arc, curveBasis, curveMonotoneY, scaleLinear } from "d3"
import { times, noop } from "lodash"
import Gauge from "components/_ui/Gauge/Gauge"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import List from "components/_ui/List/List"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import Code from "components/_ui/Code/Code"
import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import constructionGif from "components/_shared/construction.gif"
import { codeExamples } from "./codeBlocks"
import { Explorer, ExplorerWithTelescope } from "./svgs"

import "./GaugeWalkthrough.scss"

const GaugeWalkthrough = () => {
  const [codeIndex, setCodeIndex] = useState(0)
  const [code, Example, highlightedLines=[]] = codeExamples[codeIndex]
  const [units, setUnits] = useState("units")
  const [label, setLabel] = useState("label")
  const [value, setValue] = useState(50)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)

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
              At the end of this journey, we'll have created a gauge component in React.js. However, as our good friend Ursula Le Guin puts it,
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

        {/* <p>
          So why set off on this perilous journey?
        </p> */}

        <div className="GaugeWalkthrough__main">
          <div className="GaugeWalkthrough__sticky">
            <div className="GaugeWalkthrough__sticky__code">
              <Code fileName="Guage.jsx" highlightedLines={highlightedLines}>
                { code }
              </Code>
            </div>
            <div className="GaugeWalkthrough__sticky__example">
              <Example
                {...{units, label, value, min, max}}
              />
            </div>
          </div>

          <div className="GaugeWalkthrough__main__text">
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(0)
            }}>
              <p>
                Here we are, at the beginning of our journey. We've created a <P>Gauge.jsx</P> file, containing a blank functional React component.
              </p>

              <p>
                Whenever we create a new <P>{`<Gauge>`}</P>, we'll be able to customize it with five <b>props</b>:
              </p>

              <List items={[
                <>
                  <b>value</b> is the current value. This defaults to <P>50</P>,
                </>,<>
                  <b>min</b> is the minimum value for our metric. This defaults to <P>0</P>,
                </>,<>
                  <b>max</b> is the maximum value for our metric. This defaults to <P>100</P>,
                </>,<>
                  <b>label</b>,
                </>,<>
                  <b>units</b>,
                </>
              ]} />

              <p>
                Underneath our code, we'll show the output of our component.
              </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(1)
            }}>
              <p>
                Let's start by adding an <P>{`<svg>`}</P> component, which a nice pink border so we can see its dimensions.
              </p>

            <p>
              As we can see, the default size of a <P>{`<svg>`}</P> component is 300 pixels wide by 150 pixels tall.
            </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(2)
            }}>
              <p>
                We want our gauge to be <b>9em</b> wide. This will let our gauge scale with our text, so it will never look disproportionate with the labels that we'll add later.
              </p>

              <Aside>
                Unfamiliar with the unit <b>em</b>?
                <br />
                <b>em</b> is a CSS unit that scales with the <P>font-size</P>. Read more on <Link to="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#Relative_length_units">the MDN docs</Link>.
              </Aside>

              <p>
                We can think about the <P>{`<svg>`}</P> element as a <i>telescope into another world</i>. Our telescope defaults to a normal zoom level: one unit is the same as one pixel.
              </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(3)
            }}>
              <p>
                But we can zoom our telescope in or out. To set the zoom on our telescope, we'll use the <P>viewBox</P> property.
              </p>

              <p>
                <P>viewBox</P> takes four arguments:
              </p>

              <List items={[
                <><P>x</P> and <P>y</P> set the position of the <i>top, left</i> corner of our view box. Changing these values will <i>pan</i> our view.</>,
                <><P>width</P> and <P>height</P> set the number of "units" that are visible inside of our view box. Changing these values will <i>zoom</i> our view.</>,
              ]} />

              <p>
                Let's see what different telescope settings would look like for a simple <P>svg</P> with a purple circle at <P>[50, 50]</P>, with a radius of <P>40</P>.
              </p>

              <TelescopeExplorable />

              <p>
                For our gauge, let's simplify our math and focus our telescope on a simple 2 by 1 grid:
              </p>

              <Grid />

              <p>
                If this doesn't make much sense yet, stay tuned and you'll start seeing the benefits very soon.
              </p>

              <p>
                Alright, let's begin the next phase of our journey:
              </p>

              <h2>Drawing!</h2>

              <p>
                Drawing arcs in SVG is a complex feat, but we can lean on our trusty <Link to="https://github.com/d3/d3-shape#arcs"><P>d3.arc()</P></Link> method.
              </p>

              <p>
                <P>d3.arc()</P> will create an <i>arc generator</i>. We can configure our <i>arc generator</i> by calling different methods on it.
              </p>

              <p>
                For example, to set the inner radius of our arc generator, we would use its <P>.innerRadius()</P> method and pass the value we want.
              </p>

              <ArcExample />

              <p>
                To use our <i>arc generator</i>, we simply need to call it.
              </p>

            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(4)
            }}>
              <p>
                Let's see what that looks like for our gauge. To start, we'll create a grey background arc, to show the full range of our gauge.
              </p>

              <p>
                This arc will:
              </p>

              <List items={[
                <>be <P>0.35</P> units wide, with an inner circle <P>0.65</P> units from the center, and an outer circle <P>1</P> uni from the center</>,
                <>extend from -90 degrees (<P>-Math.PI / 2</P> radians) to +90 degrees (<P>Math.PI / 2</P> radians)</>,
                <>have rounded corners, to match our aesthetic</>,
              ]} />

              <p>
                Great! Calling an <i>arc generator</i>, with these settings spits out a string:
              </p>

              <Code size="s" doWrap={false} hasLineNumbers={false}>
                {`"M-0.8062257748298549,-8.326672684688674e-17A0.175,0.175,0,0,1,-0.9772433634301272,-0.2121212121212122A1,1,0,0,1,0.9772433634301272,-0.21212121212121218A0.175,0.175,0,0,1,0.8062257748298549,-2.7755575615628914e-17L0.8062257748298549,-2.7755575615628914e-17A0.175,0.175,0,0,1,0.6352081862295826,-0.13787878787878788A0.65,0.65,0,0,0,-0.6352081862295826,-0.13787878787878793A0.175,0.175,0,0,1,-0.8062257748298549,-8.326672684688674e-17Z"`}
              </Code>

              <p>
                This incantation is a set of instructions that can be passed to an SVG <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path"><P>{`<path>`}</P></Link> element.
              </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(5)
            }}>
              <p>
                In our render method, let's create a new <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path"><P>{`<path>`}</P></Link> element and pass these magic words to the <P>d</P> attribute.
              </p>

              <p>
                Perfect!
              </p>

                <p>
                  Note how our arc is perfectly centered in our <P>{`<svg>`}</P>. This is because <P>{`d3.arc()`}</P>, by default, centers the arc around <P>[0, 0]</P>.
                </p>

                <Grid />

                <p>
                  If we revisit our grid figure, we can see that the <P>[0, 0]</P> point is at the <i>bottom, center</i> of the <P>viewBox</P>. This perfectly frames the top half of our arc, which is the only part that we're interested in.
                </p>
            </ScrollEvent>

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
          </div>
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
      <Explorer iteration={iteration} />
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



const P = ({ children }) => (
  <code className="P">{ children }</code>
)


const viewBoxNames = ["x", "y", "width", "height"]
const viewBoxMinMax = [
  [-100, 100],
  [-100, 100],
  [0, 300],
  [0, 300],
]
const TelescopeExplorable = () => {
  const [viewBox, setViewBox] = useState([0, 0, 100, 100])

  return (
    <div className="TelescopeExplorable">
      <div className="TelescopeExplorable__controls">
        {viewBox.map((d, i) => (
          <div className="TelescopeExplorable__controls__item">
            <label>{ viewBoxNames[i] }</label>
            <Slider
              key={i}
              value={d}
              min={viewBoxMinMax[i][0]}
              max={viewBoxMinMax[i][1]}
              trackStyle={[{ backgroundColor: '#FFC312' }]}
              handleStyle={[{ borderColor: '#FFC312' }]}
              onChange={newValue => setViewBox([
                ...viewBox.slice(0, i),
                newValue,
                ...viewBox.slice(i + 1),
              ])}
              type="number"
            />

            <div className="TelescopeExplorable__controls__item__value">
              { d }
            </div>
          </div>
        ))}

        <div className="TelescopeExplorable__controls__summary">
          viewBox: "{ viewBox.join(" ") }"
        </div>
      </div>

      <div className="TelescopeExplorable__main">
        <div className="TelescopeExplorable__person">
          <ExplorerWithTelescope />
        </div>

        <div className="TelescopeExplorable__telescope"></div>

        <div className="TelescopeExplorable__svg">
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--nw">
            [{ viewBox.slice(0, 2).join(", ") }]
          </div>
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--ne">
            [{ +viewBox[0] + viewBox[2] }, { viewBox[1] }]
          </div>
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--sw">
            [{ viewBox[0] }, { +viewBox[1] + viewBox[3] }]
          </div>
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--se">
            [{ +viewBox[0] + viewBox[2] }, { +viewBox[1] + viewBox[3] }]
          </div>
          <svg width="15em" height="15em" viewBox={viewBox.join(" ")}>
            <circle cx="50" cy="50" r="40" fill="#9980FA" />
            <rect width="100" height="100" fill="none" stroke="cyan" />
            <text x="50" y="50" style={{textAnchor: "middle", fontSize: "10px"}}>[50, 50]</text>
            <circle cx="50" cy="50" r="1" />
          </svg>
        </div>
      </div>
    </div>
  )
}


const ArcExample = () => {
    const [params, setParams] = useState({
        innerRadius: 25,
        outerRadius: 40,
        startAngle: 0,
        endAngle: 5.5,
        cornerRadius: 20,
        padAngle: 0,
    })
    const {arcPath} = useMemo(() => {
        const arcPath = arc()
            .innerRadius(params.innerRadius)
            .outerRadius(params.outerRadius)
            .startAngle(params.startAngle)
            .endAngle(params.endAngle)
            .padAngle(params.padAngle)
            .cornerRadius(params.cornerRadius)
            ()

        return {
            arcPath
        }
    }, [params])
    return (
        <div className="ArcExample">
            <svg width="100" height="100">
                <path fill="cornflowerblue" d={arcPath} style={{transform: `translate(50%, 50%)`}} />
            </svg>

            <div className="ArcExample__controls">
                {["innerRadius", "startAngle", "outerRadius", "endAngle", "cornerRadius", "padAngle"].map(param => (
                    <div className="ArcExample__control" key={param}>
                        <div className="ArcExample__control__label">
                            { param }
                        </div>
                        <div className="ArcExample__control__value">
                            { params[param] }
                        </div>
                        <Slider
                            className="ArcExample__slider"
                            value={params[param]}
                            min={0}
                            max={param.endsWith("Angle") ? Math.PI * 2 : 50}
                            step={param == "cornerRadius" || param.endsWith("Angle") ? 0.1 : 1}
                            onChange={value => setParams({
                                ...params, [param]: value
                            })}
                            pushable
                        />
                    </div>
                ))}
            </div>
            <Expandy trigger="Show me the code" doHideIfCollapsed>
                <Code size="s" language="js">{`const arcGenerator = d3.arc()
  .innerRadius(${params.innerRadius})
  .outerRadius(${params.outerRadius})
  .startAngle(${params.startAngle})
  .endAngle(${params.endAngle})
  .padAngle(${params.padAngle})
  .cornerRadius(${params.cornerRadius})

const arcPath = arcPathGenerator()

** HTML **

<svg width="100" height="100">
  <path
    fill="cornflowerblue"
    d={arcPath}
    style="transform: translate(50%, 50%)"
  />
</svg>
`}</Code>
            </Expandy>
        </div>
    )
}

const Grid = () => (
  <div className="GaugeWalkthrough__grid">
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--nw">
      [-1, -1]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--ne">
      [1, -1]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--sw">
      [-1, 0]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--se">
      [1, 0]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--n">
      [0, -1]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--s">
      [0, 0]
    </div>
    <svg viewBox="-1 -1 2 1" style={{
      border: "1px solid pink"
    }}>
      <rect x="-1" y="-1" width="1" height="1" stroke="turquoise"  strokeWidth="0.05" fill="none" />
      <rect x="-1" y="0" width="1" height="1" stroke="turquoise"  strokeWidth="0.05" fill="none" />
      <rect x="0" y="-1" width="1" height="1" stroke="turquoise"  strokeWidth="0.05" fill="none" />
      <rect x="0" y="0" width="1" height="1" stroke="turquoise"  strokeWidth="0.05" fill="none" />
    </svg>
  </div>
)