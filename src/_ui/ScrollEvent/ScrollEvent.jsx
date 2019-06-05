import React, { Component } from "react"
import PropTypes from "prop-types"
import _ from "lodash"

import "./ScrollEvent.scss"

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
    thresholdPercent: 0.2,
    isInViewChange: () => {},
  }

  componentDidMount() {
    this._isMounted = true
    this.createIntersectionObserver()
  }

  componentWillUnmount = () => {
    this._isMounted = false
    if (this.observer) this.observer.disconnect()
    if (this.scrollListener) window.removeEventListener("scroll", this.onScrollDebounced)
  }

  createIntersectionObserver = () => {
    if (!this._isMounted) return
    if (!IntersectionObserver) return
    const { thresholdPercent } = this.props

    var options = {
      thresholds: [0, thresholdPercent, 1],
    }

    this.observer = new IntersectionObserver(this.debouncedOnVisibilityChange, options)
    this.observer.observe(this.elem.current)
    this.observer.USE_MUTATION_OBSERVER = false
  }

  onVisibilityChange = e => {
    if (!this._isMounted) return
    const { thresholdPercent } = this.props

    const bounds = e[0].boundingClientRect
    const isInView = e[0].isIntersecting

    if (isInView != this.isInView) {
      this.isInView = isInView
      if (isInView) {
        this.onScrollDebounced = window.addEventListener("scroll", this.onScrollDebounced, {
          passive: true
        })
      } else {
        if (this.onScrollDebounced) window.removeEventListener("scroll", this.onScrollDebounced)

        const status = bounds.bottom < 0 ? 1 : -1
        this.props.isInViewChange(status)
        this.setState({ viewStatus: status })
      }
    }
  }
  debouncedOnVisibilityChange = _.debounce(this.onVisibilityChange, 60)

  onScroll = e => {
    if (!this.isInView) return
    const { thresholdPercent } = this.props
    const { viewStatus } = this.state

    const bounds = this.elem.current.getBoundingClientRect()
    const status = bounds.top > window.innerHeight - thresholdPercent * window.innerHeight ? -1 :
      bounds.bottom < thresholdPercent * window.innerHeight ? 1 :
      0

    if (status == viewStatus) return

    this.props.isInViewChange(status)
    this.setState({ viewStatus: status })

  }
  onScrollDebounced = _.throttle(this.onScroll, 60)

  render() {
    const { children } = this.props

    return (
      <div className="ScrollEvent">
        <div className="ScrollEvent__listener" ref={this.elem} />
        { children }
      </div>
    )
  }
}

export default ScrollEvent
