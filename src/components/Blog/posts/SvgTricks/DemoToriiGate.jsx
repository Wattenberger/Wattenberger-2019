import React, { useMemo } from "react"

import svgpath from "svgpath"
import { range } from "d3-array"
import { getPointFromAngleAndDistance } from "./Demo"


export const DemoToriiGate = ({
  Random,
  inputs = {},
  width = 100,
  height = 100,
  colors = [],
}) => {

  const {
    standingY,
    doorHeight,
    legXOffset,
    legWidth,
    legPathR,
    comboPath,
    grassPathL,
    grassPathR,
    shadowOffsetPoint,
  } = useMemo(() => {

    const standingY = Random.gaussian(height * 0.73, height * 0.01)
    const doorWidth = Random.gaussian(width * 0.68, width * 0.01)
    const doorHeight = Random.gaussian(doorWidth * 0.63, doorWidth * 0.03)
    const legXOffset = doorWidth * Random.gaussian(0.3, 0.03)
    const legWidth = Random.gaussian(width * 0.044, width * 0.006)
    const doorwayWidth = Random.gaussian(doorHeight * 0.05, width * 0.001)
    const legPathL = [
      "M",
      -legXOffset - legWidth * 0.5,
      0,
      "L",
      -legXOffset - legWidth * Random.gaussian(0.4, 0.1),
      -doorHeight,
      "L",
      -legXOffset + legWidth * Random.gaussian(0.4, 0.1),
      -doorHeight,
      "L",
      -legXOffset + legWidth * 0.5,
      0,
      "Z",
    ].join(" ")
    const legPathR = svgpath(legPathL).scale(-1, 1).toString()

    const crossbarY = doorHeight * 0.8
    const decorationW = Random.gaussian(doorWidth * 0.03, doorWidth * 0.001)
    const decorationH = Random.gaussian(doorHeight * 0.02, doorHeight * 0.001)
    const decorationsPathL = [
      "M",
      -legXOffset - legWidth * 0.5 - decorationW,
      -crossbarY,
      "L",
      -legXOffset - legWidth * 0.5 - decorationW,
      -crossbarY - decorationH,
      "C",
      -legXOffset - legWidth * 0.5,
      -crossbarY,
      -legXOffset + legWidth * 0.5,
      -crossbarY,
      -legXOffset + legWidth * 0.5 + decorationW,
      -crossbarY - decorationH,
      "L",
      -legXOffset + legWidth * 0.5 + decorationW,
      -crossbarY,
      "Z",
    ].join(" ")
    const decorationsPathR = svgpath(decorationsPathL).scale(-1, 1).toString()
    const crossbarPath = svgpath(["M", -1, 0, "L", 1, 0, "L", 1, 1, "L", -1, 1, "Z"].join(" "))
      .scale(doorWidth * 0.5, doorwayWidth)
      .translate(0, -crossbarY)
      .toString()
    const topbarPath = svgpath(["M", -1, 0, "L", 1, 0, "L", 1, 1, "L", -1, 1, "Z"].join(" "))
      .scale(doorWidth * 0.5, doorwayWidth)
      .translate(0, -doorHeight)
      .toString()
    const topbarPath2 = svgpath(
      ["M", -0.95, 0, "L", 0.95, 0, "L", 1, -1.5, "C", 0.5, -1, -0.5, -1, -1, -1.5, "Z"].join(" "),
    )
      .scale(doorWidth * 0.6, doorwayWidth)
      .translate(0, -doorHeight)
      .toString()
    const middleBarWidth = Random.gaussian(doorWidth * 0.16, doorWidth * 0.01)
    const middleBar = [
      "M",
      -middleBarWidth * 0.5,
      -crossbarY,
      "L",
      -middleBarWidth * 0.5,
      -doorHeight,
      "L",
      middleBarWidth * 0.5,
      -doorHeight,
      "L",
      middleBarWidth * 0.5,
      -crossbarY,
      "Z",
    ].join(" ")
    const comboPath =
      // legPathR +
      legPathL +
      decorationsPathL +
      decorationsPathR +
      topbarPath2 +
      crossbarPath +
      topbarPath +
      middleBar

    const shadowAngle = Random.gaussian(Math.PI * 0.1, Math.PI * 0.01)
    const shadowOffsetPoint = getPointFromAngleAndDistance(shadowAngle, doorHeight)

    const grassPathL = range(0, 13)
      .map(() => {
        return [
          Random.gaussian(13 / legWidth, 0.001),
          Random.gaussian(0, doorHeight * 0.001),
        ].join(" ")
      })
      .join(" l ")
    const grassPathR = range(0, 13)
      .map(() => {
        return [
          Random.gaussian(13 / legWidth, 0.001),
          Random.gaussian(0, doorHeight * 0.006),
        ].join(" ")
      })
      .join(" l ")

    return {
      standingY,
      doorHeight,
      legXOffset,
      legWidth,
      legPathR,
      comboPath,
      grassPathL,
      grassPathR,
      shadowOffsetPoint,
    }
  }, [Random, inputs, width, height])

  return (
    <g fill="black">
      <defs>
        <mask id="door">
          <path
            d={svgpath(comboPath)
              .translate(width / 2, standingY)
              .toString()}
            fill="white"
          />
          <path
            d={svgpath(legPathR)
              .translate(width / 2, standingY)
              .toString()}
            fill="white"
          />
        </mask>

        <mask id="grass">
          <rect x={-width / 2} y={-standingY} width={width} height={height} fill="white" />
          <path
            d={svgpath(
              `M ${-legXOffset - legWidth * 0.6} 0 l 0 ${-doorHeight * 0.01} l ${grassPathL} L ${-legXOffset + legWidth
              } 10 Z`,
            )
              // .translate(width / 2, standingY)
              .toString()}
            fill="black"
            stroke="black"
            strokeWidth="0.3"
          />
          <path
            d={svgpath(
              `M ${legXOffset - legWidth * 0.6} 0 l 0 ${-doorHeight * 0.01} l ${grassPathR} L ${legXOffset + legWidth
              } 10 Z`,
            )
              // .translate(width / 2, standingY)
              .toString()}
            fill="black"
            stroke="black"
            strokeWidth="0.3"
          />
        </mask>
      </defs>

      <g transform={`translate(${width / 2}, ${standingY})`}>
        <g style={{
          mask: "url(#grass)"
        }}>
          <path d={comboPath} fill="#000" />
          <path d={legPathR} fill="#000" />
        </g>

        <g stroke="black" strokeWidth={legWidth * 0.5} opacity="0.1" style={{
          mixBlendMode: "overlay"
        }}>
          <g style={{
            mask: "url(#gradient-reverse)"
          }}>
            <path
              d={`M ${-legXOffset - 1.8} -1 L ${-legXOffset + shadowOffsetPoint[0]} ${shadowOffsetPoint[1]}`}
            />
          </g>
          <g style={{
            mask: "url(#gradient-reverse)"
          }}>
            <path
              d={`M ${legXOffset - 1.8} -1 L ${legXOffset + shadowOffsetPoint[0]} ${shadowOffsetPoint[1]}`}
            />
          </g>
        </g>
      </g>

      <g style={{
        mixBlendMode: "multiply", opacity: 0.6
      }}>
        <g style={{
          mask: "url(#grass)"
        }}>
          <g style={{
            mask: "url(#gradient2)"
          }}>
            <path
              d={svgpath(comboPath)
                .translate(width / 2, standingY)
                .toString()}
              fill="url(#noise-pattern)"
            />
            <path
              d={svgpath(legPathR)
                .translate(width / 2, standingY)
                .toString()}
              fill="url(#noise-pattern)"
            />
          </g>
        </g>
      </g>

      <g style={{
        mask: "url(#gradient-reverse)"
      }}>
        <rect
          width="100%"
          y={standingY - doorHeight - 30}
          height={doorHeight + 30}
          fill="url(#background)"
          style={{
            opacity: 0.3, mask: "url(#door)"
          }}
        />
      </g>
    </g>
  )

}

export default DemoToriiGate

