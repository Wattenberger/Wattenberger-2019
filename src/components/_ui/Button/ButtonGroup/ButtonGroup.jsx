import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Button from "./../Button"

require('./ButtonGroup.scss')

class ButtonGroup extends Component {
  static propTypes = {
    buttons: PropTypes.array,
    onChange: PropTypes.func
  }

  getClassName() {
    return classNames(
      "ButtonGroup", this.props.className
    )
  }

  getButtonClassName(button) {
    return classNames(button.className, {
      "Button--active": button.isActive,
      "Button--inactive": !button.isActive,
    })
  }

  onChange = button => e => {
    this.props.onChange(button, e)
  }

  render() {
    let {buttons} = this.props

    return (
      <div className={this.getClassName()}>
        {buttons.map((button, idx) =>
          <Button type="button"
                  key={idx}
                  className={this.getButtonClassName(button)}
                  disabled={button.isDisabled}
                  onClick={this.onChange(button)}>
            {button.label || button}
            {button.children}
          </Button>
        )}
      </div>
      )
  }
}

export default ButtonGroup
