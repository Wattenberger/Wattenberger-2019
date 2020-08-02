import React from 'react'
import {Link as RouterLink} from "react-router-dom"

import './Link.scss';

const Link = ({ href, to, type="inline", className, children, ...props }) => {
    if (to && !to.startsWith("http") && to != "/rss") return (
        <RouterLink to={to} className={`Link Link--type-${type} ${className}`} {...props}>
            { children }
        </RouterLink>
    )

    return (
        <a className={`Link Link--type-${type} ${className}`} href={href || to} target="_blank" rel="noopener" {...props}>
            { children }
        </a>
    )
}

export default Link
