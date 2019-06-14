import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import HealthCareTimeSeries from "./HealthCareTimeSeries/HealthCareTimeSeries"
import {healthExpenditurePerCapita, lifeExpectancyAtBirth} from "./data"

require('./HealthCare.scss')

class HealthCare extends Component {
  getClassName() {
    return classNames("HealthCare", this.props.className)
  }

  renderExpenditureTooltip(point) {
    return <div>
      <div>{point.xValue} - {point.country}</div>
      <h6>{numeral(point.yValue).format('$0,0')} million spent per person</h6>
    </div>
  }

  renderLifeExpectancyTooltip(point) {
    return <div>
      <div>{point.xValue} - {point.country}</div>
      <h6>{numeral(point.yValue).format('0.0')} years old</h6>
    </div>
  }


  render() {
    return (
      <div className={this.getClassName()}>
        <HealthCareTimeSeries
          label="Personal Health Care Expenditure per person"
          data={healthExpenditurePerCapita}
          renderTooltip={::this.renderExpenditureTooltip}
          yAxisFormatting={d => numeral(d).format("$0,0")}
        />
        <HealthCareTimeSeries
          label="Life Expectancy at Birth"
          data={lifeExpectancyAtBirth}
          renderTooltip={::this.renderLifeExpectancyTooltip}
          yAxisFormatting={d => d}
        />
      </div>
    )
  }
}

export default HealthCare
