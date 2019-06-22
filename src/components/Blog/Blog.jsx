import React, {Component} from "react"
import _ from "lodash"
import Link from "components/_ui/Link/Link";
import Button from "components/_ui/Button/Button";
import posts from "./blog-posts.jsx"

require('./Blog.scss')

const Blog = () => (
  <div className="Blog">
    <h1>
      Thoughts
    </h1>
    {_.map(posts, post => (
      <div className="Blog__post" key={post.id}>
        <Link to={`/blog/${post.id}`}>
          <h3 className="Blog__title">
            { post.title }
          </h3>
        </Link>

        <p className="Blog__post__description">
          { post.description }
        </p>
        <Link to={`/blog/${post.id}`}>
          <Button className="Blog__post__button">
            Read more
          </Button>
        </Link>
      </div>
    ))}
  </div>
)

export default Blog
