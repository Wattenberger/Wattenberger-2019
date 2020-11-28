import React, {Component} from "react"
import {Route} from 'react-router-dom'
import classNames from "classnames"
import rssParser from "rss-parser";
import _ from "lodash";
import * as d3 from "d3";
import Sentiment from "sentiment"
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactSelect from 'react-select';
import Creatable from 'react-select/creatable';

import ButtonGroup from 'components/_ui/Button/ButtonGroup/ButtonGroup';
import Button from 'components/_ui/Button/Button';

import { getFromStorage, setInStorage } from 'utils/utils';

const parser = new rssParser({
  // headers: {
  //   "Accept": "text/html,application/xhtml+xml,application/xml"
  // }
})
const sentiment = new Sentiment();

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

require('./News.scss')

const sites = [
  {label: "The Atlantic", url: "https://www.theatlantic.com/feed/all/"},
  {label: "ABC", url: "http://feeds.abcnews.com/abcnews/topstories"},
  {label: "CBS", url: "https://www.cbsnews.com/latest/rss/main"},
  {label: "NBC", url: "https://www.nbcnewyork.com/news/top-stories/?rss=y"},
  {label: "BBC", url: "http://feeds.bbci.co.uk/news/rss.xml"},
  // {label: "NPR", url: "https://www.npr.org/sections/news/"},
  // {label: "NPR", url: "http://feeds.feedburner.com/blogspot/lQlzL"},
  {label: "Reuters", url: "http://feeds.reuters.com/reuters/topNews/?format=xml"},
  {label: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml"},
  // {label: "The Hill", url: "https://thehill.com/rss/syndicator/19109"},
  // {label: "The Hill International", url: "https://thehill.com/taxonomy/term/43/feed"},
  {label: "PBS Now", url: "http://www.pbs.org/now/rss.xml"},
  {label: "PBS Nova", url: "http://www.pbs.org/wgbh/nova/rss/nova.xml"},
]

const today = new Date()
const formatDate = date => {
  const daysAgo = Math.round((today - date) / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.round((today - date) / (1000 * 60 * 60));
  const minutesAgo = Math.round((today - date) / (1000 * 60));
  return minutesAgo < 10  ? ""                   :
         hoursAgo   <  1  ? `${minutesAgo}m`     :
         hoursAgo   < 24  ? `${hoursAgo}h`       :
         daysAgo    <  1  ? `${hoursAgo}h`       :
        //  daysAgo <  2  ? `${daysAgo} day ago` :
         daysAgo    < 30  ? `${daysAgo}d`        :
                           d3.timeFormat("%-m/%-d/%Y")(date)
}
const defaultSiteOptions = _.map(sites, site => ({
  label: site.label,
  isActive: true,
}))
const defaultActiveSites = _.map(_.filter(defaultSiteOptions, "isActive"), "label")
const defaultSentimentRange = [-100, 100]
const localStorageActiveSitesKey = "active-sites"
const localStorageSentimentRangeKey = "sentiment-range"
const localStorageLastLoadKey = "last-load"
const localStorageTitleFiltersKey = "title-filters"
const storageTimeFormat = "%H:%M %m/%d/%Y"
const parseTime = d3.timeParse(storageTimeFormat)
const formatTime = d3.timeFormat(storageTimeFormat)
const fetchInterval = 1000 * 60 * 5
class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      titleFilters: [],
      articleTokens: [],
      siteOptions: defaultSiteOptions,
      activeSites: defaultActiveSites,
      sentimentRange: defaultSentimentRange,
      articlesBySentiment: {},
      articlesBySite: {},
      isDimmingSeen: true,
      isLoading: true,
      isShowingAbout: false,
    }
    this.getNews = this.getNews.bind(this)
  }
  isFirstLoad = true

  componentDidMount() {
    this.setDefaults();
    this.getNews();
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout)
  }

  getClassName() {
    return classNames("News")

  }
  getUrlArgs = () => {
    const args = window.location.search.slice(1).split("&")
    return _.fromPairs(args.map(str => str.split("=").map((d,i) => i == 1 ?
      JSON.parse(window.decodeURIComponent(d)) :
      window.decodeURIComponent(d)
    )))
  }

  setUrlArg = (key, value) => {
    const urlArgs = this.getUrlArgs()
    let newUrlArgs = _.omit({...urlArgs, [key]: value}, "")

    const { activeSites } = this.state
    if (newUrlArgs && activeSites.length == sites.length) newUrlArgs = _.omit(newUrlArgs, localStorageActiveSitesKey)

    window.history.replaceState( {} , '', !_.isEmpty(newUrlArgs) ?
      "?" + _.map(newUrlArgs, (val, key) => `${key}=${JSON.stringify(val)}`).join("&") :
      window.location.pathname
    );
  }

  getFromStorage = (key) => getFromStorage(`news--${key}`)
  setInStorage = (key, value) => setInStorage(`news--${key}`, value)

  setDefaults = () => {
    const urlArgs = this.getUrlArgs()
    let activeSites = urlArgs[localStorageActiveSitesKey] || this.getFromStorage(localStorageActiveSitesKey) || defaultActiveSites
    if (!_.isArray(activeSites)) activeSites = defaultActiveSites
    if (urlArgs[localStorageActiveSitesKey]) this.setInStorage(localStorageActiveSitesKey, activeSites)

    let sentimentRange = urlArgs[localStorageSentimentRangeKey] || this.getFromStorage(localStorageSentimentRangeKey) || defaultSentimentRange
    if (!_.isArray(sentimentRange)) sentimentRange = defaultSentimentRange
    if (urlArgs[localStorageSentimentRangeKey]) this.setInStorage(localStorageSentimentRangeKey, sentimentRange)

    const siteOptions = _.map(sites, site => ({
      label: site.label,
      isActive: _.includes(activeSites, site.label),
    }))
    let titleFilters = urlArgs[localStorageTitleFiltersKey] || this.getFromStorage(localStorageTitleFiltersKey) || []
    if (!_.isArray(titleFilters)) titleFilters = []
    if (titleFilters.length && _.isObject(titleFilters[0])) titleFilters = []
    if (urlArgs[localStorageTitleFiltersKey]) this.setInStorage(localStorageTitleFiltersKey, titleFilters)

    this.setState({ activeSites, siteOptions, sentimentRange, titleFilters })
  }

  parseArticles = (articles, siteLabel) => _.filter(
    _.map(articles, article => this.parseArticle(article, siteLabel)),
    article => !!article && !_.startsWith(article.title, "WATCH: ")
  )

  parseArticle = (article, siteLabel) => ({
    ...article,
    site: siteLabel,
    pubDate: new Date(article.pubDate),
    hasBeenViewed: this.parsedLastLoad ? new Date(article.pubDate) < this.parsedLastLoad : false,
    sentiment: sentiment.analyze([article.title, article.contentSnippet].join(". ")),
  })

  getNews = () => {
    sites.map(async site => {
      const feed = await this.getFeed(site.url)
      const lastLoad = this.getFromStorage(localStorageLastLoadKey)
      // const lastLoad = "17:25 09/30/2018"
      this.parsedLastLoad = lastLoad ? parseTime(lastLoad) : null

      const articles = this.parseArticles(feed.items || [], site.label)

      this.setState(prevState => {
        const parsedArticles = _.uniqBy(
          _.orderBy([...articles, ...prevState.articles], "pubDate", "desc"),
          d => d.link
        )
        const articlesBySentiment = _.countBy(parsedArticles, d => d.sentiment.score);
        const articlesBySite = _.countBy(parsedArticles, "site");
        // const articleTokens = _.map(
        //   _.flatMap(parsedArticles, d => d.sentiment.tokens),
        //   d => ({
        //     value: d,
        //     label: d,
        //   })
        // );
        if (this.isFirstLoad && _.every(_.map(sites, site => !!articlesBySite[site.label]))) {
          const currentTime = formatTime(new Date())
          this.setInStorage(localStorageLastLoadKey, currentTime)
          this.isFirstLoad = false;
        }


        return {
          articles: parsedArticles,
          isLoading: false,
          articlesBySentiment,
          articlesBySite,
          // articleTokens,
        }
      })
    })

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(this.getNews, fetchInterval)

  }

  getFeed = async site => {
    try {
      return await parser.parseURL(`${CORS_PROXY}${site}`)
    } catch(e) {
      return []
    }
  }

  onSiteChange = toggledSite => {
    const isSelectingOne = this.state.activeSites.length == sites.length;
    const isSelectingAll = this.state.activeSites.length == 1 && _.includes(this.state.activeSites, toggledSite.label);
    const siteOptions = _.map(this.state.siteOptions, site => ({
      ...site,
      isActive: isSelectingAll ? true :
        isSelectingOne ?
          site.label == toggledSite.label ? true : false :
          site.label == toggledSite.label ? !site.isActive : site.isActive,
    }))
    const activeSites = _.map(_.filter(siteOptions, "isActive"), "label")
    this.setInStorage(localStorageActiveSitesKey, activeSites)
    this.setUrlArg(localStorageActiveSitesKey, activeSites)
    this.setState({ siteOptions, activeSites })
  }

  onSentimentRangeChange = newRange => {
    const sentimentRange = _.sortBy(newRange)
    this.setState({ sentimentRange })
    this.setInStorage(localStorageSentimentRangeKey, sentimentRange)
    this.setUrlArg(localStorageSentimentRangeKey, sentimentRange)
  }
  onIsDimmingSeenToggle = e => {
    e.stopPropagation();
    e.preventDefault();
    const isDimmingSeen = !this.state.isDimmingSeen
    this.setState({ isDimmingSeen })
    // this.setInStorage(localStorageIsDimmingSeenKey, isDimmingSeen)
  }

  onIsShowingAboutToggle = () => {
    const isShowingAbout = !this.state.isShowingAbout
    this.setState({ isShowingAbout })
    // this.setInStorage(localStorageIsDimmingSeenKey, isDimmingSeen)
  }

  onTitleFilterChange = newFilters => {
    const titleFilters = _.map(newFilters, "label")
    this.setState({ titleFilters })
    this.setInStorage(localStorageTitleFiltersKey, titleFilters)
    this.setUrlArg(localStorageTitleFiltersKey, titleFilters)
  }

  render() {
    const { articles, siteOptions, activeSites, sentimentRange, articlesBySentiment, articlesBySite, articleTokens, titleFilters, isDimmingSeen, isLoading, isShowingAbout } = this.state
    const filteredArticles = _.filter(articles, article => (
      _.includes(activeSites, article.site) &&
      _.every(_.map(titleFilters, filter => !_.includes(_.lowerCase(article.title), filter))) &&
      (!article.sentiment || article.sentiment.score > sentimentRange[0]) &&
      (!article.sentiment || article.sentiment.score < sentimentRange[1])
    ))
    const groupedArticles = _.groupBy(filteredArticles, "hasBeenViewed")
    const seenArticles = groupedArticles.true || []
    const unseenArticles = groupedArticles.false || []
    const maxSentimentCount = _.max(Object.values(articlesBySentiment))
    const titleFilterObjects = _.map(titleFilters, filter => ({
      label: filter,
      value: filter,
    }))

    return (
      <div className={this.getClassName()}>
        {/* {isShowingAbout && (
          <p>
            stuffs
          </p>
        )} */}
        <div className="News__controls">
          <ButtonGroup
            className="News__toggle"
            buttons={_.map(siteOptions, site => ({
              ...site,
              children: articlesBySite[site.label] ? (
                <div className="News__toggle__notification">
                  { articlesBySite[site.label] || 0 }
                </div>
              ) : (
                <div className="News__toggle__loader" />
              ),
            }))}
            onChange={this.onSiteChange}
          />
          {/* <div className="News__controls__about-toggle" onClick={this.onIsShowingAboutToggle}>
            About
          </div> */}
          <div className="News__slider">
            <div className="News__histogram">
              {_.map(_.range(200), i => (
                <div className={`News__histogram__bar News__histogram__bar--is-${i - 100 > sentimentRange[0] && i - 100 < sentimentRange[1] ? "showing" : "not-showing"}`} key={i} style={{
                  height: `${articlesBySentiment[i - 100] ? _.max([articlesBySentiment[i - 100], 4]) * 100 / maxSentimentCount : 0}%`
                }}>
                </div>
              ))}
            </div>
            <div className="News__slider__values">
              <div className="News__slider__value">
                Sentiment:
              </div>
              <div className="News__slider__value">
                {sentimentRange.join(" to ")}
              </div>
            </div>
            <Range
              value={sentimentRange}
              min={-100}
              max={100}
              count={2}
              onChange={this.onSentimentRangeChange}
              pushable
              allowCross={false}
            />
          </div>
        </div>

        <div className="News__title-filter">
          <div className="News__title-filter__title">
            Filter out articles containing strings:
          </div>
          <Creatable
            className="News__title-filter__input"
            classNamePrefix="News__title-filter__input"
            value={titleFilterObjects}
            onChange={this.onTitleFilterChange}
            isMulti
            isClearable
          />
        </div>
        <div className="News__note">
          Showing { filteredArticles.length } of { articles.length } articles
        </div>

        <div className={`News__articles News__articles--is-${isDimmingSeen ? "dimming-seen" : "not-dimming-seen"}`}>
          {isLoading && (
            <div className="News__note">Loading...</div>
          )}
          {unseenArticles.map(article => <NewsArticle key={article.guid} article={article} />)}
          {!!seenArticles.length && (
            <div className="News__articles-separator">
              <div className="News__articles-separator__text">
                Already seen
              </div>
              <div className="News__articles-separator__line" />

              <Button className="News__articles-separator__toggle" onClick={this.onIsDimmingSeenToggle}>
                { isDimmingSeen ? "Don't" : "Do" } dim
              </Button>
            </div>
          )}
          {seenArticles.map(article => <NewsArticle key={article.guid} article={article} />)}
        </div>
      </div>
    )
  }
}

export default News

const NewsArticle = ({ article }) => (
  <a className={[
    "NewsArticle",
    `NewsArticle--is-${article.hasBeenViewed ? "not-new" : "new"}`,
  ].join(" ")} href={article.link} target="_blank">
    <div className="NewsArticle__title">
      <div className="NewsArticle__title__label" dangerouslySetInnerHTML={{__html:  article.title }} />
      <div className="NewsArticle__site">
        { article.site }
      </div>
      <div className="NewsArticle__date">
        { formatDate(article.pubDate) }
      </div>
    </div>
    <div className="NewsArticle__snippet">
      { article.contentSnippet.slice(0, 200) }
    </div>
    <div className="NewsArticle__sentiment">
      Sentiment: { article.sentiment && article.sentiment.score }
    </div>
  </a>
)