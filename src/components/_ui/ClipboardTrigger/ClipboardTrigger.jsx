import React, { useEffect, useState } from 'react'
import Icon from 'components/_ui/Icon/Icon'

import './ClipboardTrigger.scss'
import ConfirmationFade from 'components/_ui/ConfirmationFade/ConfirmationFade';

const ClipboardTrigger = ({ text, className, children, ...props }) => {
    const [canCopy, setCanCopy] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)

    useEffect(() => {
        async function checkSupport () {
            const copySupport = await navigator.permissions.query({name: "clipboard-write"})
            setCanCopy(copySupport.state === "granted")
        }
        checkSupport()
    })

    const onCopy = () => {
        navigator.clipboard.writeText(text)
        setHasCopied(true)
    }

    if (!canCopy) return null

    return (
        <div className={`ClipboardTrigger ${className}`} {...props} onClick={onCopy}>
            {hasCopied && (
                <ConfirmationFade onFaded={() => setHasCopied(false)}>
                    Copied to clipboard!
                </ConfirmationFade>
            )}
            <Icon className="ClipboardTrigger__icon" name="copy" />
            { children }
        </div>
    )
}

export default ClipboardTrigger
