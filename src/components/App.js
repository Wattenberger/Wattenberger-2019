import React, {Component, Suspense, lazy} from "react"
import classNames from "classnames"
import { Helmet } from "react-helmet"
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import Interactions from 'components/Blog/posts/Interactions/Interactions'
import Footer from './Footer/Footer'
import Loader from 'components/_ui/Loader'
import Blog from "components/Blog/Blog"
import Link from "components/_ui/Link/Link"
import Header from "components/Header/Header"

import './App.scss'
import { scrollTo } from "utils";

const Home = React.lazy(() => import("components/Home/Home"));
const Sketches = React.lazy(() => import("components/Sketches/Sketches"));
const News = React.lazy(() => import("components/News/News"));

const DogNames = React.lazy(() => import("components/Articles/DogNames/DogNames"));
const DogBreeds = React.lazy(() => import("components/Articles/DogBreeds/DogBreeds"));
const WDVP = React.lazy(() => import("components/Articles/WDVP/WDVP"));
const WDVPGrid = React.lazy(() => import("components/Articles/WDVP/WDVPGrid"));
const RocDevSurvey = React.lazy(() => import("components/Articles/RocDevSurvey/RocDevSurvey"));
const StephenKing = React.lazy(() => import("components/Articles/StephenKing/StephenKing"));
const StephenKingCharacters = React.lazy(() => import("components/Articles/StephenKingCharacters/StephenKingCharacters"));
const StephenKing3d = React.lazy(() => import("components/Articles/StephenKing3d/StephenKing3d"));
const StephenKingUniverse = React.lazy(() => import("components/Articles/StephenKingUniverse/StephenKingUniverse"));
const GameOfThrones = React.lazy(() => import("components/Articles/GameOfThrones/GameOfThrones"));
const Chaconne = React.lazy(() => import("components/Articles/Chaconne/Chaconne"));
const Playground = React.lazy(() => import("components/Articles/Playground/Playground"));
const Authors = React.lazy(() => import("components/Articles/Authors/Authors"));
const Fishing = React.lazy(() => import("components/Articles/Fishing/Fishing"));
const TrafficSources = React.lazy(() => import("components/Articles/TrafficSources/TrafficSources"));
const ElectionHeads = React.lazy(() => import("components/ElectionHeads/ElectionHeads"));
const DVS = React.lazy(() => import("components/Articles/DVS/DVS"));
const Dating = React.lazy(() => import("components/Articles/Dating/Dating"));
const Diet = React.lazy(() => import("components/Articles/Diet/Diet"));
const DVSChannels = React.lazy(() => import("components/Articles/DVSChannels/DVSChannels"));
const Movies = React.lazy(() => import("components/Articles/Movies/Movies"));
const Music = React.lazy(() => import("components/Articles/Music/Music"));
const ReactZdog = React.lazy(() => import("components/Articles/ReactZdog/ReactZdog"));
const WebGLDemo = React.lazy(() => import("components/Articles/WebGLDemo/WebGLDemo"));
const I3 = React.lazy(() => import("components/Blog/posts/I3"));
const LearnD3 = React.lazy(() => import("components/Blog/posts/LearnD3/LearnD3"));
const SVG = React.lazy(() => import("components/Blog/posts/SVG/SVG"));
const Hooks = React.lazy(() => import("components/Blog/posts/Hooks/Hooks"));
const D3AndReact = React.lazy(() => import("components/Blog/posts/D3AndReact/D3AndReact"));
const NewsletterThankYou = React.lazy(() => import("components/NewsletterThankYou/NewsletterThankYou"));
const NewsletterSignupPage = React.lazy(() => import("components/NewsletterSignupPage/NewsletterSignupPage"));
const Photoronoi = React.lazy(() => import("components/Photoronoi/Photoronoi"));

class App extends Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.path != this.props.path) return;
        this.scrollToTop();
    }

    scrollToTop = () => {
        scrollTo(0, 0);
    };

    render() {

    return (
        <div className="App">

          <Helmet>
              <meta charSet="utf-8" />
              <title>Amelia Wattenberger</title>
              <link rel="canonical" href="https://wattenberger.com" />
              <meta property="og:type" content="article" />
              <meta name="description" content="Learn how to make charts interactive using d3.js" />
          </Helmet>

          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/sketches" component={Sketches} />
              <Route path="/loading" component={Loader} />
              {/* <Route path="/rochester-real-estate" component={RochesterRealEstate} /> */}
              {/* <Route path="/healthcare" component={HealthCare} /> */}
              <Route path="/dogs" component={DogNames} />
              <Route path="/dog-breeds" component={DogBreeds} />
              {/* <Route path="/family-tree" component={FamilyTree} /> */}
              <Route path="/news" component={News} />
              {/* <Route path="/wdvpscatter" component={WDVP} /> */}
              <Route path="/wdvpgrid" component={WDVPGrid} />
              <Route path="/wdvp" component={WDVP} />
              <Route path="/rocdev" component={RocDevSurvey} />
              <Route path="/king" component={StephenKing} />
              <Route path="/election-heads" component={ElectionHeads} />
              <Route path="/king-characters" component={StephenKingCharacters} />
              <Route path="/king3d" component={StephenKing3d} />
              <Route path="/king-universe" component={StephenKingUniverse} />
              <Route path="/playground" component={Playground} />
              <Route path="/dvs" component={DVS} />
              <Route path="/dvs-channels" component={DVSChannels} />
              <Route path="/authors" component={Authors} />
              <Route path="/fishing" component={Fishing} />
              <Route path="/movies" component={Movies} />
              <Route path="/music" component={Music} />
              <Route path="/diet" component={Diet} />
              <Route path="/dating" component={Dating} />
              <Route path="/chaconne" component={Chaconne} />
              <Route path="/game-of-thrones" component={GameOfThrones} />
              <Route path="/traffic-sources" component={TrafficSources} />
              <Route path="/react-zdog" component={ReactZdog} />
              <Route path="/webgl-demo" component={WebGLDemo} />
              <Route path="/photoronoi" component={Photoronoi} />
              <Route path="/blog/d3-interactive-charts" component={Interactions} />
              <Route path="/blog/i3" component={I3} />
              <Route path="/blog/d3" component={LearnD3} />
              <Route path="/blog/svg" component={SVG} />
              <Route path="/blog/react-hooks" component={Hooks} />
              <Route path="/blog/react-and-d3" component={D3AndReact} />
              <Route path="/blog" component={Blog} />
              <Route path="/thanks-for-signing-up" component={NewsletterThankYou} />
              <Route path="/keep-in-touch" component={NewsletterSignupPage} />

              {/* <Route path="/docstats" component={DoctorateStats} /> */}
              <Route>
                <div style={{
                  height: "90vh",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <h2>Uh oh, there's nothing here</h2>
                  <Link href="/">Take me Home</Link>
                </div>
              </Route>
            </Switch>

            <Header />

            <Footer />
          </Suspense>
        </div>
    )
  }
}

export default withRouter(App)
