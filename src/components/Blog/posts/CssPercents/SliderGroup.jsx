import React from "react"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"

import "./SliderGroup.scss"

const SliderGroup = ({ label, value, valueSuffix="", onChange, min=0, max=100, step=1, className, ...props }) => {

  return (
    <div className={`SliderGroup ${className}`} {...props}>
      <div className="SliderGroup__labels">
        <div>{ label }</div>
        <div>{ value }{ valueSuffix }</div>
      </div>
      <Slider
        className="SliderGroup__slider"
        {...{value, min, max, step}}
        onChange={onChange}
      />
    </div>
  )
}

export default SliderGroup