import React, { useState, useRef, useMemo } from "react"
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import OrbitControls from "utils/OrbitControls"
import { getPointFromAngleAndDistance } from "utils/utils"
import data from "./character-predictions_pose.json"
import SimplexNoise from "simplex-noise"
import * as d3 from "d3"
import _ from "lodash"
import './GameOfThrones.scss';

extend({ OrbitControls })

const characters = _.orderBy(data, "popularity", "desc").slice(0, 30)
// const houses = _.uniq(_.map(characters, "house"))
const houses = [ "House Stark", "House Greyjoy", "House Martell", "Night's Watch", "House Tyrell", "House Lannister", "House Frey", "House Targaryen", "Other" ]
const countyBy = _.countBy(characters, "house")
// const colors = []
const houseColors = _.fromPairs(
  _.map(houses, (house, i) => [
    house,
    d3.interpolateSpectral(i / (houses.length - 1))
  ])
)
const houseAngles = _.fromPairs(
  _.map(houses, (house, i) => [
    house,
    i * (360 / houses.length)
  ])
)
const yearsExtent = d3.extent(characters, d => _.isNumber(d.DateoFdeath) ? d.DateoFdeath : null)
console.log(characters, houses, houseColors, countyBy, yearsExtent)

const GameOfThrones = () => {
  const [focusedYear, setFocusedYear] = useState(100)
  const [focusedCharacter, setFocusedCharacter] = useState(null)

  const onMouseEnterYearLocal = year => () => setFocusedYear(year)
  const onCharacterFocus = (character, e) => {
    setFocusedCharacter(character && e ? {
      ...character,
      x: e.pageX,
      y: e.pageY,
    } : null)
  }

  return (
    <div className={`GameOfThrones`}>
      <div className="GameOfThrones__contents">
          <Wrapper focusedYear={focusedYear} focusedCharacter={focusedCharacter} onCharacterFocus={onCharacterFocus} />
      </div>
      <div className="GameOfThrones__controls">
      Data from <a href="https://data.world/data-society/game-of-thrones">Data.world</a> and <a href="https://github.com/jeffreylancaster/game-of-thrones">@jeffreylancaster's Github</a>.
      </div>
      {/* <div className="GameOfThrones__controls">
        <div className="GameOfThrones__years">
          {_.times(yearsExtent[1] - yearsExtent[0], i => (
            <div className={`GameOfThrones__years__item GameOfThrones__years__item--is-${yearsExtent[0] + i == focusedYear ? "focused" : "not-focused"}`} key={i} onMouseEnter={onMouseEnterYearLocal(yearsExtent[0] + i)}>
            </div>
          ))}
        </div>
      </div> */}

      {focusedCharacter && (
        <div className="GameOfThrones__focused-character" style={{
          transform: `translate(calc(-50% + ${focusedCharacter.x}px), calc(-50% + ${focusedCharacter.y}px))`
        }}>
          <img src={focusedCharacter.characterImageFull} />
        </div>
      )}

    </div>
  )
}

export default GameOfThrones



// apply({ OrbitControls })

function Controls(props) {
  const ref = useRef()
  const { camera, scene } = useThree()
  scene.fog = new THREE.Fog(new THREE.Color("#2c3e50"), 0, 300)

  // useFrame(() => ref.current.obj.update())
  return <orbitControls ref={ref} args={[camera]} {...props} />
}

const camera = {
  fov: 75, near: 0.1, far: 1000,
  position: [0, 0, -60],
}

const colorScale = d3.scaleLinear()
  .domain([0,1])
  .range(["#e1b12c", "#40739e"])

function Wrapper({ focusedYear, focusedCharacter, onCharacterFocus, ...props }) {
  const meshGeo = new THREE.SphereBufferGeometry(100, 50, 50)

  // var starGeometry = new THREE.SphereGeometry(50, 50, 50);
  // var starMaterial = new THREE.MeshPhongMaterial({
  //   map: new THREE.ImageUtils.loadTexture("starPng"),
  //   side: THREE.DoubleSide,
  //   shininess: 0
  // });

  return (
    <Canvas camera={camera} {...props}>
      <Controls />
      <group>
        {/* <pointLight
          position={[0,0,5]}
          color="#fafaff"
          intensity={0.5}
          />
        <pointLight
          position={[0,0,3]}
          color="#f7f3ce"
          intensity={0.1}
          /> */}
        <ambientLight color="#fff" intensity={0.7} />

        <Characters focusedYear={focusedYear} focusedCharacter={focusedCharacter} onCharacterFocus={onCharacterFocus} />
        {/* <mesh geometry={starGeometry} material={starMaterial} /> */}

        {/* <Ground /> */}
        <Sun />


      </group>
    </Canvas>
  )
}

const Sun = () => {
  const geometry = new THREE.SphereBufferGeometry(9, 50, 50)
  // var geometry = new THREE.PlaneGeometry( 5, 20, 32 );

  return (
    <>
      <pointLight
        position={[0, 0, 0]}
        color="rgba(241, 196, 15, 0.5)"
        intensity={0.9}
      />
      <mesh geometry={geometry} position={[0, 0, 0]}>
        <meshPhongMaterial
          attach="material"
          opacity={0.9}
          color="rgb(241, 196, 15)"
          side={THREE.BackSide}
          transparent
        />
      </mesh>
    </>
  )

}

const Characters = ({ focusedYear, focusedCharacter, onCharacterFocus }) => {
  const onMouseOverLocal = character => e => onCharacterFocus(character, e)

  return (
    _.map(characters, (character, index) => (
      <Character
        {...character}
        index={index}
        isFocused={focusedYear == character.DateoFdeath}
        areAnyFocused={!!focusedCharacter}
        onPointerOver={onMouseOverLocal(character)}
        onPointerOut={onCharacterFocus}
      />
    ))
  )
}

const dateOfBirthScale = d3.scaleLinear()
  .domain(d3.extent(characters, d => d.dateOfBirth))
  .range([-5, 5])

const Character = ({ index, popularity, house, dateOfBirth, killed, killedBy, isNoble, isFocused, areAnyFocused, onPointerOver, onPointerOut }) => {
  const planetRadius = popularity * 2

  const [planet, noble, moon, position, rotation, material, speed] = useMemo(() => {

    const planet = new THREE.SphereBufferGeometry(planetRadius, 50, 50)
    const noble = new THREE.SphereBufferGeometry(0.2, 50, 50)
    const moon = new THREE.SphereBufferGeometry(0.2, 50, 50)

    const {x, y} = getPointFromAngleAndDistance(houseAngles[house] || houseAngles["Other"], ((index * 2) + 12) + d3.randomNormal(0, 0.)())
    const position = [
      x + d3.randomNormal(0, 0.3)(),
      y + d3.randomNormal(0, 0.3)(),
      0,
      // d3.randomNormal(0, 12)(),
      // dateOfBirthScale(dateOfBirth),
    ]
    const rotation = [
      d3.randomNormal(0, 50)(),
      d3.randomNormal(0, 50)(),
      d3.randomNormal(0, 50)(),
    ]

    const speed = d3.randomNormal(5, 2)()

    const canvas = document.createElement("canvas")

    canvas.width = 100
    canvas.height = 100

    generateNoise(0.5, canvas, houseColors[house] || houseColors["Other"])

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture })


    return [planet, noble, moon, position, rotation, material, speed]
  }, [])

  let theta = 0
  const group = useRef()
  const orbit = useRef()
  const areAnyFocusedRef = useRef()
  areAnyFocusedRef.current = areAnyFocused
  useFrame(() => {
    if (areAnyFocusedRef.current) return
    theta++
    group.current.rotation.set(
      rotation[0],
      rotation[1],
      rotation[2] + theta / 200
    )
    orbit.current.rotation.set(
      0,
      0,
      theta * speed / 2000
    )
  })
  var ring = new THREE.RingGeometry( planetRadius * 1.2, planetRadius * 1.3, 32, 32 );

  return (
    <group position={[
      0,
      0,
      0,
    ]} ref={orbit}>
      <group position={position} ref={group}>
        <mesh geometry={planet} material={material} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
          {/* <meshBasicMaterial attach="material" color={isFocused ? "#fff" : houseColors[house] || houseColors["Other"]} /> */}
          {/* <meshBasicMaterial attach="material" color="#ffca61" /> */}
        </mesh>

        {isNoble && (
          <mesh geometry={noble} position={[0, 1, 0]}>
            <meshBasicMaterial attach="material" color="#45aeb1" />
          </mesh>
        )}
        {!!killedBy && (
          <mesh geometry={ring}>
            <meshBasicMaterial attach="material" color="#ffffff" />
          </mesh>
        )}

        {_.map(killed, (person, i) => {
          const {x, y} = getPointFromAngleAndDistance(i * (360 / (killed.length - 1)), planetRadius * 1.3)

          return (
            <mesh geometry={moon} position={[
              x, y, 0,
            ]}>
              <meshBasicMaterial attach="material" color="#ecf0f1" />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}


const noiseColorScale = d3.scaleLinear()
.domain([0, 1])
.range(["rgba(236, 240, 241, 0.2)", "rgba(44, 62, 80, 0.2)"])
function generateNoise(opacity=0.2, canvas, color) {
  const simplex = new SimplexNoise()
  const context = canvas.getContext('2d')
  context.globalCompositeOperation = "color-burn"
  // context.globalCompositeOperation = "overlay"

  const size = d3.randomNormal(12, 4)()

  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)

  _.times(canvas.width, x => {
    _.times(canvas.height, y => {
      const number = simplex.noise2D(x / size, y / size)

      context.fillStyle = noiseColorScale(number)
      context.fillOpacity = 0.3
      context.fillRect(x, y, 1, 1)
    })
  })
}
