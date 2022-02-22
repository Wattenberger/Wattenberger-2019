import React, { Component } from "react"
import Link from "components/_ui/Link/Link";
import Icon from "components/_ui/Icon/Icon";
import {withRouter} from 'react-router-dom';
import image from "./book.png"

import "./Footer.scss"
import NewsletterSignup from "components/_shared/NewsletterSignup/NewsletterSignup";

class Footer extends Component {

    render() {
        const { pathname } = this.props.location;

        return (
            <footer className="Footer">
                <Link href="http://fullstack.io/fullstack-d3">
                    <img src={image} alt="Fullstack D3 & Data Visualization" className="Footer__image" />
                </Link>
                <div className="Footer__text">
                    <div className="Footer__name">
                        Amelia Wattenberger © 2022
                    </div>
                    <div className="Footer__siblings">
                        <div className="Footer__links">
                            {pathname != "/" && (
                                <Link className="Footer__link" to="/">
                                    <img src="https://twemoji.maxcdn.com/2/svg/1f44b.svg" className="Footer__link__emoji" alt="wave" />
                                    Go home
                                </Link>
                            )}
                            <Link className="Footer__link" href="http://twitter.com/wattenberger">
                                <img src="https://twemoji.maxcdn.com/2/svg/1f426.svg" className="Footer__link__emoji" alt="bird" />
                                Ask me anything on Twitter
                            </Link>
                            <Link className="Footer__link" href="http://fullstack.io/fullstack-d3">
                                <img src="https://twemoji.maxcdn.com/2/svg/1f4d6.svg" className="Footer__link__emoji" alt="book" />
                                Learn how to make amazing data visualizations
                            </Link>
                            <Link className="Footer__link" to="/rss">
                                <Icon name="rss" className="Footer__link__icon" alt="book" />
                                RSS
                            </Link>

                        </div>

                        {!["/thanks-for-signing-up", "/keep-in-touch"].includes(pathname) && (
                            <NewsletterSignup className="Footer__signup" />
                        )}
                    </div>
                </div>

            </footer>
        )
    }
}

export default withRouter(Footer)
