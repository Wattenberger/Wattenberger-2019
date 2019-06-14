import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import numeral from "numeral"
import moment from "moment"
import {find, includes} from "lodash"
import Select from "react-select"
import "react-select/dist/react-select.css"
import Flex from "components/_ui/Flex/Flex"
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
import RochesterRealEstateTimeSeries from "./RochesterRealEstateTimeSeries/RochesterRealEstateTimeSeries"
import {data} from "./data"

require('./RochesterRealEstate.scss')
const dataFields = [
  {fieldName: "Address", type: "categorical"},
  {fieldName: "School District Name", type: "categorical"},
  {fieldName: "St", type: "categorical"},
  {fieldName: "Styles Of Residence", type: "categorical"},
  {fieldName: "Town/City", type: "categorical"},
  {fieldName: "Type", type: "categorical"},

  {fieldName: "Baths", type: "ordinal", generate: d => {
    let numBaths = d["Baths Total"]
    return numBaths % 1 ? numBaths + 0.4 : numBaths
  }},
  {fieldName: "Beds Total", type: "ordinal"},
  {fieldName: "DOM", type: "ordinal"},
  {fieldName: "Numof Acres", type: "ordinal", format: ".2r"},
  {fieldName: "Numof Garage Spaces", type: "ordinal"},
  {fieldName: "Sq Ft Total", type: "ordinal"},
  {fieldName: "Total Rooms", type: "ordinal"},
  {fieldName: "Year Built", type: "interval", format: ""},
  {fieldName: "Original List Price", type: "ordinal", format: ",.0f"},
  {fieldName: "List Price", type: "ordinal", format: ",.0f"},
  {fieldName: "SP Sq Ft", type: "ordinal", format: ",.0f"},
  {fieldName: "Sale Price", type: "ordinal", format: ",.0f"},
  {fieldName: "SPLP", type: "ordinal", format: ".1"},

  {fieldName: "Contract Date", type: "date"},

  {fieldName: "Sale Diff", type: "interval", generate: d => +(("" + d["Sale Price"]).replace(/[$,]/g,"")) - +(("" + d["Original List Price"]).replace(/[$,]/g,"")), format: ",.2s"},
  {fieldName: "Sale Diff %", type: "interval", generate: d => +(("" + d["Sale Price"]).replace(/[$,]/g,"")) / +(("" + d["Original List Price"]).replace(/[$,]/g,"")) * 100, format: ".0f"},
]

class RochesterRealEstate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: {
        x: "DOM",
        y: "Sale Diff %",
      }
    }
  }

  getClassName() {
    return classNames("RochesterRealEstate", this.props.className)
  }

  getAxisOptions = axis => {
    let {fields} = this.state
    const otherAxis = axis == "x" ? "y" : "x"
    return dataFields.filter(field => includes(["ordinal", "interval"], field.type))
                     .map((field, idx) => ({
                        value: field.fieldName,
                        label: field.fieldName,
                      }))
  }

  getField = fieldName => find(dataFields, {fieldName})

  onAxisSelect = (axis, field) => {
    let {fields} = this.state
    fields[axis] = field.value
    this.setState({fields})
  }

  render() {
  	let {fields} = this.state

    return (
      <div className={this.getClassName()}>
      	<h1>Rochester Real Estate</h1>

        <Flex>
          {["y", "x"].map(axis =>
            <div className="RochesterRealEstate__field-options" key={axis}>
              <Select
                className="RochesterRealEstate__select"
                value={fields[axis]}
                options={this.getAxisOptions(axis)}
                onChange={this.onAxisSelect.bind(this, axis)}
                autoBlur={true}
                clearable={false}
              />
            </div>
          )}
        </Flex>

        <RochesterRealEstateTimeSeries
          data={data}
          xField={this.getField(fields.x)}
          yField={this.getField(fields.y)}
        />
      </div>
    )
  }
}

export default RochesterRealEstate
