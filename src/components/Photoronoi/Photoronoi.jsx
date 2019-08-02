import React, { useEffect, useMemo, useRef, useState } from "react"
import _ from "lodash"
import Slider from 'rc-slider';
import Button from 'components/_ui/Button/Button';
import 'rc-slider/assets/index.css';
import { Delaunay } from "d3-delaunay";

// import imageUrl from "./me.png"

import "./Photoronoi.scss"

const imageUrl = "https://amp.businessinsider.com/images/5a81cbc2d030729f008b457d-750-563.jpg"
const staticWidth = 900

// const lineHeight = height / 100
const lineHeight = 2
const Photoronoi = () => {
  const canvas = useRef()
  const [width, setWidth] = useState(staticWidth)
  const [height, setHeight] = useState(900)
  const [pixelArray, setPixelArray] = useState([])
  const [fileUrl, setFileUrl] = useState(imageUrl)
  const [threshold, setThreshold] = useState(30)
  const [canvasOpacity, setCanvasOpacity] = useState(0)

  useEffect(() => {
    if (!threshold || !isFinite(threshold) || threshold < 1) return
    loadImage()
  }, [threshold])

  const loadImage = url => {
    const image = new window.Image()
    image.crossOrigin = '*'
    image.src = url || imageUrl
    image.onload = function() {
      const context = canvas.current.getContext('2d')
      const imageWidth = image.naturalWidth
      const sizeRatio = staticWidth / imageWidth
      const height = image.naturalHeight * sizeRatio
      setHeight(height)

      context.drawImage(image, 0, 0, width, height)
      const imageData = context.getImageData(0, 0, width, height);
      const allValues = Array.from(imageData.data)

      const pixelsPerRow = width * 4
      const numberOfRows = Math.floor(allValues.length / pixelsPerRow)
      const numberOfColumns = Math.floor(allValues.length / (height * 4))
      const pixelArray = _.times(numberOfRows, i => {
        const valuesInRow = allValues.slice(pixelsPerRow * i, pixelsPerRow * (i + 1))
        return _.times(valuesInRow.length / 4, i => ({
          r: valuesInRow[i * 4 + 0],
          g: valuesInRow[i * 4 + 1],
          b: valuesInRow[i * 4 + 2],
          a: valuesInRow[i * 4 + 3],
        }))
      })
      setPixelArray(pixelArray)
    }
  }

  const {
    dots,
    voronoiPaths,
  } = useMemo(() => {
    if (!pixelArray.length) return {
      dots: [],
      voronoiPaths: [],
    }

    let dots = []

    pixelArray.forEach((row, rowIndex) => {
      // only every nth row
      if (rowIndex % lineHeight) return

      row.forEach((p, i) => {
        // only every nth pixel
        if (i % lineHeight) return
        if (p.a < 100) return

        const darkness = p.r + p.b + p.g
        const doesHaveDot = Math.random() * darkness < threshold
        if (!doesHaveDot) return

        dots.push({
          x: i,
          y: rowIndex,
          color: p,
        })
      })
    })

    const delaunay = Delaunay.from(dots, d => d.x, d => d.y)
    const voronoi = delaunay.voronoi([0, 0, width, height])
    const voronoiPaths = dots.map((d, i) => voronoi.renderCell(i))

    return {
      dots,
      voronoiPaths,
    }
  }, [pixelArray])

  const onChangeImage = e => {
    e.preventDefault()
    loadImage(fileUrl)
  }

  return (
    <div className="Photoronoi">
    <div className="Photoronoi__controls">
      <div className="Photoronoi__field">
        <label>
          Image url
        </label>

        <div className="Photoronoi__field__value">
          <form onSubmit={onChangeImage}>
            <input value={fileUrl} placeholder="Image url" onChange={e => setFileUrl(e.target.value)} />
            <Button type="submit">Grab image</Button>
          </form>
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Darkness threshold
        </label>
        <div className="Photoronoi__field__value">
          <input value={threshold} placeholder="threshold" type="number" onChange={e => {
            const value = e.target.value
            setThreshold(value)
          }} />
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Image opacity
        </label>
        <div className="Photoronoi__field__value">
          <Slider
            className="Photoronoi__slider"
            value={canvasOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={setCanvasOpacity}
            pushable
            allowCross={false}
          />
        </div>
      </div>
    </div>

      <canvas className="Photoronoi__canvas" height={height} width={width} ref={canvas} style={{opacity: canvasOpacity}} />
      <svg className="Photoronoi__svg" height={height} width={width}>
        {/* <Dots {...{dots}} /> */}
        <Voronoi paths={voronoiPaths} />
      </svg>
    </div>
  )
}

export default Photoronoi


function chunkArray(arr, chunkLength){
    let results = []
    while (arr.length) {
        results.push(arr.splice(0, chunkLength))
    }
    return results
}

const Dots = React.memo(({ dots }) => (
  <g className="Dots">
    {dots.map((d, i) => (
      <circle
        key={i}
        cx={d.x}
        cy={d.y}
        r={1}
        // fill={`rgb(${[
        //   d.color.r,
        //   d.color.b,
        //   d.color.g,
        // ].join(", ")})`}
      />
    ))}
  </g>
))
const Voronoi = React.memo(({ paths }) => (
  <g className="Voronoi">
    {paths.map((d, i) => (
      <path
        key={i}
        d={d}
      />
    ))}
  </g>
))