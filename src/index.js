import "react-app-polyfill/stable";
import "react-app-polyfill/ie11";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "components/App";
import * as serviceWorker from "./serviceWorker";
import { render } from "react-snapshot";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);
render(<AppWrapper />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// if (module.hot) {
//     module.hot.accept();
// }
