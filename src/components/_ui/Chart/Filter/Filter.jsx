import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import _ from "lodash"
import * as d3 from "d3"

class Filter extends Component {
  static propTypes = {
    id: PropTypes.string,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.oneOf([
            "filter",
            "feBlend",
            "feColorMatrix",
            "feComponentTransfer",
            "feComposite",
            "feConvolveMatrix",
            "feDisplacementMap",
            "feDiffuseLighting",
            "feDistantLight",
            "feFlood",
            "feGaussianBlur",
            "feImage",
            "feMerge",
            "feMorphology",
            "feOffset",
            "fePointLight",
            "feSpecularLighting",
            "feSpotLight",
            "feTile",
            "feTurbulence"
          ]),
          attrs: PropTypes.object,
          children: PropTypes.array,
        })
      ),
  };

  static defaultProps = {
    id: "filter",
    filters: [],
  };

  componentDidMount() {
    let {filters} = this.props
    filters.forEach((filter, idx) => {
      this.setFilterAttrs(filter, idx)
    })
  }

  getClassName() {
    let {id} = this.props

    return classNames(
      "Filter",
      `Filter__${id}`,
      this.props.className
    )
  }

  setFilterAttrs = (filter, idx, depth = 0) => {
    _.each(filter.attrs, (val, key) => {
      let ref = this.refs[`filter-${depth}-${idx}`]
      ref.setAttribute(key, val)
      if (filter.filters) filter.filters.forEach((child, idx) => this.setFilterAttrs(child, idx, depth + 1))
    })
  }

  renderFilter = (filter, idx, depth = 0) => {
    let Component = filter.type
    return <Component ref={`filter-${depth}-${idx}`} key={idx}>
      {(filter.filters || []).map((child, idx) => this.renderFilter(child, idx, depth + 1))}
    </Component>
  }

  render() {
    let {id, filters} = this.props

    return (
      <filter id={id} ref="filter" className={this.getClassName()}>
        {filters.map((filter, idx) => this.renderFilter(filter, idx))}
      </filter>
    )
  }
}

export default Filter
