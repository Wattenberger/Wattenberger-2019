import { useState, usePrevious, useEffect, useMemo } from 'react';
import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"

import { useChartDimensions } from "components/_ui/Chart/utils/utils"

import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Line from "components/_ui/Chart/Line/Line"
import Axis from "components/_ui/Chart/Axis/Axis"
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import bell from "./bell-small.json"
import ehnes from "./ehnes-small.json"
import gitlis from "./gitlis-small.json"
import heifetz from "./heifetz-small.json"
import hristova from "./hristova-small.json"
import kremer from "./kremer-small.json"
import midori from "./midori-small.json"
import milstein from "./milstein-small.json"
import perlman from "./perlman-small.json"
import vengerov from "./vengerov-small.json"
import zimmerman from "./zimmerman-small.json"
import barData from "./barData.json"
console.log(bell, barData)
import './Chaconne.scss';
const musicianData = {
  "bell": bell,
  "ehnes": ehnes,
  "gitlis": gitlis,
  "heifetz": heifetz,
  "hristova": hristova,
  "kremer": kremer,
  "midori": midori,
  "milstein": milstein,
  "perlman": perlman,
  "vengerov": vengerov,
  "zimmerman": zimmerman,
}
const musicians = _.keys(musicianData)

const eyesClosedIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];

const metrics = [{
  label: "Angry",
  accessor: d => {
    const emotion = d.emotions["ANGRY"]
    return emotion < 0.5 ? null : emotion * 100
  },
  color: "#EA2027",
},{
  label: "Sad",
  accessor: d => {
    const emotion = d.emotions["SAD"]
    return emotion < 0.5 ? null : emotion * 100
  },
  color: "#5758BB",
},{
  label: "Disgusted",
  accessor: d => {
    const emotion = d.emotions["DISGUSTED"]
    return emotion < 0.5 ? null : emotion * 100
  },
  color: "#006266",
},{
  label: "Calm",
  accessor: d => {
    const emotion = d.emotions["CALM"]
    return emotion < 0.5 ? null : emotion * 100
  },
  color: "#4b6584",
},{
  label: "Mouth Open",
  accessor: d => d.mouthOpen,
  color: "#6F1E51",
},{
  label: "Smiling",
  accessor: d => d.smile,
  color: "#6F1E51",
},{
  label: "Eyes Closed",
  accessor: d => d.eyesClosed,
  color: "#6F1E51",
// },{
//   label: "Volume",
//   isBoxed: true,
},{
  label: "Tempo",
  slug: "tempo",
  color: "cornflowerblue",
  isBoxed: true,
},{
  label: "Key",
  slug: "key",
  color: "cornflowerblue",
  isBoxed: true,
},{
  label: "Highlight",
  slug: "highlights",
  color: "cornflowerblue",
  isBoxed: true,
}]
const metricKeys = _.map(metrics, "label")
const metricsByKey = _.fromPairs(_.map(metrics, metric => [
  metric.label,
  metric,
]))

const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const Chaconne = () => {
  const [visibleMetrics, setVisibleMetrics] = useState(metricKeys)
  const [visibleMusicians, setVisibleMusicians] = useState(["zimmerman"])
  const [hoveredObject, setHoveredObject] = useState(null)

  return (
    <div className="Chaconne">
      <h2 className="Chaconne__title">
        Chaconne
      </h2>
      <div className="Chaconne__controls">
        <RadioGroup
          options={metricKeys}
          value={visibleMetrics}
          onChange={setVisibleMetrics}
          isMulti
        />
        <br />
        <RadioGroup
          options={musicians}
          value={visibleMusicians}
          onChange={setVisibleMusicians}
          isMulti
        />
      </div>
      <div className="Chaconne__contents">
        {hoveredObject && (
          <div className="Chaconne__hovered">
            <div className="Chaconne__hovered__metric">
              { hoveredObject.metric }
            </div>
            <div className="Chaconne__hovered__value">
              { hoveredObject.value }
            </div>

          </div>
        )}

        {_.map(visibleMusicians, musician => (
          <div key={musician}>
            <h3>{ _.startCase(musician) }</h3>
            <ChaconneVideoChart
              visibleMetrics={visibleMetrics}
              name={_.startCase(musician)}
              data={musicianData[musician]}
              onMouseEnter={setHoveredObject}
            />
          </div>
        ))}

      </div>
    </div>
  )
}

export default Chaconne


const timeAccessor = d => d.time
const ChaconneVideoChart = ({ visibleMetrics, name, data, onMouseEnter }) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 0,
    marginRight: 0,
    marginBottom: 60,
    marginLeft: 60,
    height: 600,
  })

  const [metricsData] = useMemo(() => {
    const metricsData = _.fromPairs(_.map(visibleMetrics, metric => {
      const metricObject = metricsByKey[metric]

      let scale = d3.scaleLinear()
        .domain([0, 100])
        .range(["#fff", metricObject.color])
        .clamp(true)

      let stamps = null
      if (metricObject.isBoxed) {
        stamps = _.map(barData, d => ({time: toMilliseconds(d[name]), key: d[metricObject.slug]})).filter(d => !!d.time)
        const values = _.uniq(_.map(stamps, "key").filter(d => !_.includes(["END", ""], d)))
        scale = d3.scaleOrdinal()
          .domain(values)
          .range(ordinalColors)
      }

      return [
        metric,
        {
          scale,
          stamps,
        }
      ]
    }))

    return [metricsData]
  })

  return (
    <div className="ChaconneVideoChart" ref={ref}>
      <div className="ChaconneVideoChart__columns">
        {_.map(data, d => {
          const timestamp = timeAccessor(d)
          return (
            <div className="ChaconneVideoChart__column" key={timestamp}>
              {_.map(visibleMetrics, metric => {
                const obj = {
                  ...metricsByKey[metric],
                  ...metricsData[metric],
                  d,
                  metric,
                  timestamp,
                  onMouseEnter,
                }
                return <ChaconneVideoChartItem {...obj} />
              })}
            </div>
          )
        })}
          <div className="ChaconneVideoChart__labels">
            {_.map(visibleMetrics, metric => {
              return (
                <div className="ChaconneVideoChart__label" key={metric}>
                  { metricsByKey[metric].label }
                </div>
              )
          })}
        </div>
      </div>
    </div>
  )
}


const ChaconneVideoChartItem = React.memo(({ timestamp, scale, d, metric, accessor, stamps, isBoxed, onMouseEnter }) => {
  const onMouseEnterLocal = obj => () => onMouseEnter(obj)
  if (isBoxed) {
    const stampIndex = d3.bisectRight(_.map(stamps, "time"), timestamp) - 1
    if (!stamps[stampIndex]) return <div className="ChaconneVideoChart__item" />
    const value = stamps[stampIndex].key

    return (
      <div
        className="ChaconneVideoChart__item"
        onMouseEnter={onMouseEnterLocal({metric, value})}
        key={metric}
        style={{background: _.isFunction(scale) ? scale(value) : null}}
      />
    )
  } else {
    return (
      <div
        className="ChaconneVideoChart__item"
        onMouseEnter={onMouseEnterLocal({metric, value: accessor(d)})}
        key={metric}
        style={{background: scale(accessor(d))}}
      />
    )
  }
})


// const timeAccessor = d => d.Timestamp
// const ChaconneVideoChart = ({ visibleMetrics, data }) => {
//   const [ref, dimensions] = useChartDimensions({
//     marginTop: 0,
//     marginRight: 0,
//     marginBottom: 60,
//     marginLeft: 60,
//     height: 600,
//   })
//   const scales = _.fromPairs(_.map(visibleMetrics, metric => [
//     metric,
//     d3.scaleOrdinal()
//       .domain(d3.extent(data, metricsByKey[metric].accessor))
//       .range([dimensions.boundedHeight, 0])
//   ]))

//   console.log(dimensions)
//   const xScale = d3.scaleLinear()
//     .domain([
//       timeAccessor(data[0]),
//       timeAccessor(data[data.length - 1]),
//     ])
//     .range([0, dimensions.boundedWidth])
//   const yScale = d3.scaleLinear()
//     .domain([
//       -100, 100
//     ])
//     .range([dimensions.boundedHeight, 0])

//   return (
//     <div className="ChaconneVideoChart" ref={ref}>
//       <Chart height={dimensions.height} width={dimensions.width} margin={{left: dimensions.marginLeft}}>
//         {_.map(visibleMetrics, metric => (
//           <Line
//             key={metric}
//             className="ChaconneVideoChart__area"
//             type="area"
//             data={data}
//             xAccessor={d => xScale(timeAccessor(d))}
//             yAccessor={d => scales[metric](metricsByKey[metric].accessor(d))}
//             y0Accessor={d => scales[metric](0)}
//             defined={d => Math.abs(metricsByKey[metric].accessor(d)) > 0.5}

//             // y0Accessor={dimensions.boundedHeight}
//           />
//         ))}
//         <Axis
//           dimension="y"
//           orientation="left"
//           scale={yScale}
//           // width={dimensions.boundedWidth}
//           margin={{left: dimensions.marginLeft}}
//           height={dimensions.boundedHeight}
//           label="Timestamp"
//         />
//         <Axis
//           dimension="x"
//           scale={xScale}
//           width={dimensions.boundedWidth}
//           height={dimensions.boundedHeight}
//           label="Timestamp"
//         />
//       </Chart>
//     </div>
//   )
// }

function toMilliseconds(timestamp) {
  const [min, sec] = timestamp.split(":")
  return min * 1000 * 60
    + sec * 1000
}