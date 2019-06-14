import _ from "lodash"

export const canvasUtils = {
  fadeCanvas(pct=1, canvas={}, rgb="255, 255, 255", params) {
    const defaults = {
      width: window.innerWidth,
      height: 400,
    }
    let config = _.extend({}, defaults, params)

    canvas.fillStyle = `rgba(${rgb}, ${pct})`
    canvas.fillRect(0, 0, config.width, config.height)
  },

  createPathMethods(points=[], canvas={}) {
    // point: type, args
    canvas.beginPath()
    let moveTo = true

    points.map((point, idx) => {
      let method = point.type || (moveTo ? "moveTo" : "lineTo")
      canvas[method](...point.args)
      moveTo = !!point.type
    })
  },

  getArcPathMethod(point1, point2, lastPoint, anticlockwise) {
    let {x, y} = point2
    let w = x - point1.x
    let h = y - point1.y
    let radius = Math.sqrt(w * w + h * h) / 2
    let w2 = point1.x
    let h2 = point1.y
    let startAngle = Math.tan(h / w) + Math.PI / 2
    // let endAngle = Math.PI - startAngle
    let endAngle = startAngle + Math.PI
    if (lastPoint) {
      // anticlockwise = _.inRange(startAngle, 0, originalTheta) || _.inRange(startAngle, originalTheta + 180, 360)
    }
    console.log(h, w)
    return {type: "arc", args: [x, y, radius, startAngle, endAngle, anticlockwise]}
  },

  drawDot(point={}, canvas={}, color="#fff", style="fill") {
    canvas[`${style}Style`] = color
    this.createPathMethods([
      {
        type: "arc",
        args: [point.x, point.y, point.r || 2, 0, Math.PI * 2, false]
      },
    ], canvas)
    canvas[style]()
  },
}
