import React from "react"

import Link from "components/_ui/Link/Link"

import jsPartyImage from "./images/js-party.png"
import policyVizImage from "./images/policy-viz.png"
import dataStoriesImage from "./images/data-stories.jfif"
import eggheadImage from "./images/egghead.png"
import devModeImage from "./images/devmode.png"

export default [{
  name: "Fullstack D3",
  podcast: "JS Party",
  googleUrl: "https://podcasts.google.com/?feed=aHR0cHM6Ly9jaGFuZ2Vsb2cuY29tL2pzcGFydHkvZmVlZA&episode=Y2hhbmdlbG9nLmNvbS82Lzg3MA&hl=en&ved=2ahUKEwjA-tDd_MTnAhWFdt8KHXhVBAMQjrkEegQIARAG&ep=6",
  url: "https://changelog.com/jsparty/113",
  date: "2/7/2020",
  description: <>
    A chat with <Link href="https://twitter.com/EmmaBostian">Emma Bostian</Link> and <Link href="https://twitter.com/jerodsanto">Jerod Santo</Link> about my background, Javascript chart libraries, data viz, and the process behind my <Link to="/blog/css-cascade">CSS Cascade</Link> blog post.
    <br />
    When then spend 20 minutes talking about the process behind my <Link to="https://2019.stateofjs.com/overview/">State of JS chart</Link>.
  </>,
  image: jsPartyImage,
  colors: ["#E4BC24", "#101820", "#E0E0Ed"],
},{
  name: "Episode #165: Amelia Wattenberger",
  podcast: "The PolicyViz Podcast",
  googleUrl: "https://podcasts.google.com/?feed=aHR0cHM6Ly9wb2xpY3l2aXouY29tL2ZlZWQvcG9kY2FzdC8&episode=aHR0cDovL3BvbGljeXZpei5jb20vP3Bvc3RfdHlwZT1wb2RjYXN0JnA9OTg2NQ&hl=en&ved=2ahUKEwjA-tDd_MTnAhWFdt8KHXhVBAMQjrkEegQIARAI&ep=6",
  url: "https://policyviz.com/podcast/episode-165-amelia-wattenberger/",
  date: "1/7/2020",
  description: <>
    I'm a huge fan of the PolicyViz Podcast with <Link href="https://twitter.com/jschwabish">Jon Schwabish</Link> — he always has great guests, a relaxed vibe, and asks great questions.
    <br />
    In this episode, we chat about <Link href="https://www.newline.co/fullstack-d3">Fullstack D3 and Data Visualization</Link>, developing data viz in the browser, and a really fun augmented reality project I worked on.
  </>,
  image: policyVizImage,
  colors: ["#002548", "#F58720", "#E0E0Ed"],
},{
  name: "152  |  Year in Review 2019",
  podcast: "Data Stories",
  googleUrl: "https://podcasts.google.com/?feed=aHR0cHM6Ly9kYXRhc3RvcmkuZXMvZmVlZC9tcDMv&episode=cG9kbG92ZS0yMDE5LTEyLTExdDIwOjIwOjI2KzAwOjAwLWFhMTBkZDg3MjQ1M2E1Mw&ved=0CAYQkfYCahcKEwi445j4_sTnAhUAAAAAHQAAAAAQBg",
  url: "https://datastori.es/152-year-in-review-2019/#t=13:40.240",
  date: "12/18/2019",
  description: <>
    Data Stories is one of my favorite podcasts — I love how much fun Enrico and Moritz seem to have when they record! I was delighted when they reached out for their end-of-year episode.
    <br />
    I got to talk about <b>learning data viz from a newcomer's perspective</b>, including the new <Link href="https://www.datavisualizationsociety.com/connect">Data Visualization Society</Link>, <Link href="https://www.figma.com/c/plugin/736737028247625415/Datavizer">a plugin I created for Figma</Link>, and the challenge of being aware of data collection.
  </>,
  image: dataStoriesImage,
  colors: ["#552DAA", "#4B28A0", "#E0E0Ed"],
},{
  name: "Writing The Book On Data Visualization With Amelia Wattenberger",
  podcast: "egghead.io developer chats",
  googleUrl: "https://podcasts.google.com/?feed=aHR0cHM6Ly9mZWVkcy5zaW1wbGVjYXN0LmNvbS9zYVJDTFhWWQ&episode=MzU4ZjM1MjEtOTZhNC00MTJhLTgzZjMtYmIzNGMxMTliZWU4&hl=en&ved=2ahUKEwjA-tDd_MTnAhWFdt8KHXhVBAMQjrkEegQIARAE&ep=6",
  url: "https://egghead.io/podcasts/writing-the-book-on-data-visualization-with-amelia-wattenberger",
  date: "12/11/2019",
  description: <>
    This was actually the first podcast I recorded on. Joel was an amazing host, and asked some really great questions about d3, data viz, and the process behind the <Link to="/blog/react-hooks">Thinking in React Hooks</Link> blog post.
  </>,
  image: eggheadImage,
  colors: ["#252525", "#56555B", "#E0E0Ed"],
},{
  name: "Exploring Data Visualization with d3.js",
  podcast: "devMode.fm",
  googleUrl: "https://podcasts.google.com/?feed=aHR0cHM6Ly9kZXZtb2RlLmZtL3Jzcw&episode=aHR0cHM6Ly9kZXZtb2RlLmZtLzU4&hl=en&ved=2ahUKEwjA-tDd_MTnAhWFdt8KHXhVBAMQjrkEegQIARAQ&ep=6",
  url: "https://devmode.fm/episodes/exploring-data-visualization-with-d3-js",
  date: "11/25/2019",
  description: <>
    Andrew Welch, Patrick Harrington, and I chat about the origins of data visalization, my personal approach, and how the d3 library is split into modules.
  </>,
  image: devModeImage,
  colors: ["#34C0CE", "#EC4F84", "#E0E0Ed"],
// },{
//   name: "",
//   podcast: "Chats with Kent",
//   googleUrl: "",
//   url: "",
//   date: "",
  // description: <>
  // </>,
// },{
  // name: "",
  // podcast: "",
  // googleUrl: "",
  // url: "",
  // date: "",
  // description: <>
  // </>,
}]