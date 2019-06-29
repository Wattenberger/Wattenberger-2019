import React, { useState } from "react"
import { Twemoji } from "react-emoji-render"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { ReadMore } from "./LearnD3"
import bookImage from "images/book.png";
import constructionGif from "./construction.gif";

const LearnChangeData = () => {
    return (
        <div className="LearnChangeData">
            <p>
                Now that we've grabbed our data, we need to cajole it into a format that we can work with. <b>d3</b> has a module that comes in very handy when transforming and querying data:
            </p>

            <h3>d3-array</h3>

            <p>
                Let's start by talking about <i>what <Link href="https://github.com/d3/d3-array"><b>d3-array</b></Link> doesn't cover</i>:
            </p>

            <List icon={<Icon style={{color: "#e6672d"}} className="List__item__icon" name="x" />} items={[
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
                The methods that probably get the most use are the ones that will find the highest and lowest value (<P>d3.max()</P> / <P>d3.min()</P>), and the method that returns the extremes (<P>d3.extent()</P>). These come in handy when creating a <b>scale</b> (which we cover in the <Link href="#converting-between-data-domains">Modules for converting between data domains</Link> section).
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

            <h5>
                Transformations
            </h5>

            <h5>
                Binning
            </h5>

            <img alt="under construction" src={constructionGif} />
            <Aside>
                This section is under construction.
            </Aside>


            {/* <ReadMore id="dsv" /> */}

        </div>
    )
}

export default LearnChangeData


const P = ({ children })=> (
    <code className="P">{ children }</code>
)
