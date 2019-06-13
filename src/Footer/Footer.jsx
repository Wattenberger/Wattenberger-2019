import React, { useState } from "react"
import Link from "../_ui/Link/Link";
import meImg from "./../me.png"
import { Twemoji } from 'react-emoji-render';

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
                        <Twemoji className="Footer__link__emoji" svg text=":wave:" />
                        More about me on my site
                    </Link>
                    <Link className="Footer__link" href="http://twitter.com/wattenberger">
                        <Twemoji className="Footer__link__emoji" svg text=":bird:" />
                        Ask me anything on Twitter
                    </Link>
                    <Link className="Footer__link" href="http://fullstack.io/fullstack-d3">
                        <Twemoji className="Footer__link__emoji" svg text=":book:" />
                        Learn more with the book
                    </Link>
                </div>
            </div>

        </footer>
    )
}

export default Footer