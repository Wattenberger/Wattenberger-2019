import React, { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { range, scaleLinear } from "d3"
import { flatMap, uniqueId } from "lodash"

import Code from "components/_ui/Code/Code"
import List from "components/_ui/List/List"
import Link from "components/_ui/Link/Link"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"

import "./Hooks.scss"

const Hooks = () => {
    return (
        <div className="Hooks">
            <Helmet>
                <meta charSet="utf-8" />
                {/* <title>Interactive Charts with D3.js</title>
                <link rel="canonical" href="https://wattenberger.com/blog/d3-interactive-charts" />
                <meta property="og:type" content="website" />
                <meta name="description" content="Hi I'm Amelia Wattenberger. I'm interested in teaching data visualization, frontend development, and design." /> */}
            </Helmet>

            <h1>
                Thinking in React Hooks
            </h1>

            <div className="Hooks__content">
                <p>
                    React introduced hooks one year ago, and they've been a game-changer for a lot of developers. There are tons of how-to introduction resources out there, but I want to talk about the <b>fundamental mindset change</b> when switching from React class components to function components + hooks.
                </p>

                <SideBySide
                    sides={[{
                        description: (
                            <p>
                                With class components, we tie updates to specific <b>lifecycle events</b>.
                            </p>
                        ),
                        code:
`class Chart extends Component {
    componentDidMount() {
        // when Chart mounts, do this
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data == props.data) return
        // when data updates, do this
    }

    componentWillUnmount() {
        // before Chart unmounts, do this
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`,
                        highlightedLines: [2, 3, 4, 6, 7, 8, 9, 11, 12, 13],
                        markers: [
                            [2,3,4],
                            [6,7,8, 9],
                            [11,12,13],
                        ]
                    },{
                        description: (
                            <p>
                                In a function component, we instead use the <P>useEffect</P> hook to run code during the major <b>lifecycle events</b>.
                            </p>

                        ),
                        code:
`const Chart = ({ data }) => {
    useEffect(() => {
        // when Chart mounts, do this
        // when data updates, do this

        return () => {
            // before Chart unmounts, do this
        }
    }, [data])

    return (
        <svg className="Chart" />
    )
}`,
                        highlightedLines: [3, 4, 6, 7, 8],
                        markers: [
                            [3],
                            [4],
                            [6, 7, 8],
                        ]
                    }]}
                />

                <p>
                    Great! At this point, you might be thinking:
                </p>

                <CrossOutQuote />

                <p>
                    but that's the <b className="a3">wrong</b> way to look at it.
                </p>

                <p>
                    Hmm, let's look at a concrete example to see what the difference is. For example, what if I had a <P>getDataWithinRange()</P> function that returned a filtered dataset, based on a specified <P>timeRange</P>?
                </p>

                <SideBySide
                    sides={[{
                        description: (
                            <p>
                                With <b>lifecycle events</b>, we need to deal with all changes in one spot. Our thinking looks something like:
                                <blockquote>When our component loads, and when props change (specifically <P>timeRange</P>), update <P>data</P></blockquote>
                            </p>
                        ),
                        code:
`class Chart extends Component {
    state = {
        data: null,
    }

    componentDidMount() {
        const data = getDataWithinRange(this.props.dateRange)
        this.setState({ data })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dateRange != this.props.dateRange) {
            const data = getDataWithinRange(this.props.dateRange)
            this.setState({ data })
        }
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`,
                        highlightedLines: [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
                        markers: [
                            [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
                        ]
                    },{
                        description: (
                            <p>
                                In a function component, we need to think about <b>what values stay in-sync</b>. Each update flows more like the statement:
                                <blockquote>
                                    Keep <P>data</P> in sync with <P>timeRange</P>
                                </blockquote>
                            </p>

                        ),
                        code:
`const Chart = ({ dateRange }) => {
    const [data, setData] = useState()

    useEffect(() => {
        const data = getDataWithinRange(dateRange)
        setData(data)
    }, [dateRange])

    return (
        <svg className="Chart" />
    )
}`,
                        highlightedLines: [4, 5, 6, 7],
                        markers: [
                            [4, 5, 6, 7],
                        ]
                    }]}
                />

                <p>
                    See how much easier it is to wrap your head around the concept of <b>keeping variables in-sync</b>?
                </p>

                <SideBySide
                    sides={[{
                        description: (
                            <p>
                            </p>
                        ),
                        code:
`class Chart extends Component {
    state = {
        data: null,
    }

    componentDidMount() {
        const data = getDataWithinRange(this.props.dateRange)
        this.setState({ data })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dateRange != this.props.dateRange) {
            const data = getDataWithinRange(this.props.dateRange)
            this.setState({ data })
        }
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`,
                        // highlightedLines: [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
                        markers: [
                            [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
                        ]
                    },{
                        description: (
                            <>
                                <p>
                                    In fact, this last example was still thinking inside the class-component box. We're keeping a calculated value in our <P>state</P> in order to prevent re-calculating it every time our component updates.
                                </p>
                                <p>
                                    But we no longer need to use <P>state</P>! Here to the rescue is <Link to="https://reactjs.org/docs/hooks-reference.html#usememo"><P>useMemo()</P></Link>, which will only re-calculate <P>data</P> when its <b>dependency array</b> changes.
                                </p>
                            </>

                        ),
                        code:
`const Chart = ({ dateRange }) => {
    const data = useMemo(() => (
        getDataWithinRange(dateRange)
    ), [dateRange])

    return (
        <svg className="Chart" />
    )
}`,
                        highlightedLines: [2, 3, 4],
                        markers: [
                            [2, 3, 4],
                        ]
                    }]}
                />


                <h2>
                    Thinking about updates in-context
                </h2>

                <p>
                    Not impressed yet? Fine. Here is where this concept really shines.
                </p>

                <SideBySide
                    sides={[{
                        description: (
                            <>
                                <p>
                                    Imagine that I have many values that I need to calculate, but they depend on different <P>props</P>. For example, I need to calculate the <P>dimensions</P> of my chart when the <P>margins</P> change, and my <P>scales</P> when my <P>data</P> or <P>dimensions</P> change.
                                </p>
                            </>
                        ),
                        code:
`class Chart extends Component {
    state = {
        dimensions: null,
        xScale: null,
        yScale: null,
    }

    componentDidMount() {
        this.setState({dimensions: getDimensions()})
        this.setState({xScale: getXScale()})
        this.setState({yScale: getYScale()})
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.margins != this.props.margins) {
            this.setState({dimensions: getDimensions()})
        }
        if (prevProps.data != this.props.data) {
            this.setState({xScale: getXScale()})
            this.setState({yScale: getYScale()})
        }
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`,
                        highlightedLines: [8, 9, 10, 11, 12, ...range(15, 23)],
                        markers: [
                            [9, 16],
                            [10, 19],
                            [11, 20],
                        ]
                    },{
                        description: (
                            <>
                                <p>
                                    In our function component, we can focus on our simple statements:
                                </p>
                                <blockquote>
                                    Keep <P>dimensions</P> in sync with <P>margins</P>
                                </blockquote>
                            </>

                        ),
                        code:
`const Chart = ({ data }) => {
    const dimensions = useMemo(getDimensions, [margins])
    const xScale = useMemo(getXScale, [data])
    const yScale = useMemo(getYScale, [data])

    return (
        <svg className="Chart" />
    )
}`,
                        highlightedLines: [2, 3, 4],
                        markers: [
                            [2],
                            [3],
                            [4],
                        ]
                    }]}
                />

                <p>
                    Notice how we can use as many <P>useMemo()</P> hooks as we want - letting us keep the <b>dependencies</b> and <b>effects</b> as close as possible.
                </p>

                <h2>Looser definition of <P>state</P></h2>

                <p>
                    And what if our <P>scales</P> needed to change with our <P>dimensions</P>?
                </p>

                <SideBySide
                    sides={[{
                        description: (
                            <>
                                <p>
                                    In our class component, we'll need to compare our <P>prevState</P> and current <P>state</P>.
                                </p>
                            </>
                        ),
                        code:
`class Chart extends Component {
    state = {
        dimensions: null,
        xScale: null,
        yScale: null,
    }

    componentDidMount() {
        this.setState({dimensions: getDimensions()})
        this.setState({xScale: getXScale()})
        this.setState({yScale: getYScale()})
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.margins != this.props.margins) {
            this.setState({dimensions: getDimensions()})
        }
        if (
            prevProps.data != this.props.data
            || prevState.dimensions != this.state.dimensions
        ) {
            this.setState({xScale: getXScale()})
            this.setState({yScale: getYScale()})
        }
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`,
                        highlightedLines: [20],
                        markers: [
                            [9, 16],
                            [10, 22],
                            [11, 23],
                        ]
                    },{
                        description: (
                            <p>
                                Our hooks' <b>dependency arrays</b> don't care whether our <P>margins</P> or <P>dimensions</P> are in our <P>props</P> or <P>state</P> - a value is a value, as far as they're concerned.
                            </p>

                        ),
                        code:
`const Chart = ({ data }) => {
    const dimensions = useMemo(getDimensions, [margins])
    const xScale = useMemo(getXScale, [data, dimensions])
    const yScale = useMemo(getYScale, [data, dimensions])

    return (
        <svg className="Chart" />
    )
}`,
                        highlightedLines: [3, 4],
                        markers: [
                            [2],
                            [3],
                            [4],
                        ]
                    }]}
                />

                <h2>
                    Sharing functionity that accesses lifecycle events
                </h2>

                <p>
                    To be continued...
                </p>
{/*
                <SideBySide
                    sides={[{
                        description: (
                            <p>
                                With class components, we tie updates to specific <b>lifecycle events</b>.
                            </p>
                        ),
                        code:
`class Chart extends Component {
    componentDidMount() {
        // when Chart mounts, do this
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data == props.data) return
        // when data updates, do this
    }

    componentWillUnmount() {
        // before Chart unmounts, do this
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`,
                        highlightedLines: [2, 3, 4, 6, 7, 8, 9, 11, 12, 13],
                        markers: [
                            [2,3,4],
                            [6,7,8, 9],
                            [11,12,13],
                        ]
                    },{
                        description: (
                            <p>
                                In a function component, we instead use the <P>useEffect</P> hook to run code during the major <b>lifecycle events</b>.
                            </p>

                        ),
                        code:
`const Chart = ({ data }) => {
    useEffect(() => {
        // when Chart mounts, do this
        // when data updates, do this

        return () => {
            // before Chart unmounts, do this
        }
    }, [data])

    return (
        <svg className="Chart" />
    )
}`,
                        highlightedLines: [3, 4, 6, 7, 8],
                        markers: [
                            [3],
                            [4],
                            [6, 7, 8],
                        ]
                    }]}
                /> */}


                <h2></h2>
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
        <div className="SideBySide">
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
                {sides.map(({ name, description, code, highlightedLines, markers }, i) => (
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
                        <Code
                            key={i}
                            // theme={i > 0 ? "light" : "dark"}
                            // theme="light"
                            className="SideBySide__section__item SideBySide__code__item"
                            {...{highlightedLines}}
                            hasLineNumbers={false}
                            doWrap={false}>
                            { code }
                        </Code>
                    </>
                ))}
            </div>
        </div>
    )
}


export const P = ({ children })=> (
    <code className="P">{ children }</code>
  )


const gradients = [
["#839BEE", "#50B7D9"],
["#eba117", "#e06932"],
["#b7dd86", "#12cba3"],
["#839BEE", "#50B7D9"],
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
            <svg className="SideBySideCodeMiddle" viewBox={`0 0 ${middleWidth} ${maxLines * lineHeight}`} preserveAspectRatio="none">
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
            <svg className="SideBySideCodeMiddle__highlight" viewBox={`0 0 1 ${maxLines * lineHeight}`} preserveAspectRatio="none">
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
            <svg className="SideBySideCodeMiddle__highlight SideBySideCodeMiddle__highlight--right" viewBox={`0 0 1 ${maxLines * lineHeight}`} preserveAspectRatio="none">
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