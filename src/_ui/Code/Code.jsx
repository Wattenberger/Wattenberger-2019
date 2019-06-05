import React, { useRef, useEffect, useMemo, useState } from 'react'
import Prism from "prismjs"
import "./prism.css"

import _ from "lodash"
import * as d3 from "d3"

import { scrollTo } from "./../../utils.js"

import './Code.scss';

const stepRegex = /(?!\n)( )*(\/\/ [\d]. )(.*\n)/gm
const Code = ({ highlightedLines=[], language="js", initialExpandedSteps, doScrollToTop=false, className, children, ...props }) => {
    const wrapper = useRef()
    const [expandedSteps, setExpandedSteps] = useState([])
    const needsToScroll = useRef()
    const currentHighlightedLines = useRef()
    currentHighlightedLines.current = highlightedLines
    const debouncedOnChange = useRef()

    // highlight code on mount
    useEffect(() => {
        Prism.highlightAll()
    }, [children])

    const scrollToHighlightedCode = () => {
        const lines = currentHighlightedLines.current
        if (!lines.length) return

        // const isStepCollapsed = lines

        const lineStartElem = d3.select(wrapper.current)
            .select(`#CodeLine-${lines[0] || 1}`).node()
        let lineEndElem = d3.select(wrapper.current)
            .select(`#CodeLine-${lines[lines.length - 1]}`).node()

        if (!lineStartElem) return
        if (!lineEndElem) lineEndElem = lineStartElem

        const lineStartY = lineStartElem.getBoundingClientRect().top
        const lineEndY = lineEndElem.getBoundingClientRect().top
        const height = wrapper.current.offsetHeight

        const doesFitOnScreen = (lineEndY - lineStartY) < height * 0.7
        const y = !doScrollToTop && doesFitOnScreen
            ? lineStartY
                + (lineEndY - lineStartY) / 2
                - height / 2
                + wrapper.current.scrollTop
            : lineStartY
                + wrapper.current.scrollTop
                - 35

        scrollTo(y, 600, wrapper.current)
    }
    const onChange = () => {
        if (needsToScroll.current) {
            scrollToHighlightedCode()
            needsToScroll.current = false
        }
    }

    useEffect(() => {
        debouncedOnChange.current = _.debounce(onChange, 400)
    }, [])

    useEffect(() => {
        setExpandedSteps(initialExpandedSteps || d3.range(1, 7))
        debouncedOnChange.current()
    }, [initialExpandedSteps])

    // split steps
    const steps = useMemo(() => {
        const codeSplitByLine = children.split("\n")
        const lastTwoLines = codeSplitByLine.slice(-2)
        const steps = codeSplitByLine.slice(0, -1).join("\n").split(stepRegex)

        let parsedSteps = []
        let endOfStep = -1
        let runningStartLine = 0
        steps.forEach((d, i) => {
            if (i <= endOfStep) return
            if (!d.replace(/ /g, "").length) return
            if (!d.startsWith("//")) {
                parsedSteps.push({
                    type: "string",
                    code: d,
                    startLineIndex: runningStartLine,
                })
                runningStartLine += d.split("\n").length
                return
            }
            const number = +d.match(/(\d)/)[0]
            parsedSteps.push({
                number,
                name: steps[i + 1],
                code: steps[i + 2],
                startLineIndex: runningStartLine,
            })
            runningStartLine += steps[i + 2].split("\n").length
            endOfStep = i + 2
        })

        parsedSteps.push({
            type: "string",
            code: [...lastTwoLines, ""].join("\n"),
            startLineIndex: runningStartLine - 1,
        })

        return parsedSteps
    }, [children])

    useEffect(() => {
        needsToScroll.current = true
        debouncedOnChange.current()
    }, [highlightedLines])

    const onToggleStepLocal = number => () => {
        const stepIsExpanded = expandedSteps.includes(number)
        const newSteps = stepIsExpanded
            ? expandedSteps.filter(d => d != number)
            : [...expandedSteps, number]
        setExpandedSteps(newSteps)
    }

    return (
        <div className={[
            "Code",
            getLanguageString(language),
            className,
        ].join(" ")} ref={wrapper}>
            {steps.map((step, i) => (
                step.type == "string" ? (
                    <CodeLines
                        key={i}
                        {...{...step, highlightedLines}}
                    />
                ) : (
                    <CodeStep
                        key={step.name}
                        {...{...step, highlightedLines}}
                        isExpanded={expandedSteps.includes(step.number)}
                        onToggle={onToggleStepLocal(step.number)}
                    />
                )
            ))}
        </div>
    )
}

export default Code

const languages = {
    js: "javascript",
}

const getLanguageString = lang => `language-${languages[lang] || lang}`

const CodeStep = ({ number, name, code, startLineIndex, highlightedLines, isExpanded, onToggle }) => (
    <div className={`CodeStep CodeStep--number-${number} CodeStep--is-${isExpanded ? "expanded" : "collapsed"}`} onClick={isExpanded ? () => {} : onToggle}>
        <div className="CodeStep__copyable-text">
            {`  // ${number}. ${name}`}
        </div>

        {!!isExpanded && (
            <div className="CodeStep__close" onClick={onToggle} />
        )}

        <div className="CodeStep__top" id={`CodeLine-${startLineIndex}`}>
            <div className="CodeLine__number">
                { startLineIndex }.
            </div>

            <div className="CodeStep__name">
                <div className="CodeStep__number">
                    { number }.
                </div>

                { name }
            </div>
        </div>

        <div className="CodeStep__lines">
            <CodeLines
                {...{ code, startLineIndex, highlightedLines }}
            />
        </div>

    </div>
)

const CodeLines = ({ code, startLineIndex, ...props }) => !code ? null : (
    code.split("\n").slice(0, -1).map((line, index) => (
        <CodeLine
            key={index}
            index={startLineIndex + index}
            code={line}
            {...props}
        />
    ))
)

const CodeLine = ({ code, index, highlightedLines }) => (
    <div className={[
        "CodeLine",
        `CodeLine--is-${highlightedLines.includes(index + 1) ? "highlighted" : "normal"}`,
    ].join(" ")}
    id={`CodeLine-${index + 1}`}>
        <div className="CodeLine__number">
            { index + 1 }.
        </div>

        <code>
            { code }
        </code>
    </div>
)