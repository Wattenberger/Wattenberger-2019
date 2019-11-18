import React from "react"

import "./Blockquote.scss"

const Blockquote = ({ source, children, ...props }) => (
  <blockquote {...props} className="Blockquote">
    { children }
    {source && (
      <div className="Blockquote__source">
        { source }
      </div>
    )}
  </blockquote>
)

export default Blockquote