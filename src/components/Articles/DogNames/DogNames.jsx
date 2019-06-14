import React, {Component} from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import classNames from "classnames"
import _ from "lodash"
import dataCsvFile from "./data.csv"
import intelligenceCsvFile from "./dog_intelligence.csv"
import Boroughs from "./Boroughs"

// const parsedData = _.map(data, (info, name) => _.extend({}, info, {
//   name,
//   date: new Date(_.get(info, "Date")),
//   job: _.get(info,"Job").split(", "),
// }))
// const jobs = _.sortBy(_.filter(_.toPairs(_.countBy(_.map(_.flatMap(parsedData, "job"), job => job.replace(" / ", "/")))), "0"), d => -_.get(d, 1))
// const total = parsedData.length;
// const genders = _.sortBy(_.filter(_.toPairs(_.countBy(parsedData, "Gender")), "0"), d => -_.get(d, 1))

require('./DogNames.scss')

const formatNumber = d => _.isFinite(d) ? d3.format(",")(d) : "-"
const formatIntelligence = d => _.isFinite(d) ? d3.format(".2f")(d) : "-"
const excludedItemsByAspect = {
  breed: ["Mixed/Other"],
  // breed: [],
  dog_name: ["n/a"],
}
const filterableAspects = ["breed", "dog_name"]
class DogNames extends Component {
  state = {
    data: null,
    breeds: [],
    names: [],
    selectedItem: null,
    boroughData: null,
    intelligence: {},
    totals: {
      name: {},
      breed: {},
    },
    boroughTotals: null,
  }

  componentDidMount() {
    this.parseData();
    this.parseIntelligenceData();
    document.title = "NYC Dogs - Wattenberger"
  }
  allBreeds = []

  parseBreeds = () => {
    this.allBreeds = [...Object.keys(mappedDogBreeds), ...Object.keys(this.state.intelligence || {})]
  }

  getClassName() {
    return classNames("DogNames", this.props.className)
  }
  getUrlArgs = () => {
    const args = window.location.search.slice(1).split("&")
    return _.fromPairs(args.map(str => str.split("=").map(window.decodeURIComponent)))
  }
  parseUrlArgs = () => {
    const urlArgs = this.getUrlArgs()
    const appropriateArg = _.intersection([...filterableAspects, "borough"], Object.keys(urlArgs))[0]
    const aspect = appropriateArg || null
    const item = appropriateArg ? urlArgs[appropriateArg] : null
    this.setSelectedItem(aspect, false)(item)
  }

  getIntelligenceForBreed = breed => _.get(this.state.intelligence, mappedDogBreeds[breed] || breed)
  getIntelligenceForBreeds = breeds => {
    if (!this.state.intelligence) return
    const numberOfDogs = _.sum(Object.values(_.pick(breeds, this.allBreeds)))
    const sumOfAverages = _.map(breeds, (count, breed) => (this.getIntelligenceForBreed(breed) || 0) * count)
    return _.sum(sumOfAverages) / numberOfDogs
  }

  getOrderedListByAspect = (list, aspect) => {
    const count = _.countBy(list, aspect)
    const filteredCount = _.omit(count, excludedItemsByAspect[aspect] || [])
    const orderedCounts = _.orderBy(_.toPairs(filteredCount), "1", "desc")
    const listOfObjects = _.map(orderedCounts, (count, index) => ({
      index: index + 1,
      key: count[0],
      count: count[1],
    }))
    return listOfObjects
  }

  parseData = () => {
    const parsedData = d3.csv(dataCsvFile).then(data => {
      const boroughTotals = _.countBy(data, "borough");
      this.setState({ data, boroughTotals }, this.parseUrlArgs)
    })
  }

  parseIntelligenceData = () => {
    const parsedData = d3.csv(intelligenceCsvFile).then(data => {
      const intelligence = _.fromPairs(
        _.map(data, d => [
          d.breed,
          +d.obey,
        ])
      )
      this.setState({ intelligence }, this.parseBreeds)
    })
  }

  setSelectedItem = (aspect, doUpdateUrl=true) => item => {
    const { data, boroughTotals, selectedItem } = this.state
    if (item == selectedItem) item = null
    const dogsOfType = item ? _.filter(data, { [aspect]: item }) : data
    const boroughCounts = _.countBy(dogsOfType, "borough")
    const boroughData = _.fromPairs(_.map(
      boroughTotals, (total, borough) => [
        borough,
        {
          count: boroughCounts[borough] || 0,
          percent: (boroughCounts[borough] || 0) * 100 / (total || 1),
          intelligence: this.getIntelligenceForBreeds(_.countBy(_.filter(dogsOfType, { borough }), "breed")),
        }
      ]
    ))
    const totals = _.fromPairs(_.map(filterableAspects, aspectToTotal => [
      aspectToTotal,
      this.getOrderedListByAspect(aspect == aspectToTotal ? data : dogsOfType, aspectToTotal)
    ]))
    const boroughPercents = _.fromPairs(_.map(boroughTotals, (total, borough) => [
      borough,
      (boroughData[borough] || 0) * 100 / (total || 1),
    ]))
    if (doUpdateUrl) {
      window.history.replaceState( {} , '', item ? `?${aspect}=${item}` : window.location.pathname );
    }
    this.setState({ selectedItem: item, selectedAspect: item ? aspect : null, totals, boroughData, boroughPercents })
  }

  onBoroughHover = borough => {
    // const { data } = this.state
    // const filteredData = borough ? _.filter(data, { borough }) : data
    // const names = this.getOrderedListByAspect(filteredData, "dog_name", filteredNames)
    // const breeds = this.getOrderedListByAspect(filteredData, "breed", filteredBreeds)
    this.setSelectedItem(borough ? "borough" : null)(borough)
    this.setState({ selectedBorough: borough })
  }

  onMouseOutOfSelectedList = () => this.setSelectedItem(null)(null)

  render() {
    const { data, totals, boroughTotals, selectedAspect, selectedItem, boroughData, boroughPercents, intelligence } = this.state

    return (
      <div className={this.getClassName()}>
        <div className="DogNames__title-container">
          <h2 className="DogNames__title">
            Dogs of New  York City
            <span className="DogNames__title-addition">
              {
                selectedAspect == "breed"    ? `of the breed ${selectedItem}`                               :
                selectedAspect == "dog_name" ? `named ${selectedItem}`                                      :
                selectedAspect == "borough"  ? `in ${selectedItem == "Bronx" ? "the Bronx" : selectedItem}` :
                ""}
            </span>
          </h2>
          {selectedItem && (
            <div className="DogNames__clear" onClick={this.onMouseOutOfSelectedList}>x</div>
          )}
        </div>
        <div className="DogNames__contents">
          <Boroughs
            className="DogNames__map"
            data={boroughData}
            aspect={selectedAspect}
            isShowingAllDogs={!selectedAspect}
            onHover={this.onBoroughHover}
          />
          <DogNamesSelectableList
            items={totals.breed}
            extraColumn={intelligence}
            selectedItem={selectedAspect == "breed" ? selectedItem : null}
            aspect="breed"
            label="breed"
            allDogs={selectedItem && selectedAspect != "breed" ? _.filter(data, {[selectedAspect]: selectedItem}) : data}
            intelligence={intelligence}
            onSelect={this.setSelectedItem("breed")}
          />
          <DogNamesSelectableList
            items={totals.dog_name}
            selectedItem={selectedAspect == "dog_name" ? selectedItem : null}
            aspect="dog_name"
            label="name"
            allDogs={selectedItem && selectedAspect != "dog_name" ? _.filter(data, {[selectedAspect]: selectedItem}) : data}
            intelligence={intelligence}
            onSelect={this.setSelectedItem("dog_name")}
          />
        </div>

        <div className="DogNames__footer">
          <p>
            Using 2016 dog licensing data from <a href="https://data.cityofnewyork.us/Health/NYC-Dog-Licensing-Dataset/nu7n-tubp">NYC Open data</a> and dog intelligence data from <a href="https://en.m.wikipedia.org/wiki/The_Intelligence_of_Dogs">Stanley Coren</a>, parsed and uploaded to <a href="https://data.world/len/intelligence-of-dogs">Data World</a>
          </p>
        </div>
      </div>
    )
  }
}

export default DogNames

const mappedDogBreeds = {
  "American Pit Bull Terrier/Pit Bull"  : "American Staffordshire Terrier",
  "Labrador Retriever Crossbreed"       : "Labrador Retriever",
  "Poodle, Standard"                    : "Poodle",
  "German Shepherd Crossbreed"          : "German Shepherd",
  "German Shepherd Dog"                 : "German Shepherd",
  "Schnauzer, Miniature"                : "Miniature Schnauzer",
  "Bull Dog, French"                    : "French Bulldog",
  "Poodle, Toy"                         : "Poodle",
  "American Pit Bull Mix / Pit Bull Mix": "American Staffordshire Terrier",
  "Poodle, Miniature"                   : "Poodle",
  "Bull Dog, English"                   : "Bulldog",
  "Dachshund Smooth Coat"               : "Dachshund",
  "Puggle"                              : "Pug",
  "West High White Terrier"             : "West Highland White Terrier",
  "Beagle Crossbreed"                   : "Beagle",
  "Labradoodle"                         : "Labrador Retriever",
  "Wheaton Terrier"                     : "Soft-coated Wheaten Terrier",
  "Silky Terrier"                       : "Australian Silky Terrier",
  "Dachshund Smooth Coat Miniature"     : "Dachshund",
  "Collie, Border"                      : "Border Collie",
  "American Eskimo dog"                 : null,
  "Brussels Griffon"                    : "Griffon Bruxellois",
  "Bassett Hound"                       : "Basset Hound",
  "Schnauzer, Standard"                 : "Standard Schnauzer",
  "Collie Crossbreed"                   : "Collie",
  "Welsh Corgi, Pembroke"               : "Pembroke Welsh Corgi",
  "Cane Corso"                          : null,
  "Cotton De Tulear"                    : null,
  "Dachshund, Long Haired Miniature"    : "Dachshund",
  "Shar-Pei, Chinese"                   : "Chinese Shar Pei",
  "Dachshund, Long Haired"              : "Dachshund",
  "Australian Cattledog"                : "Australian Cattle Dog",
  "Mastiff, Bull"                       : "Bullmastiff",
  "Japanese Chin/Spaniel"               : "Japanese Chin",
  "Pointer, German Shorthaired"         : "German Shorthaired Pointer",
  "Brittany Spaniel"                    : "Brittany",
  "Schipperkee"                         : "Schipperke",
  "Akita Crossbreed"                    : "Akita",
  "Jindo Dog, Korea"                    : null,
  "Welsh Corgi, Cardigan"               : "Cardigan Welsh Corgi",
  "Dachshund, Wirehaired"               : "Dachshund",
  "Coonhound, Black and Tan"            : "Black and Tan Coonhound",
  "Dachshund, Wirehaired, Miniature"    : "Dachshund",
  "Collie, Bearded"                     : "Bearded Collie",
  "Mastiff, Old English"                : "Mastiff",
  "Collie, Rough Coat"                  : "Collie",
  "Mastiff, French (Dogue de Bordeaux)" : "Mastiff",                     //
  "Schnauzer, Giant"                    : "Giant Schnauzer",
  "Collie, Smooth Coat"                 : "Collie",
  "Coonhound, Treeing Walker"           : "Black and Tan Coonhound",
  "Mastiff, Neapolitan"                 : "Mastiff",                     //
  "Coonhound, Blue Tick"                : "Black and Tan Coonhound",
  "Belgian Griffon"                     : "Wirehaired Pointing Griffon", //
  "Pointer, German Wirehaired"          : "German Wirehaired Pointer",
  "Pharoh hound"                        : "Pharaoh Hound",
  "Australian Kelpie"                   : null,
  "Mastiff, Tibetan"                    : "Mastiff",                     //
  "Fila Brasileiro"                     : null,
  "Russian Wolfhound"                   : "Irish Wolfhound",
}
class DogNamesSelectableList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: "",
      uppercaseOnly: false,
    }
  }

  componentDidMount() {
    this.parseItems()
  }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.items != this.props.items) this.parseItems()
    if (prevProps.intelligence != this.props.intelligence) this.parseBreeds()
  }
  allBreeds = []

  parseBreeds = () => {
    this.allBreeds = [...Object.keys(mappedDogBreeds), ...Object.keys(this.props.intelligence)]
  }

  parseItems = () => {
    const { items, aspect, allDogs } = this.props
    const { searchValue, uppercaseOnly } = this.state

    let parsedItems = items
    if (!_.isEmpty(searchValue)) parsedItems = _.filter(parsedItems, d => d.key.toLowerCase().includes(searchValue))
    if (uppercaseOnly) parsedItems = _.filter(parsedItems, d => d.key == _.upperCase(d.key))
    parsedItems = _.take(parsedItems, 100)
    parsedItems = _.map(parsedItems, (item, index) => ({
      ...item,
      intelligence: aspect == "breed" ?
        this.getIntelligenceForBreed(item.key) :
        index < 40 ? this.getIntelligenceForBreeds(_.countBy(_.filter(allDogs, {[aspect]: item.key}), "breed")) : null,
    }))

    this.setState({ parsedItems })
  }

  getIntelligenceForBreed = breed => _.get(this.props.intelligence, mappedDogBreeds[breed] || breed)
  getIntelligenceForBreeds = breeds => {
    if (!this.props.intelligence) return
    const numberOfDogs = _.sum(Object.values(_.pick(breeds, this.allBreeds)))
    const sumOfAverages = _.map(breeds, (count, breed) => (this.getIntelligenceForBreed(breed) || 0) * count)
    return _.sum(sumOfAverages) / numberOfDogs
  }

  onSelectLocal = item => () => this.props.onSelect(item)

  onInputChange = e => {
    const searchValue = e.target.value
    this.setState({ searchValue }, this.parseItems)
  }

  onChangeSelectedItem = delta => {
    const { parsedItems, selectedItem } = this.props
    const currentItemIndex = _.findIndex(parsedItems, d => d.key == selectedItem)
    if (currentItemIndex == -1) return
    const nextItemIndex = _.max([0, currentItemIndex + delta % parsedItems.length])
    this.props.onSelect(parsedItems[nextItemIndex])
  }

  onToggleUppercaseOnly = () => {
    this.setState({uppercaseOnly: !this.state.uppercaseOnly}, this.parseItems)
  }

  render() {
    const { items, aspect, selectedItem, label, extraColumn, allDogs, onSelect, ...props } = this.props
    const { searchValue, parsedItems, uppercaseOnly, error } = this.state
    if (error) return null

    return (
      <div className="DogNamesSelectableList" {...props}>
        <input className="DogNamesSelectableList__input" value={searchValue} placeholder={`Search for a ${label}`} onChange={this.onInputChange} />
        {aspect == "dog_name" && (
          <div className={`DogNamesSelectableList__toggle DogNamesSelectableList__toggle--is-${uppercaseOnly ? "selected" : "not-selected"}`} onClick={this.onToggleUppercaseOnly}>
            Uppercase only
          </div>
        )}
        <div className="DogNamesSelectableList__column-headers">
          <div className="DogNamesSelectableList__column-header">
            Count
          </div>
          <div className="DogNamesSelectableList__column-header">
            Intelligence
          </div>
        </div>
        <div className="DogNamesSelectableList__items">
          {_.map(parsedItems, (item, i) => (
            <div
              className={[
                "DogNamesSelectableList__item",
                `DogNamesSelectableList__item--is-${
                  item.key == selectedItem ? "selected"         :
                  selectedItem             ? "next-to-selected" :
                                             "not-selected"
                }`
              ].join(" ")}
              key={i}
              onMouseDown={this.onSelectLocal(item.key)}>
              <div className="DogNamesSelectableList__item__index">
                { item.index }
              </div>
              <div className="DogNamesSelectableList__item__label">
                { item.key }
              </div>
              <div className="DogNamesSelectableList__item__value">
                { formatNumber(item.count) }
              </div>
              <div className="DogNamesSelectableList__item__annotation">
                {_.times(_.round((item.intelligence || 0) * 10), d => "|")}
              </div>
              <div className="DogNamesSelectableList__item__bar" style={{
                width: `${item.count * 100 / parsedItems[0].count}%`,
              }} />
            </div>
          ))}
          {(items || []).length > (parsedItems || []).length && (
            <div className="DogNamesSelectableList__note">
              Change search for more results
            </div>
          )}
        </div>
      </div>
    )
  }
}
