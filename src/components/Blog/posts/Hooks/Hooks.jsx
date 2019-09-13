import React from "react"
import { Helmet } from "react-helmet"

import Code from "components/_ui/Code/Code"

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
                    React introduced hooks one year ago, and they've been a game-changer for a lot of developers. There are tons of how-to introduction resources out there, but I want to talk about the <b>fundamental mindset change</b> when switching from React class components to functional components + hooks.
                </p>

                <p>
                    With class components, we tie updates to specific <b>lifecycle events</b>.
                </p>

                <Code highlightedLines={[2, 3, 4, 6, 7, 8, 10, 11, 12]}>
{`class Chart extends Component {
    onComponentDidMount() {
        // when Chart mounts, do this
    }

    onComponentWillUnmount() {
        // before Chart unmounts, do this
    }

    onComponentDidUpdate() {
        // when Chart props/state update, do this
    }

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`}
                </Code>

                <p>
                    With functional components, we can use hooks to <i>react to specific changes</i>. Our updates are more closely linked to the fundamental logic.
                </p>

                <Code highlightedLines={[2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14]}>
{`const Chart = ({ data }) => {
    useEffect(() => {
        // when Chart mounts, do this

        return () => {
            // before Chart unmounts, do this
        }
    }, [data])

    const xScale = useMemo(() => {
        // calculate xScale when Chart mount
        // re-calculate xScale when data changes
        return d3.scaleLinear()
    }, [data])

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`}
                </Code>

                <p>
                    Here's one of the main changes:
                    <br />
                    <b>
                        instead of putting all updates in one place, we can deal with each change individually
                    </b>
                </p>

                <Code highlightedLines={[3, 5, 9, 11, 13, 14, 15, 16]}>

{`const Chart = ({ data, width }) => {
    useEffect(() => {
        createEventListeners()
        return () => {
            removeEventListeners()
        }
    }, [data])

    const xScale = useMemo(() => d3.scaleLinear(), [data])

    const yScale = useMemo(() => d3.scaleTime(), [data])

    const dimensions = useMemo(() => ({
        width,
        height: width / 2,
    }), [width])

    render() {
        return (
            <svg className="Chart" />
        )
    }
}`}
                </Code>
            </div>
        </div>
    )
}

export default Hooks;