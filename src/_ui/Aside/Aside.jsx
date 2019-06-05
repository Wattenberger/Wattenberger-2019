import React from 'react'

import './Aside.scss';

const Aside = ({ className, children, ...props }) => {
    return (
        <aside className={`Aside ${className}`} {...props}>
            { children }
        </aside>
    )
}

export default Aside
