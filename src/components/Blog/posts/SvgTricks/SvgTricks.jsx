import React, { useCallback, useEffect, useMemo, useState } from "react"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"
import { useInterval } from "utils/utils.js"
import { format, area, arc, curveBasis, curveMonotoneX, curveMonotoneY, scaleLinear } from "d3"
import { times, debounce } from "lodash"
import Gauge from "components/_ui/Gauge/Gauge"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import List from "components/_ui/List/List"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import Code from "components/_ui/Code/Code"
import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import Demo from "./Demo"

import "./SvgTricks.scss"

const SvgTricks = () => {
  const [sectionIndex, setSectionIndex] = useState(0)

  return (
    <div className="SvgTricks">

      <h1>
        SVG Tricks
      </h1>

      <div className="SvgTricks__content">
        <div className="SvgTricks__section__left">
          <p>
            Do you ever feel like you know everything there is to a tool? If any situation came up, you would know off the top of your head how to build it? Well, that was me with SVG, before I started playing around with creating generative art.
          </p>
          <p>
            I've ended up knowing "less" than I did when I started, but there are some really fun tricks that I wanted to share with you.
          </p>
        </div>



        <div className="SvgTricks__main">
          <div className="SvgTricks__sticky">
            <Demo />
          </div>

          <div className="SvgTricks__main__text">
            {sections.map((section, i) => (
              <ScrollEvent isInViewChange={status => {
                if (status != i) return
                setSectionIndex(i)
              }}>
                <div className="SvgTricks__section">
                  <h2>{section.title}</h2>
                  <p >
                    Here, we'll talk about the tricks behind the <P>{section.title}</P> 👀
                  </p>
                </div>
              </ScrollEvent>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const sections = [{
  title: "Clouds",
  id: "clouds",
}, {
  title: "Gate",
  id: "gate",
}, {
  title: "Texture",
  id: "texture",
}, {
  title: "Gooey filters",
  id: "gooey-filters",
}, {
  title: "Clip paths",
  id: "clip-paths",
}, {
  title: "Masks",
  id: "masks",
}, {
  title: "Perspective",
  id: "perspective",
}]

const P = React.memo(({ children }) => (
  <code className="P">{children}</code>
))

export default SvgTricks