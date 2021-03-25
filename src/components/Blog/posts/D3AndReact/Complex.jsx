import React, { useEffect, useRef, useState } from "react"
import { useSpring, animated } from "react-spring"
import * as d3 from "d3"
import { format, range } from "d3"
import { times } from "lodash"

import { useInterval } from "utils/utils.js"
import Aside from "components/_ui/Aside/Aside"
import Button from "components/_ui/Button/Button"
import Code from "components/_ui/Code/Code"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import { P, CodeAndExample } from "./examples"
import fishingImg from "components/Portfolio/Images/fishing.png"
import stateOfJsImg from "components/Portfolio/Images/state-of-js.png"
import jsToolsImg from "components/Portfolio/Images/js-tools.png"
import lunarMissionsImg from "components/Portfolio/Images/lunar-missions.png"

const Complex = () => {
  return (
    <div className="Complex">
      <p>We're through with the basics! We've covered:</p>
      <List
        items={[
          <>how to draw svg elements</>,
          <>
            how to draw <em>many</em> svg elements
          </>,
          <>
            how to replicate built-in d3 methods for drawing complex elements
            like axes
          </>,
          <>how to size our charts easily</>,
          <>how to draw maps!</>,
        ]}
      />

      <p>
        From me experience, the most important rule is to{" "}
        <em>know your tools</em>. Once you're comfortable with drawing with SVG,
        using d3 as a utility library, and building React.js code, you'll truly
        be able to make whatever you can imagine. This is the beauty of learning
        the fundamentals, instead of just grabbing a chart library -- it's a lot
        more work to learn, but is way more powerful.
      </p>

      <p>
        For inspiration, here are some more custom visualizations I've put
        together:
      </p>

      <div className="D3AndReact__slides">
        <Link
          to="/portfolio/fishing"
          className="D3AndReact__slide D3AndReact__slide--wide"
        >
          <img src={fishingImg} />
          <div className="D3AndReact__slide__text">
            Playing around with international fishing data
          </div>
        </Link>
        <Link
          to="https://2019.stateofjs.com/overview/"
          className="D3AndReact__slide"
        >
          <img src={stateOfJsImg} />
          <div className="D3AndReact__slide__text">
            A custom viz for The State of JS 2019 showing how usage & opinion of
            different Javascript tools has changed over the years
          </div>
        </Link>
        <Link to="https://js-tools.netlify.app/" className="D3AndReact__slide">
          <img src={jsToolsImg} />
          <div className="D3AndReact__slide__text">
            Looking at co-usage between Javascript tools with The State of JS
            2019 data
          </div>
        </Link>
        <Link
          to="https://loa.mit.edu/#/Database"
          className="D3AndReact__slide D3AndReact__slide--wide"
        >
          <img src={lunarMissionsImg} />
          <div className="D3AndReact__slide__text">
            An animated visualization of missions to the moon, showing
            interesting metrics like the type of mission, the organization, and
            whether or not it was successful
          </div>
        </Link>
      </div>

      <p>My favorite parts of the data visualization field are:</p>
      <List
        items={[
          <>how many forms we haven't yet explored,</>,
          <>how simple sharing can be, and</>,
          <>the impact they can have, especially when interactable</>,
        ]}
      />
      <p>
        And we get the best of all worlds when creating custom, interactive
        visualizations on the web.
      </p>

      <p>
        If you found this article useful, I'd love to hear what you make{" "}
        <Link to="https://twitter.com/wattenberger">on Twitter</Link>!
      </p>
    </div>
  )
}

export default Complex
