import React, { useMemo, useState } from "react"
import { Twemoji } from "react-emoji-render"
import * as d3 from "d3"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, ReadMore, P } from "./LearnD3"
import bookImage from "images/book.png";

const numberOfDataPoints = 4
const LearnD3Time = ({ onScrollToSectionLocal }) => {

    return (
        <div className="LearnD3Time">
            <p>
              While visualizing data, we'll often have to deal with the three-headed hydra that is time. When we, as humans, think about time, it's often broken into intervals:
            </p>

            <List items={[
              "minutes", "hours", "days", "months", "years"
            ]} />

            <p>
              And we express a specific point in time in terms of those intervals. For example, today is <P>{d3.timeFormat("%A, %B %-d, %Y")(new Date())}</P>, and tomorrow is <P>{d3.timeFormat("%A, %B %-d, %Y")(d3.timeDay.offset(new Date(), 1))}</P>. But how can we place these two date strings on a scale?
            </p>

            {/* <Code size="s" fileName="data.json">
            </Code> */}
            <h3>d3-time-format</h3>

            <p>
              Javascript has a native <b>Date</b> object that represent a point in time <i>down to the millisecond</i>. We can turn a string into a <b>Date</b> by using <DocsLink repo="time-format" id="timeParse" />.
            </p>

            <p>
              <DocsLink repo="time-format" id="timeParse" /> takes one parameter: a <i>specifier</i> string that represents to format of your datetime. This string will be made up of individual <i>specifiers</i>: a combination of a <P>%</P> and a letter.
            </p>

            <p>
              Here are most of the common <i>specifiers</i>
            </p>

            <div className="">
              {Object.keys(timeStrings).map(str => (
                <div key={str} style={{
                  width: "20em",
                }}>
                  <span style={{
                    opacity: 0.5,
                  }}>%</span>
                  <b className="tnum" style={{
                    display: "inline-block",
                    marginLeft: "0.1em",
                    textAlign: "center",
                    width: "1em"
                  }}>{ str }</b>
                  <span style={{
                    fontSize: "0.8em",
                    lineHeight: "1.3em",
                    marginLeft: "0.5em",
                  }}>
                    { timeStrings[str] }
                  </span>
                </div>
              ))}
            </div>
            <br />

            <p>
              For example, if we wanted to parse the date string <P>{d3.timeFormat("%A, %B %d, %Y")(new Date())}</P>, we could use the following code:
            </p>

              <Code size="s">{`const dateString = "${d3.timeFormat("%A, %B %d, %Y")(new Date())}"
const today = d3.timeParse("%A, %B %d, %Y")(dateString)
// <Date> ${d3.timeParse("%A, %B %d, %Y")(d3.timeFormat("%A, %B %d, %Y")(new Date()))}`}</Code>

            <Aside>
              To create a linear scale for datetimes in our dataset, we would pass these parsed <b>Date</b>s to <DocsLink repo="scale" id="timeScale" />. Learn more about <b>scales</b> in the <Link to="#" onClick={onScrollToSectionLocal("converting-data-to-the-physical-domain")}>scales section</Link>.
            </Aside>

            <p>
              We can pass the same specifiers with <DocsLink repo="time-format" id="timeFormat" /> to convert a <b>Date</b> object back into a string, which comes in handy for labels and axes:
            </p>

            <Code size="s">{`const today = new Date()
const today = d3.timeFormat("%A, %B %d, %Y")(today)
// ${d3.timeFormat("%A, %B %d, %Y")(new Date())}`}</Code>

            <p>
              If a <i>specifier</i> is zero-padded, adding a <P>-</P> will remove any beginning zeroes.
            </p>

            <Code size="s">{`const today = new Date()
const today = d3.timeFormat("%A, %B %-d, %Y")(today)
// ${d3.timeFormat("%A, %B %-d, %Y")(new Date())}`}</Code>

            <p>
              <DocsLink repo="time-format" /> has methods for handling <b>UTC</b> and <b>ISO</b> times, as well as a few methods for handling <i>locales</i>.
            </p>

            <ReadMore id="time-format" />

            <h3>d3-time</h3>

            <p>
              But what if we need to modify datetimes?
            </p>

            <p>
              <DocsLink repo="time" /> has your back with a built-in set of intervals: {intervals.map((d,i) => (
                <span>
                  {!i ? "" : i == intervals.length - 1 ? ", and " : ", "} <DocsLink repo="time" id={d}>{ d }</DocsLink>
                </span>
              ))}.
            </p>

            <p>
              Each of these intervals has a handful of methods:
            </p>

            <List items={[
              <>
                <DocsLink repo="time" id="interval_floor">.floor()</DocsLink>, <DocsLink repo="time" id="interval_ceil">.ceil()</DocsLink>, and <DocsLink repo="time" id="interval_round">.round()</DocsLink> for creating a <b>Date</b> at the start, end, or closest boundary of the interval
              </>,
              <>
                <DocsLink repo="time" id="interval_offset">.offset()</DocsLink> to offset the <b>Date</b> by a specified number of intervals
              </>,
              <>
                <DocsLink repo="time" id="interval_range">.range()</DocsLink> to create an array of <b>Date</b>s, one for each interval between a specified start and stop <b>Date</b>
              </>,
              <>
                <DocsLink repo="time" id="interval_count">.count()</DocsLink> to return the number of intervals that can fit between two specified <b>Date</b>s
              </>,
            ]} />
            <p>
              For example, if I wanted to create a date time that was exactly <i>one week</i> after today, I could use <DocsLink repo="time" id="timeWeek" />.
            </p>

            <Code size="s">{`d3.timeWeek.offset(new Date(), 1)
// <Date> ${d3.timeWeek.offset(new Date(), 1)}`}</Code>

            <p>
              <DocsLink repo="time" /> has come in handy very often, and I would highly recommend getting familiar with its API. There are many dragons when dealing with datetimes (different numbers of days in months, leap years, Daylight Savings time <Twemoji svg text="🙀" />), which can be largely ignored with the right library.
            </p>

            <ReadMore id="time" />



        </div>
    )
}

export default LearnD3Time

const intervals = [
  "timeMillisecond",
  "timeSecond",
  "timeMinute",
  "timeHour",
  "timeDay",
  "timeWeek",
  "timeMonth",
  "timeYear",
]

const timeStrings = {
  "f": "milliseconds",
  "S": "seconds",
  "M": "minute",
  "H": "hour (24h)",
  "I": "hour (12h)",
  "p": "AM / PM",
  // "u": "Monday-based day of the week",
  // "w": "Sunday-based day of the week",
  "d": "day of the month",
  // "j": "day of the year",
  "a": "abbreviated weekday name",
  "A": "full weekday name",
  // "U": "Sunday-based week of the year",
  // "W": "Monday-based week of the year",
  "b": "abbreviated month name",
  "B": "full month name",
  "m": "month",
  // "y": "year without century",
  "Y": "year",
  "Z": "time zone offset",
  // "x": "the locale’s date",
  // "X": "the locale’s time",
}
