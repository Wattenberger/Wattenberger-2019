import React, {Component} from "react"
import classNames from "classnames"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Button from 'components/_ui/Button/Button'
import {list} from "./list"

require('./Sketches.scss')

class Sketches extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: list.length - 1
    }
  }

  keypresses = {
    [KEYS.RIGHT]: this.changeSketch.bind(this, 1, null, true),
    [KEYS.LEFT]: this.changeSketch.bind(this, -1, null, true),
  };

  getClassName() {
    return classNames("Sketches")
  }

  componentWillMount() {
    const day = +this.getUrlParams()["day"]
    if (day) this.changeSketch(null, day - 1)
  }

  getUrlParams() {
    let params = window.location.search
    if (params.length < 2) return {}
    let pairs = {}
    params
      .substr(1)
      .split("&")
      .forEach(param => {
        let pair = param.split("=")
        pairs[pair[0]] = pair[1]
      })
    return pairs
  }

  setUrlParam(newParam) {
    const base = window.location.pathname
    let params = this.getUrlParams()
    _.extend(params, newParam)
    let ext = "?" + _.map(params, (val, key) => `${key}=${val}`).join("&")
    window.history.pushState({}, "", base + ext);
  }

  changeSketch(change, day, isKey) {
    let {active} = this.state
    if (list[active].preventKeyBindings && isKey) return

    let newIdx = _.isNumber(day) ? day : active + change % list.length
    if (newIdx < 0) newIdx = list.length + newIdx
    if (newIdx >= list.length) newIdx = list.length - newIdx
    if (_.inRange(newIdx, 0, list.length)) {
      this.setState({active: newIdx})
      this.setUrlParam({day: newIdx + 1})
    }
  }

  renderItem() {
    let {active} = this.state
    let Sketch = list[active].elem

    return <div className="Sketches__sketch">
      <Sketch />
    </div>
  }

  renderNotes() {
    let {active} = this.state
    const {notes} = list[active]

    return <div className="Sketches__notes">
      <h6>Learnings</h6>
      {notes.map((note, idx) =>
        <div className="Sketches__notes__note" key={idx}>
          <a href={note.url} target="_blank" rel="noopener noreferrer">{note.title}</a>
          {note.text && <div className="Sketches__notes__note__text" dangerouslySetInnerHTML={{__html: note.text}} />}
          {note.points &&
            <ul className="Sketches__notes__note__points">
              {note.points.map((point, idx) =>
                <li className="Sketches__notes__note__point" key={idx}>{point}</li>
              )}
            </ul>
          }
        </div>
      )}
    </div>

  }

  render() {
    let {active} = this.state

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        <div className="Sketches__header">
          <h2>Daily Sketches</h2>
          <div className="Sketches__header__buttons">
            <Button onClick={this.changeSketch.bind(this, -1, null, false)}>↢</Button>
            <h6>Sketch {active + 1}</h6>
            <Button onClick={this.changeSketch.bind(this, 1, null, false)}>↣</Button>
          </div>
        </div>
        {this.renderItem()}
        {list[active].notes && this.renderNotes()}
      </div>
    )
  }
}

export default Sketches
