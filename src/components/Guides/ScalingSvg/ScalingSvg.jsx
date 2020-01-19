import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { times, debounce } from "lodash"
import Slider from 'rc-slider/lib/Slider'
import "rc-slider/assets/index.css"
import P from "components/_ui/P/P"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import List from "components/_ui/List/List"
import metaImg from "components/Blog/posts/scaling-svg.png"

import "./ScalingSvg.scss"

const ScalingSvg = () => {
  return (
    <div className="ScalingSvg">
    <div className="ScalingSvg__background">
      <svg className="ScalingSvg__background__svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <pattern id="stars" width="2000" height="2000" patternUnits="userSpaceOnUse">
          {stars.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              fill="white"
            />
          ))}
        </pattern>
        <rect width="100%" height="100%" fill="url(#stars)" />
      </svg>
    </div>

      <Helmet>
          <meta charSet="utf-8" />
          <title>Scaling SVG Elements</title>
          <link rel="canonical" href="https://wattenberger.com/guide/scaling-svg" />
          <meta property="og:title" content="Scaling SVG Elements" />
          <meta property="og:type" content="article" />
          <meta name="description" content="Scaling SVG elements is simple, once you understand the viewBox attribute." />
          <meta name="og:description" content="Scaling SVG elements is simple, once you understand the viewBox attribute." />
          <meta property="og:image" content={metaImg} />
      </Helmet>

      <h1>
        Scaling SVG Elements
      </h1>

      <h2>
        Getting an understanding of viewBox
      </h2>

      <div className="ScalingSvg__content">
        <p>
          Scaling <P>{`<svg>`}</P>s can be a daunting task, since they act very differently than normal images. Instead of thinking of <P>{`<svg>`}</P>s as images, let's change our mindset:
        </p>

        <Blockquote isQuote={false}>
          The <P>{`<svg>`}</P> element is <i>a telescope into another world</i>.
        </Blockquote>

        <p>
          Much like everything inside of an <P>{`<iframe>`}</P> on another webpage, everything inside of an <P>{`<svg>`}</P> element is in another world.
        </p>

        <p>
          Our telescope defaults to a normal zoom level: one "unit" is the same as one pixel. But once we set the external <P>width</P> and <P>height</P>, we can zoom our telescope in or out. To set the zoom on our telescope, we'll use the <P>viewBox</P> property.
        </p>

        <Blockquote isQuote={false}>
          The <P>{`viewBox`}</P> attribute is our way to change the settings on our telescope.
        </Blockquote>

        <p>
          <P>viewBox</P> should be set to a string, containing four numbers separated by spaces:
        </p>

        <List items={[
          <><P>x</P> and <P>y</P> set the position of the <i>top, left</i> corner of our view box.
          <br />
          Changing these values will <b>pan</b> our view.</>,
          <><P>width</P> and <P>height</P> set the number of "units" that are visible inside of our view box.
          <br />
          Changing these values will <b>zoom</b> our view.</>,
        ]} />

        <p>
          Let's explore different telescope settings for a simple <P>svg</P> with a 10x10 pixel white grid:
        </p>
      </div>

      <TelescopeExplorable />
    </div>
  )
}

export default ScalingSvg


const viewBoxNames = ["x", "y", "width", "height"]
const viewBoxMinMax = [
  [-100, 100],
  [-100, 100],
  [0, 300],
  [0, 300],
]
const aspectRatioLevels = ["Min", "Mid", "Max"]
const aspectRatioDimensions = ["x", "y"]
const aspectRatioStates = ["none", "meet", "slice",
// "by dimension"
"xMinYMin",
"xMidYMin",
"xMaxYMin",
"xMinYMid",
"xMidYMid",
"xMaxYMid",
"xMinYMax",
"xMidYMax",
"xMaxYMax",
]
const sumOfArray = arr => arr.reduce((a,b) => b + a)
const TelescopeExplorable = () => {
  const [viewBox, setViewBox] = useState([0, 0, 100, 100])
  const [viewBoxSliderValues, setViewBoxSliderValues] = useState([0, 0, 100, 100])
  const [aspectRatio, setAspectRatio] = useState("meet")

  const viewBoxString = viewBox.join(" ")

  const debouncedSetViewBox = debounce(() => {
    setViewBox(viewBoxSliderValues)
  }, 50)

  useEffect(() => {
    debouncedSetViewBox()
  }, [viewBoxSliderValues.join(" ")])


  return (
    <div className="TelescopeExplorable">
      <div className="TelescopeExplorable__controls">
        {viewBoxSliderValues.map((d, i) => (
          <div className="TelescopeExplorable__controls__item">
            <label>{ viewBoxNames[i] }</label>
            <Slider
              key={i}
              value={d}
              min={viewBoxMinMax[i][0]}
              max={viewBoxMinMax[i][1]}
              trackStyle={[{ backgroundColor: '#FFC312' }]}
              handleStyle={[{ borderColor: '#FFC312' }]}
              onChange={newValue => setViewBoxSliderValues([
                ...viewBoxSliderValues.slice(0, i),
                newValue,
                ...viewBoxSliderValues.slice(i + 1),
              ])}
              type="number"
            />

            <div className="TelescopeExplorable__controls__item__value">
              { d }
            </div>
          </div>
        ))}

        <div className="TelescopeExplorable__controls__summary">
          viewBox: "{ viewBoxString }"
        </div>
        {/* <select
            className="TelescopeExplorable__select"
            defaultValue={aspectRatio}
            onChange={e => setAspectRatio(e.target.value)}
        >
          {aspectRatioStates.map(d => (
              <option key={d}>{ d }</option>
          ))}
        </select> */}
      </div>

      <div className="TelescopeExplorable__main">
        <div className="TelescopeExplorable__person">
          <ExplorerWithTelescope rotation={sumOfArray(viewBox)} />
        </div>

        <div className="TelescopeExplorable__telescope"></div>

        <div className="TelescopeExplorable__svg">
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--nw">
            [{ viewBox.slice(0, 2).join(", ") }]
          </div>
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--ne">
            [{ +viewBox[0] + viewBox[2] }, { viewBox[1] }]
          </div>
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--sw">
            [{ viewBox[0] }, { +viewBox[1] + viewBox[3] }]
          </div>
          <div className="TelescopeExplorable__svg__corner TelescopeExplorable__svg__corner--se">
            [{ +viewBox[0] + viewBox[2] }, { +viewBox[1] + viewBox[3] }]
          </div>
          <svg viewBox={viewBoxString}>
            <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
              </defs>

            {/* <circle cx="50" cy="50" r="40" fill="#9980FA" /> */}
            <polygon transform="scale(4.2)" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#9980FA" />
            <rect width="100" height="100" fill="none" stroke="white" />
            <text x="50" y="50" style={{textAnchor: "middle", fontSize: "10px"}}>[50, 50]</text>
            <circle cx="50" cy="50" r="1" />

            <rect x="-200" y="-200" width="600" height="600" fill="url(#grid)" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}

const randomInRange = (from, to) => Math.random()*(to-from)+from

const stars = times(500, i => ([
  randomInRange(0, 2000),
  randomInRange(0, 2000),
]))

export const ExplorerWithTelescope = ({rotation=0}) => (
  <svg width="348" height="530" viewBox="0 0 348 530" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="282.535" y="109" width="65" height="50" rx="25" fill="#0B0A27"/>
    <path d="M225.071 269.097L131 472.748" stroke="#C6D2DE" strokeWidth="9" strokeLinecap="round"/>
    <path d="M225.65 269.076L319.518 473" stroke="#C6D2DE" strokeWidth="9" strokeLinecap="round"/>
    <path d="M226.283 143.787L225.987 525" stroke="#C6D2DE" strokeWidth="9" strokeLinecap="round"/>
    <path d="M56.2623 133.49C51.6544 128.081 48.5356 121.453 49.0568 114.025C50.5583 92.625 80.3485 97.3328 86.1433 108.134C91.9382 118.935 91.2496 146.333 83.7603 148.263C80.7736 149.033 74.411 147.147 67.9354 143.244L72 172H48L56.2623 133.49Z" fill="#79392C"/>
    <path d="M88.4091 112.984C87.8669 109.791 86.4289 106.648 84.5959 104.006C82.7009 101.274 80.4276 98.8075 77.9176 96.7601C73.3328 93.0202 67.4966 90.8631 61.7574 91.5636C58.8597 91.9173 56.0468 93.0226 53.6525 94.8624C51.4894 96.5246 49.4087 98.9716 46.6077 99.1474C43.56 99.3385 40.7662 96.6485 38.322 94.9871C35.566 93.1141 32.6342 91.7493 29.4132 91.2188C24.0173 90.3304 18.9482 92.1534 15.2294 96.5805C11.2722 101.292 8.39551 108.2 10.9943 114.442C11.4773 115.603 12.0988 116.581 12.9907 117.392C13.8086 118.135 15.0579 118.926 15.3895 120.114C15.7418 121.377 14.6895 123.006 14.2815 124.145C13.6969 125.778 13.2169 127.491 13.3876 129.266C13.6679 132.18 15.4991 134.961 17.4327 136.876C19.4004 138.825 21.8222 139.943 24.4089 140.458C26.1361 140.802 27.9013 140.992 29.6567 140.863C30.5281 140.799 31.2971 140.557 32.1414 140.364C32.9625 140.177 33.4213 140.395 34.1179 140.845C37.354 142.937 40.8335 143.747 44.5701 143.436C47.7237 143.173 51.3584 142.409 53.931 140.248C56.788 137.848 66.7311 134.539 66.0588 131.004C66.7711 131.357 68.7416 131.575 67.5641 130.168C67.0976 129.611 66.2163 129.384 65.6178 129.056C64.9209 128.675 64.2132 128.181 63.6721 127.559C61.4869 125.045 63.6939 119.93 66.4404 119.087C70.5209 117.835 69.4345 123.605 72.3474 125.098C76.53 127.242 82.2837 125.694 87.5 117C89 114.5 88.5253 113.669 88.4091 112.984Z" fill="#0B0A27"/>
    <path d="M44 269L80.6308 395.227L97.8602 490H115.153L97.891 269H44Z" fill="#64211C"/>
    <path d="M27.5377 269C30.0937 334.574 29.0857 370.34 28.5136 376.298C27.9415 382.256 24.6939 422.156 2.56369 492H20.55C49.8578 424.997 60.0889 385.096 63.4503 376.298C66.8117 367.5 76.7394 331.734 91.2334 269H27.5377Z" fill="#79392C"/>
    <path d="M27.4099 269C29.9132 334.574 23.4258 399.177 3.33051 478.021H30.3168C59.6785 412.018 80.7231 347.734 95.1056 269H27.4099Z" fill="#C7C5E4"/>
    <path d="M0 505L0.992423 489C6.80292 490.699 14.0807 490.033 22.8257 487C32.2288 493.661 44.0659 498.209 58.3373 500.644L58.3373 500.644C59.4261 500.83 60.1581 501.863 59.9723 502.952C59.9603 503.023 59.9445 503.092 59.925 503.161L58.5529 508H22.8257H1.98485L0 505Z" fill="#DBDBE7"/>
    <path d="M94 505L94.9924 489C100.803 490.699 108.081 490.033 116.826 487C126.229 493.661 138.066 498.209 152.337 500.644L152.337 500.644C153.426 500.83 154.158 501.863 153.972 502.952C153.96 503.023 153.944 503.092 153.925 503.161L152.553 508H116.826H95.9848L94 505Z" fill="#DBDBE7"/>
    <path d="M43.2136 269C52.7419 312.435 69.2217 381.768 92.653 477H117.946C119.814 379.254 111.867 314.92 98.1046 269H43.2136Z" fill="#DBDBE7"/>
    <path d="M93.4142 201.7L128.124 182.69C133.896 175.836 139.583 170.512 145.185 166.72C146.897 166.005 149.89 165.573 147.091 170.542C144.291 175.51 141.57 180.863 142.996 182.394C144.423 183.924 147.979 181.786 149.681 184.329C150.815 186.025 144.739 188.704 131.453 192.365L106.232 215.458L93.4142 201.7ZM147.776 217.74L163.023 209.364C165.162 201.224 167.719 197.128 170.694 197.077C172.98 196.014 169 206.3 173.333 205.408C177.665 204.516 188.24 196.651 190.063 198.248C192.758 200.61 190.355 207.864 187.523 211.473C182.229 218.218 177.847 220.524 167.015 223.544C161.351 225.123 155.228 228.289 148.644 233.04L147.776 217.74Z" fill="#79392C"/>
    <path d="M76.5102 197.465C88.6678 197.337 104.88 194.769 122.179 183.789L128.972 198.939C117.04 210.78 100.262 220.51 85.5922 220.098C74.0314 219.773 68.1228 205.789 76.5102 197.465Z" fill="#5C66C3"/>
    <path d="M92.8804 221.761C105.787 224.98 127.431 221.184 157.812 210.373C165.348 225.964 168.831 237.078 168.263 243.717C142.2 257.331 119.863 263.401 101.459 263.802C102.044 274.721 100.715 285.112 96.2501 294.606C87.0708 314.124 33.3212 296.048 15.2489 299.606C3.93153 262.851 25.814 247.914 25.8317 224.397C25.8509 198.642 46.5305 159 49.5731 159L77.3199 159C78.8508 178.669 86.5565 200.346 92.8804 221.761Z" fill="#8478DC"/>
    <rect x="197.535" y="116" width="113" height="36" rx="18" fill="#D5DCE3"/>
    <rect x="120.535" y="124" width="89" height="20" rx="10" fill="#0B0A27"/>
    <circle cx="130.535" cy="134" r="6" fill="#F8F9FA"/>
    <g style={{transform: `translate(226px, 153px) rotate(${rotation}deg)`}}>
      <circle r="9" fill="white" />
      <line x1="5" y1="5" stroke="#0B0A27" strokeWidth="2" strokeLinecap="round" />
    </g>
    <circle cx="226" cy="284px" r="15" fill="white"/>
    <path className="swoosh" d="M182.748 130.8C176.414 123.959 165.253 118.175 163.393 108.352C161.491 98.308 169.138 85.218 164.542 75.9167C161.878 70.5259 151.75 77.3695 151.373 70.5257C151.028 64.2481 156.876 55.8804 160.476 51.1709C164.238 46.2503 169.133 42.5067 175.125 40.7643C180.262 39.2707 187.809 38.5101 192.16 42.6424C195.816 46.1152 193.303 50.6635 190.216 53.1594C180.094 61.3418 146.007 70.4073 140.061 52.4965C134.588 36.0088 147.117 14.1311 159.637 4.1095" stroke="#0B0A27" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
