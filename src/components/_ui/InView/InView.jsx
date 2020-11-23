import React, { useCallback, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { noop, throttle } from "lodash"
import { useIsMounted } from "utils/utils"

// eslint-disable-next-line import/no-webpack-loader-syntax
require('intersection-observer');

const InView = ({ padding = "0", onChange = noop, className, children, ...props }) => {
  const isMounted = useIsMounted()
  const observer = useRef()
  const element = useRef()

  const onVisibilityChange = e => {
    if (!isMounted) return
    const isInView = e[0].isIntersecting;
    onChange(isInView)
  }
  const throttledOnVisibilityChange = useCallback(throttle(onVisibilityChange, 60))

  const createIntersectionObserver = () => {
    if (!isMounted) return
    if (!IntersectionObserver) return

    const options = {
    }

    observer.current = new IntersectionObserver(throttledOnVisibilityChange, options)
    observer.current.observe(element.current)
    observer.current.USE_MUTATION_OBSERVER = false
  }

  useEffect(() => {
    createIntersectionObserver()
    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [])

  return (
    <div {...props} className={className || ""} style={{ position: "relative" }}>
      <div ref={element} style={{
        position: "absolute",
        top: `calc(${padding})`,
        right: 0,
        bottom: `calc(${padding})`,
        left: 0,
        pointerEvents: "none",
      }} {...props} />
      { children }
    </div>
  )
}

export default InView
