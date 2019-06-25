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
import constructionGif from "./construction.gif";

import bookImage from "images/book.png";

import "./LearnD3.scss"

const LearnD3 = () => {
    const [focusedPackages, setFocusedPackages] = useState(null)
    const [tempFocusedPackages, setTempFocusedPackages] = useState(null)
    const [isDiagramShrunk, setIsDiagramShrunk] = useState(false)

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
                        if (d < 0) return

                        setFocusedPackages(["d3-selection", "d3-selection-multi"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <p>
                            Let’s talk about groups of modules, in terms of similar functionality.
                        </p>

                        <Heading id="d3-selection">
                            Modules for manipulating the DOM
                        </Heading>


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-selection", "d3-selection-multi"]}
                        />

                        <p>
                            The Document Object Model (DOM) is the tree of elements on a web page.
                        </p>

                        <Expandy trigger="Teach me about the DOM and how to modify it">
                            <p>
                                <Link href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools">Open your browser’s Dev Tools</Link> (most likely <P>Ctrl/Cmd</P> + <P>Shift</P> + <P>I</P>) and peep in the <b>Elements</b> tab. You’ll be able to see that this web page is mostly made up of <P>{`<div>`}</P> elements.
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

                            <Code hasLineNumbers={false} fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
        {`document.querySelector("div").style.color = "cornflowerblue"`}
                            </Code>

                            <p>
                                This code will select this <i>first</i> <P>{`<div>`}</P> and add the CSS style: <P>color: cornflowerblue</P>.
                            </p>
                            <p>
                                You probably don’t want to read this whole article in <span style={{color: "cornflowerblue"}}>blue</span> - reset the color by removing that CSS style:
                            </p>

                            <Code hasLineNumbers={false} fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
        {`document.querySelector("div").style.color = null`}
                            </Code>

                            <p>
                                That was pretty simple, wasn’t it?
                            </p>

                            <p id="this-paragraph">
                                Now let’s try adding a new element to our DOM - we’ve given <b>this paragraph</b> an <P>id</P> of <P>"this-paragraph"</P> to help out.
                            </p>

                        <Code hasLineNumbers={false} fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
        {`let newDiv = document.createElement("div")
        newDiv.innerText = "HI"
        document.querySelector("#this-paragraph").append(newDiv)`}
                            </Code>

                            <p>
                                Still pretty easy, right?
                            </p>

                        </Expandy>


                        <p>
                            Imagine that you want to add an element to the DOM for <i>every item in a dataset</i>. We could just use a <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration">for loop</Link> and it would be more work, but not too hard.
                        </p>

                        <p>
                            Now imagine that our data changes and we want to keep the elements in our DOM synced with our data. Hmm, this would be a lot of work with just the native browser APIs and vanilla Javascript.
                        </p>

                        <p>
                            This is when <Link href="https://github.com/d3/d3-selection"><b>d3-selection</b></Link> comes to the rescue!
                        </p>

                        <h3>
                            d3-selection
                        </h3>

                        <p>
                            <Link href="https://github.com/d3/d3-selection"><b>d3-selection</b></Link> has an alternative method to <P>document.querySelector()</P> called <P>d3.select()</P>.
                        </p>

                        <p>
                            This method creates a <b>d3 selection object</b> that has many helper methods.
                        </p>

                        <p>
                            Let’s create one!
                        </p>

                        <p id="this-other-paragraph">
                                This paragraph has an <P>id</P> of <P>this-other-paragraph</P>). Let’s change its style and add multiple <P>{`<div>`}</P>s from an array with the following code:
                        </p>

                        <Aside>
                            <b>Run the following code in your Dev Tools console!</b>
                            <br />
                            <p>
                                Don’t worry, we have d3.js available globally on this page so you won’t need to import it.
                            </p>
                            Alternatively, you could just press the <Icon name="play" size="s" /> icon, but that’s not as fun, is it?
                        </Aside>

                        <Code hasLineNumbers={false} canEval fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
    {`d3.select("#this-other-paragraph")
        .style("color", "cornflowerblue")
        .style("font-style", "italic")
        .style("font-weight", "bold")
    .selectAll("div")
    .data([1, 2, 3, 4, 5])
    .enter().append("div")
        .text(d => d)`}
                        </Code>

                        <Aside>
                            <p>
                                As an extra perk, running this code in your console will spit out the <b>d3 selection object</b> we created for our paragraph.
                            </p>
                            Go ahead and poke around in there to get an idea of how they are structured.
                        </Aside>

                        <p>
                            See how we added a new element for <i>every item in our array</i>? Think about how powerful this functionality could be when visualizing data.
                        </p>

                        <p>
                            You'll also notice that we used a <P>.selectAll()</P> method that selects <i>multiple elements</i>.
                        </p>

                        <p id="this-new-paragraph">
                            Now let’s sync our new elements when our data changes two seconds later:
                        </p>

                        <Code hasLineNumbers={false} canEval fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
    {`const paragraph = d3.select("#this-new-paragraph")
let array = [1, 2, 3, 4, 5]

paragraph.style("color", "cornflowerblue")
    .style("font-style", "italic")
    .style("font-weight", "bold")
  .selectAll("div")
  .data(array)
  .enter().append("div")
    .text(d => d)

setTimeout(() => {
  array = ["this", "is", "new", "content"]
  paragraph.style("color", "tomato")
  paragraph.selectAll("div")
    .data(array)
      .text(d => d)
    .exit().remove()
}, 2000)`}
                        </Code>

                        <p>
                            Nice! Now we can see our "data elements" updating!
                        </p>

                        <p>
                            You might have noticed that the content updates differently the second time we run the same code. <Twemoji svg text="🤔" />
                        </p>

                        <p>
                            The d3-selection update pattern is a common gotcha when learning d3. It’s important that you understand it well before using it, so read up on the basic pattern <Link href="https://bl.ocks.org/mbostock/3808218">on this guide by Mike Bostock</Link>.
                        </p>

                        <Aside>
                            <p>
                                If you’re familiar with the general d3 update pattern, there is a new method called <P>selection.join()</P> that’s here to make your life easier!
                            </p>
                            Read more <Link href="https://observablehq.com/@d3/selection-join">on Observable</Link>.
                        </Aside>

                        <p>
                            <b>D3 selection objects</b> have other methods - here's a few additional things they can help with:
                        </p>
                        <List items={[
                            <>
                                <P>{`.on()`}</P> & <P>{`.dispatch()`}</P>
                                <br />
                                <p>
                                    listening to (and dispatching) mouse & touch events.
                                </p>
                                D3 also provides <P>d3.mouse()</P> and <P>d3.touch()</P> methods that return the cursor position
                            </>,
                            <>
                                <P>{`.attr()`}</P> & <P>{`.style()`}</P> & <P>{`.property()`}</P>
                                <br />
                                updating elements’ attributes and styles
                            </>,
                            <>
                                <P>{`.text()`}</P> & <P>{`.html()`}</P>
                                <br />
                                modifying text
                            </>,
                            <>
                                <P>{`.sort()`}</P> & <P>{`.order()`}</P> & <P>{`.raise()`}</P> & <P>{`.lower()`}</P>
                                <br />
                                re-ordering elements
                            </>,
                            <>
                                <P>{`.transition()`}</P>
                                <br />
                                adding transitions and animations <i>(we'll talk more about this later)</i>
                            </>,
                        ]} />

                        <p>
                            And these are just the highlights! Take some time to learn these basics before overwhelming yourself in the deep end.
                        </p>

                        <ReadMore id="d3-selection" />

                        <Aside className="LearnD3__promo">
                            <img src={bookImage} alt="book" className="LearnD3__promo__img"/>
                             <div className="LearnD3__promo__text">
                                <p>
                                    A great place to start is the <Link href="fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> book.
                                </p>
                                <Link href="fullstack.io/fullstack-d3">Download the first chapter</Link> to dive in and you'll make your own custom data visualization by the end!
                            </div>
                        </Aside>

                        <h3>
                            d3-selection-multi
                        </h3>

                        <p>
                            <b>d3 selection objects</b> have <P>.style()</P> and <P>.attr()</P> methods to update the <b>styles</b> or <b>attributes</b> of DOM elements. But we can only update <i>one value per call</i>.
                        </p>
                        <p>
                            <Link href="https://github.com/d3/d3-selection"><b>d3-selection-multi</b></Link> adds <P>.styles()</P> and <P>.attrs()</P> methods to our <b>d3 selection objects</b> that will take an object of updates.
                        </p>

                        <Aside>
                            Note that this is an <i>external module</i> (in yellow) and is not included in the code d3.js bundle. If you want to use it, you’ll need to <Link href="https://bl.ocks.org/mbostock/bb09af4c39c79cffcde4">roll your own d3.js bundle</Link> or <Link href="https://github.com/d3/d3-selection-multi#installing">import it into your site individually</Link>.
                        </Aside>


                        <p>For example, this code:</p>

                        <Code hasLineNumbers={false} fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
    {`d3.select("#this-other-paragraph")
        .style("color", "cornflowerblue")
        .style("font-style", "italic")
        .style("font-weight", "bold")`}
                        </Code>

                        <p>can be written like so:</p>

                        <Code hasLineNumbers={false} fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
    {`d3.select("#this-other-paragraph")
        .styles({
            "color":       "cornflowerblue",
            "font-style":  "italic",
            "font-weight": "bold",
        })`}
                        </Code>

                        <p>
                            As you can see, this module mostly helps with code organization -- you might even prefer the original format!
                        </p>

                        <ReadMore id="d3-selection-multi" />

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-transition", "d3-ease", "d3-interpolate"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="d3-transition">
                            Modules for animation
                        </Heading>

                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-transition", "d3-ease", "d3-interpolate"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>

                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-quadtree", "d3-array", "d3-random", "d3-collection"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="d3-scale">
                            Modules for manipulating data
                        </Heading>


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-quadtree", "d3-array", "d3-random", "d3-collection"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>



                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                        <Aside>
                            Read more about <b>d3-array</b> on <Link href="https://github.com/d3/d3-array">the docs</Link>.
                        </Aside>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-scale", "d3-dsv"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="d3-scale">
                            Modules for fetching data
                        </Heading>


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-scale", "d3-dsv"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>




                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d != 0) return

                        setFocusedPackages(["d3-chord", "d3-voronoi", "d3-delaunay", "d3-force", "d3-sankey", "d3-contour", "d3-hexbin", "d3-hierarchy"])
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>
                        <Heading id="specific">
                            Modules for specific visualizations
                        </Heading>

                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-chord", "d3-voronoi", "d3-delaunay", "d3-force", "d3-sankey", "d3-contour", "d3-hexbin", "d3-hierarchy"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>

                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

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


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-geo", "d3-geo-polygon", "d3-geo-projection"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>



                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

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


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-shape", "d3-polygon", "d3-path"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>




                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

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


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-time", "d3-time-interval", "d3-timer"]}
                        />

                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>




                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

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


                        <D3ModulesInline
                            className="mobile"
                            modules={["d3-color", "d3-scale-chromatic", "d3-hsv"]}
                        />
                        <img alt="under construction" src={constructionGif} />
                        <Aside>
                            Sorry about the dummy text! This section is under contruction.
                        </Aside>


                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                            </p><p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p>

                    </ScrollEvent>

                    <ScrollEvent isInViewChange={d => {
                        if (d < 0) return

                        setFocusedPackages(null)
                        setIsDiagramShrunk(true)
                    }} hasIndicator={false}>

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
                            [{
                                name: "Modules for manipulating the DOM",
                                modules: ["d3-selection", "d3-selection-multi"],
                            },{
                                name: "Modules for animation",
                                modules: ["d3-transition", "d3-ease", "d3-interpolate"],
                            },{
                                name: "Modules for manipulating data",
                                modules: ["d3-quadtree", "d3-array", "d3-random", "d3-collection"],
                            },{
                                name: "Modules for fetching data",
                                modules: ["d3-scale", "d3-dsv"],
                            },{
                                name: "Modules for specific visualizations",
                                modules: ["d3-chord", "d3-voronoi", "d3-delaunay", "d3-force", "d3-sankey", "d3-contour", "d3-hexbin", "d3-hierarchy"],
                            },{
                                name: "Modules for maps and globes",
                                modules: ["d3-geo", "d3-geo-polygon", "d3-geo-projection"],
                            },{
                                name: "Modules for drawing SVG shapes",
                                modules: ["d3-shape", "d3-polygon", "d3-path"],
                            },{
                                name: "Modules for dealing with time",
                                modules: ["d3-time", "d3-time-interval", "d3-timer"],
                            },{
                                name: "Modules for dealing with colors",
                                modules: ["d3-color", "d3-scale-chromatic", "d3-hsv"],
                            }].map(({ name, modules }) => (
                                <div className="LearnD3__modules-list__item"
                                    onMouseEnter={() => setTempFocusedPackages(modules)}
                                    onMouseLeave={() => setTempFocusedPackages(null)}>
                                    { name }
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

const ReadMore = ({ id }) => (
    <Aside>
        Read more about <b>{ id }</b> on <Link href={`https://github.com/d3/${ id }`}>the docs</Link>.
    </Aside>
)