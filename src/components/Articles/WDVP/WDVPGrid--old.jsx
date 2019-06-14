import React, {Component} from "react"
import { FixedSizeList as List } from 'react-window'
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from 'components/_ui/Chart/Chart';
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Axis from 'components/_ui/Chart/Axis/Axis';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

// import data from "./WDVP Datasets - the future of government"
import data from "./WDVP Datasets - what makes a 'good' government"
// import data from "./WDVP Datasets - small countries are beautiful"

import './WDVPGrid.scss'

console.log(data)

const ordinalColors = ["#63cdda", "#cf6a87", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]; // "#e77f67", "#778beb",
const numberFromValue = value =>
  _.isFinite(value) ? value :
  _.isString(value) ? +value.replace(/,/g, "") :
  null

let continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const interpolatedColorScale = createScale({
  domain: [0, continents.length - 1],
  range: ["#63cdda", "#cf6a87"]
})
const blackAndWhiteColorScale = createScale({
  domain: [0, 1],
  range: ["#000", "#12CBC4"]
})
const highlightColorScale = createScale({
  domain: [0, 1],
  range: ["#fff", "#45aeb1"]
})
continents = _.map(continents, (continent, i) => ({...continent, color: interpolatedColorScale(i)}))
console.log(continents)
const continentColorScales = _.fromPairs(
  _.map(continents, continent => [
    continent.code,
    createScale({
      domain: [0, 1],
      range: ["#fff", continent.color],
    }),
  ])
)
const rankOrRawOptions = [{
  value: true,
  label: "Rank",
},{
  value: false,
  label: "Value",
}]
const metrics = [
  "population", "surface area (Km2)", "happy planet index", "human development index", "world happiness report score", "sustainable economic development assessment (SEDA)", "GDP (billions PPP)", "GDP per capita (PPP)", "GDP growth (annual %)", "health expenditure % of GDP", "health expenditure per person", "education expenditure % of GDP", "education expenditure per person", "school life expectancy (years)", "unemployment (%)", "government spending score", "government expenditure (% of GDP)", "political rights score", "civil liberties score", "political stability & absence of violence", "government effectiveness", "regulatory quality", "rule of law", "control of corruption", "judicial effectiveness score", "government integrity score", "property rights score", "tax burden score", "overall economic freedom score", "financial freedom score", "women MPs (% of all MPs)", "Area in km²",
]
const metricsColorScale = createScale({
  domain: [0, metrics.length - 1],
  range: ["#63cdda", "#e77f67"],
})
class WDVPGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scales: {},
      sort: metrics[0],
      processedData: [],
      selectedContinents: [],
      isAscending: true,
      isShowingRank: true,
    }
  }

  getClassName() {
    return classNames("WDVPGrid", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }
  chart = React.createRef()

  createScales = () => {
    const { sort, selectedContinents, isAscending, isShowingRank } = this.state

    const selectedContinentValues = _.map(selectedContinents, "code")

    const sortedData = _.orderBy(
      data,
      [d => d[`${sort}__rank`]],
      [isAscending ? "asc" : "desc"]
    )
    const filteredData = _.isEmpty(selectedContinents) ? sortedData :
      _.filter(sortedData, d => _.includes(selectedContinentValues, d.Continent))

    const scales = _.fromPairs(
      _.map(metrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(sortedData, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ scales, processedData: filteredData })
  }

  onChangeSort = metric => () => metric == this.state.sort ?
    this.setState({ isAscending: !this.state.isAscending }, this.createScales) :
    this.setState({ sort: metric, isAscending: this.state.isShowingRank ? true : false }, this.createScales)

  onContinentsSelect = continents => this.setState({ selectedContinents: continents }, this.createScales)
  onIsShowingRankSelect = newVal => this.setState({ isShowingRank: newVal.value, isAscending: !this.state.isAscending }, this.createScales)

  render() {
    const { processedData, selectedContinents, scales, sort, isAscending, isShowingRank } = this.state

    return (
      <div className={this.getClassName()}>
        <h2 className="WDVPGrid__title">
          Country Metric Explorer
        </h2>
        <div className="WDVPGrid__contents">

          <RadioGroup
            className="WDVPGrid__toggle"
            options={continents}
            value={selectedContinents}
            onChange={this.onContinentsSelect}
            isMulti
            canClear
          />

          <RadioGroup
            className="WDVPGrid__toggle"
            options={rankOrRawOptions}
            value={isShowingRank}
            onChange={this.onIsShowingRankSelect}
          />
          <div className="WDVPGrid__metrics">
            {_.map(metrics, metric => (
              <div
                key={metric}
                className={`WDVPGrid__metrics__item WDVPGrid__metrics__item--is-${sort == metric ? "selected" : "not-selected"}`}
                onClick={this.onChangeSort(metric)}>
                { metric }
              </div>
            ))}
          </div>

          <div className="WDVPGrid__countries">
            {/* <List
              height={window.innerHeight * 0.6}
              itemCount={processedData.length}
              itemSize={30}
              width={window.innerWidth * 0.9}
            >
              {({ index, style }) => {
                const country = processedData[index]
                return (
                  <WDVPGridCountry
                    style={style}
                    key={country.Country}
                    index={index}
                    country={country}
                    scales={scales}
                    sort={sort}
                    isShowingRank={isShowingRank}
                  />
                )
              }}
            </List> */}
            {_.map(processedData, (country, index) => (
              <WDVPGridCountry
                key={country.Country}
                index={index}
                country={country}
                scales={scales}
                sort={sort}
                isShowingRank={isShowingRank}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default WDVPGrid


const WDVPGridCountry = ({ index, country, scales, sort, isShowingRank }) => (
  <div className="WDVPGridCountry">
    <div className="WDVPGridCountry__label">
      <div className="WDVPGridCountry__label__index" style={{
        color: continentColorScales[country.Continent]
      }}>
        { country[`${sort}__rank`] }.
      </div>
      <div className="WDVPGridCountry__label__name">
        { country.Country }
      </div>
    </div>

    <div className="WDVPGridCountry__metrics">
      {_.map(metrics, metric => scales && (
        <WDVPGridCountryMetric
          key={metric}
          country={country.Country}
          metric={metric}
          scale={scales[metric]}
          colorScale={continentColorScales[country.Continent]}
          value={country[metric]}
          rank={country[`${metric}__rank`]}
          isSort={sort == metric}
          isShowingRank={isShowingRank}
        />
      ))}
    </div>
  </div>
)


const WDVPGridCountryMetric = React.memo(({ metric, scale, rank, colorScale, value, country, isSort, isShowingRank }) => {
  // if (!scale || !_.isFinite(value)) return <div className={`WDVPGridCountryMetric WDVPGridCountryMetric--is-${isSort ? "sort" : "not-sort"}`} />

  const color = !_.isFinite(value) ? "#ccc" :
    // isSort ?
      // highlightColorScale(isShowingRank ? 1 - (rank / data.length) : scale(value)) :
      blackAndWhiteColorScale(isShowingRank ? 1 - (rank / data.length) : scale(value))

  return (
    <div className={`WDVPGridCountryMetric WDVPGridCountryMetric--is-${isSort ? "sort" : "not-sort"}`}
    style={{
      background: color,
    }}>
      <Tooltip className="WDVPGridCountryMetric__tooltip">
        <h6>{ country }</h6>
        <div>
          { metric }: { value }, {scale(value)}
        </div>
      </Tooltip>
    </div>
  )
})