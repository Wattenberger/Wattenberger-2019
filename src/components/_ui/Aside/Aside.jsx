import React from 'react'

import Icon from "components/_ui/Icon/Icon"

import './Aside.scss';

const Aside = ({ icon, className, children, ...props }) => {
    return (
        <aside className={`Aside ${className}`} {...props}>
            {icon && (
                <Icon className="Aside__icon" name={icon} size="xl" />
            )}
            { children }
        </aside>
    )
}

export default Aside
