import React, { useRef, useEffect, useMemo, useState } from 'react'
import "./prism.css"

import _ from "lodash"
import * as d3 from "d3"

import { scrollTo } from "utils.js"
import Icon from 'components/_ui/Icon/Icon';
import ClipboardTrigger from 'components/_ui/ClipboardTrigger/ClipboardTrigger';
import ConfirmationFade from 'components/_ui/ConfirmationFade/ConfirmationFade';
import Tooltip from 'components/_ui/Tooltip/Tooltip';

import './Code.scss';

const stepRegex = /(?!\n)( )*(\/\/ [\d]. )(.*\n)/gm
const Code = ({
    highlightedLines=[],
    language="js",
    initialExpandedSteps,
    removedLines=[],
    insertedLines=[],
    size="m",
    fileName=null,
    doScrollToTop=false,
    doKeepInitialLineNumbers=false,
    hasLineNumbers=true,
    canEval=false,
    doOnlyShowHighlightedLines=false,
    doWrap=true,
    className, children, ...props
}) => {
    const wrapper = useRef()
    const [expandedSteps, setExpandedSteps] = useState([])
    const [hasRun, setHasRun] = useState(false)
    const needsToScroll = useRef()
    const currentHighlightedLines = useRef()
    currentHighlightedLines.current = highlightedLines
    const debouncedOnChange = useRef()
    const removedLinesString = removedLines.join(" ")
    const insertedLinesString = insertedLines.map(d => d.code).join(" ")

    const parsedCode = useMemo(() => {
        let codeArray = children.split("\n")
        codeArray = codeArray.filter((d, i) => !removedLines.includes(i + 1))

        if (insertedLines.length) {
            insertedLines.forEach(line => {
                codeArray = [
                    ...codeArray.slice(0, line.start),
                    line.code,
                    ...codeArray.slice(line.start),
                ]
            })
        }

        return codeArray.join("\n")
    }, [removedLinesString, insertedLinesString, children])

    // highlight code
    useEffect(() => {
        if (window.Prism) window.Prism.highlightAll()
    }, [parsedCode])

    const scrollToHighlightedCode = () => {
        if (doOnlyShowHighlightedLines) return

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
        const codeSplitByLine = parsedCode.split("\n")
        const lastTwoLines = codeSplitByLine.slice(-2)
        const steps = codeSplitByLine.slice(0, -1).join("\n").split(stepRegex)

        let parsedSteps = []
        let endOfStep = -1
        let runningStartLine = 0
        let runningRemovedLines = removedLines
        steps.forEach((d, i) => {
            if (i <= endOfStep) return
            if (!d.replace(/ /g, "").length) return
            if (doKeepInitialLineNumbers) {
                const doesOverlapRemovedLine = removedLines.includes(runningStartLine)
                if (doesOverlapRemovedLine) {
                    let lastNumber = runningRemovedLines[0]
                    let linesRun = runningRemovedLines.filter(d => {
                        if (d - lastNumber > 1) return false
                        lastNumber = d
                        return true
                    })
                    runningStartLine += linesRun.length - 1
                    runningRemovedLines = runningRemovedLines.filter(d => d > runningStartLine)
                }
            }
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
                type: doOnlyShowHighlightedLines ? "string" : "step",
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
    }, [parsedCode])

    useEffect(() => {
        needsToScroll.current = true
        debouncedOnChange.current()
    }, [highlightedLines])

    const onToggleStepLocal = number => () => {
        const stepIsExpanded = expandedSteps.includes(number)
        const newSteps = stepIsExpanded
            ? expandedSteps.filter(d => d !== number)
            : [...expandedSteps, number]
        setExpandedSteps(newSteps)
    }

    const onEval = () => {
        window.eval(parsedCode)
        setHasRun(true)
    }

    return (
        <div className="Code__wrapper">
            {!!fileName && (
                <div className="Code__file">
                    <Icon name="file" size="s" />
                    <div className="Code__file__name">
                        { fileName }
                    </div>

                    <div className="Code__file__actions">
                        {canEval && (
                            <Tooltip className="Code__eval" contents="Run code">
                                {hasRun && (
                                    <ConfirmationFade onFaded={() => setHasRun(false)}>
                                        Code has run!
                                    </ConfirmationFade>
                                )}
                                <Icon name="play" onClick={onEval} />
                            </Tooltip>
                        )}

                        <Tooltip className="Code__copy" contents="Copy code to my clipboard">
                            <ClipboardTrigger
                                text={parsedCode}
                            />
                        </Tooltip>
                    </div>
                </div>
            )}
            <div className={[
                "Code",
                `Code--size-${size}`,
                `Code--wrap-${doWrap ? "all" : "none"}`,
                getLanguageString(language),
                className,
            ].join(" ")} ref={wrapper}>
                {steps.map((step, i) => (
                    step.type === "string" ? (
                        <CodeLines
                            key={i}
                            {...{...step, highlightedLines, hasLineNumbers, doOnlyShowHighlightedLines}}
                        />
                    ) : (
                        <CodeStep
                            key={step.name}
                            {...{...step, highlightedLines, hasLineNumbers}}
                            isExpanded={expandedSteps.includes(step.number)}
                            onToggle={onToggleStepLocal(step.number)}
                        />
                    )
                ))}
            </div>
        </div>
    )
}

export default Code

const languages = {
    js: "javascript",
}

const getLanguageString = lang => `language-${languages[lang] || lang}`

const CodeStep = ({ number, name, code, startLineIndex, highlightedLines, isExpanded, hasLineNumbers, doOnlyShowHighlightedLines, onToggle }) => (
    <div className={`CodeStep CodeStep--number-${number} CodeStep--is-${isExpanded ? "expanded" : "collapsed"}`} onClick={isExpanded ? () => {} : onToggle}>
        <div className="CodeStep__copyable-text">
            {`  // ${number}. ${name}`}
        </div>

        {!!isExpanded && (
            <div className="CodeStep__close" onClick={onToggle} />
        )}

        <div className="CodeStep__top" id={`CodeLine-${startLineIndex}`} onClick={onToggle}>
            {hasLineNumbers && (
                <div className="CodeLine__number">
                    { startLineIndex }.
                </div>
            )}

            <div className="CodeStep__name">
                <div className="CodeStep__number">
                    { number }.
                </div>

                { name }
            </div>
        </div>

        <div className="CodeStep__lines">
            <CodeLines
                {...{ code, startLineIndex, highlightedLines, hasLineNumbers, doOnlyShowHighlightedLines }}
            />
        </div>

    </div>
)

const CodeLines = ({ code, startLineIndex, highlightedLines, doOnlyShowHighlightedLines, ...props }) => {
    if (!code) return null

    return (
        code.split("\n").slice(0, -1).map((line, index) => {
            const isHighlighted = highlightedLines.includes(startLineIndex + index + 1)
            if (doOnlyShowHighlightedLines && !isHighlighted) return null

            return (
                <CodeLine
                    key={index}
                    index={startLineIndex + index}
                    code={line}
                    isHighlighted={!doOnlyShowHighlightedLines && isHighlighted}
                    {...props}
                />
            )
        })
    )
}

const CodeLine = ({ code, index, isHighlighted, hasLineNumbers }) => {
    const [isHovering, setIsHovering] = useState(false)

    return (
        <div className={[
            "CodeLine",
            `CodeLine--is-${isHighlighted ? "highlighted" : "normal"}`,
        ].join(" ")}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        id={`CodeLine-${index + 1}`}>
            {hasLineNumbers && (
                <div className="CodeLine__number">
                    { index + 1 }.
                </div>
            )}

            <code>
                { code }
            </code>

            {isHovering && (
                <ClipboardTrigger
                    className="CodeLine__copy"
                    text={code}
                />
            )}
        </div>
    )
}