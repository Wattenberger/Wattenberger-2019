import React, { useMemo} from "react"
import { range } from "d3-array"
import { scaleLinear } from "d3-scale"
import { curveBasis, line } from "d3-shape"

export const DemoMountains = ({
  Random,
  inputs = {},
   width = 100,
   height = 100,
   backgroundColors = [],
}) => {

  const {
    mountains,
  } = useMemo(() => {

  const colorScale = scaleLinear()
  .domain([-2, inputs.numberOfMountains + 2])
  .range([backgroundColors[0], backgroundColors[1]])

const mountains = range(0, inputs.numberOfMountains).map((i) => {
  let runningX = Random.gaussian(width * 0.5, width * 0.5)
  let points = [
    {
      x: runningX - width * 0.5,
      y: 0,
    },
    ...range(0, 3).map(() => {
      runningX += Random.gaussian(width * 0.3, width * 0.1)
      return {
        x: runningX,
        y: -Random.gaussian(height * 0.05 + i * 0.01, height * 0.06),
      }
    }),
  ]
  points = [
    ...points,
    {
      x: points.slice(-1)[0].x + width * 0.5,
      y: 0,
    },
  ]
  return {
    path: line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveBasis)(points),
    color: colorScale(i),
  }
})

    return {
      mountains,
    }
  }, [inputs,Random,width,height,backgroundColors])

  return (
    <g style={{ clipPath: "url(#skyClip)" }}>
      <g transform={`translate(0, ${height * inputs.fieldsYOffset})`}>
        {mountains.map(({ path, color }, i) => (
          <g key={i}>
            <path d={path} fill={color} />
            <g style={{
              mixBlendMode: inputs.blendMode,
              opacity: 0.2,
            }}>
              <g style={{
                mask: "url(#gradient2)"
              }}>
                <path d={path} fill="url(#noise-pattern)" />
              </g>
            </g>
          </g>
        ))}
      </g>
    </g>


  )

}

export default DemoMountains

