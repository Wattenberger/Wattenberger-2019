import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import * as d3 from "d3"
import _ from "lodash"
import Code from "components/_ui/Code/Code"

import "./SVG.scss"
import steps from "./steps"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent";
import Button from "components/_ui/Button/Button";
import LocalExample from "components/_ui/LocalExample/LocalExample";
import List from "components/_ui/List/List";
import Link from "components/_ui/Link/Link";
import Aside from "components/_ui/Aside/Aside";

import Icon from "components/_ui/Icon/Icon";
import { scrollTo } from "utils";

const SVG = () => {
  const [highlightedLines, setHighlightedLines] = useState([])
  const [title, setTitle] = useState("")
  const [step, setStep] = useState({})
  const [editedCode, setEditedCode] = useState("")
  const [stepIndex, setStepIndex] = useState(0)
  const [code, setCode] = useState(null)
  const [removedLines, setRemovedLines] = useState([])
  const [insertedLines, setInsertedLines] = useState([])

  const onChangeStepLocal = diff => () => {
      const newStepIndex = stepIndex + diff
      setStepIndex(newStepIndex)
  }

  useEffect(() => {
    const stepInUrl = +(window.location.hash || "").slice(1)
    if (!Number.isFinite(stepInUrl)) return
    setStepIndex(stepInUrl)
}, [])

  useEffect(() => {
      const step = steps[stepIndex]
      setStep(step)
      setTitle(step.title)
      setCode(step.code)
      setRemovedLines(step.removedLines || [])
      setInsertedLines(step.insertedLines || [])
      setHighlightedLines(step.highlightedLines || [])
      setEditedCode(null)
      window.history.pushState({}, '', `#${stepIndex}`);
    }, [stepIndex])

  const onExecuteEditedCode = code => {
    setEditedCode(code)
  }

  return (
    <div className={`SVG`}>

      <Helmet>
          <meta charSet="utf-8" />
          <title>SVG</title>
          {/* <link rel="canonical" href="https://wattenberger.com/blog/d3-interactive-charts" />
          <meta property="og:title" content="Interactive Charts with D3.js" />
          <meta property="og:type" content="article" />
          <meta name="description" content="Learn how to make your web charts interactive with D3. We'll walk through adding a tooltip to a histogram, and learn general concepts that you can use for any kind of interaction for your own charts!" />
          <meta name="og:description" content="Learn how to make your web charts interactive with D3. We'll walk through adding a tooltip to a histogram, and learn general concepts that you can use for any kind of interaction for your own charts!" />
          <meta property="og:image" content={image} /> */}
      </Helmet>

      <div className="SVG__fixed-code__wrapper">
        <div className="SVG__fixed-code">
          {!!code && (
            <Code
              className="SVG__code"
              fileName="example.html"
              doWrap={false}
              canEdit
              onExecuteEditedCode={onExecuteEditedCode}
              {...{highlightedLines, removedLines, insertedLines}}>
              { code }
            </Code>
          )}
        </div>
      </div>

      <div className="SVG__content">

        <h1>
          { title || "SVG Fundamentals" }
        </h1>

        <div className="SVG__actions">
            <Button onClick={onChangeStepLocal(-1)} disabled={stepIndex <= 0}>
                <Icon name="arrow" direction="w" size="s" />
                Previous step
            </Button>
            {/* <input value={stepIndex} onChange={e => setStepIndex(+e.target.value)} type="nubmer" /> */}
            <Button onClick={onChangeStepLocal(1)} disabled={stepIndex >= (steps.length - 1)}>
                Next step
                <Icon name="arrow" direction="e" size="s" />
            </Button>
        </div>

        {step.description && (
          <>
            <br />
            { step.description }
          </>
        )}

        {editedCode ? (
          <LocalExample
            html={editedCode}
            className="SVG__iframe"
          />
        ) : (
          <LocalExample
            html={code}
          //   css={exampleBarsCss}
          //   js={exampleBars}
          //   data={dataCsv}
            removedLines={{
              html: removedLines,
            }}
            insertedLines={{
              html: insertedLines,
            }}
            className="SVG__iframe"
          />
        )}

        { step.notes }


      </div>

    </div>
  )
}

export default SVG





const P = ({ children })=> (
  <code className="P">{ children }</code>
)

const Heading = ({ id, children }) => {
  const onClickHash = () => {
    window.location.hash = `#${id}`

  }

  return (
    <h2 className="Heading" id={id}>
      <div className="Heading__hash" onClick={onClickHash}>#</div>
      { children }
    </h2>
  )
}