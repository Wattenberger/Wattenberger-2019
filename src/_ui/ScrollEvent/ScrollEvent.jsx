import React, { Component } from "react"
import PropTypes from "prop-types"
import _ from "lodash"

import "./ScrollEvent.scss"
import Icon from "../Icon/Icon";
import Tooltip from "../Tooltip/Tooltip";

// eslint-disable-next-line import/no-webpack-loader-syntax
require('intersection-observer');

class ScrollEvent extends Component {
  state = {
    viewStatus: false,
  }
  isInView = false
  observer = null
  scrollListener = null
  elem = React.createRef()

  static propTypes = {
    isInViewChange: PropTypes.func,
    thresholdPercent: PropTypes.number,
  }

  static defaultProps = {
    thresholdPercent: 0.4,
    hasIndicator: true,
    isInViewChange: () => {},
  }

  componentDidMount() {
    this._isMounted = true
    this.createIntersectionObserver()
  }

  componentWillUnmount = () => {
    this._isMounted = false
    if (this.observer) this.observer.disconnect()
    if (this.scrollListener) window.removeEventListener("scroll", this.onScrollThrottled)
  }

  createIntersectionObserver = () => {
    if (!this._isMounted) return
    if (!IntersectionObserver) return
    const { thresholdPercent } = this.props

    var options = {
      thresholds: [0, thresholdPercent, 1],
    }

    this.observer = new IntersectionObserver(this.throttledOnVisibilityChange, options)
    this.observer.observe(this.elem.current)
    this.observer.USE_MUTATION_OBSERVER = false
  }

  onVisibilityChange = e => {
    if (!this._isMounted) return
    const bounds = e[0].boundingClientRect
    const isInView = e[0].isIntersecting

    if (isInView !== this.isInView) {
      this.isInView = isInView
      if (isInView) {
        this.onScrollThrottled = window.addEventListener("scroll", this.onScrollThrottled, {
          passive: true
        })
      } else {
        if (this.onScrollThrottled) window.removeEventListener("scroll", this.onScrollThrottled)

        const status = bounds.bottom < 0 ? 1 : -1
        this.props.isInViewChange(status)
        this.setState({ viewStatus: status })
      }
    }
  }
  throttledOnVisibilityChange = _.throttle(this.onVisibilityChange, 50)

  onScroll = e => {
    if (!this.isInView) return
    const { thresholdPercent } = this.props
    const { viewStatus } = this.state

    const bounds = this.elem.current.getBoundingClientRect()
    const status = bounds.top > window.innerHeight - thresholdPercent * window.innerHeight ? -1 :
      bounds.bottom < thresholdPercent * window.innerHeight ? 1 :
      0

    if (status === viewStatus) return

    this.props.isInViewChange(status)
    this.setState({ viewStatus: status })

  }
  onScrollThrottled = _.throttle(this.onScroll, 60)

  setStatusLocal = status => () => {
    this.props.isInViewChange(status)
    this.setState({ viewStatus: status })
  }

  render() {
    const { hasIndicator, children } = this.props
    const { viewStatus } = this.state

    return (
      <div className="ScrollEvent">
        {hasIndicator && (
          <Tooltip contents={viewStatus !== 0 ? "Activate this step" : "This step is active"} position="top-right" className={`ScrollEvent__indicator ScrollEvent__indicator--state-${viewStatus} ScrollEvent__indicator--is-${viewStatus === 0 ? "active" : "inactive"}`} onClick={this.setStatusLocal(0)}>
            <Icon name="code" size="l" />
          </Tooltip>
        )}
        <div className="ScrollEvent__listener" ref={this.elem} />
        { children }
      </div>
    )
  }
}

export default ScrollEvent
