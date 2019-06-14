import React, {Component} from "react"
import { FixedSizeList as List } from 'react-window'
import * as d3 from "d3"
import numeral from "numeral"
import classNames from "classnames"
import _ from "lodash"
import Tooltip from "components/_ui/Tooltip-old/Tooltip"
import Button from "components/_ui/Button/Button"
import Chart from 'components/_ui/Chart/Chart';
import { createScale } from 'components/_ui/Chart/utils/scale';
import Line from 'components/_ui/Chart/Line/Line';
import Axis from 'components/_ui/Chart/Axis/Axis';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';

// import data from "./WDVP Datasets - the future of government"
import data from "./WDVP Datasets - what makes a 'good' government.json"
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
  range: ["#dff9fb", "#130f40"]
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
  "population", "surface area (Km2)", "happy planet index", "human development index", "world happiness report score", "sustainable economic development assessment (SEDA)", "GDP (billions PPP)", "GDP per capita (PPP)", "GDP growth (annual %)", "health expenditure % of GDP", "health expenditure per person", "school life expectancy (years)", "unemployment (%)", "government spending score", "government expenditure (% of GDP)", "political rights score", "civil liberties score", "political stability & absence of violence", "government effectiveness", "regulatory quality", "rule of law", "control of corruption", "judicial effectiveness score", "government integrity score", "property rights score", "tax burden score", "overall economic freedom score", "financial freedom score", "women MPs (% of all MPs)", "Area in km²",
  // "education expenditure % of GDP", "education expenditure per person",
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
      hoveredCountry: null,
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
  onCountryHover = country => this.setState({ hoveredCountry: country })

  render() {
    const { processedData, selectedContinents, scales, sort, hoveredCountry, isAscending, isShowingRank } = this.state

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

          {/* <div className="WDVPGrid__header">
            {_.map(processedData, country => (
              <div
                key={country.Country}
                className={`WDVPGrid__header__item WDVPGrid__header__item--is-${hoveredCountry == country.Country ? "hovered" : "not-hovered"}`}>
                <div className="WDVPGrid__header__item__text">
                  { country.Country }
                </div>
              </div>
            ))}
          </div> */}

          <div className="WDVPGrid__chart">
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

          {/* <div className="WDVPGrid__rows">
            {_.map(metrics, metric => (
              <WDVPGridMetric
                key={metric}
                metric={metric}
                data={processedData}
                scales={scales}
                isSort={metric == sort}
                isShowingRank={isShowingRank}
                onChangeSort={this.onChangeSort(metric)}
                onCountryHover={this.onCountryHover}
              />
            ))}
          </div> */}
        </div>
      </div>
    )
  }
}

export default WDVPGrid


const WDVPGridMetric = React.memo(({ metric, data, scales, isSort, isShowingRank, onChangeSort, onCountryHover }) => {
  const onCountryHoverLocal = country => () => onCountryHover(country)

  return (
    <div className={`WDVPGridMetric WDVPGridMetric--is-${isSort ? "sort" : "not-sort"}`} title={metric}>
      <div className="WDVPGridMetric__label" onClick={onChangeSort}>
        { metric }
      </div>

      <div className="WDVPGridMetric__countries">
        {_.map(data, country => (
          <WDVPGridMetricCountry
            key={country.Country}
            name={country.Country}
            metric={metric}
            scale={scales[metric]}
            rank={country[`${metric}__rank`]}
            value={country[metric]}
            numberOfCountries={data.length}
            isShowingRank={isShowingRank}
            onMouseEnter={onCountryHoverLocal(country)}
            onMouseLeave={onCountryHoverLocal(null)}
          />
        ))}
      </div>
    </div>
  )
})


const WDVPGridMetricCountry = React.memo(({ rank, name, metric, value, scale, numberOfCountries, isShowingRank, ...props }) => (
  <div {...props} className="WDVPGridMetricCountry" style={{
    background: blackAndWhiteColorScale(isShowingRank ? 1 - (rank / numberOfCountries) : scale(value))
  }}>
    <Tooltip>
      <h6>{ name }</h6>
      <div>
        { metric }: { numeral(value).format("0,0.0") }
      </div>
    </Tooltip>
  </div>
))


const WDVPGridCountry = ({ index, country, scales, sort, isShowingRank }) => (
  <div className="WDVPGridCountry" style={{
    transform: `translateX(${index * cellWidth}px)`,
    width: `${cellWidth}px`,
  }}>
    <div className="WDVPGridCountry__label">
      <div className="WDVPGridCountry__label__text">
        <div className="WDVPGridCountry__label__index" style={{
          color: continentColorScales[country.Continent]
        }}>
          { country[`${sort}__rank`] }.
        </div>
        <div className="WDVPGridCountry__label__name">
          { country.Country }
        </div>
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


const cellWidth = (window.innerWidth - 160 - 60) / data.length
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
          { metric }: { numeral(value).format("0,0.0") }
        </div>
      </Tooltip>
    </div>
  )
})