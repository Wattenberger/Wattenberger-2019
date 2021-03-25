import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

import Code from "components/_ui/Code/Code"
import Aside from "components/_ui/Aside/Aside"
import List from "components/_ui/List/List"
import Link from "components/_ui/Link/Link"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import { P, CodeAndExample } from "./examples"

// import "./CreatingSVGElements.scss"

const CreatingSVGElements = () => {
  return (
    <div className="CreatingSVGElements">
      <p>
        When visualizing data in the browser, we'll usually want to work with{" "}
        <b>SVG</b> elements, since they're much more expressive and are
        absolutely positioned.
        <Aside>
          Not totally sure what <b>SVG</b> is?
          <br />
          Check out the{" "}
          <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/">
            MDN docs on SVG
          </Link>
          , or learn about{" "}
          <Link to="/blog/d3#drawing-svg-shapes">
            the different ways to draw in a web browser
          </Link>
          .
        </Aside>
      </p>
      <p>
        To start, we'll just render a simple <P>{`<svg>`}</P> element.
      </p>

      <CodeAndExample
        code={SvgCode}
        hasLineNumbers={false}
        fileName="Svg.jsx"
        example={(setHighlightedMarker) => (
          <>
            <Svg />
            <Aside>
              We've added a{" "}
              <span
                style={{
                  background: "gold",
                  padding: "0.3em 0.5em",
                  color: "darkgoldenrod",
                }}
              >
                gold
              </span>{" "}
              border so we can see our <P>{`<svg>`}</P> element.
            </Aside>
          </>
        )}
      />

      <p>Easy as 🥧, right?</p>

      <p>
        To visualize data, we'll want to represent data points as shapes. Let's
        start with a simple basic shape: a{" "}
        <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle">
          <P>{`<circle>`}</P>
        </Link>
        .
      </p>

      <CodeAndExample
        code={CircleWithD3Code}
        markers={[[2, 14], [4, 10], [5], [6, 7, 8, 9]]}
        fileName="Circle.jsx (d3 version)"
        theme="light"
        example={(getHighlightedMarkerProps) => (
          <>
            <CircleWithD3 />

            <p>Our component does a few new things:</p>
            <List
              className="D3AndReact__marked-list"
              items={[
                <div {...getHighlightedMarkerProps(0)}>
                  uses a <P>ref</P> to store a reference to our rendered{" "}
                  <P>{`<svg>`}</P> element
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  runs d3 code when the Component mounts
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  uses <P>d3.select()</P> to turn our <P>ref</P> into a{" "}
                  <b>d3 selection object</b>
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  uses our <b>d3 selection object</b> to <P>append</P> a{" "}
                  <P>{`<circle>`}</P> element
                </div>,
              ]}
              hasNumbers
            />
          </>
        )}
      />

      <p>
        But this is quite a lot of code to draw a single shape, isn't it? And
        aren't we supposed to use React <b>ref</b>s as sparingly as possible?
      </p>

      <Blockquote
        source={
          <Link to="https://reactjs.org/docs/refs-and-the-dom.html#when-to-use-refs">
            the React docs
          </Link>
        }
      >
        Avoid using refs for anything that can be done declaratively.
      </Blockquote>

      <p>
        Thankfully, all <b>SVG</b> elements have been supported in JSX since{" "}
        <Link to="https://reactjs.org/blog/2016/04/07/react-v15.html">
          React v15
        </Link>
        . Which means that creating a <P>{`<circle>`}</P> element is as easy
        as...
      </p>

      <CodeAndExample
        code={CircleCode}
        hasLineNumbers={false}
        // highlightedLines={[4, 5, 6, 7, 8]}
        fileName="Circle.jsx (React version)"
        example={(setHighlightedMarker) => <Circle />}
      />

      <p>
        What are the benefits of using standard JSX instead of running d3 code
        on mount?
      </p>

      <List
        items={[
          <>
            <b>
              <i>Declarative</i> instead of <i>imperative</i>
            </b>
            <br />
            The code describes <i>what</i> is being drawn, instead of <i>how</i>{" "}
            to draw it.
          </>,
          <>
            <b>Less code</b>
            <br />
            Our second <P>Circle</P> component has fewer than two-thirds the
            number of lines as our first iteration/
          </>,
          <>
            <b>Less hacky</b>
            <br />
            React is, chiefly, a rendering library, and has many optimizations
            to keep our web apps performant. When adding elements using d3,
            we're hacking around React, and essentially have to fight{" "}
            <i>against</i> those optimizations. Hacking around your JS framework
            is a recipe for future frustration, especially if the framework's
            API changes.
          </>,
        ]}
      />

      <p>This is all well and good, but what about rendering many elements?</p>
    </div>
  )
}

export default CreatingSVGElements

const Svg = () => {
  return <svg style={{ border: "2px solid gold" }} />
}

const Circle = () => {
  return (
    <svg>
      <circle cx="150" cy="77" r="40" />
    </svg>
  )
}

const CircleWithD3 = () => {
  const ref = useRef()

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    console.log(svgElement)
    svgElement.append("circle").attr("cx", 150).attr("cy", 70).attr("r", 50)
  }, [])

  return <svg ref={ref} />
}

export const SvgCode = `const Svg = () => {
  return (
    <svg style={{
      border: "2px solid gold"
    }} />
  )
}`

export const CircleWithD3Code = `const Circle = () => {
  const ref = useRef()

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement.append("circle")
      .attr("cx", 150)
      .attr("cy", 70)
      .attr("r",  50)
  }, [])

  return (
    <svg
      ref={ref}
    />
  )
}`

export const CircleCode = `const Circle = () => {
  return (
    <svg>
      <circle
        cx="150"
        cy="77"
        r="40"
      />
    </svg>
  )
}`
