import React, {Component} from "react"
import classNames from "classnames"
import _ from "lodash"
import Link from "components/_ui/Link/Link"
import {projects} from "./projects"

require('./Portfolio.scss')

class Portfolio extends Component {
  getClassName() {
    return classNames("Portfolio")
  }

  renderCategory = (category, idx) => {
    return <div className="Portfolio__category" key={idx}>
      <h6 className="Portfolio__category__label">{category.category}</h6>
      {category.projects.map(this.renderItem)}
    </div>
  }

  renderItem = (item, idx) => {
    return <div className="Portfolio__item" key={idx}>
      <h2>{item.title}</h2>
      <div className="Portfolio__item__description">
        <div className="Portfolio__item__tools">
          <h6>Tools Used</h6>
          {item.tools.map(this.renderTool)}
        </div>
        {item.description}
        {!!item.link && (_.startsWith("/")
          ? <a href={item.link} className="Portfolio__item__link btn">Check it out ⇛</a>
          : <Link to={item.link} type="button" className="Portfolio__item__link btn">Check it out ⇛</Link>
        )}
      </div>
      <div className="Portfolio__item__images">
        {item.images    && item.images.map((image, idx) => this.renderImage(image, idx, item.imageContentStyle))}
        {item.component && this.renderComponent(item.component, item.imageStyle)}
      </div>
    </div>
  }

  renderImage = (image, idx, imageContentStyle={}) => {
    return <div className="Portfolio__item__image" key={idx}>
      <div className="Portfolio__item__image__content" style={{backgroundImage: `url(${image})`, ...imageContentStyle}} />
    </div>
  }

  renderComponent(component, style={}) {
    let Component = component
    return <div className="Portfolio__item__image" style={style}>
      <Component />
    </div>
  }

  renderTool(tool, idx) {
    return <div className="Portfolio__item__tool" key={idx}>
      <div className="pill">{tool}</div>
    </div>
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <h2>Projects</h2>
        {projects.map(this.renderCategory)}
      </div>
    )
  }
}

export default Portfolio
