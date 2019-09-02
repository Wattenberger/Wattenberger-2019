import React, { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"

import D3Modules from "./D3Modules"
import D3ModulesInline from "./D3ModulesInline"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent";
import Aside from "components/_ui/Aside/Aside";
import Link from "components/_ui/Link/Link";
import Icon from "components/_ui/Icon/Icon";
import List from "components/_ui/List/List";
import constructionGif from "./construction.gif";

import bookImage from "images/book2.png";

import "./LearnD3.scss"
import { scrollTo } from "utils";
const LearnD3Selections = React.lazy(() => import("./LearnD3Selections"))
const LearnD3GetData = React.lazy(() => import("./LearnD3GetData"))
const LearnD3ChangeData = React.lazy(() => import("./LearnD3ChangeData"))
const LearnD3Shapes = React.lazy(() => import("./LearnD3Shapes"))
const LearnD3Scales = React.lazy(() => import("./LearnD3Scales"))
const LearnD3Animation = React.lazy(() => import("./LearnD3Animation"))
const LearnD3Time = React.lazy(() => import("./LearnD3Time"))
const LearnD3Geo = React.lazy(() => import("./LearnD3Geo"))
const LearnD3Specific = React.lazy(() => import("./LearnD3Specific"))
const LearnD3Colors = React.lazy(() => import("./LearnD3Colors"))


const sections = [{
    label: "Intro",
    Component: Intro,
},{
    label: "Grabbing data",
    modules: ["d3-fetch", "d3-dsv"],
    Component: LearnD3GetData,
},{
    label: "Manipulating data",
    modules: ["d3-array", "d3-random", "d3-collection"],
    Component: LearnD3ChangeData,
},{
  label: "Manipulating the DOM",
  modules: ["d3-selection", "d3-selection-multi"],
  Component: LearnD3Selections,
},{
    label: "Drawing SVG shapes",
    modules: ["d3-shape", "d3-polygon", "d3-path"],
    Component: LearnD3Shapes,
},{
  label: "Converting data to the physical domain",
  modules: ["d3-scale"],
  Component: LearnD3Scales,
},{
    label: "Dealing with colors",
    modules: ["d3-color", "d3-scale-chromatic", "d3-hsv", "d3-interpolate"],
    Component: LearnD3Colors,
},{
    label: "Dealing with datetimes",
    modules: ["d3-time", "d3-time-format"],
    Component: LearnD3Time,
},{
    label: "Animation",
    modules: ["d3-transition", "d3-ease", "d3-interpolate", "d3-timer",
      // "d3-queue"
    ],
    Component: LearnD3Animation,
},{
    label: "Maps and globes",
    modules: ["d3-geo", "d3-geo-polygon", "d3-geo-projection"],
    Component: LearnD3Geo,
},{
    label: "Specific visualizations",
    modules: ["d3-chord", "d3-voronoi", "d3-delaunay", "d3-force", "d3-sankey", "d3-contour", "d3-hexbin", "d3-hierarchy", "d3-brush", "d3-zoom", "d3-drag", "d3-axis"],
    Component: LearnD3Specific,
},{
    label: "Resources",
    Component: Resources,
}].map(d => ({
    ...d,
    id: d.label
        // .replace("Modules for ", "")
        .replace(/ /g, "-")
        .toLowerCase()
}))
const LearnD3 = () => {
    // const [focusedSection, setFocusedSection] = useState(sections[0].id)
    // const currentSection = useRef(sections[0].id)
    // const [focusedPackages, setFocusedPackages] = useState(null)
    const [tempFocusedPackages, setTempFocusedPackages] = useState(null)
    const [iteration, setIteration] = useState(0)

    const onScrollToSectionLocal = section => e => {
        if (e) e.preventDefault()
        document.scrollingElement.scrollTop = 0
        window.history.pushState({}, '', `#${section}`);
        setIteration(iteration + 1)
    }


    useEffect(() => {
        const hash = window.location.hash
        if (!hash) return
    }, [])

    const focusedSection = window.location.hash.slice(1).toLowerCase() || "intro"
    const sectionIndex = Math.max(0,
        Math.min(
          sections.length - 1,
          sections.findIndex(d => d.id == focusedSection) || 0
        )
      )
    const { id, label, modules, Component } = sections[sectionIndex] || {}
    const focusedPackages = modules
    const previousSection = sections[sectionIndex - 1]
    const nextSection = sections[sectionIndex + 1]

    const isDiagramShrunk = !!focusedSection

    return (
        <div className="LearnD3">
            <Helmet>
                <meta charSet="utf-8" />
                <title>An Introduction to D3.js</title>
                <link rel="canonical" href="https://wattenberger.com/blog/d3" />
                <meta property="og:type" content="website" />
                <meta name="description" content="Learn the fundamentals of D3.js: what it is, how to use it, what are the different modules, and how to use the API. This article has tons of linked resources for digging deeper." />
            </Helmet>

            <div className="LearnD3__links">
                <Icon name="list" />
                <Link to="#" onClick={onScrollToSectionLocal("intro")}><h6>Intro to D3</h6></Link>
                <div className="LearnD3__links__arrows">
                    <Link to="#" className="LearnD3__links__link__main" onClick={previousSection && onScrollToSectionLocal(previousSection.id)}>
                        <Icon className="LearnD3__links__link__arrow" name="arrow" direction="w" size="s" />
                    </Link>
                    <Link to="#" className="LearnD3__links__link__main" onClick={nextSection && onScrollToSectionLocal(nextSection.id)}>
                    <Icon className="LearnD3__links__link__arrow" name="arrow" direction="e" size="s" />
                    </Link>
                </div>
                <div className="LearnD3__links__options">
                    {sections.map(section => (
                        <Link to="#" className={`LearnD3__links__options__item LearnD3__links__options__item--is-${section.id == focusedSection ? "selected" : "normal"}`} key={section.id} onClick={onScrollToSectionLocal(section.id)}>
                            { section.label }
                        </Link>
                    ))}
                </div>
            </div>

            <div className="LearnD3__content">


                    {focusedSection == "intro" ? (
                        <Component
                            {...{tempFocusedPackages, focusedPackages, setTempFocusedPackages, onScrollToSectionLocal}}
                        />
                    ) : (
                        <>
                        <D3Modules
                            className="LearnD3__diagram LearnD3__diagram--solo"
                            isShrunk
                            focusedPackages={tempFocusedPackages || focusedPackages}
                        />
                            <div className="LearnD3__section">

                                <div className="LearnD3__module" key={focusedSection}>
                                    {focusedSection != "resources" && <h6>D3.js Modules for</h6>}
                                    <div className="LearnD3__module__heading" id={id}>
                                        { label }
                                    </div>

                                    <D3ModulesInline
                                        className="mobile"
                                        modules={modules}
                                    />

                                    <Component
                                        {...{tempFocusedPackages, focusedPackages, setTempFocusedPackages, onScrollToSectionLocal}}
                                    />

                                </div>
                            </div>
                        </>
                    )}

                    {!!nextSection && (
                        <Link to="#" className="LearnD3__next" onClick={onScrollToSectionLocal(nextSection.id)}>
                            <h6>Up next</h6>
                            <div className="LearnD3__next__content">
                                <h3 className="LearnD3__next__heading">
                                    { nextSection.label }
                                </h3>
                                <Icon name="arrow" direction="e" className="LearnD3__next__arrow" />
                            </div>
                        </Link>
                    )}

            </div>
        </div>
    )
}

export default LearnD3;


export const P = ({ children })=> (
  <code className="P">{ children }</code>
)


const Heading = ({ id, children }) => {
  const onClickHash = () => {
    window.history.pushState({}, '', `#${id}`);

    const sectionElement = document.querySelector(`#${id}`)
    if (!sectionElement) return

    const y = sectionElement.getBoundingClientRect().top
      + document.documentElement.scrollTop
      - 150

    scrollTo(y, 100)
  }

  return (
    <h2 className="Heading" id={id}>
      <div className="Heading__hash" onClick={onClickHash}>#</div>
      { children }
    </h2>
  )
}

export const ReadMore = ({ id }) => (
    <Aside className="ReadMore">
        Read more about <b>d3-{ id }</b> in <Link href={`https://github.com/d3/d3-${ id }`}>the docs</Link>.
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


export const DocsLink = ({ id, repo, children }) => (
    <Link href={`https://github.com/d3/d3-${repo}${!!id ? `#${id}` : ""}`}>
        {children || id ? (
            <P>
                { children || `d3.${id}()` }
            </P>
        ) : (
            <b>
                d3-{ repo }
            </b>
        )}
    </Link>
)

function Intro({ focusedPackages, onScrollToSectionLocal }) {
    const [isDiagramShrunk, setIsDiagramShrunk] = useState(false)
    const [tempFocusedPackages, setTempFocusedPackages] = useState(null)
    return (
        <div className="Intro">

            <h1>
                How to learn D3.js
            </h1>
            <div className="LearnD3__section">
                <p>
                    So, you want to create amazing data visualizations on the web and you keep hearing about D3.js. But what <i>is</i> D3.js, and how can you learn it? Let’s start with the question: <b>What is D3?</b>
                </p>
                <p>
                    While it might seem like D3.js is an all-encompassing framework, it’s really just a collection of small modules. Here are all of the modules: each is visualized as a circle - larger circles are modules with larger file sizes.
                </p>
            </div>

            <D3Modules
                className={`LearnD3__diagram LearnD3__diagram--within-page LearnD3__diagram--is-${isDiagramShrunk ? "shrunk" : "normal"}`}
                isShrunk={isDiagramShrunk}
                focusedPackages={tempFocusedPackages}
            />

            <div className="LearnD3__section" style={{
                paddingBottom: "10em",
                marginBottom: "-10em",
            }}>

                <ScrollEvent isInViewChange={d => {
                    setIsDiagramShrunk(d >= 0)
                }} hasIndicator={false}>
                    <p>
                        Wow! This is really overwhelming to see all of these packages at once.
                    </p>

                    <p>
                        Let's talk about specific modules, grouped by function.
                    </p>
                </ScrollEvent>


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
            </div>
        </div>
    )
}
function Resources({ setTempFocusedPackages, onScrollToSectionLocal }) {
    return (
        <div className="Resources">

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

            <h2>
                Other Resources
            </h2>
            <p>
                Where do we go from here? Here is a collection of handy resources that I recommend for learning more about d3:
            </p>

            <List items={[
                <>
                    <b>Fullstack D3 and Data Visualization</b>
                    <img src={bookImage} alt="Fullstack D3 and Data Visualization book cover" className="LearnD3__book" />
                    <div className="LearnD3__book-text">
                        <p>
                            If you found this guide helpful, <Link href="http://fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> goes way more in-depth and digs into the nitty-gritty right away. You’ll be creating your own custom charts <i>by the end of the first chapter</i>.
                        </p>
                        <p>
                            Plus, <Link href="http://fullstack.io/fullstack-d3">the first chapter is free</Link>, so you can try it out before commiting.
                        </p>
                    </div>
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

            <br />
            <br />
            <br />

            <img alt="under construction" src={constructionGif} />
            <p className="note" style={{
              margin: "-10px 50px 0",
              maxWidth: "470px",
              textAlign: "center",
            }}>
              Please take a minute to thank these little people who have been working hard this article. They always get removed when a site is finished, and never get credit.
            </p>
        </div>
    )
}