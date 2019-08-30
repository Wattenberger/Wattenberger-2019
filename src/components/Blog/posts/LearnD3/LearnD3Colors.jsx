import React, { useMemo, createRef, useRef, useState } from "react"
import { Twemoji } from "react-emoji-render"
import { uniqueId } from "lodash"
import * as d3 from "d3"
import * as d3Color from "d3-color"
import * as d3Hsv from "d3-hsv"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, ReadMore, P } from "./LearnD3"
import bookImage from "images/book.png";
import modules from "./modules.json"
import { Gradient, Scheme } from "./D3Modules"
const colorScales = modules.find(d => d.repo == "d3-scale-chromatic").items
console.log(colorScales)

const numberOfDataPoints = 4
const LearnD3Colors = ({ onScrollToSectionLocal }) => {

    return (
        <div className="LearnD3Colors">
            <p>
                Color is an important concept in data visualization - especially if a color scale is being used to represent a metric in your dataset. But there are no native methods for manipulating colors.
            </p>

            {/* <Code size="s" fileName="data.json">
            </Code> */}


            <h3>d3-color</h3>

            <p>
                Here to save the day is <DocsLink repo="color" />! To start, pass any valid <Link href="https://www.w3.org/TR/css-color-3/#colorunits">CSS color string</Link> to <DocsLink repo="color" id="color" />. Valid inputs include:
            </p>

            <List items={[
                <><Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords"><b>color keywords</b></Link>
                <p>
                    there are currently 148 CSS color keywords, including <Color color="cornflowerblue" />, <Color color="lavender" />, and <Color color="turquoise" />.
                </p>
                <Aside>
                    Here is my favorite <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#colors_table">list of keywords</Link>
                </Aside>

                <p>
                    There are two extra special values:
                    <br />
                    <b>transparent</b>, which specifies no color, and
                    <br />
                    <b>currentColor</b>, which inherits the CSS <P>color</P> property.
                </p>
                </>,
                <>
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors"><b>RGB colors</b></Link>
                    <p>
                        <b>RGB</b> stands for <b>Red</b>, <b>Green</b>, <b>Blue</b>, and can be declared in a few different ways:
                        <List items={[
                            <><span style={{display: "inline-block", width: "11em"}}><b>HEX value</b></span> <Color color="#FFC312" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>HEX value with alpha</b></span> <Color color="#FFC31255" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>RGB value</b></span> <Color color="rgb(255, 195, 18)" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>RGB value, spaces</b></span> <Color color="rgb(255 195 18 / 0.5)" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>RGB value with %</b></span> <Color color="rgb(100%, 76%, 7%)" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>RGBA value</b></span> <Color color="rgba(255, 195, 18, 0.5)" /></>,
                        ]} />
                    </p>
                </>,
                <>
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#HSL_colors"><b>HSL colors</b></Link>
                    <p>
                        <b>HSL</b> stands for <b>Hue</b>, <b>Saturation</b>, <b>Lightness</b>, and can be declared in a few different ways:
                        <List items={[
                            <><span style={{display: "inline-block", width: "11em"}}><b>HSL value</b></span> <Color color="hsl(45, 100%, 54%)" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>HSL value with alpha</b></span> <Color color="hsl(45, 100%, 54%, 0.5)" /></>,
                            <><span style={{display: "inline-block", width: "11em"}}><b>HSL value, spaces</b></span> <Color color="hsl(45 100% 54% / 1)" /></>,
                        ]} />

                    </p>

                    <Aside className="LearnD3__promo">
                        <img src={bookImage} alt="book" className="LearnD3__promo__img"/>
                            <div className="LearnD3__promo__text">
                            <p>
                                Not sure about the difference between <b>rgb</b> and <b>hsl</b> variables?
                            </p>
                            Learn more about <i>color spaces</i> in the <Link href="http://fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> book.
                        </div>
                    </Aside>

                </>,
                <>
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#System_colors"><b>System Colors</b></Link>
                    <p>
                        Okay, I lied. <DocsLink repo="color" id="color" /> won’t actually process <i>any</i> CSS color values. <b>System colors</b> are valid CSS colors, but aren’t supported on all operating systems, and won’t work as inputs to <DocsLink repo="color" id="color" />.
                    </p>

                    <p>
                        If your OS supports <b>System colors</b>, you’ll be able to see <Color color="Highlight" /> and <Color color="WindowFrame" />
                    </p>
                </>,
            ]} />

            <p>
                <DocsLink repo="color" id="color" /> will create a <b>d3 color</b> in the <b>RGB</b> color space, the same as <DocsLink repo="color" id="rgb" />.
            </p>
            <P>{`d3.color("#FFC312")`}</P> => <P>{`{r: 255, g: 195, b: 18, opacity: 1}`}</P>

            <p>
                We can also create colors in other color spaces:
            </p>

            <List items={[
<>
<Link href="https://bl.ocks.org/mbostock/78d64ca7ef013b4dcf8f"><b>RGB</b></Link>
<br />
<span style={{fontSize: "0.9em"}}><P>{`d3.hsl("rgb(255,195,18)")`}</P> => <P>{`{r: 255, g: 195, b: 18, opacity: 1}`}</P></span>
<ColorSpace space="rgb" />
</>,
<>
<Link href="https://bl.ocks.org/mbostock/debaad4fcce9bcee14cf"><b>HSL</b></Link>
<br />
<span style={{fontSize: "0.9em"}}><P>{`d3.hsl("rgb(255,195,18)")`}</P> => <P>{`{h: 44.8, s: 1, l: 0.5, opacity: 1}`}</P></span>
<ColorSpace space="hsl" />
</>,
<>
<Link href="https://bl.ocks.org/mbostock/9f37cc207c0cb166921b"><b>LAB</b></Link>
<br />
<span style={{fontSize: "0.9em"}}><P>{`d3.lab("rgb(255,195,18)")`}</P> => <P>{`{l: 82.6, a: 12.8, b: 81.6, opacity: 1}`}</P></span>
<ColorSpace space="lab" />
</>,
<>
<Link href="https://bl.ocks.org/mbostock/3e115519a1b495e0bd95"><b>CIELCh<sub>ab</sub></b></Link>
<br />
<span style={{fontSize: "0.9em"}}><P>{`d3.hcl("rgb(255,195,18)")`}</P> => <P>{`{h: 81.1, c: 82.6, l: 82.6, opacity: 1}`}</P></span>
<ColorSpace space="hcl" />
</>,
<>
<Link href="https://bl.ocks.org/mbostock/ba8d75e45794c27168b5">
    <b>Cubehelix</b>
</Link>
<br />
<span style={{fontSize: "0.9em"}}><P>{`d3.cubehelix("rgb(255,195,18)")`}</P> => <P>{`{h: 43.0, s: 2.0, l: 0.8, opacity: 1}`}</P></span>
<ColorSpace space="cubehelix" />
</>,

            ]} />
            <br />

            <p>
                Once our <b>d3 color</b> is in a color space, we can modify it based on the color space dimensions. For example, we can update the <b>saturation</b> of a color in the <b>HSL</b> color space:
            </p>

            <Code>{`const color = d3.hsl("#FFC312")
color.h -= 205
const hueRotatedColor = color.toString()`}</Code>

<p>
    <Color color="#FFC312" name="color" /> => <Color color="rgb(18, 177, 255)" name="hueRotatedColor" />
</p>

            <Aside>
                Note that we can use the <DocsLink repo="color" id="color_toString">.toString()</DocsLink> method to convert our <b>d3 color</b> back into an <b>RGB CSS color string</b>. We can also output other <b>CSS colors strings</b> using <DocsLink repo="color" id="color_formatRgb">.formatRgb()</DocsLink>, <DocsLink repo="color" id="color_formatHex">.formatHex()</DocsLink>, and <DocsLink repo="color" id="color_formatHsl">.formatHsl()</DocsLink>.
            </Aside>

            We can also use the <DocsLink repo="color" id="color_brighter">.brighter()</DocsLink> or <DocsLink repo="color" id="color_darker">.darker()</DocsLink> methods to update the <b>brightness</b> of our color.

            <Code>{`const color = d3.hsl("#FFC312")
const brighterColor = color.brighter(1).toString()`}</Code>

<p>
    <Color color="#FFC312" name="color" /> => <Color color="rgb(255, 225, 135)" name="brighterColor" />
</p>

            <ReadMore id="color" />

            <h3>d3-hsv</h3>

            <p>
              <DocsLink repo="hsv" /> (not included in the core d3 bundle) adds the ability to move within the <b>HSV</b> color space. <b>HSV</b> is similar to <b>HSL</b>, but <Link href="https://en.wikipedia.org/wiki/HSL_and_HSV">uses <b>value</b> instead of <b>lightness</b></Link>.
            </p>

            <ColorSpace space="hsl" initialColor="rgb(26, 254, 250)" />
            <ColorSpace space="hsv" initialColor="rgb(26, 254, 250)" />

            <ReadMore id="hsv" />

            <h3>d3-scale-chromatic</h3>

            <p>
              If you want to represent a metric with a color scale, check out <DocsLink repo="scale-chromatic" />, which has <b>schemes</b> of discrete colors and <b>scales</b> of continuous colors.

            </p>
            <p>
              <DocsLink repo="scale-chromatic" />’s many <b>schemes</b> and <b>scales</b> can be categorized into four different use cases:
            </p>

            <h6>Categorical</h6>
            <p>
              <DocsLink repo="scale-chromatic" id="categorical">Categorical color scales</DocsLink> are good for representing <b>nominal</b> variables, where values are bucketed in a non-ordered manner.
            </p>
            <p>
              <b>For example:</b> weather conditions
            </p>
            <GradientsInCategory category="Categorical" />

            <Aside>
              Most of these color schemes are from the <Link href="http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3">Color Brewer</Link> tool.
            </Aside>

            <br />
            <h6>Sequential (Single Hue)</h6>
            <p>

              <DocsLink repo="scale-chromatic" id="sequential-single-hue">Sequential color scales with a single hue</DocsLink> are good for representing <b>ordinal</b>, <b>discrete</b>, and <b>continuous</b> metrics, where values lie on a scale between two extremes.
            </p>
            <p>
              <b>For example:</b> chance of precipitation
            </p>
            <GradientsInCategory category="Sequential (Single Hue)" />

            <br />
            <h6>Sequential (Multi-Hue)</h6>
            <p>
              <DocsLink repo="scale-chromatic" id="sequential-multi-hue">Sequential color scales with multiple hues</DocsLink> can increase the visual space of a <b>sequential</b> color scale, making different values easier for the human eye to differentiate.
            </p>
            <p>
              <b>For example:</b> chance of precipitation
            </p>
            <GradientsInCategory category="Sequential (Multi-Hue)" />

            <br />
            <h6>Diverging</h6>
            <p>
              <DocsLink repo="scale-chromatic" id="diverging">Diverging color scales</DocsLink> are good highlighting the extreme ends of the data <b>domain</b>.
            </p>
            <p>
              <b>For example:</b> hot and cold temperatures, or positive and negative numbers.
            </p>

            <GradientsInCategory category="Diverging" />
            <Aside>Some of these are <b>single-hue</b> and some are <b>multi-hue</b> scales.</Aside>

            <br />
            <h6>Cyclical</h6>
            <p>
              <DocsLink repo="scale-chromatic" id="cyclical">Cyclical color scales</DocsLink> are good for representing metrics whose values loop.
            </p>
            <p>
              <b>For example:</b> days in a year
            </p>
            <GradientsInCategory category="Cyclical" />

            <ReadMore id="scale-chromatic" />

            <h3>d3-interpolate</h3>

            <p>
              If you want to create your own custom color scale, you can use an <b>ordinal</b> or <b>sequential</b> <Link onClick={onScrollToSectionLocal("converting-between-data-domains")}>scale</Link> and use <DocsLink repo="interpolate" id="color-spaces">d3-interpolate’s color methods</DocsLink> to specify a color space to transition within.
            </p>

            <ReadMore id="interpolate" />

        </div>
    )
}

export default LearnD3Colors


const Color = ({ color, name }) => (
    <span className="Color" style={{
        background: color
    }}>
        { name || color }
    </span>
)

const colorSpaceDimensions = {
    rgb: [
        {name: "r", min: 0, max: 255},
        {name: "g", min: 0, max: 255},
        {name: "b", min: 0, max: 255},
    ],
    hsl: [
        {name: "h", min: 0, max: 360},
        {name: "s", min: 0, max: 1},
        {name: "l", min: 0, max: 1},
    ],
    hsv: [
        {name: "h", min: 0, max: 360},
        {name: "s", min: 0, max: 1},
        {name: "v", min: 0, max: 1},
    ],
    lab: [
        {name: "l", min: 0, max: 150},
        {name: "a", min: -100, max: 100},
        {name: "b", min: -100, max: 100},
    ],
    hcl: [
        {name: "h", min: 0, max: 360},
        {name: "c", min: 0, max: 100},
        {name: "l", min: 0, max: 150},
    ],
    cubehelix: [
        {name: "h", min: 0, max: 360},
        {name: "s", min: 0, max: 2},
        {name: "l", min: 0, max: 1},
    ],
}
const numberOfStops = 20
const stopOffsetIncrement = 1 / (numberOfStops - 1) * 100
const ColorSpace = ({ space="rgb", initialColor="#FFC312" }) => {
  const componentId = uniqueId()
    const dimensions = colorSpaceDimensions[space] || []
    const [color, setColor] = useState(initialColor)
    const refs = useRef([...Array(dimensions.length)].map(() => createRef()))
    const d3Function = space == "hsv" ? d3Hsv.hsv : d3Color[space]

    const parsedColor = useMemo(() => (
        d3Function(color).toString()
    ), [color])

    const onMouseMoveLocal = (dimensionIndex, getValue) =>  e => {
      if (!refs.current[dimensionIndex] || !refs.current[dimensionIndex].current) return
      const containerDimensions = refs.current[dimensionIndex].current.getBoundingClientRect()
      const yPosition = e.clientY - containerDimensions.y
      const newValue = getValue(yPosition / containerDimensions.height)
      let newColor = d3Function(color)
      newColor[dimensions[dimensionIndex].name] = newValue
      const newColorString = newColor.toString()
      newColor = d3Function(newColorString)
      const nans = dimensions.map(d => (
        Number.isFinite(newColor[d.name]) ? "" : "1"
      ))
      if (nans.join("").length) return
      setColor(newColorString)
    }

    return (
        <div className="ColorSpace">
            {dimensions.map((dimension, dimensionIndex) => {
                const id = `ColorSpace-${componentId}-${space}-${dimension.name}`
                const scale = d3.scaleLinear()
                  .domain([0, 1])
                  .range([dimension.min, dimension.max])
                const stopScale = d3.scaleLinear()
                  .domain([0, numberOfStops - 1])
                  .range([dimension.min, dimension.max])
                const value = d3Function(color)[dimension.name]
                const colorLocation = scale.invert(value)

                return (
                    <div className="ColorSpace__dimension" key={dimension.name} ref={refs.current[dimensionIndex]}>
                      <div className="ColorSpace__dimension__indicator" style={{
                        top: `${colorLocation * 100}%`
                      }} />
                      <div className="ColorSpace__dimension__label">
                        { dimension.name }
                      </div>
                      <svg
                        className="ColorSpace__dimension__svg"
                        viewBox="0 0 1 1"
                        preserveAspectRatio="none"
                        onMouseMove={onMouseMoveLocal(dimensionIndex, scale)}>
                          <defs>
                              <linearGradient id={id} gradientUnits="userSpaceOnUse" x2="0" y2="1">
                                  {new Array(numberOfStops).fill(0).map((_, i) => {
                                      // let stopColor = parsedColor.copy()
                                      let stopColor = d3Function(color)
                                      stopColor[dimension.name] = stopScale(i)
                                      return (
                                          <stop
                                            key={i}
                                            stopColor={stopColor.toString()}
                                            offset={`${stopOffsetIncrement * i}%`}
                                          />
                                      )
                                  })}
                              </linearGradient>
                          </defs>
                          <rect fill={`url(#${id})`} width="1" height="1" />
                      </svg>
                      <div className="ColorSpace__dimension__label ColorSpace__dimension__value">
                        { d3.format("0.1f")(value) }
                      </div>
                    </div>
                )
            })}


            <div className="ColorSpace__color" style={{
              background: parsedColor
            }}>

              <div className="ColorSpace__dimension__label">
                { parsedColor }
              </div>
            </div>

        </div>
    )
}


const GradientsInCategory = ({ category }) => (
  <div className="GradientsInCategory">
    {colorScales.filter(d => d.subCategory == category).map(d => {
      if (
        !d.title.startsWith("d3.interpolate")
        && !d.title.startsWith("d3.scheme")
      ) return null
      const name = d.title.split(" -")[0].split(".")[1]
      return (
        <Link href={`https://github.com/d3/d3-scale-chromatic#{${name}}`} className="GradientsInCategory__item" key={d.title}>
          {d.title.startsWith("d3.interpolate") && (
            <Gradient name={name} />
          )}
          {d.title.startsWith("d3.scheme") && (
            <Scheme
              name={name}
              numColors={d.numColors || 9}
              isSet={d.numColors}
            />
          )}
          <span className="GradientsInCategory__item__name">
            { name }
          </span>
        </Link>
      )
    })}
  </div>
)