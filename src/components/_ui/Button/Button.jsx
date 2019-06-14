import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

require('./Button.scss')

class Button extends Component {
  getClassName() {
    return classNames(
      "Button", this.props.className
    )
  }

  render() {
    return (
      <button {...this.props} className={this.getClassName()}>
        {this.props.children}
      </button>
      )
  }
}

export default Button
