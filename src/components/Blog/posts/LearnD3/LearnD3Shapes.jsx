import React, { useState } from "react"
import { Twemoji } from "react-emoji-render"
import _ from "lodash"
import * as d3 from "d3"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import LocalExample from "components/_ui/LocalExample/LocalExample"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, P, ReadMore } from "./LearnD3"
import bookImage from "images/book.png";
import constructionGif from "./construction.gif";

const LearnD3Shapes = ({ onScrollToSectionLocal }) => {
    return (
        <div className="LearnD3Shapes">
            <p>
                To visualize data, we need to represent our dataset as shapes. But how can we draw these shapes?
            </p>

            <p>
                Let's go over the four ways to draw in a web browser:
            </p>

            <List items={[
                <>
                    <b>Basic DOM elements</b>
                    <p>
                        CSS is pretty powerful these days - we can actually get pretty far by just using your run-of-the-mill <P>div</P>.
                    </p>
                    <p>
                        For example, we can make a simple progress bar by dynamically setting an element's <P>width</P>:
                    </p>
                    <div dangerouslySetInnerHTML={{__html: barCode}} />
                    <Expandy trigger="Show me the code">
                        <Code size="s" language="css">{ barCode }</Code>
                    </Expandy>
                    <p>
                        Or even a heatmap using CSS Grid:
                    </p>
                    <div dangerouslySetInnerHTML={{__html: heatmapCode}} />
                    <Expandy trigger="Show me the code">
                        <Code size="s" language="css">{ heatmapCode }</Code>
                    </Expandy>
                </>,
                <>
                    <b>Canvas</b>
                    <p>
                        There is an HTML <P>{`<canvas>`}</P> element that we can draw on to create <Link href="https://en.wikipedia.org/wiki/Raster_graphics">raster images</Link>. Doing this involves using native Javascript methods, such as <P>fillRect()</P>.
                    </p>
                    <p>
                        Read more about <b>Canvas</b> <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">on the MDN docs</Link>
                    </p>
                    <p>
                        We won't talk about Canvas here since d3 doesn't have any Canvas-specific methods, it can be tedious to work with because of its imperative nature, and any shapes we draw are collapsed into one DOM element. It is, however, great when you're making a very complex data visualization.
                    </p>
                </>,
                <>
                    <b>WebGL</b>
                    <p>
                        Everything I just said about <b>Canvas</b> applies even more to <b>WebGL</b>. <b>WebGL</b> is an API to draw on <P>{`<canvas>`}</P> elements using low-level shader code, and it's really fast since it is processed by your computer's GPU.
                    </p>
                    <p>
                        Read more about <b>WebGL</b> <Link href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial">on the MDN docs</Link>
                    </p>
                </>,
                <>
                    <b>SVG</b>
                    <p>
                        <b>SVG</b> is the main method used for data visualization in the browser. Within an <P>{`<svg>`}</P> element, we can use <b>SVG</b> elements the same way we use HTML elements.
                    </p>
                    <p>
                        We can even use CSS on our SVG elements, although they play by different rules.
                    </p>
                    <p>
                        Read more about <b>SVG</b> <Link href="https://developer.mozilla.org/en-US/docs/Web/SVG">on the MDN docs</Link>
                    </p>
                </>,
            ]} />

            {/* <h3>d3-shape</h3>
            <p>
            </p>

            <ReadMore id="shape" />


            <h3>d3-path</h3>
            <p>
            </p>

            <ReadMore id="path" />

            <h3>d3-polygon</h3>
            <p>
            </p>

            <ReadMore id="polygon" /> */}


            <img alt="under construction" src={constructionGif} />
            <Aside>
                Sorry about the dummy text! This section is under construction.
            </Aside>



        </div>
    )
}

export default LearnD3Shapes




const barCode = (
`<div style="
    position: relative;
    width: 100%;
    border: 1px solid lightgrey;
    background: white;
">
    <div style="
        width: 65%;
        background: cornflowerblue;
        height: 1em;
    ">
    </div>
</div>`
)
const colors = d3.schemeBlues[8]
const heatmapCode = (
`<div style="
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1em);
    grid-template-rows: repeat(3, 1em);
    grid-gap: 3px;
">
${_.times(18, i => (
`    <div style="width: 100%; background: ${colors[Math.floor(Math.random() * colors.length)]};"></div>
`)).join("")}
</div>`
)