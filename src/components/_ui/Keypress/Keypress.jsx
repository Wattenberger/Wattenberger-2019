import React, {Component} from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

class Keypress extends Component {
  static propTypes = {
    keys: PropTypes.object.isRequired,
    elem: PropTypes.object
  };

  static defaultProps = {
      elem: document
  }

  componentWillMount() {
    let {elem} = this.props
    elem.addEventListener("keydown", this.onKeydown)
  }

  onKeydown = (e) => {
    let {keys, elem} = this.props
    if (e.target.tagName === "INPUT" && elem != e.target) return

    let pressedKey = e.keyCode
    let onKeypress = keys[pressedKey]

    if (onKeypress) onKeypress(e)
  }

  componentWillUnmount() {
    let {elem} = this.props
    elem.removeEventListener("keydown", this.onKeydown)
  }

  render() {
    return null
  }
}

export default Keypress

export const KEYS = {
  STRG: 17,
  CTRL: 17,
  CTRLRIGHT: 18,
  CTRLR: 18,
  SHIFT: 16,
  RETURN: 13,
  ENTER: 13,
  BACKSPACE: 8,
  BCKSP:8,
  ALT: 18,
  ALTR: 17,
  ALTRIGHT: 17,
  SPACE: 32,
  WIN: 91,
  MAC: 91,
  FN: null,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ESC: 27,
  DEL: 46,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  'backspace' : '8',
  'tab' : '9',
  'enter' : '13',
  'shift' : '16',
  'ctrl' : '17',
  'alt' : '18',
  'pause_break' : '19',
  'caps_lock' : '20',
  'escape' : '27',
  'page_up' : '33',
  'page down' : '34',
  'end' : '35',
  'home' : '36',
  'left_arrow' : '37',
  'up_arrow' : '38',
  'right_arrow' : '39',
  'down_arrow' : '40',
  'insert' : '45',
  'delete' : '46',
  '0' : '48',
  '1' : '49',
  '2' : '50',
  '3' : '51',
  '4' : '52',
  '5' : '53',
  '6' : '54',
  '7' : '55',
  '8' : '56',
  '9' : '57',
  'a' : '65',
  'b' : '66',
  'c' : '67',
  'd' : '68',
  'e' : '69',
  'f' : '70',
  'g' : '71',
  'h' : '72',
  'i' : '73',
  'j' : '74',
  'k' : '75',
  'l' : '76',
  'm' : '77',
  'n' : '78',
  'o' : '79',
  'p' : '80',
  'q' : '81',
  'r' : '82',
  's' : '83',
  't' : '84',
  'u' : '85',
  'v' : '86',
  'w' : '87',
  'x' : '88',
  'y' : '89',
  'z' : '90',
  'left_window key' : '91',
  'right_window key' : '92',
  'select_key' : '93',
  'numpad 0' : '96',
  'numpad 1' : '97',
  'numpad 2' : '98',
  'numpad 3' : '99',
  'numpad 4' : '100',
  'numpad 5' : '101',
  'numpad 6' : '102',
  'numpad 7' : '103',
  'numpad 8' : '104',
  'numpad 9' : '105',
  'multiply' : '106',
  'add' : '107',
  'subtract' : '109',
  'decimal point' : '110',
  'divide' : '111',
  'f1' : '112',
  'f2' : '113',
  'f3' : '114',
  'f4' : '115',
  'f5' : '116',
  'f6' : '117',
  'f7' : '118',
  'f8' : '119',
  'f9' : '120',
  'f10' : '121',
  'f11' : '122',
  'f12' : '123',
  'num_lock' : '144',
  'scroll_lock' : '145',
  'semi_colon' : '186',
  'equal_sign' : '187',
  'comma' : '188',
  'dash' : '189',
  'period' : '190',
  'forward_slash' : '191',
  'grave_accent' : '192',
  'open_bracket' : '219',
  'backslash' : '220',
  'closebracket' : '221',
  'single_quote' : '222'
}
