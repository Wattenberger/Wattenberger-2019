import React, { memo, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { uniqueId, kebabCase, times } from "lodash"
import Aside from "components/_ui/Aside/Aside"
import Link from "components/_ui/Link/Link"
import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"
import InView from "components/_ui/InView/InView"
import Code from "components/_ui/Code/Code"
import D3ForceExample from "./D3ForceExample"
import D3ForceForces from "./D3ForceForces"
import yodaImage1 from "./yoda1.png"
import yodaImage2 from "./yoda2.png"
import scmpImage from "./scmp.png"
import { scrollTo } from "utils";
import { forceTypesMap } from "./force-types"

import "./D3Force.scss"

const metaImage = ""

// todo
// - custom force: rectangular collisions
// - custom force: particles on text
// - make it responsive

const D3Force = () => {
  const [areControlsVisible, setAreControlsVisible] = useState(false)
  const [forces, setForces] = useState([])
  const [forceShape, setForceShape] = useState("circle")
  const [forceAttributes, setForceAttributes] = useState({})
  const [forceFunctions, setForceFunctions] = useState([])
  const [optionNames, setOptionNames] = useState([])
  const [excludedMethods, setExcludedMethods] = useState(["strength", "iterations"])

  const [isRunning, setIsRunning] = useState(true)
  const [tickIteration, setTickIteration] = useState(0)
  const [isMobileControlsShowing, setIsMobileControlsShowing] = useState(false)

  const onTick = () => {
    setTickIteration(tickIteration + 1)
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

  const getForceAttribute = (name, attribute) => {
    const matchingForce = forces.find(([ forceName ]) => forceName == name)
    if (!matchingForce) return ""
    const id = matchingForce[2]
    if (!forceAttributes[id]) return ""
    if (!forceAttributes[id][attribute]) return ""
    return forceAttributes[id][attribute]["value"]
  }

  const onAddForce = force => {
    const forceName = force[0]
    // const newForceFunction = force[1](force[3] || 100)
    const newForceFunction = force[1]()

    const newForces = [...forces, [forceName, newForceFunction, uniqueId()]]
    setForces(newForces)
  }

  const onSetForces = newForcesRaw => {
    const newForces = newForcesRaw.map(force => {
      const forceName = force[0]
      // const newForceFunction = force[1](force[3] || 100)
      const newForceFunction = force[1]()

      return [forceName, newForceFunction, uniqueId()]
    })
    setForces(newForces)
  }

  return (
    <div className="D3Force">
      <Helmet>
          <meta charSet="utf-8" />
          <title>The CSS Cascade</title>
          <link rel="canonical" href="https://wattenberger.com/blog/css-cascade" />
          <meta property="og:type" content="website" />
          <meta name="description" content="<p>We style our websites using CSS, which stands for Cascading Style Sheets, but what does Cascading really mean? To save ourselves from future angst, let’s take a step back and learn this thing for real." />
          <meta name="image" content={metaImage} />
      </Helmet>

      <div className={`D3Force__controls D3Force__controls--is-${areControlsVisible ? "visible" : "hidden"} D3Force__controls--is-${isMobileControlsShowing ? "mobile-showing" : "mobile-hidden"}`}>
        <Button className="D3Force__controls__toggle" onClick={() => setIsMobileControlsShowing(!isMobileControlsShowing)}>
          Show controls
        </Button>
        <Button className="D3Force__controls__toggle D3Force__controls__toggle--bottom" onClick={() => setIsMobileControlsShowing(false)}>
          <Icon name="x" size="xs" />
        </Button>

        <D3ForceForces {...{forces, optionNames, excludedMethods, isRunning, onTick, forceAttributes, setForceAttributes, forceFunctions, onAddForce, setForceFunctions}} onSetIsRunning={setIsRunning} onChange={setForces} />
      </div>

      <div className="D3Force__example">
        <D3ForceExample {...{forces, forceAttributes, forceShape, isRunning, tickIteration}} />
      </div>

      <div className="D3Force__content">

        <InView
          padding="40vh"
          onChange={isInView => {
            if (!isInView) return
            setOptionNames([])
            setAreControlsVisible(false)
            setIsRunning(true)
          }}
        >
          {/* <h1>Use the Force</h1> */}
          <Title />

          <p>
            Usually, we position elements on our web pages in static, explicit places. But what if we want to make them feel more alive, or move them based on loose rules?
          </p>

          <p>
            Then, we have to <strong>use the force</strong>.
            The <Link to="https://github.com/d3/d3-force">d3-force</Link>.
          </p>


          <h2>d3-force</h2>

          <p>
            <Link to="https://github.com/d3/d3-force">d3-force</Link> is a module in the <Link to="https://github.com/d3/d3">d3.js</Link> API that runs a simulation, moving a set of particles on every "tick".
          </p>

          <p>To create a new simulation, we can use <P>d3.forceSimulation()</P>.</p>

            <p><P>d3.forceSimulation()</P> takes one parameter: the array of particles that we want to move about. These particles will each be an object:</p>

            <Code size="m" hasLineNumbers={false}>
{`const particles = [
  {
    // particle 1
    // data about the particle here, for example:
    date: "2020-11-23",
  },
  {
    // particle 2
    date: "2020-11-23",
  },
  // ...
]

d3.forceSimulation(particles)`}
            </Code>

          <p>
            To start our particles in a specific location, we can specify that by adding an <P>x</P> and <P>y</P> key to the object. If we don't specify an initial location, our particles will start in a <Link to="https://observablehq.com/@d3/force-layout-phyllotaxis">Phyllotaxis arrangement</Link>.
          </p>

          <Aside>
            Read about <Link to="/blog/spirals">how a spiral starting position could be beneficial</Link> (and also how unoriginal I am with article names)
          </Aside>

          <p>
            Once our simulation is created, we'll move our particles according to a set of <strong>forces</strong>.
          </p>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x" ])
          setAreControlsVisible(true)
          onSetForces([
            forceTypesMap["x"]
          ])
          setForceShape("circle")
        }}>
          <Section id="The x force">
            <p>There are several built-in forces that we can use with a d3-force simulation. The first I'll teach you is the <strong>x force</strong>.</p>

            <p>The <strong>x force</strong> urges our particles to move towards a specific x (horizontal) position.</p>

            <p>Add new <strong>x forces</strong> (on the left) to our active forces, and move the sliders to change the targeted x position.</p>

            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("x", d3.forceX(${getForceAttribute("x", "x")}))`}
            </Code>

            <Aside>
              When adding a new force, we call the simulation's <P>.force()</P> method, passing two parameters: a name (for cancelling the force, later) and the force itself.
            </Aside>

            <p>We can also specify a function, using the provided parameters (the particle, and the index of the particle). Try this by clicking <strong>buckets</strong> or <strong>in a line</strong>.</p>

            <p>Much to learn you still have, my young padawan.</p>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y" ])
          setExcludedMethods(["strength", "iterations"])
          setAreControlsVisible(true)
          onSetForces([
            forceTypesMap["y"]
          ])
          setForceShape("circle")
        }}>
          <Section id="The y force">

            <p>The <strong>y force</strong> is very similar to the <strong>x force</strong>, but moves our particles <i>vertically</i>.</p>

            <p>Try moving the <strong>y force</strong> around.</p>


            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("y", d3.forceY(${getForceAttribute("y", "y")}))`}
            </Code>
          </Section>
        </InView>
        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide" ])
          setExcludedMethods(["strength", "iterations"])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["collide"]
          ])
          setForceShape("circle")
        }}>
          <Section id="The collide force">

            <p>This is my favorite force! The <strong>collide force</strong> checks each particle to see if it's colliding with another particle. If so, it will move both particles away from each other.</p>
            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("collide", d3.forceCollide(${getForceAttribute("collide", "radius")}))`}
            </Code>

            <p>
              Our particles have run amok! Let's learn a way to keep them from spreading out too far.
            </p>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide" ])
          setExcludedMethods(["iterations"])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["x"],
            forceTypesMap["y"],
            forceTypesMap["collide"],
          ])
          setForceShape("circle")
        }}>
          <Section id="Using multiple forces">

            <p>
              We can use as many <strong>forces</strong> as we want! Let's add an <strong>x force</strong> and <strong>y force</strong> to keep our particles close to the middle of our screen.
            </p>

            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("x", d3.forceX(${getForceAttribute("x", "x")}))
  .force("y", d3.forceY(${getForceAttribute("y", "y")}))
  .force("collide", d3.forceCollide(${getForceAttribute("collide", "radius")}))`}
            </Code>

            <p>
              Some forces may counteract each other. Control which one is stronger by changing their <P>strength</P>.
            </p>

            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("x", d3.forceX(${getForceAttribute("x", "x")}).strength(${getForceAttribute("x", "strength")})))
  .force("y", d3.forceY(${getForceAttribute("y", "y")}).strength(${getForceAttribute("y", "strength")})))
  .force("collide", d3.forceCollide(${getForceAttribute("collide", "radius")}).strength(${getForceAttribute("collide", "strength")}))`}
            </Code>

          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide" ])
          setExcludedMethods([])
          setAreControlsVisible(true)
          setIsRunning(false)
          onSetForces([
            forceTypesMap["x"],
            forceTypesMap["y"],
            forceTypesMap["collide"],
          ])
          setForceShape("circle")
        }}>
          <Section id="Ticking the simulation">

            <p>
              The simulation works by running a <strong>tick</strong> function on every <Link to="">layout frame</Link>. We've paused the simulation using <P>simulation.stop()</P> - hit the <strong>tick</strong> button (in the top left) to run <P>simulation.tick()</P> and step through one frame at a time.
            </p>

            <p>
              Our <strong>collide force</strong> can also run multiple times per frame - set the number of times it runs by changing its <P>iterations</P>. This can help with jittering simulations, where the <strong>collide force</strong> fights against other forces.
            </p>

            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("x", d3.forceX(${getForceAttribute("x", "x")}))
  .force("y", d3.forceY(${getForceAttribute("y", "y")}))
  .force("collide", d3.forceCollide(${getForceAttribute("collide", "radius")}).iterations(${getForceAttribute("collide", "iterations")}))`}
            </Code>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide", "radial" ])
          setExcludedMethods([])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["radial"]
          ])
          setForceShape("circle")
        }}>
          <Section id="The radial force">

            <p>The <strong>radial force</strong> moves the particles towards the edge of a circle. We can change the <P>radius</P> of that circle, and also its <P>x</P> and <P>y</P> position.</p>

            <Aside>
              The <strong>radial force</strong> doesn't evenly space our particles, so sometimes we'll want to add another force (try adding a <strong>collide force</strong>) to prevent our particles from clumping all in one place.
            </Aside>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide", "radial", "many body" ])
          setExcludedMethods([])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["many body"]
          ])
          setForceShape("circle")
        }}>
          <Section id="The many body force">

            <p>The <strong>many body force</strong> affects how the particles interact <i>with each other</i> and is the closest we get to simulate physics - a negative <P>strength</P> mimics repulsion and a positive <P>strength</P> mimics gravity.</p>

            <p>
              Because this force causes particles to affect each other, we can get interesting behavior like clumping. See if you can cause our particles to glom into distinct groups.
            </p>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide", "radial", "many body", "center" ])
          setExcludedMethods([])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["center"]
          ])
          setForceShape("circle")
        }}>
          <Section id="The center force">

            <p>The <strong>center force</strong> may <i>seem like</i> a repeat of our <strong>x force</strong> and <strong>y force</strong>, but it's actually very different.</p>

            <p>
              Instead of zooming our particles around, the <strong>center force</strong> will move the entire particle system so that it's centered at a specific spot. This is helpful for keeping our particles centered in our screen, but not modifying other active forces.
            </p>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide", "radial", "many body", "center", "link" ])
          setExcludedMethods([])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["link"],
            forceTypesMap["x"],
            forceTypesMap["y"],
            forceTypesMap["many body"],
          ])
          setForceShape("circle")
        }}>
          <Section id="The link force">

            <p>
              The <strong>link force</strong> is great for network diagrams, similar to <Link to="https://www.scmp.com/infographics/article/1670384/infographic-satellites-network">
              this infographic from the South China Morning Post</Link>.
            </p>
            <br />
            <img src={scmpImage} style={{width: "10em"}} />

            <p>
              We pass an array of links (objects with a <P>source</P> and a <P>target</P>) to tell our <strong>link force</strong> which particles are connected.
            </p>

            <Code size="m" hasLineNumbers={false}>
{`d3.forceSimulation()
  .force("link", d3.forceLinks([
    {source: 0, target: 1},
    {source: 1, target: 2},
    // ...
  ]))`}
            </Code>

            <p>These values correspond to each particle's <P>id</P>, which defaults to its index in the particles array.</p>
          </Section>
        </InView>

        <InView padding="40vh" onChange={isInView => {
          if (!isInView) return
          setOptionNames([ "x", "y", "collide", "radial", "many body", "link", "center", "bounds" ])
          setExcludedMethods([])
          setAreControlsVisible(true)
          setIsRunning(true)
          onSetForces([
            forceTypesMap["bounds"],
            forceTypesMap["collide"],
          ])
          // setForceShape("rect")
        }}>
          <Section id="Custom forces">
            <p>
              Here is where we learn the true power of forces - we can make custom ones to move our particles in any way we can imagine!
            </p>

            <p>For example, we could create a <strong>bounding force</strong> that keeps our particles within x and y positions.</p>

            <Aside>Check out <Link to="https://github.com/Wattenberger/Wattenberger-2019/blob/master/src/components/Blog/posts/D3Force/bounds.js">the code for our <strong>bounding force</strong></Link>.</Aside>

            <p>This force could be really helpful for making sure our particles stay on screen.</p>
          </Section>
        </InView>

      </div>

    </div>
  )
}

export default D3Force


const P = ({ children })=> (
  <code className="P">{ children }</code>
)
const Highlight = ({ children })=> (
  <div className="Highlight">{ children }</div>
)


const Title = () => (
  <svg className="Title" viewBox="0 0 623 215" fill="currentColor">
    {/* <path fillRule="evenodd" clipRule="evenodd" d="M207.337 0.0744629C197.672 0.0744629 189.837 7.90948 189.837 17.5745V85.864C189.837 95.529 197.672 103.364 207.337 103.364H271.57V68.364H224.837V64.0166H256.369V40.0166H224.837V35.0745H271.57V0.0744629H207.337ZM106.522 9.66282C109.934 3.85138 116.168 0.28186 122.907 0.28186H186.141V38.2819H155.272L175.778 75.0193C179.062 80.9035 178.984 88.0873 175.573 93.8987C172.161 99.7102 165.926 103.28 159.187 103.28H132.716V103.281L56.6392 103.281C54.8314 103.362 53.0572 103.391 51.3371 103.391C41.9471 103.391 31.2835 102.431 22.0454 97.072C11.512 90.9615 6.34197 81.3463 3.83403 71.6933C1.5437 62.8778 1.03542 52.3976 0.896333 41.5275C0.815221 35.1885 0.868874 27.7031 0.928251 19.4192L0.928253 19.4189L0.928255 19.4186C0.971252 13.4199 1.01725 7.00248 1.01725 0.298462H40.3613V58.8512C40.3613 64.1092 44.6238 68.3716 49.8818 68.3716C55.1398 68.3716 59.4022 64.1092 59.4022 58.8512V0.298462H98.4645C98.4645 12.6531 98.7691 23.0861 99.0379 32.2908V32.2912V32.2915L99.0379 32.2934L99.038 32.2941V32.2942V32.2943C99.1247 35.2663 99.2078 38.1103 99.2756 40.8497C99.5256 50.9444 99.6413 60.9121 98.2683 69.2814H129.056L106.317 28.5423C103.032 22.658 103.11 15.4743 106.522 9.66282ZM515.89 17.5745C515.89 7.90948 523.725 0.0744629 533.39 0.0744629H597.623V35.0745H550.89V40.0166H582.422V64.0166H550.89V68.364H597.623V103.364H533.39C523.725 103.364 515.89 95.529 515.89 85.864V17.5745ZM492.21 107.88C487.55 107.88 483.082 109.739 479.797 113.044C476.512 116.35 474.681 120.829 474.71 125.489L475.153 196.584C475.213 206.206 483.031 213.975 492.653 213.975H493.632V214.008H622.623V181.008H510.057L509.998 171.553H549.941V147.553H509.849L509.819 142.88H569.298V107.88H492.21ZM136.139 142.611H72.854V147.553H117.54V171.553H72.854V211.569V214.091H31.854V128.111C31.854 122.674 34.0138 117.46 37.8583 113.616C41.7028 109.771 46.9171 107.611 52.354 107.611H55.354H66.36H136.139V142.611ZM370.06 126.382C370.06 116.165 378.342 107.882 388.56 107.882H469.56V144.882H407.06V178.736H469.508V213.736H334.048C323.513 213.736 313.464 209.304 306.359 201.526L290.487 184.149V214.091H255.487V107.809H272.142V107.775H325.34L325.91 107.815C333.362 108.348 340.484 112.686 345.402 118.002C350.907 123.952 355.071 132.544 355.071 143.259C355.071 153.588 351.355 162.222 345.809 168.383C342.225 172.365 337.345 175.824 331.81 177.492L332.202 177.922C332.676 178.44 333.346 178.736 334.048 178.736H370.06V126.382ZM439.075 0.272585V40.0166H468.247V0.272583L509.247 0.272581V103.284H468.247V64.0166H439.075V103.284H398.075V35.2325H373.593V103.284H336.593V35.2325H298.401V0.232544H410.216V0.272584L439.075 0.272585ZM141.968 145.111C141.968 124.401 158.757 107.611 179.468 107.611H212.833C233.543 107.611 250.332 124.401 250.332 145.111V176.737C250.332 197.448 233.543 214.237 212.832 214.237H179.468C158.757 214.237 141.968 197.448 141.968 176.737V145.111ZM196.15 132.471C190.892 132.471 186.63 136.733 186.63 141.991V179.857C186.63 185.115 190.892 189.378 196.15 189.378C201.408 189.378 205.671 185.115 205.671 179.857V141.991C205.671 136.733 201.408 132.471 196.15 132.471ZM325.725 145.529C325.725 141.665 322.593 138.534 318.73 138.534H288.988V152.524H318.73C322.593 152.524 325.725 149.392 325.725 145.529Z" /> */}
  {/* </svg>
  <svg width="650" height="215" viewBox="0 0 650 215" fill="none" xmlns="http://www.w3.org/2000/svg"> */}
  <path fillRule="evenodd" clipRule="evenodd" d="M234.113 0.740112C224.448 0.740112 216.613 8.57513 216.613 18.2401V86.5297C216.613 96.1946 224.448 104.03 234.113 104.03H298.347V69.0297H251.613V64.6823H283.146V40.6823H251.613V35.7401H298.347V0.740112H234.113ZM133.299 10.3285C136.71 4.51703 142.945 0.94751 149.684 0.94751H212.918V38.9475H182.049L202.555 75.6849C205.839 81.5692 205.761 88.7529 202.349 94.5644C198.938 100.376 192.703 103.945 185.964 103.945H159.493V103.947L83.416 103.947C81.6081 104.028 79.8339 104.056 78.1138 104.056C68.7239 104.056 58.0603 103.097 48.8221 97.7376C38.2887 91.6272 33.1187 82.012 30.6108 72.359C28.3204 63.5435 27.8122 53.0633 27.6731 42.1932C27.592 35.8542 27.6456 28.3688 27.705 20.0848C27.748 14.0862 27.794 7.66813 27.794 0.964111H67.1381V59.5168C67.1381 64.7748 71.4005 69.0373 76.6585 69.0373C81.9165 69.0373 86.179 64.7748 86.179 59.5168V0.964111H125.241C125.241 13.3187 125.546 23.7517 125.815 32.9565L125.815 32.9591C125.901 35.9311 125.985 38.776 126.052 41.5153C126.302 51.61 126.418 61.5778 125.045 69.947H155.833L133.093 29.2079C129.809 23.3237 129.887 16.1399 133.299 10.3285ZM542.666 18.2401C542.666 8.57513 550.501 0.740112 560.166 0.740112H624.4V35.7401H577.666V40.6823H609.199V64.6823H577.666V69.0297H624.4V104.03H560.166C550.501 104.03 542.666 96.1946 542.666 86.5297V18.2401ZM518.987 110.546C514.327 110.546 509.859 112.405 506.574 115.71C503.289 119.016 501.458 123.495 501.487 128.155L501.93 199.249C501.99 208.872 509.807 216.64 519.43 216.64H520.408V216.674H649.4V183.674H536.834L536.775 174.219H576.718V150.219H536.625L536.596 145.546H596.075V110.546H518.987ZM162.915 145.277H99.6307V150.219H144.317V174.219H99.6307V214.235V216.757H58.6307V130.777C58.6307 125.34 60.7906 120.126 64.635 116.281C68.4795 112.437 73.6938 110.277 79.1307 110.277H82.1307H93.1367H162.915V145.277ZM396.836 129.048C396.836 118.831 405.119 110.548 415.336 110.548H496.337V147.548H433.836V181.401H496.284V216.401H360.825C350.29 216.401 340.241 211.97 333.136 204.192L317.264 186.815V216.757H282.264V110.475H298.919V110.44H352.117L352.687 110.481C360.139 111.014 367.26 115.352 372.179 120.668C377.684 126.618 381.848 135.209 381.848 145.924C381.848 156.254 378.131 164.887 372.586 171.048C369.001 175.031 364.122 178.49 358.587 180.158L358.979 180.587C359.452 181.106 360.122 181.401 360.825 181.401H396.836V129.048ZM465.851 0.938234V40.6823H495.024V0.938232L536.024 0.938231V103.95H495.024V64.6823H465.851V103.95H424.851V35.8982H400.37V103.95H363.37V35.8982H325.178V0.898193H436.993V0.938233L465.851 0.938234ZM168.745 147.777C168.745 127.066 185.534 110.277 206.245 110.277H239.609C260.32 110.277 277.109 127.066 277.109 147.777V179.403C277.109 200.114 260.32 216.903 239.609 216.903H206.245C185.534 216.903 168.745 200.114 168.745 179.403V147.777ZM222.927 135.136C217.669 135.136 213.406 139.399 213.406 144.657V182.523C213.406 187.781 217.669 192.043 222.927 192.043C228.185 192.043 232.447 187.781 232.447 182.523V144.657C232.447 139.399 228.185 135.136 222.927 135.136ZM352.502 148.194C352.502 144.331 349.37 141.199 345.507 141.199H315.765V155.189H345.507C349.37 155.189 352.502 152.058 352.502 148.194Z" />
  {/* <path fillRule="evenodd" clipRule="evenodd" d="M234.113 0.740112C224.448 0.740112 216.613 8.57513 216.613 18.2401V86.5297C216.613 96.1946 224.448 104.03 234.113 104.03H298.347V69.0297H251.613V64.6823H283.146V40.6823H251.613V35.7401H298.347V0.740112H234.113ZM133.299 10.3285C136.71 4.51703 142.945 0.94751 149.684 0.94751H212.918V38.9475H182.049L202.555 75.6849C205.839 81.5692 205.761 88.7529 202.349 94.5644C198.938 100.376 192.703 103.945 185.964 103.945H159.493V103.947L83.416 103.947C81.6081 104.028 79.8339 104.056 78.1138 104.056C68.7239 104.056 58.0603 103.097 48.8221 97.7376C38.2887 91.6272 33.1187 82.012 30.6108 72.359C28.3204 63.5435 27.8122 53.0633 27.6731 42.1932C27.592 35.8542 27.6456 28.3688 27.705 20.0848L27.705 20.0845L27.705 20.0842C27.748 14.0855 27.794 7.66813 27.794 0.964111H67.1381V59.5168C67.1381 64.7748 71.4005 69.0373 76.6585 69.0373C81.9165 69.0373 86.179 64.7748 86.179 59.5168V0.964111H125.241C125.241 13.3187 125.546 23.7517 125.815 32.9565V32.9568V32.9572L125.815 32.9591L125.815 32.9597V32.9598V32.9599C125.901 35.932 125.985 38.776 126.052 41.5153C126.302 51.61 126.418 61.5778 125.045 69.947H155.833L133.093 29.2079C129.809 23.3237 129.887 16.1399 133.299 10.3285ZM542.666 18.2401C542.666 8.57513 550.501 0.740112 560.166 0.740112H624.4V35.7401H577.666V40.6823H609.199V64.6823H577.666V69.0297H624.4V104.03H560.166C550.501 104.03 542.666 96.1946 542.666 86.5297V18.2401ZM518.987 108.546C514.327 108.546 509.859 110.405 506.574 113.71C503.289 117.016 501.458 121.495 501.487 126.155L501.93 197.249C501.99 206.872 509.807 214.64 519.43 214.64H520.408V214.674H649.4V181.674H536.834L536.775 172.219H576.718V148.219H536.625L536.596 143.546H596.075V108.546H518.987ZM162.915 143.277H99.6307V148.219H144.317V172.219H99.6307V212.235V214.757H58.6307V128.777C58.6307 123.34 60.7906 118.126 64.635 114.281C68.4795 110.437 73.6938 108.277 79.1307 108.277H82.1307H93.1367H162.915V143.277ZM396.836 127.048C396.836 116.831 405.119 108.548 415.336 108.548H496.337V145.548H433.836V179.401H496.284V214.401H360.825C350.29 214.401 340.241 209.97 333.136 202.192L317.264 184.815V214.757H282.264V108.475H298.919V108.44H352.117L352.687 108.481C360.139 109.014 367.26 113.352 372.179 118.668C377.684 124.618 381.848 133.209 381.848 143.924C381.848 154.254 378.131 162.887 372.586 169.048C369.001 173.031 364.122 176.49 358.587 178.158L358.979 178.587C359.452 179.106 360.122 179.401 360.825 179.401H396.836V127.048ZM465.851 0.938234V40.6823H495.024V0.938232L536.024 0.938231V103.95H495.024V64.6823H465.851V103.95H424.851V35.8982H400.37V103.95H363.37V35.8982H325.178V0.898193H436.993V0.938233L465.851 0.938234ZM168.745 145.777C168.745 125.066 185.534 108.277 206.245 108.277H239.609C260.32 108.277 277.109 125.066 277.109 145.777V177.403C277.109 198.114 260.32 214.903 239.609 214.903H206.245C185.534 214.903 168.745 198.114 168.745 177.403V145.777ZM222.927 133.136C217.669 133.136 213.406 137.399 213.406 142.657V180.523C213.406 185.781 217.669 190.043 222.927 190.043C228.185 190.043 232.447 185.781 232.447 180.523V142.657C232.447 137.399 228.185 133.136 222.927 133.136ZM352.502 146.194C352.502 142.331 349.37 139.199 345.507 139.199H315.765V153.189H345.507C349.37 153.189 352.502 150.058 352.502 146.194Z" /> */}
  {/* <path style={{ strokeWidth: 0 }} d="M46.5723 169.227C46.5723 164.493 44.0183 160.817 40.5837 158.835L40.5837 158.571L46.1319 159.496L46.1319 147.43L1.04104 139.944L1.04104 152.098L18.2143 154.96L18.2143 155.136C14.7797 155.885 11.8734 158.571 11.8734 163.591C11.8734 170.284 16.9814 177.638 29.2229 179.663C40.9359 181.601 46.5723 176.471 46.5723 169.227ZM37.2371 163.194C37.2371 166.563 34.2427 167.994 29.2229 167.157C24.203 166.343 21.2086 163.899 21.2086 160.552C21.2086 157.206 24.203 155.687 29.2229 156.501C34.1547 157.316 37.2371 159.87 37.2371 163.194Z" />
  <path style={{ strokeWidth: 0 }} d="M46.7484 123.41C46.7484 112.753 41.2001 104.277 33.8024 103.066C28.0339 102.119 23.7186 106.016 22.97 112.401L22.6177 112.401C22.1113 106.545 19.4693 102.361 14.1632 101.481C6.76547 100.27 0.424557 106.346 0.424558 116.628C0.424558 126.492 6.25908 134.638 14.5155 136.003L14.5155 124.378C11.7854 123.982 9.84785 120.635 9.84785 117.245C9.84785 114.14 11.389 112.797 13.7229 113.194C16.7612 113.7 19.0069 116.76 19.0069 120.503L19.0069 124.819L27.4615 126.228L27.4615 121.384C27.4615 117.663 28.7165 115.109 31.5126 115.572C34.2427 116.012 36.8848 118.918 36.8848 122.705C36.8848 125.898 35.0133 128.143 32.3933 127.637L32.3933 139.79C40.8038 141.243 46.7484 134.44 46.7484 123.41Z" /> */}
  <path style={{ strokeWidth: 0 }} d="M39.7228 155.438C39.7228 149.99 36.325 147.571 34.7739 146.352L34.7739 145.835L39.1319 146.574L39.1319 142.364L1.31368 136.085L1.31368 140.443L15.2739 142.77L15.2739 143.139C13.7966 143.841 10.3989 144.986 10.3989 150.526C10.3989 157.69 16.0864 163.581 25.0239 165.077C34.0353 166.554 39.7228 162.547 39.7228 155.438ZM35.808 154.367C35.808 159.832 31.0069 161.698 24.95 160.682C18.9671 159.703 14.3137 156.342 14.3137 150.821C14.3137 145.484 18.5978 143.232 24.95 144.284C31.3762 145.355 35.808 149.122 35.808 154.367Z" />
  <path style={{ strokeWidth: 0 }} d="M39.6489 120.948C39.6489 113.506 35.6049 107.745 29.1603 106.692C24.3776 105.898 20.5921 108.096 19.7796 112.749L19.558 112.749C18.3577 108.779 15.3662 105.806 11.2114 105.141C5.74549 104.255 0.796628 107.782 0.796629 114.891C0.796629 121.317 4.85913 127.263 10.7682 128.408L10.7682 123.976C7.00117 123.275 4.78527 119.12 4.78527 115.113C4.78527 110.958 7.2043 108.89 10.8421 109.499C15.0154 110.182 17.7114 113.875 17.7114 118.363L17.7114 121.243L21.7739 121.908L21.7739 118.806C21.7739 113.026 24.6361 110.533 28.5694 111.124C32.9827 111.789 35.5864 116.11 35.5864 120.874C35.5864 125.343 33.2966 128.076 29.6773 127.743L29.6773 132.323C35.6603 133.098 39.6489 128.353 39.6489 120.948Z" />

  </svg>

)

const Section = ({ id, children }) => (
  <section className="section" id={kebabCase(id)}>
    <SectionForceHeading id={id} />
    { children }
  </section>
)

const SectionForceHeading = memo(({ id }) => {
  const isForce = id.endsWith("force")
  return (
    <div className="section__heading">
      <a href={`#${kebabCase(id)}`} className="section__heading__hash">#</a>
      <h2>
        { id }
      </h2>
      {isForce && (
        <img className="section__heading__image" src={Math.random() < 0.5 ? yodaImage1 : yodaImage2} />
      )}
    </div>
  )
})