import React, { useState, usePrevious, useEffect } from 'react';
import * as d3 from "d3"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import USMap from "components/_ui/USMap/USMap"
import Chart from "components/_ui/Chart/Chart"
import { useChartDimensions } from "components/_ui/Chart/utils/utils"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Axis from "components/_ui/Chart/Axis/Axis"
import characters from "./characters.json"
import { scenes, otherScenes } from "./data"

import './StephenKingCharacters.scss';
let sceneData = {}
Object.keys(scenes).forEach(state => {
    sceneData[state] = scenes[state].length
})

console.log(sceneData)

const StephenKingCharacters = () => {
    return (
        <div className="StephenKingCharacters">
            <div className="StephenKingCharacters__wrapper">
                <h1>
                    Which US state does <b>Stephen King</b> write about the most?
                </h1>

                <USMap data={sceneData} itemsByState={scenes} />


                {/* <StephenKingCharactersListings /> */}
            </div>
        </div>
    )
}

export default StephenKingCharacters


// const StephenKingCharactersListings = () => {
//     <div className="StephenKingCharacters__books">
//         {characters.map(character => (
//             <div className="StephenKingCharacters__book" key={character.book}>
//                 <h5>
//                     { character.book }
//                 </h5>

//                 <div className="StephenKingCharacters__book__lists">
//                     {["places", "orgs", "people", "years", "locations"].map(type => (
//                         <div className="StephenKingCharacters__book__list">
//                             <h6>{ type }</h6>
//                             {character[type] && Object.keys(character[type]).map(item => item.length > 2 && (
//                                 <div className="StephenKingCharacters__book__list__item" key={item}>
//                                     <b>{ item }</b>
//                                     <div>
//                                         { character[type][item] }
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         ))}
//     </div>
// }