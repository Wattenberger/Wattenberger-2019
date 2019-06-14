import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Interactions from './Interactions/Interactions'
import Footer from './Footer/Footer'
import './App.scss'
const Home = React.lazy(() => import("./Home/Home"))


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>

        <Route exact path="/interactions" component={Interactions} />

        <Footer />
      </div>
    </Router>
  )
}

export default App
