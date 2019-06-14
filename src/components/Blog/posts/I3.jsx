import React, {useState} from "react"
import _ from "lodash"

import "./I3.scss"

const keyboardShortcuts = [{
    label: "Workspace 1",
    description: "Slack and other chat apps",
    keys: ["Windows","1"],
},{
    label: "Workspace 2",
    description: "Chrome and web browsers",
    keys: ["Windows","2"],
},{
    label: "Workspace 3",
    description: "VS Code and code editors",
    keys: ["Windows","3"],
},{
    label: "Move window to Workspace 1",
    keys: ["Windows","Shift","1"],
},{
    label: "Open app picker",
    keys: ["Windows","d"],
},{
    label: "Open emoji picker",
    keys: ["Windows","f"],
}]
const I3 = () => {
    const [selectedKeys, setSelectedKeys] = useState([])

    return (
        <div className="I3">
            <Keyboard selectedKeys={selectedKeys} />
            <div className="I3__shortcuts">
                {_.map(keyboardShortcuts, ({ label, description, keys }) => (
                    <div className="I3__shortcuts__item" key={label} onMouseEnter={() => setSelectedKeys(keys)} onMouseLeave={() => setSelectedKeys([])}>
                        <h5>
                            { label }
                        </h5>
                        <p>
                            { description }
                        </p>
                        <div className="I3__shortcuts__item__keys">
                            {_.map(keys, (key, i) => (
                                <>
                                    {!!i && <div className="I3__shortcuts__item__keys__item__plus">+</div>}
                                    <div className="I3__shortcuts__item__keys__item" key={key}>
                                        { renderKey(key) }
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default I3


const renderKey = key => key == "Windows" ? <KeyWindows /> :
                         key == "Page"    ? <KeyPage />    :
                         key == "arrows"  ? <KeyArrows />  :
                         key
const keys = [
    ["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"],
    ["Tab","q","w","e","r","t","y","u","i","o","p","[","]","\\"],
    ["Ctrl","a","s","d","f","g","h","j","k","l",";","\"","Enter"],
    ["Shift","z","x","c","v","b","n","m",",",".","/","Shift"],
    ["Ctrl","Fn","Windows","Alt","Space","Alt","Page","arrows"]
]
const Keyboard = ({ selectedKeys=[] }) => {
    return (
        <div className="Keyboard">
            {_.map(keys, (row, i) => (
                <div className="Keyboard__row" key={i}>
                    {_.map(row, (key, i) => (
                        <div className={[
                            `Keyboard__key`,
                            `Keyboard__key--${key}`,
                            `Keyboard__key--is-${key.length > 1 ? "long" : "short"}`,
                            `Keyboard__key--position-${!i ? "first" : i == (row.length - 1) ? "last" : "middle"}`,
                            `Keyboard__key--is-${selectedKeys.includes(key) && !(key == "Shift" && i > 0) ? "selected" : "not-selected"}`,
                        ].join(" ")} key={key}>
                            { renderKey(key) }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}


const KeyWindows = () => (
    <svg height={10} width={10}>
        <rect width={4} height={4} />
        <rect width={4} height={4} y={6} />
        <rect width={4} height={4} x={6} />
        <rect width={4} height={4} x={6} y={6} />
    </svg>
)

const KeyPage = () => (
    <svg height={10} width={10} fill="none" stroke="black">
        <rect width={10} height={10} strokeWidth={3} />
        <line x1={3} x2={7} y1={3} y2={3} />
        <line x1={3} x2={7} y1={5} y2={5} />
        <line x1={3} x2={7} y1={7} y2={7} />
    </svg>
)

const KeyArrows = () => (
    <div className="KeyArrows">
        <div className="KeyArrows__left Keyboard__key">
            <Caret rotate={-90} />
        </div>
        <div className="KeyArrows__center">
            <div className="KeyArrows__up Keyboard__key">
                <Caret rotate={0} />
            </div>
            <div className="KeyArrows__down Keyboard__key">
                <Caret rotate={180} />
            </div>
        </div>
        <div className="KeyArrows__right Keyboard__key">
            <Caret rotate={90} />
        </div>
    </div>
)

const Caret = ({ rotate }) => (
    <svg className="Caret" height={10} width={10} fill="none" stroke="black" style={{transform: `rotate(${rotate}deg)`}}>
        <path d={[
            "M",
            "0,8",
            "5,2",
            "10,8",
        ].join(" ")} />
    </svg>
)