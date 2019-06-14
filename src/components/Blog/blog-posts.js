import _ from "lodash"

import VisualDesign from "./posts/VisualDesign"

const posts = [{
    title: "Visual vs. Visualization Design",
//     link: "visual-vs-visualization-design",
//     component: VisualDesign,
},{
    title: "Drawing a Map",
    // component: VisualDesign,
}]
const processedPosts = _.map(posts, post => ({
    ...post,
    link: post.link || _.kebabCase(post.title),
}))

export default posts