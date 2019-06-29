import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { Twemoji } from "react-emoji-render";

import D3Modules from "./D3Modules"
import D3ModulesInline from "./D3ModulesInline"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent";
import Aside from "components/_ui/Aside/Aside";
import Expandy from "components/_ui/Expandy/Expandy";
import Link from "components/_ui/Link/Link";
import Icon from "components/_ui/Icon/Icon";
import List from "components/_ui/List/List";
import Code from "components/_ui/Code/Code";
import LearnD3Selections from "./LearnD3Selections";
import LearnD3GetData from "./LearnD3GetData";
import LearnD3ChangeData from "./LearnD3ChangeData";

import constructionGif from "./construction.gif";

import bookImage from "images/book.png";

import "./LearnD3.scss"
import { scrollTo } from "utils";


const sections = [{
    label: "Modules for grabbing data",
    modules: ["d3-fetch", "d3-dsv"],
    Component: LearnD3GetData,
},{
    label: "Modules for manipulating data",
    modules: ["d3-quadtree", "d3-array", "d3-random", "d3-collection"],
    Component: LearnD3ChangeData,
},{
  label: "Modules for manipulating the DOM",
  modules: ["d3-selection", "d3-selection-multi"],
  Component: LearnD3Selections,
},{
    label: "Modules for drawing SVG shapes",
    modules: ["d3-shape", "d3-polygon", "d3-path"],
    Component: DummySection,
},{
  label: "Modules for converting between data domains",
  modules: ["d3-scale"],
  Component: DummySection,
},{
    label: "Modules for animation",
    modules: ["d3-transition", "d3-ease", "d3-interpolate"],
    Component: DummySection,
},{
    label: "Modules for specific visualizations",
    modules: ["d3-chord", "d3-voronoi", "d3-delaunay", "d3-force", "d3-sankey", "d3-contour", "d3-hexbin", "d3-hierarchy"],
    Component: DummySection,
},{
    label: "Modules for maps and globes",
    modules: ["d3-geo", "d3-geo-polygon", "d3-geo-projection"],
    Component: DummySection,
},{
    label: "Modules for dealing with time",
    modules: ["d3-time", "d3-time-interval", "d3-timer"],
    Component: DummySection,
},{
    label: "Modules for dealing with colors",
    modules: ["d3-color", "d3-scale-chromatic", "d3-hsv"],
    Component: DummySection,
}].map(d => ({
    ...d,
    id: d.label
        .slice(11)
        .replace(/ /g, "-")
}))
const LearnD3 = () => {
    const [focusedPackages, setFocusedPackages] = useState(null)
    const [tempFocusedPackages, setTempFocusedPackages] = useState(null)
    const [isDiagramShrunk, setIsDiagramShrunk] = useState(false)

    const onScrollToSectionLocal = section => e => {
      e.preventDefault()
      window.history.pushState({}, '', `#${section}`);

      const y = document.querySelector(`#${section}`).getBoundingClientRect().top
        + document.documentElement.scrollTop
        - 150

      scrollTo(y, 100)
    }

    return (
        <div className="LearnD3">
            <Helmet>
                <meta charSet="utf-8" />
                <title>An Introduction to D3.js</title>
                <link rel="canonical" href="https://wattenberger.com/blog/d3" />
                <meta property="og:type" content="website" />
                <meta name="description" content="Hi I’m Amelia Wattenberger. I’m interested in teaching data visualization, frontend development, and design." />
            </Helmet>

            <div className="LearnD3__content">

                <h1>
                    How to learn D3.js
                </h1>
                <h6>
                    June 20<sup>th</sup>, 2019
                </h6>

                <ScrollEvent isInViewChange={d => {
                    if (d != 0) return

                    setFocusedPackages(null)
                    setIsDiagramShrunk(false)
                }} hasIndicator={false}>
                    <div className="LearnD3__section">
                        <p>
                            So, you want to create amazing data visualizations on the web and you keep hearing about D3.js. But what <i>is</i> D3.js, and how can you learn it? Let’s start with the question: <b>What is D3?</b>
                        </p>
                        <p>
                            While it might seem like D3.js is an all-encompassing framework, it’s really just a collection of small modules. Here are all of the modules: each is visualized as a circle - larger circles are modules with larger file sizes.
                        </p>
                    </div>
                </ScrollEvent>

                <D3Modules
                    className={`LearnD3__diagram LearnD3__diagram--is-${isDiagramShrunk ? "shrunk" : "normal"}`}
                    isShrunk={isDiagramShrunk}
                    focusedPackages={tempFocusedPackages || focusedPackages}
                />

                <div className="LearnD3__section">
                  <ScrollEvent isInViewChange={d => {
                      if (d != 0) return

                      setFocusedPackages(null)
                      setIsDiagramShrunk(false)
                  }} hasIndicator={false}>
                    <p>
                        Wow! This is really overwhelming to see all of these packages at once.
                    </p>
                  </ScrollEvent>

                  <ScrollEvent isInViewChange={d => {
                    if (d != 0) return

                    setFocusedPackages(null)
                    setIsDiagramShrunk(true)
                }} hasIndicator={false}>
                  <p>
                      Let's talk about specific modules, grouped by function.
                  </p>

                <List className="LearnD3__modules-list" items={
                    sections.map(({ id, label, modules, Component }) => (
                      <div
                        key={id}
                        className={[
                            "LearnD3__modules-list__item",
                            `LearnD3__modules-list__item--is-${Component == DummySection ? "under-construction" : "done"}`
                        ].join(" ")}
                        onMouseEnter={() => setTempFocusedPackages(modules)}
                        onMouseLeave={() => setTempFocusedPackages(null)}
                        onClick={onScrollToSectionLocal(id)}>
                        <div>
                            { label }
                        </div>
                        {Component == DummySection && (
                            <div className="LearnD3__modules-list__item__flag">
                                Under construction
                            </div>
                        )}
                      </div>
                    ))
                  } />
                </ScrollEvent>

                    {sections.map(({
                        Component, modules, id, label
                    }) => (
                        <ScrollEvent
                          className="LearnD3__module"
                          key={id}
                          isInViewChange={status => {
                            if (status != 0) return

                            setFocusedPackages(modules)
                            setIsDiagramShrunk(true)
                          }}
                          hasIndicator={false}>
                            <Heading id={id}>
                                { label }
                            </Heading>

                            <D3ModulesInline
                                className="mobile"
                                modules={modules}
                            />

                            <Component />

                        </ScrollEvent>
                    ))}

                    <br />

                    <ScrollEvent isInViewChange={d => {
                        if (d < 0) return

                        setFocusedPackages(null)
                        setIsDiagramShrunk(true)
                    }} hasIndicator={"false"}>

                        <Heading id="wrap-up">
                            All together now
                        </Heading>

                        <p>
                            Whew! Now that we’ve done a whirlwind tour of the d3 modules, you can see that d3 contains many modules that do many different things.
                        </p>

                        <p>
                            Here’s a recap of the groupings that we’ve talked about:
                        </p>

                        <List className="LearnD3__modules-list" items={
                            sections.map(({ id, label, modules, Component }) => (
                                <div
                                    key={id}
                                    className={[
                                        "LearnD3__modules-list__item",
                                        `LearnD3__modules-list__item--is-${Component == DummySection ? "under-construction" : "done"}`
                                    ].join(" ")}
                                    onMouseEnter={() => setTempFocusedPackages(modules)}
                                    onMouseLeave={() => setTempFocusedPackages(null)}
                                    onClick={onScrollToSectionLocal(id)}>
                                    <div>
                                        { label }
                                    </div>
                                    {Component == DummySection && (
                                        <div className="LearnD3__modules-list__item__flag">
                                            Under construction
                                        </div>
                                    )}
                                </div>
                            ))
                        } />

                        <p>
                            One of the main takeaways here is that d3 is not a comprehensive library, but instead a collection of modules that can be learned, and used, individually.
                        </p>
                    </ScrollEvent>

                        <h2>
                            Other Resources
                        </h2>
                        <p>
                            Where do we go from here? Here is a collection of handy resources that I recommend for learning more about d3:
                        </p>

                    <List items={[
                        <>
                            <b>Fullstack D3 and Data Visualization</b>
                            <p>
                                If you found this guide helpful, <Link href="http://fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> goes way more in-depth and digs into the nitty-gritty right away. You’ll be creating your own custom charts <i>by the end of the first chapter</i>.
                            </p>
                            <p>
                                Plus, <Link href="http://fullstack.io/fullstack-d3">the first chapter is free</Link>, so you can try it out before commiting.
                            </p>
                        </>,
                        <>
                            <b>The source</b>
                            <p>
                                <Link href="https://github.com/d3/d3/blob/master/API.md">The docs</Link> can be a bit dense, but once you get the hang of the d3 API, they are invaluable. As a bonus, the code is all open source! I’d highly recommend digging in and looking at how wonderfully modular it is.
                            </p>
                        </>,
                        <>
                            <b>“ I only learn through examples ”</b>
                            <p>
                                Me too! There are tons of up-to-date examples on <Link href="https://observablehq.com/">Observable</Link>, a web community of interactive notebooks. This is the new venture of Mike Bostock (one of the founders and main maintainer of d3) and it’s a wonderful tool that lets you dig in and edit code for many, many examples.
                            </p>
                            <p>
                                A good starting place is <Link href="https://observablehq.com/collection/@observablehq/visualization">this collection of visualization examples</Link>.
                            </p>
                        </>,
                        // <>
                        // </>,
                    ]} />

                    <ScrollEvent isInViewChange={d => {
                        if (d < 0) return

                        setFocusedPackages(null)
                        setIsDiagramShrunk(false)
                    }} hasIndicator={false}>
                        <div style={{height: "100px"}} />
                    </ScrollEvent>

                </div>
            </div>
        </div>
    )
}

export default LearnD3;


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

export const ReadMore = ({ id }) => (
    <Aside>
        Read more about <b>{ id }</b> on <Link href={`https://github.com/d3/${ id }`}>the docs</Link>.
    </Aside>
)


function DummySection() {
    return (
        <>
            <img alt="under construction" src={constructionGif} />
            <Aside>
                Sorry about the dummy text! This section is under construction.
            </Aside>

            <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
            </p>

        </>
    )
}