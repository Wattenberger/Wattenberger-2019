import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"

import "./LocalExample.scss"


// eslint-disable-next-line import/no-webpack-loader-syntax
const d3js = require(`!!raw-loader!examples/d3.v5.js`).default

const getBlobURL = (code, type) => {
  const blob = new Blob([code], { type })
  return URL.createObjectURL(blob)
}
const getGeneratedPageURL = ({ html, css, js, data, removedLines={}, insertedLines={} }) => {
  const source = `
    <html>
      <head>
        ${css && `<link rel="stylesheet" type="text/css" href="${getCssUrl({ css, removedLines: removedLines.css, insertedLines: insertedLines.css })}" />`}
      </head>
      <body>
        ${getHtmlBody({ html, removedLines: removedLines.html, insertedLines: insertedLines.html })}
        ${js && `<script src="${getJsURL({ js, data, removedLines: removedLines.js, insertedLines: insertedLines.js })}"></script>`}
      </body>
    </html>
  `

  return getBlobURL(source, 'text/html')
}

const getHtmlBody = ({ html, removedLines, insertedLines })=> {
  let bodyContents = (/<body[^>]*>((.|[\n\r])*)<\/body>/gm.exec(html) || [])[1] || ""
  if (!bodyContents) return html

  bodyContents = bodyContents.replace(/(\n)( )*(<script src=".\/chart.js"><\/script>)/g, "")

  if (removedLines) {
    bodyContents = bodyContents.split("\n")
      .filter((d,i) => !removedLines.includes(i + 1))
      .join("\n")
  }

  if (insertedLines) {
    let parsedHtmlArray = bodyContents.split("\n")
    insertedLines.forEach(line => {
      parsedHtmlArray = [
        ...parsedHtmlArray.slice(0, line.start),
        line.code,
        ...parsedHtmlArray.slice(line.start),
      ]
    })
    bodyContents = parsedHtmlArray.join("\n")
  }

  return bodyContents
}

const getCssUrl = ({ css, removedLines, insertedLines }) => {
  let parsedCss = css

  if (removedLines) {
    parsedCss = parsedCss.split("\n")
      .filter((d,i) => !removedLines.includes(i + 1))
      .join("\n")
  }

  if (insertedLines) {
    let parsedCssArray = parsedCss.split("\n")
    insertedLines.forEach(line => {
      parsedCssArray = [
        ...parsedCssArray.slice(0, line.start),
        line.code,
        ...parsedCssArray.slice(line.start),
      ]
    })
    parsedCss = parsedCssArray.join("\n")
  }

  return getBlobURL(parsedCss, 'text/css')
}

const getJsURL = ({ js, data, removedLines, insertedLines }) => {
  let parsedJs = js

  if (removedLines) {
    parsedJs = parsedJs.split("\n")
      .filter((d,i) => !removedLines.includes(i + 1))
      .join("\n")
  }

  if (insertedLines) {
    let parsedJsArray = parsedJs.split("\n")
    insertedLines.forEach(line => {
      parsedJsArray = [
        ...parsedJsArray.slice(0, line.start),
        line.code,
        ...parsedJsArray.slice(line.start),
      ]
    })
    parsedJs = parsedJsArray.join("\n")
  }

  if (data) {
    parsedJs = parsedJs.replace(/(dataset = await)(.)*(\n)/, [
      "dataset = ",
      JSON.stringify(d3.csvParse(data.replace(/\$/g, "%24"))),
    ].join("")
    )
  }

  parsedJs = [d3js, parsedJs].join("\n")

  return getBlobURL(parsedJs, 'text/javascript')
}

const LocalExample = ({ html, css, js, data, removedLines={}, insertedLines={}, ...props }) => {
    const iframe = useRef()

    const removedLinesString = [
      (removedLines.js || []).join(" "),
      (removedLines.css || []).join(" "),
      (removedLines.html || []).join(" "),
    ].join(" ")
    const insertedLinesString = [
      (removedLines.js || []).map(d => d.code).join(" "),
      (removedLines.css || []).map(d => d.code).join(" "),
      (removedLines.html || []).map(d => d.code).join(" "),
    ].join(" ")

    useEffect(() => {
        const url = getGeneratedPageURL({
            html: html || "",
            css: css || "",
            js: js || "",
            data, removedLines, insertedLines,
        })

        iframe.current.src = url

    }, [html, css, js, data, removedLinesString, insertedLinesString])

    return (
        <iframe className="LocalExample" title="inline example" ref={iframe} {...props} />
    )
}

export default LocalExample