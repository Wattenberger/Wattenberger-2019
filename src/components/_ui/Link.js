import React, {Component} from "react"
import {Link as RouterLink} from "react-router-dom"

const Link = ({ to, children, ...props }) => {
    return (
        <RouterLink to={to} {...props}>
            { children }
        </RouterLink>
    )
}

export default Link