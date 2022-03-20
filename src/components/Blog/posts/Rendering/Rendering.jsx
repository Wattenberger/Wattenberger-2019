import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import Icon from "components/_ui/Icon/Icon"
import { Helmet } from "react-helmet"
import Code from "components/_ui/Code/Code"
import List from "components/_ui/List/List"
import Expandy from "components/_ui/Expandy/Expandy"
import ScrollEventHOC from "components/_ui/ScrollEvent/ScrollEventHOC"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import Button from "components/_ui/Button/Button"
import Aside from "components/_ui/Aside/Aside"
import { scrollTo } from "utils";
import Link from "components/_ui/Link/Link"
import { RenderingDiagram, RenderingExample, RenderingExampleSvg, RenderingSandbox } from "./RenderingExample"
import chromeDebugColors from "./chromeDebugColors.json"
import "./Rendering.scss"

import dog1a from "./dog1a.png"
import dog1b from "./dog1b.png"
import dog1c from "./dog1c.png"
import dog2a from "./dog2a.png"
import dog2b from "./dog2b.png"
import dog2c from "./dog2c.png"
import dog2d from "./dog2d.png"
import dog3a from "./dog3a.png"
import dog3b from "./dog3b.png"
import dog3c from "./dog3c.png"
import chromeDevTools from "./chromeDevTools.png"
import chromeDevToolsMenu from "./chromeDevToolsMenu.png"
import safariDevTools from "./safariDevTools.png"


const BowserContext = createContext(true);

const Rendering = () => {
  const [yesBowser, setYesBowser] = useState(true)

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


  return (
    <div className="Rendering">
      <BowserContext.Provider value={yesBowser}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Rendering CSS</title>
          <link rel="canonical" href="https://wattenberger.com/blog/rendering" />
          <meta property="og:type" content="website" />
          <meta name="description" content="" />
        </Helmet>

        <h1>
          Rendering CSS
        </h1>
        <h2>
          or, Don't Make {yesBowser ? "Bowser" : "the Browser"} Think
        </h2>

        <div className="Rendering__content">
          <p>
            How does the browser turn HTML & CSS into... <em>this</em> complex, interactive painting?
          </p>
          <p>
            Browsers split their internal tasks into <Link to="https://developer.chrome.com/blog/inside-browser-part1/#executing-program-on-process-and-thread">many processes</Link>. One type is the <strong>Renderer Process</strong>, which is responsible for converting JavaScript, HTML, and CSS into the visual web page you interact with.
          </p>

          <div className="Rendering__sidebar">
            <Aside icon="tooltip">
              This article introduces many wonderful rabbit holes. Here, we find our first one: how does the browser create these trees? Start digging in with <Link href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model">this wonderful article from Ilya Grigorik</Link> or <Link href="https://xnim.me/blog/frontend-perf-for-newbies-part-1-critical-render-path">this one from Nik Mostovoy</Link>.
              <br />
              <br />
              Also interesting is how the browser uses the CSS Cascade to choose which overlapping styles to use - <Link href="/blog/css-cascade">read more about that in this article</Link>.
            </Aside>
          </div>

          <FirstPart />

          <p>
            This is all very interesting, but today we want to focus on the next step: <strong>drawing that DOM tree</strong>.
          </p>

          <hr />

          <div className="Rendering__wider">
            <ScrollEventHOC>
              {isInView =>
              (
                <>
                  <p className="Rendering__relative Rendering__centered">
                    <span className="Rendering__highlight">
                      Okay, we're going to do something here. You might hate it.
                    </span>
                    <br />
                    Our browsers do so much for us and are so eager to please, it only<br />makes sense to <em>refer to them as an adorable dog named <strong>Bowser</strong></em>. <div
                      style={{
                        opacity: yesBowser ? 0 : 1
                      }} className="Rendering__note">Just kidding, I would never do that.</div>
                  </p>
                  <div className="Rendering__off-to-side-wrapper">
                    <div className={`Rendering__off-to-side Rendering__off-to-side--${isInView > -1 && yesBowser ? "" : "hidden"}`}>
                      <img src={dog3a} alt="" />
                    </div>
                  </div>
                </>
              )}
            </ScrollEventHOC>
          </div>

          <p>
            <Button onClick={() => {
              setYesBowser(d => !d)
            }}>
              <Icon name="asterisk" style={{ marginRight: "0.3em" }} />
              {yesBowser ? "Wow. No, don't do that." : "Okay, the browser is a dog."}
            </Button>
          </p>

          <StepIntros />

          <p>
            What a process! It's enough work for <Bowser alt="our browser" /> to do this once, but this is the web! The Wild West, where anything could happen!
          </p>
          <p>
            Any time we need to update the page, <Bowser alt="our browser" /> needs to run through these steps again. We might be triggered by...
          </p>
          <List items={[
            <>
              <strong>Javascript</strong> changing the DOM, updating the styles, or querying the DOM,
            </>,
            <>
              <strong>CSS animations</strong> changing the styles,
            </>,
            <>
              <strong>the Web Animation API</strong> changing the styles, or
            </>,
            <>
              <strong>the user</strong> resizing their browser or reorienting their device.
            </>,
          ]} />

          <div className="Rendering__sidebar">
            <Aside icon="tooltip">
              View a more comprehensive list of  <Link to="https://gist.github.com/paulirish/5d52fb081b3570c81e3a">things that force layout / reflow</Link>.
            </Aside>
          </div>

          <div className="Rendering__wider Rendering__graphics">
            {["layout", "paint", "composition"].map(layer => (
              <LayerGraphic layer={layer} key={layer} />
            ))}
          </div>

          <SectionHeading>
            Keeping things snappy
          </SectionHeading>

          <p>
            Since <Bowser alt="our browser" /> needs to run through this process to render any updates, we'll want to make sure we can do it quickly! The exact refresh rate depends on the user's software and hardware, but we generally want to aim to update our page <strong>at least 60 times per second</strong>, or <strong>under 16 ms</strong>. Anything longer and the experience will be noticeably choppy.
          </p>

          <p>
            Different CSS properties require different steps to run. And as usual, the best performance trick is to <strong>do as little as possible</strong>.
          </p>

          <p>
            For example, if we change the <P>left</P> property of an element, <Bowser alt="our browser" /> will need to re-layout its entire layer. And once elements are moved around, <Bowser alt="our browser" /> needs to run through <StepName step="paint" /> and <StepName step="composition" /> again.
          </p>

          <RenderingExample property="left" />

          <p>
            But if we, instead, move our element using the <P>transform</P> property, <Bowser alt="our browser" /> can skip both <StepName step="layout" /> and <StepName step="paint" />. <Bowser alt="Our browser" /> will only need to do <StepName step="composition" /> to re-combine the layers.
          </p>

          <RenderingExample property="transform" />


          <div className="Rendering__wide">
            <Expandy
              trigger="Don't take my word for it! Check this out in your browser's Dev Tools.">
              <h3>Google Chrome</h3>
              <p>
                In the <strong>Chrome Dev Tools</strong>, press <P>Esc</P> to open the bottom panel and select the <strong>Rendering</strong> panel from the kebab menu.
              </p>
              <div className="Rendering__double">
                <img src={chromeDevToolsMenu} alt="chrome dev tools screenshot" />
                <img src={chromeDevTools} alt="chrome dev tools menu screenshot" />
              </div>
              <p>
                In here, you can toggle <P>Paint flashing</P> to highlight <StepName step="paint" /> changes and <P>Layout Shift Regions</P> to highlight <StepName step="layout" /> changes.
              </p>
              <h3>Safari</h3>
              <p>
                In Safari dev tools, open the <strong>Layers</strong> panel and make sure the <P>paint flashing</P> paintbrush is blue (in the top right).
              </p>
              <img src={safariDevTools} alt="safari dev tools screenshot" />

              <h3>Firefox</h3>
              <p>
                I couldn't find a setting in Firefox to flash on <StepName step="layout" /> or <StepName step="paint" /> changes. Definitely <Link to="http://twitter.com/wattenberger">let me know if this exists</Link>!
              </p>
            </Expandy>
          </div>

          <hr />

          <p>
            This also allows it to bypass using the main thread (needed for both the <StepName step="layout" /> and <StepName step="paint" /> steps), since <StepName step="composition" /> happens in a separate thread.
          </p>

          <p>
            This might seem like a small improvement, but keep in mind that we're running full-tilt at 60 FPS. Every boost helps, especially when the browser is doing other computations or multiple elements are moving.
          </p>

          <Aside icon="tooltip">
            To read about the implications of switching from <P>left</P> to <P>transform</P>, check out this <Link to="/blog/css-percents">article on percents in CSS</Link>.
          </Aside>

          <p>
            Some properties, like <P>color</P>, can skip layout changes but trigger a re-paint.
          </p>

          <RenderingExample property="color" />

          <p>
            There are many, many CSS properties - here's a little sandbox to give you a sense of which ones trigger which steps (depending on the browser engine). Hint: make sure to check these out in your browser's Dev Tools!
          </p>

          <RenderingSandbox />

          <Aside icon="tooltip">
            Data pulled from <Link to="https://csstriggers.com/">CSS Triggers</Link> - check it out for a more comprehensive list of CSS properties.
          </Aside>


          <RenderingExampleSvg />

          <SectionHeading>
            Hacking new layers
          </SectionHeading>

          <p>
            If we need to change CSS properties that trigger the <StepName step="layout" /> step, we can move those elements to a new layer. This makes most sense when the element doesn't need to be re-painted, allowing the browser to skip all but the <StepName step="composition" /> step.
          </p>

          <p>
            To ask the browser to move elements to their own layer, we can use a few CSS properties:
          </p>

          <List items={[
            <>
              <strong>transform: translateZ(0)</strong> or <strong>backface-visibility: hidden</strong> are older hacks, with more browser support.
            </>,
            <>
              <strong>will-change: transform</strong> or <strong>will-change: opacity</strong> are <em>hints</em> to the browser that it can choose to ignore.
            </>,
          ]} />


          <Aside icon="tooltip">
            Read <Link to="https://surma.dev/things/forcing-layers/">this article from Surma</Link> to learn about surprising side-effects of using some of these properties, or <Link to="https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/">this Smashing Magazine article</Link> for a deeper dive.
          </Aside>

          <p>
            We're getting down into browser-performance territory here. Different browsers will handle layer creation differently, and can choose to ignore these properties. Think of these as <em>hints</em> to the browser - we wouldn't want to micromanage them!
          </p>

          <p>
            We also don't want to create <em>too many</em> layers - each layer uses GPU memory, which is a limited resources, especially on mobile devices.
          </p>

          <p>
            Another gotcha is that any other elements that overlap with the new layer will need to be moved to a new layer. So use this hack with caution and always double-check in your browser's developer tools!
          </p>

          <SectionHeading>
            That's all, folks!
          </SectionHeading>

          <p>
            That's all the learning we have for today! Hopefully, you take away from this post that:
          </p>

          <div style={{ maxWidth: "40em" }}>
            <List items={[
              <>
                the basic steps <Bowser alt="our browser" /> goes through to update the page are:
                <br />
                <div className="Rendering__label">
                  <div className="Rendering__label__text">
                    not covered
                  </div>
                  <StepName step="trigger" />
                  <StepName step="style" />
                </div>
                <StepName step="layout" />
                <StepName step="paint" />
                <StepName step="composition" />
              </>,
              <>
                for CSS properties that update often, use ones that don't require <StepName step="layout" /> or <StepName step="paint" /> (mostly <P>transform</P> & <P>opacity</P>)
              </>,
              <>
                for elements that move often but don't need to re-paint, you can promote them to their own layer
              </>,
              <>
                you already knew this, but the web is full of amazing people writing helpful articles! Go explore some of the linked rabbit holes!
              </>
            ]} />
          </div>

          <hr />

        </div>
      </BowserContext.Provider>
    </div>
  )
}

export default Rendering

const RenderingBorderColors = () => {
  return (
    <div className="RenderingBorderColors">
      {chromeDebugColors.map(({ name, items }) => (
        <div className="RenderingBorderColors__item" key={name}>
          <div className="RenderingBorderColors__item__label">
            {name}
          </div>
          <div className="RenderingBorderColors__item__colors">
            {Object.keys(items).map(key => (
              <div className="RenderingBorderColors__item__color" key={key}>
                <div className="RenderingBorderColors__item__color__swatch" style={{
                  backgroundColor: items[key]
                }} />
                {key}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const htmlString = `<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <triangle /> △
  <square /> □
  <script src="script.js" />
</body>`

const cssString = `
triangle { background: red;   }
square   { background: blue;  }
circle   { background: green; }
`
const jsString = `(function() {
  document.body.appendChild(
    document.createElement('circle')
  )
})()`

export const StepName = ({ step, isActive = true }) => (
  <span className={[
    `RenderingStep RenderingStep--${step}`,
    `RenderingStep--is-${isActive ? 'active' : 'inactive'}`,
  ].join(' ')}>
    {step}
  </span>
)

const P = ({ children }) => (
  <code className="P">{children}</code>
)


const steps = [
  "trigger", "style", "layout", "paint", "composition"
]
const RenderingFooter = ({ activeStepIndex }) => {
  return (
    <div className="RenderingFooter">
      {steps.map((step, i) => (
        <StepName key={step} step={step} isActive={i === activeStepIndex} />
      ))}
    </div>
  )
}

const SectionHeading = ({ children }) => {
  const id = useMemo(() => (
    children.toLowerCase().replace(/\s/g, '-')
  ), [children])

  return (
    <h3 id={id} className="Heading">
      <a href={`#${id}`} className="Heading__hash">#</a>
      {children}
    </h3>
  )
}

const graphicImages = [
  [{
    url: dog1c,
    position: [8, 0],
    style: { transformOrigin: "30% 70%" },
    animation: "wobble",
  }, {
    url: dog1b,
    position: [3, 0],
    style: { zIndex: 0 },
    animation: "back-and-forth",
  }, {
    url: dog1a,
    position: [8, 0],
    animation: "",
  }],
  [{
    url: dog2a,
    position: [20, 15],
    animation: "",
  }, {
    url: dog2b,
    position: [20, 15],
    style: { transformOrigin: "38% 60%" },
    animation: "wobble",
  }, {
    url: dog2c,
    position: [20, 15],
    style: { transformOrigin: "78% 85%" },
    animation: "wobble",
  }, {
    url: dog2d,
    position: [13, -1],
    animation: "",
  }],
  [{
    url: dog3a,
    position: [12, 3],
    animation: "",
  }, {
    url: dog3b,
    position: [12, 3],
    style: { transformOrigin: "60% 56%" },
    animation: "wobble",
  }, {
    url: dog3c,
    position: [12, 3],
    animation: "",
  }],
]
const layers = ["layout", "paint", "composition"]
const shapeColors = [
  "#EBD46D", "#E5D3D3", "#A0BDA1",
]
const LayerGraphic = ({ layer }) => {
  const layerIndex = layers.indexOf(layer)
  const images = graphicImages[layerIndex]

  return (
    <div className={`LayerGraphic LayerGraphic--${layer}`}>
      <div className="LayerGraphic__images">
        {images.map(({ url, animation, style, position }, i) => (
          <div
            key={i}
            className="LayerGraphic__image"
            style={{
              ...style || {},
              top: position[1] + "%",
              left: position[0] + "%",
              animationName: animation,
              backgroundImage: `url(${url})`,
              // maskImage: `url(${url})`,
              // webkitMaskImage: `url(${url})`,
              // "mask-image": `url(${url})`,
            }}
          />
        ))}

        <svg className="LayerGraphic__svg" viewBox="0 0 200 200" fill="white" stroke="#bdbdcf" strokeWidth={layerIndex < 1 ? 2 : 0} strokeLinejoin="round" strokeDasharray={layerIndex < 1 ? "10 10" : 0}>
          <rect x="60" y="131" width="100" height="65" vectorEffect="non-scaling-stroke" fill={layerIndex < 1 ? "" : shapeColors[0]} />
          <circle cx="121" cy="100" r="31" vectorEffect="non-scaling-stroke" fill={layerIndex < 1 ? "" : shapeColors[1]} style={{
            animationName: layerIndex === 0 ? "back-and-forth-svg" : "",
          }} />
          <path
            d="M125,30 l25,38 h-50 Z"
            vectorEffect="non-scaling-stroke"
            transform={layerIndex === 0 ? "translate(43,133)" : "rotate(6) translate(5,9)"}
            strokeWidth={layerIndex < 2 ? 2 : 0}
            strokeDasharray={layerIndex < 2 ? "10 10" : 0}
            style={{
              transformOrigin: "70% 10%",
              mixBlendMode: layerIndex === 2 ? "multiply" : "",
              animationName: layerIndex === 2 ? "back-and-forth-path" : "",
            }}
            fill={layerIndex < 2 ? "" : shapeColors[2]} />
        </svg>
      </div>

      <div className="LayerGraphic__label">
        {layer}
      </div>
    </div>
  )
}

const Bowser = ({ alt }) => {
  const yesBowser = useContext(BowserContext)
  if (yesBowser) return "Bowser"
  return alt
}


const allSteps = ["layout", "paint", "composition"]
const StepIntros = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  return (
    <div className="Rendering__sticky-side">
      <div className="Rendering__sticky-side__left">
        <LayerGraphic layer={allSteps[activeStepIndex]} />
      </div>

      <div className="Rendering__sticky-side__right">
        <div className="Rendering__sticky-side__right__section">
          <div className="Rendering__sticky-side__right__image">
            <LayerGraphic layer="layout" />
          </div>
          <ScrollEvent isInViewChange={isInView => {
            if (isInView !== 0) return
            setActiveStepIndex(0)
          }}>
            <StepName step="layout" isActive={true} />
            <p>
              First up, <Bowser alt="our browser" /> needs to place and size every DOM element. This involves tasks as disparate as...
            </p>
            <List items={[
              "handling many different units (px, em, rem, %, etc)",
              "jugging different layout flows (inline, block, flex, grid, etc)",
              "flowing text with proper line-breaks and sizing it correctly with font-sizes and line-heights ",
              "clipping and overflowing elements",
              "even down to calculating border widths and box-shadows",
            ]} />
            <p>
              Needless to say, this is a huge endeavor for <Bowser alt="our browser" />! This is the heavy construction step, with tectonic plates and earthquakes shaping the landscape.
            </p>
          </ScrollEvent>
        </div>
        <div className="Rendering__sticky-side__right__section">
          <div className="Rendering__sticky-side__right__image">
            <LayerGraphic layer="paint" />
          </div>
          <ScrollEvent isInViewChange={isInView => {
            if (isInView !== 0) return
            setActiveStepIndex(1)
          }}>
            <StepName step="paint" isActive={true} />
            <p>
              With the layout squared away, we get to add some color! <Bowser alt="our browser" /> needs to turn those CSS styles into pixels and paint all of the content, similar to creating textures for a 3d scene or drawing on a canvas.
            </p>
          </ScrollEvent>
        </div>
        <div className="Rendering__sticky-side__right__section">
          <div className="Rendering__sticky-side__right__image">
            <LayerGraphic layer="composition" />
          </div>
          <ScrollEvent isInViewChange={isInView => {
            if (isInView !== 0) return
            setActiveStepIndex(2)
          }}>
            <StepName step="composition" isActive={true} />
            <p>
              Here's one of the most interesting steps: <Bowser alt="our browser" /> splits our page into <strong>layers</strong>. Think of transparent slides that can be rearranged and re-ordered. <Bowser alt="Our browser" /> passes those slides to the GPU, which layers them on top of each other - either blending with or occluding the lower layers. Keeping in mind the user's viewport, <Bowser alt="our browser" /> can rasterize exactly what we see on our screens.
            </p>

            <p>
              Putting elements on separate layers allows for speedy re-renders - imagine a fixed header with a semi-transparent background. It's much faster for <Bowser alt="our browser" /> to combine the main page and header than to re-paint all of those pixels. Also note that <StepName step="composition" isActive={true} /> happens within its own thread, leaving the main thread alone.
            </p>

            <Aside icon="tooltip">
              Read more about the compositing step in <Link href="https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/">this wonderful article</Link> from Sergey Chikuyonok.
            </Aside>

          </ScrollEvent>
        </div>
      </div>
    </div>
  )
}

const FirstPart = () => {
  const [doGoOn, setDoGoOn] = useState(false)

  return (
    <p>
      The first part of the Renderer process <span className="transition-all" style={{ fontSize: doGoOn ? 0 : "1em" }} aria-hidden={!doGoOn}>
        creates the DOM with CSS styles. <Button onClick={() => setDoGoOn(true)}>Do go on</Button>
      </span>
      <span className="transition-all" style={{ fontSize: doGoOn ? "1em" : 0 }}
        aria-hidden={doGoOn}>
        involves executing JavaScript, creating a tree of DOM nodes, turning the CSS styles into a tree of CSS rules, then applying those CSS rules to the DOM nodes. <Button onClick={() => setDoGoOn(false)}>TMI, less info please.</Button>
      </span>
    </p>
  )
}