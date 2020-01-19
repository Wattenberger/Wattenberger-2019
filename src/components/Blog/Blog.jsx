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
    {_.map(posts, ({ id, url, title, description, image }) => (
      <div className="Blog__post" key={id}>
        <Link to={url || `/blog/${id}`}>
          <h3 className="Blog__title">
            { title }
          </h3>
          <img src={image} />
        </Link>

        <p className="Blog__post__description">
          { description }
        </p>
        <Link to={`/blog/${id}`}>
          <Button className="Blog__post__button">
            Read more
          </Button>
        </Link>
      </div>
    ))}
  </div>
)

export default Blog
