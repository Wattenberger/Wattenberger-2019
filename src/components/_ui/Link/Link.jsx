import React from 'react'

import './Link.scss';

const Link = ({ href, className, children, ...props }) => {
    return (
        <a className={`Link ${className}`} href={href} target="_blank" rel="noopener noreferrer" {...props}>
            { children }
        </a>
    )
}

export default Link
