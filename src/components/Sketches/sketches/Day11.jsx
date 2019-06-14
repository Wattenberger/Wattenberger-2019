import React, {Component} from "react"
import classNames from "classnames"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"
import {cityscape} from "./cityscape"
const {paths} = cityscape

require('./Day11.scss')

let animationRequestId
const CANVAS_RGB = "0,0,0"
const PATH_COLOR = "#fff"
const NUM_STREAMS = 40
const x = window.innerWidth > 1000 ? 2 : 1
// const NUM_PATH_COLORS = 1000
// const PATH_COLORS = _.times(NUM_PATH_COLORS, n => {
//   const r = ((255 - 0) / (NUM_PATH_COLORS - 1) * n) + 0
//   return `rgb(${r}, ${r}, ${r})`
// })

class Day11 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 400 * x,
      width: 753 * x,
      canvas: null,
      idxs: [..._.times(NUM_STREAMS, t => Math.floor(paths.length / NUM_STREAMS * t))]
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    canvas.strokeStyle = PATH_COLOR
    canvas.lineWidth = 0.6
    canvas.scale(x, x)
    // _.each(paths, path => {
    //   this.drawPath(path, "#dadada")
    // })
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day11")
  }

  draw = () => {
    let {width, height, canvas, idxs} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(0.2, canvas, CANVAS_RGB, {
        width, height
      })

      _.each(idxs, (s, i) => {
        let idx = s
        if (!_.inRange(idx, paths.length)) idx = 0
        // _.times(NUM_PATH_COLORS, i => {
        //   let j = idx - (i % numPaths)
        //   if (j < 0) j = numPaths - j
        //   this.drawPath(paths[j], PATH_COLORS[i])
        // })
        this.drawPath(paths[idx])

        idxs[i] = idx + 1
      })
      this.setState({idxs})
    }

    animationRequestId = window.requestAnimationFrame(this.draw)
  }

  drawPath = (path) => {
    let {canvas} = this.state
    if (!canvas || !path) return

    // canvas.fillStyle = '#f4f4f4'

    // if (["paths", "lines", "polygons"].indexOf(type) != -1) {
      const p = new Path2D(path)
      canvas.stroke(p)
    // } else if (type == "lines") {
    //   let pathArgs = [{args: [path.x1, path.y1]}, {args: [path.x2, path.y2]}]
    //   canvasUtils.createPathMethods(pathArgs, canvas)
    //   canvas.stroke()
    // } else if (type == "rects") {
    //   let pathArgs = [{args: [path.x1, path.y1]}, {args: [path.x2, path.y2]}]
    //   canvas.rect(path.x, path.y, path.width, path.height)
    //   canvas.stroke()
    // }
    // canvas.fill(p)
  }

  render() {
    let {height, width} = this.state

    return (
      <div className={this.getClassName()}>
        <canvas
          height={height}
          width={width}
          ref={canvas => this.canvas = canvas}
        />
      </div>
    )
  }
}

export default Day11
