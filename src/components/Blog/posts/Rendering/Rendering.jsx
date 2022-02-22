import React, { useEffect, useMemo, useState } from "react"
import Icon from "components/_ui/Icon/Icon"
import { Helmet } from "react-helmet"
import Code from "components/_ui/Code/Code"
import List from "components/_ui/List/List"
import Aside from "components/_ui/Aside/Aside"
import { scrollTo } from "utils";
import Link from "components/_ui/Link/Link"
import "./Rendering.scss"
import { RenderingDiagram, RenderingExample, RenderingExampleSvg, RenderingSandbox } from "./RenderingExample"
import chromeDebugColors from "./chromeDebugColors.json"


const Rendering = () => {
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>The Pixel Pipeline</title>
        <link rel="canonical" href="https://wattenberger.com/blog/rendering" />
        <meta property="og:type" content="website" />
        <meta name="description" content="" />
      </Helmet>

      <h1>
        The Pixel Pipeline
      </h1>
      <h2>
        or, how your browser turns CSS styles into pixels
      </h2>

      <div className="Rendering__content">
        <p>
          You write CSS styles all the time, but how does your browser use them?
        </p>
        <p>
          Most of us take our browsers for granted. Or we <em>mostly</em> know what's going on, leaving us vulnerable to uncanny valley-type "this <em>should</em> be working, but it isn't" bugs. So if you're thinking "I know all of this already", stick with me! You might learn something new - I did!
        </p>

        <SectionHeading>
          Let's make a web page!
        </SectionHeading>

        <p>
          Let's start with an example: a website where we'll use three made-up elements: a △ triangle, a □ square, and a ○ circle.
        </p>

        <p>First, our browser fetches the HTML code:</p>

        <Code language="html" fileName="index.html" hasLineNumbers={false}>{htmlString}</Code>

        <p>
          It'll parse the HTML and create a <strong>the Document Object Model</strong> (DOM) tree. While parsing the DOM, the browser sees two blocking resources: the CSS stylesheet and the JavaScript script.
        </p>

        <div className="Rendering__side-by-side">
          <div className="Rendering__side-by-side__left">
            <Code language="js" fileName="script.js" hasLineNumbers={false}>{jsString}</Code>
            <p>
              Once these assets are loaded, the browser executes the JavaScript, which adds a new <P>{`<circle />`}</P> element to our DOM.
            </p>
          </div>

          <div className="Rendering__side-by-side__right">
            <Code language="css" fileName="style.css" hasLineNumbers={false}>{cssString}</Code>
            <p>
              Next, the browser will create <strong>the CSS Object Module</strong> (CSSOM) from the CSS styles.
            </p>
          </div>
        </div>

        <p>
          We'll combine all of these into a step we'll call <StepName step="trigger" />.
        </p>

        {/* <RenderingFooter activeStepIndex={0} /> */}

        <p>
          Next up, we need to match the styles to the DOM elements. To do this, our browser will then combine these into a third tree: <strong>the Render Tree</strong>, which will be used to generate our page. This step is called <StepName step="style" />.
        </p>

        <Aside>
          This article introduces many wonderful rabbit holes. Here, we find our first one: how does the browser create these trees? Start digging in with <Link href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model">this wonderful article from Ilya Grigorik</Link> or <Link href="https://xnim.me/blog/frontend-perf-for-newbies-part-1-critical-render-path">this one from Nik Mostovoy</Link>.
          <br />
          <br />
          Also interesting is how the browser uses the CSS Cascade to choose which overlapping styles to use - <Link href="/blog/css-cascade">read more about that in this article</Link>.
        </Aside>

        <p>
          Now that we know what we need to render, we can start to build our page.
        </p>

        <SectionHeading>
          Rendering our page
        </SectionHeading>

        <div className="Rendering__name-title">
          <StepName step="layout" />
        </div>
        <p>
          First up, we need to know <strong>where elements are positioned, and their dimensions</strong>. This is the heavy construction step, with tectonic plates and earthquakes shaping the landscape.
        </p>

        <div className="Rendering__name-title">
          <StepName step="paint" />
        </div>
        <p>
          Next, we get to add some color! We'll turn visual styles into pixels to paint our elements with, similar to creating textures in a 3D engine.
        </p>

        <div className="Rendering__name-title">
          <StepName step="composite" />
        </div>
        <p>
          Here's one of the most interesting steps: we split our page into <strong>layers</strong>. Think of transparent slides that can be rearranged and re-ordered. The GPU gets passed these slides and layers them on top of each other - either blending with or occluding the lower layers.
        </p>
        <p>
          Putting elements on separate layers allows for speedy re-renders - imagine a fixed header with a semi-transparent background. It's way faster to ask the GPU to combine the main page and header than to re-paint all of those pixels.
        </p>

        <Aside>
          Read more about the compositing step in <Link href="https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/">this wonderful article</Link> from Sergey Chikuyonok.
        </Aside>

        <p>
          And we're done! Those are the main steps in the pixel pipeline, but the web is a dynamic medium and our work is far from over.
        </p>

        <SectionHeading>
          And around again!
        </SectionHeading>

        <p>
          Remember how we called the first step <StepName step="trigger" />?
        </p>

        <p>
          Our browser runs through each of those steps to load the page, but we'll run through each of them again whenever we change the page.
        </p>


        <div className="Rendering__name-title">
          <StepName step="trigger" />
        </div>
        <p>
          This is the web! The Wild West, where anything could happen!
        </p>
        <p>
          Anytime we need to update the page, we'll run through these steps again. We might be triggered by...
        </p>
        <List items={[
          <>
            <strong>Javascript</strong> changing the DOM, updating the styles, or querying the DOM.
          </>,
          <>
            <strong>CSS animations</strong> changing the styles, or
          </>,
          <>
            <strong>the Web Animation API</strong> changing the styles.
          </>,
        ]} />

        <p style={{marginTop: "3em"}}>
          Then we'll finish our cycle:
        </p>

        <List items={[
          <>
            <StepName step="style" />  apply our CSS styles to the DOM
          </>,
          <>
            <StepName step="layout" />  position the elements
          </>,
          <>
            <StepName step="paint" />  paint the elements
          </>,
          <>
            <StepName step="composite" />  combine the layers
          </>,
        ]} />

        <SectionHeading>
          Keeping things snappy
        </SectionHeading>

        <p>
          Since we need to run through this process to render any updates, we'll want to make sure we can do it quickly! The exact refresh rate depends on the user's software and hardware, but we generally want to aim to update our page <strong>at least 60 times per second</strong>, or <strong>under 16 ms</strong>. Anything longer and the experience will be noticeably choppy.
        </p>

        <p>
          Let's focus on the last three steps: <StepName step="layout" />, <StepName step="paint" />, and <StepName step="composite" />.
        </p>

        <p>
          As usual, the best performance trick is to <strong>do as little as possible</strong>. CSS properties require different steps to run.
        </p>

        <p>
          For example, if we change the <P>left</P> property of an element, our browser will need to re-layout its entire layer. And once elements are moved around, we need to run through <StepName step="paint" /> and <StepName step="composite" /> again.
        </p>

        <RenderingExample properties={["left"]} />

        <p>
          But if we, instead, move our element using the <P>transform</P> property, our browser can skip both <StepName step="layout" /> and <StepName step="paint" />. It will only need to run <StepName step="composite" /> to re-combine the layers.
        </p>

        <RenderingExample properties={["transform"]} />

        <p>
          This might seem like a small improvement, but keep in mind that we're running full-tilt at 60 FPS. Every boost helps, especially when the browser is doing other computations or multiple elements are moving.
        </p>

        <Aside>
          To read about the implications of switching from <P>left</P> to <P>transform</P>, check out this <Link to="/blog/css-percents">article on percents in CSS</Link>.
        </Aside>

        <p>
          Some properties, like <P>color</P>, can skip layout changes but trigger a re-paint.
        </p>

        <RenderingExample properties={["color"]} />

        <p>
          There are many, many CSS properties - here's a little sandbox to give you a sense of which ones trigger which steps (depending on the browser engine):
        </p>

        <RenderingSandbox />

        <p>
          Please don't take my word for it! Check this out in your browser's developer tools.
        </p>
        {/* TODO instructions */}

        <Aside>
          Data pulled from <Link to="https://csstriggers.com/">CSS Triggers</Link> - check it out for a more comprehensive list of CSS properties.
        </Aside>


        <RenderingExampleSvg />

        <SectionHeading>
          Hacking new layers
        </SectionHeading>

        <p>
          If we need to change CSS properties that trigger the <StepName step="layout" /> step, we can move those elements to a new layer. This makes most sense when the element doesn't need to be re-painted, allowing the browser to skip all but the <StepName step="composite" /> step.
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


        <Aside>
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

<div style={{maxWidth: "40em"}}>
          <List items={[
          <>
              the basic steps our browser goes through to update the page are:
              <br />
              <StepName step="trigger" />
              <StepName step="style" />
              <StepName step="layout" />
              <StepName step="paint" />
              <StepName step="composite" />
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

      </div>
    </div>
  )
}

export default Rendering

console.log(chromeDebugColors)

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
  "trigger", "style", "layout", "paint", "composite"
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