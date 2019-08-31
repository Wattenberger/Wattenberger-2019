import { useRef, useState, useEffect } from "react"
import PropTypes from "prop-types"
import ResizeObserver from '@juggle/resize-observer';

export const dimensionsPropsType = (
    PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
        marginTop: PropTypes.number,
        marginRight: PropTypes.number,
        marginBottom: PropTypes.number,
        marginLeft: PropTypes.number,
    })
)

export const combineChartDimensions = dimensions => {
    let parsedDimensions = {
        marginTop: 40,
        marginRight: 30,
        marginBottom: 40,
        marginLeft: 75,
        ...dimensions,
    }

    return {
        ...parsedDimensions,
        boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
        boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
    }
}

export const useChartDimensions = passedSettings => {
    const ref = useRef()
    const dimensions = combineChartDimensions(passedSettings)

    const [width, changeWidth] = useState(0)
    const [height, changeHeight] = useState(0)

    useEffect(() => {
        if (dimensions.width && dimensions.height) return [ref, dimensions]

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
        ...dimensions,
        width: dimensions.width || width,
        height: dimensions.height || height,
    })

    return [ref, newSettings]
}