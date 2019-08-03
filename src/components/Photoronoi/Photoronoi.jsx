import React, { useEffect, useMemo, useRef, useState } from "react"
import _ from "lodash"
import Slider from 'rc-slider';
import Button from 'components/_ui/Button/Button';
import Toggle from 'components/_ui/Toggle/Toggle';
import Icon from 'components/_ui/Icon/Icon';
import 'rc-slider/assets/index.css';
import { Delaunay } from "d3-delaunay";

// import imageUrl from "./me.png"
import imageUrl from "./lincoln.png"

import "./Photoronoi.scss"

// const imageUrl = "https://amp.businessinsider.com/images/5a81cbc2d030729f008b457d-750-563.jpg"
const staticWidth = 900

const typeOptions = [{
  id: "delaunay",
  label: "delaunay",
},{
  id: "voronoi",
  label: "voronoi",
}]
// const lineHeight = height / 100
const Photoronoi = () => {
  const canvas = useRef()
  const svg = useRef()
  const [width, setWidth] = useState(staticWidth)
  const [height, setHeight] = useState(900)
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [dotsResolution, setDotsResolution] = useState(2)
  const [imageFile, setImageFile] = useState(null)
  const [type, setType] = useState("voronoi")
  const [pixelArray, setPixelArray] = useState([])
  const [fileUrl, setFileUrl] = useState(imageUrl)
  const [threshold, setThreshold] = useState(30)
  const [canvasOpacity, setCanvasOpacity] = useState(0)

  useEffect(() => {
    if (!threshold || !isFinite(threshold) || threshold < 1) return
    if (!dotsResolution || !isFinite(dotsResolution) || dotsResolution < 1) return
    loadImage()
  }, [threshold, dotsResolution, type, imageFile])

  const loadImage = () => {
    const image = new window.Image()
    image.crossOrigin = '*'
    image.src = imageFile || fileUrl
    const context = canvas.current.getContext('2d')
    context.clearRect(0, 0, width, height)

    image.onload = function() {
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
    voronoiPath,
  } = useMemo(() => {
    if (!pixelArray.length) return {
      dots: [],
      voronoiPaths: [],
    }

    let dots = []

    pixelArray.forEach((row, rowIndex) => {
      // only every nth row
      if (rowIndex % dotsResolution) return

      row.forEach((p, i) => {
        // only every nth pixel
        if (i % dotsResolution) return
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
    const voronoiPaths = dots.map((d, i) => ({
      d: voronoi.renderCell(i),
      ...d,
    }))
    // const voronoiPaths = dots.map((d, i) => delaunay.renderTriangle(i))
    const voronoiPath = type == "delaunay" ? delaunay.render() : voronoi.render()

    return {
      dots,
      voronoiPaths,
      voronoiPath,
    }
  }, [pixelArray])

  const onChangeImage = e => {
    e.preventDefault()
    loadImage()
  }

  const setFile = async e => {
    const file = e.target.files[0];
    if (!e.target.files[0]) return
    setImageFile(URL.createObjectURL(e.target.files[0]))
  }

  const onDownload = () => {
    const svgData = svg.current.outerHTML
    const svgBlob = new Blob([svgData], {type:"image/svg+xmlcharset=utf-8"})
    const svgUrl = URL.createObjectURL(svgBlob)
    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = "Photoronoi.svg"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const onCopy = () => {
    try {
      const svgData = svg.current.outerHTML
      console.log(svgData, typeof svgData)
      var textField = document.createElement('textarea')
      textField.innerText = svgData
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()
    } catch(e) {
      console.log("nope", e)
    }
  }

  return (
    <div className="Photoronoi">
    <h3>
      Photoronoi
    </h3>
    <p>
      Upload an image or grab from a url to turn an image into a voronoi SVG.
    </p>
    <p>
      Darker parts of the image result in smaller polygons - play around with the settings to see what works best for your picture! You might try removing the background of your image using <a href="http://remove.bg">remove.bg</a>.
    </p>
    <div className="Photoronoi__controls">
      <div className="Photoronoi__field">
        <label>
          Image url
        </label>

        <div className="Photoronoi__field__value">
          <form onSubmit={onChangeImage}>
            <input value={fileUrl} placeholder="Image url" onChange={e => {
              setImageFile(null)
              setFileUrl(e.target.value)
            }} />
            <Button type="submit">Grab</Button>
          </form>
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Upload
        </label>
        <div className="Photoronoi__field__value">
          <div className="Photoronoi__file">
            <input name="Photoronoi__file" id="Photoronoi__file" type="file" onChange={setFile} />
            <label for="Photoronoi__file">
              <Button>
                <Icon name="upload" />
              </Button>
            </label>
          </div>
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
          />
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Stroke Width
        </label>
        <div className="Photoronoi__field__value">
          <Slider
            className="Photoronoi__slider"
            value={strokeWidth}
            min={0}
            max={6}
            step={0.5}
            onChange={setStrokeWidth}
            pushable
          />
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Dots Resolution
        </label>
        <div className="Photoronoi__field__value">
          <Slider
            className="Photoronoi__slider"
            value={dotsResolution}
            min={1}
            max={10}
            step={1}
            onChange={setDotsResolution}
            pushable
          />
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Type
        </label>
        <div className="Photoronoi__field__value">
          <Toggle
            className="Photoronoi__slider"
            value={type}
            options={typeOptions}
            onChange={setType}
          />
        </div>
      </div>
      <div className="Photoronoi__field">
        <label>
          Download
        </label>
        <div className="Photoronoi__field__value">
          <Button onClick={onDownload}>
            <Icon name="download" />
          </Button>
          {/* <Button onClick={onCopy}>
            <Icon name="copy" />
          </Button> */}
        </div>
      </div>
    </div>

      <div className="Photoronoi__images">
        <canvas className="Photoronoi__canvas" height={height} width={width} ref={canvas} style={{opacity: canvasOpacity}} />
        <svg className="Photoronoi__svg" xmlns="http://www.w3.org/2000/svg" height={height} width={width} ref={svg}>
          {/* <Dots {...{dots}} /> */}
          {/* <Voronoi paths={voronoiPaths} strokeWidth={strokeWidth} /> */}
          <path d={voronoiPath} fill="none" stroke="#6a6a85" strokeWidth={strokeWidth} />
        </svg>
      </div>
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
const Voronoi = React.memo(({ paths, strokeWidth }) => (
  <g className="Voronoi">
    {paths.map((d, i) => (
      <path
        key={i}
        d={d.d}
        strokeWidth={strokeWidth}
        fill={`rgb(${[
          d.color.r,
          d.color.b,
          d.color.g,
        ].join(", ")})`}
      />
    ))}
  </g>
))


const readUploadedFileAsText = inputFile => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};