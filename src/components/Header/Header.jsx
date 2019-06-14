import React, {Component} from "react"
import Logo from "components/_ui/Logo";
import Link from "components/_ui/Link";

require('./Header.scss')

const Header = () => (
  <div className="Header">
    <Link to="/" className="Header__link">
      <Logo size="small" />
      <div className="Header__link__title">
        Wattenberger
      </div>
    </Link>
     {/* <Link className="Header__link Header__link--blog" to="/blog">
      Thoughts
    </Link>
     <Link className="Header__link Header__link--about" to="/about">
      Who?
    </Link> */}
  </div>
)

export default Header
