import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'

import "./ConfirmationFade.scss"

const ConfirmationFade = ({ placement="nw", onFaded=()=>{}, children, className, ...props }) => {
    const [left, setLeft] = useState(null)
    const [top, setTop] = useState(null)
    const [hasFaded, setHasFaded] = useState(false)
    const timeout = useRef()
    const elem = useRef()

    useEffect(() => {
        setOffset()

        return () => {
            if (timeout.current) clearTimeout(timeout.current)
        }
    })

    const setOffset = () => {
        if (!elem.current) return;

        const position = elem.current.getBoundingClientRect()
        setLeft(position.left + position.width / 2
        )
        setTop(position.top)
        setTimeout(() => {
            setHasFaded(true)
            onFaded()
        }, 2000)
    }

    if (hasFaded) return null
    const portal = document.getElementById('app-tooltip-portal')

    return (
        <div className="ConfirmationFade__container" ref={elem}>
            {portal && typeof left == "number" && ReactDOM.createPortal(
                <div className={`ConfirmationFade__wrapper ConfirmationFade__wrapper--placement-${placement}`} {...props}
                    style={{
                        left: `${left}px`,
                        top: `${top}px`
                    }}>
                    <div
                        className={`ConfirmationFade ${className}`}>
                        { children }
                    </div>
                </div>,
                portal
            )}
        </div>
    )
}

export default ConfirmationFade

