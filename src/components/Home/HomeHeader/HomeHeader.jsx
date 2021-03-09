import React, {Component} from "react"
import classNames from "classnames"
import Link from "components/_ui/Link/Link"
import WatercolorCanvas from "components/_shared/WatercolorCanvas/WatercolorCanvas"

require('./HomeHeader.scss')

class HomeHeader extends Component {
  getClassName() {
    return classNames("HomeHeader")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <WatercolorCanvas className="HomeHeader__watercolor-canvas" />
        <div className="HomeHeader__content">
          <div className="HomeHeader__content__text">
            <div className="HomeHeader__content__text__top">Hi, I’m</div>
            <h1 className="HomeHeader__content__text__title">Amelia Wattenberger</h1>

            <div className="HomeHeader__content__text__description">
              I write code, think about data, and create digital experiences.
              <br />
              Currently Staff Research Engineer doing R&D on developer experience on the Github Office of the CTO team.
              <br />
              <br />
              Listen to <Link to="/podcasts">podcasts I've been on</Link>, or read <Link to="/blog">articles I've written</Link>.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeHeader
