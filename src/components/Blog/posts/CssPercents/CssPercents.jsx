import React, { memo, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { lowerCase } from "lodash"
import { isFinite, times } from "lodash"
import Icon from "components/_ui/Icon/Icon"
import Aside from "components/_ui/Aside/Aside"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import Code from "components/_ui/Code/Code"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import Button from "components/_ui/Button/Button"
import SliderGroup from "./SliderGroup"
import {  } from "./constants"
import { scrollTo } from "utils";
import metaImage from "./../css-percents.png"

import "./CssPercents.scss"

const CssPercents = () => {
  const [activeLevel, setActiveLevel] = useState(null)
  const [doForceCenterExampleParams, setDoForceCenterExampleParams] = useState(false)

  const onForceCenterExampleParams = () => {
    setDoForceCenterExampleParams(true)
    setTimeout(() => {
      setDoForceCenterExampleParams(false)
    }, 50)
  }

  const scrollToId = id => {
    const sectionElement = document.querySelector(`#${id}`)
    if (!sectionElement) return

    const y = sectionElement.getBoundingClientRect().top
      + window.scrollY
      - 150

    scrollTo(y, 100)
  }

  useEffect(() => {
    const hash = (window.location.hash || "").slice(1)
    if (hash) scrollToId(hash)
  }, [])

  const setHeaderHashLocal = id => () => {
    window.location.hash = `#${id}`
    scrollToId(id)
  }

  return (
    <div className="CssPercents">
      <Helmet>
          <meta charSet="utf-8" />
          <title>What does 100% mean in CSS?</title>
          <link rel="canonical" href="https://wattenberger.com/blog/css-percents" />
          <meta property="og:type" content="website" />
          <meta name="description" content="<p>One of the CSS units I use most is the wonderful <b>%</b> — so handy for positioning elements on the page.</p><p>Unfortunately, the rules aren’t exactly straightforward. One question I’m always asking myself is: Percent of what?</p>" />
          <meta name="image" content={metaImage} />
      </Helmet>

      <div className="CssPercents__content">

        <h1>What does 100% mean in CSS?</h1>

        <h3>Spoiler: it depends</h3>

        <p>One of the CSS units I use most is the wonderful <b>%</b> — so handy for positioning elements on the page.</p>

        <p>Unfortunately, the rules aren’t exactly straightforward. One question I’m always asking myself is:</p>
        <Blockquote>Percent of <i>what</i>?</Blockquote>

        <p>Hopefully this guide can help clear things up.</p>

        <a href="#gist" className="skip">Just give me the gist!</a>

        <section>
          <h2>The basics: width & height</h2>

          <p>In these examples, the purple box is our lovely <Self>self</Self> element — this is the element we’re trying to position using CSS properties. The surrounding blue box is the <Parent>parent</Parent> element.</p>

          <Aside> It’s important to note that the <Self>self</Self> element is <P>absolutely</P> positioned, to take it out of the normal flow and prevent moving things as we’re poking around.</Aside>

          <p>Let’s start with our most basic, and most straightforward, example: <P>width</P> and <P>height</P>. Move the sliders around to get a feel for how the width and height of our <Self>self</Self> element changes with different percentage values.</p>

        <Example properties="width,height" />

        <p>We can see that our <Self>element’s</Self> <P>width</P> and <P>height</P> are based on our <Parent>parent’s</Parent> <P>width</P> and <P>height</P> (respectively).</p>

      </section>

      <section>
        <h2>top & left</h2>

        <p>Great! Seems pretty straightforward — let’s move on to <P>left</P> and <P>top</P>:</p>

        <Example properties="width,height,top,left" />

        <p>These values are also based on our <Parent>parent’s</Parent> <P>width</P> and <P>height</P>. If an element has a <P>left</P> value of <P>50%</P>, its left side will sit halfway across its parent component.</p>

      </section>

      <section>
        <h2>margins</h2>

        <p>What about <P>margin</P>s?</p>

        <Example properties="width,height,marginTop,marginLeft" />

        <p><P>margin</P>s are exactly the same as <P>left</P> and <P>top</P> — they are based on the <P>width</P> and <P>height</P>of their <Parent>parent</Parent>.</p>

        <p>There is one weird thing here that is important to note: <b><P>margin-left</P> is based on our <Parent>parent’s</Parent> <em>width</em>, not height</b> (and the same goes for <P>margin-right</P>).</p>
      </section>

      <section>
        <h2>padding</h2>

        <p>And what about <P>padding</P>? Should be the same as <P>margin</P>, right?</p>

        <Example properties="width,height,paddingTop,paddingLeft" />

        <p>And it is! For the most part.</p>
        <p>Something interesting you might notice here is that <P>padding-left</P> (for example) won’t change the <P>width</P> of our <Self>self element</Self>, unless the <P>padding-left</P> value is <em>greater</em> than our <Self>self element’s</Self> <P>width</P>. This is because I use the <P>border-box</P> <P>box-sizing</P> model. Unfamiliar, or need a recap? <Link to="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model">Read more on MDN.</Link></p>
      </section>

      <section>
        <h2>transform: translate</h2>

        <p>Okay! Here is where things get a bit... weird.</p>

        <p>Let’s take a look at <P>transform: translate</P>:</p>

        <Example properties="width,height,translateTop,translateLeft" />

        <p>The box moves a lot more slowly this time, right? That’s because <b><P>transform: translate</P> percentage values are based on our <P>self element’s</P> <P>width</P> and <P>height</P></b>.</p>
      </section>

      <section id="gist">
        <h2>TLDR</h2>
        <p>Let’s recap what we’ve learned:</p>

        <div className="CssPercents__recap">
          {[
            ["width", "parent’s width"],
            ["height", "parent’s height"],
            ["top", "parent’s width"],
            ["left", "parent’s width"],
            ["margin-top", "parent’s width"],
            ["margin-left", "parent’s width"],
            ["padding-top", "parent’s width"],
            ["padding-left", "parent’s width"],
            ["translate-top", "self’s width"],
            ["translate-left", "self’s height"],
          ].map(([label, value]) => (
          <div className="CssPercents__recap__row" key={label}>
            <div className="CssPercents__recap__label">{ label }</div>
            <div className="CssPercents__recap__value" style={{
              color: `var(--${value.startsWith("parent") ? "parent" : "self"})`
            }}>{ value }</div>
          </div>
          ))}
        </div>

        <p>Now let’s put what we’ve learned to the test!</p>
      </section>

      <section>
        <h2>Centering elements</h2>

        <p>How could we center an element inside its parent, no matter its own dimensions?
        </p>
        <p>Try centering our <Self>self element</Self> inside of the <Parent>parent</Parent>. Make sure it doesn’t move around when you tweak its <P>width</P> and <P>height</P>.</p>

        <Example properties="width,height,top,left,translateTop,translateLeft" forcedValues={doForceCenterExampleParams ? centerExampleForcedParams : null} />

        <Button style={{margin: "-1em 0 1em"}} onClick={onForceCenterExampleParams}>Show me!</Button>

        <p>
          See how this works? We’re moving our <Self>self</Self> element:
        </p>

        <List items={[
          <><Icon name="arrow" direction="s" style={{
            color: "var(--parent)",
            marginRight: "0.6em",
            width: "0.8em",
            marginBottom: "-0.15em",
          }} /><em>down</em> by 50% of our <Parent>parent’s</Parent> height using <P>top: 50%</P></>,
          <><Icon name="arrow" direction="e" style={{
            color: "var(--parent)",
            marginRight: "0.6em",
            width: "0.8em",
            marginBottom: "-0.15em",
          }} /><em>right</em> by 50% of our <Parent>parent’s</Parent> width using <P>left: 50%</P></>,
          <><Icon name="arrow" direction="n" style={{
            color: "var(--self)",
            marginRight: "0.6em",
            width: "0.8em",
            marginBottom: "-0.15em",
          }} /><em>up</em> by 50% of our <Self>self element’s</Self> height using <P>transform: translate (top): -50%</P></>,
          <><Icon name="arrow" direction="w" style={{
            color: "var(--self)",
            marginRight: "0.6em",
            width: "0.8em",
            marginBottom: "-0.15em",
          }} /><em>left</em> by 50% of our <Self>self element’s</Self> width using <P>transform: translate (left): -50%</P></>,
        ]} />

      </section>


      </div>

    </div>
  )
}

export default CssPercents

const centerExampleForcedParams = {
  height: 50,
  width: 50,
  top: 50,
  left: 50,
  translateTop: -50,
  translateLeft: -50,
}


const P = ({ children })=> (
  <code className="P">{ children }</code>
)
const Highlight = ({ children })=> (
  <div className="Highlight">{ children }</div>
)



const propDefaults = {
  width: 50,
  height: 50,
  marginTop: 0,
  marginLeft: 50,
  paddingTop: 0,
  paddingLeft: 50,
  top: 0,
  left: 50,
  translateTop: 0,
  translateLeft: 50,
}
const containerWidth = 600
const containerHeight = 200
const getPropMultiple = (prop, width, height) => ({
  width: containerWidth * 0.01,
  height: containerHeight * 0.01,
  marginTop: containerWidth * 0.01,
  marginLeft: containerWidth * 0.01,
  paddingTop: containerWidth * 0.01,
  paddingLeft: containerWidth * 0.01,
  top: containerWidth * 0.01,
  left: containerWidth * 0.01,
  translateTop: width * 0.01,
  translateLeft: height * 0.01,
}[prop])
const Example = ({ properties="width,height", forcedValues }) => {
  const [propValues, setPropValues] = useState({})

  const setPropValue = prop => value => {
    const newPropValues = {
      ...propValues,
      [prop]: value + "%",
    }
    setPropValues(newPropValues)
  }

  useEffect(() => {
    let newPropValues = {}
    properties.split(",").forEach(prop => {
      newPropValues[prop] = (propDefaults[prop] || 0) + "%"
    })
    setPropValues(newPropValues)
  }, [properties])

  useEffect(() => {
    console.log(forcedValues)
    if (!forcedValues) return
    const newPropValues = {...propValues}
    Object.keys(forcedValues).forEach(prop => {
      newPropValues[prop] = (forcedValues[prop] || 0) + "%"
    })
    setPropValues(newPropValues)
  }, [forcedValues])

  const getValueFromString = (str="") => str.slice && +str.slice(0, -1)

  return (
    <div className="CssPercents__example">
      <div className="CssPercents__example__main">
        <div style={{display: "flex", flexWrap: "wrap", marginBottom: "0.6em", zIndex: 10}}>
          {properties.split(",").map(prop => (
            <SliderGroup
              key={prop}
              style={{minWidth: "40%", whiteSpace: "nowrap", fontSize: "0.9em"}}
              label={lowerCase(prop)}
              value={getValueFromString(propValues[prop])}
              valueSuffix={`% (${Math.round(getPropMultiple(prop, getValueFromString(propValues["width"]), getValueFromString(propValues["height"])) * getValueFromString(propValues[prop]))}px)`}
              min={-50}
              max={150}
              step={10}
              onChange={setPropValue(prop)}
            />
          ))}
        </div>

        <div className="CssPercents__example__wrapper" style={{
          position: "relative",
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          // background: "#dadde6",
          border: "2px solid var(--parent)",
        }}>
          <div className="CssPercents__dimension CssPercents__dimension--left">200px</div>
          <div className="CssPercents__dimension CssPercents__dimension--bottom">600px</div>
          <div className="CssPercents__item" style={{
            position: "absolute",
            ...propValues,
            transform: `translate(${propValues["translateLeft"]}, ${propValues["translateTop"]})`,
            // background: "#9980FA",
            background: "var(--self)",
          }}>
          </div>
        </div>
      </div>
      <div className="CssPercents__example__code">
        <Code language="css" hasLineNumbers={false}>
{`.self ${JSON.stringify({
  position: "absolute",
  ...propValues,
  ...propValues["translateLeft"] ? {transform: `translate(${propValues["translateLeft"]}, ${propValues["translateTop"]})`} : {},
}, null, 2)
.replace(/\"/g, "")
.replace(/\,/g, ";")
.replace(/\n}/g, ";\n}")
.replace(/(Top)/g, "-top")
.replace(/(Left)/g, "-left")
}`}
        </Code>

      </div>
    </div>
  )
}


const Parent = ({ children }) => (
  <span className="Parent">
    { children }
  </span>
)
const Self = ({ children }) => (
  <span className="Self">
    { children }
  </span>
)