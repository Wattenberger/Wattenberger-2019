import React, {Component} from "react"
import classNames from "classnames"
import {movementUtils} from "./utils/movementUtils"
import {canvasUtils} from "./utils/canvasUtils"

require('./Day18.scss')

let animationRequestId
const INTERVAL_LENGTH = 1000
const NUM_TREES = 13
const CANVAS_RGB = "245,247,249"

const PIECE_COLORS = [
  ['#F7F9FE', '#ECF1F2', '#DCE8EB', '#CBDBE0', '#BED2D9'],
  ["#44749D","#C6D4E1","#FFFFFF","#EBE7E0","#BDB8AD"],
  ["#539FA2","#72B1A4","#ABCCB1","#C4DBB4","#D4E2B6"],
  ["#C7443D", "#D9764D", "#CC9E8A", "#C1C5C7", "#EBDFC6",],
  ["#F7F5CD", "#F0ECAC", "#DBD786", "#AAC981", "#B6DB86", "#FFFFFF"],
  ["#27191C", "#2D3839", "#114D4D", "#6E9987", "#E0E4CE",],
  ["#1C120A", "#699124", "#90AD87", "#BDD1AE", "#E2E8D5"],
  ["#FFF5DE", "#B8D9C8", "#917081", "#750E49", "#4D002B",],
  ["#FBFAF2", "#87A227", "#637E13", "#2B400B", "#0F2405"],
  ["#7F6E4F", "#CEA060", "#5D5650", "#A28C2D", "#FAF9ED", "#3E2316"],
  ["#D9DADC","#9CA4AA","#E7E8ED","#F4F4F6","#E3E4E8","#4B515F"],
  ["#234F4A","#161D23","#3B3F4B","#112F2E","#84998D","#8E8280", "#f5f7f9", "#e0e9ee"],
  ["#50426A","#A6A6A6","#7D99AB","#E2EBE8","#B3C8CD","#523A38"],
  ["#007199","#002335","#004B65","#007EA4","#002D44","#00527A", "#F0ECAC", "#f5f7f9", "#e0e9ee"],
  ["#4D816A",  "#7BAB9B",  "#398974",  "#035546",  "#002F23",  "#D1D5C6", "#F0ECAC", "#f5f7f9", "#e0e9ee"],
  ["#F7F8FD", "#EFF4FA", "#E3EBF6", "#D9E5F5", "#262832", "#859EBE"],
  ["#BDAEB3","#D7D7D7","#F6F8F6","#C1C0CE","#B2A2A2","#2E6E5E"],
  ["#C8DBE9",  "#9DB2BE",  "#67686E",  "#D5DBE7",  "#6C7B8E",  "#C4DAE8"],
  ["#FAD089","#FF9C5B","#F5634A","#ED303C","#3B8183","#FAD089","#FF9C5B","#F5634A"],
  ["#F8B195","#F67280","#C06C84","#6C5B7B","#355C7D","#F8B195","#F67280","#C06C84"],
  ["#8C867A","#AB9F77","#8B628A","#A879AF","#B4A3CF","#8C867A","#AB9F77","#8B628A"],
]
const FEATHER_TOP_COLOR = "#FFF"
const NIB_COLOR = "#554236"

const HEIGHT = 400
const SCALE = HEIGHT / 100 - 1
const NIB_WIDTH = 1
const NIB_HEIGHT = 16
const FEATHER_WIDTH = 20
const FEATHER_HEIGHT = 90
const FIRST_FEATHER_Y = NIB_HEIGHT + FEATHER_WIDTH - NIB_WIDTH
const PIECE_HEIGHT = 10
const NUM_FEATHERS = 3
const NUM_PIECES = Math.floor(FEATHER_HEIGHT / PIECE_HEIGHT) - 2

class Day18 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: HEIGHT,
      width: window.innerWidth,
      canvas: null,
      trees: [],
    }
  }

  componentDidMount() {
    let canvas = this.canvas.getContext("2d")
    this.setState({canvas})

    canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
    this.draw()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animationRequestId)
  }

  getClassName() {
    return classNames("Day18")
  }

  draw = () => {
    let {canvas, height, width} = this.state

    if (canvas) {
      canvasUtils.fadeCanvas(1, canvas, CANVAS_RGB)
      _.times(NUM_FEATHERS, idx => {
        let origin = {
          x: width / (NUM_FEATHERS + 1) * (idx + 1),
          y: height - 20
        }

        // this.drawFeatherMask(origin)
        this.drawFeatherFill(origin)
      })
    }

    animationRequestId = setTimeout(() => {
      window.requestAnimationFrame(this.draw)
    }, canvas ? INTERVAL_LENGTH : 0)
  }

  drawFeatherMask = origin => {
    let {canvas} = this.state

    let pathMethods = [
      [-NIB_WIDTH, 0],
      [-NIB_WIDTH, -NIB_HEIGHT],
      [-FEATHER_WIDTH, -FIRST_FEATHER_Y],
      [-FEATHER_WIDTH, -FEATHER_HEIGHT],
      [0, -FEATHER_HEIGHT, FEATHER_WIDTH, 360, 0, false],
      [+FEATHER_WIDTH, -FEATHER_HEIGHT],
      [+FEATHER_WIDTH, -FIRST_FEATHER_Y],
      [+NIB_WIDTH, -NIB_HEIGHT],
      [+NIB_WIDTH, 0],
      [-NIB_WIDTH, 0],
    ].map(method => method.length == 2 ? {
      args: [
        origin.x + method[0] * SCALE,
        origin.y + method[1] * SCALE,
      ]
    } : {
      type: "arc",
      args: [
        origin.x + method[0] * SCALE,
        origin.y + method[1] * SCALE,
        method[2] * SCALE,
        method[3],
        method[4],
        method[5],
      ]
    })
    canvasUtils.createPathMethods(pathMethods, canvas)
    canvas.stroke()

    canvas.clip()
  }

  drawFeatherFill = origin => {
    let {canvas} = this.state

    this.drawFeatherTop(origin)

    let palette = PIECE_COLORS[_.random(PIECE_COLORS.length - 1)]

    _.times(NUM_PIECES, idx => {
      this.drawPiece(idx, origin, palette)
      this.drawPiece(idx, origin, palette, true)
    })

    this.drawFeatherNib(origin)
    this.drawFeatherDiamond(origin, palette)
    this.drawFeatherDiamondSmaller(origin)
  }

  drawFeatherTop = origin => {
    let {canvas} = this.state

    canvas.fillStyle = FEATHER_TOP_COLOR

    canvasUtils.createPathMethods([{
      type: "arc",
      args: [0 + origin.x, -FEATHER_HEIGHT * SCALE + origin.y - PIECE_HEIGHT * 3, FEATHER_WIDTH * SCALE, 0, 360, false],
    }], canvas)

    canvas.fill()
  }

  drawPiece = (idx, origin, palette, flipped) => {
    let {canvas, height, width} = this.state

    let color = palette[_.random(palette.length - 1)]

    canvas.fillStyle = color

    let y1 = FIRST_FEATHER_Y + PIECE_HEIGHT * (idx - 2)
    let y2 = y1 + FEATHER_WIDTH - NIB_WIDTH
    let x2 = FEATHER_WIDTH * (flipped ? -1 : 1)
    let pathMethods = [
      [0, -y1],
      [x2, -y2],
      [x2, -y2 - PIECE_HEIGHT - 0.3],
      [0, -y1 - PIECE_HEIGHT - 0.3],
    ].map(method => ({
      args: [
        origin.x + method[0] * SCALE,
        origin.y + method[1] * SCALE,
      ]
    }))

    canvasUtils.createPathMethods(pathMethods, canvas)
    canvas.fill()
  }

  drawFeatherNib = origin => {
    let {canvas} = this.state

    canvas.fillStyle = NIB_COLOR

    let pathMethods = [
      [-NIB_WIDTH, 0],
      [-NIB_WIDTH, -FEATHER_HEIGHT + PIECE_HEIGHT / 2],
      [+NIB_WIDTH, -FEATHER_HEIGHT + PIECE_HEIGHT / 2],
      [+NIB_WIDTH, 0],
    ].map(method => ({
      args: [
        origin.x + method[0] * SCALE,
        origin.y + method[1] * SCALE,
      ]
    }))
    canvasUtils.createPathMethods(pathMethods, canvas)

    canvas.fill()
  }

  drawFeatherDiamond = (origin, palette) => {
    let {canvas} = this.state

    let color = palette[_.random(palette.length - 1)]
    canvas.fillStyle = color

    let diamondWidth = FEATHER_WIDTH
    let x = diamondWidth / 2
    let y1 = -FEATHER_HEIGHT + FEATHER_WIDTH / 3

    let pathMethods = [
      [0, y1 - diamondWidth / 2],
      [-x, y1 - diamondWidth],
      [0, y1 - diamondWidth * 3/2],
      [+x, y1 - diamondWidth],
      [0, y1 - diamondWidth / 2],
    ].map(method => ({
      args: [
        origin.x + method[0] * SCALE,
        origin.y + method[1] * SCALE,
      ]
    }))
    canvasUtils.createPathMethods(pathMethods, canvas)

    canvas.fill()
  }

  drawFeatherDiamondSmaller = origin => {
    let {canvas} = this.state

    let color = PIECE_COLORS[_.random(PIECE_COLORS.length - 1)]
    canvas.fillStyle = FEATHER_TOP_COLOR

    let diamondWidth = FEATHER_WIDTH / 2
    let x = diamondWidth / 2
    let y1 = -FEATHER_HEIGHT - FEATHER_WIDTH / 2/3

    let pathMethods = [
      [0, y1 - diamondWidth / 2],
      [-x, y1 - diamondWidth],
      [0, y1 - diamondWidth * 3/2],
      [+x, y1 - diamondWidth],
      [0, y1 - diamondWidth / 2],
    ].map(method => ({
      args: [
        origin.x + method[0] * SCALE,
        origin.y + method[1] * SCALE,
      ]
    }))
    canvasUtils.createPathMethods(pathMethods, canvas)

    canvas.fill()
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

export default Day18
