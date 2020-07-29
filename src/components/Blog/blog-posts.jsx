import React from "react"
import _ from "lodash"
import List from "components/_ui/List/List"
import LocalExample from "components/_ui/LocalExample/LocalExample";
import hooksImage from "./posts/react-hooks.png"
import d3Image from "./posts/d3.png"
import gaugeImage from "./posts/gauge.png"
import spiralsImage from "./posts/spirals.png"
import d3InteractiveImage from "./posts/d3-interactive.png"
import scalingSvgImage from "./posts/scaling-svg.png"
import cssCascadeImage from "./posts/css-cascade.png"
import reactAndD3Image from "./posts/react-and-d3.png"
import CssPercentsImage from "./posts/css-percents.png"

import constructionGif from "components/_shared/construction.gif";

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
  title: "What does 100% mean in CSS?",
  id: "css-percents",
  image: CssPercentsImage,
  description: <>
    One of the CSS units I use most is the wonderful <b>%</b> — so handy for positioning elements on the page. Unfortunately, the rules aren’t exactly straightforward. One question I’m always asking myself is: <em>Percent of what?</em>
  </>
},{
  title: "Speeding up force simulations with spirals",
  id: "spirals",
  image: spiralsImage,
  description: <>
    D3.js force simulations are great for implementing basic physical rules, but they can be expensive to run. Here's a trick I've used in the past to speed up those simulations.
  </>
},{
  title: "How to create a Gauge component in React.js",
  id: "gauge",
  image: gaugeImage,
  description: <>
    Let's create a Gauge in React! Gauges are great at showing context around a single value. Is it high or low? Is it larger or smaller than this other value? But what we'll learn here isn't really about creating a gauge, it's about learning the concepts we could use to create one.
  </>
},{
  title: "React and D3",
  id: "react-and-d3",
  image: reactAndD3Image,
  description: <>
    When I visualize data on the web, my current favorite environment is using <b>D3.js</b> inside of a <b>React.js</b> application. These two technologies are notoriously tricky to combine. Here's my opinionated guide to living with both, in harmony.
    <br />
    <br />
    <img alt="under construction" src={constructionGif} />
  </>
},{
  title: "The CSS Cascade",
  id: "css-cascade",
  image: cssCascadeImage,
  description: <>
    We style our websites using CSS, which stands for <b>Cascading Style Sheets</b>, but what does <b>Cascading</b> really mean? To save ourselves from future angst, let's take a step back and learn this thing for real.
  </>
},{
  title: "Scaling SVG Elements",
  id: "scaling-svg",
  url: `/guide/scaling-svg`,
  image: scalingSvgImage,
  description: <>
    Scaling svgs can be a daunting task, since they act very differently than normal images. Instead of thinking of svgs as images, let's get an understanding of viewBox and change our mindset.
  </>
},{
  title: "Thinking in React Hooks",
  id: "react-hooks",
  image: hooksImage,
  description: <>
    React introduced hooks one year ago, and they've been a game-changer for a lot of developers. There are tons of how-to introduction resources out there, but I want to talk about the <b>fundamental mindset change</b> when switching from React class components to function components + hooks.
  </>
  // component: Hooks,
},{
  title: "How to learn D3.js",
  id: "d3",
  image: d3Image,
  description: <>
    So, you want to create amazing data visualizations on the web and you keep hearing about D3.js. But what is D3.js, and how can you learn it? Let’s start with the question: What is D3?
  </>,
},{
    title: "Interactive Charts with D3.js",
    id: "d3-interactive-charts",
    image: d3InteractiveImage,
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
    // component: VisualDesign,
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