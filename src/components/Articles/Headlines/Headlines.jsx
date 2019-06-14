import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import _ from "lodash"
import moment from "moment"
import {scaleLinear, format} from "d3"
import HeadlineChart from "./HeadlineChart/HeadlineChart"
import ButtonGroup from "components/_ui/Button/ButtonGroup/ButtonGroup"

import data from "./data"

require('./Headlines.scss')

const maxMonth = _.max(_.map(_.flatMap(data.sentiment_per_month, "sentiment"), "count"))
const unicolorScale = scaleLinear().range(["#FFFFFF", "#008D94"])
const dicolorScale = scaleLinear().range(["#FF3D33", "#FFFFFF", "#008D94"])
const monthMap = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
}
const fields = ["polarity", "words", "subjectivity", "length"]

class Headlines extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedField: "polarity",
      maxValue: 0,
    }
  }

  getClassName() {
    return classNames("Headlines", this.props.className)
  }

  componentDidMount() {
    this.getMaxValue()
  }

  onFieldChange = (field, e) => {
    this.setState({selectedField: field.label}, this.getMaxValue)
  }

  getMaxValue = () => {
    let {selectedField} = this.state

    const maxValue = _.max(_.map(_.flatMap(data.sentiment_per_month, "sentiment"), selectedField))
    this.setState({maxValue})
  }

  flattenPerMonthData = data => _.flatMap(data, year => {
    let months = _.map(year.sentiment, (d, i) => {
      d = d || {}
      d.date = moment(`${year.year}-${i + 1}`, "YYYY-M").toDate()
      return d
    })
    return months
  })

  renderYear = year => {
    let {selectedField} = this.state

    const maxCount = _.max(_.map(_.flatMap(data.sentiment_per_month, "sentiment"), selectedField))
    return (
      <div className="Headlines__year" key={year.year}>
        <div className="Headlines__year__year">{year.year}</div>
        <div className="Headlines__year__count">{numeral(year.count).format('0,0')}</div>
        <div className="Headlines__year__bar">
          <div className="Headlines__year__bar__selected" style={{width: `${year.count * 100 / maxCount}%`}} />
        </div>
      </div>
    )}

  renderCalendar = (year, i) => (
    <div className="Headlines__calendar__year" key={year.year}>
      <div className="Headlines__calendar__year__label">{year.year}</div>
      {year.sentiment.map(this.renderCalendarMonth)}
    </div>
  )

  renderCalendarMonth = (month, i) => {
    let {selectedField, maxValue} = this.state

    const colorScale = selectedField == "polarity" ?
      dicolorScale.domain([-maxValue, 0, maxValue]) :
      unicolorScale.domain([0, maxValue])

    return (
      <div
        className="Headlines__calendar__month"
        key={i}
        title={`${monthMap[numeral(i).format("00")]}: ${month && numeral(month[selectedField]).format('0,0.00')}`}
        style={{
          gridColumnStart: +i + 2,
        }}
      >
        <div className="Headlines__dot" style={{
          // height: `${month[selectedField] * 100 / maxMonth}%`,
          // width: `${month[selectedField] * 100 / maxMonth}%`,
          background: month && colorScale(month[selectedField]),
        }}></div>
      </div>
    )
  }

  render() {
    let {selectedField} = this.state

    return (
      <div className={this.getClassName()}>
        <h2>NYTimes Headlines</h2>

        <div className="Headline__controls">
          <ButtonGroup
            buttons={_.map(fields, field => ({
              label: field,
              active: selectedField == field,
            }))}
            onChange={this.onFieldChange}
          />
        </div>

        <HeadlineChart
          data={this.flattenPerMonthData(data.sentiment_per_month)}
          xField={{
            fieldName: "date",
            type:  "date",
            labelFormat: d => moment(d).format("M/YYYY"),
          }}
          yField={{
            fieldName: selectedField,
            type: "ordinal",
            labelFormat: format(",.2r"),
          }}
        />

        <div className="Headlines__calendar">
          {_.map(data.sentiment_per_month, this.renderCalendar)}
        </div>
      </div>
    )
  }
}

export default Headlines
