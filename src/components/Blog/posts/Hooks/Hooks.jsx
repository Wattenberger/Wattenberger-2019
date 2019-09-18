import React, { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { format, mean, scaleLinear } from "d3"
import { flatMap, uniqueId } from "lodash"

import Code from "components/_ui/Code/Code"
import Expandy from "components/_ui/Expandy/Expandy"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Link from "components/_ui/Link/Link"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"
import { customHooks, P, codeExamples } from "./examples"
import metaImage from "./../d3.png";

import "./Hooks.scss"

const sortedCustomHooks = customHooks.sort((a,b) => b.code ? 1 : -1)
const diff = mean(codeExamples.map(e => e[1].code.split("\n").length / e[0].code.split("\n").length))

const Hooks = () => {
    return (
        <div className="Hooks">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Thinking in React Hooks</title>
                <link rel="canonical" href="https://wattenberger.com/blog/react-hooks" />
                <meta property="og:type" content="website" />
                <meta name="description" content="React introduced hooks one year ago, and they've been a game-changer for a lot of developers. There are tons of how-to introduction resources out there, but I want to talk about the fundamental mindset change when switching from React class components to function components + hooks." />
                <meta name="image" content={metaImage} />
            </Helmet>

            <h1>
                Thinking in React Hooks
            </h1>

            <div className="Hooks__content">
                <p>
                    React introduced hooks one year ago, and they've been a game-changer for a lot of developers. There are tons of how-to introduction resources out there, but I want to talk about the <b>fundamental mindset change</b> when switching from React class components to function components + hooks.
                </p>

                <SideBySide
                    sides={codeExamples[0]}
                />

                <p>
                    Great! At this point, you might be thinking:
                </p>

                <CrossOutQuote />

                <p>
                    but that's the <b className="a3">wrong</b> way to look at it.
                </p>

                <p>
                    Hmm, let's look at a concrete example to see what the difference is. For example, what if we have a <b>computationally expensive</b> <P>getDataWithinRange()</P> function that returns a filtered dataset, based on a specified <P>dateRange</P>?
                    Because <P>getDataWithinRange()</P> takes some time to run, we'll want to store it in our component's <P>state</P> object and only update it when <P>dateRange</P> changes.
                </p>

                <SideBySide
                    sides={codeExamples[1]}
                />

                <p>
                    See how much easier it is to wrap your head around the concept of <b>keeping variables in-sync</b>?
                </p>

                <SideBySide
                    sides={codeExamples[2]}
                />


                <h2>
                    Thinking about updates in-context
                </h2>

                <p>
                    Not impressed yet? Fine.
                    <br />
                    Here is where this concept really shines.
                </p>

                <SideBySide
                    sides={codeExamples[3]}
                />

                <h2>Looser definition of <P>state</P></h2>

                <p>
                    Okay! Moving on -- what if our <P>scales</P> needed to change based on the <P>dimensions</P> of our chart?
                </p>

                <SideBySide
                    sides={codeExamples[4]}
                />

                <h2>
                    Keeping code concise
                </h2>

                <p>
                    Shorter code isn't necessarily easier to read, but keeping our components as clutter-free as possible is definitely a win!
                </p>

                <p>
                    Let's quickly compare the length of the examples we've just read:
                </p>

                <div className="Hooks__code-examples">
                    {codeExamples.map((example, i) => (
                        <div className="Hooks__code-examples__item" key={i}>
                            { example.map(({ code, markers }, codeI) => (
                                <div className="Hooks__code-examples__item__code" key={codeI} style={{
                                    height: `${code.split("\n").length * 0.5}em`
                                }}>
                                    <div className="Hooks__code-examples__item__code__text">
                                        { code.split("\n").length } lines
                                    </div>
                                </div>
                            )) }
                        </div>
                    ))}
                </div>

                <p>
                    Hey! Our <b>function components</b> are, on average, <b>{ format(".1%")(diff) }</b> of the length of their <b>class component</b> counterparts.
                </p>
                <p>
                    Additionally, let's highlight each of the code changes across the two versions:
                </p>

                <div className="Hooks__code-examples">
                    {codeExamples.map((example, i) => (
                        <div className="Hooks__code-examples__item" key={i}>
                            { example.map(({ code, markers }, codeI) => (
                                <div className="Hooks__code-examples__item__code" key={codeI} style={{
                                    height: `${code.split("\n").length * 0.5}em`
                                }}>
                                    <div className="Hooks__code-examples__item__code__text">
                                        { code.split("\n").length } lines
                                    </div>

                                    {markers.map((markerLines, markerI) => (
                                        markerLines.map(line => (
                                            <div className="Hooks__code-examples__item__code__marker" key={line} style={{
                                                background: gradients[markerI][1],
                                                top: `${line * 0.5}em`,
                                            }} />
                                        ))
                                    ))}
                                </div>
                            )) }
                        </div>
                    ))}
                </div>

                <p>
                    We can see how we're keeping each concern separate from its friends - grouping by concern instead of by lifecycle event.
                </p>

                <h2>
                    Sharing more complex functionality
                </h2>

                <p>
                    We've always had the ability to share utility functions between components, but they never had access to the components' lifecycle events. Sure, we had tricks like <Link to="https://reactjs.org/docs/higher-order-components.html">Higher-Order Components</Link>, but they often felt like more trouble than they were worth, and cluttered up our <P>render</P> functions.
                </p>

                <p>
                    In every project I'm currently working on, I have a library of simple hooks that just make my life easier. In my experience, the main benefits of being able to share complex code are:
                </p>

                <List items={[
                    <>
                        not having to re-write common patterns like keeping svg <P>dimensions</P> in-sync with a wrapper element. This one especially was <b>lots</b> of code that was a pain to replicate for every chart
                    </>,
                    <>
                        KISS - letting me think through each pattern <b>one time</b>, ensuring that I didn't miss anything like cleaning up an event listener
                    </>,
                ]} />

                <p>
                    Okay, Amelia, I get it. Let's get to the meat of the matter - here is <b>a collection of hooks</b> that I've been really appreciating these days.
                </p>

                <h2>
                    Custom hooks that I ♥
                </h2>

                <div className="Hooks__examples">
                    {sortedCustomHooks.map(({ name, description, code, url }) => (
                        !code ? (
                            <Link to={url} className="Hooks__examples__item Hooks__examples__item--link" key={name}>
                                <div className="Hooks__examples__item__trigger">
                                    <div className="Hooks__examples__item__name">
                                        { name }
                                    </div>
                                    <div className="Hooks__examples__item__description">
                                        { description }
                                    </div>
                                    <div className="Hooks__examples__item__link">
                                        { getDomainFromUrl(url) }
                                    </div>
                                </div>
                                <Icon name="arrow" direction="e" />
                            </Link>
                        ) : (
                            <Expandy
                                key={name}
                                className="Hooks__examples__item"
                                trigger={
                                    <div className="Hooks__examples__item__trigger">
                                        <div className="Hooks__examples__item__name">
                                            { name }
                                        </div>
                                        <div className="Hooks__examples__item__description">
                                            { description }
                                        </div>
                                    </div>
                                }
                                triggerExpandText="show me the code"
                            >
                                <Code fileName={name} size="s">
                                    { code }
                                </Code>
                            </Expandy>
                        )
                    ))}
                </div>

                <h2>
                    More learnings about React Hooks
                </h2>

                <div className="Hooks__resources">
                    {resources.map(({ name, description, url }) => (
                        <Link to={url} className="Hooks__resources__item" key={name}>
                            <div className="Hooks__resources__item__trigger">
                                <div className="Hooks__resources__item__name">
                                    { name }
                                </div>
                                <div className="Hooks__resources__item__description">
                                    { description }
                                </div>
                                <div className="Hooks__resources__item__link">
                                    { getDomainFromUrl(url) }
                                </div>
                            </div>
                            <Icon name="arrow" direction="e" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hooks;

const names = [
    "Class component",
    "Function component",
]
const SideBySide = ({ sides }) => {
    return (
        <div className={`SideBySide SideBySide--is-${sides.filter(d => d.afterCodeText).length > 0 ? "inline" : "stretched"}`}>
            <div className="SideBySide__section SideBySide__titles">
                {sides.map(({ name }, i) => (
                    <h6 className="desktop SideBySide__section__item SideBySide__titles__item" key={i}>
                        { name || names[i] }
                    </h6>
                ))}
            </div>
            <div className="SideBySide__section SideBySide__descriptions">
                {sides.map(({ description }, i) => (
                    <div className="desktop SideBySide__section__item SideBySide__descriptions__item" key={i}>
                        { description }
                    </div>
                ))}
            </div>
            <div className="SideBySide__section SideBySide__code">
                {sides.map(({ name, description, code, highlightedLines, markers, afterCodeText }, i) => (
                    <>
                        <h6 className="mobile SideBySide__titles__item">
                            { name || names[i] }
                        </h6>
                        <div className="mobile SideBySide__descriptions__item">
                            { description }
                        </div>
                        {!!i && (
                            <SideBySideCodeMiddle
                                markers={[
                                    sides[i - 1].markers,
                                    markers,
                                ]}
                                maxLines={Math.max(
                                    code.split("\n").length,
                                    sides[i - 1].code.split("\n").length
                                )}
                            />
                        )}
                        <div className="SideBySide__code__item">
                            <Code
                                key={i}
                                // theme={i > 0 ? "light" : "dark"}
                                // theme="light"
                                className={`SideBySide__section__item SideBySide__code__item`}
                                {...{highlightedLines}}
                                hasLineNumbers={false}
                                doWrap={false}>
                                { code }
                            </Code>
                            <div className="SideBySide__after__item">
                                { afterCodeText }
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}

const gradients = [
["#50B7D9", "#6668ec"],
["#eba117", "#e06932"],
["#bde06c", "#12cba3"],
["#e460a2", "#983dd4"],
]
const lineHeight = 1
const middleWidth = 1
const SideBySideCodeMiddle = ({ markers, maxLines })=> {
    const [hoveredGroup, setHoveredGroup] = useState()

    const consolidatedMarkers = useMemo(() => (
        markers[0].map((firstGroup, i) => {
            const secondGroup = markers[1][i]
            return {
                // leftTop: firstGroup[0] - 1,
                // leftBottom: firstGroup[firstGroup.length - 1] - 1,
                // rightTop: secondGroup[0] - 1,
                // rightBottom: secondGroup[secondGroup.length - 1] - 1,
                firstGroup,
                secondGroup,
                paths: flatMap(firstGroup.map(a => (
                    flatMap(secondGroup.map(b => (
                        generatePath(a - 1, b - 1)
                    )))
                ))),
            }
        })
    ), [markers, maxLines])

    const uniqId = useMemo(uniqueId, [])

    return (
        <div className="desktop SideBySideCodeMiddle-wrapper">
            <svg className="SideBySideCodeMiddle" viewBox={`0 0 ${middleWidth} ${maxLines * lineHeight}`} preserveAspectRatio="none" height={`${maxLines * 1.8}em`}>
                <defs>
                    {gradients.map((colors, i) => (
                        <linearGradient x1="0" x2="100%" id={`middle-${uniqId}-${i}`} gradientUnits="userSpaceOnUse" key={i}>
                            <stop stopColor={colors[0]} />
                            <stop stopColor={colors[1]} offset="100%" />
                        </linearGradient>
                    ))}
                    <clipPath id={`${uniqId}-clip`}>
                        <rect width={middleWidth} height={maxLines * lineHeight} />
                    </clipPath>
                </defs>

                {consolidatedMarkers.map(({ paths, firstGroup, secondGroup }, markerI) => (
                    <g className={[
                        "SideBySideCodeMiddle__group",
                        `SideBySideCodeMiddle__group--is-${
                            hoveredGroup == markerI ? "hovering" :
                            Number.isFinite(hoveredGroup) ? "hovering-other" :
                            "normal"
                        }`,
                     ].join(" ")}
                     key={markerI}
                     style={{clipPath: `url(#${uniqId}-clip)`}}
                     fill={`url(#middle-${uniqId}-${markerI})`}
                     onMouseEnter={() => setHoveredGroup(markerI)}
                     onMouseLeave={() => setHoveredGroup(null)}>
                        {paths.map((d, i) => (
                            <path
                                className={`SideBySideCodeMiddle__marker SideBySideCodeMiddle__marker--i-${markerI}`}
                                d={d}
                            />
                        ))}
                    </g>
                ))}
            </svg>
            <svg className="SideBySideCodeMiddle__highlight" viewBox={`0 0 1 ${maxLines * lineHeight}`} preserveAspectRatio="none" height={`${maxLines * 1.8}em`}>
                {consolidatedMarkers.map(({ paths, firstGroup, secondGroup }, markerI) => (
                    <g className={[
                        "SideBySideCodeMiddle__highlight__group",
                        `SideBySideCodeMiddle__highlight__group--is-${
                            hoveredGroup == markerI ? "hovering" :
                            Number.isFinite(hoveredGroup) ? "hovering-other" :
                            "normal"
                        }`,
                        ].join(" ")}
                        key={markerI}
                        style={{clipPath: `url(#${uniqId}-clip)`}}
                        fill={gradients[markerI][0]}>
                        {firstGroup.map((d, i) => (
                            <rect
                                key={i}
                                className={`SideBySideCodeMiddle__highlight__marker`}
                                x={0}
                                width={1}
                                y={(d - 1) * lineHeight - 0.01}
                                height={lineHeight + 0.02}
                            />
                        ))}
                    </g>
                ))}
            </svg>
            <svg className="SideBySideCodeMiddle__highlight SideBySideCodeMiddle__highlight--right" viewBox={`0 0 1 ${maxLines * lineHeight}`} preserveAspectRatio="none" height={`${maxLines * 1.8}em`}>
                {consolidatedMarkers.map(({ paths, firstGroup, secondGroup }, markerI) => (
                    <g className={[
                        "SideBySideCodeMiddle__highlight__group",
                        `SideBySideCodeMiddle__highlight__group--is-${
                            hoveredGroup == markerI ? "hovering" :
                            Number.isFinite(hoveredGroup) ? "hovering-other" :
                            "normal"
                        }`,
                        ].join(" ")}
                        key={markerI}
                        style={{clipPath: `url(#${uniqId}-clip)`}}
                        fill={gradients[markerI][1]}>
                        {secondGroup.map((d, i) => (
                            <rect
                                key={i}
                                className={`SideBySideCodeMiddle__highlight__marker`}
                                x={0}
                                width={1}
                                y={(d - 1) * lineHeight - 0.01}
                                height={lineHeight + 0.02}
                            />
                        ))}
                    </g>
                ))}
            </svg>
        </div>
    )
}

const curveAmount = 0.3
const generatePath = (a, b) => {
    return pointsToPath([
        // ["M", -10000, (a * lineHeight) - 0.01],
        ["M", 0, (a * lineHeight) - 0.01],
        ["L", 0, (a * lineHeight) - 0.01],
        ["C"],
        [middleWidth * curveAmount, (a * lineHeight) - 0.01],
        [middleWidth * (1 - curveAmount), (b * lineHeight) - 0.01],
        [middleWidth, (b * lineHeight) - 0.01],
        // ["L", 10000, (b * lineHeight) - 0.01],
        // ["L", 10000, ((b + 1) * lineHeight) + 0.01],
        ["L", middleWidth, ((b + 1) * lineHeight) + 0.01],
        ["C"],
        [middleWidth * (1 - curveAmount), ((b + 1) * lineHeight) + 0.01],
        [middleWidth * curveAmount, ((a + 1) * lineHeight) + 0.01],
        [0, ((a + 1) * lineHeight) + 0.01],
        ["L", 0, ((a + 1) * lineHeight) + 0.01], ,
        // ["L", -10000, ((a + 1) * lineHeight) + 0.01], ,
        ["Z"],
    ])
}

const pointsToPath = points => (
    points.map(d => d.join(" ")).join(" ")
)

const resources = [{
    url: "https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889",
    name: "Making Sense of React Hooks",
    description: "A great introduction to the concept of hooks and how they're implemented."
},{
    url: "https://tylermcginnis.com/why-react-hooks/",
    name: "Why React Hooks?",
    description: "A look at the historical ways to create React components, and some problems that hooks solve.",
},{
    url: "https://reactjs.org/docs/hooks-overview.html",
    name: "Hooks at a Glance",
    description: "An overview of the different types of built-in hooks.",
},{
    url: "https://overreacted.io/a-complete-guide-to-useeffect/",
    name: "A Complete Guide to useEffect",
    description: "A very in-depth article on hooks-thinking and gotchas.",
},{
    url: "https://www.fullstackreact.com/",
    name: "Fullstack React",
    description: <>If you like learning from books, I've heard great things about this one. Plus, there is a new chapter on React Hooks, since <b>Newline</b> is really good about keeping their books up-to-date.</>,
}]

const scratchPercentScale = scaleLinear()
  .domain([0.4, 0.6])
  .range([0, 1])
  .clamp(true)

const CrossOutQuote = () => {
    const [isInView, setIsInView] = useState(false)
    const [scratchPercent, setScratchPercent] = useState(0)
    const scrollStartOffset = useRef(0)

    useEffect(() => {
        const onScroll = () => {
          const offset = (scrollStartOffset.current - window.scrollY) / window.innerHeight
          const absOffset = offset > 0 ? 1 - offset : Math.abs(offset)
          const scratchPercent = scratchPercentScale(absOffset)

          setScratchPercent(scratchPercent)
        }

        if (isInView) {
            scrollStartOffset.current = window.scrollY
            window.addEventListener("scroll", onScroll)
        } else {
            window.removeEventListener("scroll", onScroll)
        }
        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    }, [isInView])

    return (
        <ScrollEvent
          className="CrossOutQuote"
          isInViewChange={status => {
            setIsInView(status == 0)
          }}
          hasIndicator={false}
          thresholdPercent={0}>
            <blockquote>
              <svg
                  className="CrossOutQuote__scratch"
                  viewBox="0 0 1770 198"
                  preserveAspectRatio="none"
                >
                  <path
                    d={scratchPath}
                    style={{
                        strokeDashoffset: `${5000 - (scratchPercent * 5000)}px`
                    }}
                  />
                </svg>

                Got it, so <P>useEffect()</P> is just a new way to hook into lifecycle events!
            </blockquote>
        </ScrollEvent>
    )
}

const scratchPath = "M1 121C22.2555 125.831 38.1827 141.224 60.3333 144.778C86.9413 149.046 115.913 138.373 139 126.222C183.185 102.967 225.056 75.2475 269 51.4444C287.803 41.2594 322.06 28.3653 338.778 48.3333C357.202 70.3399 346.595 99.2786 330 118.444C323.617 125.817 316.62 133.363 308.333 138.667C299.538 144.296 310.363 120.711 311 119.222C324.632 87.3462 359.731 58.8025 395.444 58C435.973 57.0892 441.809 97.9021 437.889 129C435.878 144.953 443.593 134.344 449.667 126.111C468.21 100.979 486.975 75.9876 509.667 54.3333C532.234 32.7971 565.748 6.45343 599.556 14.4444C643.628 24.8614 613.092 99.3831 597.889 123.667C590.618 135.28 572.919 148.393 583.111 124.222C602.214 78.9205 630.983 40.6786 674.111 15.3333C695.592 2.70944 729.074 -10.7168 745 17.4444C764.124 51.2611 752.606 100.751 738.778 134.333C733.629 146.838 726.023 159.873 716.778 169.889C713.467 173.475 714.656 170.425 715.889 167.889C720.492 158.422 726.362 149.521 731.667 140.444C742.219 122.389 752.837 104.632 765.778 88.1111C789.395 57.962 820.652 22.2526 859.222 11.6666C881.849 5.45652 912.181 6.36074 925.444 29.2222C935.559 46.656 932.402 73.3337 929.667 92.1111C926.691 112.533 918.691 130.671 907.889 148.111C898.868 162.674 882.123 193.437 862.889 196.889C852.862 198.689 859.163 177.56 859.778 174.889C866.701 144.799 882.918 117.633 900.778 92.7777C915.117 72.8214 932.56 55.8815 952.778 41.8888C985.708 19.0984 1037.47 -10.4418 1079 4.77774C1130.47 23.6391 1108.4 107.539 1095.22 144.111C1090.57 157.022 1083.97 168.295 1074.33 178.111C1072.01 180.477 1062.32 191.604 1061.44 182.111C1057.52 139.613 1089.64 90.3545 1115.89 60.4444C1135.54 38.0545 1161.75 15.4749 1190.89 6.99996C1226.52 -3.36081 1259.88 13.697 1272.78 48.1111C1283.14 75.7729 1286.83 105.783 1269 131C1267.47 133.169 1224.51 182.019 1222.33 167.889C1220.49 155.899 1227.51 137.452 1231.89 126.556C1241.75 102.029 1258.88 77.3959 1278.67 59.8888C1297.17 43.5125 1321.16 32.3399 1344.67 25.3333C1373.22 16.8233 1394.36 29.2511 1413.44 51C1434.94 75.4993 1431.6 117.459 1419.11 145.556C1410.97 163.876 1410.35 152.19 1414 138C1428 83.483 1478.39 29.2523 1538.78 31C1590.63 32.5004 1609.27 92.0133 1645.56 118.556C1683.35 146.199 1727.06 138.587 1769 129"

const getDomainFromUrl = (url="") => (
    url.split("//").slice(-1)[0].split("/")[0]
)