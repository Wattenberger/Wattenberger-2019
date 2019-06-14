import React, { useEffect, useState, useRef } from 'react'
import _ from "lodash"

import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent";
import LocalExample from "./LocalExample";

const LocalExampleLazy = ({ className, ...props }) => {
    const [isInView, setIsInView] = useState(false)
    const debouncedIsInViewChange= useRef()

    const onIsInViewChange = status => {
        console.log(status)
        if (isInView) return
        if (status != 0) return
        setIsInView(true)
    }

    useEffect(() => {
        debouncedIsInViewChange.current = _.debounce(onIsInViewChange, 400)
    }, [])


    return (
        <ScrollEvent className={`LocalExampleLazy ${className}`} isInViewChange={debouncedIsInViewChange.current} thresholdPercent={0.1} hasIndicator={false}>
            {!isInView && (
                <div className="LocalExampleLazy__loading">Loading...</div>
            )}
            {isInView && (
                <LocalExample
                    {...props}
                />
            )}
        </ScrollEvent>
    )
}

export default LocalExampleLazy