import React, {Component} from "react"
import classNames from "classnames"
import WatercolorCanvas from "components//_shared/WatercolorCanvas/WatercolorCanvas"

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
            <div className="HomeHeader__content__text__top">Hi I’m</div>
            <h1 className="HomeHeader__content__text__title">Amelia Wattenberger</h1>

            <div className="HomeHeader__content__text__description">
              I write code, think about data, and create digital experiences. Currently front-end development & UX at <a href="https://www.parse.ly/" target="_blank" rel="noopener noreferrer">Parse.ly</a>.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeHeader
