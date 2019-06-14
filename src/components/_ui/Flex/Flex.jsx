import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

require('./Flex.scss')

class Flex extends Component {
  static propTypes = {
    direction: PropTypes.oneOf(["inherit", "initial", "row", "column", "row-reverse", "column-reverse"]),
    justifyContent: PropTypes.oneOf(["flex-start", "flex-end", "center", "space-between", "space-around"])
  };

  static defaultProps = {
    direction: "row"
  };

  getClassName() {
    return classNames(
      "Flex", this.props.className
    )
  }

  getStyle() {
    let {direction, justifyContent} = this.props
    let style = Object.assign({}, this.props.style)
    direction && (style.flexDirection = style.WebkitFlexDirection = style.msFlexDirection = direction)
    justifyContent && (style.justifyContent = style.WebkitJustifyContent = style.msJustifyContent = justifyContent)
    return style
  }

  render() {
    return (
      <div {...this.props} className={this.getClassName()} style={this.getStyle()}>
        {this.props.children}
      </div>
      )
  }
}

export default Flex
