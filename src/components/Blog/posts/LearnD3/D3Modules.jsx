import React, { useState, useEffect, useMemo } from "react"
import * as d3 from "d3"
import _ from "lodash"
import * as d3ScaleChromatic from "d3-scale-chromatic"
import Link from "components/_ui/Link/Link"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"

import modules from "./modules.json"
import "./D3Modules.scss"


const numberFormat = d3.format(",.1f")
const coreModules = ["d3-array","d3-axis","d3-brush","d3-chord","d3-collection","d3-color","d3-contour","d3-dispatch","d3-drag","d3-dsv","d3-ease","d3-fetch","d3-force","d3-format","d3-geo","d3-hierarchy","d3-interpolate","d3-path","d3-polygon","d3-quadtree","d3-random","d3-scale","d3-scale-chromatic","d3-selection","d3-shape","d3-time","d3-time-format","d3-timer","d3-transition","d3-voronoi","d3-zoom"]
const isInCore = d => coreModules.includes(d)

const D3Modules = ({ focusedPackages, isShrunk, className }) => {
    const width = Math.max(
        Math.min(
            // Math.max(900, window.innerWidth - 100),
            window.innerWidth - 100,
            window.innerHeight + 100,
            2200
        ),
        700,
    )
    const height = width * 0.96

    const {
        nodes, leftMostExternalPackage
    } = useMemo(() => {
        const strippedModules = modules.map(m => ({
            ...m,
            // items: null,
            value: m.size,
            children: m.children.length
                ? m.children.map((c, i) => ({
                    ...m.items[i],
                    ...c,
                    value: m.size / m.children.length
                }))
                : [{name: "d", value: m.size}],
        }))

        const pack = d3.pack()
            .size([width, height])
            .padding(6)(
            d3.hierarchy({name: "root", children: strippedModules})
                .sum(d => d.value)
                // .sort((a, b) => b.size - a.size)
        )

        const nodes = pack.children.map(d => ({
            ...d,
            isInCore: isInCore(d.data.repo),
            // x: d.x - window.innerWidth / 2,
            x: d.x - d.r,
            // y: d.y - height / 2,
            y: d.y - d.r,
            children: (d.children || []).map(c => ({
                ...c,
                x: c.x - d.x,
                y: c.y - d.y,
                name: parseName(c.data.name || c.data.title, d, c)
            })),
        }))

        const leftMostExternalPackage = nodes.filter(d => !d.isInCore)
            .sort((a,b) => a.x - b.x)[0]

        return {
            nodes, leftMostExternalPackage
        }
    }, [width, height])

    const wrapperScale = useMemo(() => {
        // const wrapperWidth = window.innerWidth - (16 * 30)
        const wrapperScale = isShrunk && window.innerWidth >= 860
            ? window.innerWidth > 1300
                ? 750 / width
                : 550 / width
            : 1
        return wrapperScale
    }, [isShrunk, width])


    return (
        <div className={`D3Modules ${className}`}
            // style={{height: `${height + 20}px`}}
        >
            <div className="D3Modules__wrapper" style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `scale(${wrapperScale}) translateX(10px)`,
            }}>
                {nodes.map(module => (
                    <D3ModulesItem
                        key={module.title}
                        {...module.data}
                        {...module}
                        isUnfocused={focusedPackages && !focusedPackages.includes(module.data.repo)}
                        isFocused={!!focusedPackages && focusedPackages.includes(module.data.repo)}
                    />
                ))}

                {leftMostExternalPackage && !focusedPackages && !isShrunk && (
                    <div className="D3Modules__annotation" style={{
                        transform: `translate(${leftMostExternalPackage.x}px, ${leftMostExternalPackage.y + leftMostExternalPackage.r * 1.5}px)`
                    }}>
                        <div className="D3Modules__annotation__text">
                            Not in the core D3.js build
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default D3Modules;

export const D3ModulesItem = ({ size, title, repo, name, r, x, y, isInCore, isUnfocused, isFocused, children, isDeprecated }) => (
    <Link
        href={`https://github.com/d3/${repo}`}
        className={[
            "D3ModulesItem",
            `D3ModulesItem--is-${isDeprecated ? "deprecated" : isInCore ? "core" : "external"}`,
            `D3ModulesItem--is-${
                isFocused ? "focused" :
                isUnfocused ? "unfocused" :
                            "normal"
            }`,
        ].join(" ")}
        tabIndex={isUnfocused ? -1 : 0}
        style={{
            height: `${r * 2}px`,
            width: `${r * 2}px`,
            transform: `translate(${x}px, ${y}px)`
        }}>
        {/* <div className="D3ModulesItem__background" style={{
            width: `${size / 600}em`
        }} /> */}
        <div className="D3ModulesItem__text">
            <div className="D3ModulesItem__title" title={ title }>
                { title }
            </div>
            <div className="D3ModulesItem__name">
                {/* <Link className="D3ModulesItem__link" href={`https://github.com/d3/${repo}`}> */}
                        { name }
                {/* </Link> */}
                {isDeprecated && " (deprecated)"}
            </div>
            <div className="D3ModulesItem__size">
                { numberFormat(size / 1000) }KB
            </div>
        </div>

        <div className="D3ModulesItem__children">
            {children.length > 1 && children.map(d => (
                <Tooltip className="D3ModulesItem__child" key={d.data.name} contents={d.name} style={{
                    height: `${d.r * 2}px`,
                    width: `${d.r * 2}px`,
                    transform: `translate(${d.x}px, ${d.y}px)`
                }}>
                </Tooltip>
            ))}
        </div>
    </Link>
)


const parseName = (str="", parent, child) => {
    const parts = str.split(" -")
    const title = <b>{ parts[0] }</b>

    if (
        parent.data.name == "d3-scale-chromatic"
        && parts[0].startsWith("d3.interpolate")
    ) {
        return <>
            { title }
            <Gradient name={parts[0].split(".")[1]} />
        </>
    }

    if (
        parent.data.name == "d3-scale-chromatic"
        && parts[0].startsWith("d3.scheme")
    ) {
        return <>
            { title }
            <Scheme
                name={parts[0].split(".")[1]}
                numColors={child.data.numColors || 9}
                isSet={child.data.numColors}
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


export const Gradient = ({ name }) => (
    <div className="D3ModulesGradient" style={{
        background: [
            "linear-gradient(to right, ",
            _.times(10, i => (
                d3ScaleChromatic[name] ? d3ScaleChromatic[name](i / 9) : "white"
            )).join(","),
            ")",
        ].join("")
    }} />
)

export const Scheme = ({ name, numColors, isSet }) => (
    <div className="D3ModulesScheme" style={{
        background: [
            "linear-gradient(to right, ",
            _.times(numColors, i => [
                [
                    (isSet
                        ? d3ScaleChromatic[name]
                        : d3ScaleChromatic[name][numColors]
                    )[i],
                    `${100 / (numColors - 1) * i}%`,
                ].join(" "),
                [
                    (isSet
                        ? d3ScaleChromatic[name]
                        : d3ScaleChromatic[name][numColors]
                    )[i],
                    `${100 / (numColors - 1) * (i + 1)}%`,
                ].join(" "),
            ].join(",")).join(","),
            ")",
        ].join("")
    }} />
)