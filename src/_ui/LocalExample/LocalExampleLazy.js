import React, { useState, useRef } from 'react'

import LocalExample from "./LocalExample";
import ScrollEvent from "./../ScrollEvent/ScrollEvent";

const LocalExampleLazy = ({ className, ...props }) => {
    const [isInView, setIsInView] = useState(false)

    const onIsInViewChange = status => {
        if (isInView) return
        if (status != 0) return
        setIsInView(true)
    }

    return (
        <ScrollEvent className={`LocalExampleLazy ${className}`} isInViewChange={onIsInViewChange} thresholdPercent={0.1} hasIndicator={false}>
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