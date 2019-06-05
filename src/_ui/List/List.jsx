import React from 'react'
import Icon from '../Icon/Icon'

import './List.scss';

const List = ({ items=[], className, ...props }) => {
    return (
        <ul className={`List ${className}`} {...props}>
            { items.map(item => (
                <li className="List__item">
                    <Icon className="List__item__icon" name="asterisk" size="m" />
                    <div className="List__item__text">
                        { item }
                    </div>
                </li>
            )) }
        </ul>
    )
}

export default List
