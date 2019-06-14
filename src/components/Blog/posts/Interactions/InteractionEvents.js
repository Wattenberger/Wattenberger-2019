import React, { useState } from 'react'
import _ from "lodash"

import "./InteractionEvents.scss"
import Icon from 'components/_ui/Icon/Icon';

const InteractionEvents = () => {
    const [events, setEvents] = useState([])

    const addEvent = (event, index) => {
        const lastEvent = events[events.length - 1] || {}
        const isRepeatEvent = lastEvent.event === event

        if (isRepeatEvent) {
            setEvents(events => [
                events.slice(0, -1),
                {
                    ...lastEvent,
                    iterations: lastEvent.iterations + 1,
                },
            ])

        } else {
            setEvents(events => [
                ...events,
                {
                    index,
                    event,
                    iterations: 0,
                },
            ])
        }
    }

    const onEventLocal = (event, index) => () => {
        addEvent(event, index)
    }
    return (
        <div className="InteractionEvents">
            {[1,2].map(i => (
                <div
                    key={i}
                    className={`InteractionEvents__circle InteractionEvents__circle--index-${i}`}
                    onMouseEnter={onEventLocal("mouseenter", i)}
                    onClick={onEventLocal("click", i)}
                    onContextMenu={onEventLocal("contextmenu", i)}
                    onDoubleClick={onEventLocal("dblclick", i)}
                    onDrag={onEventLocal("drag", i)}
                    onDragEnd={onEventLocal("dragend", i)}
                    onDragEnter={onEventLocal("dragenter", i)}
                    onDragLeave={onEventLocal("dragleave", i)}
                    onDragOver={onEventLocal("dragover", i)}
                    onDragStart={onEventLocal("dragstart", i)}
                    onDrop={onEventLocal("drop", i)}
                    onMouseDown={onEventLocal("mousedown", i)}
                    onMouseMove={onEventLocal("mousemove", i)}
                    onMouseOut={onEventLocal("mouseout", i)}
                    onMouseOver={onEventLocal("mouseover", i)}
                    onDragExit={onEventLocal("dragexit", i)}
                    onMouseLeave={onEventLocal("mouseleave", i)}
                    onMouseUp={onEventLocal("mouseup", i)}
                    // onPointerDown={onEventLocal("pointerdown", i)}
                    // onPointerMove={onEventLocal("pointermove", i)}
                    // onPointerUp={onEventLocal("pointerup", i)}
                    // onPointerCancel={onEventLocal("pointercancel", i)}
                    // onGotPointerCapture={onEventLocal("gotpointercapture", i)}
                    // onLostPointerCapture={onEventLocal("lostpointercapture", i)}
                    // onPointerEnter={onEventLocal("pointerenter", i)}
                    // onPointerLeave={onEventLocal("pointerleave", i)}
                    // onPointerOver={onEventLocal("pointerover", i)}
                    onTouchCancel={onEventLocal("touchcancel", i)}
                    onTouchEnd={onEventLocal("touchend", i)}
                    onTouchMove={onEventLocal("touchmove", i)}
                    onTouchStart={onEventLocal("touchstart", i)}
                    onWheel={onEventLocal("wheel", i)}
                />
            ))}

            <div className="InteractionEvents__log">
                {!events.length && (
                    <div className="InteractionEvents__hint">
                        Interact with the circles - try clicking, dragging, right-clicking, scrolling over
                    </div>
                )}

                <h6>Log</h6>
                <div className="InteractionEvents__log__items">
                    {events.slice(-12).map((e, i) => (
                        <div className={`InteractionEvents__log__item InteractionEvents__log__item--index-${e.index}`} key={i}>
                            { e.event }
                            {_.times(e.iterations, i => (
                                // "|"
                                <Icon name="asterisk" key={i} size="xs" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default InteractionEvents