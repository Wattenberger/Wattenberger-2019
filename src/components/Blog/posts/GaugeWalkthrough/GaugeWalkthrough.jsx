import React, { useEffect, useMemo, useState } from "react"
import Slider from 'rc-slider/lib/Slider';
import "rc-slider/assets/index.css"
import { useInterval } from "utils/utils.js"
import { format, area, arc, curveBasis, curveMonotoneX, curveMonotoneY, scaleLinear } from "d3"
import { times, noop } from "lodash"
import Gauge from "components/_ui/Gauge/Gauge"
import Blockquote from "components/_ui/Blockquote/Blockquote"
import List from "components/_ui/List/List"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import Code from "components/_ui/Code/Code"
import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import constructionGif from "components/_shared/construction.gif"
import { codeExamples } from "./codeBlocks"
import { Explorer, ExplorerWithTelescope } from "./svgs"

import "./GaugeWalkthrough.scss"

const GaugeWalkthrough = () => {
  const [codeIndex, setCodeIndex] = useState(0)

  useEffect(() => {
    window.scaleLinear = scaleLinear
}, [])

  const {code, Example, highlightedLines=[], removedLines=[], insertedLines=[], markers=[]} = codeExamples[codeIndex] || {}
  const [units, setUnits] = useState("units")
  const [label, setLabel] = useState("label")
  const [value, setValue] = useState(50)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)
  const [highlightedMarker, setHighlightedMarker] = useState(null)

  const getHighlightedMarkerProps = index => ({
    onMouseEnter: () => setHighlightedMarker(index),
    onMouseLeave: () => {
      setHighlightedMarker(null)
      // setHighlightedMarker(null)
    },
    // onClick: () => setHighlightedMarker(index),
    style: {
      cursor: "zoom-in",
    }
  })


  return (
    <div className="GaugeWalkthrough">

      <JourneyBackground />
      <h1>
        Creating a Gauge in React
      </h1>

      <div className="GaugeWalkthrough__content">
        <div className="GaugeWalkthrough__section">
          <div className="GaugeWalkthrough__section__left">
            <p>
              Let's embark on a journey.
              <br />
              <br />
              At the end of this journey, we'll have created a gauge component in React.js.
              <br />
              <br />
              A gauge is a simple diagram that visualizes a simple number. The shape and design is based on physical gauges, used in control panels to show the measurement of a specific metric.
              <br />
              <br />
              I like to use them in digital interfaces to show context around a number -- a user can quickly see whether a value is lower or higher than expected. However, while our goal is to create a gauge React.js component, we'll learn concepts and tricks along the way that can help to create many other things. As our good friend Ursula Le Guin puts it,
            </p>

            <Blockquote source="Ursula K. Le Guin, The Left Hand of Darkness">
            It is good to have an end to journey toward; but it is the journey that matters, in the end.
            </Blockquote>
            <p>
              On this journey, we'll defeat dragons, monsters, and the most powerful foe of all: drawing arcs in the browser.
            </p>
          </div>

          <div className="GaugeWalkthrough__section__right">
            <ReadingGauge />
          </div>
        </div>

        {/* <p>
          So why set off on this perilous journey?
        </p> */}

        <div className="GaugeWalkthrough__main">
          <div className="GaugeWalkthrough__sticky">
            <div className="GaugeWalkthrough__sticky__code">
              <Code fileName="Gauge.jsx" {...{highlightedLines, removedLines, insertedLines, markers, highlightedMarker}} doWrap={false}>
                { code }
              </Code>
            </div>
            <div className="GaugeWalkthrough__sticky__example">
              <Example
                {...{units, label, value, min, max}}
              />
              <div className="GaugeWalkthrough__sticky__metrics">
                <div className="GaugeWalkthrough__sticky__metric">
                  <div className="GaugeWalkthrough__sticky__metric__label">
                    <h6>value</h6>
                    <h6>{value}</h6>
                  </div>
                  <Slider
                    className="GaugeWalkthrough__slider"
                    {...{value, min, max}}
                    onChange={setValue}
                  />
                </div>
                <div className="GaugeWalkthrough__sticky__metric">
                  <div className="GaugeWalkthrough__sticky__metric__label">
                    <h6>min</h6>
                    <h6>{min}</h6>
                  </div>
                  <Slider
                    className="GaugeWalkthrough__slider"
                    value={min}
                    min={0}
                    max={200}
                    onChange={setMin}
                  />
                </div>
                <div className="GaugeWalkthrough__sticky__metric">
                  <div className="GaugeWalkthrough__sticky__metric__label">
                    <h6>max</h6>
                    <h6>{max}</h6>
                  </div>
                  <Slider
                    className="GaugeWalkthrough__slider"
                    value={max}
                    min={0}
                    max={200}
                    onChange={setMax}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="GaugeWalkthrough__main__text">
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(0)
            }}>
              <p>
                The beginning of our journey finds us in a <P>Gauge.jsx</P> file, with a simple functional React component.
              </p>

              <MobileCode index={0} {...{units, label, value, min, max}} />

              <p>
                Whenever we create a new <P>{`<Gauge>`}</P>, we'll be able to customize it with five <b>props</b>:
              </p>

              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  <b>value</b> is the current value. This defaults to <P>50</P>,
                </div>,<div {...getHighlightedMarkerProps(1)}>
                  <b>min</b> is the minimum value for our metric. This defaults to <P>0</P>,
                </div>,<div {...getHighlightedMarkerProps(2)}>
                  <b>max</b> is the maximum value for our metric. This defaults to <P>100</P>,
                </div>,<div {...getHighlightedMarkerProps(3)}>
                  <b>label</b>,
                </div>,<div {...getHighlightedMarkerProps(4)}>
                  <b>units</b>,
                </div>
              ]} />

              <p>
                Underneath our code, we'll show the output of our component.
              </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(1)
            }}>
              <p>
                Let's start by adding an <P>{`<svg>`}</P> component, which a nice pink border so we can see its dimensions.
              </p>

              <MobileCode index={1} {...{units, label, value, min, max}} />

            <p>
              As we can see, the default size of a <P>{`<svg>`}</P> component is 300 pixels wide by 150 pixels tall.
            </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(2)
            }}>
              <p>
                We want our gauge to be <b>9em</b> wide. This will let our gauge scale with our text, so it will never look disproportionate with the labels that we'll add later.
              </p>

              <MobileCode index={2} {...{units, label, value, min, max}} />

              <Aside>
                Unfamiliar with the unit <b>em</b>?
                <br />
                <b>em</b> is a CSS unit that scales with the <P>font-size</P>. Read more on <Link to="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#Relative_length_units">the MDN docs</Link>.
              </Aside>

              <p>
                We can think about the <P>{`<svg>`}</P> element as a <i>telescope into another world</i>. Our telescope defaults to a normal zoom level: one unit is the same as one pixel.
              </p>
              <p>
                But we can zoom our telescope in or out. To set the zoom on our telescope, we'll use the <P>viewBox</P> property.
              </p>

              <p>
                <P>viewBox</P> takes four arguments:
              </p>

              <List items={[
                <><P>x</P> and <P>y</P> set the position of the <i>top, left</i> corner of our view box. Changing these values will <i>pan</i> our view.</>,
                <><P>width</P> and <P>height</P> set the number of "units" that are visible inside of our view box. Changing these values will <i>zoom</i> our view.</>,
              ]} />

              <p>
                Let's see what different telescope settings would look like for a simple <P>svg</P> with a purple circle at <P>[50, 50]</P>, with a radius of <P>40</P>.
              </p>

              <TelescopeExplorable />

            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(3)
            }}>
              <p>
                For our gauge, let's simplify our math and focus our telescope on a simple 2 by 1 grid:
              </p>

              <Grid />

              <MobileCode index={3} {...{units, label, value, min, max}} />

              <p>
                If this doesn't make much sense yet, stay tuned and you'll start seeing the benefits very soon.
              </p>

              <p>
                Alright, let's begin the next phase of our journey:
              </p>
            </ScrollEvent>

              <h2>Drawing!</h2>


            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(4)
            }}>
              <p>
                Drawing arcs in SVG is a complex feat, but we can use our trusty weapon <Link to="https://github.com/d3/d3-shape#arcs"><P>d3.arc()</P></Link>, from the <Link to="https://github.com/d3/d3-shape"><b>d3-shape</b></Link> libary.
              </p>

              <p>
                <P>d3.arc()</P> will create an <i>arc generator</i>. We can configure our <i>arc generator</i> by calling different methods on it.
              </p>

              <ArcExample />

              <p>
                Let's look at the parameters we want to use for our arc:
              </p>


              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  our arc's radius will start at <P>0.65</P> and end at <P>1</P>, ending up <P>0.35</P> units wide
                  <Aside>
                    Remember, these aren't pixels, but <i>units</i> in our <P>{`<svg>`}</P>'s unit system
                  </Aside>
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  our arc will start at <P>-Math.PI / 2</P> (one quarter turn counterclockwise), and extend to <P>Math.PI / 2</P> (one quarter turn clockwise)
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  let's make our arc a bit friendlier, with a <b>cornerRadius</b> of <P>1</P>,
                </div>,
              ]} />

            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(5)
            }}>

              <p>
                To use our <i>arc generator</i>, we simply need to call it.
              </p>

              <p>
                Let's see what that looks like for our gauge. To start, we'll create a grey background arc, to show the full range of our gauge.
              </p>

              <MobileCode index={4} {...{units, label, value, min, max}} />

              <p>
                Great! Calling an <i>arc generator</i>, with these settings spits out a string:
              </p>

              <Code size="s" doWrap={false} hasLineNumbers={false}>
                {`"M-0.8062257748298549,-8.326672684688674e-17A0.175,0.175,0,0,1,-0.9772433634301272,-0.2121212121212122A1,1,0,0,1,0.9772433634301272,-0.21212121212121218A0.175,0.175,0,0,1,0.8062257748298549,-2.7755575615628914e-17L0.8062257748298549,-2.7755575615628914e-17A0.175,0.175,0,0,1,0.6352081862295826,-0.13787878787878788A0.65,0.65,0,0,0,-0.6352081862295826,-0.13787878787878793A0.175,0.175,0,0,1,-0.8062257748298549,-8.326672684688674e-17Z"`}
              </Code>

              <p>
                This incantation is a set of instructions that can be passed to an SVG <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path"><P>{`<path>`}</P></Link> element.
              </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(6)
            }}>
              <p>
                In our render method, let's create a new <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path"><P>{`<path>`}</P></Link> element and pass these magic words to the <P>d</P> attribute.
              </p>

              <MobileCode index={5} {...{units, label, value, min, max}} />

              <p>
                Perfect!
              </p>

                <p>
                  Note how our arc is perfectly centered in our <P>{`<svg>`}</P>. This is because <P>{`d3.arc()`}</P>, by default, centers the arc around <P>[0, 0]</P>.
                </p>

                <Grid hasArc highlightedPoints={[[0, 0]]} />

                <p>
                  If we revisit our grid figure, we can see that the <P>[0, 0]</P> point is at the <i>bottom, center</i> of the <P>viewBox</P>. This perfectly frames the top half of our arc, which is the only part that we're interested in.
                </p>
            </ScrollEvent>

            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(7)
            }}>
              <p>
                Now that we've drawn the <i>background</i> arc which represents the range of possible values, we'll want to draw the <i>filled</i> arc that shows the current value.
              </p>


              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  First, we need to know what percent of the possible values lie <i>below</i> our current value. For example, if our range was from <P>0 - 100</P>, a value of <P>50</P> would be <P>50%</P> through our possible range.
                  <br />
                  <br />
                  We'll create a <P>percentScale</P> which transforms <P>value</P>s into a <P>percent</P> (between <P>0</P> and <P>1</P>).

                  <Aside>
                    Unfamiliar with <b>scales</b>? Read up a bit more <Link to="/blog/d3#converting-data-to-the-physical-domain">in here</Link>.
                  </Aside>

                  Our <P>percentScale</P> will use a <Link to="https://github.com/d3/d3-scale#scaleLinear"><P>scaleLinear</P></Link> from <Link to="https://github.com/d3/d3-scale">d3-scale</Link>.
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  Next, we need to know what <i>angle</i> our filled arc needs to fill until. Let's create an <P>angleScale</P> that maps a <P>percent</P> into our <i>possible angles</i> (remember these values from our <P>backgroundArc</P>'s <P>innerRadius</P> and <P>outerRadius</P>?)
                  <Aside>
                    Note that we're using <P>.clamp(true)</P> to ensure that our <P>angleScale</P> will never return values outside of our specified <i>range</i>.
                  </Aside>
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  Wonderful! Now that we know the end <i>angle</i>, we can create the incantation for our <i>filled</i> arc's <P>d</P> attribute.
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  And lastly, let's summit that hill and draw our filled arc!
                </div>,
              ]} />

              <MobileCode index={5} {...{units, label, value, min, max}} />

              <p>
                Perfect! Play around with the slider to see how our <i>filled arc</i>looks with different <P>value</P>s.
              </p>

            </ScrollEvent>
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(8)
            }}>
              <h3>Adding a gradient</h3>
              <p>
                One thing you might notice when playing with our gauge's <P>value</P> is that most states feel kind of... the same.
              </p>
              <p>
                Let's reinforce <i>how far the current value is to the left of right</i> by filling our <i>filled arc</i> with a light-to-dark gradient.
              </p>

              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  First, we'll need a color scale from our lightest to our darkest color.
                  <Aside>
                    We've already seen that <Link to="https://github.com/d3/d3-scale#scaleLinear"><P>scaleLinear</P></Link> is happy to convert between numeric ranges, but it will also convert <b>colors</b> and <b>datetimes</b>!
                  </Aside>
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  Next, we need an array of color values that we want our gradient to interpolate through. To create this, we can use our <P>colorScale</P>'s <P>.ticks()</P> method to output an array of equally-spaced values across the output <i>range</i>.
                  <br />
                  <br />
                  Let's see a toy example for a simple scale that maps <P>0 - 1</P> to the <i>range</i> <P>0 - 100</P>:

            <Code canEval highlightedLines={[5]} fileName=".ticks() example">
{`const scale = scaleLinear()
  .domain([0, 1])
  .range([0, 100])

const ticks = scale.ticks()
alert(ticks)`}
            </Code>
                </div>,
              ]} />
            </ScrollEvent>
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(9)
            }}>
              <p>
                Now that we have our gradient's colors, we can apply them!
              </p>
              <p>
                On the web, we might be used to using a simple background CSS gradient, but those won't work in SVG land. Let's see what we need to do instead.
              </p>
              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  First, we'll want to create a <P>{`<defs>`}</P> (ie. definitions) element. Everything inside of a <P>{`<defs>`}</P> element <i>will not be rendered</i>, but we can reference them elsewhere. This is great for elements that need to be defined before being used.
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  Next, we'll create a <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient"><P>{`<linearGradient>`}</P></Link> element.
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  Our <P>{`<linearGradient>`}</P> won't render anything by itself, but we'll give it an <P>id</P> attribute to use as a <i>handle</i> to reference later.
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  To correctly position our gradient, we want to set its <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientUnits"><P>gradientUnits</P></Link> attribute. This attribute has two options:
                  <List items={[
                    <><P>userSpaceOnUse</P> (the default), which uses the parent <P>{`<svg>`}</P> element's coordinate system (set in its <P>viewBox</P>)</>,
                    <><P>objectBoundingBox</P>, which uses the coordinate system from the element the gradient is applied to</>,
                  ]} />
                  We'll set <P>gradientUnits</P> to <P>userSpaceOnUse</P>, which is the default, but it's nice to be explicit.
                </div>,
                <div {...getHighlightedMarkerProps(4)}>
                  Now that we know that we're working in our usual coordinate space, let's look at our grid diagram:
                  <Grid hasArc highlightedPoints={[[-1, 0], [1, 0]]} size="s" />
                  We want our gradient to stretch all the way across our arc, so we'll start at <P>[-1, 0]</P> and end at <P>[1, 0]</P>.
                </div>,
              ]} />

            </ScrollEvent>
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(10)
            }}>

              <p>
                Next, we'll need to create gradient <i>stops</i>, which tell the gradient where each color should fall. The gradient itself will do the hard work of blending between each of these colors.
              </p>

              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  To do this, we'll map over our <P>gradientSteps</P> array, grabbing each <i>color</i> and its <i>index</i>in the array
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  For each <i>color</i>, we'll create a <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop"><P>{`<stop>`}</P></Link> element
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  React requires a <P>key</P> for the outmost elements in a loop, to distinguish between them and help with re-render decisions
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  We'll set each <P>stopColor</P> attribute as our color, and
                </div>,
                <div {...getHighlightedMarkerProps(4)}>
                  set each <P>offset</P> attribute as the <i>percent <P>(0 - 100}</P> through the gradient</i>. We <i>could</i> create a scale to convert the <P>index</P> into a <i>percent</i>, but it's easier here to just divide the <P>index</P> by the <i>maximum index</i> (or, one less than the number of <P>gradientSteps</P>).
                </div>,
                <div {...getHighlightedMarkerProps(5)}>
                  And at last, we can use our <i>handle</i> and set the <P>fill</P> attribute of our <i>filled arc</i>.
                </div>,
              ]} />
              <br />
              <br />
              <br />
            </ScrollEvent>
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(11)
            }}>
              <h3>Helpful bits & bobs</h3>

              <p>
                Another contextual clue we can add to our gauge is a sense of <i>what is a normal value</i>. When a <P>value</P> is close to the middle of our range, we might want to know whether or not it's above the mid-point.
              </p>
              <p>
                One simple solution would be to draw a <P>{`<line>`}</P> element across the middle of our gauge, splitting it in two horizontally. If we make this line the same color as the background of our page (white), we can prevent it from stealing too much visual attention.
              </p>
              <p>
                Note that we drew our line from <P>[0, -1]</P> to <P>[0, -0.65]</P> to prevent it from extending below our arc, whose inner radius starts at <P>0.65</P>.
              </p>

              <Grid hasArc highlightedPoints={[[0, -1], [0, -0.65]]} />

            </ScrollEvent>
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(12)
            }}>
              <p>
                We might also notice that the end of our <i>filled arc</i> can get a little lost, especially with the rounded corner. But this is supposed to be the main point of our diagram!
              </p>
              <p>
                Let's add a bubble where our arc ends, to give it more visual importance.
              </p>

              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  First, we need to figure out the position of our bubble. We'll use our custom <P>getCoordsOnArc()</P> function (defined in the next bullet point!). We can pass it our value's <P>angle</P> and the <i>distance from the center of our arc</i>. This will be <i>half the distance the inner radius (<P>0.65</P>) is from the outer radius (<P>1</P></i>.
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  At the bottom of our file, let's define our <P>getCoordsOnArc()</P> function. This is something I usually have lying around, because it comes in handy when doing radiua layouts.
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  At last, we can draw our bubble! We'll create a <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle"><P>{`<circle>`}</P></Link> element, setting its center (<P>[cx, cy]</P>) at our <P>markerLocation</P>. A <i>radius</i> (<P>r</ P>) of <P>0.2</P> feels right (a little larger than the arc itself), and we'll give it a slight border (<P>stroke</P>) to make it pop a bit.
                  <br />
                  <br />
                  We'll also want to set the <P>fill</P> to match the color of the <i>filled arc's</i> gradient. Even though the gradient is partially covered by the bubble, this double encoding of the <P>value</P> helps the user focus on our main message: <i>how far through the range is our <P>value</P>?</i> Play around with the sliders to see how the changing color feels.
                </div>,
              ]} />
            </ScrollEvent>
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(13)
            }}>
              <p>
                Our last bob is a little arrow that points to our bubble. This is our third redundancy for the current <P>value</P> - might as well throw up a neon sign, am I right?
              </p>
              <p>
                Maybe it's overkill, but the arrow has another benefit: it further emphasizes the visual metaphor to an analog gauge, like one you would find in a pilot's dashboard. Let's implement it, and see how we like it.
              </p>

              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  First, we'll create a new <Link to="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path"><P>{`<path>`}</P></Link> element.
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  A monster appears! What is this long, complicated string?
                  <br />
                  <br />
                  One trick I like to use is to draw a vector graphic in a design tool such as Adobe Illustrator or Figma, then export that graphic as an svg. Then I can open that svg file in my text editor and grab the code I want.
                  <br />
                  <br />
                  In this case, I created our arrow in Figma, then grabbed the <P>{`<path>`}</P>'s <P>d</P> attribute and pasted it in here.
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  We can use the angle we computed before to rotate our arrow. We'll need to convert it from <i>radians</i> into <i>degrees</i>, since the default <P>rotate</P> unit is <i>degrees</i>.
                  <br />
                  <br />
                  We also have a static <P>transform</P> to move our arrow <i>left</i> and <i>up</i>, to rotate around the middle dot, instead of our arrow's top, left corner.
                </div>,
              ]} />
            </ScrollEvent>
            <br />
            <br />
            <br />
            <ScrollEvent isInViewChange={status => {
              if (status != 0) return
              setCodeIndex(14)
            }}>
              <h3>The last details</h3>
              <p>
                Phew! That was quite a large hill to climb!
              </p>
              <p>
                Now that we're happy with our gauge diagram, let's add in some context to surface the actual data to users. We'll add the current <P>value</P>, and two optional labels: the name of the metric, and the unit we're working in. I find it's good to have these prompts when creating a new Gauge.
              </p>

              <p>
                This step might feel a little "<Link to="https://knowyourmeme.com/memes/how-to-draw-an-owl"><b>Draw the rest of the owl</b></Link>". I won't walk through every single change, but feel free to go through all of the changes (highlighted), it's pretty straightforward!
              </p>
              <p>
                Let's look at a few highlights, though.
              </p>


              <List className="GaugeWalkthrough__marked-list" hasNumbers items={[
                <div {...getHighlightedMarkerProps(0)}>
                  You might notice that we added special <Link to="https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings"><P>font-feature-settings</P></Link> to our displayed <P>value</P>. Turning on the <P>"zero"</P> flag gives any zero a slash through it, which is a nice distinction from a capital <b>O</b>.
                  <br />
                  <br />
                  More importantly, we've turned on the <P>"tnum"</P> flag. This will ensure that each character takes up the same amount of space - wonderful for keeping our numbers from jumping around as the <P>value</P> changes.
                  <br />
                  <br />
                  The "tnum" output is available as a feature to some fonts. We're using the wonderful <Link to="https://rsms.me/inter/">Inter font</Link>, which has tons of fun <Link to="https://rsms.me/inter/#features">fun features</Link> to play around with.
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  We can use <Link to="https://github.com/d3/d3-format#format"><P>.format()</P></Link> from <Link to="https://github.com/d3/d3-format">d3-format</Link> to add any necessary commas to our <P>value</P>. This makes the number a bit more human-friendly.
                  <Aside>
                    If we expected our gauges to work with sub-integer values, we could also use <Link to="https://github.com/d3/d3-format">d3-format</Link> to format those nicely. Let's keep things simple, for now.
                  </Aside>
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  Note that we can use a <Link to="https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator">handy short-circuit boolean expression</Link> to optionally display our <P>label</P> or <P>unit</P>, if they are <b>truthy</b>.
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  Since our <P>value</P> is the most important part of this gauge, let's use a lighter color for our secondary labels.
                </div>,
              ]} />
            </ScrollEvent>

            <br />
            <br />
            <br />

            <h3>
              Happily ever after
            </h3>


            <p>
              We've reached the end of our journey.
            </p>

          </div>
        </div>

        <EndingGraphic />

        <div className="GaugeWalkthrough__metrics">
          <GaugeWalkthroughMetric
            label="Wind speed"
            units="meters per second"
          />
          <GaugeWalkthroughMetric
            max={20}
            label="Visibility"
            units="kilometers"
          />
          <GaugeWalkthroughMetric
            max={3000}
            label="Atmospheric Pressure"
            units="hectopascals"
          />

        </div>

          {/* <p>
            When is the best time to use a gauge?
          </p>

          <List items={[
            <>
              On a dashboard, so power users can quickly process the most important metrics
            </>,
            <>
              When users need to quickly
            </>,
          ]} />

          <p>

          </p>

        <div className="GaugeWalkthrough__code">
          <Code fileName="Guage.jsx">
            { gaugeJs }
          </Code>
        </div> */}





      </div>
    </div>
  )
}

export default GaugeWalkthrough


const GaugeWalkthroughMetric = ({ name, min=0, max=100, label, units }) => {
  const [value, setValue] = useState(Math.floor(randomInRange(min, max)))

  return (
    <div className="GaugeWalkthroughMetric">

      <Gauge
        {...{value, min, max, label, units}}
      />

      <h6>Update value</h6>

      <Slider
        className="GaugeWalkthrough__slider"
        {...{value, min, max}}
        onChange={setValue}
      />

    </div>
  )
}

const randomInRange = (from, to) => Math.random()*(to-from)+from


const formatSeconds = d => d > 60 ? "more than 60!" : format(".0f")(d)

const ReadingGauge = () => {
  const [secondsSpent, setSecondsSpent] = useState(0)

  const initTime = useMemo(() => (
    new Date()
  ), [])

  useInterval(() => {
    setSecondsSpent((new Date() - initTime) / 1000)
  }, secondsSpent <= 61 ? 1000 : null)

  return (
    <Gauge
      value={secondsSpent}
      max={60}
      format={formatSeconds}
      label="Time spent reading"
      units="seconds"
    />
  )
}


const NUMBER_OF_POINTS_PER_MOUNTAIN = 5
const NUMBER_OF_MOUNTAINS = 6
const NUMBER_OF_CLOUDS = 6
const mountainAreaGenerator = area()
  .x(d => d[0])
  .y0(8)
  .y1(d => d[1])
  .curve(curveBasis)
const mountainRiverAreaGenerator = area()
  .x0((d, i) => d[0] - i * 0.03 + 0.01)
  .x1((d, i) => d[0] + i * 0.03 + 0.01)
  .y(d => d[1])
  .curve(curveBasis)
const mountainColors = scaleLinear()
  .domain([0, NUMBER_OF_MOUNTAINS])
  .range(["#ACC5DD", "#06051D"])

const JourneyBackground = () => {
  const [iteration, setIteration] = useState(0)

  const mountains = useMemo(() => (
    times(NUMBER_OF_MOUNTAINS, mountainI => {
      const MOUNTAIN_WIDTH = randomInRange(5, 20)
      const MOUNTAIN_X_START = randomInRange(-9, 6)
      const xScale = scaleLinear()
        .domain([0, NUMBER_OF_POINTS_PER_MOUNTAIN])
        .range([
          MOUNTAIN_X_START,
          MOUNTAIN_X_START + MOUNTAIN_WIDTH,
        ])
      const mountainsDimensions = times(NUMBER_OF_POINTS_PER_MOUNTAIN, pointI => [
          xScale(pointI),
          !pointI || pointI == NUMBER_OF_POINTS_PER_MOUNTAIN - 1
            ? 8
            : randomInRange(Math.max(2, mountainI - 3.5), mountainI),
        ]
      )
      const centerPoint = mountainsDimensions
        .filter(([x, y]) => x > 0 && x < 10)
        .sort((a, b) => a[1] - b[1])
        [0] || []
      const NUMBER_OF_RIVER_POINTS = Math.floor(randomInRange(6, 10))
      const riverYScale = scaleLinear()
        .domain([0, NUMBER_OF_RIVER_POINTS - 1])
        .range([centerPoint[1], 8])
      const riverDimensions = times(NUMBER_OF_RIVER_POINTS, i => [
        i ? randomInRange(centerPoint[0] - 2, centerPoint[0] + 2) : centerPoint[0],
        riverYScale(i),
      ])
      return [
        mountainAreaGenerator(mountainsDimensions),
        mountainRiverAreaGenerator(riverDimensions),
      ]
    })
  ), [iteration])

  const groundPath = useMemo(() => (
    area()
      .x(d => d[0])
      .y0(10)
      .y1(d => d[1])
      .curve(curveBasis)
      (times(4, i => [
        i * 4,
        randomInRange(4, 5),
      ]))
  ), [iteration])

  const roadPath = useMemo(() => (
    area()
      .x0((d, i) => i == 6 ? 0 : d[0] - Math.max(0.01, i - 1))
      .x1((d, i) => i == 6 ? 10 : d[0] + Math.max(0.01, i - 1))
      .y(d => d[1])
      .curve(curveBasis)
      (times(7, i => [
        randomInRange(2, 8),
        4 + i,
      ]))
  ), [iteration])

  const treesPath = useMemo(() => {
    const NUMBER_OF_PEAKS = Math.floor(randomInRange(20, 30))
    const TREES_X_START = randomInRange(-5, 10)
    const TREE_WIDTH = 0.2
    return [
      ...times(NUMBER_OF_PEAKS, i => [
        i ? "L" : "M",
        TREES_X_START + TREE_WIDTH * i,
        5,
        "L",
        TREES_X_START + TREE_WIDTH * (i + 0.5),
        randomInRange(3.5, 4.5),
      ].join(" ")),
      "L",
      TREES_X_START + TREE_WIDTH * NUMBER_OF_PEAKS,
      5,
    ].join(" ")
  }, [iteration])

  const clouds = useMemo(() => (
    times(NUMBER_OF_CLOUDS, cloudI => {
      // const NUMBER_OF_POINTS_PER_CLOUD = Math.floor(randomInRange(1, 4)) * 2 + 1
      const NUMBER_OF_POINTS_PER_CLOUD = Math.floor(randomInRange(3, 6))
      const CLOUD_HEIGHT = randomInRange(0.1, 1.6)
      const CLOUD_Y_POSITION = randomInRange(-4, 2)
      // const cloudGenerator = area()
      //   .x(d => d[0])
      //   .y0(CLOUD_Y_POSITION + CLOUD_HEIGHT)
      //   .y1(d => d[1] + CLOUD_Y_POSITION)
      //   .curve(curveBasis)
      const xScale = scaleLinear()
        .domain([0, NUMBER_OF_POINTS_PER_CLOUD])
        .range([0, randomInRange(1, 6)])
      return [
        `M 0 ${CLOUD_Y_POSITION + CLOUD_HEIGHT}`,
        ...times(NUMBER_OF_POINTS_PER_CLOUD, pointI => [
          "A",
          xScale(1) * 0.3, // rx
          randomInRange(2, CLOUD_HEIGHT - randomInRange(0.5, 1)) * 0.26, // ry
          0, // x-axis-rotation
          0, // large-arc-flag
          1, // sweep-flag
          xScale(pointI), // x
          pointI == (NUMBER_OF_POINTS_PER_CLOUD - 1)
            ? CLOUD_Y_POSITION + CLOUD_HEIGHT
            : CLOUD_Y_POSITION + CLOUD_HEIGHT - randomInRange(0.1, 0.6), // y
        ].join(" ")),
        // `L ${xScale(NUMBER_OF_POINTS_PER_CLOUD)} ${CLOUD_Y_POSITION + CLOUD_HEIGHT}`,
      ].join(" ")
      // return cloudGenerator(
      //   times(NUMBER_OF_POINTS_PER_CLOUD, pointI => [
      //     xScale(pointI),
      //     pointI % 2 ? randomInRange(0, CLOUD_HEIGHT - 0.5) : CLOUD_HEIGHT,
      //   ])
      // )
    })
  ), [iteration])

  return (
    <div className="JourneyBackground">
      <Explorer iteration={iteration} />
      <svg className="JourneyBackground__svg" viewBox="0 0 10 10" preserveAspectRatio="none" onClick={() => setIteration(iteration + 1)}>
        <defs>
          <clipPath id="JourneyBackground__ground">
            <path
              d={groundPath}
            />
          </clipPath>
          {mountains.map(([mountain], i) => (
            <clipPath id={`JourneyBackground__mountain--${i}`} key={i}>
              <path
                d={mountain}
              />
            </clipPath>
          ))}
          {times(NUMBER_OF_MOUNTAINS, i => (
            <linearGradient id={`JourneyBackground__mountain-color-${i}`} gradientTransform="rotate(90)" key={i} x1="-1.6" x2="0.5">
              <stop stopColor="#F3CCBC" offset="0" />
              <stop stopColor={mountainColors(i)} offset="100%" />
            </linearGradient>
          ))}
        </defs>
        <g className="JourneyBackground__clouds">
          {clouds.map((cloud, i) => (
            <path
              key={i}
              className="JourneyBackground__cloud"
              d={cloud}
            />
          ))}
        </g>
        <g>
          {mountains.map(([mountain, road], i) => (
            <React.Fragment key={i}>
              <path
                className="JourneyBackground__mountain"
                d={mountain}
                // fill={mountainColors(i)}
                fill={`url(#JourneyBackground__mountain-color-${i})`}
                />
              <path
                className="JourneyBackground__mountain-road"
                d={road}
                clipPath={`url(#JourneyBackground__mountain--${i})`}
                fillOpacity={i / 4}
              />
            </React.Fragment>
          ))}
        </g>
        <path
          className="JourneyBackground__ground"
          d={groundPath}
        />
        <path
          className="JourneyBackground__trees"
          d={treesPath}
        />
        <path
          className="JourneyBackground__road"
          d={roadPath}
          clipPath="url(#JourneyBackground__ground)"
        />
      </svg>
    </div>
  )
}



const P = ({ children }) => (
  <code className="P">{ children }</code>
)


const viewBoxNames = ["x", "y", "width", "height"]
const viewBoxMinMax = [
  [-100, 100],
  [-100, 100],
  [0, 300],
  [0, 300],
]
const TelescopeExplorable = () => {
  const [viewBox, setViewBox] = useState([0, 0, 100, 100])

  return (
    <div className="TelescopeExplorable">
      <div className="TelescopeExplorable__controls">
        {viewBox.map((d, i) => (
          <div className="TelescopeExplorable__controls__item">
            <label>{ viewBoxNames[i] }</label>
            <Slider
              key={i}
              value={d}
              min={viewBoxMinMax[i][0]}
              max={viewBoxMinMax[i][1]}
              trackStyle={[{ backgroundColor: '#FFC312' }]}
              handleStyle={[{ borderColor: '#FFC312' }]}
              onChange={newValue => setViewBox([
                ...viewBox.slice(0, i),
                newValue,
                ...viewBox.slice(i + 1),
              ])}
              type="number"
            />

            <div className="TelescopeExplorable__controls__item__value">
              { d }
            </div>
          </div>
        ))}

        <div className="TelescopeExplorable__controls__summary">
          viewBox: "{ viewBox.join(" ") }"
        </div>
      </div>

      <div className="TelescopeExplorable__main">
        <div className="TelescopeExplorable__person">
          <ExplorerWithTelescope />
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
          <svg width="15em" height="15em" viewBox={viewBox.join(" ")}>
            <circle cx="50" cy="50" r="40" fill="#9980FA" />
            <rect width="100" height="100" fill="none" stroke="cyan" />
            <text x="50" y="50" style={{textAnchor: "middle", fontSize: "10px"}}>[50, 50]</text>
            <circle cx="50" cy="50" r="1" />
          </svg>
        </div>
      </div>
    </div>
  )
}


const ArcExample = () => {
    const [params, setParams] = useState({
        innerRadius: 25,
        outerRadius: 40,
        startAngle: 0,
        endAngle: 5.5,
        cornerRadius: 20,
        padAngle: 0,
    })
    const {arcPath} = useMemo(() => {
        const arcPath = arc()
            .innerRadius(params.innerRadius)
            .outerRadius(params.outerRadius)
            .startAngle(params.startAngle)
            .endAngle(params.endAngle)
            .padAngle(params.padAngle)
            .cornerRadius(params.cornerRadius)
            ()

        return {
            arcPath
        }
    }, [params])
    return (
        <div className="ArcExample">
            <svg width="100" height="100">
                <path fill="cornflowerblue" d={arcPath} style={{transform: `translate(50%, 50%)`}} />
            </svg>

            <div className="ArcExample__controls">
                {["innerRadius", "startAngle", "outerRadius", "endAngle", "cornerRadius", "padAngle"].map(param => (
                    <div className="ArcExample__control" key={param}>
                        <div className="ArcExample__control__label">
                            { param }
                        </div>
                        <div className="ArcExample__control__value">
                            { params[param] }
                        </div>
                        <Slider
                            className="ArcExample__slider"
                            value={params[param]}
                            min={0}
                            max={param.endsWith("Angle") ? Math.PI * 2 : 50}
                            step={param == "cornerRadius" || param.endsWith("Angle") ? 0.1 : 1}
                            onChange={value => setParams({
                                ...params, [param]: value
                            })}
                            pushable
                        />
                    </div>
                ))}
            </div>
            <Expandy trigger="Show me the code" doHideIfCollapsed>
                <Code size="s" language="js">{`const arcGenerator = d3.arc()
  .innerRadius(${params.innerRadius})
  .outerRadius(${params.outerRadius})
  .startAngle(${params.startAngle})
  .endAngle(${params.endAngle})
  .padAngle(${params.padAngle})
  .cornerRadius(${params.cornerRadius})

const arcPath = arcPathGenerator()

** HTML **

<svg width="100" height="100">
  <path
    fill="cornflowerblue"
    d={arcPath}
    style="transform: translate(50%, 50%)"
  />
</svg>
`}</Code>
            </Expandy>
        </div>
    )
}

const Grid = ({ hasArc=false, highlightedPoints=null }) => (
  <div className="GaugeWalkthrough__grid">
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--nw">
      [-1, -1]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--ne">
      [1, -1]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--sw">
      [-1, 0]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--se">
      [1, 0]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--n">
      [0, -1]
    </div>
    <div className="GaugeWalkthrough__grid__corner GaugeWalkthrough__grid__corner--s">
      [0, 0]
    </div>
    <svg viewBox="-1 -1 2 1" style={{
      border: "1px solid pink",
      overflow: "visible",
    }}>
      {hasArc && (
        <path fill="#DBDBE7" d="M-0.8062257748298549,-8.326672684688674e-17A0.175,0.175,0,0,1,-0.9772433634301272,-0.2121212121212122A1,1,0,0,1,0.9772433634301272,-0.21212121212121218A0.175,0.175,0,0,1,0.8062257748298549,-2.7755575615628914e-17L0.8062257748298549,-2.7755575615628914e-17A0.175,0.175,0,0,1,0.6352081862295826,-0.13787878787878788A0.65,0.65,0,0,0,-0.6352081862295826,-0.13787878787878793A0.175,0.175,0,0,1,-0.8062257748298549,-8.326672684688674e-17Z" />
      )}
      <rect x="-1" y="-1" width="1" height="1" stroke="turquoise"  strokeWidth="0.026" fill="none" />
      {/* <rect x="-1" y="0" width="1" height="1" stroke="turquoise"  strokeWidth="0.026" fill="none" /> */}
      <rect x="0" y="-1" width="1" height="1" stroke="turquoise"  strokeWidth="0.026" fill="none" />
      {/* <rect x="0" y="0" width="1" height="1" stroke="turquoise"  strokeWidth="0.026" fill="none" /> */}
      {highlightedPoints && (
        highlightedPoints.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            fill="#FFC312"
            r="0.1"
          />
        ))
      )}
    </svg>
  </div>
)


const MobileCode = ({ index, units, label, value, min, max }) => {
  const {code, Example, highlightedLines=[], removedLines=[], insertedLines=[], markers} = codeExamples[index]

  return (
    <div className="mobile GaugeWalkthrough__mobile-code">
      <Code size="s"
        fileName="Gauge.jsx"
        highlightedLines={highlightedLines}
        removedLines={removedLines}
        insertedLines={insertedLines}>
        { code }
      </Code>

      <Example {...{units, label, value, min, max}} />
    </div>
  )
}


const Explorer2 = ({ iteration }) => (
  <svg width="155" height="414" viewBox="0 0 155 414" fill="none">
    <path d="M91.3251 36.4402C91.3251 37.4366 90.4912 38.2444 89.4625 38.2444C88.4339 38.2444 87.6 37.4366 87.6 36.4402C87.6 35.4437 88.4339 32.7135 89.4625 32.7135C90.4912 32.7135 91.3251 35.4437 91.3251 36.4402Z" fill="#682416"/>
    <path d="M69.2515 146.617L105.486 130.704C111.833 124.379 112.34 122.29 118.251 119C120.019 118.437 119.973 119.294 116.751 124C113.53 128.706 119.04 130.056 120.328 131.705C121.615 133.355 116.778 133.318 118.251 136C119.234 137.788 121.514 138.143 107.959 140.633L80.8214 161.439L69.2515 146.617Z" fill="#79392C"/>
    <path d="M37.0759 117.134L37.076 111.973C55.9103 130.243 34.1135 135.012 46.6652 140.823C58.5323 146.316 75.3548 141 95.351 133.823L101.475 147.505C83.3063 167.161 44.6004 183.767 28.9113 174.287C3.82769 159.13 36.1667 147.796 37.0759 117.134Z" fill="#7567DA"/>
    <path filter="url(#Explorer__blur)" d="M144.587 72.2109C145.781 60.6745 137.396 50.3548 125.86 49.1612C114.324 47.9676 104.004 56.3521 102.81 67.8885" stroke="white" strokeWidth="9" stroke-linecap="round"/>
    <path className={`Explorer2__staff Explorer2__staff--iteration-${iteration % 2}`} d="M144.587 72.2109C145.781 60.6745 137.396 50.3548 125.86 49.1612C114.324 47.9676 104.004 56.3521 102.81 67.8885" stroke="white" strokeWidth="9" stroke-linecap="round"/>
    <path d="M123.802 69.055L90.2515 393.324" stroke="#C6D2DE" strokeWidth="9" stroke-linecap="round"/>
    <path d="M114.526 128.425C114.696 125.761 121.241 125.553 123.916 125.781C124.892 125.974 127.66 125.171 126.782 128.595C126.162 131.016 114.356 131.089 114.526 128.425Z" fill="#79392C"/>
    <path d="M113.235 133.468C113.367 130.852 120.217 130.735 123.022 130.995C124.047 131.197 126.931 130.446 126.072 133.799C125.464 136.169 113.103 136.083 113.235 133.468Z" fill="#79392C"/>
    <path d="M113.517 136.82C113.961 134.7 119.553 135.475 121.803 136.044C122.611 136.339 125.057 136.092 123.925 138.721C123.125 140.58 113.072 138.939 113.517 136.82Z" fill="#79392C"/>
    <path d="M114.843 124.27C114.453 121.624 120.842 120.364 123.519 120.157C124.519 120.189 127.071 118.953 126.926 122.46C126.823 124.94 115.234 126.917 114.843 124.27Z" fill="#79392C"/>
    <path d="M122.613 116.83C121.251 114.5 114.339 116 112.655 118.203C109.751 122 107.251 122 107.251 130C107.251 131.921 111.751 126.5 115.251 120.5C116.591 118.203 123.975 119.16 122.613 116.83Z" fill="#79392C"/>
    <path d="M56.2626 39.4901C51.6547 34.0813 48.536 27.4528 49.0571 20.0254C50.5587 -1.37505 80.3489 3.33278 86.1437 14.1339C91.9385 24.935 91.2499 52.333 83.7607 54.2634C80.774 55.0333 74.4114 53.1474 67.9357 49.2443L72.0004 78H48.0004L56.2626 39.4901Z" fill="#79392C"/>
    <path d="M90.9643 22.853C90.7265 21.453 90.1455 19.8982 89.6767 18.5737C89.0723 16.8661 88.1577 15.3265 87.1511 13.8755C85.2561 11.1437 82.9828 8.67687 80.4728 6.62944C75.888 2.88962 70.0518 0.73247 64.3126 1.43301C61.4149 1.78668 58.6019 2.892 56.2077 4.73176C54.0446 6.394 51.9639 8.84093 49.1629 9.01675C46.1151 9.2079 43.3214 6.51785 40.8771 4.85647C38.1212 2.98349 35.1894 1.6187 31.9684 1.08819C26.5725 0.199743 21.5034 2.0228 17.7846 6.44988C13.8273 11.1609 10.9507 18.0697 13.5495 24.3118C14.0325 25.4722 14.654 26.4504 15.5458 27.2612C16.3638 28.0046 17.6131 28.7956 17.9447 29.9836C18.297 31.2463 17.2447 32.8754 16.8366 34.0147C16.2521 35.6472 15.7721 37.3607 15.9427 39.135C16.2231 42.0489 18.0543 44.8306 19.9879 46.7459C21.9556 48.6948 24.3774 49.8124 26.9641 50.3276C28.6913 50.6716 30.4565 50.8613 32.2119 50.7322C33.0833 50.6681 33.8523 50.4261 34.6966 50.2336C35.5176 50.0463 35.9765 50.2644 36.6731 50.7147C39.9092 52.8067 43.3887 53.6161 47.1253 53.305C50.2788 53.0423 53.9136 52.2781 56.4862 50.1174C59.3432 47.7176 62.4559 49.2599 61.7836 45.7244C71.7185 46.7459 65.7576 41.0184 72.8688 37.0444C74.5497 35.4398 74.7034 32.1469 75.6924 29.9836C76.5071 28.2021 86.3208 27.5227 87.1511 25.7501C88.4524 22.972 91.2096 24.2997 90.9643 22.853Z" fill="#191847"/>
    <path d="M44 175L80.6308 301.227L97.8602 396H115.153L97.891 175H44Z" fill="#64211C"/>
    <path d="M27.5378 175C30.0937 240.574 29.0857 276.34 28.5136 282.298C27.9416 288.256 24.694 328.156 2.56372 398H20.55C49.8579 330.997 60.089 291.096 63.4504 282.298C66.8118 273.5 76.7394 237.734 91.2334 175H27.5378Z" fill="#79392C"/>
    <path d="M27.41 175C29.9132 240.574 23.4259 305.177 3.33057 384.021H30.3169C59.6786 318.018 80.7231 253.734 95.1056 175H27.41Z" fill="#C7C5E4"/>
    <path d="M43.2136 175C52.7419 218.435 69.2217 287.768 92.653 383H117.946C119.814 285.254 111.867 220.92 98.1046 175H43.2136Z" fill="#DBDBE7"/>
    <path d="M0 411L0.992423 395C6.80292 396.699 14.0807 396.033 22.8257 393C32.2288 399.661 44.0659 404.209 58.3373 406.644L58.3373 406.644C59.4261 406.83 60.1581 407.863 59.9723 408.952C59.9603 409.023 59.9445 409.092 59.925 409.161L58.5529 414H22.8257H1.98485L0 411Z" fill="#DBDBE7"/>
    <path d="M94 411L94.9924 395C100.803 396.699 108.081 396.033 116.826 393C126.229 399.661 138.066 404.209 152.337 406.644L152.337 406.644C153.426 406.83 154.158 407.863 153.972 408.952C153.96 409.023 153.944 409.092 153.925 409.161L152.553 414H116.826H95.9848L94 411Z" fill="#DBDBE7"/>
    <path d="M22 183C56.6718 183 82.1756 183 98.5114 183C102.008 183 101.349 177.952 100.843 175.404C95.0106 146.004 72.2413 114.312 72.2413 72.4607L50.1718 69C31.9175 98.3584 25.6048 134.505 22 183Z" fill="#DBDBE7"/>
    <path d="M14.3688 153.233C20.9473 107.457 31.2697 82.2958 48.748 68.9999H49C49 68.9999 68.0845 68.9999 77.31 75.6214C120.413 106.558 65.2862 163.158 110.148 204C110.148 204 76.9598 215.683 54.778 218.123C14.3688 222.569 5 204 5 204C6.08963 187.563 9.58339 170.181 14.3688 153.233Z" fill="#8478DC"/>
  </svg>
)

const EndingGraphic = () => {
  const [iteration, setIteration] = useState(0)

  const groundPoints = times(4, i => [
    i * 4,
    randomInRange(7, 8),
  ])
  const groundPath = useMemo(() => (
    area()
      .x(d => d[0])
      .y0(13)
      .y1(d => d[1])
      .curve(curveBasis)
      (groundPoints)
  ), [iteration])

  const hillPoints = times(11, i => [
    i,
    Math.abs(i - 5) > 3 ? randomInRange(7, 8) :
    Math.abs(i - 6) > 1 ? randomInRange(2, 6) :
                          randomInRange(0, 1)
  ])
  const hillPath = area()
    .x(d => d[0])
    .y0(11)
    .y1(d => d[1])
    .curve(curveMonotoneX)
    (hillPoints)
  const doorIndex = hillPoints.map(d => d[1]).indexOf(Math.min(...hillPoints.map(d => d[1])))
  const doorPosition = [
    doorIndex,
    7.5,
  ]
  const doorRy = 7.5 - hillPoints[doorIndex][1] - 0.5
  const doorStyle = {
    left: `${doorIndex * 9}%`,
    top: `${randomInRange(33, 47)}%`,
    width: `${randomInRange(9, 14)}vw`,
  }
  const roadPath = useMemo(() => (
    area()
      .x0((d, i) => i == 6 ? 0 : d[0] - Math.max(0.001, i - 1))
      .x1((d, i) => i == 6 ? 13 : d[0] + Math.max(0.001, i - 1))
      .y(d => d[1])
      .curve(curveBasis)
      (times(7, i => [
        !i ? doorPosition[0] : randomInRange(2, 9),
        7 + i,
      ]))
  ), [iteration])

  return (
    <div className="EndingGraphic" onClick={() => setIteration(iteration + 1)}>
      <svg viewBox="0 0 10 13" preserveAspectRatio="none" className="EndingGraphic__svg">
        <defs>
          <clipPath id="EndingGraphic__hill">
            <path d={hillPath} />
          </clipPath>
          <clipPath id="EndingGraphic__ground">
            <path d={groundPath} />
          </clipPath>
        </defs>

        <path
          className="EndingGraphic__hill"
          d={hillPath}
        />
        <ellipse
          className="EndingGraphic__doorframe"
          clipPath={"url(#EndingGraphic__hill)"}
          rx="1.5"
          ry={doorRy}
          cx={doorPosition[0]}
          cy={doorPosition[1]}
        />
        <path
          className="EndingGraphic__ground"
          d={groundPath}
        />
        <path
          className="EndingGraphic__road"
          d={roadPath}
          clipPath="url(#EndingGraphic__ground)"
        />
      </svg>

      <svg className="EndingGraphic__door-group" viewBox="-1 -1 2 2" style={doorStyle}>
        <circle className="EndingGraphic__door" r="1" />
        <line y1="-1" y2="1" stroke="#C0D2E5" strokeWidth="0.01" />
        <circle className="EndingGraphic__doorknob" r="0.08" />

        <path
          className="hidden"
          d={[
            ["M", 0, -(1.2)].join(" "),
            ["A", (1.2), (1.2), 0, 0, 1, 0, (1.2)].join(" "),
            ["A", (1.2), (1.2), 0, 0, 1, 0, -(1.2)].join(" "),
          ].join(" ")}
          id={`EndingGraphic__door__text`}
          transform={`rotate(90)`}
        />
        <text>
          <textPath
            href={`#EndingGraphic__door__text`}
            class="EndingGraphic__door__text"
            startOffset="60%"
            >
            Home sweet home
          </textPath>
        </text>
      </svg>

      <div className="Explorer2">
        <Explorer2 iteration={iteration} />
      </div>
    </div>
  )
}
