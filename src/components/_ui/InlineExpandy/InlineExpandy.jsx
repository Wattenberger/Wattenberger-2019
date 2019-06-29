import React, { useState, useRef } from 'react'
import Icon from "components/_ui/Icon/Icon"

import './InlineExpandy.scss';

const InlineExpandy = ({ description, className, children, ...props }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const onToggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className={`InlineExpandy InlineExpandy--is-${isExpanded ? "expanded" : "collapsed"} ${className}`} {...props}>
            <div className="InlineExpandy__trigger" onClick={onToggleExpanded}>
                { isExpanded ? "Hide" : "Show" } { description }...
            </div>

            {isExpanded && (
                <div className="InlineExpandy__contents">
                    { children }
                </div>
            )}
        </div>
    )
}

export default InlineExpandy
