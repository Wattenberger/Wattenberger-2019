import React, { useEffect, useMemo, useRef, useState } from "react"
import * as d3 from "d3"

import Code from "components/_ui/Code/Code"
import Aside from "components/_ui/Aside/Aside"
import List from "components/_ui/List/List"
import Link from "components/_ui/Link/Link"
import { Blockquote, P, CodeAndExample } from "./examples"

const Axes = () => {
  return (
    <>
      <p>The d3.js API is expansive, and we can become reliant on it to do the heavy lifting for us. Especially with the several methods that will create several DOM elements for us.</p>
      <p>
        For example, the <P>.axisBottom()</P> method will create a whole chart axis in one line of code!
      </p>

      <CodeAndExample
        code={ChartAxisCode}
        markers={[
          [5, 6, 7],
          [2, 9, 17],
          [10],
          [11],
          [12],
        ]}
        fileName="Axis.jsx (d3 version)"
        theme="light"
        example={getHighlightedMarkerProps => (
          <>
            <br />

            <Axis />

            <p>
              So easy! All we need to do to create a bottom axis is:
            </p>

            <List className="D3AndReact__marked-list" items={[
              <div {...getHighlightedMarkerProps(0)}>
                create a scale that converts from the data values (<P>0 - 100</P>) to the corresponding physical location (<P>10px - 290px</P>)
                <Aside>
                  Not super familiar with <b>scales</b>?
                  <br />
                  <br />
                  Really understand them by working through <Link to="https://www.newline.co/fullstack-d3">Fullstack D3 and Data Visualization</Link>, or get the details in the <Link to="https://github.com/d3/d3-scale">technical docs</Link>
                </Aside>
              </div>,
              <div {...getHighlightedMarkerProps(1)}>
                store the <P>{`<svg>`}</P> element in a <P>ref</P> and create a <b>d3 selection object</b> containing it
              </div>,
              <div {...getHighlightedMarkerProps(2)}>
                pass our scale to <P>.axisBottom()</P> to create an <P>axisGenerator</P>
              </div>,
              <div {...getHighlightedMarkerProps(3)}>
                create a new <P>{`<g>`}</P> element to house our axis' DOM elements
              </div>,
              <div {...getHighlightedMarkerProps(4)}>
                <P>.call()</P> our <P>axisGenerator</P> on our new <P>{`<g>`}</P> element. This is effectively the same as the expression:
                <br />
                <Code hasLineNumbers={false}>
{`const newG = svgElement.append("g")
axisGenerator(newG)`}
                </Code>
                but it lets us keep the chain of d3 methods going
              </div>
            ]} hasNumbers />
          </>
        )}
      />

      <p>
        Well that was pretty easy, wasn't it? Unfortunately, we would prefer to keep things React-y (for all of the reasons mentioned above).
      </p>

      <p>
        So if we can't use <P>.axisBottom()</P> to create our axis DOM elements, what <i>can</i> we do?
      </p>

      <CodeAndExample
        code={ChartAxisReactCode}
        markers={[
          [3, 4, 5],
          [7],
          [8, 9, 10, 11],
          [16, 17, 18, 19],
          d3.range(20, 40),
        ]}
        fileName="Axis.jsx (React version)"
        example={getHighlightedMarkerProps => (
          <>
            <br />

            <ChartAxisReact />

            <p>
              While we don't want to use a d3 method that creates DOM elements (<P>.axisBottom()</P>), we <i>can</i> use the d3 methods that d3 uses internally to create axes!
            </p>

            <List className="D3AndReact__marked-list" items={[
              <div {...getHighlightedMarkerProps(0)}>
                create a scale that converts from the data values (<P>0 - 100</P>) to the corresponding physical location (<P>10px - 290px</P>)
              </div>,
              <div {...getHighlightedMarkerProps(1)}>
                use our d3 scale's <P>.ticks()</P> method

                <Aside>
                  The <P>.ticks()</P> method of a scale will return an array of approximately 10 equally-spaced values that span the scale's <P>domain</P>. Learn more in the <Link to="https://github.com/d3/d3-scale#continuous_ticks">d3 docs.</Link>
                </Aside>

                Our <P>xScale</P>'s <P>.ticks()</P> method will return:
                <br />
                <Code size="s" hasLineNumbers={false}>
                  {`[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`}
                </Code>
              </div>,
              <div {...getHighlightedMarkerProps(2)}>
                map over our array of tick values and create an object that contains the <P>value</P> and <P>xOffset</P> (converted using <P>xScale</P>)
              </div>,
              <div {...getHighlightedMarkerProps(3)}>
                create a <P>{`<path>`}</P> element that marks that top of our axis. It starts at <P>[9, 0]</P> and moves horizontally to <P>[290, 0]</P>
              </div>,
              <div {...getHighlightedMarkerProps(4)}>
                for each of our ticks, we want to create a <b>group</b> that is shifted the appropriate number of pixels to the right.

                <br />
                <br />
                Each of our groups will contain a tick <P>{`<line>`}</P> and <P>{`<text>`}</P> containing the tick value
              </div>
            ]} hasNumbers />
          </>
        )}
      />

      <p>
        Okay! So this is definitely more code. But that makes sense, since we're basically duplicating some of the d3 library code, in our own code base.
      </p>

      <p>
        But here's the thing: <i>our new code is way more readable</i> - we know what elements we're rendering just by looking at the <P>return</P> statement. Plus, we can extract all of this logic into a single <P>Axis</P> component. This we we can customize it however we like, without having to think about this extra logic again.
      </p>

      <p>
        What would a more re-useable <P>Axis</P> component look like?
      </p>

      <AxisPlayground />

      <p>
        Now, our <P>Axis</P> component really only works for axes at the bottom of a chart, at the moment. But hopefully this gives you enough of an idea of how easy it is to duplicate d3's axis drawing methods.
      </p>

      <Aside>
        For a full example that covers all axis orientations, check out <Link to="https://www.newline.co/fullstack-d3">Fullstack D3 and Data Visualization</Link>
      </Aside>

      <p>
        I use this method for recreating any d3 methods that create multiple elements. In addition to the usual benefits of using React to render elements (<b>declarative</b> and <b>less hacky</b>), I find that this code is easier for other developers who are less familiar with the d3 API to understand the code.
      </p>

      <p>
        We truly get the best of both worlds, since the d3 API surfaces many of its internal methods.
      </p>

    </>
  )
}

export default Axes


const AxisPlayground = () => {
  const [domain0, setDomain0] = useState(0)
  const [domain1, setDomain1] = useState(100)
  const [range0, setRange0] = useState(10)
  const [range1, setRange1] = useState(290)

  return (
    <CodeAndExample
      code={ChartAxisReactComponentCode}
      markers={[
        [10, 11, 12, 13, 14, 15, 16, 17, 19],
        [25, 26],
        [32, 33, 34, 35, 36, 37],
      ]}
      fileName="Axis.jsx (React version)"
      example={getHighlightedMarkerProps => (
        <>
          <br />
          <p>
            Our <P>Axis</P> component will take two props: <P>domain</P> and <P>range</P>.
          </p>
          <div className="D3AndReact__inputs__note">Try updating the props values:</div>
          <div className="D3AndReact__inputs">
            <div className="D3AndReact__inputs__row">
              <div className="D3AndReact__inputs__row__label">domain: </div>
              [
              <input value={domain0} onChange={e => setDomain0(+e.target.value)} type="number" />
              ,
              <input value={domain1} onChange={e => setDomain1(+e.target.value)} type="number" />
              ]
            </div>
            <div className="D3AndReact__inputs__row">
              <div className="D3AndReact__inputs__row__label">range: </div>
              [
              <input value={range0} onChange={e => setRange0(+e.target.value)} type="number" />
              ,
              <input value={range1} onChange={e => setRange1(+e.target.value)} type="number" />
              ]
            </div>
          </div>

          <ChartAxisReactComponent
            domain={[domain0, domain1]}
            range={[range0, range1]}
          />

          <p>
            We really didn't have to make many changes here! Let's look at the main updates:
          </p>

          <List className="D3AndReact__marked-list" items={[
            <div {...getHighlightedMarkerProps(0)}>
              we check the range to dynamically change the number of ticks that we're aiming for (which we can set by passing the number to <P>.ticks()</P>).
              <br />
              <Aside>Note that <P>.ticks()</P> will aim for the passed number of ticks, but will also defer to friendlier, round numbers. For example, you could pass <P>10</P> but end up with 12 ticks.</Aside>

              We're aiming for one tick per 30 pixels, with a minimum of 1.
            </div>,
            <div {...getHighlightedMarkerProps(1)}>
              we want to re-calculate our <P>ticks</P> when our props change. We want to pay attention to the <b>values</b> of our <P>domain</P> and <P>range</P> arrays, instead of the array reference, so we'll <P>.join()</P> them into a string.
              <br />
              For example, we want to check a string of <P>"0-100"</P> instead of a <b>reference</b> to the array <P>[0, 100]</P>.
              <br />
              This will give us the ability to create the <P>domain</P> and <P>range</P> arrays within <P>Axis</P>'s parent component.
            </div>,
            <div {...getHighlightedMarkerProps(2)}>
              a small change, but potentially important. We'll add a duplicate <i>first</i> and <i>last</i> tick mark, in case our ticks don't cover the top or bottom of our <P>domain</P>.
              <br />
              <Link onClick={() => {
                setDomain0(0)
                setDomain1(110)
                setRange0(10)
                setRange1(150)
              }}>For example, <P>[0, 100]</P> and <P>[10, 150]</P>
              <br />(click to update example)</Link>
            </div>,
          ]} hasNumbers />
        </>
      )}
    />
  )
}


const Axis = () => {
  const ref = useRef()

  useEffect(() => {
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([10, 290])

    const svgElement = d3.select(ref.current)
    const axisGenerator = d3.axisBottom(xScale)
    svgElement.append("g")
      .call(axisGenerator)
  }, [])

  return (
    <svg height="30"
      ref={ref}
    />
  )
}

const ChartAxisCode =
`const Axis = () => {
  const ref = useRef()

  useEffect(() => {
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([10, 290])

    const svgElement = d3.select(ref.current)
    const axisGenerator = d3.axisBottom(xScale)
    svgElement.append("g")
      .call(axisGenerator)
  }, [])

  return (
    <svg
      ref={ref}
    />
  )
}`


const ChartAxisReact = () => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([10, 290])

    return xScale.ticks()
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [])

  return (
    <svg height="30">
      <path
        d="M 9.5 0 H 290.5"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { value }
          </text>
        </g>
      ))}
    </svg>
  )
}

const ChartAxisReactCode =
`const Axis = () => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([10, 290])

    return xScale.ticks()
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [])

  return (
    <svg>
      <path
        d="M 9.5 0.5 H 290.5"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={\`translate($\{xOffset}, 0)\`}
        >
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { value }
          </text>
        </g>
      ))}
    </svg>
  )
}`

const ChartAxisReactComponent = ({
  domain=[0, 100],
  range=[10, 290],
}) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(domain)
      .range(range)

    const width = range[1] - range[0]
    const pixelsPerTick = 30
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        width / pixelsPerTick
      )
    )

    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.join("-"),
    range.join("-")
  ])

  return (
    <svg height="30" style={{overflow: "visible"}}>
      <path
        d={[
          "M", range[0], 6,
          "v", -6,
          "H", range[1],
          "v", 6,
        ].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { value }
          </text>
        </g>
      ))}
    </svg>
  )
}

const ChartAxisReactComponentCode =
`const Axis = ({
  domain=[0, 100],
  range=[10, 290],
}) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(domain)
      .range(range)

    const width = range[1] - range[0]
    const pixelsPerTick = 30
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        width / pixelsPerTick
      )
    )

    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.join("-"),
    range.join("-")
  ])

  return (
    <svg>
      <path
        d={[
          "M", range[0], 6,
          "v", -6,
          "H", range[1],
          "v", 6,
        ].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={\`translate($\{xOffset}, 0)\`}
        >
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { value }
          </text>
        </g>
      ))}
    </svg>
  )
}`
