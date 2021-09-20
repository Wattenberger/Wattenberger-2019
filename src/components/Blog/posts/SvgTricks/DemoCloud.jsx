import React, { useMemo } from "react"
import { range } from "d3-array"
import { forceCollide, forceSimulation, forceX, forceY } from "d3-force"
import { getPointFromAngleAndDistance, snapToInterval } from "./Demo"

export const DemoCloud = ({
  Random,
  inputs = {},
  x = 0,
  y = 0,
  size = "m",
  color = "white",
  type = "normal",
}) => {

  const {
    puffPositions,
  } = useMemo(() => {
    const separatePuffs = (items) => {
      let movedItems = [...items]
      const simulation = forceSimulation(movedItems)
        .force("x", forceX((d) => d.x).strength(0.01))
        .force(
          "y",
          forceY((d) => (size === "s" ? d.y : d.y)).strength(type === "horizontal" ? 0.9 : 0.12),
        )
        .force("collide", forceCollide((d) => d.r).strength(0.1))
        .stop()
      simulation.tick(size === "s" ? 30 : 10)
      return movedItems
    }

    const numberOfCloudPuffs = snapToInterval(
      Random.gaussian(
        inputs.numberOfCloudPuffs * (size === "s" ? 2 : size === "l" ? 1.5 : 1),
        inputs.numberOfCloudPuffs * 0.4,
      ),
      1,
    )
    const puffPositions = separatePuffs(
      range(0, numberOfCloudPuffs).map((i) => {
        const angle = Random.chance(0.2)
          ? (i / numberOfCloudPuffs) * Math.PI * 2
          : Random.gaussian(Math.PI * 0.5, Math.PI * 0.1)
        const [x, y] = getPointFromAngleAndDistance(
          angle,
          size === "s" ? 3 : type === "horizontal" ? 5 : 10,
        )
        const r = Math.max(
          1,
          Random.gaussian(inputs.cloudPuffR, inputs.cloudPuffR * 0.6) * (size === "s" ? 0.5 : 1),
        )
        const opacity = Random.chance(size === "s" ? 0.2 : 0.9) ? 1 : 0.8
        return {
          x,
          y,
          r,
          opacity,
        }
      }),
    )

    return {
      puffPositions,
    }
  }, [inputs, size, type, Random])

  return (
    <g
      transform={`translate(${x},${y})`}
      style={{
        filter: "url(#cloud)",
        mixBlendMode: inputs.cloudBlendMode
      }}>
      {puffPositions.map(({ x, y, r, opacity }, i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={opacity} />
      ))}
    </g>

  )

}

export default DemoCloud

