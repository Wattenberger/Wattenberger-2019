import React, { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { forceSimulation, forceX, forceY, forceCollide, forceCenter, forceRadial } from "d3-force"

import Button from "components/_ui/Button/Button"
import Code from "components/_ui/Code/Code"
import Icon from "components/_ui/Icon/Icon"
import Link from "components/_ui/Link/Link"

import SpiralsHero from "./SpiralsHero"
import SpiralsForceDemo from "./SpiralsForceDemo"
import SpiralsDemo from "./SpiralsDemo"
import { useIsOnScreen } from "./utils"

import "./Spirals.scss"

const Spirals = () => {
  const [largeExampleDuration, setLargeExampleDuration] = useState("-")

  return (
    <div className="Spirals">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Use the Force: Spirals Edition</title>
        <link rel="canonical" href="https://wattenberger.com/blog/spirals" />
        <meta property="og:type" content="website" />
        <meta name="description" content="" />
      </Helmet>

      <SpiralsHero />

      <div className="Spirals__content">
        <div className="Spirals__text">
          <p>
            One of the most enjoyable parts of the <Link to="https://d3js.org/">d3.js</Link> API is the <Link to="https://github.com/d3/d3-force">d3-force</Link> module.
          </p>
          <p>
            Using <Link to="https://github.com/d3/d3-force">d3-force</Link>, we can create a <b>force simulation</b> that gives life to basic particles, moving them according to basic physical rules.
          </p>
        </div>

        <div className="Spirals__row">
          <div className="Spirals__row__text">
            <p>
              For example, say we have an array of 100 points at [0, 0].
            </p>
            <p>
              Let's visualize them all at once!
            </p>
          </div>

          <div className="Spirals__example">
            <ExampleCenter />
          </div>
        </div>

        <div className="Spirals__text">
          <p>
            Hmm, that was a little underwhelming, wasn't it?
          </p>
        </div>
        <div className="Spirals__row">
          <div className="Spirals__row__text">
            <p>
              Let's add some physical forces to prevent our dots from overlapping, so we can see them all at once.
            </p>
          </div>

          <div className="Spirals__example">
            <ExampleForce />
          </div>
        </div>

        <div className="Spirals__text">
          <p>
            Fun! We run into an issue, however, when we have more particles to animate.
          </p>
        </div>
        <div className="Spirals__row">
          <div className="Spirals__row__text">
            <p>
              For example, let's look at how things run when we have 600 dots to animate.
            </p>
            <br />
            <br />
            <br />
            <p>
              Oh boy, this simulation took { (largeExampleDuration + "").slice(0, 4) } seconds.
            </p>
          </div>

          <div className="Spirals__example">
            <SpiralsForceDemo onDurationUpdate={d => setLargeExampleDuration(d)} />
          </div>
        </div>

        <div className="Spirals__text">
          <p>
            Instead, let's space our dots out when we create them.
          </p>
        </div>
        <div className="Spirals__row">
          <div className="Spirals__row__text">
            <p>
              Let's create a spiral, using the radius of our dots.
            </p>
            <Code size="s">
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
          </div>

          <div className="Spirals__example">
            <SpiralsDemo />
          </div>
        </div>

        <div className="Spirals__text">
          <p>
            In this simple example, you might just want to use the spiral positions. However, using them as a starting point and running a simulation with collision detection is great for more complex situations: for example, when each dot has a different radius, or when there are multiple spirals that may overlap.
          </p>
          <p>
            Perfect! Let's compare our naive approach with starting our dots in a spiral configuration.
          </p>
        </div>

        <div className="Spirals__row">
          <SpiralsForceDemo />
          <SpiralsForceDemo doUseSpiral />
        </div>

        <div className="Spirals__text">
          <p>
            Things run 10x faster!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Spirals;



const ExampleCenter = () => {
  const dots = new Array(100).fill(0).map(d => ({
    x: 0,
    y: 0,
    r: 6,
  }))

  return (
    <svg width="450" height="450" viewBox="-225 -225 450 450">
      {dots.map(({ x, y, r }) => (
        <circle
          cx={x}
          cy={y}
          r={r}
          fill="#9980FA"
        />
      ))}
    </svg>
  )
}

const ExampleForce = () => {
  const width = 450
  const height = 450
  const r = 6
  const num = 100

  const positions = useRef()
  const containerElem = useRef()
  const canvasElem = useRef()

  const isOnScreen = useIsOnScreen(containerElem)

  function drawDots() {
    if (!canvasElem.current) return
    const context = canvasElem.current.getContext("2d")

    context.clearRect(0, 0, width, height)
    context.fillStyle = "#9980FA"

    positions.current.forEach(({ x, y }) => {
      context.beginPath()
      context.arc(
        x + width / 2, y + height / 2, r,
        0, 2 * Math.PI, false
      )
      context.fill()
    })
  }

  const startSimulation = () => {
    const initialPositions = new Array(num).fill(0).map(() => ({x: 0, y: 0}))

    positions.current = initialPositions

    let simulation = forceSimulation()
      .force("x", forceX(d => d.x))
      .force("y", forceY(d => d.y))
      .force("collide", forceCollide(() => r + 2))
      .nodes(positions.current)
      .stop()

    let isRunning = true

    const tick = () => {
      if (!isRunning) return
      if (simulation.alpha() < 0.01) {
        isRunning = false
      }

      simulation.tick()
      drawDots()
      requestAnimationFrame(tick)
    }
    tick()
  }
  useEffect(() => {
    startSimulation()
  }, [isOnScreen])

  return (
    <div className="ExampleForce" ref={containerElem}>
      <Button onClick={startSimulation}>
        <Icon name="refresh" />
      </Button>
      <canvas
        ref={canvasElem}
        {...{width, height}}
      />
    </div>
  )
}