import React from 'react'
import Icon from 'components/_ui/Icon/Icon';
import e1 from "./e1.png"
import e2 from "./e2.png"

import "./SVGExercise.scss"

const SVGExercise = ({ index }) => {
    const exercise = exercises[+index - 1]
    if (!exercise) return null

    const {
        name, fileName, image
    } = exercise

    return (
        <a href={`http://localhost:8080/exercises/${fileName}.html`} className="SVGExercise" target="_blank" rel="noopener noreferrer">
            <h6>
                Exercise { index }
            </h6>
            <h2>
                { name }
            </h2>

            <img className="SVGExercise__image" src={image} />
        </a>
    )
}

export default SVGExercise


const exercises = [{
    name: "Rects, circles, & ellipses",
    fileName: "rect_circle_ellipse",
    image: e1,
},{
    name: "Wavy rect",
    fileName: "wavy_rect",
    image: e2,
}]