import React, { useState } from "react"
import Hidden from "components/_ui/Hidden"
import Button from "components/_ui/Button/Button"
import Icon from "components/_ui/Icon/Icon"

import "./NewsletterSignup.scss"

const NewsletterSignup = ({ className }) => {
    const [email, setEmail] = useState("")

    return (
        <form className={`NewsletterSignup ${className}`}
            action="https://gmail.us3.list-manage.com/subscribe/post?u=b1a88f725f5c5f17c410eb825&amp;id=8de9751f22"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            target="_blank"
            noValidate>
            <input
                className="NewsletterSignup__input"
                type="email"
                value={email}
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="Your email"
                onChange={e => setEmail(e.target.value)}
                required
            />

            {/* For spam */}
            <Hidden>
                <div aria-hidden="true">
                    <input type="text" name="b_b1a88f725f5c5f17c410eb825_8de9751f22" tabIndex="-1" />
                </div>
            </Hidden>

            <Button className="NewsletterSignup__submit" type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe">
                Keep me up to date
                <Icon name="mail" />
            </Button>
        </form>
    )
}

export default NewsletterSignup