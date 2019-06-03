import React, { useRef, useEffect } from 'react'
import Prism from "prismjs"
import * as d3 from "d3"
import "./prism.css"

import { scrollTo } from "./../../utils.js"

import './Code.scss';

const Code = ({ highlightedLines=[], language="js", className, children, ...props }) => {
    const wrapper = useRef()

    // highlight code on mount
    useEffect(() => {
        Prism.highlightAll()
    }, [])

    useEffect(() => {
        if (!highlightedLines.length) return

        const lineStartElem = d3.select(wrapper.current)
            .select(`#Code__line-${highlightedLines[0]}`).node()
        const lineEndElem = d3.select(wrapper.current)
            .select(`#Code__line-${highlightedLines[highlightedLines.length - 1]}`).node()

        if (!lineStartElem) return

        const lineStartY = lineStartElem.getBoundingClientRect().top
        const lineEndY = lineEndElem.getBoundingClientRect().top
        const height = wrapper.current.offsetHeight

        const doesFitOnScreen = (lineEndY - lineStartY) < height * 0.7
        const y = doesFitOnScreen
            ? lineStartY
                + (lineEndY - lineStartY) / 2
                - height / 2
                + wrapper.current.scrollTop
            : lineStartY
                + wrapper.current.scrollTop
                - 35

        scrollTo(y, 600, wrapper.current)
    }, [highlightedLines])

    return (
        <div className={[
            "Code",
            getLanguageString(language),
            className,
        ].join(" ")} ref={wrapper}>
            {children.split("\n").map((d, i) => (
                <div className={[
                    "Code__line",
                    `Code__line--is-${highlightedLines.includes(i + 1) ? "highlighted" : "normal"}`,
                ].join(" ")}
                id={`Code__line-${i}`}
                key={i}>
                    <div className="Code__line-number">
                        { i + 1 }.
                    </div>
                    <code>
                        { d }
                    </code>
                </div>
            ))}
        </div>
    )
}

export default Code

const languages = {
    js: "javascript",
}

const getLanguageString = lang => `language-${languages[lang] || lang}`