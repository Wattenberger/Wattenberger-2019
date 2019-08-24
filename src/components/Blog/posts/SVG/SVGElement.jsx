import React from 'react'
import Icon from 'components/_ui/Icon/Icon';

import "./SVGElement.scss"

const SVGElement = ({ name }) => {
    const element = elements[name]
    if (!element) return null

    return (
        <div className="SVGElement">
            <h2>
                <i>{"<"}</i>{ name }<i>{">"}</i>
            </h2>

            <a className="SVGElement__link" href={`https://developer.mozilla.org/en-US/docs/Web/SVG/Element/${name}`} target="_blank" rel="noopener noreferrer">
                MDN docs
            </a>

            <div className="SVGElement__attributes">
                {(element.attributes || []).map(({
                    name: attributeName, types=[], doesAnimate, isPosition
                }) => (
                    <div
                        className="SVGElement__attribute"
                        key={attributeName}>
                        <div className="SVGElement__attribute__name">
                            { attributeName }
                        </div>

                        <div className="SVGElement__attribute__types">
                            {types.map(type => (
                                <div className="SVGElement__attribute__type" key={type}>
                                    { type }
                                </div>
                            ))}
                        </div>

                        <a className="SVGElement__attribute__more" href={`https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/${attributeName}`} target="_blank" rel="noopener noreferrer">
                            More info
                            <Icon name="arrow" direction="ne" size="s" />
                        </a>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default SVGElement


const elements = {
    rect: {
        type: "shape",
        attributes: [{
            name: "x",
            default: 5,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "y",
            default: 10,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "width",
            default: 90,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
        },{
            name: "height",
            default: 80,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
        },{
            name: "rx",
            default: 0,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
        },{
            name: "ry",
            default: 0,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
        }]
    },
    circle: {
        type: "shape",
        attributes: [{
            name: "cx",
            default: 50,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "cy",
            default: 50,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "r",
            default: 45,
            types: ["length", "percentage"],
            doesAnimate: true,
        }]
    },
    ellipse: {
        type: "shape",
        attributes: [{
            name: "cx",
            default: 50,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "cy",
            default: 50,
            types: ["auto", "length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "rx",
            default: 45,
            types: ["length", "percentage"],
            doesAnimate: true,
        },{
            name: "ry",
            default: 35,
            types: ["length", "percentage"],
            doesAnimate: true,
        }]
    },
    line: {
        type: "shape",
        attributes: [{
            name: "x1",
            default: 5,
            types: ["length", "percentage"],
            doesAnimate: false,
            isPosition: true,
        },{
            name: "x2",
            default: 95,
            types: ["length", "percentage"],
            doesAnimate: false,
            isPosition: true,
        },{
            name: "y1",
            default: 95,
            types: ["length", "percentage"],
            doesAnimate: false,
            isPosition: true,
        },{
            name: "y2",
            default: 5,
            types: ["length", "percentage"],
            doesAnimate: false,
            isPosition: true,
        }]
    },
        polyline: {
        type: "shape",
        attributes: [{
            name: "points",
            type: "string",
            types: ["string of numbers"],
            default: "30,5 95,47 40,95",
            isPosition: true,
            doesAnimate: true,
        }]
    },
        polygon: {
        type: "shape",
        attributes: [{
            name: "points",
            type: "string",
            types: ["string of numbers"],
            default: "30,5 95,47 40,95",
            isPosition: true,
            doesAnimate: false,
        }]
    },
    path: {
        type: "shape",
        attributes: [{
            name: "d",
            type: "string",
            types: ["string"],
            default: "M 5,5 20,96 40,10 60,85 80,34 95,20",
            isPosition: true,
            doesAnimate: true,
        }]
    },

    g: {
    },
    defs: {
    },
    svg: {
        attributes: [{
            name: "width",
            type: "string",
            types: ["length"],
        },{
            name: "height",
            type: "string",
            types: ["length"],
        },{
            name: "viewBox",
            type: "string",
            types: ["list of numbers [x y width height]"],
        },{
            name: "preserveAspectRatio",
            type: "string",
            types: ["string"],
        },{
            name: "x",
            default: 5,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "y",
            default: 10,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        }],
    },
    use: {
        attributes: [{
            name: "href",
            type: "string",
            types: ["url"],
        },{
            name: "x",
            type: "string",
            types: ["length", "percentage"],
            isPosition: true,
        },{
            name: "y",
            type: "string",
            types: ["length", "percentage"],
            isPosition: true,
        },{
            name: "width",
            type: "string",
            types: ["length"],
        },{
            name: "height",
            type: "string",
            types: ["length"],
        }]
    },
    linearGradient: {
        attributes: [{
            name: "href",
            types: ["url"],
            doesAnimate: true,
        },{
            name: "x1",
            default: 5,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "x2",
            default: 95,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "y1",
            default: 95,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "y2",
            default: 5,
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "gradientUnits",
            types: ["\"userSpaceOnUse\"", "\"objectBoundingBox\""],
            doesAnimate: true,
        },{
            name: "gradientTransform",
            types: ["\"pad\"","\"reflect\"", "\"repeat\""],
            doesAnimate: true,
        },{
            name: "spreadMethod",
            types: ["transform list"],
            doesAnimate: true,
        }]
    },
    radialGradient: {
        attributes: [{
            name: "href",
            types: ["url"],
            doesAnimate: true,
        },{
            name: "cx",
            default: 5,
            types: ["length"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "cy",
            default: 95,
            types: ["length"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "r",
            default: 95,
            types: ["length"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "fx",
            default: 95,
            types: ["length"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "fy",
            default: 5,
            types: ["length"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "fr",
            default: 95,
            types: ["length"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "gradientUnits",
            types: ["\"userSpaceOnUse\"", "\"objectBoundingBox\""],
            doesAnimate: true,
        },{
            name: "gradientTransform",
            types: ["\"pad\"","\"reflect\"", "\"repeat\""],
            doesAnimate: true,
        },{
            name: "spreadMethod",
            types: ["transform list"],
            doesAnimate: true,
        }]
    },
    stop: {
        attributes: [{
            name: "offset",
            default: 5,
            types: ["number", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "stop-color",
            types: ["color"],
            doesAnimate: true,
        },{
            name: "stop-opacity",
            types: ["number"],
            doesAnimate: true,
        }]
    },
    text: {
        attributes: [{
            name: "x",
            type: "string",
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "y",
            type: "string",
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "dx",
            type: "string",
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "dy",
            type: "string",
            types: ["length", "percentage"],
            doesAnimate: true,
            isPosition: true,
        },{
            name: "rotate",
            type: "string",
            types: ["list of numbers"],
            doesAnimate: true,
        },{
            name: "lengthAdjust",
            type: "string",
            types: ["spacing"],
            doesAnimate: true,
        },{
            name: "textLength",
            type: "string",
            types: ["length", "percentage"],
            doesAnimate: true,
        }]
    },
    clipPath: {
        attributes: [{
            name: "clipPathUnits",
            type: "string",
            types: ["userSpaceOnUse", "objectBoundingBox"],
            doesAnimate: true,
            isPosition: true,
        }],
    },
}