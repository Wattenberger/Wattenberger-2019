import React, { useEffect, useRef } from 'react'
import * as d3 from "d3"

// eslint-disable-next-line import/no-webpack-loader-syntax
const d3js = require('!!raw-loader!./../../examples/d3.v5.js').default

const getBlobURL = (code, type) => {
  const blob = new Blob([code], { type })
  return URL.createObjectURL(blob)
}
const getGeneratedPageURL = ({ html, css, js, data, removedLines={} }) => {
  const source = `
    <html>
      <head>
        ${css && `<link rel="stylesheet" type="text/css" href="${getCssUrl({ css, removedLines: removedLines.css })}" />`}
      </head>
      <body>
        ${getHtmlBody({ html, removedLines: removedLines.html })}
        ${js && `<script src="${getJsURL({ js, data, removedLines: removedLines.js })}"></script>`}
      </body>
    </html>
  `

  return getBlobURL(source, 'text/html')
}

const getHtmlBody = ({ html, removedLines })=> {
  let bodyContents = (/<body[^>]*>((.|[\n\r])*)<\/body>/gm.exec(html) || [])[1] || ""
  bodyContents = bodyContents.replace(/(\n)( )*(<script src=".\/chart.js"><\/script>)/g, "")

  if (removedLines) {
    bodyContents = bodyContents.split("\n")
      .filter((d,i) => !removedLines.includes(i + 1))
      .join("\n")
  }

  return bodyContents
}

const getCssUrl = ({ css, removedLines }) => {
  let parsedCss = css

  if (removedLines) {
    parsedCss = parsedCss.split("\n")
      .filter((d,i) => !removedLines.includes(i + 1))
      .join("\n")
  }

  return getBlobURL(parsedCss, 'text/css')
}

const getJsURL = ({ js, data, removedLines }) => {
  let parsedJs = js

  if (removedLines) {
    parsedJs = parsedJs.split("\n")
      .filter((d,i) => !removedLines.includes(i + 1))
      .join("\n")
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

const LocalExample = ({ html, css, js, data, removedLines={}, ...props }) => {
    const iframe = useRef()

    useEffect(() => {
        const url = getGeneratedPageURL({
            html: html || "",
            css: css || "",
            js: js || "",
            data, removedLines,
        })

        iframe.current.src = url

    }, [html, css, js, data])

    return (
        <iframe ref={iframe} {...props} />
    )
}

export default LocalExample