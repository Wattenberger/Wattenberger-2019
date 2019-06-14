import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import numeral from "numeral"
import * as d3 from "d3"

import "./InterpolatedNumber.scss"

class InterpolatedNumber extends PureComponent {
    state = {
        currentNumber: 0,
    }

    static propTypes = {
        number: PropTypes.number,
        numberOfSteps: PropTypes.number,
        updateSeconds: PropTypes.number,
        format: PropTypes.func,
        doInterpolateOnInit: PropTypes.bool,
    }

    static defaultProps = {
        numberOfSteps: 9,
        updateSeconds: 0.6,
        format: d => numeral(d).format("0,0"),
        doInterpolateOnInit: false,
    }

    componentDidMount() {
        this._isMounted = true
        const { doInterpolateOnInit } = this.props
        this.onNumberChange(doInterpolateOnInit)
    }

    componentWillUnmount() {
        this._isMounted = false
        if (this.timeout) clearTimeout(this.timeout)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.number != this.props.number) this.onNumberChange()
    }

    onNumberChange = (doInterpolate=true) => {
        if (!this._isMounted) return
        const { number, numberOfSteps, updateSeconds } = this.props
        const { currentNumber } = this.state
        if (_.isNaN(number) || !_.isNumber(number)) {
            this.setState({ currentNumber: null })
            return
        }
        if (!doInterpolate) {
            this.setState({ currentNumber: number })
            return
        }

        this.interpolator = d3.interpolateNumber(currentNumber, number)
        this.stepIndex = 0
        this.secondsPerIncrement = updateSeconds / numberOfSteps

        if (this.timeout) clearTimeout(this.timeout)
        this.updateNumber()
    }

    updateNumber = () => {
        if (!this._isMounted) return
        const { numberOfSteps } = this.props
        if (this.timeout) clearTimeout(this.timeout)

        this.stepIndex++
        const currentNumber = this.interpolator((1 / numberOfSteps) * this.stepIndex)

        this.setState({ currentNumber }, () => {
            if (this.stepIndex >= numberOfSteps) return
            this.timeout = setTimeout(this.updateNumber, this.secondsPerIncrement * 1000)
        })
    }

    render() {
        const { number, format, numberOfSteps, updateSeconds, className } = this.props
        const { currentNumber } = this.state

        if (!_.isFinite(number)) return <span className="InterpolatedNumber__empty">—</span>

        return format(currentNumber)
    }
}

export default InterpolatedNumber
