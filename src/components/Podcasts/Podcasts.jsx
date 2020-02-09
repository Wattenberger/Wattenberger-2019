import React, { useMemo, useState } from "react"

import Link from "components/_ui/Link/Link"
import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"
import ScrollEvent from "components/_ui/ScrollEvent/ScrollEvent"

import episodes from "./episodes.jsx"
import { curveBasis, line, timeParse, timeFormat } from "d3"
import { orderBy, random, sample, times, uniqueId } from "lodash"
import lerp from "lerp"

import "./Podcasts.scss"

const parseDate = timeParse("%m/%d/%Y")
const formatDate = d => (
  <span>
    {timeFormat("%B %-d")(d)}
    <sup>{getOrdinal(+timeFormat("%-d")(d))}</sup>
    {timeFormat(", %Y")(d)}
  </span>
)
const sortedEpisodes = orderBy(episodes, ({ date }) => parseDate(date), "desc")

const Podcasts = () => {

  return (
    <div className="Podcasts">
      <h3>
        <b>Podcasts</b> I've been on
      </h3>

      <div className="Podcasts__episodes">
        {sortedEpisodes.map(episode => (
          <PodcastsEpisode
            key={episode.googleUrl}
            {...episode}
          />
        ))}
      </div>

    </div>
  )
}

export default Podcasts


const PodcastsEpisode = ({ name, podcast, image, googleUrl, url, date, description, colors }) => (
  <div className="PodcastsEpisode">
    <Link href={googleUrl} className="PodcastsEpisode__image">
      <img src={ image } alt={ `${podcast} banner` } />
    </Link>
    <div className="PodcastsEpisode__text">
        <div className="PodcastsEpisode__podcast">
          { podcast }
        </div>
      <Link href={googleUrl}>
        <div className="PodcastsEpisode__name">
          { name }
        </div>
      </Link>
      <div className="PodcastsEpisode__date">
        { formatDate(parseDate(date)) }
      </div>
      <div className="PodcastsEpisode__description">
        { description }
      </div>

      <div className="PodcastsEpisode__buttons">
        <Link href={googleUrl}>
          <Button className="PodcastsEpisode__button" tabIndex="-1">
            <Icon name="play" size="s" />
            Listen
          </Button>
        </Link>
        {url&& (
          <Link href={url}>
            <Button className="PodcastsEpisode__button" tabIndex="-1" styleType="secondary">
              <Icon name="arrow" direction="ne" size="s" />
              Website
            </Button>
          </Link>
        )}
      </div>
    </div>

    <Leaf {...{colors}} />
  </div>
)


export const getOrdinal = d => {
  const t = d % 10;
  return Math.floor((d % 100 / 10)) === 1 ? "th" :
    t === 1 ? "st" :
    t === 2 ? "nd" :
    t === 3 ? "rd" :
    "th"
}


const width = 100
const height = 100
const Leaf = ({ colors=["#12CBC4", "#9980FA"] }) => {
  const circleId = useMemo(() => uniqueId("Leaf__circle-"), [])
  const [isInView, setIsInView] = useState(false)

  const {
    leafDs, lengths, angles
  } = useMemo(() => {
    const angleRatios = [
      [10, 40],
      [-10, 20],
      [45, 60],
      [-10, 60],
      [-10, 60],
    ]
    const angles = times(random(2, 5, 1)).map(i => (
      random(...angleRatios[i])
    ))
    const lengthRatios = [
      [0.7, 1],
      [0.2, 0.6],
      [0.2, 0.6],
      [0.2, 0.6],
    ]
    const lengths = angles.map((angle, i) => (
      random(...lengthRatios[i].map(d => d * width))
    ))
    const leafPoints = lengths.map(length => {
      const numberOfPoints = random(5, 10, 1)
      return times(numberOfPoints + 1).map(i => [
        lerp(0, length, i / (numberOfPoints - 1)),
        (!i || i == numberOfPoints) ? 0 :
        i > (numberOfPoints - 2) ? random(3, length * 15 / width) :
          random(3, length * 21 / width)
      ])
    })

    const leafDs = leafPoints.map(points => (
      line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(curveBasis)
      ([...points, ...points.reverse().map(([x, y]) => [
        x,
        -y,
      ])])
    ))

    return {
      leafDs, lengths, angles
    }
  }, [])
  return (
    <ScrollEvent
      className={`Leaf Leaf--is-${isInView ? "" : "not-"}in-view`}
      isInViewChange={
        d => {
          setIsInView(d == 0)
        }
      } hasIndicator={false}>
      <svg className="Leaf__svg" {...{width, height}} viewBox={[0, 0, width, height].join(" ")}>
        <defs>
          {lengths.map((_, i) => (
            <clipPath id={`${circleId}--${i}`} className="Leaf__clip" key={i}>
              <circle cx={-width / 4} cy={height} r={width / 2} />
            </clipPath>
          ))}
        </defs>

        {lengths.map((length, i) => (
          <g key={i} className="Leaf__item" clipPath={`url(#${circleId}--${i})`}>
            <g transform={`translate(${random(i * 5, (i + 1) * 5)}, ${height}) rotate(${-90 + angles[i]})`}>
              <path
                className="Leaf__stem"
                d={[
                  ["M", 0, ",", 0].join(" "),
                  [6, 2].join(", "),
                  [length, 0].join(", "),
                  [6, -2].join(", "),
                ].join("L ")}
              />
              <path
                className="Leaf__leaf"
                d={leafDs[i]}
                style={{
                  fill: sample(colors)
                }}
              />
            </g>
          </g>
        ))}
      </svg>
    </ScrollEvent>
  )
}

const getPositionFromPoint = (angle, offset=10) => [
  Math.cos(angle - (Math.PI / 2)) * offset,
  Math.sin(angle - (Math.PI / 2)) * offset,
]
