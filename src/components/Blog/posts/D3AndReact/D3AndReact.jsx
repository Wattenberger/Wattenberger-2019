import React, { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import {useSpring, animated} from 'react-spring'
import { area, curveBasis, randomNormal } from "d3"
import { debounce, times, uniqueId } from "lodash"

import Code from "components/_ui/Code/Code"
import Expandy from "components/_ui/Expandy/Expandy"
import Aside from "components/_ui/Aside/Aside"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Link from "components/_ui/Link/Link"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import D3Modules from "components/Blog/posts/LearnD3/D3Modules"
import { P, SvgCode, CircleWithD3Code, CircleCode } from "./examples"
import metaImage from "./../d3.png";
import D3AndReactExample from "./D3AndReactExample";
import constructionGif from "./construction.gif";

import "./D3AndReact.scss"
import { sections } from "./examples"
import { useInterval } from "utils/utils"

const D3AndReact = () => {
    const [highlightedLines, setHighlightedLines] = useState([])
    const [initialExpandedSteps, setInitialExpandedSteps] = useState()
    const [code, setCode] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [removedLines, setRemovedLines] = useState([])
    const [insertedLines, setInsertedLines] = useState([])
    const ref = useRef()
    const [isScrolling, setIsScrolling] = useState([])

    useEffect(() => {
        const scrollingElem = document.scrollingElement || document.documentElement
        const onStopScrolling = () => {
            scrollingElem.classList.remove("is-scrolling")
        }
        const debouncedOnStopScrolling = debounce(onStopScrolling, 300)
        const onScroll = () => {
            const wasScrolling = scrollingElem.classList.contains("is-scrolling")
            if (!wasScrolling) scrollingElem.classList.add("is-scrolling")
            debouncedOnStopScrolling()
        }
        window.addEventListener("scroll", onScroll)

        return () => {
            window.removeEventListener("scroll", onScroll)

        }
    })

    return (
        <div className="D3AndReact" ref={ref}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>React + D3.js</title>
                <link rel="canonical" href="https://wattenberger.com/blog/react-and-d3" />
                <meta property="og:type" content="website" />
                <meta name="description" content="React introduced hooks one year ago, and they've been a game-changer for a lot of developers. There are tons of how-to introduction resources out there, but I want to talk about the fundamental mindset change when switching from React class components to function components + hooks." />
                <meta name="image" content={metaImage} />
            </Helmet>

            <div className="D3AndReact__fixed-code__wrapper">
                <div className="D3AndReact__fixed-code">
                {!!code && (
                    <Code
                        className="D3AndReact__code"
                        fileName={fileName}
                        {...{highlightedLines, removedLines, insertedLines, initialExpandedSteps}}>
                        { code }
                    </Code>
                )}
                </div>
            </div>

            <div className="D3AndReact__content">
                <div className="D3AndReact__centered">
                    <HeaderBackground />
                    <h1>
                        React + D3.js
                    </h1>

                    <p>
                        When I visualize data on the web, my current favorite environment is using <b>D3.js</b> inside of a <b>React.js</b> application.
                    </p>
                    <div className="D3AndReact__side-by-side D3AndReact__side-by-side--constrained">
                        <div className="D3AndReact__side-by-side__section">
                            <Expandy trigger="What is React.js?">
                                <p>
                                    <Link to="https://reactjs.org/">React.js</Link> is a JavaScript library that helps with building complex user interfaces. This website is written using React!
                                </p>
                                <p>
                                    I would recommend being familiar with React for this article. It might be worth running through <Link to="https://reactjs.org/tutorial/tutorial.html">the official tutorial</Link> or running through a book (<Link to="https://www.fullstackreact.com/">I've heard good things about this one</Link>) to make sure you don't stumble on anything in here!
                                </p>
                            </Expandy>
                        </div>
                        <div className="D3AndReact__side-by-side__section">
                            <Expandy trigger="What is D3.js?">
                                <p>
                                    <Link to="https://d3js.org">D3.js</Link> is the <i>de facto</i> library for visualizing data in the browser. It's basically just a collection of utility methods, but the API is enormous! To get a birds-eye view of the API, check out my post on <Link to="/blog/d3">How to Learn D3.js</Link>.
                                </p>

                                <p>
                                    D3.js is notorious for being hard to learn. If you're interested in learning or solidifying your knowledge, I tried to distill my knowledge into <Link to="https://newline.co/fullstack-d3">Fullstack Data Visualization and D3.js</Link>. Plus, the first chapter is free!
                                </p>
                            </Expandy>
                        </div>
                    </div>

                    <ScrollEvent isInViewChange={d => {
                        if (d > 0) return

                        setCode(null)
                        setInitialExpandedSteps(null)
                        setHighlightedLines([0])
                        setRemovedLines([])
                    }} hasIndicator={false}>
                        <p>
                            These two technologies are notoriously tricky to combine. The crux of the issue is that <b>they both want to handle the DOM</b>.
                        </p>
                    </ScrollEvent>

                    <p>
                        Let's start at the beginning, shall we?
                    </p>

                    {sections.map(({ id, label, Component }) => (
                        <div className="D3AndReact__section" key={id} id={id}>
                            <h2>
                                { label }
                            </h2>
                            <Component />
                        </div>
                    ))}

                    <div className="note">
                        <img alt="under construction" src={constructionGif} />
                        <p>
                            Please excuse our dust! This blog post is under construction.
                            <br />
                            We'll be finishing up here in the next few weeks.
                        </p>
                    </div>

                </div>

                {/* <div className="D3AndReact__left">

                    <p>
                        In this post, we'll be iterating on a scatterplot of estimated hours vs actual hours from a dataset of task estimation.
                    </p>

                    <D3AndReactExample />
                    <div className="D3AndReact__trigger" />

                    <Aside>
                        <p>
                            Our dataset is pulled from a <Link href="https://github.com/Derek-Jones/SiP_dataset">great repository from Derek M. Jones and Stephen Cullum</Link>, showing commercial development over ten years. The company used an Agile method, and the dataset covers 10,100 unique task estimates made by 22 developers.
                        </p>

                        <p>
                            The actual data or chart doesn't matter much in this case, but I do find it funny how inaccurate the time estimates were.
                        </p>
                    </Aside>

                    <br />

                    <ScrollEvent isInViewChange={d => {
                        setCode(d < 0 ? null : d3Example)
                        setFileName(d < 0 ? null : "HoursScatterplot.jsx (Method A)")
                        setInitialExpandedSteps(null)
                        setHighlightedLines([3, 4])
                        setRemovedLines([])
                    }}>
                        <h6>Method A</h6>
                    </ScrollEvent>
                        <h3>
                            D3 code on mount
                        </h3>

                    <p>
                        To start, let's look at a naïve implementation of using d3 inside of a React component. Our component is named <P>HoursScatterplot</P> and is using the <P>useRef()</P> hook to grab an element that we'll render, to be referred to later.
                    </p>

                    <Aside>
                        If you're unfamiliar with React hooks or <P>useRef()</P>, read more <Link to="https://reactjs.org/docs/hooks-reference.html#useref">in the docs</Link>.
                    </Aside>
                    <br />
                    <br />

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setCode(d3Example)
                        setFileName("HoursScatterplot.jsx (Method A)")
                        setInitialExpandedSteps(null)
                        setHighlightedLines(range(69, 77))
                        setRemovedLines([])
                    }}>
                        <p>
                            In our <b>return function</b>, we're rendering a single <P>{`<svg>`}</P> element, assigning it to our <P>ref</P>, and setting its <P>height</P> and <P>width</P>.
                        </p>

                        <Aside>
                            If you're unfamiliar with <P>{`<svg>`}</P>, read more <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element">in the MDN docs</Link>.
                        </Aside>
                    </ScrollEvent>

                    <br />
                    <br />

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setCode(d3Example)
                        setFileName("HoursScatterplot.jsx (Method A)")
                        setInitialExpandedSteps(null)
                        setHighlightedLines(range(64, 67))
                        setRemovedLines([])
                    }}>
                        <p>
                            To draw our chart, we run a <P style={{cursor: "pointer"}} onClick={() => {
                                setHighlightedLines(range(6, 7))
                            }}><b>drawDots()</b></P> function on component mount, using an <P>useEffect()</P> hook with an empty dependency array.
                        </p>

                        <Aside>
                            If you're unfamiliar with <P>useEffect()</P>, read more <Link to="https://reactjs.org/docs/hooks-effect.html">in the docs</Link>.
                        </Aside>
                    </ScrollEvent>

                    <br />
                    <br />

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setCode(d3Example)
                        setFileName("HoursScatterplot.jsx (Method A)")
                        setInitialExpandedSteps(null)
                        setHighlightedLines(range(6, 63))
                        setRemovedLines([])
                    }}>
                        <p>
                            If we look at our <P>drawDots()</P> function, we've basically just pasted a whole block of vanilla d3.js code.
                        </p>

                        <Aside>
                            This code is adapted from <b>Chapter 3</b> of <Link to="https://newline.co/fullstack-d3">Fullstack Data Visualization and D3.js</Link>. If you are interested in solidifying your d3.js skills, I tried to give readers an easy, but fast-paced, ramp-up, and included tons of tips I've learned during my career designing & developing data visualizations.

                            <br />
                            <br />
                            The first chapter is a free download and quickly runs through making a chart, if you're looking for a refresher!
                        </Aside>
                    </ScrollEvent>

                    <br />
                    <br />

                    <p>
                        This approach definitely works! And it's a great first stab at porting an existing chart into a React app.
                    </p> */}

                    {/* <D3AndReactExample /> */}


                    {/* <D3Modules /> */}
                {/* </div> */}
            </div>
        </div>
    )
}

export default D3AndReact;

const resources = [{
}]



export const d3Example =
`const width = 500
const height = 500
const HoursScatterplot = () => {
  const ref = useRef()

  const drawDots = async () => {
    const dataset = await d3.csv(dataUrl)

    // set data constants
    const xAccessor = d => +d.HoursEstimate
    const yAccessor = d => +d.HoursActual

    // create chart area
    const bounds = d3.select(ref.current)

    // create scales
    const xScale = d3.scaleLinear()
      .domain([0, 250])
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, 250])
      .range([height, 0])

    // draw the points
    const dots = bounds.selectAll(".dot")
      .data(dataset, d => d.TaskNumber)

    const newDots = dots.enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))

    // draw axes
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", \`translateY(\${height}px)\`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", width - 10)
        .attr("y", -10)
        .style("text-anchor", "end")
        .html("estimated hours")

    const yAxisGenerator = d3.axisLeft()
      .scale(yScale)
      .ticks(4)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("x", 6)
        .attr("y", 5)
        .style("text-anchor", "start")
        .text("actual hours")
  }

  useEffect(() => {
    drawDots()
  }, [])

  return (
    <svg
      className="HoursScatterplot"
      ref={ref}
      style={{
        width,
        height,
      }}
    />
  )
}`


const colors = [
    "#2c3e50",
    "#9980FA",
    "#f2f2f7",
]
const gradients = [
    ["#f2f2f7", "#9980FA", "#f2f2f7",],
    ["#f2f2f7", "#12CBC4", "#f2f2f7",],
    ["#f2f2f7", "#FFC312", "#f2f2f7",],
]
const numberOfWiggles = 20
const heightOfBackground = 30
const getPath = () => (
    area()
        .x(([x, y]) => x)
        .y0(([x, y]) => -y)
        .y1(([x, y, y1]) => y1)
        .curve(curveBasis)
    (
        times(numberOfWiggles, i => (
            [
                // i + randomNormal(0, 0.5)(), // x
                i, // x
                Math.max(0,
                    heightOfBackground / 2
                    * (1 / ((Math.abs(i - numberOfWiggles / 2) || 1)))
                    + randomNormal(0, 8)()
                    + 3
                ), // y0
                Math.min(0,
                    -heightOfBackground / 2
                    * (1 / ((Math.abs(i - numberOfWiggles / 2) || 1)))
                    + randomNormal(0, 8)()
                    - 3
                ), // y1
            ]
        ))
    )
)
const springConfig = {
    duration: 3000,
}
const HeaderBackground = () => {
    const gradientIds = useMemo(() => (
        times(3, () => (
            `HeaderBackground__gradient--id-${uniqueId()}`
        ))
    ), [])

    const [path1, setPath1] = useState(getPath)
    const [path2, setPath2] = useState(getPath)
    const [path3, setPath3] = useState(getPath)

    useInterval(() => {
        setPath1(getPath())
        setPath2(getPath())
        setPath3(getPath())
    }, 3000)

    const spring1 = useSpring({ config: springConfig, d: path1 })
    const spring2 = useSpring({ config: springConfig, d: path2 })
    const spring3 = useSpring({ config: springConfig, d: path3 })

    return (
        <div className="HeaderBackground">
            <svg
                className="HeaderBackground__svg"
                viewBox={[
                    0,
                    -heightOfBackground / 2,
                    numberOfWiggles - 1,
                    heightOfBackground
                ].join(" ")}
                preserveAspectRatio="none">
                <defs>
                    {gradients.map((colors, gradientIndex) => (
                        <linearGradient id={gradientIds[gradientIndex]}>
                            {colors.map((color, colorIndex) => (
                                <stop
                                    key={[gradientIndex, colorIndex].join("-")}
                                    stopColor={color}
                                    offset={`${
                                        colorIndex / (colors.length - 1) * 100
                                    }%`}
                                />
                            ))}
                        </linearGradient>
                    ))}
                </defs>
                <animated.path
                    className="HeaderBackground__path"
                    {...spring1}
                    fill={`url(#${gradientIds[0]})`}
                />
                <animated.path
                    className="HeaderBackground__path"
                    {...spring2}
                    fill={`url(#${gradientIds[1]})`}
                />
                <animated.path
                    className="HeaderBackground__path"
                    {...spring3}
                    fill={`url(#${gradientIds[2]})`}
                />
            </svg>
        </div>
    )
}