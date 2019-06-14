import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import _ from "lodash"
import {isObject} from "lodash"

require('./RadioGroup.scss')

const getOptionValue = option => _.isObject(option) ? option.value : option
const areSameValue = (a, b) => getOptionValue(a) == getOptionValue(b)
class RadioGroup extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    isMulti: PropTypes.bool,
    canClear: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    options: [],
    isMulti: false,
    canClear: false,
    onChange: _.noop,
  };

  getClassName() {
    return classNames(
      "RadioGroup", this.props.className
    )
  }

  onChange = option => () => {
    const { value, isMulti } = this.props
    const newValue = isMulti ?
        !option ? [] :
        value.map(getOptionValue).includes(getOptionValue(option)) ? _.filter(value, d => !areSameValue(option, d)) :
          [...value, option]  :
        !option || areSameValue(value, option) ?
          null :
        option
    this.props.onChange(newValue)
  }

  renderOption = (option, idx) => {
    const {value, isMulti} = this.props

    const className = classNames(
      "RadioGroup__option", {
        "RadioGroup__option--selected": isMulti ?
          value.map(getOptionValue).includes(getOptionValue(option)) :
          areSameValue(option, value)
      }
    )
    return <div className={className} style={{
      color: option.color,
    }} onClick={this.onChange(option)} key={idx}>
      {_.isObject(option) && option.label ? option.label : getOptionValue(option)}
    </div>
  }

  renderClear = () => {
    return (
      <div className="RadioGroup__option RadioGroup__clear" onClick={this.onChange()}>
        x
      </div>
    )
  }

  render() {
    const {options, canClear, isMulti} = this.props

    return (
      <div className={this.getClassName()}>
        {options.map(this.renderOption)}
        {canClear && this.renderClear()}
      </div>
    )
  }
}

export default RadioGroup
