import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

require('./Tooltip.scss')

class Tooltip extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  getClassName() {
    return classNames(
      "Tooltip", this.props.className
    )
  }

  getStyle() {
    const { style } = this.props
    return {
      ...style,
    }
  }

  render() {
    const { style, children, ...props } = this.props

    return (
      <div {...props} className={this.getClassName()} style={this.getStyle()}>
        <div className="Tooltip__contents">
          {this.props.children}
        </div>
      </div>
      )
  }
}

export default Tooltip
