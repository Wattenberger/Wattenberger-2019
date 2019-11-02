import React, { useCallback, useMemo, useRef, useState } from "react"
import * as d3 from "d3"
import { flatMapDeep, fromPairs } from "lodash"
import data from "./data.json"
import { getPointFromAngleAndDistance } from 'utils/utils.js';

import ButtonGroup from "components/_ui/Button/ButtonGroup/ButtonGroup"
import Toggle from "components/_ui/Toggle/Toggle"

import './ReactRepo.scss';

const repoTreeBaseUrl = "https://github.com/facebook/react/blob/master/"
const flattenArray = item => [
  item,
  flatMapDeep(item.children, flattenArray)
]
const allNodes = flatMapDeep(data.children, flattenArray);

const formatDate = d3.timeFormat("%-m/%-d/%Y")
const sizeExtent = [3, 10000]
const sizeScale = d3.scaleSqrt()
  .domain(sizeExtent)
  .range([1, 16])
  .clamp(true)

const colors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const fileTypes = [
  "css",
  "html",
  "js",
  "json",
  "md",
  "png",
  "snap",
  "svg",
  "ico",
  "ts",
  "yml",
]
const fileTypeColorsMap = fromPairs([
  ...fileTypes.map((type, i) => [
    type,
    colors[i]
  ]),
  // ["folder", "#000"]
])

const colorScaleSize = d3.scaleLinear()
  // .domain(d3.extent(allNodes, d => d.size))
  .domain([3, 100000])
  .range(["#f2f2f7", "#5758BB"])
const colorScaleNumOfEdits = d3.scaleLinear()
  .domain(d3.extent(allNodes, d => d.num_of_edits))
  .range(["#f2f2f7", "#5758BB"])
const lastEditAccessor = d => new Date(d.last_edit)
const parseDate = d3.timeParse("%m/%d/%Y")
const colorScaleLastEdit = d3.scaleLinear()
  // .domain(d3.extent(allNodes, lastEditAccessor))
  .domain([parseDate("01/01/2018"), parseDate("10/31/2019")])
  .range(["#9980FA", "#F79F1F"])

const colorAccessorMap = {
  type: d => fileTypeColorsMap[d.type],
  size: d => colorScaleSize(d.size),
  numOfEdits: d => colorScaleNumOfEdits(d.num_of_edits),
  lastEdit: d => colorScaleLastEdit(lastEditAccessor(d)),
}
const colorMetricOptions = Object.keys(colorAccessorMap).map(metric => ({
  id: metric,
  label: metric,
}))
const zoomOptions = [{
  id: -300,
  label: "-"
},{
  id: 300,
  label: "+",
}]

const ReactRepo = () => {
  const [hoveringNode, setHoveringNode] = useState(null)
  const isClearingHover = useRef()
  const [radius, setRadius] = useState(900)
  const [colorMetric, setColorMetric] = useState("type")

  const {
    tree, links, positions
  } = useMemo(() => {
    const tree = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
      (d3.hierarchy(data))

    const allNodes = flatMapDeep(tree.children, flattenArray)
    const positions = fromPairs(
      allNodes.map(({ x, y, data }) => [
        data.id,
        {x, y},
      ])
    )

    const links = tree.links()
      .map(link => (
        d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y)
        (link)
      ))

    return {
      tree, links, positions
    }
  }, [radius])

  const onUpdateHover = useCallback((node=null) => {
    isClearingHover.current = false
    setHoveringNode(node)
  }, [])
  const onClearHover = useCallback(() => {
    isClearingHover.current = true
    setTimeout(() => {
      if (!isClearingHover.current) return
      setHoveringNode(null)
      isClearingHover.current = false
    }, 500)
  }, [])
  // console.log("tree", tree)
  // console.log("links", links)

  return (
    <div className="ReactRepo">
      <h1>
        React repository folder structure
      </h1>
      <div className="ReactRepo__actions">
        <div className="ReactRepo__actions__item">
            <h6>color scale</h6>
            <Toggle
              className="ReactRepo__toggle"
              value={colorMetric}
              options={colorMetricOptions}
              onChange={setColorMetric}
            />
          </div>

          <div className="ReactRepo__actions__item">
            <h6>zoom</h6>
            <ButtonGroup
                buttons={zoomOptions}
                onChange={({ id }) => setRadius(radius + id)}
            />
        </div>
      </div>
      <div className="ReactRepo__chart">
        <svg className="ReactRepo__svg" viewBox={[
          0, 0,
          radius * 2,
          radius * 2,
        ].join(" ")}
        height={radius * 2}
        width={radius * 2}
      >
          <defs>
            <Folder />
          </defs>
          <g transform={`translate(${radius}, ${radius})`}>
            {links && links.map((d, i) => (
              <NodeLink
                key={i}
                d={d}
              />
            ))}
            {tree && (
              <Node
                {...tree}
                {...{onUpdateHover, colorMetric}}
                onMouseLeave={onClearHover}
              />
            )}
          </g>
        </svg>

        {hoveringNode && (
          <NodeTooltip
            {...hoveringNode}
            position={positions[hoveringNode.data.id]}
            {...{radius}}
          />
        )}
      </div>
    </div>
  )
}

export default ReactRepo


const Node = React.memo(({ colorMetric, onUpdateHover, onMouseLeave, ...nodeProps }) => {
  const { x, y, data, children } = nodeProps
  const onMouseEnter = useCallback(() => {
    onUpdateHover(nodeProps)
  }, [])
  const onClick = useCallback(() => {
    const url = `${repoTreeBaseUrl}${data.path}/${data.name}`
    const win = window.open(url, '_blank')
    win.focus()
  }, [])

  return (
    <>
      <g
        className="Node"
        transform={[
          `rotate(${x * 180 / Math.PI - 90})`,
          `translate(${y}, 0)`,
        ].join(" ")}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {data.type == "folder" ? (
          <use className="Node__folder" href="#Folder" />
        ) : (
          <circle
            className="Node__circle"
            r={sizeScale(data.size)}
            style={{
              fill: colorAccessorMap[colorMetric](nodeProps.data)
            }}
          />
        )}
        {/* <text
          className="Node__text"
          dy="0.31em"
          x={x < Math.PI == !children ? 6 : -6}
          textAnchor={x < Math.PI == !children ? "start" : "end"}
          style={{
            transform: [
              x >= Math.PI ? "rotate(180deg)" : "",
              `translateX(${x < Math.PI == !children ? "0.6em" : "-0.6em"})`
            ].join(" ")
          }}
        >
          { data.name }
        </text> */}

      </g>
      {children && children.map(node => (
        <Node
          key={node.data.id}
          {...node}
          {...{colorMetric, onUpdateHover, onMouseLeave}}
        />
      ))}
    </>
  )
})


const NodeLink = React.memo(({ d }) => (
  <path
    className="NodeLink"
    d={d}
  />
))

const Folder = () => (
  <path className="Folder" id="Folder" d="M8.68182 1.9091C8.68182 1.5836 8.55252 1.27144 8.32236 1.04128C8.09221 0.811126 7.78004 0.681824 7.45455 0.681824L1.72728 0.681824C1.40178 0.681824 1.08962 0.811125 0.859465 1.04128C0.629306 1.27144 0.500005 1.5836 0.500005 1.9091L0.500005 8.45455C0.500005 8.78004 0.629306 9.09221 0.859464 9.32236C1.08962 9.55252 1.40178 9.68182 1.72728 9.68182L6.22728 9.68182C6.55277 9.68182 6.86493 9.55252 7.09509 9.32236C7.32525 9.09221 7.45455 8.78004 7.45455 8.45455L7.45455 4.99167L8.49966 4.29494C8.61346 4.21906 8.68182 4.09133 8.68182 3.95455L8.68182 1.9091Z" />
)


const formatBytes = d3.format(",.1f")
const NodeTooltip = ({ data, position, radius }) => {
  const rotatedPos = getPointFromAngleAndDistance(position.x * 180 / Math.PI - 90, position.y)
  return (
    <div className="NodeTooltip" style={{
      transform: `translate(calc(${rotatedPos.x + radius}px - 50%), ${rotatedPos.y + radius}px)`
    }}>
      <div className="NodeTooltip__name">
        { data.name }
      </div>
      <div className="NodeTooltip__type">
        <span>type</span> <span>{ data.type }</span>
      </div>
      <div className="NodeTooltip__size">
        <span>size</span> <span>{ formatBytes(data.size / 1000) }KB</span>
      </div>
      {!!data.num_of_edits && (
        <div className="NodeTooltip__size">
          <span>{ data.num_of_edits } edit{ data.num_of_edits != 1 && "s" }</span> <span>{ formatDate(new Date(data.last_edit)) }</span>
        </div>
      )}
      <div className="NodeTooltip__repo">
        { data.path }
      </div>
      <div className="NodeTooltip__note">
        Click to see the file on Github
      </div>
    </div>
  )
}