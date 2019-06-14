import _ from "lodash"

export const movementUtils = {
  createPoint(params) {
    const defaults = {
      startInMiddle: false,
      boundX: window.innerWidth,
      boundY: 400,
      speedMin: 2,
      speedMax: 10,
      radiusMin: 2,
      radiusMax: 10,
      target: null,
    }
    let config = _.extend({}, defaults, params)

    const speed = _.random(config.speedMin, config.speedMax, true)
    const dir = _.random(2 * Math.PI, true)

    const point = {
      x: config.startInMiddle ? config.boundX / 2 : _.random(config.boundX),
      y: config.startInMiddle ? config.boundY / 2 : _.random(config.boundY),
      speed: speed,
      dir: dir,
      dx: speed * Math.cos(dir),
      dy: speed * Math.sin(dir),
      rx: Math.cos(.03),
      ry: Math.sin(.03),
      r: _.random(config.radiusMin, config.radiusMax),
    }
    return point
  },

  isOutOfBounds(pos, bound, padding=40) {
    return pos >= bound - padding || pos <= padding
  },

  moveInCircle(point, padding=0, height=400, width=window.innerWidth) {
    point = _.clone(point)

    // Rotation matrix
    point.dx = point.dx * point.rx - point.dy * point.ry
    point.dy = point.dy * point.rx + point.dx * point.ry

    // Flip dir if out of bounds
    if (this.isOutOfBounds(point.x + point.dx, width)) point.dx = -point.dx
    if (this.isOutOfBounds(point.y + point.yx, height)) point.dy = -point.dy

    point.x = point.x + point.dx
    point.y = point.y + point.dy

    return point
  },

  moveRandomly(point, params) {
    const defaults = {
      padding: 40,
      height: 400,
      width: window.innerWidth,
      percentChangeChangeDir: 0.1,
      maxMovement: 20,
      avoidPoints: [],
      paddingAroundPoint: 20,
    }
    let config = _.extend({}, defaults, params)
    point = _.clone(point)

    const updatePos = (pos, dir, bound, dim) => {
      if (_.random(1, true) < config.percentChangeChangeDir ||
          this.isOutOfBounds(pos + dir, bound, config.padding)) {
        dir = this.getNewDir(pos, bound, point.speed || config.maxMovement, config.padding)
      }
      return dir
    }

    point.dx = updatePos(point.x, point.dx, config.width)
    point.dy = updatePos(point.y, point.dy, config.height)
    let collisionPoints = _.filter(config.avoidPoints, target => this.isWithinTargetBounds(point, target, config.padding))
    if (collisionPoints.length) {
      let newDir = this.getNewDirAwayFromTargets(point, collisionPoints, config.height, config.width)
      point.dx = newDir.x
      point.dy = newDir.y
    }
    point.x += point.dx
    point.y += point.dy

    return point
  },

  getNewDir(pos, bound, speed=40, padding=40) {
    let newDir = _.random(speed, true)
    let sign = pos + newDir > bound - padding ? -1 :
               pos - newDir < padding ? 1 :
               _.random() ? -1 : 1
    return newDir * sign
  },

  getNewDirAwayFromTargets(point, collisionPoints, height=400, width=window.innerWidth) {
    let avgXDiff = _.meanBy(collisionPoints, target => target.x - point.x)
    let avgYDiff = _.meanBy(collisionPoints, target => target.y - point.y)
    return {x: -_.random(avgXDiff), y: -_.random(avgYDiff)}
  },

  getDistanceBetweenPoints(point1, point2) {
    let w = point2.x - point1.x
    let h = point2.y - point1.y
    return Math.sqrt(w * w + h * h)
  },

  isWithinTargetBounds(point, target, padding=40) {
    let minDist = point.r && target.r ? point.r + target.r : padding
    return this.getDistanceBetweenPoints(point, target) < minDist
  },
}
