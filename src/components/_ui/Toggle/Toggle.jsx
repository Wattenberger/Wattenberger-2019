import React from 'react'
import _ from "lodash"

import './Toggle.scss'

const Toggle = ({ options, value, onChange, ...props }) => {
    const onChangeLocal = (value, index) => () => onChange(value, index)

    return (
        <div {...props}>
            {_.map(options, (option, index) => {
                const id = _.get(option, "id", option)
                const label = _.get(option, "label", option)
                const isSelected = id == value

                return (
                    <button
                        key={id}
                        styleType="secondary"
                        className={`Toggle__button Toggle__button--is-${isSelected ? 'selected' : 'not-selected' }`}
                        onClick={onChangeLocal(id, index)}>
                        { label }
                    </button>
                )
            })}
        </div>
    )
}

export default Toggle
