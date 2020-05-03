import React, { useEffect, useMemo, useRef, useState } from "react"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"

import { getSpiralPositions } from "./utils"

const SpiralsDemo = () => {
  const [r, setR] = useState(5)
  const [num, setNum] = useState(600)
  const [angleDiff, setAngleDiff] = useState(6)
  const [distance, setDistance] = useState(2)

  const width = 550
  const height = 550

  const positions = useMemo(() => (
    getSpiralPositions(r, num, angleDiff, distance)
  ), [r, num, angleDiff, distance])

  const canvasElem = useRef()

  useEffect(() => {
    const context = canvasElem.current.getContext("2d")

    context.clearRect(0, 0, width, height)
    context.fillStyle = "#9980FA"

    positions.forEach(({ x, y }) => {
      context.beginPath()
      context.arc(
        x + width / 2, y + height / 2, r,
        0, 2 * Math.PI, false
      )
      context.fill()
    })
  }, [positions])

  return (
    <div className="SpiralsDemo">
      <div className="SpiralsDemo__sliders">
        <div className="SpiralsDemo__slider-group">
          <div className="SpiralsDemo__slider-group__labels">
            <h6>r</h6>
            <h6>{ r }</h6>
          </div>
          <Slider
            className="SpiralsDemo__slider"
            value={r}
            min={0}
            max={7}
            onChange={setR}
          />
        </div>

        <div className="SpiralsDemo__slider-group">
          <div className="SpiralsDemo__slider-group__labels">
            <h6>num</h6>
            <h6>{ num }</h6>
          </div>
          <Slider
            className="SpiralsDemo__slider"
            value={num}
            min={0}
            max={1000}
            onChange={setNum}
          />
        </div>

        <div className="SpiralsDemo__slider-group">
          <div className="SpiralsDemo__slider-group__labels">
            <h6>angleDiff</h6>
            <h6>{ angleDiff }</h6>
          </div>
          <Slider
            className="SpiralsDemo__slider"
            value={angleDiff}
            min={0}
            max={10}
            step={0.01}
            onChange={setAngleDiff}
          />
        </div>

        <div className="SpiralsDemo__slider-group">
          <div className="SpiralsDemo__slider-group__labels">
            <h6>distance</h6>
            <h6>{ distance }</h6>
          </div>
          <Slider
            className="SpiralsDemo__slider"
            value={distance}
            min={0}
            max={5}
            step={0.01}
            onChange={setDistance}
          />
        </div>
      </div>

      <canvas
        ref={canvasElem}
        {...{width, height}}
      />
    </div>
  )
}

export default SpiralsDemo