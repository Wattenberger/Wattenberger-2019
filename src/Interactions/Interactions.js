import React, { useState } from 'react'
import * as d3 from "d3"
import Code from './../_ui/Code/Code'

import './Interactions.scss'

// eslint-disable-next-line import/no-webpack-loader-syntax
const example = require('!!raw-loader!./../examples/interactions/bars/chart.js').default


const Interactions = () => {
  const [highlightedLines, setHighlightedLines] = useState([])

  const onHighlightLinesLocal = lines => () => setHighlightedLines(lines)

  return (
    <div className="Interactions">
      <div className="Interactions__content">
        <h1>
          Interactive Charts with D3.js
        </h1>
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
            <li className="Interactions__step" onMouseEnter={onHighlightLinesLocal(step.lines)} key={step.name}>
              { step.name }
            </li>
          ))}
        </ol>
      </div>

      <div className="Interactions__fixed-code">
        <Code highlightedLines={highlightedLines}>
          { example }
        </Code>
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