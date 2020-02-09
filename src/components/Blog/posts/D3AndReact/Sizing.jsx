import React, { useEffect, useMemo, useRef, useState } from "react"
import {useSpring, animated} from 'react-spring'
import * as d3 from "d3"
import { format, range } from "d3"
import { identity, pickBy, times } from "lodash"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"

import { useInterval } from 'utils/utils.js';
import Aside from "components/_ui/Aside/Aside"
import Button from "components/_ui/Button/Button"
import Code from "components/_ui/Code/Code"
import Expandy from "components/_ui/Expandy/Expandy"
import Icon from "components/_ui/Icon/Icon"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"
import { P, Blockquote, CodeAndExample } from "./examples"
import { ChartAxisReactComponent } from "./Axes"

import "./Sizing.scss"

const Sizing = () => {
  const [settings, setSettings] = useState({
    width: null,
    height: null,
    marginTop: null,
    marginRight: null,
    marginBottom: null,
    marginLeft: 75,
  })

  const settingsKeysLength = Object.keys(pickBy(settings, identity)).length

  return (
    <>
      <p>
        Sizing charts can be tricky! Because we need to exactly position our data elements, we can't use our usual web development tricks that rely on responsive sizing of <P>{`<div>`}</P>s and <P>{`<spans>`}</P>.
      </p>

      <p>
        If you've read through many d3.js examples, you'll know that there's a common way of sizing charts. This is the terminology I use in <Link to="https://www.newline.co/fullstack-d3">Fullstack D3 and Data Visualization</Link>:
      </p>

      <div className="Terminology-wrapper">
        <Terminology />
        <div style={{flex: 1, paddingTop: "0.8em"}}>
          <List items={[
            <>
              <Term name="wrapper" />
              <br />
              is the extent of the chart, and the dimensions of the <P>{`<svg>`}</P> element
            </>,
            <>
            <Term name="bounds" />
            <br />
            contain the data elements, but exclude margins and legends
            </>,
            <>
            <Term name="margins" />
            <br />
            determine the padding around the <Term name="bounds" />
            </>,
          ]} />
        </div>
      </div>

      <p>
        We need to separate our <Term name="wrapper" /> and <Term name="bounds" /> boxes because we need to know their exact dimensions when building a chart with <P>{`<svg>`}</P>.
      </p>


      <CodeAndExample
        code={getSizingCode(settings)}
        markers={[
          [4 + settingsKeysLength],
          range(6 + settingsKeysLength, 11 + settingsKeysLength),
          [4 + settingsKeysLength, 15 + settingsKeysLength],
          range(18 + settingsKeysLength, 22 + settingsKeysLength),
        ]}
        fileName="ChartWithDimensions.jsx"
        example={getHighlightedMarkerProps => (
          <>
            <div className="D3AndReact__inputs__note">Try updating the <P>chartSettings</P> values:</div>
              <div className="D3AndReact__inputs" style={{marginBottom: "10px"}}>
                <div className="D3AndReact__inputs__row">
                  {["width", "height", "marginTop", "marginRight", "marginBottom", "marginLeft"].map(key => (
                    <div className="D3AndReact__inputs__item" key={key}>
                      <div className="D3AndReact__inputs__row__label" style={{width: "16em"}}>{ key }: </div>
                      {/* <input value={settings[key]} onChange={e => setSettings({...settings, [key]: +e.target.value})} type="number" /> */}

                      <Slider
                        className="D3AndReact__inputs__row__slider"
                        style={{
                          width: "6em",
                        }}
                        value={settings[key]}
                        min={key == "height" ? 100 : key == "width" ? 300 : 0}
                        max={key == "height" ? 300 : key == "width" ? 600 : 130}
                        onChange={value => setSettings({...settings, [key]: value})}
                      />

                      <Icon name="x" onClick={() => setSettings({...settings, [key]: null})} style={{flex: "0 0 1.6em", paddingLeft: "0.5em", cursor: "pointer", color: "#9980FA", opacity: Number.isFinite(settings[key]) ? 1 : 0 }} size="s" />

                      <div className="D3AndReact__inputs__row__value" style={{opacity: Number.isFinite(settings[key]) ? 1 : 0.3}}>
                        { settings[key] || "—" }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            <ChartWithDimensions
              settings={settings}
            />
            {/* <br /> */}

            <p>
              This example is a little complicated - let's walk through what's going on. The main parts to pay attention to here are where we...
            </p>

            <List className="D3AndReact__marked-list" items={[
              <div {...getHighlightedMarkerProps(0)}>
                use a custom hook to calculate the dimensions of our <Term name="wrapper" /> and <Term name="bounds" /> (more on this in a bit)
              <Aside>
                Not very familiar with React Hooks? Read more in <Link to="/blog/react-hooks">Thinking in React Hooks</Link>.
              </Aside>
              </div>,
              <div {...getHighlightedMarkerProps(1)}>
                use the <P>dms</P> object with the calculated dimensions to create an x scale
              </div>,
              <div {...getHighlightedMarkerProps(2)}>
                use the React <P>ref</P> from our custom hook to pass a <i>non-svg</i> wrapping element that <i>is the size we want our <Term name="wrapper" /> to be</i>
              </div>,
              <div {...getHighlightedMarkerProps(3)}>
                transform the main part of our chart to respect our <b>top</b> and <b>left</b> <Term name="margins" />
              </div>,
            ]} hasNumbers />

          </>
        )}
      />

      <p>
        Now that we have an idea of how we would use <Term name="wrapper" />, <Term name="bounds" />, and <Term name="margins" />, let's look at what our custom hook is doing.
      </p>

      <CodeAndExample
        code={useChartDimensionsCode}
        markers={[
          [3, 4, 5],
          [7, 8, 11, 12],
          [15, 28, 30],
          range(22, 26),
          range(33, 38),
        ]}
        fileName="useChartDimensions.js"
        example={getHighlightedMarkerProps => (
          <>
            <p>
              When we pass a settings object to our custom <P>useChartDimensions</P> hook, it will...
            </p>

            <List className="D3AndReact__marked-list" items={[
              <div {...getHighlightedMarkerProps(0)}>
                fill in missing <Term name="margins" /> with preset default values.
                <br />
                <Expandy trigger={<><P>combineChartDimensions</P> is a custom function</>} triggerExpandText={<>Expand to see what combineChartDimensions looks like</>}>
                  <Code size="s">{ combineChartDimensionsCode }</Code>
                </Expandy>
              </div>,
              <div {...getHighlightedMarkerProps(1)}>
                defer to the passed <P>height</P> and <P>width</P>, if specified in the <P>passedSettings</P>
              </div>,
              <div {...getHighlightedMarkerProps(2)}>
                use a <Link href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver"><P>ResizeObserver</P></Link> to re-calculate the dimensions when the passed element changes size
              </div>,
              <div {...getHighlightedMarkerProps(3)}>
                grab the <b>height</b> and <b>width</b> of a containing <P>{`<div>`}</P> for our <Term name="wrapper" /> dimensions
              </div>,
              <div {...getHighlightedMarkerProps(4)}>
                calculate the dimensions of our <Term name="bounds" /> (named <P>boundedHeight</P> and <P>boundedWidth</P>)
              </div>,
            ]} hasNumbers />

            <p>
              Note that any settings that we don't set are being filled in automatically. For example, we can specify a specific <P>height</P>, or let <P>useChartDimensions</P> grab the value from the wrapping element, using the React <P>ref</P>.
            </p>
          </>
        )} />

        <p>
          Hopefully this gives you an idea of how to handle chart dimensions in a responsive, easy way. Feel free to grab my custom <P>useChartDimensions</P> hook — I really enjoy having my <Term name="wrapper" />, <Term name="bounds" />, and <Term name="margins" /> calculated, with a simple one-liner.
        </p>
    </>
  )
}

export default Sizing;


const getSizingCode = settings =>
`const chartSettings = ${JSON.stringify(pickBy(settings, identity), null, 2)}
const ChartWithDimensions = () => {
  const [ref, dms] = useChartDimensions(chartSettings)

  const xScale = useMemo(() => (
    d3.scaleLinear()
    .domain([0, 100])
    .range([0, dms.boundedWidth])
  ), [dms.boundedWidth])

  return (
    <div
      className="Chart__wrapper"
      ref={ref}
      style={{ height: "200px" }}>
      <svg width={dms.width} height={dms.height}>
        <g transform={\`translate(\${[
          dms.marginLeft,
          dms.marginTop
        ].join(",")})\`}>
          <rect
            width={dms.boundedWidth}
            height={dms.boundedHeight}
            fill="lavender"
          />
          <g transform={\`translate(\${[
            0,
            dms.boundedHeight,
          ].join(",")})\`}>
            <Axis
              domain={xScale.domain()}
              range={xScale.range()}
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
`

const combineChartDimensionsCode =
`const combineChartDimensions = dimensions => {
  const parsedDimensions = {
      ...dimensions,
      marginTop: dimensions.marginTop || 10,
      marginRight: dimensions.marginRight || 10,
      marginBottom: dimensions.marginBottom || 40,
      marginLeft: dimensions.marginLeft || 75,
  }

  return {
      ...parsedDimensions,
      boundedHeight: Math.max(
        parsedDimensions.height
        - parsedDimensions.marginTop
        - parsedDimensions.marginBottom,
        0,
      ),
      boundedWidth: Math.max(
        parsedDimensions.width
        - parsedDimensions.marginLeft
        - parsedDimensions.marginRight,
        0,
      ),
  }
}`

const combineChartDimensions = dimensions => {
  const parsedDimensions = {
      ...dimensions,
      marginTop: dimensions.marginTop || 10,
      marginRight: dimensions.marginRight || 10,
      marginBottom: dimensions.marginBottom || 40,
      marginLeft: dimensions.marginLeft || 75,
  }

  return {
      ...parsedDimensions,
      boundedHeight: Math.max(
        parsedDimensions.height
        - parsedDimensions.marginTop
        - parsedDimensions.marginBottom,
        0,
      ),
      boundedWidth: Math.max(
        parsedDimensions.width
        - parsedDimensions.marginLeft
        - parsedDimensions.marginRight,
        0,
      ),
  }
}

const useChartDimensionsCode =
`const useChartDimensions = passedSettings => {
  const ref = useRef()
  const dimensions = combineChartDimensions(
    passedSettings
  )

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
      if (dimensions.width && dimensions.height)
        return [ref, dimensions]

      const element = ref.current
      const resizeObserver = new ResizeObserver(
        entries => {
          if (!Array.isArray(entries)) return
          if (!entries.length) return

          const entry = entries[0]

          if (width != entry.contentRect.width)
            setWidth(entry.contentRect.width)
          if (height != entry.contentRect.height)
            setHeight(entry.contentRect.height)
        }
      )
      resizeObserver.observe(element)

      return () => resizeObserver.unobserve(element)
  }, [])

  const newSettings = combineChartDimensions({
      ...dimensions,
      width: dimensions.width || width,
      height: dimensions.height || height,
  })

  return [ref, newSettings]
}`

const useChartDimensions = passedSettings => {
  const ref = useRef()
  const dimensions = combineChartDimensions(passedSettings)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
      if (dimensions.width && dimensions.height) return [ref, dimensions]

      const element = ref.current
      const resizeObserver = new ResizeObserver(entries => {
          if (!Array.isArray(entries)) return
          if (!entries.length) return

          const entry = entries[0]

          if (width != entry.contentRect.width) setWidth(entry.contentRect.width)
          if (height != entry.contentRect.height) setHeight(entry.contentRect.height)
      })
      resizeObserver.observe(element)

      return () => resizeObserver.unobserve(element)
  }, [])

  const newSettings = combineChartDimensions({
      ...dimensions,
      width: dimensions.width || width,
      height: dimensions.height || height,
  })

  return [ref, newSettings]
}

const ChartWithDimensions = ({ settings }) => {
  const [ref, dms] = useChartDimensions(settings)

  const xScale = useMemo(() => (
    d3.scaleLinear()
    .domain([0, 100])
    .range([0, dms.boundedWidth])
  ), [dms.boundedWidth])

  return (
    <div className="Chart__wrapper" ref={ref} style={{
      height: "200px",
    }}>
      <svg width={dms.width} height={dms.height} style={{
        background: "#E9ECF1",
      }}>
        <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>
          <rect
            width={dms.boundedWidth}
            height={dms.boundedHeight}
            fill="rgba(153, 128, 250, 0.3)"
          />
          <g transform={`translate(0, ${dms.boundedHeight})`}>
            <ChartAxisReactComponent
              domain={xScale.domain()}
              range={xScale.range()}
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

const Terminology = () => (
  <div className="Terminology">
    <div className="Terminology__bounds" />
    {["top", "right", "bottom", "left"].map(side => (
      <div className={`Terminology__margin Terminology__margin--${side}`} key={side}>
        <div className="Terminology__margin__text">
          { side }
        </div>
      </div>
    ))}
  </div>
)

const Term = ({ name="wrapper" }) => (
  <b className={`Term Term--name-${name}`}>
    { name }
  </b>
)

