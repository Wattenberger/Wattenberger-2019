import { useState, usePrevious, useEffect, useRef } from 'react';
import React, {Component} from "react"
import { apply, Canvas, useRender, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import OrbitControls from "./OrbitControls"
import numeral from "numeral"
import domToImage from "dom-to-image"
import * as d3 from "d3"
import _ from "lodash"
import stephenKingBooks from "./kingBooks"
import textInfo from "./textInfo"
import './StephenKing3d.scss';

console.log(OrbitControls)

const bookNameMap = { "11_22_63_ A Novel": "11/22/63", "Nightmares & Dreamscapes": "Nightmares and Dreamscapes", "Finders Keepers": "Finders Keepers (Bill Hodges Trilogy, #2)", "Black House": "Black House (The Talisman, #2)", "Four Past Midnight": "Four Past Midnight ", "Colorado Kid, The": "The Colorado Kid (Hard Case Crime #13)", "Salem's Lot": "'Salem's Lot", "Shining, The": "The Shining (The Shining #1)", "Gunslinger, The": "The Gunslinger (The Dark Tower, #1)", "Dark Tower IV Wizard and Glass, The": "Wizard and Glass (The Dark Tower, #4)", "Dark Tower, The": "The Dark Tower (The Dark Tower, #7)", "Hearts In Atlantis": "Hearts in Atlantis", "Song of Susannah": "Song of Susannah (The Dark Tower, #6)", "IT": "It", "Talisman 01 - The TalismanCL Peter Straub": "The Talisman (The Talisman, #1)", "Doctor Sleep": "Doctor Sleep (The Shining, #2)", "Drawing of the Three, The": "The Drawing of the Three (The Dark Tower, #2)", "Wind Through the Keyhole, The": "The Wind Through the Keyhole (The Dark Tower, #4.5)", "End of Watch (The Bill Hodges Trilogy Book 3)": "End of Watch (Bill Hodges Trilogy, #3)", "Mr. Mercedes": "Mr. Mercedes (Bill Hodges Trilogy, #1)", "Wolves of the Calla": "Wolves of the Calla (The Dark Tower, #5)", "Everything's Eventual": "Everything's Eventual: 14 Dark Tales", "Waste Lands, The": "The Waste Lands (The Dark Tower, #3)", "Ur": "UR", "Green Mile, The": "The Green Mile, Part 1: The Two Dead Girls", "On Writing": "On Writing: A Memoir of the Craft" }

const stephenKingBooksEnhanced = _.orderBy(_.map(stephenKingBooks, book => {
  const name = book.title
  const bookInfo = textInfo.filter(info => _.includes([
    info.book,
    bookNameMap[info.book],
    `The ${info.book.slice(0, -5)}`,
    `A ${info.book.slice(0, -3)}`,
  ], name))[0]
  if (!bookInfo) return book

  return {
    ...book,
    ...bookInfo,
    percent_swears: _.sum(_.values(bookInfo.swear_types)) / bookInfo.number_of_words,
  }
}), "original_publication_year", "desc")
console.log(stephenKingBooksEnhanced)


const formatSalary = d => numeral(d).format("$0,0")
const formatNumber = d => numeral(d).format("0,0a")
const formatNumberWithDecimal = d => numeral(d).format("0,0.0a")
const ordinalColors = ["#c7ecee", "#778beb", "#f7d794", "#63cdda", "#cf6a87", "#e77f67", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"];
// const colorScale = d3.scaleLinear().range(["#c7ecee", "#686de0"]).domain([0, 1])

const annotations = [{
  date: d3.timeParse("%m/%d/%Y")("06/19/1999"),
  label: "Car accident",
},{
  date: d3.timeParse("%m/%d/%Y")("01/01/1982"),
  label: "Intervention",
}]
const StephenKing3d = () => {
  // const [sortedAuthors, setSortedAuthors] = useState([])
  const [showingAxes, setShowingAxes] = useState(true)
  const [focusedBook, setFocusedBook] = useState(null)

  const onClick = () => {
    setShowingAxes(false)
    setFocusedBook(null)
  }
  const onMouseOverBook= (book, e) => {
    console.log(book, e)
    setFocusedBook(!book ? null : {
      book,
      position: {
        x: e.clientX,
        y: e.clientY
      },
    })
  }

  return (
    <div className={`StephenKing3d StephenKing3d--is-${showingAxes ? "showing-axes" : "not-showing-axes"}`}>
      <div className="StephenKing3d__title-container">
        {/* <h2 className="StephenKing3d__title">
          Stephen King: Swears over Time
        </h2> */}
      </div>
      <div className="StephenKing3d__contents">
        <div className="StephenKing3d__axis StephenKing3d__axis--x">Number of Text Reviews</div>
        <div className="StephenKing3d__axis StephenKing3d__axis--y">Number of Words</div>
        <div className="StephenKing3d__axis StephenKing3d__axis--z">Number of Ratings</div>
        {!!focusedBook && (
          <div className="StephenKing3d__tooltip" style={{
            transform: `translate(calc(-50% + ${focusedBook.position.x}px), calc(-100% + ${focusedBook.position.y}px))`
          }}>
            <div className="StephenKing3d__tooltip__title">
              { focusedBook.book.title }
            </div>
            <div className="StephenKing3d__tooltip__metric">
              <div>Average rating</div>
              <div>{ d3.format(",.1f")(+focusedBook.book.average_rating) }</div>
            </div>
            <div className="StephenKing3d__tooltip__metric">
              <div>Number of Text Reviews</div>
              <div>{ d3.format(",.1f")(+focusedBook.book.work_text_reviews_count) }</div>
            </div>
            <div className="StephenKing3d__tooltip__metric">
              <div>Number of Words</div>
              <div>{ d3.format(",.1f")(+focusedBook.book.number_of_words) }</div>
            </div>
            <div className="StephenKing3d__tooltip__metric">
              <div>Number of Ratings</div>
              <div>{ d3.format(",.1f")(+focusedBook.book.work_ratings_count) }</div>
            </div>
          </div>
        )}

          <Wrapper focusedBook={focusedBook && focusedBook.book.title} onMove={onClick} onMouseOver={onMouseOverBook} />

      </div>
    </div>
  )
}

export default StephenKing3d



apply({ OrbitControls })

function Controls(props) {
  const ref = useRef()
  const { camera } = useThree()
  // useRender(() => ref.current.obj.update())
  return <orbitControls ref={ref} args={[camera]} {...props} />
}

const swearTypeScale = d3.scaleLinear()
  .domain([0, 100])
  .range([-0.7,0.7])
const ratingScale = d3.scaleLinear()
  // .domain([0, 5])
  .domain(d3.extent(stephenKingBooksEnhanced, d => +d.average_rating))
  .range([-0.9,0.9])
const colorScale = d3.scaleLinear()
  .domain(d3.extent(stephenKingBooksEnhanced, d => +d.average_rating))
  .range(["white", "#45aeb1"])
  .interpolate(d3.interpolateHcl)

const reviewsScale = d3.scaleLinear()
  .domain(d3.extent(stephenKingBooksEnhanced, d => +d.work_text_reviews_count))
  .range([-2.5,2.5])
const wordsScale = d3.scaleLinear()
  .domain(d3.extent(stephenKingBooksEnhanced, d => +d.number_of_words))
  .range([-2,2])
const numRatingsScale = d3.scaleLinear()
  .domain(d3.extent(stephenKingBooksEnhanced, d => +d.work_ratings_count))
  .range([-1.5,3])

const camera = {
  fov: 75, near: 0.1, far: 1000,
  // "position.z": 2,
}

function Wrapper({ focusedBook, vertices, color, onMouseOver, onMove, ...props }) {
  const meshGeo = new THREE.SphereBufferGeometry(1, 50, 50)

  const [isClearing, setIsClearing] = useState(false)
  const savedCallback = useRef()

  const onMouseOverLocal = book => e => {
    console.log("onMouseOverLocal")
    setIsClearing(false)
    onMouseOver(book, e)
  }

  useEffect(() => {
    savedCallback.current = isClearing;
  })

  const onClearBook = () => {
    setIsClearing(true)
    setTimeout(() => {
      if (!savedCallback.current) return
      onMouseOver(null)
      setIsClearing(false)
    }, 500)
  }

  return (
    <Canvas camera={camera} onWheel={onMove} onMouseDown={onMove} {...props}>
      <Controls />
      <group>
        <line>
          <geometry
            attach="geometry"
            vertices={[
              [-1, 1, 1], [1, 1, 1], [1, -1, 1]
            ].map(v => new THREE.Vector3(...v))}
            onUpdate={self => (self.verticesNeedUpdate = true)}
          />
          <lineBasicMaterial attach="material" color="black" />
        </line>
        <line>
          <geometry
            attach="geometry"
            vertices={[
              [1, 1, 1], [1, 1, -1]
            ].map(v => new THREE.Vector3(...v))}
            onUpdate={self => (self.verticesNeedUpdate = true)}
          />
          <lineBasicMaterial attach="material" color="black" />
        </line>

        <pointLight
          position={[0,0,4]}
          color="#9980FA"
          intensity={0.3}
        />
        <pointLight
          position={[-2,0,-2]}
          color="#9980FA"
          intensity={0.3}
        />
        <pointLight
          position={[1,10,1]}
          color="#B53471"
          intensity={0.5}
        />
        {/* <pointLight
          position={[-10,-1,-1]}
          color="#FFC312"
          intensity={1}
        /> */}
        <pointLight
          position={[3,3,3]}
          color="#12CBC4"
          intensity={0.1}
        />
        <ambientLight color="0xFFC312" intensity={0.4} />
        <ambientLight color="#5758BB" intensity={0.4} />


        {_.map(stephenKingBooksEnhanced, book => book.swear_types && (
          <mesh
            key={book.id}
            scale={[ratingScale(book.average_rating), ratingScale(book.average_rating), ratingScale(book.average_rating)]}
            position={new THREE.Vector3(
              reviewsScale(book.work_text_reviews_count),
              wordsScale(book.number_of_words),
              numRatingsScale(+book.work_ratings_count),
              0,
              // ratingScale(+book.average_rating),
            )}
            // geometry={meshGeo}
            onPointerOver={onMouseOverLocal(book)}
            onPointerOut={onClearBook}
            >
            <octahedronGeometry attach="geometry" />
            {/* <sphereGeometry heightSegments={100} widthSegments={100} attach="geometry" /> */}
            <meshLambertMaterial
              attach="material"
              color={focusedBook == book.title ? "#FFC312" : colorScale(+book.average_rating)}
              // opacity={0.9}
              // transparent
            />
          </mesh>
        ))}
      </group>
    </Canvas>
  )
}
