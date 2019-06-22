import React, { useState } from "react"
import { Helmet } from "react-helmet"
import D3Modules from "./D3Modules"
import ScrollEvent from 'components/_ui/ScrollEvent/ScrollEvent';
import Aside from 'components/_ui/Aside/Aside';
import Link from 'components/_ui/Link/Link';
import List from 'components/_ui/List/List';
import Code from 'components/_ui/Code/Code';

import "./LearnD3.scss"

const LearnD3 = () => {
    const [focusedPackages, setFocusedPackages] = useState(null)
    const [isDiagramShrunk, setIsDiagramShrunk] = useState(false)

    return (
        <div className="LearnD3">
            <Helmet>
                <meta charSet="utf-8" />
                <title>An Introduction to D3.js</title>
                <link rel="canonical" href="https://wattenberger.com/blog/d3-interactive-charts" />
                <meta property="og:type" content="website" />
                <meta name="description" content="Hi I'm Amelia Wattenberger. I'm interested in teaching data visualization, frontend development, and design." />
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
                            So, you want to create amazing data visualizations on the web and you keep hearing about D3.js. But what <i>is</i> D3.js, and how can you learn it? Let's start with the question: <b>What is D3?</b>
                        </p>
                        <p>
                            While it might seem like D3.js is an all-encompassing framework, it's really just a collection of small modules. Here are all of the modules: each is visualized as a circle - larger circles are modules with larger file sizes.
                        </p>
                    </div>
                </ScrollEvent>

                <D3Modules
                    className={`LearnD3__diagram LearnD3__diagram--is-${isDiagramShrunk ? "shrunk" : "normal"}`}
                    {...{focusedPackages}}
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

                        setFocusedPackages(["d3-selection"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <p>
                            Let's talk about a few of these packages individually.
                        </p>

                        <Heading id="d3-selection">
                            d3-selection
                        </Heading>

                    <p>
                        The Document Object Model (DOM) is the tree of elements on a web page. If you're unfamiliar, <Link href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools">open your browser's Dev Tools</Link> (most likely <P>Ctrl/Cmd</P> + <P>Shift</P> + <P>I</P>) and peep in the <b>Elements</b> tab. You'll be able to see that this web page is mostly made up of <P>{`<div>`}</P> elements.
                    </p>

                    <Aside>
                        Read more about the DOM <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction">in the MDN docs</Link>.
                    </Aside>

                    <p>
                        We can change the elements in the DOM with basic Javascript:
                    </p>

                    <List items={[
                        <>
                            To <i>select</i> one or more existing elements, we can use the <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector"><P>document.querySelector()</P></Link> method, passing in an element tag name, an element class name (prepended with a <P>.</P>), or an element id (prepended with a <P>#</P>). This will return the first matching element in our DOM.
                        </>,
                        <>
                            Our selected element has many methods that will help us <i>change</i> it. For example, we can look at the current CSS styles on the <P>style</P> object, or update them by changing the value.
                        </>,
                    ]} hasNumbers />

                    <p>
                        For example, try running this in the Dev Tools <b>Console</b> tab:
                    </p>

                    <Code hasLineNumbers={false} fileName={<>In your browser's Dev Tools <b>Console</b> tab</>}>
{`document.querySelector("div").style.color = "cornflowerblue"`}
                    </Code>

                    <p>
                        This code will select this <i>first</i> <P>{`<div>`}</P> and add the CSS style: <P>color: cornflowerblue</P>.
                    </p>
                    <p>
                        You probably don't want to read this whole article in <span style={{color: "cornflowerblue"}}>blue</span> - reset the color by removing that CSS style:
                    </p>

                    <Code hasLineNumbers={false} fileName={<>In your browser's Dev Tools <b>Console</b> tab</>}>
{`document.querySelector("div").style.color = null`}
                    </Code>

                    <p>
                        That was pretty simple, wasn't it?
                    </p>

                    <p id="this-paragraph">
                        Now let's try adding a new element to our DOM - we've given <b>this paragraph</b> an <P>id</P> of <P>"this-paragraph"</P> to help out.
                    </p>
                <Code hasLineNumbers={false} fileName={<>In your browser's Dev Tools <b>Console</b> tab</>}>
{`let newDiv = document.createElement("div")
newDiv.innerText = "HI"
document.querySelector("#this-paragraph").append(newDiv)`}
                    </Code>

                    <p>
                        Still pretty easy, right?
                    </p>

                    <p>
                        Now, imagine that you want to add an element for <i>every item in a dataset</i>. We could just use a <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration">for loop</Link> and it would be more work, but not too hard.
                    </p>

                    <p>
                        Now image that our data changes and we want to keep the elements in our DOM synced with our data. Hmm, this would be a lot of work with just the native browser APIs and vanilla Javascript.
                    </p>

                    <p>
                        This is when <Link href="https://github.com/d3/d3-selection"><b>d3-selection</b></Link> comes to the rescue!
                    </p>
                    <p>
                        <Link href="https://github.com/d3/d3-selection"><b>d3-selection</b></Link> has an alternative method to <P>document.querySelector()</P> called <P>d3.select()</P> (and another method called <P>d3.selectAll()</P> that will select multiple elements).
                    </p>

                    <p>
                        These methods create <b>d3 selection objects</b> that are able to <Link href="https://bl.ocks.org/mbostock/3808218">update with data</Link>. <b>D3 selection objects</b> also have other helpful methods that help with listening to mouse events, updating elements' attributes and styles, and creating new elements, among other things.
                    </p>

                    <Aside>
                        Read more about <b>d3-selection</b> on <Link href="https://github.com/d3/d3-selection">the docs</Link>.
                    </Aside>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-transition"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="d3-transition">
                            d3-transition
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-array"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="d3-array">
                            d3-array
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-scale", "d3-dsv"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="d3-scale">
                            Modules for fetching data
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-quadtree", "d3-chord", "d3-voronoi", "d3-delaunay", "d3-force", "d3-sankey", "d3-contour", "d3-hexbin", "d3-hierarchy"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="specific">
                            Modules for specific visualizations
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-geo", "d3-geo-polygon", "d3-geo-projection"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="specific">
                            Modules for maps and globes
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-shape", "d3-polygon", "d3-path"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="specific">
                            Modules for drawing SVG shapes
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-time", "d3-time-interval", "d3-timer"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="specific">
                            Modules for dealing with time
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-color", "d3-scale-chromatic", "d3-hsv"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="specific">
                            Modules for dealing with colors
                        </Heading>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

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