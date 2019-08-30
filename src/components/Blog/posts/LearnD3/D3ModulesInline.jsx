import React, { useState, useEffect, useMemo } from "react"
import * as d3 from "d3"
import _ from "lodash"
import * as d3ScaleChromatic from "d3-scale-chromatic"
import Link from "components/_ui/Link/Link"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import { Gradient, Scheme } from "./D3Modules"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"

import baseModules from "./modules.json"

import "./D3ModulesInline.scss"


const numberFormat = d3.format(",.1f")
const coreModules = ["d3-array","d3-axis","d3-brush","d3-chord","d3-collection","d3-color","d3-contour","d3-dispatch","d3-drag","d3-dsv","d3-ease","d3-fetch","d3-force","d3-format","d3-geo","d3-hierarchy","d3-interpolate","d3-path","d3-polygon","d3-quadtree","d3-random","d3-scale","d3-scale-chromatic","d3-selection","d3-shape","d3-time","d3-time-format","d3-timer","d3-transition","d3-voronoi","d3-zoom"]
const isInCore = d => coreModules.includes(d)

const D3ModulesInline = ({ modules, className }) => {

    const parsedModules = (modules || []).map(id => (
        baseModules.filter(d => d.repo == id)[0]
    )).filter(d => !!d)
    .sort((a,b) => b.size - a.size)

    return (
        <div className={`D3ModulesInline ${className}`}>
            {parsedModules.map(module => (
                <D3ModulesInlineItem
                    key={module.title}
                    {...module}
                    isInCore={isInCore(module.repo)}
                />
            ))}
        </div>
    )
}

export default D3ModulesInline;

export const D3ModulesInlineItem = ({ size, title, repo, name, isInCore, children, isDeprecated }) => (
    <div className="D3ModulesInlineItem-wrapper"
        style={{
            minHeight: `${size / 100}px`,
            minWidth: `${size / 100}px`,
        }}>

        <Link
            href={`https://github.com/d3/${repo}`}
            className={[
                "D3ModulesInlineItem",
                `D3ModulesInlineItem--is-${isInCore ? "core" : "external"}`,
            ].join(" ")}
            style={{
                height: `${size / 100}px`,
                width: `${size / 100}px`,
            }}>
            {/* <div className="D3ModulesInlineItem__background" style={{
                width: `${size / 600}em`
            }} /> */}

            <div className="D3ModulesInlineItem__children">
                {children.length > 1 && children.map(d => (
                    <Tooltip
                        className="D3ModulesInlineItem__child"
                        key={d.name}
                        contents={parseName(d.name || d.title, d)}
                        style={{
                            height: `${(size / 100) / (children.length * 0.4)}px`,
                            width: `${(size / 100) / (children.length * 0.4)}px`,
                        }}>
                    </Tooltip>
                ))}
            </div>
        </Link>

        <div className="D3ModulesInlineItem__text"
            style={{
                height: `${size / 100}px`,
            }}>
            <div className="D3ModulesInlineItem__title" title={ title }>
                { title }
            </div>
            <div className="D3ModulesInlineItem__name">
                {/* <Link className="D3ModulesInlineItem__link" href={`https://github.com/d3/${repo}`}> */}
                        { name }
                {/* </Link> */}
                {isDeprecated && " (deprecated)"}
            </div>
            <div className="D3ModulesInlineItem__size">
                { numberFormat(size / 1000) }KB
            </div>
        </div>
    </div>
)


const parseName = (str="", parent, child) => {
    const parts = str.split(" -")
    const title = <b>{ parts[0] }</b>

    if (
        parent.name == "d3-scale-chromatic"
        && parts[0].startsWith("d3.interpolate")
    ) {
        return <>
            { title }
            <Gradient name={parts[0].split(".")[1]} />
        </>
    }

    if (
        parent.name == "d3-scale-chromatic"
        && parts[0].startsWith("d3.scheme")
    ) {
        return <>
            { title }
            <Scheme
                name={parts[0].split(".")[1]}
                numColors={child.numColors || 9}
                isSet={child.numColors}
            />
        </>
    }

    if (parts.length < 2) return title
    return <>
        { title }
        <div>
            { parts[1] }
        </div>
    </>
}