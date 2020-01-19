import React, { useEffect, useRef, useState } from "react"
import {useSpring, animated} from 'react-spring'
import * as d3 from "d3"
import { format, range } from "d3"
import { times } from "lodash"

import { useInterval } from 'utils/utils.js';
import Aside from "components/_ui/Aside/Aside"
import Button from "components/_ui/Button/Button"
import Code from "components/_ui/Code/Code"
import Expandy from "components/_ui/Expandy/Expandy"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"
import { P, Blockquote, CodeAndExample } from "./examples"

const Sizing = () => {


  return (
    <div className="Sizing">
      <p>
        Let's talk about
      </p>
    </div>
  )
}

export default Sizing;
