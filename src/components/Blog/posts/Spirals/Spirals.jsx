import React, { useState } from "react"
import { Helmet } from "react-helmet"

import Code from "components/_ui/Code/Code"
import Icon from "components/_ui/Icon/Icon"
import Link from "components/_ui/Link/Link"
import Expandy from "components/_ui/Expandy/Expandy"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"

import SpiralsHero from "./SpiralsHero"
import SpiralsForceDemo from "./SpiralsForceDemo"
import SpiralsDemo from "./SpiralsDemo"

import "./Spirals.scss"

const Spirals = () => {
  const [largeExampleDuration, setLargeExampleDuration] = useState("...")
  const [demoProps, setDemoProps] = useState({})

  return (
    <div className="Spirals">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Speeding up force simulations with spirals</title>
        <link rel="canonical" href="https://wattenberger.com/blog/spirals" />
        <meta property="og:type" content="website" />
        <meta name="description" content="D3.js force simulations are great for implementing basic physical rules, but they can be expensive to run. Here's a trick I've used in the past to speed up those simulations." />
      </Helmet>

      <div className="Spirals__spin-me">
        <Icon name="paperclip" className="Spirals__spin-me__icon" />
        This post is easiest to read in landscape mode
      </div>

      <SpiralsHero />

      <div className="Spirals__content">
        <div className="Spirals__side-by-side">
          <div className="Spirals__left">
            <p>
              One of the most enjoyable parts of the <Link to="https://d3js.org/">d3.js</Link> API is the <Link to="https://github.com/d3/d3-force">d3-force</Link> module.
            </p>
            <p>
              Using <Link to="https://github.com/d3/d3-force">d3-force</Link>, we can create a <b>force simulation</b> that gives life to basic particles, moving them according to basic physical rules.
            </p>


            <ScrollEvent className="Spirals__section" isInViewChange={d => {
              if (d != 0) return
              setDemoProps({
                doUseForce: false,
                doUseSpiral: false,
                num: 100,
              })
            }}>
              <p>
                For example, say we have an array of 100 points at [0, 0].
              </p>
              <p>
                Let's visualize them all!
              </p>
              <MobileDemo {...{
                doUseForce: false,
                doUseSpiral: false,
                num: 100,
              }} />
              <p>
                Hmm, that was a little underwhelming, wasn't it?
              </p>

            </ScrollEvent>

            <ScrollEvent className="Spirals__section" isInViewChange={d => {
              if (d != 0) return
              setDemoProps({
                doUseForce: true,
                hasMovementTicks: true,
                doUseSpiral: false,
                num: 100,
              })
            }}>
              <p>
                Let's add some physical forces to prevent our dots from overlapping, so we can see them all at once.
              </p>
              <MobileDemo {...{
                doUseForce: true,
                hasMovementTicks: true,
                doUseSpiral: false,
                num: 100,
              }} />
              <p>
                Fun! We run into an issue, however, when we have more particles to animate.
              </p>
            </ScrollEvent>

            <ScrollEvent className="Spirals__section" isInViewChange={d => {
              if (d != 0) return
              setDemoProps({
                doUseForce: true,
                hasMovementTicks: true,
                doUseSpiral: false,
                num: 600,
                onDurationUpdate: d => setLargeExampleDuration(d),
              })
            }}>
              <p>
                For example, let's look at how things run when we have 600 dots to animate.
              </p>
              <MobileDemo {...{
                doUseForce: true,
                hasMovementTicks: true,
                doUseSpiral: false,
                num: 600,
                onDurationUpdate: d => setLargeExampleDuration(d),
              }} />
              <p>
                Oh boy, this simulation took { (largeExampleDuration + "").slice(0, 4) } seconds.
              </p>
            </ScrollEvent>

            <ScrollEvent className="Spirals__section" isInViewChange={d => {
              if (d != 0) return
              setDemoProps({
                doUseForce: false,
                doUseSpiral: true,
                num: 600,
              })
            }}>
              <p>
                Instead, let's space our dots out by arranging them in a spiral.
              </p>
              <Expandy trigger="How do I generate a spiral?" triggerExpandText="tap to show code">
                <Code size="s" doWrap={false}>
    {`const getSpiralPositions = (
      pointRadius=5, n=100, angleDiff=3, distance=1.5
    ) => {
      let angle = 0
      return new Array(n).fill(0).map((_, i) => {
        const radius = Math.sqrt(i + 0.3) * pointRadius * distance
        angle += Math.asin(1 / radius) * pointRadius * angleDiff
        angle = angle % (Math.PI * 2)
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          angle,
        }
      })
    }`}
                </Code>
              </Expandy>
              <MobileDemo {...{
                doUseForce: false,
                doUseSpiral: true,
                num: 600,
              }} />
            </ScrollEvent>

                {/* <SpiralsDemo /> */}

            <ScrollEvent className="Spirals__section" isInViewChange={d => {
              if (d != 0) return
              setDemoProps({
                doUseForce: true,
                hasMovementTicks: true,
                doUseSpiral: true,
              })
            }}>
              <p>
                Perfect! Let's compare our naive approach with starting our dots in a spiral configuration.
              </p>

              <MobileDemo {...{
                doUseForce: true,
                hasMovementTicks: true,
                doUseSpiral: true,
              }} />
            </ScrollEvent>
          </div>

          <div className="Spirals__demo">
            <SpiralsForceDemo {...demoProps} />
          </div>
        </div>
        <div className="Spirals__text">
          <p>
            The astute reader might notice that we could just create a spiral with zero overlap, and we wouldn't need a simulation to space out our dots.
          </p>
          <p>
            In fact, this behavior is built right into d3.js! Examining <Link to="https://github.com/d3/d3-force/blob/aa410cf32eda02bdf17c84e43d9cb3d14fb102aa/src/simulation.js#L64-L71">the code</Link> will show that d3 will initialize points in a <Link to="https://observablehq.com/@mbostock/phyllotaxis">Phyllotaxis arrangement</Link> when no initial <b>x</b> or <b>y</b> value is specified.
          </p>

          <div className="Spirals__free-demo">
            <SpiralsForceDemo
              doUseNans
              doUseForce
              r={4.3}
              doStopWhenOffScreen
            />
          </div>

          <p>
            The default Phyllotaxis arrangement is a great option if your dots are around 3-5 pixels in radius and you want them to start around [0, 0].
          </p>

          <p>
            While this makes sense for our simple demo, the real world is often more complex. I needed both in a recent project where I was displaying a dynamic number of dots over different countries. But some countries' spirals were overlapping!
          </p>

          <p>
            This method could also be useful for dynamically sized dots. I hope you find this technique useful, and I can't wait to see how you use it!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Spirals;


const MobileDemo = props => {
  if (window.innerWidth > 800) return null
  return (
    <div className="Spirals__mobile-demo">
      <SpiralsForceDemo {...props} doStopWhenOffScreen />
    </div>
  )
}