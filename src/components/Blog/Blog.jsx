import React, {Component} from "react"
import _ from "lodash"
import Logo from "components/_ui/Logo";
import Link from "components/_ui/Link";
import posts from "./blog-posts"

require('./Blog.scss')

const Blog = () => (
  <div className="Blog">
    <h1>
      Thoughts
    </h1>
    {_.map(posts, post => (
      <div className="Blog__post" key={post.link}>
        <h3>
          { post.title }
        </h3>
      </div>
    ))}
  </div>
)

export default Blog
