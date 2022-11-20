import React, {Component,useEffect,useState} from "react"
import classNames from "classnames"
import Link from "components/_ui/Link/Link"
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { useRef } from "react"


require('./HomeHeader.scss')

class HomeHeader extends Component {
  getClassName() {
    return classNames("HomeHeader")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        {/* <WatercolorCanvas className="HomeHeader__watercolor-canvas" /> */}
        <HomeHeaderBackground />
        <div className="HomeHeader__content">
          <div className="HomeHeader__content__text">
            <div className="HomeHeader__content__text__top">👋 Hi, I’m</div>
            <h1 className="HomeHeader__content__text__title">
              <div style={{ fontSize: "20vw", lineHeight: "0.83em", letterSpacing:"-0.022em" }}>
              Amelia
              </div>
              <div style={{ fontSize: "10.5vw", lineHeight: "0.83em" }}>
              Wattenberger
              </div>
            </h1>

            <div className="HomeHeader__content__text__description">
              I write code, think about data, and noodle on user interfaces.
              <br />
              Currently prototyping the future of developer experience at <a href="https://next.github.com/" target="_blank" rel="noopener noreferrer">GitHub Next</a>.
              <br />
              <br />
              Listen to <Link to="/podcasts">podcasts I've been on</Link>, or read <Link to="/blog">articles I've written</Link>.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeHeader

const sizes = [3,5,10,15,20]
const HomeHeaderBackground = () => {
  const [dimensions, setDimensions] = useState([100, 100])
  const ydoc = useRef(new Y.Doc())
  const provider = useRef(null)
  const awareness = useRef(null)
  const containerElement = useRef(null)
  const [circlePositions, setCirclePositions] = useState([])
  const [size, setSize] = useState(2)

  useEffect(() => {
    const onResize = () => {
      if (!containerElement.current) return
      const boundingRect = containerElement.current.getBoundingClientRect()
      setDimensions([
        boundingRect.width,
        boundingRect.height,
      ])
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onUpdatePositions = () => {
    const users = [...awareness.current.getStates()].map(([user, state]) => {
      const { position, size,color } = state.user
      return { user, position, size,color }
    })
    setCirclePositions(users)
}

  useEffect(() => {
    provider.current = new WebrtcProvider('wattenberger-hero-room', ydoc.current)
    awareness.current = provider.current.awareness
    awareness.current.setLocalStateField('user', {
      position: [0, 0],
      color: colors[Math.floor(Math.random() * colors.length)],
      size,
    })
    awareness.current.on('change', () => {
      onUpdatePositions()
    })
    return () => {
      const update = awareness.current.getLocalState('user')
      if (!update?.user) return
      update.user.size = 0
      awareness.current.setLocalStateField('user', update.user)
      provider.current.destroy()
    }
  }, [])

  return (
    <div
      className="HomeHeader__background"
      ref={containerElement}
      onMouseMove={e => {
      const percentPosition = [
        e.clientX  / dimensions[0],
        (e.clientY + window.scrollY) / dimensions[1],
      ]
      const update = awareness.current.getLocalState('user')
      if (!update?.user) return
      update.user.position = percentPosition
      awareness.current.setLocalStateField('user', update.user)
      onUpdatePositions()
      }}
      onClick={() => {
        const newSize = (size + 1 + sizes.length) % sizes.length
        setSize(newSize)
        const update = awareness.current.getLocalState('user')
        if (!update?.user) return
        update.user.size = newSize
        awareness.current.setLocalStateField('user', update.user)
        onUpdatePositions()
    }}>
      <svg className="HomeHeader__background-svg" >
        <defs>
          <filter id="lava" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence type="fractalNoise" baseFrequency="0.003" numOctaves="3" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="130" />
            {/* <feBlend mode="multiply" in="SourceGraphic" /> */}
            {/* <feBlend mode="screen" in="SourceGraphic" /> */}
            {/* <feGaussianBlur stdDeviation="20" /> */}
          </filter>
          <filter id="blend">
            <feBlend mode="multiply" in="SourceGraphic" />
          </filter>
        </defs>
        <g>
        {circlePositions.map(({ user, position,size,color }) => {
          const [x, y] = position
          return (
            <circle
              key={user}
              filter="url(#lava)"
              cx={x * dimensions[0]}
              cy={y * dimensions[1]}
              r={sizes[size] + "%"}
              fill={color}
            />
          )
        })}
          </g>
    </svg>
  </div>
  )
}

const colors = [
  "#E5E3DC",
  "#C7B4A4",
  "#BC7B2A",
  "#8E5730",
  "#8E9D80",
  "#000",
]