import React, { useState } from "react"
import { Helmet } from "react-helmet"
import * as d3 from "d3"
import _ from "lodash"
import Code from "./../_ui/Code/Code"

import "./Interactions.scss"
import ScrollEvent from "../_ui/ScrollEvent/ScrollEvent";
import LocalExample from "../_ui/LocalExample/LocalExampleLazy";
import List from "../_ui/List/List";
import InteractionEvents from "./InteractionEvents";
import Link from "../_ui/Link/Link";
import Aside from "../_ui/Aside/Aside";

import bookImage from "./../images/book.png";
import d3SelectionImage from "./../images/d3-selection.png";
import binsImage from "./../images/bins.png";
import Icon from "../_ui/Icon/Icon";
import { scrollTo } from "../utils";

// eslint-disable-next-line import/no-webpack-loader-syntax
const dataCsv = require("!!raw-loader!./../examples/interactions/data.csv").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBars = require("!!raw-loader!./../examples/interactions/bars/chart.js").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsHtml = require("!!raw-loader!./../examples/interactions/bars/index.html").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsCss = require("!!raw-loader!./../examples/interactions/bars/styles.css").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFull = require("!!raw-loader!./../examples/interactions/bars-full/chart.js").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFullHtml = require("!!raw-loader!./../examples/interactions/bars-full/index.html").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFullCss = require("!!raw-loader!./../examples/interactions/bars-full/styles.css").default


const Interactions = () => {
  const [highlightedLines, setHighlightedLines] = useState([])
  const [initialExpandedSteps, setInitialExpandedSteps] = useState()
  const [code, setCode] = useState(null)
  const [removedLines, setRemovedLines] = useState([])
  const [insertedLines, setInsertedLines] = useState([])
  // const [removedLinesCss, setRemovedLinesCss] = useState([])

  // const onHighlightLinesLocal = lines => () => setHighlightedLines(lines)

  const onScrollToSectionLocal = section => e => {
    e.preventDefault()
    window.history.pushState({}, '', `#${section}`);

    const y = document.querySelector(`#${section}`).getBoundingClientRect().top
      + document.documentElement.scrollTop
      - 150

    scrollTo(y, 100)
  }

  return (
    <div className={`Interactions Interactions⁠—${!!code ? "code" : "start"}`}>

      <Helmet>
          <meta charSet="utf-8" />
          <title>Interactive Charts with D3.js</title>
          <link rel="canonical" href="http://mysite.com/example" />
          <meta property="og:type" content="article" />
          <meta name="description" content="Learn how to make charts interactive using d3.js" />
      </Helmet>

      <WaveContainer />

      <div className="Interactions__fixed-code__wrapper">
        <div className="Interactions__fixed-code">
          {!!code && (
            <Code
              className="Interactions__code"
              fileName="interactions/-bars-start/chart.js"
              {...{highlightedLines, removedLines, insertedLines, initialExpandedSteps}}>
              { code }
            </Code>
          )}
        </div>
      </div>

      <div className="Interactions__content">

        <h1>
          Interactive Charts with D3.js
        </h1>

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

        <ScrollEvent isInViewChange={d => {
          setCode(null)
          setInitialExpandedSteps(null)
          setHighlightedLines([0])
          setRemovedLines([])
        }} hasIndicator={false}>
          <p>
            You did it! You grabbed a data set and visualized it, right here in the browser. Congratulations, that is no easy feat!
          </p>
        </ScrollEvent>

        <p>
          <b>This is 2019</b> and the web browser opens up a whole new realm of possibilities when visualizing data.
        </p>
        <List
          items={[
            <>If a user wonders what the exact value of a data point is, they can hover over it and find out</>,
            <>We can even show whole charts <i>within</i> a chart tooltip</>,
            <>We can tell a story with a chart, progressively revealing parts of it as the user scrolls</>,
          ]}
        />
        <p>
          Let’s take advantage of these new possibilities and talk about how to take your chart to the next level.
        </p>

        <p>
          Our journey today will go through the following steps, click one to jump ahead:
        </p>

        <List items={[
          <a href="#native-trigger-events" onClick={onScrollToSectionLocal("native-trigger-events")}>Native trigger events</a>,
          <a href="#adding-tooltips-to-a-histogram" onClick={onScrollToSectionLocal("adding-tooltips-to-a-histogram")}>Our chart</a>,
          <a href="#getting-set-up" onClick={onScrollToSectionLocal("getting-set-up")}>Getting set up</a>,
          <a href="#how-are-we-drawing-this-chart" onClick={onScrollToSectionLocal("how-are-we-drawing-this-chart")}>How are we drawing this chart?</a>,
          <a href="#listening-to-mouse-events" onClick={onScrollToSectionLocal("listening-to-mouse-events")}>Listening to mouse events</a>,
          <a href="#populating-our-tooltip" onClick={onScrollToSectionLocal("populating-our-tooltip")}>Populating our tooltip</a>,
          <a href="#positioning-our-tooltip" onClick={onScrollToSectionLocal("positioning-our-tooltip")}>Positioning our tooltip</a>,
          <a href="#finishing-tweaks" onClick={onScrollToSectionLocal("finishing-tweaks")}>Finishing tweaks</a>,
          <a href="#make-the-interaction-as-easy-as-possible" onClick={onScrollToSectionLocal("make-the-interaction-as-easy-as-possible")}>Make the interaction as easy as possible</a>,
          <a href="#taking-it-further" onClick={onScrollToSectionLocal("taking-it-further")}>Taking it further</a>,
        ]} />

        <Heading id="native-trigger-events">
          Native trigger events
        </Heading>
        <p>
          We can interact with the content of a web page in a variety of ways: we can hover elements, click on buttons, and select text, to start.
        </p>

        <p>
          What are the possibilities with a since <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">DOM</Link> element? See how many events you can trigger on these circles:
        </p>

        <InteractionEvents />

        <p>
          There are a ton of native events, aren’t there?! Did you find the <i>drag</i> events? Or the <i>double-click</i> event?
        </p>

        <Aside>
          Check out the full list of native events <Link href="https://developer.mozilla.org/en-US/docs/Web/Events#Mouse_events">on the MDN docs</Link>, starting with the mouse events.
        </Aside>

        <p>
          Any of these events can be used to trigger an interaction with a data visualization. The most common one is to show a tooltip with more information or detail ⁠— we’ll do a deep dive on tooltips further down.
        </p>

        <p>
          This is just the tip of the iceberg ⁠— imagine letting users zoom into part of a chart with a <i>wheel</i> event. Or adding a custom context menu on right click.
        </p>

        <Aside>
          The interaction when a data visualization is updated as a reader reads through an article is commonly called <b>scrollytelling</b>. If you wanted to explore this further, Jim Vallandingham has compiled a great <Link href="https://vallandingham.me/scroll_talk/examples/">list of examples</Link>.
        </Aside>

        <Heading id="adding-tooltips-to-a-histogram">
          Our chart
        </Heading>

        <p>
          Let’s start out with a simple bar chart.
        </p>

        <p>
          This histogram shows the difference between hours estimated and actual hours for specific tasks. Hovering over a bar triggers a tooltip that explains what the bar is, a few example tasks, and how many tasks fit into the bin.
        </p>

        <p>
          The tooltip even has a bar that shows what percent of the work was done by developers. Showing a chart <i>within</i> a tooltip can help users dive even further into a dataset, letting them explore additional metrics.
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
        />

        <Aside>
          Our dataset is pulled from a <Link href="https://github.com/Derek-Jones/SiP_dataset">great repository from Derek M. Jones and Stephen Cullum</Link>, showing commercial development over ten years. The company used an Agile method, and the dataset covers 10,100 unique task estimates made by 22 developers.
        </Aside>

        <Heading id="getting-set-up">Getting set up</Heading>

        <p>
          If you’d like to follow along, download the code <Link href="https://github.com/Wattenberger/blog/tree/master/src/examples/interactions">on Github</Link>.
        </p>

        <p>
          To get the code running:
        </p>

        <List items={[
          <>
            in your Terminal, install <Link href="https://github.com/tapio/live-server#readme">live-server</Link>
            <Code fileName="In your terminal" language="bash" hasLineNumbers={false}>npm install -g live-server</Code>
          </>,
          <>
            in your Terminal, start a server in the <P>examples/</P> folder
            <Code fileName="In your terminal" language="bash" hasLineNumbers={false}>live-server ⁠—open</Code>
          </>,
          <>your browser should open the example automatically, but if it doesn’t, navigate to <Link href="http://localhost:8080">localhost:8080</Link></>,
          <>this page should show a directory of folders. Click until you reach <P>/interactions/-bars-start</P>, or navigate to the url <Link href="http://localhost:8080/interactions/-bars-start/">localhost:8080/interactions/-bars-start/</Link></>,
        ]} hasNumbers />
        <div className="Interactions__trigger" />

        <ScrollEvent isInViewChange={d => {
          if (d < 0) {
            setCode(null)
          } else {
            setCode(exampleBars)
            setInitialExpandedSteps(null)
            setHighlightedLines([0])
            setRemovedLines(d3.range(182, 239))
          }
        }}>
          <p>
            <span className="desktop">On the right</span>
            <span className="mobile">Below</span>
            , you’ll see the full code to create the basic histogram.
          </p>
        </ScrollEvent>

        <p className="desktop">
          At various points in this article, we’ll update the code in the right panel. As you scroll, keep an eye on the <Icon name="code" className="Interactions__inline-icon" /> icons in the page’s left margin. When the <Icon name="code" className="Interactions__inline-icon" /> scrolls into the <span className="Interactions__trigger-example">rectangle on the right</span>, the code on the right will update to match the next step.
        </p>

        <p className="desktop">
          You can also click on the <Icon name="code" className="Interactions__inline-icon" /> to trigger the code to update.
        </p>

        <p>
          This code goes through the <b>7 basic steps of creating a chart</b> (as outlined in the <Link href="https://fullstack.io/fullstack-d3">Fullstack D3 and Data Visualization</Link> book).
        </p>

        <List className="Interactions__steps" items={
          steps.map((step, index) => (
            <div
              className="Interactions__step">
              <div className="Interactions__step__title">
                { step.name }
              </div>
              <div className="Interactions__step__description">
                { step.description }
              </div>
            </div>
          ))}
          hasNumbers
        />

        <p>
          The steps are grouped and collapsable in the code ⁠— if you want to learn about these in detail, <Link href="https://fullstack.io/fullstack-d3">download the first chapter of the book</Link> for free.
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([])
          setRemovedLines(d3.range(182, 239))
        }}>
          <p>
            We’ll be fleshing out the last step: <b>Set up interactions</b>. Our code draws the complete chart, but doesn’t yet trigger any tooltips.
          </p>
        </ScrollEvent>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: d3.range(29, 32),
            js: d3.range(182, 239)
          }}
        />

        <Heading id="how-are-we-drawing-this-chart">How are we drawing this chart?</Heading>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([5, 7])
          setHighlightedLines(d3.range(102, 111))
          setRemovedLines(d3.range(182, 239))
        }}>
          <p>
            First, let’s look at how we’re drawing our bars.
          </p>

          <p>
              In our <b>Draw data</b> step, we’re creating one group (<P>{"<g>"}</P> element) for each item in a <P>bins</P> array. Notice that we’re storing a <b>d3 selection object</b> containing these groups in the variable <P>binGroups</P>.
          </p>
        </ScrollEvent>


        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[5]}
            highlightedLines={d3.range(102, 111)}
            removedLines={d3.range(182, 239)}
          >{exampleBars}</Code>
        </div>


        <p>
          But what is a <b>d3 selection object</b>? Whenever we pass a CSS-selector-like string to <P>d3.select()</P> or to <P>d3.selectAll()</P>, we create a new <b>d3 selection object</b>.
        </p>
        <p>
          Matching DOM elements are stored in a list (represented under the <P>_groups</P> key). There will be other keys in this object, like the selection’s parents (in <P>_parents</P>).
        </p>

        <img alt="d3 selection object" src={d3SelectionImage} />

        <Aside>
          Read more about the <b>d3-select</b> module and selection objects in the <Link href="https://github.com/d3/d3-selection#d3-selection">d3 docs</Link>, or get a much more thorough explanation in <Link href="https://fullstack.io/fullstack-d3">Fullstack D3 and Data Visualization</Link>.
        </Aside>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([5, 7])
          setHighlightedLines(d3.range(112, 127))
          setRemovedLines(d3.range(182, 239))
        }}>
          Next, we then create a <P>{"<rect>"}</P> element for each group and set its position and size, calculated with our already created <P>xScale</ P> and <P>yScale</P>.
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[5]}
            highlightedLines={d3.range(112, 127)}
            removedLines={d3.range(182, 239)}
          >{exampleBars}</Code>
        </div>

        <Heading id="listening-to-mouse-events">Listening to mouse events</Heading>

        <p>
          Now that we have an idea of how we’re drawing each of our bars, we can start adding our tooltip.
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([181, 182])
          setRemovedLines(d3.range(182, 239))
        }}>
          <p>
            Let’s move back down to <b>Step 7</b>.
          </p>
        </ScrollEvent>

        <p>
          To show a tooltip when a user hovers a bar, we’ll need to trigger changes under two circumstances:
        </p>

        <List items={[
          <>the mouse <b>enters</b> a bar</>,
          <>the mouse <b>leaves</b> a bar</>,
        ]} hasNumbers />

        <p>
          Thankfully, <b>d3 selection objects</b> have an <Link href="https://github.com/d3/d3-selection#selection_on"><P>.on()</P> method</Link> that will execute a function when an event is triggered. <P>.on()</P> takes three parameters:
        </p>

        <List items={[
            <><b>typename</b>: the name of a supported <Link href="https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events">DOM event type</Link></>,
            <><b>listener</b> (optional): the function to execute when triggered</>,
            <><b>options</b> (optional): an object containing native event options, <Link href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters">for example <P>capture</P></Link></>,
          ]} hasNumbers
        />

        <p>
          For example, to log <P>"hi"</P> to the console when the body of a page is clicked, we could use the following code:
        </p>

        <Code hasLineNumbers={false}>
          {`d3.select("body").on("click", () => console.log("hi"))`}
        </Code>

        <Aside>
          Feel free to test this right here in this page’s Dev tools Javascript console ⁠— d3.js is already loaded globally on the page.
        </Aside>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(182, 192))
          setRemovedLines([186, ...d3.range(188, 234), 237])
        }}>
          <p>
            Let’s create some interactions! Using our <P>binGroups</P> selection, we’ll create one function to run <b>on mouse enter</b> and one function to run <b>on mouse leave</b>.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(182, 192)}
            removedLines={[186, ...d3.range(188, 234), 237]}
          >{exampleBars}</Code>
        </div>
{/*
        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            // js: d3.range(186, 240)
          }}
        /> */}

        <Heading id="populating-our-tooltip">Populating our tooltip</Heading>

        <p>
          If we look at our <P>index.html</P> file, we’ll see that we’ve created a <P>{`<div>`}</P> with an id of <P>"tooltip"</P>.
        </p>

        <Code
          language="html"
          fileName="interactions/-bars-start/index.html"
          size="s"
          highlightedLines={d3.range(12, 30)}
          doOnlyShowHighlightedLines
          doWrap={false}>
            { exampleBarsHtml }
          </Code>

          <Aside>
            A good general rule of thumb is to target <P>class</P>es with CSS selectors and <P>id</P>s with javascript.
          </Aside>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([186])
          setRemovedLines([...d3.range(188, 234), 237])
        }}>
          <p>
            Let’s create a <b>d3 selection object</b> that contains our tooltip element.
          </p>
        </ScrollEvent>

        <p>
          We’ll create this element outside of our <P>onMouseEnter</P> and <P>onMouseLeave</P> functions, so we don’t have to find it every time we move our mouse.
        </p>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(182, 192)}
            removedLines={[...d3.range(188, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([189])
          setRemovedLines([...d3.range(191, 234), 237])
        }}>
          <p>
            Next, let’s flesh out our <P>onMouseEnter</P> function. First, we’ll want to make our tooltip visible.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={[189]}
            removedLines={[...d3.range(191, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <p>
          Progress! Now our tooltip shows up when we hover a bar.
        </p>
        <p>
          It’ll stay in its default position (top, left) since we’re not yet setting its position.
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: [...d3.range(12, 15), ...d3.range(29, 32)],
            js: [...d3.range(191, 234), 237]
          }}
        />

        <p>
          Now we can start populating the different parts of our tooltip, starting with the title on top.
        </p>

        <p>
          In <P>index.html</P>, we can see that the title of our tooltip has an <P>id</P> of <P>"range"</P>.
        </p>

        <Code
          language="html"
          fileName="interactions/-bars-start/index.html"
          size="s"
          removedLines={[...d3.range(0, 12), ...d3.range(30, 60)]}
          highlightedLines={[15]}
          doKeepInitialLineNumbers
          doWrap={false}>
            { exampleBarsHtml }
          </Code>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([191])
          setRemovedLines([191, ...d3.range(193, 234), 237])
          setInsertedLines([])
        }}>
          <p>
            We can target this <P>{`<div>`}</P> by creating a <b>d3 selection object</b> using the string <P>"#range"</P> (<P>#</P> specifies that we’re looking for elements with a specific <P>id</P>).
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={[191]}
            removedLines={[191, ...d3.range(193, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <p>
          When we hover over a bar, we want the title of our tooltip to tell us the range of hours that are included. For example: <b>Over-estimated by 5 to 10 hours</b>. But how do we know what that range is for the bar we're hovering over?
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([187])
          setRemovedLines([191, ...d3.range(193, 234), 237])
          setInsertedLines([])
        }}>
          <p>
            The first parameter of our <P>onMouseEnter()</P> function is the specific data <i>bound to</i> the hovered element. We've named it <P>datum</P>.
          </p>
        </ScrollEvent>

        <p>
          <P>datum</P> will correspond to the item in the <P>bins</P> array that we used to create the hovered over bar.
        </p>

        <Aside>
          If you’re unfamiliar with d3 data binding, <Link href="https://bost.ocks.org/mike/join/">read more here</Link>.
        </Aside>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(191, 202)}
            removedLines={[...d3.range(203, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <p>
          Each item in our <P>bins</P> array contains:
        </p>

        <List items={[
          <>the list of tasks that fit inside of the bucket</>,
          <><b>x0</b>: the <i>smallest</i> number of hours included in the bucket</>,
          <><b>x1</b>: the <i>largest</i> number of hours included in the bucket (exclusive)</>,
        ]} />

        <img alt="bins" src={binsImage} />

        <p>
          Knowing this, we can find the range of hours for our hovered bar at <P>datum.x0</P> and <P>datum.x1</P>.
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(191, 200))
          setRemovedLines([...d3.range(191, 234), 237])
          setInsertedLines([{
            start: 190,
            code:
`    tooltip.select("#range")
       .text([
         "Over-estimated by",
         datum.x0,
         "to",
         datum.x1,
         "hours",
       ].join(" "))`
          }])
        }}>
          <p>
            We can change the text inside of this <P>{`<div>`}</P> by using the <b>d3 selection object's</b> method <P>{`.text()`}</P>. Let's piece together our statement by creating an array of strings and numbers, then glueing them into one string using <P>.join()</P>.
          </p>
        </ScrollEvent>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: [...d3.range(12, 15), ...d3.range(29, 32)],
            js: [...d3.range(191, 234), 237],
          }}
          insertedLines={{
            js: [{
              start: 190,
              code:
`    tooltip.select("#range")
        .text([
          "Over-estimated by",
          datum.x0,
          "to",
          datum.x1,
          "hours",
        ].join(" "))`
            }]
          }}
        />

        <p>
          Awesome! Now our tooltip's title updates as we move our mouse around.
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(191, 202))
          setRemovedLines([...d3.range(203, 234), 237])
          setInsertedLines([])
        }}>
        <p>
          The phrase <b>Over-estimated by -25 to -20 hours</b> is a little mind-bendy. Let's add some extra logic to handle under- and over-estimating differently. We can use <P>Math.abs()</P> to prevent from showing negative numbers.
        </p>
        </ScrollEvent>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: [...d3.range(12, 15), ...d3.range(29, 32)],
            js: [...d3.range(203, 234), 237]
          }}
        />

        <p>
          That's much better!
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(203, 224))
          setRemovedLines([...d3.range(224, 234), 237])
          setInsertedLines([])
        }}>

          <p>
            Let’s populate the rest of the tooltip.
          </p>
        </ScrollEvent>

        <p>
            This example is a little more in-depth, so feel free to breeze through these added lines. If you’re curious, feel free to implement them one-by-one to see how they populate the tooltip.
        </p>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(203, 224)}
            removedLines={[...d3.range(224, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <Aside>
          Notice how we’re using <P>.html()</P> instead of <P>.text()</P> to populate the <P>{`"#examples"`}</P> div’s contents.
          <br />
          <br />
          Using <P>.html()</P> will parse the passed string as HTML, instead of just adding the raw text. This is perfect here, since we want to add new lines using the <P>{`<br>`}</P> element.
        </Aside>

        <p>
          Great! Now we can see our tooltip updating as we hover over different bars:
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: [...d3.range(12, 15), ...d3.range(29, 32)],
            js: [...d3.range(224, 234), 237]
          }}
        />


        <Heading id="positioning-our-tooltip">Positioning our tooltip</Heading>

        <p>
          Let’s update the position of our tooltip to sit on top of the bar that we’re hovering over. This will help to reinforce the relationship between the bar and the extra information, as well as decreasing the amount that users have to move their eyes back and forth.
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([4, 7])
          setHighlightedLines(d3.range(81, 85))
          setRemovedLines([...d3.range(224, 234), 237])
          setInsertedLines([])
        }}>
          <p>
            If we look in <b>Step 4</b>, we created an <P>xScale</P> that converts hours over-estimated into an x-position.
          </p>
        </ScrollEvent>

        <Aside>
          Unfamiliar with d3 scales? Get the run-down in <Link href="https://fullstack.io/fullstack-d3">Fullstack D3 and Data Visualization</Link>.
        </Aside>

        <p>
            We can use our <P>xScale</P> to convert the <b>lower</b> and <b>upper</b> bounds of our hovered bin into x-positions.
        </p>

        <p>For example, <P>xScale(datum.x0)</P> will give us the x-position of the left side of our bin.</p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(224, 227))
          setRemovedLines([...d3.range(227, 234), 237])
          setInsertedLines([])
        }}>
          <p>
            To find the <i>middle</i> of our bar, we’ll want to add three numbers together:
          </p>
        </ScrollEvent>

        <List items={[
          <>the x-position of the <i>left</i> side of our bar</>,
          <>half the width of our bar (the x-position of the <i>right</i>of our bar, minus the x-position of the <i>left</i> side of our bar)</>,
          <>the size of our <i>left margin</i></>,
        ]} hasNumbers />

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(224, 227)}
            removedLines={[...d3.range(203227, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <p>We also need to find the y-position of our tooltip.</p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(227, 229))
          setRemovedLines([...d3.range(229, 234), 237])
          setInsertedLines([])
        }}>
          <p>
            To find the <i>top</i> of our bar, we’ll want to add two numbers together:
          </p>
        </ScrollEvent>

        <List items={[
          <>the y-position of the <i>top</i> of our bar</>,
          <>the size of our <i>top margin</i></>,
        ]} hasNumbers />

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(227, 229)}
            removedLines={[...d3.range(229, 234), 237]}
          >{exampleBars}</Code>
        </div>

        <p>Great! Now we just need to use our <P>x</P> and <P>y</P> to position our tooltip.</p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([230])
          setRemovedLines([...d3.range(230, 234), 237])
          setInsertedLines([{
            start: 229,
            code: "    tooltip.style(\"transform\", `translate(${x}px,${y}px)`)",
          }])
        }}>
          <p>
            We can move our tooltip element by setting its CSS <P>transform</P> property.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={[230]}
            removedLines={[...d3.range(230, 234), 237]}
            insertedLines={[{
              start: 229,
              code: "    tooltip.style(\"transform\", `translate(${x}px,${y}px)`)",
            }]}
          >{exampleBars}</Code>
        </div>

        <p>
          Our tooltip is moving now! But it isn’t aligning with the correct bars!
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: [...d3.range(12, 15), ...d3.range(29, 32)],
            js: [...d3.range(230, 234), 237],
          }}
          insertedLines={{
            js: [{
              start: 229,
              code: "tooltip.style(`transform`, `translate(${x}px,${y}px)`)",
            }]
          }}
        />

        <p>
          There are actually two things wrong here, let’s focus on the first:
        </p>

        <p>
          If we look at the CSS, our tooltip is <i>absolutely positioned</i>:
        </p>

        <Code fileName="interactions/-bars-start/styles.css" language="css" highlightedLines={[77, 78]} doOnlyShowHighlightedLines>
          {exampleBarsCss}
        </Code>

        <p>Absolutely positioned elements are positioned <i>relative to their containing block</i>. How are <i>containing blocks</i> created for an absolutely positioned element?</p>

        <p>Our tooltip will be positioned based on <i>the edge of the padding box of the nearest ancestor element</i> that has:</p>

        <List items={[
          <>a position value other than <P>static</P> (<P>fixed</P>, <P>absolute</P>, <P>relative</P>, or <P>sticky</P>).</>,
          <>a <P>transform</P> or <P>perspective</P> value other than none</>,
          <>a <P>will-change</P> value of <P>transform</P> or <P>perspective</P></>,
          <>A <P>filter</P> value other than none or a <P>will-change</P> value of <P>filter</P> (only on Firefox).</>,
          <>A <P>contain</P> value of <P>paint</P></>,
        ]} />

        <Aside>Read more about <i>containing blocks</i> <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block">in the MDN docs</Link>.</Aside>

        <p>Because none of these apply to any of our chart’s ancestor elements, our tooltip will be positioned relative to the <i>initial containing block</i> (basically what the <P>{`<html>`}</P> element covers).</p>

        <p>Instead, we want to position our tooltip based on the top, left corner of our chart’s <P>wrapper</P> element. Let’s give this element one of the properties in the list above: the easiest is to set the <P>position</P> to <P>relative</P>. This won’t have an effect on the element, since <P>relative</P> acts very similar to the default <P>static</P>.</p>

        <Code fileName="interactions/-bars-start/styles.css" language="css" highlightedLines={[12, 13, 14]} doOnlyShowHighlightedLines>
          {exampleBarsCss}
        </Code>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: d3.range(29, 32),
            js: [...d3.range(230, 234), 237],
          }}
          insertedLines={{
            js: [{
              start: 229,
              code: "tooltip.style(`transform`, `translate(${x}px,${y}px)`)",
            }]
          }}
        />

        <p>
          Something is else wrong here ⁠— our tooltip is moving to the top of our hovered bar, but we’re aligning the <b>top, left</b> corner.
        </p>

        <p>Instead, we want to align the <b>bottom, middle</b> edge to the top of our hovered bar.</p>

        <p>
          We want our tooltip to shift <b>left by 50% of its own width</b> and <b>up by 100% of its own height</b>. There are several ways to use CSS to position an element using percent, and each way uses the percent of a different value:
        </p>

        <List items={[
          <>
            <b><P>top</P> and <P>bottom</P></b>
            <div className="Interactions__step__description">
              percentage of the parent element’s width
            </div>
          </>,
          <>
            <b><P>left</P> and <P>right</P></b>
            <div className="Interactions__step__description">
              percentage of the parent element’s height
            </div>
          </>,
          <>
            <b><P>margin</P></b>
            <div className="Interactions__step__description">
              percentage of the parent element’s width (even the <P>top</P> and <P>bottom</P> margins)
            </div>
          </>,
          <>
            <b><P>transform: translate()</P></b>
            <div className="Interactions__step__description">
              percentage of the specified element’s height and width
            </div>
          </>,
        ]} />

        <p>
          Since we want to shift our tooltip by <i>its own height and width</i>, we’ll need to use the <P>transform: translate()</P> CSS property. But we’re already using it to set the overall position.
        </p>

        <p>
          Thankfully, we can use the CSS <P>calc()</P> function! CSS <P>calc()</P> lets you specify a value using multiple units. For example, an element with the rule <P>{`width: calc(100% + 20px)`}</P> will be 20 pixels wider than its context.
        </p>

        <Aside>
          Read more about CSS <P>calc()</P> in the <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/calc">MDN docs</Link>.
        </Aside>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(230, 235))
          setRemovedLines([237])
          setInsertedLines([])
        }}>
          <p>
            Let’s use <P>calc()</P> to also shift our tooltip <b>left by -50% of its width</b> and <b>up by 100% of its height</b>.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(230, 235)}
            removedLines={[237]}
          >{exampleBars}</Code>
        </div>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: d3.range(29, 32),
            js: [237],
          }}
        />

        <p>Perfect! Now our tooltip is correctly positioned above any bar that we hover.</p>

        <Heading id="finishing-tweaks">Finishing tweaks</Heading>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBars)
          setInitialExpandedSteps([7])
          setHighlightedLines([237])
          setRemovedLines([])
          setInsertedLines([])
        }}>
          <p>
            Our tooltip is sticking around, obscuring part of the chart. When our mouse leaves a bar, let’s remove the tooltip to clear the view.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={[237]}
          >{exampleBars}</Code>
        </div>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            css: d3.range(29, 32),
          }}
        />

        <p>Lastly, let’s highlight the bar that we’re hovering over, making it easier to focus on it.</p>
        <p>We <i>could</i> update its fill in our <P>onMouseEnter</P> and <P>onMouseLeave</P> functions, but there’s a simpler way.</p>

        <p>We can insert a CSS selector in our <P>styles.css</P> file, targeting any <P>.bin</P> that is being <P>:hover</P>ed.</p>

        <Code fileName="interactions/-bars-start/styles.css" language="css" highlightedLines={d3.range(29, 32)} doOnlyShowHighlightedLines>
          { exampleBarsCss }
        </Code>

        <p>There we go!</p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
          }}
        />

        <p>
          It’s always good to be aware of multiple ways of doing things, and the benefits of each. My general rule of thumb is to use a CSS style when possible, especially when the change is more of a <i>decorative style</i> or uses SASS/LESS variables.
        </p>

        <Aside>
          It might be a good idea to read up on the possible CSS pseudo-classes - <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">here is a complete list in the MDN docs</Link>.
        </Aside>


        <Heading id="make-the-interaction-as-easy-as-possible">
          Make the interaction as easy as possible
        </Heading>

        <p>
          While the tooltip we just created is wonderful and helpful, it could be easier to trigger. The easier a chart is to interact with, the more likely a user is to interact with it.
        </p>

        <p>
          Until now, we’ve been using existing elements to trigger mouse events. What if we created <i>new</i> elements to trigger those events? This opens up tons of new possibilities.
        </p>

        <p>
          What would the ideal hover event be? <b>Let’s make it so that hovering anywhere on our chart will trigger a tooltip</b>.
        </p>

        <p>
          We’ll want to create new bars on top of our existing bins, but these will cover the full height of our <b>bounds</b>.
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsFullHtml}
          css={exampleBarsFullCss}
          js={exampleBarsFull}
          data={dataCsv}
          removedLines={{
            js: [...d3.range(182, 237), 229, 230, 235],
          }}
          insertedLines={{
            css: [{
              start: 164,
              code: "fill: #FFC312; stroke: blue;"
            }]
          }}
        />

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBarsFull)
          setInitialExpandedSteps([7])
          setHighlightedLines(d3.range(170, 183))
          setRemovedLines([108, 229, 230, 235])
          setInsertedLines([])
        }}>
          <p>
            At the top of our <b>Set up interactions</b> step, we’ll create these new bars and attach our listener events to them.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={d3.range(170, 183)}
            removedLines={[108, 229, 230, 235]}
          >{exampleBarsFull}</Code>
        </div>

        <p>
          We’re also ignoring the padding between our bars, making them flush against each other. This will prevent our tooltip from flickering when our mouse is in-between two bars.
        </p>


        <p>Since our new bars will have a default <P>fill</P> of black, let’s update that in our <P>styles.css</P> file so that they’re not obstructing our existing chart.</p>

        <Code fileName="interactions/-bars-start/styles.css" language="css" highlightedLines={[163, 164, 165]} doOnlyShowHighlightedLines>
          { exampleBarsFullCss }
        </Code>

        <p>Note that we want to keep the bars there to capture the pointer events, we just want them to have a transparent fill.</p>

        <p>Notice how much easier it is to interact with our chart now?</p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsFullHtml}
          css={exampleBarsFullCss}
          js={exampleBarsFull}
          data={dataCsv}
          removedLines={{
            js: [108, 229, 230],
          }}
        />

        We’ve lost our CSS <P>:hover</P> styles, though, since our new bars are capturing the hover events.

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBarsFull)
          setInitialExpandedSteps([5, 7])
          setHighlightedLines([108])
          setRemovedLines([229, 230, 235])
          setInsertedLines([])
        }}>
          <p>
            When we draw our <P>.bins</P> in our <b>Draw data</b> step, let’s give them a <P>key</P> attribute that we can target.
          </p>
        </ScrollEvent>

        <p>We’ll use the <b>index of the bin</b> as an identifier, since it will be consistent between both sets of bars.</p>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[5, 7]}
            highlightedLines={[108]}
            removedLines={[229, 230, 235]}
          >{exampleBarsFull}</Code>
        </div>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBarsFull)
          setInitialExpandedSteps([7])
          setHighlightedLines([186])
          setRemovedLines([229, 230, 235])
          setInsertedLines([])
        }}>
          <p>
            The second parameter <P>.on()</P> sends to its callback is the <b>index of the d3 selection object</b>.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={[186]}
            removedLines={[229, 230, 235]}
          >{exampleBarsFull}</Code>
        </div>

        <p>
          Let’s assign this index to the variable <P>index</P>.
        </p>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(exampleBarsFull)
          setInitialExpandedSteps([7])
          setHighlightedLines([229, 230, 235])
          setRemovedLines([])
          setInsertedLines([])
        }}>
          <p>
            At the bottom of our <P>onMouseEnter()</P> function, we can find the corresponding <P>.bin</P> and add a class to it: <P>hovered</P>.
          </p>
        </ScrollEvent>

        <div className="mobile Interactions__mobile-code">
          <Code size="s" doOnlyShowHighlightedLines
            fileName="interactions/-bars-start/chart.js"
            initialExpandedSteps={[7]}
            highlightedLines={[229, 230, 235]}
          >{exampleBarsFull}</Code>
        </div>

        <Aside>We’re using the <P>.classed()</P> method of our d3 selection object ⁠— read more about this method <Link href="https://github.com/d3/d3-selection#selection_classed">in the d3-selection docs.</Link>.</Aside>

        <p>
          Lastly, we’ll need to add one more rule to our <P>styles.css</P> file.
        </p>

        <p>Let’s want to add a <P>fill</P> to elements with a class of <P>hovered</P>, since we can no longer use the <P>:hover</P> pseudo-class.</p>

        <Code fileName="interactions/-bars-start/styles.css" language="css" highlightedLines={[29, 30, 31]} doOnlyShowHighlightedLines>
          { exampleBarsFullCss }
        </Code>

        <p>
          And voila! Now our bar changes color on hover again.
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsFullHtml}
          css={exampleBarsFullCss}
          js={exampleBarsFull}
          data={dataCsv}
          removedLines={{
          }}
        />

        <p>
          Take a minute to compare our new version (above) with the first version we made (below). Which one is more enjoyable to interact with?
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
          }}
        />


        <Heading id="taking-it-further">Taking it further</Heading>

        <ScrollEvent isInViewChange={d => {
          if (d !== 0) return
          setCode(null)
          setInitialExpandedSteps(null)
          setHighlightedLines([0])
          setRemovedLines([])
        }}>
          <p>
            In this exercise, we learned a few fundamental concepts:
          </p>
        </ScrollEvent>

        <List items={[
          <>how to trigger changes to our chart based on native event listeners</>,
          <>how to update the contents of a tooltip</>,
          <>how to position a tooltip</>,
          <>to create new elements to get more fluid interactions</>,
        ]} />

        <p>
          Stay tuned!
        </p>

        <p>
          In the next post, we’ll explore how to add tooltips to a scatter plot. To do this well, we’ll create extra elements similar to our last series of bars, but this is tricker to do with irregularly-spaced elements.
        </p>

        <p>
          After that, we’ll explore how to add a tooltip to a line chart. We’ll learn how to find the exact mouse position and search for the closest data point.
        </p>

        <p>
          I'll be posting updates on <Link href="http://twitter.com/wattenberger">Twitter</Link>, feel free to follow me if you want to be notified of updates. Or share any thoughts about this article. Thanks for reading!
        </p>




{/*
        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsHtml}
          css={exampleBarsCss}
          js={exampleBars}
          data={dataCsv}
          removedLines={{
            // js: d3.range(183, 240)
          }}
        /> */}

      </div>

    </div>
  )
}

export default Interactions


const steps = [{
  name: "Access data",
  description: <>
    Look at the data structure and declare how to access the values we’ll need
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


const WaveContainer = () => {
  const [iteration, setIteration] = useState(0)
  return (
    <Wave
      iteration={iteration}
      onMouseEnter={() => setIteration(Math.random())}
    />
  )
}
const points = 7
const Wave = () => {
  const [iteration, setIteration] = useState(0)
  const d = d3.area()
    .x((d, i) => i - 1)
    .y0(d => d)
    .y1(0)
    .curve(d3.curveBasis)(
    _.times(points + 2, i => Math.random())
  )
  return (
    <svg preserveAspectRatio="none" className="Wave" viewBox={`0 0 ${points} 1`} iteration={iteration} onMouseEnter={() => setIteration(Math.random())}>
      <defs>
        <linearGradient id="gradient" y1="1" x1="0" x2="1">
          <stop stopColor="#12CBC4" />
          <stop stopColor="#9980FA" offset="100%" />
        </linearGradient>
      </defs>
      <path fill="url(#gradient)" className="Wave__path" d={d} />
    </svg>
  )
}


{/* <p>
  It’s always good to be aware of multiple ways of doing things, and the benefits of each. There are several CSS properties that are <i>also</i> possible to set in HTML (called <b>presentation attributes</b>).
</p>

<Aside>
  See a list of <b>SVG presentation attributes</b> in <Link href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation">the MDN docs</Link>.
</Aside>

<p>
  A few of the benefits of using a <b>presentation attribute</b> are:
</p>

<List items={[
  <>they are <i>less specific</i> than linked CSS properties, making them more easily overrideable in a CSS file</>,
  <>they prevent "flash of unstyled SVG", which might happen before the CSS styles are loaded</>,
  <></>,
]} /> */}


const P = ({ children })=> (
  <code className="P">{ children }</code>
)

const Heading = ({ id, children }) => {
  const onClickHash = () => {
    window.location.hash = `#${id}`

  }

  return (
    <h2 className="Heading" id={id}>
      <div className="Heading__hash" onClick={onClickHash}>#</div>
      { children }
    </h2>
  )
}