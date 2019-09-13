import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as d3 from "d3"
import _ from "lodash"
import {useSpring, animated, config as SpringConfig} from 'react-spring'
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Link from "components/_ui/Link";
import { useInterval } from "utils/utils"
import heads from "./heads"

import './ElectionHeads.scss';

const cands = [ "klobuchar", "orourke", "bernie", "warren", "yang", "biden", "booker", "buttigieg", "castro", "harris", ]

const width = 300 * cands.length
const height = width

const ElectionHeads = () => {
    const [votes, setVotes] = useState({})
    const [poppedCands, setPoppedCands] = useState([])
    const [candWithPinOn, setCandWithPinOn] = useState(null)

    const onVoteForCandidateLocal = cand => () => {
        setVotes({
            ...votes,
            [cand]: (votes[cand] || 0) + 1,
        })
    }

    const onStopDraggingPin = e => {
        if (!candWithPinOn) return
        setCandWithPinOn(null)
        setPoppedCands([
            ...poppedCands,
            candWithPinOn,
        ])
    }

    const onPinOnChange = cand => {
        if (cand == candWithPinOn) return
        setCandWithPinOn(cand)
    }

    return (
        <div className="ElectionHeads">
            <div className="ElectionHeads__banner">
                Debates are good. Actually voting is better. <Link href="">Register here</Link>.
            </div>

            <div className="ElectionHeads__content">
                <h1><b>Balloon</b>Debate</h1>
                <p>Click on a candidate's head every time you agree with them</p>

                <p className="ElectionHeads__small-text">
                    <div className="ElectionHeads__pin" draggable="true" onDragEnd={onStopDraggingPin}>
                        { pinIcon }
                    </div>
                    Drag this pin to pop a balloon
                </p>

                <div className="ElectionHeads__background">
                    <div className="ElectionHeads__cloud" />
                    <div className="ElectionHeads__cloud" />
                    <div className="ElectionHeads__cloud" />
                </div>

                <svg className="ElectionHeads__svg" viewBox={`0 0 ${300 * cands.length} 400`} preserveAspectRatio="meet">
                    <defs>
                        <g id="pop" className="ElectionHeads__pop">
                            {_.times(10).map(i => (
                                <line
                                    key={i}
                                    x1={Math.cos((Math.PI * 2 / 10) * i) * 60}
                                    y1={Math.sin((Math.PI * 2 / 10) * i) * 60}
                                    x2={Math.cos((Math.PI * 2 / 10) * i) * 160}
                                    y2={Math.sin((Math.PI * 2 / 10) * i) * 160}
                                />
                            ))}
                        </g>
                    </defs>
                    {/* <defs>
                        <linearGradient>
                            <stop stopColor="#01ABEC" />
                            <stop stopColor="#01ABEC" offset="100%" />
                        </linearGradient>
                    </defs> */}
                    {cands.map((cand, index) => (
                        <ElectionHead
                            {...{cand, index}}
                            score={votes[cand] || 0}
                            onVote={onVoteForCandidateLocal(cand)}
                            isPopped={poppedCands.includes(cand)}
                            onPinOn={onPinOnChange}
                            isPinOn={candWithPinOn == cand}
                        />
                    ))}
                </svg>
            </div>
        </div>
    )
}

export default ElectionHeads


const scoreOffset = -50

const ElectionHead = ({ cand, index, score, isPopped, isPinOn, onVote, onPinOn }) => {
    const [offset, setOffset] = useState([0, 0])
    const [iteration, setIteration] = useState(0)
    const [xPositions, setXPositions] = useState(_.times(3, d => randomInRange(100, 160)))
    const scoreCurrent = useRef(score)
    const intervalLength = Math.random() * 500 + 500

    useEffect(() => {
        setOffset([
            offset[0],
            score * scoreOffset,
        ])
        scoreCurrent.current = score
    }, [score])

    const onDragOver = e => {
        if (isPopped) return

        onPinOn(cand)
    }
    const onDragLeave = e => {
        if (isPopped) return
        if (!e.currentTarget.contains) return
        if (e.currentTarget.contains(e.relatedTarget)) return

        setTimeout(() => onPinOn(null), 100)
    }

    setInterval(() => {
        setOffset([
            Math.max(Math.min(80, offset[0] + randomInRange(-10, 10)), -80),
            randomInRange(-10, 10) + scoreCurrent.current * scoreOffset,
        ])
        if (!Math.random < 0.06) setIteration(iteration + 1)
    }, intervalLength)

    const { offsetAnim } = useSpring({
        config: {
          duration: intervalLength,
          mass: 66, tension: 135, friction: 172
        },
        from: {
            offsetAnim: [0,0],
        },
        to: {
            offsetAnim: offset,
        }
    })

    const tail = useMemo(() => {
        setXPositions(xPositions.map(d => (
            Math.max(
                0,
                Math.min(
                    260,
                    d + randomInRange(-20, 20)
                )
            )
        )))

        return createPath([
            ["M", 130, 255],
            [`C`, xPositions[0], 350],
            [xPositions[1], 500],
            [xPositions[2], 600],
        ])
    }, [iteration])

    return (
        <animated.g className={[
            "ElectionHead",
            `ElectionHead--is-${isPopped ? "popped" : isPinOn ? "dragging-on" : "normal"}`,
            `ElectionHead--iteration-${score % 2 ? 0 : 1}`
        ].join(" ")} style={{
            transform: offsetAnim.interpolate((x, y) => (
                `translate(${index * 300 + 20 + x}px, ${y}px)`
            ))
        }} onDragOver={onDragOver} onDragLeave={onDragLeave} key={cand} onClick={onVote}>
            <path
                className="ElectionHead__tail"
                d={tail}
            />

            <g className="ElectionHead__head">
                { heads[cand] }
            </g>

            <text
                className="ElectionHead__text"
                x="125"
                y="-80"
            >
                { cand }
            </text>
            {!!score && (
                <g transform="translate(75, -90)">
                    <svg className="ElectionHead__score__hype" width="100" height="100" viewBox="0 0 100 100">
                        <circle
                            key={score}
                            cx="50"
                            cy="50"
                            r="50"
                        />
                    </svg>
                    <text
                        className="ElectionHead__score"
                        x="50"
                        y="60">
                        { score }
                        {/* vote{score == 1 ? "" : "s"} */}
                    </text>
                </g>
            )}
            {isPinOn && (
                <g className="ElectionHead__cross-out">
                    <line
                        x1="30"
                        x2="220"
                        y1="30"
                        y2="220"
                    />
                    <line
                        x1="30"
                        x2="220"
                        y1="220"
                        y2="30"
                    />
                </g>
            )}
            {isPopped && (
                <use href="#pop" x="126" y="126" />
            )}
        </animated.g>
    )
}

const createPath = arr => (
    arr.map(d => d.join(" ")).join(" ")
)

const randomInRange = (from, to) => Math.floor(Math.random()*(to-from+1)+from)


const pinIcon = <svg viewBox="0 0 100 125"><path d="M58.29,75.781c1.561-2.367,2.252-4.963,1.984-7.211c-0.195-1.645-0.21-3.912,0.736-5.273l14.316-20.615  c0.945-1.36,1.764-2.411,1.83-2.346l0.117,0.118c1.818,1.818,4.947,1.797,7.774,0.191c1.44-0.816,1.425-2.766,0.253-3.938  L63.165,14.572c-1.171-1.172-3.121-1.188-3.938,0.252c-1.604,2.828-1.626,5.956,0.194,7.776c0,0,0.053,0.053,0.117,0.117  s-0.986,0.884-2.348,1.828L36.577,38.863c-1.361,0.945-3.628,0.932-5.273,0.736c-2.249-0.269-4.845,0.423-7.212,1.984  c-1.384,0.912-1.368,2.846-0.197,4.017l13.12,13.121L22.442,73.293l0.033,0.033c-5.84,6.154-9.539,11.666-8.439,12.766  s6.611-2.6,12.767-8.439l0.033,0.033l14.572-14.572l12.864,12.865C55.444,77.15,57.378,77.166,58.29,75.781z"/></svg>