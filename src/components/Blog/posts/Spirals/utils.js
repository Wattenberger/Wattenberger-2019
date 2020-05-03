import React, { useEffect, useRef, useState } from "react"
import ResizeObserver from '@juggle/resize-observer';

// eslint-disable-next-line import/no-webpack-loader-syntax
require('intersection-observer');

export const getSpiralPositions = (
  pointRadius=5, n=100, angleDiff=2, distance=1.5
) => {
  let angle = 0
  return new Array(n).fill(0).map((_, i) => {
    const radius = Math.sqrt(i + 0.3) * pointRadius * distance
    angle += Math.asin(1 / radius) * pointRadius * angleDiff
    angle = angle % (Math.PI * 2)
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle,
    }
  })
}

export const sum = (arr=[]) => arr.reduce((a,b) => +a + +b, [])

export const getDistance = (a, b) => (
  Math.sqrt(
    Math.pow(Math.abs(a.x - b.x), 2)
    + Math.pow(Math.abs(a.y - b.y), 2)
  )
)

const combineChartDimensions = dms => {
  let parsedDimensions = {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      ...dms,
  }

  return {
      ...parsedDimensions,
      boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
      boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}

export const useChartDimensions = (passedSettings={}) => {
  const ref = useRef()
  const dms = combineChartDimensions(passedSettings)

  const [width, changeWidth] = useState(0)
  const [height, changeHeight] = useState(0)

  useEffect(() => {
    if (dms.width && dms.height) return

    const element = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      if (width != entry.contentRect.width) changeWidth(entry.contentRect.width)
      if (height != entry.contentRect.height) changeHeight(entry.contentRect.height)
    })

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [])

  const newSettings = combineChartDimensions({
    ...dms,
    width: dms.width || width,
    height: dms.height || height,
  })

  return [ref, newSettings]
}

export const useIsOnScreen = (ref, rootMargin = '0px') => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}