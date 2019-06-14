import React from 'react'

import './Tooltip.scss';

const Tooltip = ({ position="top", contents, className, children, ...props }) => {
    return (
        <div className={`Tooltip Tooltip--position-${position} ${className}`} {...props}>
            {!!contents && (
                <div className="Tooltip__contents">
                    { contents }
                </div>
            )}
            { children }
        </div>
    )
}

export default Tooltip
