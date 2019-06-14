import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import moment from "moment"
import * as d3 from "d3"
import Chart from "components/_ui/Chart/Chart"
import Axis from "components/_ui/Chart/Axis/Axis"
import Scatter from "components/_ui/Chart/Scatter/Scatter"
import Tooltip from "components/_ui/Chart/Tooltip/Tooltip"
const data = {}

require('./Superbowl.scss')
const fields = {
  date: "Date",
  sb: "SB",
  attendance: "Attendance",
  q_b_winner: "QB  Winner",
  coach_winner: "Coach Winner",
  winner: "Winner",
  winning_pts: "Winning Pts",
  q_b_loser: "QB Loser",
  coach_loser: "Coach Loser",
  loser: "Loser",
  losing_pts: "Losing Pts",
  mvp: "MVP",
  stadium: "Stadium",
  city: "City",
  state: "State",
  point_difference: "Point Difference",
  referee: "Referee",
  umpire: "Umpire",
  head_linesman: "Head Linesman",
  line_judge: "Line Judge",
  field_judge: "Field Judge",
  back_judge: "Back Judge",
  side_judge: "Side Judge",
}
const dataDateFormat = "DD-MMM-YY"
const dateFormat = "MMM DD, YYYY"
const xKey = "Attendance"
const yKey = "Winning Pts"

class Superbowl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: {},
      scatter: {},
    }
  }

  getClassName() {
    return classNames("Superbowl", this.props.className)
  }

  getScales = () => {[
    {
      dimension: "x",
      domain: [0, d3.max(data, d => d[xKey])],
    },
    {
      dimension: "y",
      domain: [0, d3.max(data, d => d[yKey])],
    },
  ]}

  renderTooltip = (d) => {
    let {xKey, yKey, dataKey} = this.props

    return <div>
      <h6>{moment(d.Date, dataDateFormat).format(dateFormat)}</h6>
      <div><b>{xKey}</b>: {d3.format(",")(d[xKey])}</div>
      <div><b>{yKey}</b>: {d3.format(",")(d[yKey])}</div>
      <div><b>Winner</b>: {d.Winner}</div>
    </div>
  }


  render() {
  	let {chart, scatter} = this.state

    return (
      <div className={this.getClassName()}>
      	<h1>Superbowl</h1>
      	<Chart
      	  data={data}
      	  height={400}
          width={window.innerWidth < 700 ?
            window.innerWidth * 0.95 :
            800
          }
          margin={{top: 10, right: 10, bottom: 30, left: 60}}
      	  scales={this.getScales()}
          ref={Chart => this.chart = Chart}
        >
          <Axis
            chart={chart}
            scale="x"
            dimension="x"
            format={d => d3.format(".2s")(d)}
            label={xKey}
          />
          <Axis
            chart={chart}
            scale="y"
            dimension="y"
            format={d => d3.format(".2s")(d)}
            label={yKey}
          />
          <Scatter
            chart={chart}
            data={data}
            xAccessor={d => chart.state && chart.state.scales.x(d[xKey])}
            yAccessor={d => chart.state && chart.state.scales.y(d[yKey])}
            ref={Scatter => this.scatter = Scatter}
          />
          <Tooltip
            type="scatter"
            elem={scatter}
            renderElem={this.renderTooltip}
            xAccessor={d => chart.state && chart.state.scales.x(d[xKey])}
            yAccessor={d => chart.state && chart.state.scales.y(d[yKey])}
          />
  	    </Chart>
      </div>
    )
  }
}

export default Superbowl
