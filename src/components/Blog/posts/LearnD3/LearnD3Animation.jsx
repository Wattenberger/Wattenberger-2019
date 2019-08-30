import React, { useMemo, useState } from "react"
import { Twemoji } from "react-emoji-render"
import * as d3 from "d3"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, ReadMore, P } from "./LearnD3"
import bookImage from "images/book.png";

const LearnD3Animation = ({ onScrollToSectionLocal }) => {

    return (
        <div className="LearnD3Animation">
            <p>
              While data visualizations have been displayed on static mediums for hundreds of years, we now have an amazing opportunity when we visualize data in a web browser. There is something really compelling about "replaying" events, as we've seen with the mass popularity of bar chart races this past year.
            </p>

            <p>
              But even if we're comvinced that we <i>want</i> our data visualization to animate, it can be technically difficult. Let's talk about the various d3 modules that can help out.
            </p>

            <h3>d3-interpolate</h3>

            <p>
              To animate a property from <b>point A</b> to <b>point B</b>, we need to create a series of states, smoothly interpolating between them. For example, to smoothly animate a blue circle changing into a green circle, we need to show the circle as blue, then blue-green, then green.
            </p>

            <CircleExample />

            <p>
              To create these in-between steps, we can use <DocsLink repo="interpolate" id="interpolate" />, which takes two parameters: <b>point A</b> and <b>point B</b>.
            </p>

            <p>
              <DocsLink repo="interpolate" id="interpolate" /> uses different methods (which are also surfaced), depending on the type of value of <b>point B</b>. For example, if <b>point B</b> is a number, it will use <DocsLink repo="interpolate" id="interpolateNumber" /> and if <b>point B</b> is a date, it will use <DocsLink repo="interpolate" id="interpolateDate" />.
            </p>

            <Aside>
              Learn more about handling date times in the <Link to="#" onClick={onScrollToSectionLocal("dealing-with-datetimes")}>datetimes section</Link>.
            </Aside>

            <Code>
{`const interpolator = d3.interpolate(0, 100)
interpolator(0  ) // 0
interpolator(0.5) // 50
interpolator(1  ) // 100`}
            </Code>

            <p>
              If we wanted to list out a number of steps, we could pass our interpolator to <DocsLink repo="interpolate" id="quantize" />, along with the number of steps that we wanted:
            </p>

            <Code doWrap={false}>
{`const interpolator = d3.interpolate(0, 100)
const steps = d3.quantize(interpolator, 11)
// steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`}
            </Code>

            <p>
              For animating colors, we can even specify the color space we want to work in with:
            </p>

            {colorMethods.map((d,i) => (
              <div key={d} style={{
                margin: "1em 0 2em",
                textAlign: "center",
              }}>
                <DocsLink repo="time" id={d}>{ d }</DocsLink>
                <ColorShift
                  from={d == "interpolateHue" ? 248 : undefined}
                  to={d == "interpolateHue" ? 51 : undefined}
                  interpolation={d}
                />
              </div>
            ))}

            <p>
              We can add <b>Long</b> to most of these methods to specify for our interpolator to take the <i>longer route</i>, eg <DocsLink repo="time" id="interpolateHclLong" />
            </p>

            {["interpolateHcl", "interpolateHclLong"].map((d,i) => (
              <div key={d} style={{
                margin: "1em 0 2em",
                textAlign: "center",
              }}>
                <DocsLink repo="time" id={d}>{ d }</DocsLink>
                <ColorShift
                  from={d == "interpolateHue" ? 248 : undefined}
                  to={d == "interpolateHue" ? 51 : undefined}
                  interpolation={d}
                />
              </div>
            ))}

<Aside>
  Learn more about handling colors in the <Link to="#" onClick={onScrollToSectionLocal("dealing-with-colors")}>colors section</Link>.
</Aside>

            <p>
              We can even get fancier with <DocsLink repo="interpolate" id="splines">spline</DocsLink> and <DocsLink repo="interpolate" id="piecewise">piecewise</DocsLink> interpolators.
            </p>

            <ReadMore id="interpolate" />

            <p>
              We don't even need to use <DocsLink repo="interpolate" /> directly -- we can use <DocsLink repo="transition" /> to create our animations.
            </p>

            <h3>d3-transition</h3>

            <p>
              We can create a <b>d3 transition</b> in two ways:
            </p>

            <List items={[
              <>
                on the document's <b>root element</b> using <DocsLink repo="transition" id="transition" />, or
              </>,
              <>
                on a <b>d3 selection</b> using a <b>d3 selection</b>'s <DocsLink repo="transition" id="selection_transition">.transition()</DocsLink> method
                <Aside>
                  Read about <b>d3 selection</b>s in the <Link to="#" onClick={onScrollToSectionLocal("manipulating-the-dom")}>manipulating the DOM section</Link>
                </Aside>
              </>,
            ]} />

            <p>
              If we create the transition on a <b>d3 selection</b>, we can use the transition's <DocsLink repo="transition" id="transition_attr">.attr()</DocsLink> (to change a HTML attribute) or <DocsLink repo="transition" id="transition_style">.style()</DocsLink> method (to change a CSS style) to animate a value.
            </p>

            <p>
              For example, we can animate a <P>{`<circle>`}</P>'s position like so:
            </p>

            <Aside>
              Run the animation by pressing the <Icon name="play" size="xs" /> icon.
            </Aside>

            <svg viewBox="0 0 550 100" width="550" height="100">
              <circle id="circle" cx="50" cy="50" r="40" fill="cornflowerblue" />
            </svg>

            <Code fileName="transition.js" canEval>
{`d3.select("#circle")
    .attr("cx", 50)
  .transition()
    .attr("cx", 500)`}
            </Code>

            <p>
              We can tweak the timing of our <P>{`<circle>`}</P>'s transition using its <DocsLink repo="transition" id="transition_delay">.delay()</DocsLink> and <DocsLink repo="transition" id="transition_duration">.duration()</DocsLink> methods.
            </p>

            <svg viewBox="0 0 550 100" width="550" height="100">
              <circle id="circle2" cx="50" cy="50" r="40" fill="cornflowerblue" />
            </svg>

            <Code fileName="transition.js" canEval>
{`d3.select("#circle2")
    .attr("cx", 50)
  .transition()
    .delay(500)
    .duration(2000)
    .attr("cx", 500)`}
            </Code>

            <p>
              We can animate multiple properties of our <P>{`<circle>`}</P> with the same transition:
            </p>

            <svg viewBox="0 0 550 100" width="550" height="100">
              <circle id="circle3" cx="50" cy="50" r="40" fill="cornflowerblue" />
            </svg>

            <Code fileName="transition.js" canEval>
{`d3.select("#circle3")
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
  .transition()
    .delay(500)
    .duration(2000)
    .attr("cx", 500)
    .style("fill", "lavender")`}
            </Code>

            <p>
              We can even easily start another transition once our first transition is finished:
            </p>

            <svg viewBox="0 0 550 100" width="550" height="100">
              <circle id="circle4" cx="50" cy="50" r="40" fill="cornflowerblue" />
            </svg>

            <Code fileName="transition.js" canEval>
{`d3.select("#circle4")
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
  .transition()
    .delay(500)
    .duration(2000)
    .attr("cx", 500)
  .transition()
    .duration(1000)
    .style("fill", "lavender")
  .transition()
    .duration(1000)
    .attr("cx", 50)
    .style("fill", "cornflowerblue")`}
            </Code>

            <h3>d3-ease</h3>

            <p>
              Our transitions don't have to interpolate linearly from <b>point A</b> to <b>point B</b>. <DocsLink repo="ease" /> is an entire d3 module that suppies different easing functions, which can be used to give your animations more personality.
            </p>

            <p>
              To use these easing functions, we can pass them to our transition's <DocsLink repo="transition" id="transition_ease">.ease()</DocsLink> method.
            </p>


            <svg viewBox="0 0 550 100" width="550" height="100">
              <circle id="circle5" cx="50" cy="50" r="40" fill="cornflowerblue" />
            </svg>

            <Code fileName="transition.js" canEval>
{`d3.select("#circle5")
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
  .transition()
    .delay(500)
    .duration(2000)
    .ease(d3.easeBounce)
    .attr("cx", 500)
  .transition()
    .duration(1000)
    .ease(d3.easeElasticInOut)
    .style("fill", "lavender")
  .transition()
    .duration(1000)
    .ease(d3.easeBounceOut)
    .attr("cx", 50)
    .style("fill", "cornflowerblue")`}
            </Code>

            <ReadMore id="ease" />

            <p>
              This is really the tip of the iceberg for animating data visualizations. <DocsLink repo="transition" /> might not even be what you use -- for example, I'll often use <Link to="https://www.react-spring.io">react-spring</Link> if I'm creating a data visualization using a javascript framework like <Link to="http://reactjs.org">React.js</Link>.
            </p>

            <Aside className="LearnD3__promo">
                <img src={bookImage} alt="book" className="LearnD3__promo__img"/>
                    <div className="LearnD3__promo__text">
                    <p>
                        There are many ways to animate elements in the web browser.
                    </p>
                    Learn about the different methods and do a deeper dive into <b>d3 transitions</b> in the <Link href="http://fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> book.
                </div>
            </Aside>

            <ReadMore id="transition" />

            <h3>d3-timer</h3>

            <p>
              Great! Now we know how to create animated transitions between two states, but how do we create a constantly running animation?
            </p>

            <p>
              <DocsLink repo="timer" id="timer" /> will call a callback function continuously, passing it the milliseconds that have elapsed since initialization.
            </p>

            <p>
              For example, it has been <P><span id="elapsed">-</span></P> millseconds have passed since you last pressed <Icon name="play" size="s" style={{color: "#bdbdcf"}} />.
            </p>

            <Code fileName="timer.js" canEval>
{`const timer = d3.timer(elapsed => {
  d3.select("#elapsed")
    .html(Math.round(elapsed))
  if (elapsed > 10000) timer.stop()
})`}
            </Code>

            <p>
              Note that we can use <DocsLink repo="timer" id="stop" /> to stop our timer after a certain amount of time.
            </p>

            <p>
              We can also execute a callback once, after a certain amount of time using <DocsLink repo="timer" id="timeout" />, and on an interval using <DocsLink repo="timer" id="interval" />.
            </p>

            <p>
              While there are native javascript methods for creating intervals, timeouts, and timers, <DocsLink repo="timer" /> has some performance enhancements (using <Link to="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame"><P>requestAnimationFrame</P></Link>) and won't run when the user's tab isn't open.
            </p>

            <ReadMore id="timer" />

            <video autoplay="" loop={true} muted={true}>
                <source src="https://video.twimg.com/tweet_video/D6nGU_gWwAAGek8.mp4" type="video/mp4" />
            </video>
            <Aside className="LearnD3__promo">
                <img src={bookImage} alt="book" className="LearnD3__promo__img"/>
                  <div className="LearnD3__promo__text">
                    The Advanced version of <Link href="http://fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> does a comprehensive walk-through of the animated simulation above.
                </div>
            </Aside>

        </div>
    )
}

export default LearnD3Animation

const colorMethods = [
  "interpolateRgb",
  "interpolateHsl",
  "interpolateLab",
  "interpolateHcl",
  "interpolateCubehelix",
  "interpolateHue",
]

const CircleExample = () => (
  <div className="CircleExample" />
)

const ColorShift = ({
  from="slateblue",
  to="gold",
  interpolation,
}) => {
  const interpolator = d3[interpolation](from, to)
  const steps = d3.quantize(interpolator, 10)
  return (
    <div className="ColorShift">
      {steps.map((step,i) => (
        <div
          key={i}
          className="ColorShift__circle"
          style={{
            background: Number.isFinite(step) ? `hsl(${step}, 100%, 50%)` : step,
          }}
        />
      ))}
    </div>
  )
}