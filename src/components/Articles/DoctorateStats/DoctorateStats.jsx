import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip-old/Tooltip"
import Button from "components/_ui/Button/Button"
import dataSalaryByField from "./salary-by-field.csv"
// console.log(dataSalaryByField)
import './DoctorateStats.scss';

const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const datasets = {
  salaryByField: {
    label: "Salary by field & sex",
    data: dataSalaryByField,
    key: "Field of study",
    fields: ["Employment - Male", "Employment - Female", "Postdoctoral study - Male", "Postdoctoral study - Female"],
  },
}

// const parsedDatasets =_.map(datasets, (dataset, key) => {
//   key = dataset.key || key
//   const data = _.filter(dataset.data, d => !_.includes([null, ...(dataset.filteredKeys || [])], d[key]))
//   const counts = _.countBy(data, key)
//   const maxCount = _.max(_.values(counts))
//   const options = dataset.options || _.keys(counts)
//   const countsBySalary = _.fromPairs(_.map(_.groupBy(data, "salary"), (children, salary) => [salary, _.countBy(children, key)]))
//   const maxCountBySalary = _.max(_.flatMap(_.values(countsBySalary), d => _.values(d)))
//   const means = _.fromPairs(
//     _.map(_.groupBy(data, key), (salaries, group) => [
//       group,
//       _.meanBy(salaries, "salary"),
//     ])
//   )
//   const colors = dataset.isOrdinal ?
//     _.times(options.length, i => colorScale(i / (options.length - 1))) :
//     ordinalColors
//   const keyColors = _.zipObject(options, colors)
//   const extent = d3.extent(_.map(data, "salary"))
//   const xScale = d3.scaleLinear().domain(extent);
//   const buckets = d3.histogram()
//     .domain(extent)
//     .thresholds(xScale.ticks(10))
//   const bins = buckets(data);

//   return {
//     ...dataset,
//     key,
//     data,
//     counts,
//     means,
//     maxCount,
//     maxCountBySalary,
//     countsBySalary,
//     options,
//     colors: keyColors,
//     bins,
//   }
// })
// console.log({parsedDatasets})


// const parsedData = _.map(data, (info, name) => _.extend({}, info, {
//   name,
//   date: new Date(_.get(info, "Date")),
//   job: _.get(info,"Job").split(", "),
// }))
// console.table(_.first(parsedData))
// const jobs = _.sortBy(_.filter(_.toPairs(_.countBy(_.map(_.flatMap(parsedData, "job"), job => job.replace(" / ", "/")))), "0"), d => -_.get(d, 1))
// console.log(jobs)
// const total = parsedData.length;
// const genders = _.sortBy(_.filter(_.toPairs(_.countBy(parsedData, "Gender")), "0"), d => -_.get(d, 1))

class DoctorateStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  getClassName() {
    return classNames("DoctorateStats", this.props.className)
  }

  render() {
    const {  } = this.state

    return (
      <div className={this.getClassName()}>
        <div className="DoctorateStats__title-container">
          <h2 className="DoctorateStats__title">
            Doctorate Stats
          </h2>
        </div>
        <div className="DoctorateStats__contents">
          {_.map(datasets, (dataset, label) => (
            <div className="DoctorateStats__group" key={label}>
              <h3>
                { label }
              </h3>
              <div className="DoctorateStats__bars">
                {_.map(dataset.data, (d) => (
                  <div className="DoctorateStats__bar-group" key={d[dataset.key]}>
                    <div className="DoctorateStats__bar-group__label">
                      { d[dataset.key] }
                    </div>
                    {_.map(dataset.fields, field => (
                      <div className="DoctorateStats__bar" key={field}>
                        <div className="DoctorateStats__bar__label">
                          { field }
                        </div>
                        <Tooltip className="DoctorateStats__bar__fill" style={{width: `${d[field] / 200}px`}}>
                          { field }: { formatSalary(d[field]) }
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
    </div>
    )
  }
}

export default DoctorateStats
