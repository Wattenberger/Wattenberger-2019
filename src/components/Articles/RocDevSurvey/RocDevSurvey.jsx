import React, {Component} from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import dataExperience from "./experience.json"
import dataManagement from "./management.json"
import dataRace from "./race.json"
import dataRemote from "./remote.json"
import dataSize from "./size.json"
import dataTime from "./time.json"
import 'components/Articles/RocDevSurvey/RocDevSurvey.scss';

const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])
const datasets = {
  experience: {
    label: "Years of Experience",
    data: dataExperience,
    key: "yoe",
    options: ["<2", "3-5", "6-10", "11-15", "16+", ],
    isOrdinal: true,
    formatOption: d => `${d} years`,
  },
  management: {
    label: "Is Management",
    data: dataManagement,
    formatOption: d => d == "true" ? "Management" : "Not management",
  },
  race: {
    label: "Race",
    data: _.map(dataRace, d => ({
      ...d,
      // race: _.includes(d.race, ", ") ? "Mixed" : d.race,
      race: d.race == "White or European descent" ? "White or European descent" : "Not White or European descent",
    })),
    filteredKeys: ["Prefer not to say"],
    disclaimer: "Non-white races bucketed to preserve anonymity",
    formatOption: d => d,
  },
  remote: {
    label: "Is Remote",
    data: dataRemote,
    formatOption: d => d == "true" ? "Remote" : "Not remote",
  },
  size: {
    label: "Company Size (# Employees)",
    data: dataSize,
    key: "num_employees",
    options: [ "1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1001-2000", "2001-5000", "5001-10000", "10001+", ],
    isOrdinal: true,
    formatOption: d => `${d} employees`,
    formatOptionLegend: d => d,
  },
  time: {
    label: "Employment Status",
    data: dataTime,
    key: "ftcon",
    formatOption: d => d,
  },
}

const parsedDatasets =_.map(datasets, (dataset, key) => {
  key = dataset.key || key
  const data = _.filter(dataset.data, d => !_.includes([null, ...(dataset.filteredKeys || [])], d[key]))
  const counts = _.countBy(data, key)
  const maxCount = _.max(_.values(counts))
  const options = dataset.options || _.keys(counts)
  const countsBySalary = _.fromPairs(_.map(_.groupBy(data, "salary"), (children, salary) => [salary, _.countBy(children, key)]))
  const maxCountBySalary = _.max(_.flatMap(_.values(countsBySalary), d => _.values(d)))
  const means = _.fromPairs(
    _.map(_.groupBy(data, key), (salaries, group) => [
      group,
      _.meanBy(salaries, "salary"),
    ])
  )
  const colors = dataset.isOrdinal ?
    _.times(options.length, i => colorScale(i / (options.length - 1))) :
    ordinalColors
  const keyColors = _.zipObject(options, colors)
  const extent = d3.extent(_.map(data, "salary"))
  const xScale = d3.scaleLinear().domain(extent);
  const buckets = d3.histogram()
    .domain(extent)
    .thresholds(xScale.ticks(10))
  const bins = buckets(data);

  return {
    ...dataset,
    key,
    data,
    counts,
    means,
    maxCount,
    maxCountBySalary,
    countsBySalary,
    options,
    colors: keyColors,
    bins,
  }
})
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

class RocDevSurvey extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  contents = React.createRef()
  groups = _.fromPairs(_.map(parsedDatasets, dataset => [
    dataset.key,
    React.createRef(),
  ]))

  componentDidMount() {
  }

  getClassName() {
    return classNames("RocDevSurvey", this.props.className)
  }

  takeSnapshotsOfContents = () => {
    const elem = this.contents.current

    domToImage.toPng(elem)
      .then(function (dataUrl) {
        const img = new Image()
        img.src = dataUrl

        const link = document.createElement('a');
        link.download = `2018-rocdev-salary-survey-results.jpeg`;
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error)
      })
  }

  takeSnapshots = () => {
    _.each(this.groups, (group, key) => {
      if (!group) return
      const elem = group.current.elem.current

      domToImage.toPng(elem)
        .then(function (dataUrl) {
          const img = new Image()
          img.src = dataUrl

          const link = document.createElement('a');
          link.download = `2018-rocdev-salary-survey-results--${key}.jpeg`;
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error)
        })
    })
  }


  render() {
    const {  } = this.state

    return (
      <div className={this.getClassName()}>
        <div className="RocDevSurvey__title-container">
          <h2 className="RocDevSurvey__title">
            RocDev Salary Survey
          </h2>
          <Button className="RocDevSurvey__title__button" onClick={this.takeSnapshots}>
            Take snapshots
          </Button>
        </div>
        <div className="RocDevSurvey__contents" ref={this.contents}>
        {_.map(parsedDatasets, (dataset, key) => (
          <RocDevSurveyGroup
            {...dataset}
            ref={this.groups[dataset.key]}
          />
        ))}

      </div>
    </div>
    )
  }
}

export default RocDevSurvey

class RocDevSurveyGroup extends Component {
  elem = React.createRef()

  render() {
    const { label, disclaimer, bins, options, colors, means, counts, maxCount, maxCountBySalary, countsBySalary, formatOption, formatOptionLegend, isOrdinal, filteredKeys,...props } = this.props
    return (
      <div className="RocDevSurveyGroup" ref={this.elem}>
        <h3 className="RocDevSurveyGroup__label">
          { label }
        </h3>

            <div className="RocDevSurveyGroup__legend">
              <div className="RocDevSurveyGroup__content">
                <div className="RocDevSurveyGroup__bars">
                  <div className="RocDevSurveyGroup__bars__item">
                    <div className="RocDevSurveyGroup__bars__item__text">
                      <div className="RocDevSurveyGroup__bars__item__text__label">
                      </div>
                      <div className="RocDevSurveyGroup__bars__item__text__mean">
                        <div className="RocDevSurveyGroup__histogram__mean" />
                          Mean
                      </div>
                    </div>
                  </div>
                </div>

                <div className="RocDevSurveyGroup__histograms">
                    <div className="RocDevSurveyGroup__histogram">
                      {_.map(_.first(parsedDatasets).bins, (bin) => (
                        <div className="RocDevSurveyGroup__histogram__item" key={bin.x0}>
                          <div className="RocDevSurveyGroup__histogram__item__text">
                            <span className="RocDevSurveyGroup__number-prefix">$</span>{ formatNumber(bin.x0 / 1000) }k
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

        <div className="RocDevSurveyGroup__content">
          <div className="RocDevSurveyGroup__bars">
            {_.map(options, option => (
              <div className="RocDevSurveyGroup__bars__item" key={option}>
                <div className="RocDevSurveyGroup__bars__item__text">
                  <div className="RocDevSurveyGroup__bars__item__text__label">
                    { formatOptionLegend ? formatOptionLegend(option) : formatOption(option) }
                  </div>
                  <div className="RocDevSurveyGroup__bars__item__text__mean">
                    { formatSalary(means[option]) }
                  </div>
                </div>
                <div className="RocDevSurveyGroup__bars__item__bar" style={{
                  width: `${(counts[option] * 100) / maxCount}%`,
                  // background: colors[option],
                }} />
              </div>
            ))}
          </div>

          <div className="RocDevSurveyGroup__histograms">
            {_.map(options, (option, i) => (
              <div className="RocDevSurveyGroup__histogram" key={option}>
              {/* <div className="RocDevSurveyGroup__histogram__item__legend">
              { formatSalary(bin.x0 / 1000) }k
            </div> */}
                  <div className="RocDevSurveyGroup__histogram__mean"
                    style={{
                      left: `${((means[option] - _.first(bins).x0) * 100) / ((_.last(bins).x1 + 10000) - _.first(bins).x0)}%`,
                    }}
                  />
                {_.map(bins, (bin) => (
                  <div className="RocDevSurveyGroup__histogram__item" key={bin.x0}>
                    <div className="RocDevSurveyGroup__histogram__item__bar" style={{
                      // height: `${(((countsBySalary[bin.x0] || {})[option] ||0) * 100) / maxCountBySalary}%`,
                      // background: colors[option],
                      opacity: ((countsBySalary[bin.x0] || {})[option] ||0) / maxCountBySalary,
                      zIndex: maxCountBySalary - ((countsBySalary[bin.x0] || {})[option] ||0),
                    }}>
                    </div>
                    <Tooltip className="RocDevSurveyGroup__histogram__item__tooltip">
                      { formatOption(option) }: { formatSalary(bin.x0) } ({ (countsBySalary[bin.x0] || {})[option] ||0 })
                    </Tooltip>
                  </div>
                ))}
              </div>
            ))}
          </div>

        {/*  <div className="RocDevSurvey__histogram">
            {_.map(bins, (bin) => (
              <div className="RocDevSurvey__histogram__item" key={bin.x0}>
                <div className="RocDevSurvey__histogram__item__legend">
                  { formatSalary(bin.x0 / 1000) }k
                </div>
                {_.map(options, (option, i) => (
                  <Tooltip className="RocDevSurvey__histogram__item__bar" key={option} style={{
                    height: `${(((countsBySalary[bin.x0] || {})[option] ||0) * 100) / maxCountBySalary}%`,
                    background: colors[option],
                    zIndex: maxCountBySalary - ((countsBySalary[bin.x0] || {})[option] ||0),
                  }}>
                    { option }: { formatSalary(bin.x0) } ({ (countsBySalary[bin.x0] || {})[option] ||0 })
                  </Tooltip>
                ))}
              </div>
            ))}
          </div> */}
        </div>
          {disclaimer && (
            <div className="RocDevSurveyGroup__disclaimer">
              { disclaimer }
            </div>
          )}

      </div>
    )
  }
}