import React, { useState } from 'react'
import * as d3 from "d3"
import Code from './../_ui/Code/Code'

import './Interactions.scss'
import ScrollEvent from '../_ui/ScrollEvent/ScrollEvent';
import List from '../_ui/List/List';
import InteractionEvents from './InteractionEvents';
import Link from '../_ui/Link/Link';

// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBars = require('!!raw-loader!./../examples/interactions/bars/chart.js').default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFull = require('!!raw-loader!./../examples/interactions/bars-full/chart.js').default


const Interactions = () => {
  const [highlightedLines, setHighlightedLines] = useState([])
  const [initialExpandedSteps, setInitialExpandedSteps] = useState()
  const [code, setCode] = useState(exampleBars)

  const onHighlightLinesLocal = lines => () => setHighlightedLines(lines)

  return (
    <div className="Interactions">
      <div className="Interactions__fixed-code">
        <Code highlightedLines={highlightedLines} initialExpandedSteps={initialExpandedSteps}>
          { code }
        </Code>
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
          Let's start out with a simple bar chart.
        </p>
        <p>
          The code on the right will create a histogram like this:
        </p>

        <iframe
          className="Interactions__iframe"
          title="example"
          src={"./../examples/interactions/bars/index.html"}
        />

        <p>
          This code goes through the <b>7 basic steps of creating a chart</b> (as outlined in the <b>Fullstack D3 and Data Visualization</b> book).
        </p>

        <ol>
          {steps.map((step, index) => (
            <li
              // onMouseEnter={onHighlightLinesLocal(step.lines)}
              key={step.name}>
              { step.name }
            </li>
          ))}
        </ol>

        <h3>
          Adding a tooltip
        </h3>

        <ScrollEvent isInViewChange={d => {
          if (d == 1) return

          setInitialExpandedSteps(
            d == -1 ? null
            : [7]
          )
          setHighlightedLines(
            d == -1 ? [0]
            : d3.range(183, 186)
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
        </ScrollEvent>

      </div>

    </div>
  )
}

export default Interactions


const steps = [{
  name: "Access data",
  lines: d3.range(3, 29),
},{
  name: "Create chart dimensions",
  lines: d3.range(30, 45),
},{
  name: "Draw canvas",
  lines: d3.range(46, 68),
},{
  name: "Create scales",
  lines: d3.range(69, 87),
},{
  name: "Draw data",
  lines: d3.range(88, 130),
},{
  name: "Draw peripherals",
  lines: d3.range(131, 168),
},{
  name: "Set up interactions",
  lines: d3.range(169, 224),
}]