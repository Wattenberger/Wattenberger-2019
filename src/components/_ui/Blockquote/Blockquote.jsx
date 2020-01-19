import React from "react"

import "./Blockquote.scss"

const Blockquote = ({ source, isQuote=true, children, ...props }) => (
  <blockquote {...props} className={`Blockquote Blockquote--is-${isQuote ? "quote" : "non-quote"}`}>
    { children }
    {source && (
      <div className="Blockquote__source">
        { source }
      </div>
    )}
  </blockquote>
)

export default Blockquote