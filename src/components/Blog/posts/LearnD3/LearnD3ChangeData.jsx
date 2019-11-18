import React, { useState } from "react"
import { Twemoji } from "react-emoji-render"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { ReadMore } from "./LearnD3"
import bookImage from "images/book.png";

const LearnChangeData = ({ onScrollToSectionLocal }) => {
    return (
        <div className="LearnChangeData">
            <p>
                Now that we've grabbed our data, we need to cajole it into a format that we can work with. <b>d3</b> has a module that comes in very handy when transforming and querying data:
            </p>

            <h3>d3-array</h3>

            <p>
                Let's start by talking about <i>what <Link href="https://github.com/d3/d3-array"><b>d3-array</b></Link> doesn't cover</i>:
            </p>

            <List icon={<Icon style={{ color: "#e6672d" }} className="List__item__icon" name="x" />} items={[
                <>
                    <b>Expensive data manipulation</b>
                    <p>
                        This should really happen before we access data on our website, since long-running tasks can slow down our users' devices (especially if they're using an older phone)
                    </p>
                </>,
                <>
                    <b>Native Javascript methods</b>
                    <p>
                        Vanilla Javascript is pretty powerful these days - there are many methods already available in browsers that can help with transforming data. <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype">Here is a full list of Array methods.</Link>
                    </p>
                    <p>
                        Some of these methods were covered in <Link href="https://github.com/d3/d3-collection"><b>d3-collection</b></Link>, which is now deprecated because we don't need a special library anymore!  <Twemoji svg text=":confetti_ball:" />
                    </p>
                </>,
            ]} />

            <p>
                So what <i>can</i> we do with <Link href="https://github.com/d3/d3-array"><b>d3-array</b></Link>?
            </p>

            <h5>Basic statistics</h5>

            <p>
                There are 11 methods in <Link href="https://github.com/d3/d3-array"><b>d3-array</b></Link> that help answer basic questions about a dataset.
            </p>

            <p>
                The methods that probably get the most use are the ones that will find the highest and lowest value (<P>d3.max()</P> / <P>d3.min()</P>), and the method that returns the extremes (<P>d3.extent()</P>). These come in handy when creating a <b>scale</b> (which we cover in the <Link to="#converting-between-data-domains" onClick={onScrollToSectionLocal("converting-between-data-domains")}>Modules for converting between data domains</Link> section).
            </p>

            <p>
                There are also methods for finding other statistics, like <P>d3.mean()</P>, <P>d3.median()</P>, <P>d3.quantile()</P>, <P>d3.variance()</P>, and <P>d3.deviation()</P>.
            </p>

            <p>
                To use any of these methods, we want to call it with two parameters:
            </p>

            <List items={[
                <>
                    <b>our dataset</b>
                    <p>The first parameter needs to be an array containing the values we're interested in</p>
                </>,
                <>
                    <b>an accessor function</b> (optional)
                    <p>The second parameter will tell <b>d3</b> <i>how to find a value within one data point</i>. This defaults to an identity function (<P>d => d</P>), which means that this parameter is unnecessary if our <b>dataset</b> is an array of values.</p>
                </>,
            ]} hasNumbers />

            <p>
                For example, let's find the <b>mean</b> of this list of temperatures:
            </p>

            <Code canEval fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
                {`const dataset = [{
    date: "2019-10-10",
    temp: 10,
},{
    date: "2019-10-11",
    temp: 12,
}]

const mean = d3.mean(dataset, d => d.temp)
alert(mean)`}
            </Code>

            <h5>
                Questions about order
            </h5>

            <p>
                <b>d3-array</b> can also help with finding specific items in an array in two main ways:
            </p>

            <List items={[
                <>
                    <b>Find the item with the smallest value.</b>
                    <p>
                        <DocsLink id="least" /> will return the item and <DocsLink id="leastIndex" /> will return the item's index.
                    </p>
                </>,
                <>
                    <b>Find the item <i>nearest to</i> a specific value.</b>
                    <p>
                        <DocsLink id="bisect" /> will take a sorted array and a value and return the <i>index at which the value would fit</i>.
                    </p>
                    <p>
                        For example, we can find where the number <P>12</P> would fit in this array:
                    </p>
                    <Code canEval fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>}>
{`const array = [10, 20, 30, 40, 50, 60]
const nearestValueIndex = d3.bisect(array, 12)
alert(nearestValueIndex) // is 1
// compiled array: [10, 12, 20, 30...]`}
                    </Code>
                    <p>
                        There are a few similar <b>bisect</b> functions for things like using an accessor or comparator function (<DocsLink id="bisector" />) or specifying whether you want the index to be lower than (<DocsLink id="bisectLeft" />) or higher than (<DocsLink id="bisectRight" />) existing matching values.
                    </p>
                    <Aside icon="tooltip">
                        <Icon className="Aside__icon" name="asterisk" size="l" style={{
                            top: "1.16em",
                            left: "-0.13em",
                            strokeWidth: 0,
                            fill: "#bdbdcf"
                        }} />
                        These <b>bisector</b> functions are very handy when creating tooltips - finding the closest point to the user's cursor is a great way to make a chart easy to interact with.
                    </Aside>
                    <p>
                        There are also two handy comparator functions that you can use: <DocsLink id="ascending" /> and  <DocsLink id="descending" />
                    </p>
                </>,
            ]} />

            <h5>
                Transformations
            </h5>

            <p>
                There are a handful of <b>d3-array</b> functions that would look at home in a utility library like <Link href="https://lodash.com/">Lodash</Link>. These allow you to do things like:
            </p>

            <List items={[
                <>
                    Group a list of objects by a specific key: <DocsLink id="group" /> returned the grouped objects and <DocsLink id="rollup" /> returned the grouped indices
                </>,
                <>
                    Create a list of permutations of two arrays: <DocsLink id="cross" />
                </>,
                <>
                    Create a new array by pulling items at specific indices or keys: <DocsLink id="permute" />
                </>,
                <>
                    Shuffle the items of array: <DocsLink id="shuffle" />
                </>,
                <>
                    Create an array counting between two numbers: <DocsLink id="range" />
                </>,
                <>
                    Zip two arrays: <DocsLink id="zip" />
                </>,
            ]} />

            <Aside>
                <b>Note that some of these methods aren't yet available in the core d3 package.</b>
                <InlineExpandy description="new packages">
                    <DocsLink id="quickselect" />, <DocsLink id="group" />, <DocsLink id="rollup" />, <DocsLink id="bin" />, <DocsLink id="count" />, <DocsLink id="minIndex" />, <DocsLink id="maxIndex" />, <DocsLink id="least" />, <DocsLink id="leastIndex" />, <DocsLink id="groups" />, <DocsLink id="rollups" />
                </InlineExpandy>
                <p>
                    To check this yourself, the module versions are in <Link href="https://github.com/d3/d3/blob/master/package.json#L42-L72">the main d3 packages.json file</Link> and the Changelog for a module is in <Link href="https://github.com/d3/d3-array/releases">its Releases list</Link>.
                </p>
                <p>
                    In order to use these new methods, make sure that you're importing <b>d3-array</b>, version 2+.
                </p>
            </Aside>

            <h5>
                Binning
            </h5>

            <p>
                There is also <Link href="https://github.com/d3/d3-array#bins">a group of <b>d3-array</b> methods</Link> that will chunk a dataset into bins. This is really helpful for creating bucketed charts like <Link href="https://en.wikipedia.org/wiki/Histogram">histograms</Link>.
            </p>

            <h3>d3-random</h3>

            <p>
                Sometimes data visualization requires random numbers - like when you need to generate test data. I've also used random numbers to add jitter to help space out points on a chart -- helpful as long as it's clear that the jitter doesn't represent any data!
            </p>

            <p>
                Our browsers have a built-in <P>Math.random()</P> function, which is good for simple use-cases. But what if you want your random data to have structure?
            </p>
            <p>
                <b>d3-random</b> lets you create random numbers with specific distributions. For example, the normal distribution (<Link href="https://github.com/d3/d3-random#randomNormal"><P>d3.randomNormal()</P></Link>) is helpful for generating numbers that are <b>normally distributed</b> around a specific value.
            </p>

            <p>
                For example, this abandoned prototype is using <P>d3.randomNormal()</P> to space out moving "dashes" so that they are mostly grouped around a single vector, but some are further out to make the traffic a bit easier to parse.
            </p>

            <video autoplay="" loop={true} muted={true} style={{
                width: "20em",
                maxWidth: "100%",
            }}>
                <source src="https://video.twimg.com/tweet_video/D6vJcd7XsAAus4b.mp4" type="video/mp4" />
            </video>

            <h3>Others?</h3>

            <p>
                These modules are explicitly devoted to creating/manipulating data, but there are also specific methods in other modules that are catered towards a specific type of visualization.
            </p>
            <p>
                For example, <Link href="https://github.com/d3/d3-hierarchy"><b>d3-hierarchy</b></Link> has a method (<P>d3.hierarchy()</P>) that will convert data into a specific nested structure that it can then visualize.
            </p>

            <p>
                We'll talk more about these use-case driven data manipulation functions in the <Link to="#specific-visualizations" onClick={onScrollToSectionLocal("specific-visualizations")}>Modules for specific visualizations</Link> section.
            </p>

            {/* <ReadMore id="dsv" /> */}

        </div>
    )
}

export default LearnChangeData


const P = ({ children }) => (
    <code className="P">{children}</code>
)


const DocsLink = ({ id }) => (
    <Link href={`https://github.com/d3/d3-array#${id}`}>
        <P>
            d3.{id}()
        </P>
    </Link>
)