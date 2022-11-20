import Expandy from "components/_ui/Expandy/Expandy";
import RadioGroup from "components/_ui/RadioGroup/RadioGroup";
import { uniqueId } from 'lodash';
import React, { useMemo, useRef } from 'react';
import propertyData from "./propertyData.json";

const getLevels = engine => {
  const levels = [[], [], []]
  Object.keys(propertyData).forEach(property => {
    const index = levelNames.findIndex(levelName => (
      propertyData[property]?.["change"]?.[engine][levelName]
    ))
    if (levels[index]) levels[index].push(property)
  })
  return levels
}

export const RenderingExample = ({
  property = "left",
  engine = "blink",
  ...props
}) => {
  return (
    <div className="RenderingExample">
      <RenderingExampleDemo property={property} {...props} />
      <RenderingExampleData property={property} engine={engine} />
    </div>
  )
}


export const RenderingExampleSvg = () => {
  return (
    <svg width="0" height="0" viewBox="0 0 200 200">
      <g id="RenderingExampleSvg">
        <circle fill="currentColor" cx="99" cy="58" r="35" />
        <circle fill="currentColor" cx="149" cy="90" r="35" />
        <circle fill="currentColor" cx="130" cy="142" r="35" />
        <circle fill="currentColor" cx="73" cy="142" r="35" />
        <circle fill="currentColor" cx="55" cy="90" r="35" />
        <circle fill="#FFEA94" cx="99" cy="106" r="26" />
      </g>
    </svg>
  )
}

export const RenderingExampleDemo = ({
  property = ["left"],
  ...props
}) => {
  const duration = 2000
  const itemElement = useRef(null)
  const id = useMemo(() => uniqueId("RenderingExample"), [])

  const keyframes = useMemo(() => {
    return [
      `@keyframes ${id} {`,
      `  0% { ${property}: ${propertyOptions[property]?.[0]}; }`,
      `  100% { ${property}: ${propertyOptions[property]?.[1]}; }`,
      `}`,
    ].join("\n")
  }, [id, property])

  const styles = useMemo(() => ({
    ...propertyOptionsAdditionalProperties[property] || {},
    animation: `${id} ${duration}ms steps(6) infinite alternate-reverse`,
    ...props,
  }), [id, duration, property])
  const svgStyles = useMemo(() => ({
    ...(propertyOptionsAdditionalPropertiesSvg[property] || {}),
  }), [property])

  return (
    <div className="RenderingExampleDemo">
      <div className="RenderingExampleDemo__wrapper">
        <style>{keyframes}</style>
        <div className="RenderingExampleDemo__item" ref={itemElement} style={styles}>
          <svg style={svgStyles} width="100%" height="100%" viewBox="0 0 200 200">
            <use xlinkHref="#RenderingExampleSvg" />
          </svg>
        </div>
      </div>
    </div>
  )
}

const levelNames = [
  "layout", "paint", "composite"
]
const levelLabelOverrideMap = {
composite:"composition"
}
export const RenderingExampleData = ({
  property = "left",
  engine = "blink",
}) => {

  const levels = useMemo(() => {
    const data = propertyData[property]?.["change"]?.[engine]
    return data ? levelNames.map(l => data[l]) : []
  }, [property, engine])

  return (
    <div className="RenderingExampleData">
      <div className="RenderingExampleData__item">
        <div className="RenderingExampleData__item__label">
          {property}
        </div>
        <RenderingDiagram levels={levels} />
      </div>
    </div>
  )
}

export const propertyOptions = {
  transform: [`translateX(-10px)`, `translateX(10px)`],
  "background-color": [`#D5EBE9`, `#EABCB9`],
  left: [`-10px`, `10px`],
  "opacity": ["0", "1"],
  "color": [`#4CCAB3`, `#742DEF`],
  "margin-left": ["-10px", "10px"],
  cursor: ["pointer", "grab"],
  "z-index": ["0", "1"],
  "border-left-width": ["0", "10px"],
  "padding-left": ["0", "40px"],
  "transform-origin": ["0 0", "10px 40px"],
  perspective: ["100px", "600px"],
}
const propertyOptionsAdditionalProperties = {
  "transform-origin": {
    transform: "rotate(30deg)"
  }
}
const propertyOptionsAdditionalPropertiesSvg = {
  perspective: {
    transform: "translateZ(30px) rotateY(10deg)"
  }
}
const propertyOptionsChunked = [
  ["left", "margin-left", "padding-left"],
  ["background-color", "color", "transform-origin"],
  ["transform", "opacity", "perspective"],
]


export const RenderingDiagram = ({
  levels = [],
}) => {
  return (
    <div className="RenderingDiagram">
      {levelNames.map((level, i) => {
        const levelName = levelLabelOverrideMap[level] || level
        return (
          <div className={[
            "RenderingDiagram__level",
            `RenderingDiagram__level--${levelName}`,
            `RenderingDiagram__level--is-${levels[i] === true ? "active" : levels[i] === false ? "inactive" : "unknown"}`,
          ].join(" ")} key={i}>
            {levels[i] === null ? "?" : levelName}
          </div>
        )
      })}
    </div>
  )
}

const sandboxColumnLabels = [
  `🔥\nall steps`, `🔥🔥\npaint & composition`, `🔥🔥🔥\nonly composition`
]
const engines = ["blink", "gecko", "webkit", "edgehtml"]
export const RenderingSandbox = () => {
  const [engine, setEngine] = React.useState("blink")
  const levels = useMemo(() => getLevels(engine), [engine])

  return (
    <div className="RenderingSandbox Rendering__wide">
      <div className="RenderingSandbox__engines">
        Engine:
        <RadioGroup options={engines} value={engine} onChange={setEngine} />
      </div>
      <div className="RenderingSandbox__grid">
        {propertyOptionsChunked.map((options, i) => (
          <div className="RenderingSandbox__column">
            <div className="RenderingSandbox__column__label">
              {sandboxColumnLabels[i]}{engine !== "blink" && ` (in Blink)`}
            </div>
            {options.map(property => (
              <div className="RenderingSandbox__item">
                <RenderingExample property={property} engine={engine} key={property} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Expandy trigger="Show me the full list of CSS properties">
        <div className="RenderingSandbox__grid">
          {propertyOptionsChunked.map((options, i) => (
            <div className="RenderingSandbox__column">
              <div className="RenderingSandbox__column__label">
                {sandboxColumnLabels[i]}
              </div>
              <div className="RenderingSandbox__list">
                {levels[i].map(property => (
                  <div className="RenderingSandbox__list__item" key={property}>
                    {property}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Expandy>
    </div>
  )
}