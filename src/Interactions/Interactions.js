import React, { useState } from 'react'
import * as d3 from "d3"
import Code from './../_ui/Code/Code'

import './Interactions.scss'
import ScrollEvent from '../_ui/ScrollEvent/ScrollEvent';
import List from '../_ui/List/List';
import InteractionEvents from './InteractionEvents';
import Link from '../_ui/Link/Link';
import Aside from '../_ui/Aside/Aside';

import bookImage from './../images/book.png';

// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsNone = require('!!raw-loader!./../examples/interactions/bars-none/chart.js').default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBars = require('!!raw-loader!./../examples/interactions/bars/chart.js').default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFull = require('!!raw-loader!./../examples/interactions/bars-full/chart.js').default


const Interactions = () => {
  const [highlightedLines, setHighlightedLines] = useState([])
  const [initialExpandedSteps, setInitialExpandedSteps] = useState()
  const [code, setCode] = useState(null)

  const onHighlightLinesLocal = lines => () => setHighlightedLines(lines)

  return (
    <div className={`Interactions Interactions--${!!code ? "code" : "start"}`}>
      <div className="Interactions__fixed-code">
        {!!code ? (
          <Code className="Interactions__code" highlightedLines={highlightedLines} initialExpandedSteps={initialExpandedSteps}>
            { code }
          </Code>
        ) : (
          <div className="Interactions__author">
            <div className="Interactions__author__text">
              <p>
                by <Link href="https://wattenberger.com">Amelia Wattenberger</Link>
                <br />
                on June 4<sup>th</sup>, 2019
              </p>
              <p>
                <b>
                  Learn how to visualize data with <Link href="https://fullstack.io/fullstack-d3">Fullstack D3 and Data Visualization</Link>
                </b>
              </p>
            </div>
            <Link href="https://fullstack.io/fullstack-d3">
              <img className="Interactions__author__book" alt="book" src={bookImage} />
            </Link>
          </div>
        )}
      </div>

      <div className="Interactions__content">
        <h1>
          Interactive Charts with D3.js
        </h1>
        <p>
          You did it! You grabbed a data set and visualized it, right here in the browser. Congratulations, that is no easy feat!
        </p>

        <p>
          We can do better, though. <b>This is 2019</b> and the web browser opens up a whole new realm of possibilities when visualizing data.
        </p>
        <List
          items={[
            <>If a user wonders what the exact value of a data point is, they can hover over it and find out</>,
            <>We can even show whole charts <i>within</i> a chart tooltip</>,
            <>We can tell a story with a chart, progressively revealing parts of it as the user scrolls</>,
          ]}
        />
        <p>
          Let's take advantage of these new possibilities and talk about how to take your chart to the next level.
        </p>

        <h2>
          Available triggers
        </h2>
        <p>
          We can interact with the content of a web page in a variety of ways: we can hover elements, click on buttons, and select text, to start.
        </p>

        <p>
          What are the possibilities with a since <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">DOM</Link> element? See how many events you can trigger on these circles:
        </p>

        <InteractionEvents />

        <p>
          There are a ton of native events, aren't there?! Did you find the <i>drag</i> events? Or the <i>double-click</i> event?
        </p>

        <Aside>
          Check out the full list of native events <Link href="https://developer.mozilla.org/en-US/docs/Web/Events#Mouse_events">on the MDN docs</Link>, starting with the mouse events.
        </Aside>

        <p>
          Any of these events can be used to trigger an interaction with a data visualization. The most common one is to show a tooltip with more information or detail -- we'll do a deep dive on tooltips further down.
        </p>

        <p>
          This is just the tip of the iceberg -- imagine letting users zoom into part of a chart with a <i>wheel</i> event. Or adding a custom context menu on right click.
        </p>

        <Aside>
          The interaction when a data visualization is updated as a reader reads through an article is commonly called <b>scrollytelling</b>. If you wanted to explore this further, Jim Vallandingham has compiled a great <Link href="https://vallandingham.me/scroll_talk/examples/">list of examples</Link>.
        </Aside>

        <h2>
          Adding tooltips to a histogram
        </h2>

        <p>
          Let's start out with a simple bar chart.
        </p>

        <iframe
          className="Interactions__iframe"
          title="example"
          src={"./../examples/interactions/bars-none/index.html"}
        />

        <p>
          This histogram shows the difference between hours estimated and actual hours for specific tasks.
        </p>

        <Aside>
          Our dataset is pulled from a <Link href="https://github.com/Derek-Jones/SiP_dataset">great repository from Derek M. Jones and Stephen Cullum</Link>, showing commercial development over ten years. The company used an Agile method, and the dataset covers 10,100 unique task estimates made by 22 developers.
        </Aside>

        <ScrollEvent isInViewChange={d => {
          if (d < 0) {
            setCode(null)
          } else {
            setCode(exampleBarsNone)
            setInitialExpandedSteps(null)
            setHighlightedLines([0])
          }
        }}>
          <p>
            On the right, you'll see the full code to create this histogram.
          </p>
        </ScrollEvent>

        <p>
          This code goes through the <b>7 basic steps of creating a chart</b> (as outlined in the <Link href="https://fullstack.io/fullstack-d3">Fullstack D3 and Data Visualization</Link> book).
        </p>

        <ol className="Interactions__steps">
          {steps.map((step, index) => (
            <li
              className="Interactions__step"
              // onMouseEnter={onHighlightLinesLocal(step.lines)}
              key={step.name}>
              <div className="Interactions__step__title">
                { step.name }
              </div>
              <div className="Interactions__step__description">
                { step.description }
              </div>
            </li>
          ))}
        </ol>

        <p>
          We won't go into each step in-depth -- <Link href="https://fullstack.io/fullstack-d3">download the first chapter of the book</Link> for free to learn more.
        </p>

        <h3>
          Adding a tooltip
        </h3>

        <ScrollEvent isInViewChange={d => {
            if (d < 1) setCode(exampleBarsNone)
            setInitialExpandedSteps(d >= 0 ? [7] : null)
            setHighlightedLines(d >= 0 ? [182, 183, 184] : [0])
        }} percentageThreshold={0.8}>
          <p>
            To start, we'll be fleshing out the last step: <b>Set up interactions</b>.
          </p>
        </ScrollEvent>

        <p>
          Our goal is to add tooltips to each of our bars, giving more information on hover.
        </p>

        <iframe
          className="Interactions__iframe"
          title="example"
          src={"./../examples/interactions/bars/index.html"}
        />

{/*
        <ScrollEvent isInViewChange={d => {
          if (d < 0) return

          setCode(exampleBars)
          setInitialExpandedSteps(
            d == -1 ? null
            : [7]
          )
          setHighlightedLines(
            d3.range(183, 186)
          )
        }}>
          <p style={{minHeight: "20em", marginBottom: "30em"}}>
            Check me out!
          </p>
        </ScrollEvent>

        <ScrollEvent isInViewChange={d => {
          setCode(d == -1 ? exampleBars : exampleBarsFull)
          setInitialExpandedSteps([7])
          if (d >= 0) setHighlightedLines(d3.range(175, 188))
        }}>
          <div style={{minHeight: "100vh"}}>
            <p>
              What if we made new bars for our hover events?
            </p>
            <iframe
              className="Interactions__iframe"
              title="example"
              src={"./../examples/interactions/bars-full/index.html"}
            />
          </div>
        </ScrollEvent> */}

      </div>

    </div>
  )
}

export default Interactions


const steps = [{
  name: "Access data",
  description: <>
    Look at the data structure and declare how to access the values we'll need
  </>,
  // lines: d3.range(3, 29),
},{
  name: "Create chart dimensions",
  description: <>
    Declare the physical (i.e. pixels) chart parameters
  </>,
  // lines: d3.range(30, 45),
},{
  name: "Draw canvas",
  description: <>
    Render the chart area and bounds element
  </>,
  // lines: d3.range(46, 68),
},{
  name: "Create scales",
  description: <>
    Create scales for every data-to-physical attribute in our chart
  </>,
  // lines: d3.range(69, 87),
},{
  name: "Draw data",
  description: <>
    Render your data elements
  </>,
  // lines: d3.range(88, 130),
},{
  name: "Draw peripherals",
  description: <>
    Render your axes, labels, and legends
  </>,
  // lines: d3.range(131, 168),
},{
  name: "Set up interactions",
  description: <>
    Initialize event listeners and create interaction behavior
  </>,
  // lines: d3.range(169, 224),
}]