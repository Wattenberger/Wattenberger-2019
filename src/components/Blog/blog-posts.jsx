import React from "react"
import _ from "lodash"
import List from "components/_ui/List/List"
import LocalExample from "components/_ui/LocalExample/LocalExample";


// eslint-disable-next-line import/no-webpack-loader-syntax
const dataCsv = require("!!raw-loader!examples/interactions/data.csv").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFull = require("!!raw-loader!examples/interactions/bars-full/chart.js").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFullHtml = require("!!raw-loader!examples/interactions/bars-full/index.html").default
// eslint-disable-next-line import/no-webpack-loader-syntax
const exampleBarsFullCss = require("!!raw-loader!examples/interactions/bars-full/styles.css").default

// import VisualDesign from "./posts/VisualDesign"

const posts = [{
    title: "Interactive Charts with D3.js",
    link: "d3.interactive-charts",
    description: <>

        <p>
        You did it! You grabbed a data set and visualized it, right here in the browser. Congratulations, that is no easy feat!
        </p>
        <p>
            <b>This is 2019</b> and the web browser opens up a whole new realm of possibilities when visualizing data.
        </p>

        <List
          items={[
            <>If a user wonders what the exact value of a data point is, they can hover over it and find out</>,
            <>We can even show whole charts <i>within</i> a chart tooltip</>,
            <>We can tell a story with a chart, progressively revealing parts of it as the user scrolls</>,
          ]}
        />
        <p>
          Let’s take advantage of these new possibilities and talk about how to take your chart to the next level.
        </p>

        <LocalExample
          className="Interactions__iframe"
          html={exampleBarsFullHtml}
          css={exampleBarsFullCss}
          js={exampleBarsFull}
          data={dataCsv}
        />

    </>,
//     component: VisualDesign,
// },{
//     title: "Visual vs. Visualization Design",
// //     link: "visual-vs-visualization-design",
// //     component: VisualDesign,
// },{
//     title: "Drawing a Map",
//     // component: VisualDesign,
}]
const processedPosts = _.map(posts, post => ({
    ...post,
    link: post.link || _.kebabCase(post.title),
}))

export default posts