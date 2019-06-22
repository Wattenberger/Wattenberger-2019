import React, { Component } from "react"

const Hidden = ({ children }) => (
    <div className="Hidden" style={styles}>
        { children }
    </div>
)

export default Hidden

const styles = {
    position: "absolute",
    left: "-200vw",
}
