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

const LearnD3GetData = () => {
    return (
        <div className="LearnD3GetData">
            <p>
                What's the first thing we need to do when visualizing data?
            </p>

            <p>
                Get the data, of course!
            </p>

            <p>
                There are many ways to get access to data on a web page: anywhere from hardcoding it in your Javascript file to querying a database.
            </p>

            <p>
                One of the simplest ways is to store it in a static file and <i>fetch</i> it.
            </p>

            <p>
                While we could use the native Javascript APIs to fetch text from a file, we would need to parse it by ourselves.
            </p>

            <h3>d3-fetch</h3>

            <p>
                <Link href="https://github.com/d3/d3-fetch"><b>d3-fetch</b></Link> provides some utility methods that will fetch data from a file and parse it into a Javascript object.
            </p>

            <p>
                <b>d3-fetch</b> is able to parse files with several different data formats:
            </p>

            <List items={[
                <>
                    <b style={{display: "inline-block", width: "2.2em"}}>json</b> <Link href="https://github.com/d3/d3-fetch#json"><Icon name="arrow" size="s" direction="ne" /></Link>
                    <p>
                        <Link href="https://en.wikipedia.org/wiki/JSON">JSON</Link> (JavaScript Object Notation) is a file format that looks very much like a typical Javascript object.
                    </p>
                    <Code size="s">
{`{
  "items": [{
    "date": "2018-10-10",
    "weather": "cloudy",
  },{
    "date": "2018-10-11",
    "weather": "sunny",
  }]
}`}
                    </Code>
                    <p>
                        JSON files can be easy to read, since they read kind of like normal speech (<i>weather is sunny</i>). They are also very flexible and able to represent nested data structures.
                    </p>
                </>,
                <>
                    <b style={{display: "inline-block", width: "2.2em"}}>dsv</b> <Link href="https://github.com/d3/d3-fetch#dsv"><Icon name="arrow" size="s" direction="ne" /></Link>
                    <p>
                        <Link href="">DSV</Link> (delimiter-separated values) is a file format that mimics a classic table. The first row of text says what the columns are, and the rest of the lines are "row"s of data.
                    </p>
                    <Code size="s">
{`date, weather
2018-10-10, cloudy
2018-10-11, sunny`}
                    </Code>

                    <p>
                        Each column is separated by a specific <b>delimiter</b>.
                    </p>
                    <p>
                        D3 allows you to specify the <b>delimiter</b>, but also has specific methods for the two most common types:
                    </p>
                    <p>
                        <b>comma-separated values</b> (<Link href="https://github.com/d3/d3-fetch#csv">csv</Link>), and
                        <br />
                        <b>tab-separated values</b> (<Link href="https://github.com/d3/d3-fetch#tsv">tsv</Link>).
                    </p>

                    <p>
                        While dsv files might be a bit harder to read, they are much smaller than json files, since they don't repeat the column names -- just compare the two tiny examples above.
                    </p>

                    <Aside>
                        In the past, I've needed to convert data between the two formats -- there's a great tool called <Link href="https://www.csvjson.com/csv2json">CSV2JSON</Link> that might come in handy.
                    </Aside>
                </>,
                <>
                    <b style={{display: "inline-block", width: "2.2em"}}>misc</b>
                    <p>
                        <b>d3-fetch</b> also supports various other formats that you wouldn't store data as: <Link href="https://github.com/d3/d3-fetch#svg"><b>svg</b></Link>, <Link href="https://github.com/d3/d3-fetch#image"><b>image</b></Link>, <Link href="https://github.com/d3/d3-fetch#html"><b>html</b></Link>, and <Link href="https://github.com/d3/d3-fetch#xml"><b>xml</b></Link>
                    </p>
                </>,
            ]} />

            <p>
                In <b>d3-fetch</b>, the methods are just the names of the file format, and they take one parameter: the URL of your file. When you execute one of these methods, they'll respond with a <b>Promise</b>, which will resolve with the parsed data <Twemoji svg text=":raised_hands:" />
            </p>

            <Aside>
                If you're unfamiliar with <b>Promises</b>, check out this great video explanation from <Link href="https://www.youtube.com/watch?v=QO4NXhWo_NM">The Coding Train</Link> or the <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises">MDN docs</Link>.
            </Aside>

            <p>
                For example, to grab the current weather in Oslo, Norway, we can query the <Link href="https://www.metaweather.com/api/">MetaWeather API</Link> and grab the temperature from the parsed response.
            </p>

            <Aside>
                Feel free to copy and run this example in your browser's <b>Dev Tools Console tab</b>, or run it by hitting <Icon name="play" size="s" />.
            </Aside>

                {/* {`const url = "https://cors-anywhere.herokuapp.com/https://date.nager.at/Api/v2/NextPublicHolidaysWorldwide" */}
            <Code canEval fileName={<>In your browser’s Dev Tools <b>Console</b> tab</>} doWrap={false}>
{`const url = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/862592/"
d3.json(url)
  .then(res => {
    alert(\`Current temperature: \${
      res.consolidated_weather[0].the_temp
    }°C\`)
  })
  .catch(() => {
      alert("Oh no, something horrible happened!")
  })`}
            </Code>

            <p>
                <b>d3-fetch</b> is a really small library - really only 8 files with about 8 lines of code, each. The real heavy-lifting actually happens in another module:
            </p>

            <ReadMore id="fetch" />

            <h3>d3-dsv</h3>

            <p>
              One of the nice things about the <b>d3</b> API is that it's <i>very</i> modular. This allows us to often use its internal logic if we want to.
            </p>

            <p>
              <Link href="https://github.com/d3/d3-dsv"><b>d3-dsv</b></Link> has many methods for converting between Javascript objects and <b>dsv</b> format. It also has some command-line utilities for converting between <b>JSON</b>, <b>dsv</b>, and <b>dsv with different delimiters</b>.
            </p>

            <ReadMore id="dsv" />

        </div>
    )
}

export default LearnD3GetData


const P = ({ children })=> (
    <code className="P">{ children }</code>
)
