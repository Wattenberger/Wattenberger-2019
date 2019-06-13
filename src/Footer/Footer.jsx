import React, { useState } from "react"
import Link from "../_ui/Link/Link";
import meImg from "./../me.png"

import "./Footer.scss"

const Footer = () => {
    return (
        <footer className="Footer">
            <img src={meImg} alt="Amelia" className="Footer__image" />
            <div className="Footer__text">
                <div className="Footer__name">
                    Amelia Wattenberger © 2019
                </div>
                <div className="Footer__links">
                    <Link className="Footer__link" href="https://wattenberger.com">
                        <img src="https://twemoji.maxcdn.com/2/svg/1f44b.svg" className="Footer__link__emoji" alt="wave" />
                        More about me on my site
                    </Link>
                    <Link className="Footer__link" href="http://twitter.com/wattenberger">
                        <img src="https://twemoji.maxcdn.com/2/svg/1f426.svg" className="Footer__link__emoji" alt="bird" />
                        Ask me anything on Twitter
                    </Link>
                    <Link className="Footer__link" href="http://fullstack.io/fullstack-d3">
                        <img src="https://twemoji.maxcdn.com/2/svg/1f4d6.svg" className="Footer__link__emoji" alt="book" />
                        Learn more with the book
                    </Link>
                </div>
            </div>

        </footer>
    )
}

export default Footer