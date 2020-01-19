import React, { useEffect, useRef, useState } from "react"
import {useSpring, animated} from 'react-spring'
import * as d3 from "d3"
import * as d3GeoProjection from "d3-geo-projection"
import * as d3GeoPolygon from "d3-geo-polygon"
import { format, range } from "d3"
import { times } from "lodash"

import { useInterval } from 'utils/utils.js'
import Aside from "components/_ui/Aside/Aside"
import Button from "components/_ui/Button/Button"
import Code from "components/_ui/Code/Code"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"
import { P, Blockquote, CodeAndExample } from "./examples"

const Maps = () => {

  return (
    <div className="Maps">
      <p>
        So you've seen awesome examples of people using d3 to create detailed maps, and globes that you can spin around. And you want to do that, too.
      </p>

      <p>
        Worry not! We can let d3 do a lot of the heavy lifting, and have a map in no time!
      </p>
    </div>
  )
}

export default Maps;
