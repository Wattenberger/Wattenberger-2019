import React, { useEffect } from "react"
import { format as d3Format } from "d3-format"
import { fromPairs } from "lodash"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"
import InterpolatedNumber from "components/_ui/InterpolatedNumber/InterpolatedNumber"
import forceTypes, { forceTypesMap } from "./force-types"

import "./D3ForceForces.scss"


const D3ForceForces = ({
  forces, optionNames, excludedMethods, isRunning,
  onChange, onSetIsRunning, onTick, onAddForce,
  forceAttributes, setForceAttributes,
  forceFunctions, setForceFunctions,
}) => {

  const visibleForceTypes = optionNames.map(optionName => (
    forceTypes.find(([name]) => optionName == name)
  ))

  useEffect(() => {
    const newForceAttributes = {...forceAttributes}
    const newForces = forces.filter(([ name ]) => (
      !forceAttributes[name]
    ))
    newForces.forEach(force => {
      newForceAttributes[force[2]] = getForceAttributes(force)
    })

    const oldAttributes = Object.keys(newForceAttributes).filter(d => (
      !forces.find(([name, func, id]) => d == id)
    ))
    oldAttributes.forEach(id => {
      delete newForceAttributes[id]
    })
    setForceAttributes(newForceAttributes)
  }, [forces])

  const getAttributeDefaultValue = attribute => (
    typeof attribute["defaultValue"] != "undefined" ? attribute["defaultValue"]
    : typeof attribute["getDefaultValue"] == "function" ? attribute["getDefaultValue"]()
    : 0
  )

  const getForceAttributes = (force) => {
    const [name, func, id] = force
    const attributes = forceTypesMap[name][2]
    const forceAttributes = fromPairs(attributes.map(attribute => ([
      attribute["name"],
      {...attribute, value: getAttributeDefaultValue(attribute)},
    ])))

    Object.keys(forceAttributes).forEach(attributeName => {
      const attribute = forceAttributes[attributeName]
      if (!forceAttributes[attributeName]) {
        return
      }
      if (!func[attributeName]) {
        console.log(attributeName, force);
        return
      }
      func[attributeName](forceAttributes[attributeName]["value"])
    })

    return forceAttributes
  }

  const onRemoveForceAtIndex = index => {
    const newForces = [
      ...forces.slice(0, index),
      ...forces.slice(index + 1),
    ]
    onChange(newForces)
  }

  const onAttributeChange = (index, attribute, value) => {
    if (!forces[index]) return
    if (!forces[index][1][attribute]) return
    forces[index][1][attribute](value)

    const newForceAttributes = {...forceAttributes}
    newForceAttributes[forces[index][2]][attribute]["value"] = value
    setForceAttributes(newForceAttributes)
  }

  return (
    <div className="D3ForceForces">
      <div className="D3ForceForces__section">
        <h6>Simulation Control panel</h6>
        <div className="D3ForceForces__controls">
          {isRunning ? (
            <Button onClick={() => onSetIsRunning(false)}>
              <Icon name="pause" size="xs" />
            </Button>
          ) : (
            <Button onClick={() => onSetIsRunning(true)}>
              <Icon name="play" size="xs" />
            </Button>
          )}
          <div>
            { isRunning ? "The simulation is running" : "The simulation is paused"}
          </div>
          {!isRunning && (
            <Button onClick={onTick}>
              Tick
            </Button>
          )}
        </div>
      </div>

      <div className="D3ForceForces__section">
        <h6>Add a force</h6>
        <div className="D3ForceForces__options">
          {visibleForceTypes.map(([name], i) => (
              <Button className="D3ForceForces__option" key={name} onClick={() => onAddForce(visibleForceTypes[i])}>
                {/* <Icon name="x" direction="ne" size="xs" /> */}
                { name }
              </Button>
          ))}
        </div>
      </div>

      <div className="D3ForceForces__section">
        <h6>Active forces</h6>
        <div className="D3ForceForces__forces">
          {forces.map(([name, func, id], i) => (
            <div className="D3ForceForces__force" key={name + i}>
              <div className="D3ForceForces__force__title">
                { name } force
                <Button onClick={() => onRemoveForceAtIndex(i)}>
                  <Icon name="x" size="xs" />
                </Button>
              </div>
              <div className="D3ForceForces__force__attributes">
                {Object.keys(forceAttributes[id] || {})
                  .filter(attribute => !excludedMethods.includes(attribute))
                  .map(attribute => (
                    <D3ForceForcesAttribute
                      key={attribute + i}
                      name={attribute}
                      {...forceAttributes[id][attribute]}
                      onChange={value => onAttributeChange(i, attribute, value)}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default D3ForceForces

const D3ForceForcesAttribute = ({ name, value=0, min=0, max=50, step=1, format=",.0f", options=[], type, onChange }) => (
  <div className="D3ForceForces__force__attribute">
    <div className="D3ForceForces__force__attribute__top">
      <div className="D3ForceForces__force__attribute__name">
        { name }
      </div>
      {typeof value == "number" && (
        <div className="D3ForceForces__force__attribute__value">
          <InterpolatedNumber number={ value } format={d3Format(format)} />
        </div>
      )}
    </div>

    {type != "array" && (
      <div className={`D3ForceForces__force__attribute__slider D3ForceForces__force__attribute__slider--is-${typeof value == "number" ? "visible" : "disabled"}`}>
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
        />
      </div>
    )}

    <div className="D3ForceForces__force__attribute__options">
      {options.map(option => (
        <Button key={option["name"]} className={`D3ForceForces__force__attribute__option ${
          value == option["value"] ? "Button--selected" : ""}
        `} onClick={() => onChange(option["value"] || option["getValue"]())}>
          { option["name"] }
        </Button>
      ))}
    </div>

  </div>
)