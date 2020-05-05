import React, { useEffect, useRef, useState } from "react"
import { format } from "d3-format"
import { scaleSequential } from "d3-scale"
import { interpolatePlasma } from "d3-scale-chromatic"
import { forceSimulation, forceX, forceY, forceCollide } from "d3-force"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"

import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"
import { getSpiralPositions, getDistance, sum, useChartDimensions, useIsOnScreen } from "./utils"

import "./SpiralsForceDemo.scss"

const SpiralsForceDemo = ({ r=5, num=600, angleDiff=2, distance=1.5, doUseNans=false, doUseForce=false, doUseSpiral=false, doStopWhenOffScreen=false, hasMovementTicks=false, onDurationUpdate=() => {} }) => {
  const [localR, setLocalR] = useState(r || 5)
  const [localNum, setLocalNum] = useState(num || 600)
  const [localAngleDiff, setLocalAngleDiff] = useState(angleDiff || 2)
  const [localDistance, setLocalDistance] = useState(distance || 1.5)

  const [duration, setDuration] = useState(null)
  const [iteration, setIteration] = useState(null)
  const [containerElem, dms] = useChartDimensions()

  const scaledR = localR * (dms.width < 800 ? (dms.width / 500 + 0.1) : 1)

  const positions = useRef()

  const canvasElem = useRef()
  const currentIteration = useRef()
  const isOnScreen = useIsOnScreen(containerElem)
  const isOnScreenCurrent = useRef()

  useEffect(() => {
    isOnScreenCurrent.current = isOnScreen
  }, [isOnScreen])

  useEffect(() => {
    setLocalNum(num)
  }, [num])
  useEffect(() => {
    setLocalAngleDiff(angleDiff)
  }, [angleDiff])
  useEffect(() => {
    setLocalDistance(distance)
  }, [distance])

  useEffect(() => {
    setIteration(iteration + 1)
    currentIteration.current = iteration + 1
  }, [num, doUseForce, doUseSpiral, localR, localNum, localAngleDiff, localDistance, (doStopWhenOffScreen && isOnScreen)])
  useEffect(() => {
    currentIteration.current = iteration
  }, [iteration])

  function drawDots() {
    // const alpha = simulation.current.alpha()
    // if (alpha < 0.001) {
    //   simulation.current.stop()
    //   const duration = (new Date() - startTime.current) / 1000
    //   setDuration(duration)
    // }

    if (!canvasElem.current) return
    const context = canvasElem.current.getContext("2d")

    context.clearRect(0, 0, dms.width, dms.height)
    context.fillStyle = "#9980FA"

    positions.current.forEach(({x, y, movement}) => {
      context.fillStyle = movementColorScale(movement) || "#9980FA"
      context.beginPath()
      context.arc(
        x + dms.width / 2, y + dms.height / 2, scaledR,
        0, 2 * Math.PI, false
      )
      context.fill()
    })
  }

  const startSimulation = () => {
    const initialPositions = doUseSpiral
      ? getSpiralPositions(
        scaledR,
        localNum,
        localAngleDiff,
        localDistance,
      )
      : new Array(localNum).fill(0).map(() => (doUseNans ? {} : {x: 0, y: 0}))

    positions.current = initialPositions

    if (!doUseForce) {
      drawDots()
      return
    }

    const startTime = new Date()
    let simulation = forceSimulation()
      .force("x", forceX(d => d.x))
      .force("y", forceY(d => d.y))
      .force("collide", forceCollide(() => scaledR + 2).strength(0.6))
      .nodes(positions.current)
      .stop()

    let isRunning = true

    let lastPositions = positions.current
    let tickIterations = 0

    const tick = () => {
      if (!isRunning) return
      if (currentIteration.current != iteration) {
        isRunning = false
        return
      }

      const dotDiffs = lastPositions.map((d, i) => (
        getDistance(d, positions.current[i])
      ))
      const avgDotDiffs = sum(dotDiffs) / positions.current.length
      positions.current.forEach((d, i) => {
        if (!d.movement) d.movement = 0
        d.movement += dotDiffs[i]
      })

      if (!(tickIterations % 4)) {
        const duration = (new Date() - startTime) / 1000
        setDuration(duration)
      }

      if (
        avgDotDiffs < 0.03
        && tickIterations > 12
        || (doStopWhenOffScreen && !isOnScreenCurrent.current)
      ) {
        const duration = (new Date() - startTime) / 1000
        setDuration(duration)
        onDurationUpdate(duration)
        isRunning = false
      }

      lastPositions = positions.current.map(d => ({
        x: d.x,
        y: d.y,
      }))
      tickIterations++

      simulation.tick()
      drawDots()
      requestAnimationFrame(tick)
    }
    tick()
  }
  useEffect(() => {
    startSimulation()
  }, [iteration])

  const onRefresh = () => {
    setIteration(iteration + 1)
  }

  return (
    <div className="SpiralsForceDemo" ref={containerElem}>
      {doUseForce && (
        <>
          <h6 className="SpiralsForceDemo__time">
            Duration:
            <div className="SpiralsForceDemo__time__numbers">
              { duration ? format(",.1f")(duration) : "-" }
            </div>
            seconds
          </h6>
          <Button className="SpiralsForceDemo__refresh" onClick={onRefresh}>
            <Icon name="refresh" key={iteration} />
            Restart simulation
          </Button>
        </>
      )}
      {hasMovementTicks && (
        <div className="SpiralsForceDemo__ticks">
          <div className="SpiralsForceDemo__ticks__label">
            More movement <Icon name="arrow" direction="e" size="s" />
          </div>
          {movementColorScaleTicks.map(([value, color]) => (
            <div
              key={value}
              className="SpiralsForceDemo__ticks__item"
              style={{
                background: color,
              }}
            />
          ))}
        </div>
      )}
      {doUseSpiral && (
        <div className="SpiralsForceDemo__sliders">
          <div className="SpiralsForceDemo__slider-group">
            <div className="SpiralsForceDemo__slider-group__labels">
              <h6>r</h6>
              <h6>{ localR }</h6>
            </div>
            <Slider
              className="SpiralsForceDemo__slider"
              value={localR}
              min={0}
              max={7}
              onChange={setLocalR}
            />
          </div>

          <div className="SpiralsForceDemo__slider-group">
            <div className="SpiralsForceDemo__slider-group__labels">
              <h6>num</h6>
              <h6>{ num }</h6>
            </div>
            <Slider
              className="SpiralsForceDemo__slider"
              value={localNum}
              min={0}
              max={1000}
              onChange={setLocalNum}
            />
          </div>

          <div className="SpiralsForceDemo__slider-group">
            <div className="SpiralsForceDemo__slider-group__labels">
              <h6>angleDiff</h6>
              <h6>{ localAngleDiff }</h6>
            </div>
            <Slider
              className="SpiralsForceDemo__slider"
              value={localAngleDiff}
              min={0}
              max={10}
              step={0.01}
              onChange={setLocalAngleDiff}
            />
          </div>

          <div className="SpiralsForceDemo__slider-group">
            <div className="SpiralsForceDemo__slider-group__labels">
              <h6>distance</h6>
              <h6>{ localDistance }</h6>
            </div>
            <Slider
              className="SpiralsForceDemo__slider"
              value={localDistance}
              min={0}
              max={3}
              step={0.01}
              onChange={setLocalDistance}
            />
          </div>
        </div>
      )}
      <canvas
        ref={canvasElem}
        width={dms.width}
        height={dms.height}
      />
    </div>
  )
}

const movementColorScale = scaleSequential(
  // [-130, 600],
  [1000, -100],
  // [-100, 1000],
  // .range(["#B9B6C8", "#D9A16A"])
  interpolatePlasma,
)

const movementColorScaleTicks = movementColorScale.ticks(9).map(d => [
  d,
  movementColorScale(d),
]).slice(1).reverse()

export default SpiralsForceDemo