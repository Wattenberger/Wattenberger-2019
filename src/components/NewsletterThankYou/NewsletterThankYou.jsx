import React, { Component } from "react"
import Link from "components/_ui/Link/Link"
import WDVPMap from "components/Articles/WDVP/WDVPMap"

import "./NewsletterThankYou.scss"

const NewsletterThankYou = () => {
    return (
        <div className="NewsletterThankYou">
            <h1>
                Thanks for signing up!
            </h1>

            <div className="NewsletterThankYou__content">
                <p>
                    I'll be sending you updates on any blogs posts I'm working on, data visualization experiments, and frontend development & design tutorials.
                </p>

                <Link to="/">Go back to home</Link>

                <p>
                    Or play with this interactive map of country similarity from <Link to="/wdvp">this article</Link>.
                </p>

            </div>

            <WDVPMap />
        </div>
    )
}

export default NewsletterThankYou;