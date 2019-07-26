import React from 'react'
import _ from "lodash"

import './Toggle.scss'
import ButtonGroup from '../Button/ButtonGroup/ButtonGroup';
import Button from '../Button/Button';

const Toggle = ({ options, value, onChange, ...props }) => {
    const onChangeLocal = button => onChange(button.id)

    const buttons = options.map(option => ({
        ...option,
        isActive: option.id == value,
    }))

    return (
        <ButtonGroup {...props}
            buttons={buttons}
            onChange={onChangeLocal}
        />
    )
}

export default Toggle
