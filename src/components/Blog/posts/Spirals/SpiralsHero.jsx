import React, { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { scaleLinear, scaleSequential } from "d3-scale"
import { hsl } from "d3-color"
import { interpolatePlasma } from "d3-scale-chromatic"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"
import { forceSimulation, forceX, forceY, forceCollide, forceCenter, forceRadial } from "d3-force"

import { getDistance, getSpiralPositions, sum, useChartDimensions, useIsOnScreen } from "./utils"
import { useInterval } from "utils/utils"

import "./SpiralsHero.scss"

const movementColorScale = scaleSequential(
  // [-130, 600],
  [1000, -100],
  // [-100, 1000],
  // .range(["#B9B6C8", "#D9A16A"])
  interpolatePlasma,
)

const dmsSettings = {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
}
const r = 5
const num = 600
const spiralPositions = [
  getSpiralPositions(r, num, 2, 2.5),
  getSpiralPositions(r, num, 3, 3.5),
  getSpiralPositions(r, num, 2.3, 1.75),
  getSpiralPositions(r, num, 3.9, 4.1),
  getSpiralPositions(r, num, 2.5, 1.6),
  getSpiralPositions(r, num, 2.3, 2.9),
  getSpiralPositions(r, num, 4.3, 1.9),
  getSpiralPositions(r, num, 9.12, 2),
  getSpiralPositions(r, num, 6.98, 2),
  getSpiralPositions(r, num, 6.28, 2),
  getSpiralPositions(r, num, 6.25, 2),
  getSpiralPositions(r, num, 6.07, 2),
  getSpiralPositions(r, num, 5.93, 2),
  getSpiralPositions(r, num, 6.28, 1.59),
  getSpiralPositions(r, num, 6.31, 2.29),
]
const SpiralsHero = () => {
  const [containerElem, dms] = useChartDimensions(dmsSettings)
  const currentDms = useRef({})
  const canvasElem = useRef()
  const isOnScreen = useIsOnScreen(containerElem)
  const isOnScreenCurrent = useRef()

  const focusPoint = useRef([])
  const positions = useRef(spiralPositions[0].map(d => ({...d, vx: 0.6, vy: 0.6})))
  const simulation = useRef()
  const color = useRef(hsl("#628BD3"))

  useEffect(() => {
    isOnScreenCurrent.current = isOnScreen
  }, [isOnScreen])

  useEffect(() => {
    focusPoint.current = [
      dms.width / 2,
      dms.height / 2,
    ]
    if (simulation.current) {
      simulation.current
        .force("x", forceX((d,i) => dms.width / 2))
        .force("y", forceY((d,i) => dms.height / 2))
    }
    currentDms.current = dms
  }, [dms.width, dms.height])

  const drawDots = () => {
    simulation.current.alpha(0.8)
    if (!isOnScreenCurrent.current) return

    if (!canvasElem.current) return
    const context = canvasElem.current.getContext("2d")

    context.clearRect(0, 0, currentDms.current.width, currentDms.current.height)

    context.globalAlpha = 0.9
    // context.globalCompositeOperation = "multiply"
    context.fillStyle = color.current.rgb()
    // context.fillStyle = "#9980FA"

    positions.current.forEach(({x, y}) => {
      context.beginPath()
      context.arc(
        x, y, r,
        0, 2 * Math.PI, false
      )
      context.fill()
    })
  }

  useEffect(() => {
    simulation.current = forceSimulation()
      .force("x", forceX(d => focusPoint.current[0]))
      .force("y", forceY(d => focusPoint.current[1]))
      .force("collide", forceCollide(() => r + 3.9).strength(0.6))
      // .velocityDecay(0.1)
      .nodes(positions.current)
      // .stop()
      .on("tick", () => {
        drawDots()
        if (!simulation.current) return
        simulation.current.tick()
        color.current.h += 1
      })
  }, [])

  const onMouseMove = e => {
    const pos = [
      e.clientX,
      e.clientY,
    ]
    focusPoint.current = pos
    const spiral = spiralPositions[Math.floor(Math.random() * spiralPositions.length)]
    simulation.current
      .force("x", forceX((d,i) => focusPoint.current[0] + spiral[i].x).strength(0.3))
      .force("y", forceY((d,i) => focusPoint.current[1] + spiral[i].y).strength(0.3))

    positions.current.forEach((d,i) => {
      d.x = positions.current[0].x
      d.y = positions.current[0].y
    })
  }

  return (
    <div className="SpiralsHero" ref={containerElem}>
      <canvas
        ref={canvasElem}
        width={dms.width}
        height={dms.height}
        onMouseMove={onMouseMove}
      />
      <div className="SpiralsHero__text">
        <h1>
          Use the Force
        </h1>
        <h3>
          Speeding up force simulations with spirals
        </h3>
      </div>
    </div>
  )
}

export default SpiralsHero;
