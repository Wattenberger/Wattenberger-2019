import React, { memo, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { isFinite, times } from "lodash"
import Icon from "components/_ui/Icon/Icon"
import Aside from "components/_ui/Aside/Aside"
import List from "components/_ui/List/List"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import Code from "components/_ui/Code/Code"
import { steps } from "./constants"
import { scrollTo } from "utils";

import metaImage from "./../css-cascade.png"
// import plantsImage from "./images/plants.png"
import rocksImage from "./images/rocks.png"
import fishImage from "./images/fish.png"
import cloud1Image from "./images/cloud1.png"
import cloud2Image from "./images/cloud2.png"
import birdsImage from "./images/birds.png"
import raftImage from "./images/raft.png"
import flower1Image from "./images/flower1.png"
import flower2Image from "./images/flower2.png"
import flower3Image from "./images/flower3.png"
import leaf1Image from "./images/leaf1.png"
import leaf2Image from "./images/leaf2.png"
import leaf3Image from "./images/leaf3.png"
import leaf4Image from "./images/leaf4.png"
import leaf5Image from "./images/leaf5.png"
import leaf6Image from "./images/leaf6.png"
import leaf7Image from "./images/leaf7.png"
import leaf8Image from "./images/leaf8.png"

import "./CssCascade.scss"

const CssCascade = () => {
  const [activeLevel, setActiveLevel] = useState(null)

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
    <div className="CssCascade">
      <Helmet>
          <meta charSet="utf-8" />
          <title>The CSS Cascade</title>
          <link rel="canonical" href="https://wattenberger.com/blog/css-cascade" />
          <meta property="og:type" content="website" />
          <meta name="description" content="<p>We style our websites using CSS, which stands for Cascading Style Sheets, but what does Cascading really mean? To save ourselves from future angst, let's take a step back and learn this thing for real." />
          <meta name="image" content={metaImage} />
      </Helmet>


      <CssCascadeSteps {...{ activeLevel, setHeaderHashLocal }} />

      <div className="CssCascade__content">

        <ScrollEvent
          hasIndicator={false}
          isInViewChange={d => {
            if (d > 0) return
            setActiveLevel(null)
          }}
          // hasIndicator={false}
        >
          <h1>The CSS Cascade</h1>

          <h3>Or, How browsers resolve competing CSS styles</h3>

          <p>We style our websites using CSS, which stands for <b>Cascading Style Sheets</b>.
          <br />
          But what does <b>Cascading</b> really mean?</p>

          <p>The CSS Cascade is one of the most powerful parts of CSS. But it can also be very frustrating, if not well understood. Anyone who's worked on a large enough website has complained <b>"Why won't this CSS property work?!"</b> And we've all been tempted to throw an <P>!important</P> to strong-arm things into place.</p>

          {/* <Blockquote source="All of us, probably">Why won't this CSS property work?!</Blockquote> */}

          {/* <p>And we've all been tempted to throw an <P>!important</P> to strong-arm things into place.</p> */}

          <p>To save ourselves from future angst, let's take a step back and learn this thing for real.</p>

          <Highlight>
            The <b>CSS Cascade</b> is the way our browsers resolve competing CSS declarations.
          </Highlight>

          <p>
            Every time we write a CSS declaration (or rule), it will enter the CSS Cascade, which will determine whether or not it will end up as the final style. The further down the cascade a declaration falls, the <i>less likely</i> it will end up as the final style.
          </p>

          <p>
            Let's take a look at the different tiers of the Cascade.
          </p>
        </ScrollEvent>

        <ScrollEvent
          hasIndicator={false}
          isInViewChange={d => {
            if (d != 0) return
            setActiveLevel([0])
          }}
          // hasIndicator={false}
        >
          <h2 id="importance">
            <div className="CssCascade__header-number" onClick={setHeaderHashLocal("importance")}>1.</div>
            Importance
          </h2>

          <p>
            The first tier of the Cascade looks at the <i>type</i> of rule we're looking at.
          </p>
          <p>
            There are four basic <i>types</i> of rules:

            <List className="CssCascade__hover-list" items={[
              <div onMouseEnter={() => setActiveLevel([0, 0])} onMouseLeave={() => setActiveLevel([0])}>
                <b>transition</b>
                <br />
                Rules that apply to an <i>active transition</i> take the utmost importance
              </div>,
              <div onMouseEnter={() => setActiveLevel([0, 1])} onMouseLeave={() => setActiveLevel([0])}>
                <b>!important</b>
                <br />
                When we add <P>!important</P> to the end of our declaration, it jumps to this level of the Cascade. Ideally, you reserve this level for Hail Marys, which are needed to override styles from third-party libraries.
              </div>,
              <div onMouseEnter={() => setActiveLevel([0, 2])} onMouseLeave={() => setActiveLevel([0])}>
                <b>animation</b>
                <br />
                Rules that apply to an <i>active animation</i> jump up a level in the Cascade
              </div>,
              <div onMouseEnter={() => setActiveLevel([0, 3])} onMouseLeave={() => setActiveLevel([0])}>
                <b>normal</b>
                <br />
                This level is where the bulk of rules live
              </div>,
            ]} hasNumbers />
          </p>

          <p>
            As you can see, this top tier is mostly reserved to ensure our elements animate properly, and to help out desparate developers (<P>!important</P>).
          </p>

          <p>
            Let's look at how this rule plays out:
            <br />
            Which of these two rules would win?
          </p>

          <RuleFight
            rule1={
`p {
  color: sandybrown;
}`
            }
            rule2={
`p {
  color: orchid !important;
}`
            }
            rule1ActiveLevel={3}
            rule2ActiveLevel={1}
            activeTier={0}
            winningRule={2}
            answer={fight1Answer}
            {...{setActiveLevel}}
          />

          <p>
            If two rules are <b>tied</b> on one tier of the Cascade, the fight goes on to another round, looking for a difference on the next tier.
          </p>
        </ScrollEvent>

        <ScrollEvent
          hasIndicator={false}
          isInViewChange={d => {
            if (d != 0) return
            setActiveLevel([1])
          }}
        >
          <h2 id="origin">
            <div className="CssCascade__header-number" onClick={setHeaderHashLocal("origin")}>2.</div>
            Origin
          </h2>

          <p>
            The second tier of the Cascade looks at <i>where</i> the rule was defined.
          </p>
          <p>
            There are three places where a rule can be defined:

            <List className="CssCascade__hover-list" items={[
              <div onMouseEnter={() => setActiveLevel([1, 0])} onMouseLeave={() => setActiveLevel([1])}>
                <b>website</b>
                <br />
                This is the only level that you have control over, as a web developer.
              </div>,
              <div onMouseEnter={() => setActiveLevel([1, 1])} onMouseLeave={() => setActiveLevel([1])}>
                <b>user</b>
                <br />

              </div>,
              <div onMouseEnter={() => setActiveLevel([1, 2])} onMouseLeave={() => setActiveLevel([1])}>
                <b>browser</b>
                <br />
                Each browser has its own set of styles, which is why things like <P>{`<button>`}</P>s have default styles.
                <br />
                <button style={{all: "revert"}}>This is your browser's default button</button>
              </div>,
            ]} hasNumbers />
          </p>

          <Aside icon="tooltip">
            Funky fact alert! The hierarchy here is actually <i>reversed</i> for <P>!important</P> rules, meaning that an <P>!important</P> <b>browser default</b> rule wins over an <P>!important</P> <b>website</b> rule (whereas a <b>website</b> rule normally wins over a <b>browser default</b>).
          </Aside>

          <p>
            Fight time! Which of these two rules would win?
          </p>

          <RuleFight
            rule1={
`p {
  color: sandybrown;
}`
            }
            rule2={
`p {
  color: orchid;
}`
            }
            rule1FileName="website-stylesheet.css"
            rule2FileName="Browser default"
            rule1ActiveLevel={0}
            rule2ActiveLevel={2}
            activeTier={1}
            {...{setActiveLevel}}
            winningRule={1}
            answer={fight2Answer}
          />
        </ScrollEvent>

        <ScrollEvent
          hasIndicator={false}
          isInViewChange={d => {
            if (d != 0) return
            setActiveLevel([2])
          }}
        >
          <h2 id="specificity">
            <div className="CssCascade__header-number" onClick={setHeaderHashLocal("specificity")}>3.</div>
            Specificity
          </h2>

          <p>
            The third tier of the Cascade looks at the <i>Specificity</i> of a rule.
          </p>

          <p>
            There are four levels of selectors:

            <List className="CssCascade__hover-list" items={[
              <div onMouseEnter={() => setActiveLevel([2, 0])} onMouseLeave={() => setActiveLevel([2])}>
                <b>inline</b>
                <br />
                Styles declared within a <P>style</P> HTML property are the <i>most specific</i>
              </div>
            ]}
              hasNumbers
            />
            <p>
              When we create a CSS declaration, we can target specific elements using <b>selectors</b>.
          </p>
            <List className="CssCascade__hover-list" items={[
              null,
              <div onMouseEnter={() => setActiveLevel([2, 1])} onMouseLeave={() => setActiveLevel([2])}>
                <b>id</b>
                <br />
                We can target elements based on their <P>id</P>, using the syntax <P>#id</P>
              </div>,
              <div onMouseEnter={() => setActiveLevel([2, 2])} onMouseLeave={() => setActiveLevel([2])}>
                <b>class | attribute | pseudo-class</b>
                <br />
                We can target elements based on their <P>class</P>, using the syntax <P>.class</P>
                <br />
                This level also includes <b>attribute selectors</b> that target HTML attributes, like <P>[checked]</P> and <P>[href="https://wattenberger.com"]</P>
                <br />
                This level also includes <b>pseudo-selectors</b>, like <P>:hover</P> and <P>:first-of-type</P>
              </div>,
              <div onMouseEnter={() => setActiveLevel([2, 3])} onMouseLeave={() => setActiveLevel([2])}>
                <b>type | pseudo-element</b>
                <br />
                We can target elements based on their <b>tag type</b>, using the syntax <P>type</P>
                <br />
                This level also includes <b>pseudo-elements</b>, like <P>:before</P> and <P>:selection</P>
              </div>,
            ]} hasNumbers />
          </p>

          <p>
            Fight time! Which of these two rules would win?
          </p>

          <RuleFight
            rule1={
`<p style="color: sandybrown">...</p>`
            }
            rule2={
`p {
  color: orchid;
}`
            }
            rule1FileName="*.html"
            rule2FileName="*.css"
            rule1ActiveLevel={0}
            rule2ActiveLevel={3}
            rule1Language="html"
            activeTier={2}
            {...{setActiveLevel}}
            winningRule={1}
            answer={fight3Answer}
          />

          <br />
          <br />
          <p>
            What about these two rules?
          </p>

          <RuleFight
            rule1={
`.paragraph {
  color: sandybrown;
}`
            }
            rule2={
`#paragraph {
  color: orchid;
}`
            }
            rule1ActiveLevel={2}
            rule2ActiveLevel={1}
            activeTier={2}
            {...{setActiveLevel}}
            winningRule={2}
            answer={fight4Answer}
          />

          <br />
          <br />

          <p>
            One thing to note about levels on this tier is that <b>the number of hits on the highest-reached level matter</b>.
          </p>

          <RuleFight
            rule1={
`.paragraph {
  color: sandybrown;
}`
            }
            rule2={
`p.paragraph {
  color: orchid;
}`
            }
            rule1ActiveLevel={2}
            rule2ActiveLevel={2}
            activeTier={2}
            {...{setActiveLevel}}
            winningRule={1}
            answer={fight5Answer}
          />

          <br />
          <br />
          <p>
            Additionally, on this tier of the Cascade, <b>ties can be broken within this tier</b>. This means that, if two rules have the same number of hits on the <b>third level</b>, one can win by having a hit on the <b>fourth level</b>.
          </p>

          <RuleFight
            rule1={
`.paragraph:first-of-type {
  color: sandybrown;
}`
            }
            rule2={
`.paragraph {
  color: orchid;
}`
            }
            rule1ActiveLevel={2}
            rule2ActiveLevel={2}
            activeTier={2}
            {...{setActiveLevel}}
            winningRule={2}
            answer={fight6Answer}
          />
        </ScrollEvent>

        <ScrollEvent
          hasIndicator={false}
          isInViewChange={d => {
            if (d != 0) return
            setActiveLevel([3])
          }}
        >
          <h2 id="position">
            <div className="CssCascade__header-number" onClick={setHeaderHashLocal("position")}>4.</div>
            Position
          </h2>

          <p>
            And lastly, we descend to the fourth, and final, tier of the Cascade, which looks at <i>the order</i> that the rules were defined in.
          </p>

          <p>
            Rules that are defined later in linked stylesheets or <P>{`<style>`}</P> tags will win, given that everything else in the Cascade is the same.
          </p>

          <RuleFight
            rule1={
`p {
  color: sandybrown;
  color: orchid;
}`
            }
            rule2={
`p {
  color: sandybrown;
  color: orchid;
}`
            }
            rule1ActiveLevel={2}
            rule2ActiveLevel={1}
            rule1HighlightedLines={[2]}
            rule2HighlightedLines={[3]}
            activeTier={3}
            {...{setActiveLevel}}
            winningRule={2}
          />
        </ScrollEvent>

        <ScrollEvent
          hasIndicator={false}
          isInViewChange={d => {
            if (d < 0) return
            setActiveLevel([4])
          }}
        >
          <h2>That's it!</h2>

          <p>
            Hopefully, this helps clear up some confusion about styles are prioritized!
          </p>

          <p>
            Next time you find yourself reaching for the big, red <P>!important</P> button, take a step back and look at where competing styles fall on the Cascading waterfall.
          </p>
        </ScrollEvent>

      </div>

    </div>
  )
}

export default CssCascade


const P = ({ children })=> (
  <code className="P">{ children }</code>
)
const Highlight = ({ children })=> (
  <div className="Highlight">{ children }</div>
)


const fight1Answer = (
  <div>
    Remember that <P>!important</P> declarations fall on the second level, while normal declarations fall on the fourth level.
  </div>
)
const fight2Answer = (
  <div>
    Remember that <b>website</b>-specific declarations fall on the first level, while browser defaults fall on the third level.
  </div>
)
const fight3Answer = (
  <div>
    Remember that <b>inline</b> styles fall on the first level, while <b>type</b> rules fall on the fourth level.
  </div>
)
const fight4Answer = (
  <div>
    Remember that rules with a <b>class</b> selector fall on the third level, while rules with an <b>id</b> selector fall on the third level.
  </div>
)
const fight5Answer = (
  <div>
    <b>Rule A</b> has two "hits" on the <b>third level</b> (1 <b>class</b> and 1 <b>pseudo-class</b>).
  </div>
)
const fight6Answer = (
  <div>
    <b>Rules A and B</b> both have 1 hit on the <b>third level</b> (1 <b>class</b>), but <b>Rule B</b> additionally has 1 hit on the <b>fourth level</b> (1 <b>tag</b>).
  </div>
)

const CssCascadeSteps = ({ activeLevel, setHeaderHashLocal }) => {

  return (
    <div id="waterfall" className="CssCascadeSteps">
      <h6 className="CssCascadeSteps__name">
        The Css Cascade
      </h6>
      {/* <CssCascadeWaterfall /> */}

      <CssCascadeRaft {...{ activeLevel }} />
      <CssCascadeStreamStraight />

      <CssCascadeImages />

      <div className="CssCascadeSteps__steps">
        {steps.map(({ name, substeps=[] }, stepI) => (
          <div id={`CssCascadeSteps__step--${stepI}`} className={`CssCascadeSteps__item CssCascadeSteps__item--is-${ activeLevel && activeLevel[0] == stepI ? "active" : "normal"}`} key={name}>
            <CssCascadeCrash size="s" index={stepI} />
            <CssCascadeStream />
            <div className="CssCascadeSteps__item__name" onClick={setHeaderHashLocal(name.toLowerCase())}>
              { name }
            </div>
            <div className="CssCascadeSteps__item__steps">
              {substeps.map(({ name }, i) => (
                <CssCascadeStepsLevel
                  key={name}
                  {...{ stepI, i, name }}
                  isActive={activeLevel && activeLevel[0] == stepI && activeLevel[1] == i}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <CssCascadeCrash />

      <div className="CssCascadeSteps__rocks"></div>
    </div>
  )
}


const CssCascadeImages = memo(() => (
  <>
      <img src={fishImage} className="CssCascadeSteps__image CssCascadeSteps__image--fish" />
      <img src={cloud1Image} className="CssCascadeSteps__image CssCascadeSteps__image--cloud1" />
      <img src={cloud2Image} className="CssCascadeSteps__image CssCascadeSteps__image--cloud2" />
      <img src={rocksImage} className="CssCascadeSteps__image CssCascadeSteps__image--rocks" />
      <img src={rocksImage} className="CssCascadeSteps__image CssCascadeSteps__image--rocks2" />
      <img src={birdsImage} className="CssCascadeSteps__image CssCascadeSteps__image--birds" />
      <img src={leaf1Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf1" />
      <img src={leaf2Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf2" />
      <img src={leaf3Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf3" />
      <img src={leaf4Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf4" />
      <img src={leaf5Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf5" />
      <img src={leaf6Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf6" />
      <img src={leaf7Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf7" />
      <img src={leaf8Image} className="CssCascadeSteps__image CssCascadeSteps__image--leaf8" />
      <img src={flower1Image} className="CssCascadeSteps__image CssCascadeSteps__image--flower1" />
      <img src={flower2Image} className="CssCascadeSteps__image CssCascadeSteps__image--flower2" />
      <img src={flower3Image} className="CssCascadeSteps__image CssCascadeSteps__image--flower3" />
  </>
))


const CssCascadeStepsLevel = memo(({ stepI, i, name, isActive })=> (
  <div id={`CssCascadeSteps__step--${stepI}-${i}`} className={`CssCascadeSteps__item__step CssCascadeSteps__item__step--is-${ isActive ? "active" : "normal" }`}>
    { name }
  </div>
))


const defaultLevel = [0]
const CssCascadeRaft = ({ activeLevel }) => {
  const [iteration, setIteration] = useState(0)

  const raftPosition = useMemo(() => {
    const raftTier = activeLevel || defaultLevel

    const id = raftTier[0] == 4
      ? "CssCascadeSteps__step--3-2"
      : `CssCascadeSteps__step--${raftTier.join("-")}`
    const sectionElement = document.querySelector(`#${id}`)
    const waterfallElem = document.querySelector(`#waterfall`)
    if (!sectionElement) return [23, 0]

    const elementPosition = sectionElement.getBoundingClientRect()
    const waterfallPosition = waterfallElem.getBoundingClientRect()

    setIteration(iteration + 1)

    return [
      elementPosition.left,
      elementPosition.top
        - (isFinite(raftTier[1]) ? 33 : 0)
        + (raftTier[0] == 4 ? 50 : 0)
        - waterfallPosition.top
    ]
  }, [activeLevel])

  return (
    <div
      className={`CssCascadeRaft CssCascadeRaft--iteration-${iteration % 2}`}
      style={{
        transform: `translate(${ raftPosition[0] }px, ${ raftPosition[1] }px)`
      }}>
      <img className="CssCascadeRaft__img" src={raftImage} />
    </div>
  )
}


const bubbles = times(6)
const CssCascadeCrash = memo(({ size="l", index=0 }) => (
  <div className={`CssCascadeCrash CssCascadeCrash--size-${size} CssCascadeCrash--index-${index}`}>
    {bubbles.map(i => (
      <div className="CssCascadeCrash__bubble" key={i} />
    ))}
  </div>
))


const CssCascadeStreamD = [
  "M 0 0",
  "Q 2 0 2 1",
  "L 2 10",
].join(" ")
const numberOfStreams = 8
const streams = times(numberOfStreams)
const CssCascadeStream = memo(() => (
  <svg
    className="CssCascadeStream"
    viewBox={`0 0 ${numberOfStreams * 3} 10`}
    preserveAspectRatio="none">

    {streams.map(i => (
      <path key={i} d={CssCascadeStreamD} transform={`translate(${i * 3}, 0)`} />
    ))}
  </svg>
))

const CssCascadeStreamStraightD = [
  "M 0 0",
  "L 0 10",
].join(" ")
const CssCascadeStreamStraight = memo(() => (
  <svg
    className="CssCascadeStream CssCascadeStreamStraight"
    viewBox={`0 0 ${numberOfStreams * 3} 10`}
    preserveAspectRatio="none">

    {streams.map(i => (
      <path key={i} d={CssCascadeStreamStraightD} transform={`translate(${i * 3}, 0)`} />
    ))}
  </svg>
))


const levelXBuffer = 6
const levelYBuffer = 60
const stepHeight = 20
const stepWidth = 10
const flowWidth = 160
// const stepLevelIndices = flatten(
//   steps.map(({ substeps=[] }, i) => (
//     times(substeps.length, () => i)
//   ))
// )
// console.log(stepLevelIndices)
// const CssCascadeWaterfall = () => {
//   const width = flowWidth
//     + stepLevelIndices.length * stepWidth
//     + (steps.length + 1) * levelXBuffer
//     + 20

//   const height = 0
//     + stepLevelIndices.length * stepHeight
//     + (steps.length + 1) * levelYBuffer

//   const areaString = area()
//     .x0((step, i) => (
//         i * stepWidth + ((step + 0.5) * levelXBuffer * 2)
//     ))
//     .x1((step, i) => (
//         i * stepWidth + ((step + 0.5) * levelXBuffer * 2) + flowWidth
//     ))
//     .y((step, i) => (
//         i * stepHeight + ((step + 0.5) * levelYBuffer * 2)
//     ))
//     .curve(curveStepAfter)
//     // .curve(curveCatmullRom.alpha(0))
//     ([-1, ...stepLevelIndices, steps.length])

//   return (
//     <svg className="CssCascadeWaterfall" {...{width, height}}>
//       <path
//         className="CssCascadeWaterfall__flow"
//         d={areaString}
//       />

//       {/* {stepLevelIndices.map((step, i) => (
//         <rect
//           key={i}
//           x={i * stepWidth + ((step + 1.25) * levelXBuffer * 2)}
//           width={flowWidth}
//           y={i * stepHeight + ((step + 0.5) * levelYBuffer * 2)}
//           height={stepHeight}
//         />
//       ))} */}
//     </svg>
//   )
// }



const RuleFight = memo(({ rule1, rule2, rule1FileName, rule2FileName, rule1Language="css", rule2Language="css", rule1HighlightedLines, rule2HighlightedLines, rule1ActiveLevel, rule2ActiveLevel, activeTier, setActiveLevel, answer, winningRule }) => {
  const [votedAnswer, setVotedAnswer] = useState()

  const hasGuessed = !!votedAnswer
  const isCorrect = votedAnswer == winningRule

  const onVote = ruleNumber => () => {
    setVotedAnswer(ruleNumber)
  }

  return (
    <div className="RuleFight">
      <div className="RuleFight__rules">
        <div className={`RuleFight__rule RuleFight__rule--is-${votedAnswer == 1 ? "guessed" : "normal"}`}>
          <div className="RuleFight__rule__name">
            A
          </div>
          <Code
            fileName={rule1FileName}
            onMouseEnter={() => setActiveLevel([activeTier, rule1ActiveLevel])}
            onMouseLeave={() => setActiveLevel([activeTier])}
            onClick={onVote(1)}
            hasLineNumbers={false}
            language={rule1Language}
            highlightedLines={rule1HighlightedLines}>
            { rule1 }
          </Code>
        </div>
        {rule2 && (
          <div className={`RuleFight__rule RuleFight__rule--is-${votedAnswer == 2 ? "guessed" : "normal"}`}>
            <div className="RuleFight__rule__name">
              B
            </div>
            <Code
              fileName={rule2FileName}
              onMouseEnter={() => setActiveLevel([activeTier, rule2ActiveLevel])}
              onMouseLeave={() => setActiveLevel([activeTier])}
              onClick={onVote(2)}
              hasLineNumbers={false}
              language={rule2Language}
              highlightedLines={rule2HighlightedLines}
              theme="light">
              { rule2 }
            </Code>
          </div>
        )}
        <div className="RuleFight__rules__vs">
          vs
        </div>
      </div>

      <div className={`RuleFight__answer RuleFight__answer--winner-${winningRule}`}>
        <div className="RuleFight__answer__heading">
          Answer
        </div>
        {votedAnswer && votedAnswer != -1 && (
          <div className={`RuleFight__answer__status RuleFight__answer__status--is-${isCorrect ? "correct" : "wrong"}`}>
            <Icon name={isCorrect ? "check" : "x"} />
          </div>
        )}
        <div className="RuleFight__answer__text">
          {!hasGuessed && (
            <div className="RuleFight__answer__mystery" onClick={onVote(-1)}>
              <div className="RuleFight__answer__mystery__icons">
                <Icon className="RuleFight__answer__mystery__icon" name="question" />
                <Icon className="RuleFight__answer__mystery__icon" name="question" />
                <Icon className="RuleFight__answer__mystery__icon" name="question" />
              </div>
              Show me the answer!
            </div>
          )}
          <div className={`RuleFight__answer__text__main RuleFight__answer__text__main--is-${hasGuessed ? "visible" : "hidden"}`}>
            <div>
              <b>Rule { winningRule == 1 ? "A" : "B" }</b> wins!
            </div>
            <div className="RuleFight__answer__text__note">
              { answer }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})