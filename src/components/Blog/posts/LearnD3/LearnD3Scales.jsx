import React, { useMemo, useState } from "react"
import { Twemoji } from "react-emoji-render"
import * as d3 from "d3"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Button from "components/_ui/Button/Button"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, ReadMore, P } from "./LearnD3"
import bookImage from "images/book.png";

const possibleConditions = [
    "rainy", "sunny", "cloudy", "stormy", "balmy", "clear"
]
const numberOfDataPoints = 4
const LearnD3Scales = ({ onScrollToSectionLocal }) => {
    const [iteration, setIteration] = useState(0)

    const weatherData = useMemo(() => {
        const today = new Date()
        return new Array(numberOfDataPoints).fill(0).map((_, i) => ({
            date: d3.timeFormat("%Y-%m-%d")(d3.timeDay.offset(today, -(numberOfDataPoints - i - 1))),
            conditions: possibleConditions[Math.floor(Math.random() * (possibleConditions.length - 1))],
            chanceOfPrecipitation: Number(d3.format("0.1f")(Math.random())),
            humidity: Number(d3.format("0.1f")(Math.random())),
        }))
    }, [iteration])

    return (
        <div className="LearnD3Scales">
            <p>
                A <b>scale</b> is an essential concept when visualizing data. To physicalize a dataset, you must turn each metric into a <b>visual feature</b>. For example, say we have this weather dataset:
            </p>

            <Button className={`RefreshButton RefreshButton--iteration-${iteration % 2}`} onClick={() => setIteration(iteration + 1)} style={refreshButtonStyle}>
                <Icon name="refresh" />
                Re-generate data
            </Button>
            <Code size="s" fileName="data.json">
                { JSON.stringify(weatherData, null, 2) }
            </Code>

            <p>
                Each item in our dataset has three metrics:
            </p>

            <List items={[
                 <><P>date</P>
                 <p>An <b>ordinal</b> variable <br /> between <P>{ weatherData[0].date }</P> and <P>{ weatherData[weatherData.length - 1].date }</P></p></>,
                 <><P>conditions</P>
                 <p>A <b>nominal</b> variable <br /> {possibleConditions.map((d, i) => (
                    <>
                        {(i == possibleConditions.length - 1) ? ", or " : !!i ? ", " : ""}
                        <P>{ d }</P>
                    </>
                 ))}</p></>,
                 <><P>chanceOfPrecipitation</P>
                 <p>A <b>continuous</b> variable <br /> between <P>0</P> and <P>1</P></p></>,
                 <><P>humidity</P>
                 <p>A <b>continuous</b> variable <br /> between <P>0</P> and <P>1</P></p></>,
            ]} />

            <Aside className="LearnD3__promo">
                <img src={bookImage} alt="book" className="LearnD3__promo__img"/>
                    <div className="LearnD3__promo__text">
                    <p>
                        Not sure about the difference between <b>ordinal</b> and <b>continuous</b> variables?
                    </p>
                    Learn more about <i>types of data</i> in the <Link href="http://fullstack.io/fullstack-d3"><b>Fullstack D3 and Data Visualization</b></Link> book.
                </div>
            </Aside>

            <p>
                Now that we know what variables we’re dealing with, we can decide <b>how to visually represent each metric</b>. For example, we could create:
            </p>

            <List items={[
                <><b>a timeline</b>, with a line’s <P>date</P> represented as horizontal position, and <P>chanceOfPrecipitation</P> represented as vertical position</>,
                <><b>a scatter plot</b> with each day’s <P>chanceOfPrecipitation</P> represented as horizontal position, and <P>humidity</P> represented as vertical position</>,
                <>we could even <b>calculate a derivative metric</b>, bucketing days with similar <P>conditions</P>, and creating a bar chart representing frequency of each <P>condition</P></>,
            ]} />

            <p>
                Great! But converting between the <b>data domain</b> and the <b>physical domain</b> can be complicated.
            </p>

            <h3>d3-scale</h3>

            <p>
                To help with these calculations, we can create <DocsLink repo="scale">d3 scales</DocsLink>. A <b>scale</b> will convert a metric’s value into the physical value we need to create our charts.
            </p>

            <p>
                For example, to convert <P>chanceOfPrecipitation</P> as horizontal position within our 500px wide chart, we could create an <b>x scale</b> like so:
            </p>

            <Code fileName="our-chart.js">
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values`}
            </Code>

            <p>
                Now we can use our <P>xScale</P> convert values between the data <b>domain</b> and the physical <b>range</b>. For example, we can find <b>how far to the right a <P>0.5</P> chanceOfPrecipitation will be</b>:
            </p>

            <Code canEval highlightedLines={[5, 6]} fileName="our-chart.js" doOnlyShowHighlightedLines>
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const pixelsToTheRight = xScale(0.5)
alert(pixelsToTheRight)`}
            </Code>

            <p>
                Exactly! A <P>chanceOfPrecipitation</P> would be 250px to the right: centered horizontally in our chart since <P>0.5</P> is halfway between the bounds of possible values (<P>0</P> and <P>1</P>).
            </p>

            <p>
                There are many types of <DocsLink repo="scale">d3 scales</DocsLink> for handling different kinds of metrics. For example, <DocsLink repo="scale" id="scaleTime" /> for handling datetimes, and <DocsLink repo="scale" id="scaleBand" /> for handling discrete metrics.
            </p>

            <p>
                <DocsLink repo="scale">d3 scales</DocsLink> have many useful methods, here are a few:
            </p>

            <List items={[
                <>
                    <DocsLink repo="scale" id="continuous_ticks">.ticks()</DocsLink>
                    <p>
                        returns an array of equally-spaced values in the output <b>range</b>. It defaults to 10 values, but you can pass a different <i>count</i> for it to aim for.
                    </p>

            <Code canEval highlightedLines={[5, 6]} fileName="our-chart.js" doOnlyShowHighlightedLines>
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const ticks = xScale.ticks()
alert(ticks)`}
            </Code>
                </>,
                <>
                    <DocsLink repo="scale" id="continuous_nice">.nice()</DocsLink>
                    <p>
                        extends the data <b>domain</b> so that it starts and ends on round values. This can make your chart friendlier to readers, since <P>250</P> is an easier number to process than <P>249.5</P>.
                    </p>
                </>,
                <>
                    <DocsLink repo="scale" id="continuous_clamp">.clamp()</DocsLink>
                    <p>
                        ensures that the scale will return a value within the <b>range</b>, even if the input is outside of the <b>domain</b>. For example, our <P>xScale</P> will, by default, return <P>1000</P> for an input of <P>2</P>.
                    </p>

            <Code canEval highlightedLines={[5, 6]} fileName="our-chart.js" doOnlyShowHighlightedLines>
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const output = xScale(2)
alert(output)`}
            </Code>
                </>,
                <>
                    <DocsLink repo="scale" id="continuous_invert">.invert()</DocsLink>
                    <p>
                        converts a value backwards, from the output <b>range</b> to the data <b>domain</b>. This comes in handy for things like surfacing a tooltip where a user’s mouse is hovering.
                    </p>

            <Code canEval highlightedLines={[5, 6]} fileName="our-chart.js" doOnlyShowHighlightedLines>
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const chanceOfPrecipitationAt250 = xScale.invert(250)
alert(chanceOfPrecipitationAt250)`}
            </Code>
                </>,
                <>
                    <DocsLink repo="scale" id="continuous_domain">.domain()</DocsLink> and <DocsLink repo="scale" id="continuous_range">.range()</DocsLink>
                    <p>
                        if we created our scale programatically, we can query what its <b>domain</b> and <b>range</b> are
                    </p>

            <Code canEval highlightedLines={[5, 6, 7]} fileName="our-chart.js" doOnlyShowHighlightedLines>
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const range = xScale.range()
const domain = xScale.domain()
alert(\`range: \${range}, \\ndomain: \${domain}\`)`}
            </Code>
                </>,
                <>
                    <DocsLink repo="scale" id="continuous_interpolate">.interpolate()</DocsLink>
                    <p>
                        something that might not be immediately obvious is that we can create a scale that converts a value into a <b>color</b>. We can use <DocsLink repo="scale" id="continuous_interpolate">.interpolate()</DocsLink> to specity the <b>color space</b> that we want our scale to function within:
                    </p>

            <Code canEval highlightedLines={[6]} fileName="our-chart.js">
{`const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range(["white", "green"]) // possible colors

const halfwayPointRgb = xScale(0.5)
xScale.interpolate(d3.interpolateHcl)
const halfwayPointHcl = xScale(0.5)
alert(\`rgb: \${halfwayPointRgb}, \\nhcl: \${halfwayPointHcl}\`)`}
            </Code>
                </>,
            ]} />

            <p>
                <DocsLink repo="scale">d3 scales</DocsLink> are a one of the most important concepts for visualizing data with d3 - make sure to familiarize yourself with them so you can convert between any data domain and the output range with ease.
            </p>

            <ReadMore id="scale" />

        </div>
    )
}

export default LearnD3Scales

const refreshButtonStyle = {
    position: "absolute",
    marginTop: "3em",
    right: "0.5em",
    paddingBottom: "0.8em",
    zIndex: "10",
}