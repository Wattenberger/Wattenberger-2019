import React from "react"
import { range } from "d3"

import Aside from "components/_ui/Aside/Aside"
import Code from "components/_ui/Code/Code"
import Link from "components/_ui/Link/Link"
import List from "components/_ui/List/List"

export const P = ({ children }) => (
  <code className="P">{ children }</code>
)

export const customHooks = [{
  name: `useIsMounted`,
  description: <>
    If I'm using any async code, I make sure to check if my component is still mounted before doing anything like updating its state.
  </>,
  code:
`export const useIsMounted = () => {
  const isMounted = useRef(false)
  useEffect(() => {
      isMounted.current = true
      return () => isMounted.current = false
  }, [])
  return isMounted
}`
},{
  name: `useIsInView`,
  description: <>
    For triggering animations that start when a user scrolls to an element. I used this a lot for the <Link to="parse.ly">parse.ly</Link> marketing site.
  </>,
  code:
`const useIsInView = (margin="0px") => {
  const [isIntersecting, setIntersecting] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([ entry ]) => {
      setIntersecting(entry.isIntersecting)
    }, { margin })
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.unobserve(ref.current)
    }
  }, [])

  return [ref, isIntersecting]
}`
},{
  name: `useHash`,
  description: <>
    For keeping the <b>hash</b> of the url in-sync with a local variable. This is helpful for storing, for example, a filtered view of a chart in the url, so that a visitor can share that specific view.
  </>,
  code:
`const useHash = (initialValue=null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.location.hash
      return item ? item.slice(1) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = value => {
    try {
      setStoredValue(value)
      history.pushState(null, null, \`#\${value}\`)
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}`
},{
  name: `useLocalStorage`,
  description: <>
    For keeping a <Link to="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">localStorage</Link> value in-sync with a local variable.
  </>,
  url: "https://usehooks.com/useLocalStorage/",
},{
  name: `useInterval`,
  description: <>
    Especially useful for animations, or anything that needs to loop. Dan Abramov's blog post on this (linked) is especially great for understanding some gotchas with creating custom hooks.
  </>,
  url: "https://overreacted.io/making-setinterval-declarative-with-react-hooks/",
},{
  name: `useCookie`,
  description: <>
    This seriously make getting & setting cookies a breeze. The only issue, at the moment, is that the hook value doesn't update when you <P>set</P> it -- but this should be updated in the future.
  </>,
  url: "https://github.com/reactivestack/cookies/tree/master/packages/react-cookie/",
},{
  name: `useOnKeyPress`,
  description: <>
    For triggering code when the user presses a specific key. The <P>isDebugging</P> variable is optional, but I find it helpful for figuring out the exact value for a key that I need to listen for.
  </>,
  code:
`const useOnKeyPress = (targetKey, onKeyDown, onKeyUp, isDebugging=false) => {
  const [isKeyDown, setIsKeyDown] = useState(false)

  const onKeyDownLocal = useCallback(e => {
    if (isDebugging) console.log("key down", e.key, e.key != targetKey ? "- isn't triggered" : "- is triggered")
    if (e.key != targetKey) return
    setIsKeyDown(true)

    if (typeof onKeyDown != "function") return
    onKeyDown(e)
  })
  const onKeyUpLocal = useCallback(e => {
    if (isDebugging) console.log("key up", e.key, e.key != targetKey ? "- isn't triggered" : "- is triggered")
    if (e.key != targetKey) return
    setIsKeyDown(false)

    if (typeof onKeyUp != "function") return
    onKeyUp(e)
  })

  useEffect(() => {
    addEventListener('keydown', onKeyDownLocal)
    addEventListener('keyup', onKeyUpLocal)

    return () => {
      removeEventListener('keydown', onKeyDownLocal)
      removeEventListener('keyup', onKeyUpLocal)
    }
  }, [])

  return isKeyDown
}`
},{
  name: `useChartDimensions`,
  description: <>
    This one is especially helpful! The way <P>{`<svg>`}</P> elements scale can be tricky, as well as maintaining consistent margin widths for a chart, so this helps me keep charts responsive, and automatically updates any <P>dimensions</P> when the window is resized.
  </>,
  code:
`const combineChartDimensions = dimensions => {
  let parsedDimensions = {
      marginTop: 40,
      marginRight: 30,
      marginBottom: 40,
      marginLeft: 75,
      ...dimensions,
  }

  return {
      ...parsedDimensions,
      boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
      boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}

export const useChartDimensions = passedSettings => {
  const ref = useRef()
  const dimensions = combineChartDimensions(passedSettings)

  const [width, changeWidth] = useState(0)
  const [height, changeHeight] = useState(0)

  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions]

    const element = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      if (width != entry.contentRect.width) changeWidth(entry.contentRect.width)
      if (height != entry.contentRect.height) changeHeight(entry.contentRect.height)
    })

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })

  return [ref, newSettings]
}`
}]

export const codeExamples = [
  [{
    description: (
        <p>
            With class components, we tie updates to specific <b>lifecycle events</b>.
        </p>
    ),
    code:
`class Chart extends Component {
  componentDidMount() {
    // when Chart mounts, do this
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data == props.data) return
    // when data updates, do this
  }

  componentWillUnmount() {
    // before Chart unmounts, do this
  }

  render() {
    return (
      <svg className="Chart" />
    )
  }
}`,
    highlightedLines: [2, 3, 4, 6, 7, 8, 9, 11, 12, 13],
    markers: [
        [2,3,4],
        [6,7,8, 9],
        [11,12,13],
    ]
},{
    description: (
        <p>
            In a function component, we instead use the <P>useEffect</P> hook to run code during the major <b>lifecycle events</b>.
        </p>

    ),
    code:
`const Chart = ({ data }) => {
  useEffect(() => {
    // when Chart mounts, do this
    // when data updates, do this

    return () => {
      // when data updates, do this
      // before Chart unmounts, do this
    }
  }, [data])

  return (
    <svg className="Chart" />
  )
}`,
    highlightedLines: [3, 4, 6, 7, 8, 9],
    markers: [
        [3],
        [4, 7],
        [8],
    ]
}],

[{
  description: (
      <>
          <p>
              With <b>lifecycle events</b>, we need to deal with all changes in one spot. Our thinking looks something like:
              <blockquote>When our component loads, and when props change (specifically <P>dateRange</P>), update <P>data</P></blockquote>
          </p>
      </>
  ),
  code:
`class Chart extends Component {
  state = {
    data: null,
  }

  componentDidMount() {
    const newData = getDataWithinRange(this.props.dateRange)
    this.setState({ data: newData })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateRange != this.props.dateRange) {
      const newData = getDataWithinRange(this.props.dateRange)
      this.setState({ data: newData })
    }
  }

  render() {
    return (
      <svg className="Chart" />
    )
  }
}`,
  highlightedLines: [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
  markers: [
      [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
  ]
},{
  description: (
      <p>
          In a function component, we need to think about <b>what values stay in-sync</b>. Each update flows more like the statement:
          <blockquote>
              Keep <P>data</P> in sync with <P>dateRange</P>
          </blockquote>
      </p>
  ),
  code:
`const Chart = ({ dateRange }) => {
  const [data, setData] = useState()

  useEffect(() => {
    const newData = getDataWithinRange(dateRange)
    setData(newData)
  }, [dateRange])

  return (
    <svg className="Chart" />
  )
}`,
  highlightedLines: [4, 5, 6, 7],
  markers: [
      [4, 5, 6, 7],
  ],
  afterCodeText: <>
    <Aside>
      Let's pretend that we're either defining <P>getDataWithinRange()</P> outside of the component, or substituting it for inline code that generates the <P>newData</P>. For this simple example, we'll skip that definition so we can focus on the concepts.
    </Aside>
  </>,
}],

[{
  description: (
      <p>
      </p>
  ),
  code:
`class Chart extends Component {
  state = {
    data: null,
  }

  componentDidMount() {
    const newData = getDataWithinRange(this.props.dateRange)
    this.setState({ data: newData })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateRange != this.props.dateRange) {
    const newData = getDataWithinRange(this.props.dateRange)
      this.setState({ data: newData })
    }
  }

  render() {
    return (
      <svg className="Chart" />
    )
  }
}`,
  // highlightedLines: [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
  markers: [
      [6, 7, 8, 9, 11, 12, 13, 14, 15, 16],
  ]
},{
  description: (
      <>
          <p>
              In fact, this last example was still thinking inside the class-component box. We're storing <P>data</P> in <P>state</P> to prevent re-calculating it every time our component updates.
          </p>
          <p>
              But we no longer need to use <P>state</P>! Here to the rescue is <Link to="https://reactjs.org/docs/hooks-reference.html#usememo"><P>useMemo()</P></Link>, which will only re-calculate <P>data</P> when its <b>dependency array</b> changes.
          </p>
      </>

  ),
  code:
`const Chart = ({ dateRange }) => {
  const data = useMemo(() => (
    getDataWithinRange(dateRange)
  ), [dateRange])

  return (
    <svg className="Chart" />
  )
}`,
  highlightedLines: [2, 3, 4],
  markers: [
      [2, 3, 4],
  ],
  afterCodeText: <>
  <Aside>
  <p>
      Note that we can always just define variables right inside of our function.
  </p>
  <Code highlightedLines={[2]}
          hasLineNumbers={false}
          doWrap={false}>
{`const Chart = ({ dateRange }) => {
  const newData = getDataWithinRange(dateRange)

  return (
    <svg className="Chart" />
  )
}`}
      </Code>
      <p>
          This works just fine, unless our <P>getDataWithinRange()</P> function is <b>computationally expensive</b>. I use <P>useMemo()</P> a lot, especially when handling large datasets, to keep things speedy.
      </p>
      </Aside>
  </>,
}],

[{
  description: (
      <>
          <p>
              Imagine that we have many values that we need to calculate, but they depend on different <P>props</P>. For example, we need to calculate:
          </p>
          <List items={[
              <>
                  our <P>data</P> when our <P>dateRange</P> changes,
              </>,
              <>
                  the <P>dimensions</P> of a chart when the <P>margins</P> change, and
              </>,
              <>
                  our <P>scales</P> when our <P>data</P> or <P>dimensions</P> change
              </>,
          ]} />
      </>
  ),
  code:
`class Chart extends Component {
  state = {
    data: null,
    dimensions: null,
    xScale: null,
    yScale: null,
  }

  componentDidMount() {
    const newData = getDataWithinRange(this.props.dateRange)
    this.setState({ data: newData })
    this.setState({dimensions: getDimensions()})
    this.setState({xScale: getXScale()})
    this.setState({yScale: getYScale()})
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dateRange != this.props.dateRange) {
      const newData = getDataWithinRange(this.props.dateRange)
      this.setState({ data: newData })
    }
    if (prevProps.margins != this.props.margins) {
      this.setState({dimensions: getDimensions()})
    }
    if (prevProps.data != this.props.data) {
      this.setState({xScale: getXScale()})
      this.setState({yScale: getYScale()})
    }
  }

  render() {
    return (
      <svg className="Chart" />
    )
  }
}`,
  highlightedLines: [9, 10, 11, 12, 13, 14, 15, ...range(17, 30)],
  markers: [
      [10, 11, 17, 18, 19, 20],
      [12, 23],
      [13, 26],
      [14, 27],
  ]
},{
  description: (
      <>
          <p>
              In our function component, we can focus on our simple statements, like:
          </p>
          <blockquote>
              Keep <P>dimensions</P> in sync with <P>margins</P>
          </blockquote>
      </>

  ),
  code:
`const Chart = ({ data }) => {
  const data = useMemo(() => (
    getDataWithinRange(dateRange)
  ), [dateRange])
  const dimensions = useMemo(getDimensions, [margins])
  const xScale = useMemo(getXScale, [data])
  const yScale = useMemo(getYScale, [data])

  return (
    <svg className="Chart" />
  )
}`,
  highlightedLines: [2, 3, 4, 5, 6, 7],
  markers: [
      [2, 3, 4],
      [5],
      [6],
      [7],
  ],
  afterCodeText: <>
      <p>
          See how unwieldy our <b>class component</b> got, even in our simple example?
      </p>
      <p>
          This is because we had a lot of declarative code explaining <b>how</b> keep our variables in-sync with <P>props</P> and <P>state</P>, and in our <b>function component</b>, we get to focus only on <b>what</b> to keep in-sync.
      </p>
      <p>
          Notice how we can use as many <P>useMemo()</P> hooks as we want - letting us keep the <b>dependencies</b> and <b>effects</b> as close as possible.
      </p>
  </>,
}],

[{
  description: (
      <>
          <p>
              In our class component, we'll need to compare our <P>prevState</P> and current <P>state</P>.
          </p>
      </>
  ),
  code:
`class Chart extends Component {
  state = {
    data: null,
    dimensions: null,
    xScale: null,
    yScale: null,
  }

  componentDidMount() {
    const newData = getDataWithinRange(this.props.dateRange)
    this.setState({ data: newData })
    this.setState({dimensions: getDimensions()})
    this.setState({xScale: getXScale()})
    this.setState({yScale: getYScale()})
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dateRange != this.props.dateRange) {
      const newData = getDataWithinRange(this.props.dateRange)
      this.setState({ data: newData })
    }
    if (
      prevProps.margins != this.props.margins
      || prevState.dimensions != this.state.dimensions
    ) {
      this.setState({dimensions: getDimensions()})
    }
    if (prevProps.data != this.props.data) {
      this.setState({xScale: getXScale()})
      this.setState({yScale: getYScale()})
    }
  }

  render() {
    return (
      <svg className="Chart" />
    )
  }
}`,
  highlightedLines: [24],
  markers: [
      [10, 11, 17, 18, 19, 20],
      [12, 26],
      [13, 29],
      [14, 30],
  ]
},{
  description: (
      <p>
          Our hooks' <b>dependency arrays</b> don't care whether our <P>margins</P> or <P>dimensions</P> are in our <P>props</P>, <P>state</P>, or neither - a value is a value, as far as they're concerned.
      </p>

  ),
  code:
`const Chart = ({ data }) => {
  const data = useMemo(() => (
    getDataWithinRange(dateRange)
  ), [dateRange])
  const dimensions = useMemo(getDimensions, [margins])
  const xScale = useMemo(getXScale, [data, dimensions])
  const yScale = useMemo(getYScale, [data, dimensions])

  return (
    <svg className="Chart" />
  )
}`,
  highlightedLines: [6, 7],
  markers: [
      [2, 3, 4],
      [5],
      [6],
      [7],
  ],
}]
]