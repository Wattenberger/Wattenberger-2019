import { useState, usePrevious, useEffect } from 'react';
import { Twemoji } from 'react-emoji-render';
import React, {Component} from "react"
import {useSpring, animated, config as SpringConfig} from 'react-spring'

import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from "components/_ui/Chart/Chart"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import Slider from 'rc-slider';
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
import 'rc-slider/assets/index.css';
import emojiUrls from "./emojiUrls"
import emojiFile from "./emojis.csv"
import channelDataFile from "./channelData.csv"
import { useInterval } from "utils/utils"

import './DVSChannels.scss';

const startDate = d3.timeParse("%Y-%m-%d")("2019-02-27")
const endDate = d3.timeParse("%Y-%m-%d")("2019-04-07")
const dateStops = d3.timeDay.range(startDate, endDate)
const dateStepTiming = 1000
const channels = [
  "-announcements","-events","-introductions","-open-discussion","-topics-in-data-viz","audience-kids","audience-scientists","connect-academia","connect-freelance","connect-gov-civic","connect-hr-analytics","connect-journalism","connect-meetup-leads","connect-newbie","connect-nonprofit","connect-speaking","connect-team-up","dvs-chapter-thinkers","dvs-com-tech","dvs-suggestions","help-code","help-design","help-general","help-slack","location-africa","location-apac","location-atlanta","location-canada","location-chicago","location-dc","location-europe","location-newengland","location-nyc","location-seattle","location-uk","share-critique","share-inspiration","share-showcase","spanish-general","topic-accessibility","topic-best-practices","topic-career-advice","topic-data-art","topic-data-literacy","topic-data-processing","topic-data-resources","topic-dynamic-data","topic-health","topic-historical-viz","topic-interactivity","topic-machine-learnin","topic-mapping","topic-networks","topic-research","topic-sports-viz","topic-storytelling","topic-teaching","topic-temporal","topic-terminology","topic-text-analytics","topic-weather-climate","topic-xenographics"
]

const DVSChannels = () => {
  const [data, setData] = useState([])
  const [channelData, setChannelData] = useState([])
  const [dateIndex, setDate] = useState(0)
  const [activeChannels, setActiveChannels] = useState(["share-critique", "share-showcase", "-topics-in-data-viz", "topic-historical-viz"])

  useEffect(() => {
    d3.csv(emojiFile).then(rows => {
      setData(rows)
    })
    d3.csv(channelDataFile).then(rows => {
      setChannelData(rows)
    })
  }, [])

  useInterval(() => {
    if (!data.length) return;
    const newDate = d3.min([
      dateIndex + 1,
      dateStops.length - 2,
    ])
    setDate(newDate)
  }, dateIndex < dateStops.length - 2 ? dateStepTiming : null)

  const onChangeDate = index => () => setDate(index)

  const indicatorX = dateIndex * (100 - (100 / dateStops.length)) / (dateStops.length - 2)
  const dateStopString = d3.timeFormat("%Y-%m-%d")(dateStops[dateIndex])

  const onSetActiveChannels = channels => {
    setActiveChannels(channels)
    setDate(0)
  }

  return (
    <div className="DVSChannels">
      <h2 className="DVSChannels__title">
        Data Visualization Society: Channel Activity
      </h2>

      <div className="DVSChannels__contents">

        <RadioGroup
          options={channels}
          value={activeChannels}
          onChange={onSetActiveChannels}
          isMulti
        />

        <div className="DVSChannels__dates">
        <div
          className="DVSChannels__dates__indicator"
          style={{
            transform: `translateX(${indicatorX}%)`
          }}
        />
          {_.map(dateStops.slice(0, -1), (date, index) => {
            const dayString = d3.timeFormat("%-d")(date)
            return (
              <div className="DVSChannels__dates__item" key={date} onClick={onChangeDate(+index)}>
                {(!index || +dayString == 1) && (
                  <div className="DVSChannels__dates__item__month">{ d3.timeFormat("%B")(date) }</div>
                )}
                <div>{ dayString }</div>
              </div>
            )
          })}
        </div>

        <div className="DVSChannels__hubs">
        {_.map(activeChannels, (channel, index) => (
          <DVSChannelsHub
            key={channel}
            channel={ channel }
            data={data}
            channelData={channelData}
            dateStopString={dateStopString}
            hasAnnotation={!index}
          />
        ))}
        </div>
          {/* {!!data.length && _.map(data.slice(0, 300), d => !!emojiUrls[d.emoji] && (
            <div>
              { emojiUrls[d.emoji].startsWith("http") ? (
                <img height="25" width="25" src={emojiUrls[d.emoji]} />
              ) : (
                emojiUrls[d.emoji]
              ) }
            </div>
          ))} */}
      </div>
    </div>
  )
}

export default DVSChannels


const dateAccessor = d => d3.timeParse("%Y-%m-%d")(d.date)
const yAccessor = d => d.value
const emojiAccessor = d => emojiUrls[d.emoji].startsWith("http") ? (
    <img width="25" src={emojiUrls[d.emoji]} />
  ) : (
    <Twemoji svg text={emojiUrls[d.emoji]} />
)
const DVSChannelsEmojiTimeline = ({ data, channel }) => {
  if (!data) return null

  const filteredData = data.filter(d => d.value > 5)
  const stackedData = d3.stack()(filteredData)

  const xScale = d3.scaleLinear()
    .domain(d3.extent(filteredData, dateAccessor))
    .range([0, 100])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(filteredData, yAccessor))
    .range([200, 0])
    .clamp(true)

  return (
    <div className="DVSChannelsEmojiTimeline">
      <h5>{ channel }</h5>

      <div className="DVSChannelsEmojiTimeline__chart">
        {_.map(filteredData, d => (
          <div className="DVSChannelsEmojiTimeline__emoji" style={{
            top: `${yScale(yAccessor(d))}px`,
            left: `${xScale(dateAccessor(d))}%`,
          }}>
          { emojiAccessor(d) }
          </div>
        ))}
      </div>

    </div>
  )
}

const channelVolumeScale = d3.scaleSqrt()
  .domain([0, 100])
  .range([1, 4])

const DVSChannelsHub = ({ data, channelData, channel, dateStopString, hasAnnotation }) => {
  const filteredData = data.filter(d => (
    d.value > 5
    && d.channel == channel
    && d.date == dateStopString
  ))
  const channelDataAtDate = _.find(channelData, d => d.date == dateStopString)
  const channelVolume = !channelDataAtDate ? 0
    : !channelDataAtDate[channel] ? 0
    : +channelDataAtDate[channel].split(",")[1]

  return (
    <div className="DVSChannelsHub">

      {_.map(filteredData, d => (
        _.times(d.value, (i) => (
          <AnimatedEmoji key={[i, dateStopString].join()}
            emoji={ emojiAccessor(d) }
          />
        ))
      ))}

      {hasAnnotation && (
        <div className="DVSChannelsHub__annotation">
          Number of posts
        </div>
      )}

      <div className="DVSChannelsHub__circle">
        { channel }
      </div>
      <div
        className="DVSChannelsHub__volume-circle"
        style={{
          transform: `translate(-50%, -50%) scale(${channelVolumeScale(channelVolume)})`
        }}
      />
    </div>
  )
}

const AnimatedEmoji = ({ emoji }) => {
  const angle = randomInRange(0, 360)
  const distance = randomInRange(90, 160)
  const delay = randomInRange(0, dateStepTiming - 100)
  const destinationCoordinates = getPositionFromPoint(angle, distance)
  const {opacity, xy} = useSpring({
    // opacity: 1,
    // xy: destinationCoordinates,
    delay,
    config: {
      // duration: dateStepTiming / 6,
      ...SpringConfig.gentle,
    },
    from: {
      opacity: 0,
      xy: [0, 0],
    },
    to: [
      {opacity: 1, xy: destinationCoordinates},
      {opacity: 0.3, xy: destinationCoordinates},
    ],
  })
  return (
    <animated.div style={{
      opacity,
      transform: xy.interpolate((x, y) => `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`),
    }} className="AnimatedEmoji">
      { emoji }
    </animated.div>
  )
}

const randomInRange = (from, to) => Math.floor(Math.random()*(to-from+1)+from)

const getPositionFromPoint = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]

