import React, { useMemo, useState } from "react"
import { Twemoji } from "react-emoji-render"
import * as d3 from "d3"

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, ReadMore, P } from "./LearnD3"
import bookImage from "images/book.png";
import voronoiImage from "./voronoi.png";

const LearnD3Specific = ({ onScrollToSectionLocal }) => {

    return (
        <div className="LearnD3Specific">
          <p>
            One of the reasons D3.js seems so monolithic is that it has so much specialized code for specific data visualizations.
          </p>

          <p>
            There's a module for creating <DocsLink repo="chord">chord diagrams</DocsLink>,
          </p>
          <img src="https://raw.githubusercontent.com/d3/d3-chord/master/img/chord.png" alt="Chord diagram"  style={{maxWidth: "27em"}} />
          <br />
          <br />
          <p>
            two modules for creating voronoi - <DocsLink repo="voronoi">one slower, deprecated one</DocsLink> and <DocsLink repo="delaunay">one faster, newer one</DocsLink>
,          </p>
          <img src={voronoiImage} alt="Voronoi example" />
          <br />
          <br />
          <p>
            a module for creating <DocsLink repo="force">force diagrams</DocsLink>,
          </p>
          <img src="https://raw.githubusercontent.com/d3/d3-force/master/img/tree.png" alt="Force diagram" />
          <br />
          <br />
          <p>
            a module for creating <DocsLink repo="sankey">sankey diagrams</DocsLink>,
          </p>
          <img src="https://raw.githubusercontent.com/d3/d3-sankey/master/img/energy.png" alt="Sankey diagram" />
          <br />
          <br />
          <p>
            a module for creating <DocsLink repo="contour">contours</DocsLink>,
          </p>
          <img src="https://raw.githubusercontent.com/d3/d3-contour/master/img/faithful.png" alt="Contours" />
          <br />
          <br />
          <p>
            a module for creating <DocsLink repo="hexbin">hexbins</DocsLink>,
          </p>
          <img src="https://raw.githubusercontent.com/d3/d3-hexbin/master/img/bivariate.jpg" alt="Hexbins example" />
          <br />
          <br />
          <p>
            and a module for <DocsLink repo="hierarchy">dealing with hierarchical data</DocsLink> and creating things like the circle pack <span className="desktop">to the right</span><span className="mobile">(shown on desktop)</span>.
          </p>
          <img src="https://raw.githubusercontent.com/d3/d3-hierarchy/master/img/treemap.png" alt="Treemap" />
          <br />
          <br />

          <p>
            There are even modules for specific interactions, like <DocsLink repo="brush">brushing</DocsLink>, <DocsLink repo="zoom">zooming</DocsLink>, and <DocsLink repo="drag">dragging</DocsLink>.
          </p>

          <p>
            And there are modules for specific parts of charts, like <DocsLink repo="axis">axes</DocsLink>.
          </p>

          <p>
            While these specialized modules aren't worth learning just for learning's sake, it's good to know what's available.
          </p>

        </div>
    )
}

export default LearnD3Specific

