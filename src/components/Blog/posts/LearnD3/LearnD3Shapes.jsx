import React, { useMemo, useState } from "react"
import { Twemoji } from "react-emoji-render"
import _ from "lodash"
import * as d3 from "d3"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Select from 'react-select';

import Aside from "components/_ui/Aside/Aside"
import Expandy from "components/_ui/Expandy/Expandy"
import LocalExample from "components/_ui/LocalExample/LocalExample"
import InlineExpandy from "components/_ui/InlineExpandy/InlineExpandy"
import Button from "components/_ui/Button/Button"
import Link from "components/_ui/Link/Link"
import Icon from "components/_ui/Icon/Icon"
import List from "components/_ui/List/List"
import Code from "components/_ui/Code/Code"
import { DocsLink, P, ReadMore } from "./LearnD3"
import bookImage from "images/book.png";
import constructionGif from "./construction.gif";

import "components/Articles/Fishing/Fishing.scss"

const LearnD3Shapes = ({ onScrollToSectionLocal }) => {
    return (
        <div className="LearnD3Shapes">
            <p>
                To visualize data, we need to represent our dataset as shapes. But how can we draw these shapes?
            </p>

            <p>
                Let's go over the four ways to draw in a web browser:
            </p>

            <List items={[
                <>
                    <b>Basic DOM elements</b>
                    <p>
                        CSS is pretty powerful these days - we can actually get pretty far by just using your run-of-the-mill <P>div</P>.
                    </p>
                    <p>
                        For example, we can make a simple progress bar by dynamically setting an element’s <P>width</P>:
                    </p>
                    <div dangerouslySetInnerHTML={{__html: barCode}} />
                    <Expandy trigger="Show me the code">
                        <Code size="s" language="css">{ barCode }</Code>
                    </Expandy>
                    <p>
                        Or even a heatmap using CSS Grid:
                    </p>
                    <div dangerouslySetInnerHTML={{__html: heatmapCode}} />
                    <Expandy trigger="Show me the code">
                        <Code size="s" language="css">{ heatmapCode }</Code>
                    </Expandy>
                </>,
                <>
                    <b>Canvas</b>
                    <p>
                        There is an HTML <P>{`<canvas>`}</P> element that we can draw on to create <Link href="https://en.wikipedia.org/wiki/Raster_graphics">raster images</Link>. Doing this involves using native Javascript methods, such as <P>fillRect()</P>.
                    </p>
                    <p>
                        Read more about <b>Canvas</b> <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">on the MDN docs</Link>
                    </p>
                    <p>
                        Canvas can be tedious to work with because of its imperative nature, and any shapes we draw are collapsed into one DOM element. It can be way more performant, however, when you’re trying to render many elements, since each element doesn't have the overhead of a DOM element.
                    </p>
                </>,
                <>
                    <b>WebGL</b>
                    <p>
                        Everything I just said about <b>Canvas</b> applies even more so to <b>WebGL</b>. <b>WebGL</b> is an API to draw on <P>{`<canvas>`}</P> elements using low-level shader code, and it’s really fast since it is processed by your computer’s GPU.
                    </p>
                    <p>
                        Read more about <b>WebGL</b> <Link href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial">on the MDN docs</Link>
                    </p>
                </>,
                <>
                    <b>SVG</b>
                    <p>
                        <b>SVG</b> is the main method used for data visualization in the browser. Within an <P>{`<svg>`}</P> element, we can use <b>SVG</b> elements the same way we use HTML elements.
                    </p>
                    <p>
                        We can even use CSS properties to style our SVG elements, although they play by different rules.
                    </p>
                    <p>
                        Read more about <b>SVG</b> <Link href="https://developer.mozilla.org/en-US/docs/Web/SVG">on the MDN docs</Link>
                    </p>
                </>,
            ]} />

            <h3>d3-shape</h3>
            <p>
                While things like circles and rectangles are easy to draw, we’ll often want to draw more complex shapes to visualize our data. <Link href={`https://github.com/d3/d3-shape`}>d3-shape</Link> can help us create those shapes in SVG and Canvas.
            </p>

            <List items={[
                <>
                    <b>Arcs</b>
                    <p>
                        While a circle may be easy to draw in both SVG and Canvas, a segment of a circle is not. <DocsLink id="arc" repo="shape" /> makes it easy to create an arc with a specific start and end angle, plus some other optional parameters.
                    </p>

                    <ArcExample />

                    <p>
                        Calling an <DocsLink id="arc" repo="shape" /> will create a string for the <b>d</b> attribute of an SVG <P>{`<path>`}</P> element. We can alternatively use an arc’s <DocsLink repo="shape" id="arc_context">.context()</DocsLink> method to draw it on Canvas.
                    </p>

                    <p>
                        <DocsLink id="pie" repo="shape" /> can help us calculate the angles for a pie or donut chart, which can be passed to <DocsLink id="arc" repo="shape" />.
                    </p>
                </>,
                <>
                    <b>Lines</b>
                    <p>
                        Often we'll want to draw a line that changes x- or y-position based on a metric in our dataset, like in a timeline. <DocsLink repo="shape" id="line" /> can help us draw such a line, and <DocsLink repo="shape" id="area" /> can help us draw a filled area.
                    </p>
                    <p>
                        There are also custom methods for drawing a radial line or area, which are very handy for radial charts like this collection of countries’ fishing activity:
                    </p>

                    <Link href="/fishing" className="LearnD3__unstyled-link">
                        <div dangerouslySetInnerHTML={{__html: fishingExample }} />
                    </Link>
                </>,
                <>
                    <b>Curves</b>
                    <p>
                        Typically, lines created with d3 will connect each data point with straight lines. You might want to smooth the line a bit, to help the viewer focus on the overall shape instead of local noise. To help out, you can pass one of <Link href="https://github.com/d3/d3-shape#curves">d3's interpolation functions</Link> to your <DocsLink repo="shape" id="line" />'s' (or area, etc) <P>.curve()</P> method.
                    </p>

                    <p>
                        Play around with the different curve options, and see how the generated line relates to the underlying data points <span style={{color: "#bdbdcf", fontSize: "8px", verticalAlign: "middle"}}>⬤</span>
                    </p>

                    <CurveExample />

                    <p>
                        If none of these interpolation functions fulfill your needs, you can create your own <DocsLink repo="shape" id="custom-curves">custom curves</DocsLink>.
                    </p>
                </>,
                <>
                    <b>Links</b>
                    <p>
                        If you need to create a smooth curve connecting two points, <b>d3-shape</b> has functions for <DocsLink repo="shape" id="lineVertical">vertical</DocsLink>, <DocsLink repo="shape" id="lineHorizontal">horizontal</DocsLink>, and <DocsLink repo="shape" id="lineRadial">radial</DocsLink> links.
                    </p>
                </>,
                <>
                    <b>Symbols</b>
                    <p>
                        d3 has methods for drawing several common basic symbols:
                    </p>

                    <SymbolExample />

                    <p>
                        Each of these symbols is centered around the middle point <span style={{color: "#bdbdcf", fontSize: "8px", verticalAlign: "middle"}}>⬤</span>, making them easy to position for charts like scatter plots.
                    </p>

                    <p>
                        You can also <Link href="https://github.com/d3/d3-shape#custom-symbol-types">create your own symbols</Link>, although the <Link href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use">SVG <P>{`<use>`}</P> element</Link> could be a more performant alternative.
                    </p>
                </>,
                <>
                    <b>Stacks</b>
                    <p>
                        <DocsLink repo="shape" id="stack" /> won't draw any shapes directly, but can help compute positions for stacked elements, which can help with things like stacked bar charts and streamgraphs.
                    </p>
                </>,
            ]} />

            <ReadMore id="shape" />

            <h3>d3-path</h3>
            <p>
                One of the wonderful things about d3 is that the underlying methods are surfaced as well. <DocsLink repo="path" /> is used to create the shapes in <DocsLink repo="shape" />, but can be used to create your own custom paths.
            </p>

            <p>
                To create a complex shape in SVG, you need to construct a <b>d</b> attribute string for a <P>{`<path>`}</P> element.
            </p>

            <Code language="html">{`<path d="M 2 3 L 4 5 L 1 4 Z" />`}</Code>

            <p>
                But in Canvas, you need to list out a set of commands for the browser to follow:
            </p>

            <Code language="js">{`const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

context.beginPath()
ctx.moveTo(75, 50)
ctx.lineTo(100, 75)
ctx.lineTo(100, 25)
ctx.fill()`}</Code>

            <p>
                <DocsLink repo="path" id="path" /> will let you use the same imperative code to draw complex shapes to both SVG and Canvas.
            </p>

            <ReadMore id="path" />

            <h3>d3-polygon</h3>
            <p>
                <DocsLink repo="polygon" /> is a small module that contains a few utility functions for dealing with polygons: any shape composed of a series of <P>[x, y]</P> points.
            </p>

            <p>
                There are methods for
            </p>
            <List items={[
                <><Link href="https://github.com/d3/d3-polygon#polygonArea">finding the area of a polygon</Link>,</>,
                <><Link href="https://github.com/d3/d3-polygon#polygonCentroid">finding the center of a polygon</Link>,</>,
                <><Link href="https://github.com/d3/d3-polygon#polygonLength">finding the length of the perimeter of a polygon</Link>,</>,
                <><Link href="https://github.com/d3/d3-polygon#polygonLength">querying whether or not a point is contained within a polygon</Link>, and</>,
                <><Link href="https://github.com/d3/d3-polygon#polygonHull">generating a polygon that contains a set of points</Link></>,
            ]} />

            <PolygonExample />

            <ReadMore id="polygon" />


        </div>
    )
}

export default LearnD3Shapes




const barCode = (
`<div style="
    position: relative;
    width: 100%;
    border: 1px solid lightgrey;
    background: white;
">
    <div style="
        width: 65%;
        background: cornflowerblue;
        height: 1em;
    ">
    </div>
</div>`
)
const colors = d3.schemeBlues[8]
const heatmapCode = (
`<div style="
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1em);
    grid-template-rows: repeat(3, 1em);
    grid-gap: 3px;
">
${_.times(18, i => (
`    <div style="width: 100%; background: ${colors[Math.floor(Math.random() * colors.length)]};"></div>
`)).join("")}
</div>`
)

const ArcExample = () => {
    const [params, setParams] = useState({
        innerRadius: 25,
        outerRadius: 40,
        startAngle: 0,
        endAngle: 5.5,
        cornerRadius: 20,
        padAngle: 0,
    })
    const {arcPath} = useMemo(() => {
        const arcPath = d3.arc()
            .innerRadius(params.innerRadius)
            .outerRadius(params.outerRadius)
            .startAngle(params.startAngle)
            .endAngle(params.endAngle)
            .padAngle(params.padAngle)
            .cornerRadius(params.cornerRadius)
            ()

        return {
            arcPath
        }
    }, [params])
    return (
        <div className="ArcExample">
            <svg width="100" height="100">
                <path fill="cornflowerblue" d={arcPath} style={{transform: `translate(50%, 50%)`}} />
            </svg>

            <div className="ArcExample__controls">
                {["innerRadius", "startAngle", "outerRadius", "endAngle", "cornerRadius", "padAngle"].map(param => (
                    <div className="ArcExample__control" key={param}>
                        <div className="ArcExample__control__label">
                            { param }
                        </div>
                        <div className="ArcExample__control__value">
                            { params[param] }
                        </div>
                        <Slider
                            className="ArcExample__slider"
                            value={params[param]}
                            min={0}
                            max={param.endsWith("Angle") ? Math.PI * 2 : 50}
                            step={param == "cornerRadius" || param.endsWith("Angle") ? 0.1 : 1}
                            onChange={value => setParams({
                                ...params, [param]: value
                            })}
                            pushable
                        />
                    </div>
                ))}
            </div>
            <Expandy trigger="Show me the code" doHideIfCollapsed>
                <Code language="js">{`const arcGenerator = d3.arc()
  .innerRadius(${params.innerRadius})
  .outerRadius(${params.outerRadius})
  .startAngle(${params.startAngle})
  .endAngle(${params.endAngle})
  .padAngle(${params.padAngle})
  .cornerRadius(${params.cornerRadius})

const arcPath = arcPathGenerator()

** HTML **

<svg width="100" height="100">
  <path
    fill="cornflowerblue"
    d={arcPath}
    style="transform: translate(50%, 50%)"
  />
</svg>
`}</Code>
            </Expandy>
        </div>
    )
}
const CurveExample = () => {
    const [iteration, setIteration] = useState(0)
    const [curve, setCurve] = useState("curveBasis")

    const data = useMemo(() => (
        new Array(20).fill(0).map((_, i) => ({
            x: i,
            y: d3.randomNormal(3, 1)(),
        }))
    ), [iteration])

    const linePath = useMemo(() => (
        d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3[curve])
            (data)
    ), [curve, data])

    return (
        <div className="CurveExample">
            <div className="CurveExample__controls">
                <h6>Curve function</h6>
                <select
                    className="CurveExample__select"
                    defaultValue={curve}
                    onChange={e => setCurve(e.target.value)}
                >
                    {curves.map(d => (
                        <option key={d}>{ d }</option>
                    ))}
                </select>
                <Button className={`CurveExample__refresh-button CurveExample__refresh-button--iteration-${iteration % 2}`} onClick={() => setIteration(iteration + 1)}>
                    <Icon name="refresh" />
                    Update data
                </Button>
            </div>
            <svg className="CurveExample__svg" viewBox="0 0 20 6">
                <path d={linePath} />
                {data.map(({x, y}) => (
                    <circle
                        key={x}
                        cx={x}
                        cy={y}
                        r="0.1"
                    />
                ))}
            </svg>
        </div>
    )
}

const curves = [
    "curveBasis",
    "curveBasisClosed",
    "curveBasisOpen",
    "curveBundle",
    "curveCardinal",
    "curveCardinalClosed",
    "curveCardinalOpen",
    "curveCatmullRom",
    "curveCatmullRomClosed",
    "curveCatmullRomOpen",
    "curveLinear",
    "curveLinearClosed",
    "curveMonotoneX",
    "curveMonotoneY",
    "curveNatural",
    "curveStep",
    "curveStepAfter",
    "curveStepBefore",
]
const SymbolExample = () => {
    const symbolSize = 50
    const symbolDiameter = 11
    const symbolRadius = symbolDiameter / 2
    return (
        <div className="SymbolExample">
            {symbols.map((symbol, i) => (
                <div key={symbol} className="SymbolExample__item">
                    <svg className="SymbolExample__svg" viewBox={[
                        -symbolRadius, -symbolRadius, symbolDiameter, symbolDiameter
                    ]}>
                        <path
                            d={d3.symbol().type(d3[`symbol${symbol}`]).size(symbolSize)()}
                        />
                        <circle cx="0" cy="0" r="0.46" />
                    </svg>
                    <div className="SymbolExample__name">
                        { symbol }
                    </div>
                </div>
            ))}
        </div>
    )
}

const symbols = [
    "Circle",
    "Cross",
    "Diamond",
    "Square",
    "Star",
    "Triangle",
    "Wye",
]
const PolygonExample = () => {
    const [iteration, setIteration] = useState(0)

    const {data, randomPoint} = useMemo(() => ({
        data: new Array(20).fill(0).map((_, i) => [
            d3.randomNormal(3, 1)(),
            d3.randomNormal(3, 1)(),
        ]),
        randomPoint: [
            d3.randomNormal(3, 1)(),
            d3.randomNormal(3, 1)(),
        ],
    }), [iteration])

    const polygonPoints = useMemo(() => (
        d3.polygonHull(data)
    ), [data])
    const info = useMemo(() => ({
        area: <>{d3.format("0.1f")(d3.polygonArea(polygonPoints))}px<sup>2</sup></>,
        length: d3.format("0.1f")(d3.polygonLength(polygonPoints)) + "px",
        centroid: d3.polygonCentroid(polygonPoints).map(d3.format("0.1f")).join(", "),
        contains: d3.polygonContains(polygonPoints, randomPoint) ? "yes" : "no",
    }), [polygonPoints])

    return (
        <div className="PolygonExample">

            <svg className="PolygonExample__svg" viewBox={[
                0, 0, 6, 6
            ]}>
                <path
                    key="0"
                    d={[
                        "M",
                        polygonPoints.map(d => d.join(" ")).join(" L "),
                        "Z",
                    ].join(" ")}
                />
                {data.map((d, i) => (
                    <circle
                        key={i}
                        cx={d[0]}
                        cy={d[1]}
                        r="0.1"
                    />
                ))}
                <circle
                    key="x"
                    className="PolygonExample__special-point"
                    cx={randomPoint[0]}
                    cy={randomPoint[1]}
                    r="0.1"
                />
            </svg>

            <div className="PolygonExample__controls">
                <div className="PolygonExample__params">
                    {["area", "length", "centroid", "contains"].map(param => (
                        <div className="PolygonExample__param" key={param}>
                            <div className="PolygonExample__param__label">
                                { param }{param == "contains" && (
                                     <span style={{color: "#12CBC4", fontSize: "8px", verticalAlign: "middle", margin: "0 0.6em"}}>⬤</span>
                                )}
                            </div>
                            <div className="PolygonExample__param__value">
                                { info[param] }
                            </div>
                        </div>
                    ))}
                </div>

                <Button className={`PolygonExample__refresh-button PolygonExample__refresh-button--iteration-${iteration % 2}`} onClick={() => setIteration(iteration + 1)}>
                    <Icon name="refresh" />
                    Update data
                </Button>
            </div>

        </div>
    )
}

const fishingExample = `<div class="Fishing__circles__item"><h6>Norway</h6><div class="Fishing__circles__item__description">Daily number of boats fishing in foreign waters (2016)</div><div class="FishingCircle__wrapper"><div class="FishingCircle__annotation">Fish taken from Norway’s waters</div><svg class="FishingCircle" width="400" height="400"><g transform="translate(200, 200)"><circle r="150" class="FishingCircle__taken"><title>Taken from Norway’s waters</title></circle><path class="FishingCircle__reset" d="M0,-145.63636363636363L2.5068905965133785,-145.61478603754583L4.998956778848756,-145.14121115287986L7.454349216739873,-144.2165670612949L9.77619937200236,-141.75419701765395L12.238261347531017,-141.83663108614508L14.67793256388027,-141.60495490740382L17.195214422648316,-142.00819225338674L19.67454402150563,-141.96131007149538L22.15734383993019,-141.87107276507368L24.549421982009036,-141.19995439099358L26.92497526712225,-140.48860371211808L29.311297617588124,-139.8708550643628L31.71460167659529,-139.34558588257366L34.20614687348912,-139.1762937994065L36.457486361815604,-138.03949920609895L38.531526228809405,-136.3416997465719L40.676023036165866,-135.00541155806053L42.95231250953817,-134.15536850856827L45.21140329998001,-133.26700379652405L47.72880639260393,-133.11082612647579L50.013018913213266,-132.2695313778729L52.836998311285285,-132.78275442961726L54.3785402803486,-130.09217638650875L56.50030975371329,-128.88708347616003L58.02783745425861,-126.40827137540359L60.549239721373965,-126.12828107990632L63.322581551327104,-126.28631809008412L65.80306800134561,-125.78175232050513L67.63203523090321,-124.03181560228911L69.42035348385498,-122.25636278404853L71.37578198506574,-120.80848436587843L73.15922693859396,-119.09719897211482L74.53817103857898,-116.78571844806265L76.83872992240528,-115.94003008300109L78.97761749038938,-114.82490616603008L81.41763833325099,-114.11446147178836L83.45096739308528,-112.80570991717815L85.04847161836422,-110.91966806944788L86.26657406786758,-108.5851043781236L88.20955667811826,-107.18937313911125L90.30692479318856,-105.96647019445238L92.3882521472854,-104.70303202274702L94.1768544115822,-103.09720724988833L95.75017201398924,-101.26266686092829L97.47905594274317,-99.59948189125993L98.69383429916795,-97.427787440459L100.3562709473104,-95.71450034224125L102.39010642448581,-94.34245903863673L103.7951669131077,-92.38467961712837L105.57684960771985,-90.76211928984075L106.70384712831338,-88.58293121269134L107.89363540714996,-86.47722559186907L109.90549421388491,-85.02439675811321L111.78987180036738,-83.44623755962533L112.7670410629774,-81.19088712645102L114.3719401256952,-79.39327920522472L115.49493658183069,-77.26115017548115L117.61015693376926,-75.77865599905049L119.47655745884744,-74.10233421958442L119.56336382721746,-71.3360743340619L121.01016148477878,-69.4031038025517L120.63417575395708,-66.45447534256782L123.44797229754603,-65.26034159588103L124.67466547105055,-63.18736486781073L125.86653712680021,-61.0914769073075L127.27052909644259,-59.088108552160385L127.48025563823647,-56.648339979295756L129.69196463950732,-54.97779876942657L129.35463809088358,-52.22669436577935L131.12561444892518,-50.334407458862614L132.61325459868823,-48.303186698595376L132.00702228540342,-45.524280520704316L133.5490452784844,-43.49864186441107L133.88691514307664,-41.073389101869395L133.6568364279623,-38.49845539504753L134.2997213495346,-36.19206870535175L135.56409865134978,-34.0410112379657L136.39559287794907,-31.7643130307542L137.3221221784298,-29.497696507615302L138.61230474567282,-27.287587730818366L137.7191865367793,-24.657237855365192L137.31547766628634,-22.152665415591827L138.62129303014646,-19.921507410164413L139.620124885387,-17.617775575966743L141.39391064936927,-15.373976021712561L140.00802005761352,-12.788981138275235L139.7994426187376,-10.346883214312689L139.9568344086249,-7.938932615728952L140.75404168181296,-5.555519761573426L140.69248666302698,-3.128815403657753L140.58913704921713,-0.7058773014556273L140.5804577688745,1.7142381695532694L140.80273081790747,4.141864774068362L139.8932811983713,6.526807366269113L138.80760502845393,8.872980220887769L138.36247344380405,11.238929923191229L137.19857318177375,13.52530030315159L138.84180580560437,16.104913843142672L138.40885038305518,18.474419753481136L137.80066822466534,20.81343261770093L139.17001167231896,23.47724412324553L138.61121656773548,25.84435415351544L137.34419195022662,28.06269919839574L136.57456247283196,30.36350777434627L136.8271764439716,32.90120173529309L136.63661206879476,35.35405751618274L134.69372081557947,37.33653521834797L132.33117106141123,39.146662252553796L130.5971049487213,41.09130507256245L130.1291423576677,43.4195526108605L131.29132990641648,46.33379071993662L131.88001547681384,49.11035335946523L131.14207466372588,51.422955015056516L129.85925207966594,53.51685704666107L129.6697906530396,56.06896523988354L128.80965735499421,58.34897740170364L128.15587148345273,60.73276956085259L127.4580790221713,63.11129217038698L129.3814290876559,66.86102168273383L127.01087638046742,68.4314044556764L125.4573733866364,70.40733861391648L124.34458948565246,72.62522334316479L123.42569050608839,74.96722257283756L121.54039879927485,76.71675426745492L120.31588195334226,78.87226646647102L119.95505687962276,81.6220327474936L118.75510018970108,83.83205207910376L117.6245713902276,86.10544827009602L115.3645734993618,87.54039619760877L113.62622786595878,89.3446627992141L112.17719921600684,91.37343425990407L111.1088840984484,93.73047877428701L107.83579390687882,94.19381407674496L107.61440420366837,97.31655516260288L104.92779556256052,98.22263814417396L103.61324060309354,100.39380561785768L101.5809191571941,101.87277718285782L99.05542595722052,102.82059249647497L97.73538413589174,105.00952956460634L97.18975038398851,108.09597215973182L95.22524283235761,109.64996065352773L93.06080672504854,110.95941617008954L90.70795272813793,112.01499289909339L88.68237987216281,113.45234902905013L86.71634493007039,114.96206122877693L85.20600391611657,117.09928557327194L83.80428209072818,119.44163894210013L81.58309677628016,120.640576646563L79.3455142670505,121.79850632317618L77.09228699042235,122.9152195109003L74.89462558214498,124.1072733841341L72.61035489138828,125.14217864070987L70.64466608129669,126.73082914227516L67.93805418507337,126.96621910392558L65.4934491585233,127.63155851469564L63.64772932989013,129.47426920380664L61.757871195307125,131.29104023599746L59.15329872289754,131.5884002673123L56.39560481403958,131.45926298201422L54.279182626546806,132.78921998778452L51.98539244261513,133.70387273432863L49.72341858537,134.7068328546767L47.352283157789415,135.41406090696336L45.39944059025129,137.3743764553235L42.66305201701845,136.96375653494405L40.33743225695359,137.80871065527535L38.31979264409718,139.79776013816274L35.97528574031393,140.70088684761166L33.26451673280389,140.1052173422996L30.701847063482614,139.99106338105994L28.449071748354697,141.30089043941305L25.59422698720809,139.48954168374826L23.300839033381415,140.58207887330607L21.057303567311962,142.17636544831882L18.67746552153379,143.0586317437807L16.19685565342338,143.2234379885367L13.79404357449803,144.15973830091679L11.235975423684783,143.424191557934L8.765499002030296,143.596350563007L6.238745717387128,142.49986064301515L3.770446643016028,142.0408750268498L1.3388741800989028,143.5846669720816L-1.1382775833300502,144.26823683283175L-3.607757797355514,143.68198568121005L-6.045858766586586,142.7811467114524L-8.543272082222959,143.33653294147598L-11.092950570551686,144.25593561457356L-13.510465818936327,143.3648050023274L-16.006511602311225,143.38204706669458L-18.611902876836762,144.16720795022252L-20.991822115372155,143.15087116980206L-23.563341117757542,143.44112287704564L-25.906866067979074,142.3434677213271L-28.513575247462942,142.6787511390791L-30.84924709844265,141.6338384758145L-33.75232213272459,143.0726415169888L-36.176491639338785,142.3382911890517L-38.54953134426123,141.4313552973208L-40.82585060561662,140.22312475378766L-43.07204270212193,138.97859237115114L-45.58575966384496,138.60519949045027L-48.368309106220515,138.95904496770743L-50.9882801454221,138.7458473751377L-53.2213071626296,137.46611417562386L-55.21976964558071,135.64553411220925L-57.81441050071299,135.30189740941285L-59.577524268413676,133.04212347439253L-61.80093262860532,131.87340573238305L-64.30169173949925,131.2799162339029L-66.98650689167265,131.00350147451832L-69.4240802541039,130.19200527642445L-71.32371352173602,128.38167928259756L-73.18169318910445,126.54471047387928L-74.9976679595714,124.6819946930024L-76.5544369113538,122.44755500366527L-79.39351751332691,122.25529597277159L-81.63863155196509,121.09669125005405L-84.41447030271732,120.6791340781776L-85.91874260523718,118.43555209359018L-88.19057064673166,117.26600449826581L-88.68718997830652,113.79456124289295L-90.97549355155189,112.67548694447922L-92.72658202214754,110.88358497199668L-94.88931897937333,109.58027829661972L-97.4897189816736,108.74295143255371L-99.62538919028015,107.34857108030239L-101.17505428724112,105.32275719597467L-102.78072901663357,103.372190454388L-103.66471119723208,100.73239837384261L-104.88620378806117,98.46639082802771L-107.07065106070996,97.1043980012633L-108.21342016425713,94.7976875462822L-108.78813871657076,92.04015903171918L-111.30677800126483,90.93035849812195L-113.60501807532381,89.59201069572023L-115.78143255447037,88.1187260214004L-117.50093066037255,86.27409408666807L-119.30245715475651,84.4751305638508L-120.17573394785362,82.02464855209503L-121.34197585003383,79.79402008052645L-122.58231167413301,77.62054344986358L-123.55091700340058,75.28611704700617L-126.00505614595767,73.83766395981446L-127.25738114463881,71.6577542042489L-128.5919522141519,69.52146282045152L-129.76959762881359,67.29766339330044L-130.5424402866627,64.87186832928454L-132.0091902936924,62.79090415773499L-131.95327776141556,60.00127278610517L-131.84077561385587,57.232323132621L-132.5543977834541,54.85014348054222L-134.11331895626333,52.81012214386201L-136.40743353847404,51.019236457143556L-137.0083842156588,48.57251724456872L-138.08276293687717,46.29363879564139L-138.59913747265,43.82768381624761L-139.07161124275277,41.35769392955913L-139.50019875951654,38.88444844895381L-140.67672981390086,36.61481210830174L-142.08138245798688,34.380295603287195L-141.7206347113958,31.721009454315386L-141.97853429910649,29.221841937347723L-142.46050461997328,26.773585328761243L-141.95924310877035,24.157261765047824L-142.89325770594937,21.792322775078407L-144.0580387801789,19.438833289783272L-145.31933177936867,17.06757574397376L-143.96335367044347,14.400739993330337L-143.51040897004634,11.864338045169056L-142.60478528347588,9.321130763837067L-143.15272340989762,6.8846946191368765L-143.25002248968337,4.419535764604928L-144.39568128686355,1.9679336606211466L-145.08997604873673,-0.5203373938615425L-144.37785196110838,-3.0035645966686135L-144.1684942797695,-5.483164397938047L-142.96350474952123,-7.903756548936733L-144.4383446784258,-10.481906872331473L-144.77977949578838,-13.015461037181955L-145.48338850179408,-15.607498217669809L-143.70470928536614,-17.92379185140156L-143.64489847684672,-20.433184832591362L-142.73327611089306,-22.816667600761313L-141.5137958296832,-25.127166881575935L-140.1234730081802,-27.376339510941904L-140.43165388537224,-29.954962202826053L-140.9580536834466,-32.613733520884864L-141.43421871609178,-35.29943048687384L-139.35675330188653,-37.340529507063614L-137.90680952292584,-39.50846110363829L-136.9454554422561,-41.79683351121576L-136.724580577527,-44.31611435492918L-136.58637804473213,-46.884399002350484L-137.55384135215547,-49.87936507058359L-136.42011720388288,-52.14236679963122L-133.9841262358432,-53.872436867174585L-133.1625746693997,-56.22381290137314L-131.6762709275966,-58.28687394776104L-130.15854951885396,-60.315492194943516L-129.46919191592227,-62.725387303759945L-129.3437192660119,-65.43716477942016L-128.07756203419495,-67.59026474649224L-126.17820901940524,-69.39063026558618L-125.20174499004712,-71.6878154650981L-121.90544734978786,-72.73345091259395L-120.40363064960479,-74.67732808355782L-119.90275258549967,-77.25582278265767L-120.82198468717525,-80.82471647405575L-119.63685803549708,-83.04801389929474L-117.41494658274682,-84.53732212086803L-116.27020879334397,-86.79061267198571L-115.08259305811112,-89.02947138459936L-113.21383439172342,-90.74138858949576L-110.7957350712871,-91.97991677541987L-110.74711648371006,-95.20688517083195L-108.88815842012974,-96.91778460324844L-106.90289270176486,-98.50054978960503L-104.40209897960126,-99.57319701287233L-102.96377403285862,-101.6429522854739L-100.91276045736036,-103.10787851365262L-99.02928749392034,-104.73056641096008L-97.57972903387574,-106.82239930872215L-95.90694534430116,-108.69074515642588L-93.57955576022874,-109.80658713587717L-92.19545020188394,-112.03290080551508L-89.65955633209056,-112.85590494363477L-88.45041048309884,-115.35645479222576L-86.77603023382045,-117.30039806742529L-84.34803971294977,-118.22169403448886L-82.68693807702218,-120.21785674917041L-80.45467015404786,-121.39603149867173L-78.27975245882264,-122.64799368512088L-76.5138451494368,-124.55824126644595L-73.87289389124886,-125.03502026206073L-71.37301134130581,-125.6951935510101L-69.5904918495588,-127.62347049424724L-67.50977581694251,-129.04410324524443L-65.70634668694656,-131.04033971702745L-63.381952690795046,-132.02901937604227L-60.530999069932534,-131.8611771994406L-57.8142704456601,-131.88445751048934L-56.32438746639594,-134.7473122920221L-54.248673838686045,-136.33038527315665L-51.89393283569677,-137.24398819922007L-49.33971114066677,-137.60347696005982L-46.65711677759575,-137.52844868536636L-43.90865635050567,-137.14237090517722L-41.85617844340472,-138.92239641951298L-39.60699712451254,-140.14719473468597L-37.0494417277668,-140.28082822854753L-34.82452631268634,-141.69232575201232L-32.3198421666067,-142.0048527887296L-30.06645509437714,-143.47439808605918L-27.617991789727007,-144.10461162463207L-25.203450350701985,-144.96170388951674L-22.704438749558072,-145.37406221606312L-20.17997950064998,-145.60827046343675L-17.654190594082216,-145.79868737549813L-15.057534268118639,-145.26715201707805L-12.55476810651892,-145.50481982113155L-10.067045994393967,-145.97145239917725L-7.55993489969659,-146.2592946400668L-5.027119915631012,-145.9589081171214L-2.5209742515500584,-146.43284663326241Z"></path><circle class="FishingCircle__tick" r="68.18181818181817"></circle><circle class="FishingCircle__tick" r="136.36363636363635"></circle><text transform="translate(0, -62.18181818181817)" class="FishingCircle__tick-text">500</text><text transform="translate(0, -130.36363636363635)" class="FishingCircle__tick-text">1k</text><path class="FishingCircle__country" d="M0,-2.9685984848181817L0.05790468686774044,-3.3634409896244217L0.115283062336948,-3.3471630248523536L0.22432362696337718,-4.339907140216519L0.3277810160554521,-4.7528014681900395L0.41863880112423507,-4.851858896229843L0.436504858868792,-4.211168745187196L0.48372810067907696,-3.9949111090538056L0.4362968975402236,-3.1480922295956355L1.013808951764327,-6.491308913410492L0.886798881861382,-5.100566594381545L0.9574536605099169,-4.995782783442132L0.8259612593260665,-3.941412253364476L1.340620294562126,-5.890331598573707L0.9602103717485369,-3.906856896275736L1.1888436932620339,-4.50133578666304L0.9816195776826963,-3.4734072284347786L1.7203278354472842,-5.709839608283405L1.7833387124439992,-5.570001896647422L1.8469537295719411,-5.444157263992222L1.8015476540057143,-5.024334666120528L1.1871259612576723,-3.1395944094983426L1.4372131297843094,-3.611808470853487L0.7346522677089603,-1.757540969301834L1.672965472894935,-3.8163266979889774L0.9266517829338022,-2.0186251148844274L1.8531811520254597,-3.8603053367842994L1.778281999825243,-3.5464865894921025L3.486178976677327,-6.663788086300364L4.039207972875006,-7.407588678360671L3.596425441694455,-6.333674080582673L2.588961693611929,-4.381998061359479L2.74743628005314,-4.472600094357755L2.5330465458223057,-3.9687539497465125L2.5650262135016257,-3.870303643193738L3.4604011333856053,-5.031048644714786L2.6344242402140434,-3.6923928231589973L4.693970486986964,-6.345123246093391L5.07095173714547,-6.613502544811326L4.215427027700997,-5.3060248276600035L4.0294832167823715,-4.896496438107775L4.121316065991283,-4.835967087451116L4.540505160683969,-5.14572628217548L3.435076750392312,-3.7604443455579557L3.1234746058078606,-3.303298174861556L5.25335595012591,-5.367630264394863L5.052600278059174,-4.9877854012659775L6.366354364641633,-6.071891883400552L6.2268650748711085,-5.737446553963725L2.53560241061068,-2.256856685213383L4.016248947301858,-3.4526817896833175L4.477207390832104,-3.716868369798416L4.452829210192776,-3.5689622903037983L0.8439450078559206,-0.6528874257216659L1.0997770299054257,-0.8209353300269705L0.7716691287712214,-0.5555923126336292L1.8241913711398337,-1.2662942911827795L1.584450490308636,-1.0599292999361536L0.17942745137965074,-0.11560881703900595L0.8990678547478814,-0.5576242576420062L0.7247447344972876,-0.43241041903129657L0.09316941265843767,-0.05343556556421652L0.568284510206857,-0.3130543126363262L0,0L0.9484734984290163,-0.4807034435283828L1.55879790467494,-0.7565892283242269L0.08042876274608263,-0.03734080071479266L1.4066858444701718,-0.6250883131874413L1.2786976255525626,-0.5420534798742441L0,0L0,0L0,0L0,0L0,0L0.20657738485151375,-0.06337313320413447L0.3349792662581699,-0.09648727805447217L0,0L0,0L0,0L0,0L1.9208411230249547,-0.3781419027529979L0.13452751378452577,-0.024085800888680918L0.42789552099309064,-0.06903101143795952L2.3588715866445487,-0.3389975433481643L2.5327568682670503,-0.31959248088516395L2.334630067142433,-0.2538478956199452L1.4210723504570706,-0.12980733159887037L2.350918318289547,-0.1739969547093891L4.1666542815191905,-0.23634992684559383L1.922726401070951,-0.07588943372152435L1.2025246468622084,-0.02674256264580851L0.9201020388933108,-0.004619696499385032L0.4858540312294964,0.005924504290164091L1.5112970317068992,0.0444564384683424L1.5726264471402362,0.07337185740199806L4.641454896334038,0.2966951089090001L5.672812330166621,0.46079214008885466L7.583617583432372,0.7476076669127465L7.915845443084002,0.9181961306020084L8.616142419988588,1.1500581883463967L8.234200426396136,1.2436948089106876L6.97052762146748,1.1758911037697923L7.7176590953152076,1.4389738423366063L3.614748605701256,0.7385794867567197L6.5725029150102205,1.4612109293524158L9.918386644503942,2.3849563249087886L6.662978407689912,1.7240131930082532L4.083209119530031,1.1318484645913727L4.4932193369663915,1.3291996012733784L6.215015198153363,1.9555034212910594L6.411526370914067,2.1393025538634802L4.638167346059372,1.6368474238896107L4.272061273071315,1.5908584627873739L4.179139771923515,1.638709140787287L7.783167506106283,3.2075547650542036L20.165015341758462,8.719313408039888L26.59873534294365,12.048855957764417L22.777378538599628,10.79414673687966L25.501884279310445,12.62734290359888L26.33755712936447,13.61057758222497L22.12839724154737,11.922422273948484L27.997523953662988,15.712357880168732L29.736725974271806,17.36815710526086L24.058863766792562,14.613053307291361L16.020932999695216,10.112472825622406L7.204729159950791,4.723011699675341L8.330588082445198,5.668452426758252L10.402536444103093,7.343398098639763L9.012871222197084,6.597748307309913L12.114592824361424,9.192737626886595L12.958943250434423,10.189658115818553L14.21018386322574,11.574841501857806L13.902913146623263,11.728375423478179L15.369424902933828,13.425085487139853L19.672527802439085,17.79002217445387L19.277357608313167,18.045484617164647L18.485420408963687,17.9110477821159L15.510373963580554,15.554937717874916L16.394485055140255,17.01765098433004L16.417748384226982,17.639671134260503L16.05184610586556,17.853116227961813L17.498197203851586,20.148823755564397L19.652158213432156,23.431905208895284L18.73167376371585,23.13169066795493L19.79761348395426,25.327305809356712L19.252791825052697,25.52391517886831L16.69374205636326,22.942341836252567L23.0323516091847,32.82674531968936L18.222569654528893,26.946529342138106L13.387643019550712,20.550562158827717L15.370053328143282,24.505868906933372L13.245837098738225,21.94956865378496L14.497006376712024,24.985237497650242L11.901202804286143,21.349797271911303L12.647520514420716,23.636353440162928L19.304536548129562,37.62006914734359L21.737158410073764,44.21843056056966L21.360074825739,45.4093767986471L14.438721044376718,32.119395623832794L9.840192272815058,22.937681545416172L12.064348079455492,29.514360637194063L9.452681310562037,24.311831450357612L9.961204410871186,26.986123154478765L8.551918363550667,24.45605400471023L4.644498509307525,14.053809438365793L3.679350284548398,11.812039053807995L3.3252790305726494,11.360475621083806L4.140901800973096,15.106783121314612L3.9808614766567523,15.569320122326019L4.390284448996825,18.491227810763114L4.731598817779467,21.574648216568168L5.147531021205634,25.566764472831082L4.131341642247336,22.515974110258817L4.174170029983164,25.18422188767531L4.9517988575112994,33.43394664666297L5.993868785402602,45.909583733555586L5.762068004702431,50.952061759147774L5.034751941043123,52.617531495453605L4.354123897075307,55.579215540532886L2.2861150701684263,37.45112297283267L0.8477046509887637,19.36251293199467L0.6130197239111171,23.093778068531815L0.25298180918423124,27.13048721204651L-0.2565867385699107,32.5204650520069L-0.9961291781070765,39.671681510972746L-1.957446931026828,46.22776155199839L-2.197111512949736,36.86249761462263L-2.366664566304115,30.776790099866094L-3.2740365722062714,34.7420748503692L-3.4125602849109913,30.568801719319595L-4.46725195576965,34.60319162072371L-5.169931416726816,35.25564298921042L-4.837325027608782,29.447069081325303L-5.025746173637142,27.613611633516534L-3.828952563343125,19.15965168055107L-4.507317003355695,20.69381487254515L-6.240883333318906,26.454466166390795L-10.763761224560044,42.350579341553136L-12.600023891840442,46.227240478940445L-14.679162454448717,50.41800715961322L-14.546917481250173,46.93787403734724L-14.748011001735934,44.84187654339398L-18.97426357114336,54.51184036682712L-23.371111376881885,63.59588208968712L-26.57635431144653,68.64446498815822L-22.023439091111392,54.0998482549917L-24.572374697554753,57.50623229814311L-29.837202544788166,66.62923365546322L-32.95107005903094,70.31236660010303L-30.49995758452355,62.26946396768354L-29.65592025805133,57.99719336815857L-26.0755665551638,48.899895916661606L-25.985786570559757,46.77404964887241L-25.17906683147792,43.53927305232416L-23.77689850858593,39.528577545393176L-21.478907119337332,34.355156500715026L-20.063965662967416,30.89579775958235L-23.30357756037969,34.5667986246771L-26.455219256756113,37.8204464270729L-31.042249527147074,42.790500064307864L-32.54420112986525,43.27365622084995L-28.18436658861617,36.16336959875421L-30.37230368170085,37.61687871494779L-30.66412907787927,36.668541943961465L-32.75402346993283,37.82506867763967L-29.3225058790035,32.70720098475874L-26.066272944349013,28.08698843445035L-25.086393547099775,26.1148180754379L-25.192482359642902,25.337454884936296L-21.608346716805432,20.997122015186566L-14.76572953694596,13.861957463764831L-15.818229660437687,14.345851579361305L-24.672018722994334,21.61331116314687L-27.794530831175084,23.515551126197423L-25.852292841254172,21.119632589014127L-20.908546134861805,16.489048817407703L-15.5590267238808,11.841636286511491L-11.485697652787982,8.433279246202963L-12.251300770265383,8.67484423059858L-12.223888836942372,8.34328323074896L-26.369282415340585,17.340339448232026L-29.281456070000633,18.541358064765266L-27.22917168767282,16.592176379514363L-24.15492350202444,14.15453616759269L-26.069725434023034,14.67968270697184L-29.337838053716933,15.86109692220261L-34.99651540089741,18.148963674255178L-55.97305634011808,27.81529694795162L-62.07365139284222,29.52567686126354L-58.093164988021,26.415894311900946L-58.33733682948462,25.32434519272295L-58.64441832230905,24.266677025431022L-84.02531438099108,33.08684886907953L-70.79857301160156,26.480148798404333L-64.91902157260483,23.015235986379047L-70.64273999878489,23.68369099431431L-70.14800810878008,22.182134577409382L-62.1440863091069,18.480666745263466L-64.52125012241098,17.984728671046373L-68.00322870028059,17.699625552232632L-70.88985493542025,17.153649026990387L-67.94282768487345,15.207489606109494L-83.62482986564538,17.21155646827144L-83.23573646012497,15.643066114795973L-89.4084825152504,15.214677599271925L-82.18165334379508,12.533335334428577L-89.2219123721763,12.039382842389637L-99.28924157515783,11.66139859298682L-100.20529355603435,10.023595183529356L-98.16314313565319,8.11537450207386L-101.2464114995938,6.6178076638941805L-95.67265851223584,4.601219044723874L-89.48942790129536,2.760919127899559L-66.02153921996207,0.8997915186872186L-82.04485117699038,-0.29423813556115747L-80.54865128296784,-1.6756938409646003L-102.3272679736469,-3.891815860978304L-120.86579088663814,-6.682081472026049L-111.77975898650651,-8.111869645950225L-113.70771711699035,-10.222134381729372L-99.90409218847634,-10.717738683618414L-99.28895224006949,-12.383967943324608L-119.43268530907342,-16.989048409306147L-114.07010774545309,-18.23470883964668L-127.65654669111355,-22.666675947932426L-114.7476183811632,-22.418583349638595L-108.66591968289204,-23.179129681783383L-104.81317741465644,-24.25082461308323L-109.15730853042831,-27.243695758936557L-97.2633156683812,-26.061626886516052L-79.24893172026553,-22.703761672149298L-74.59203395645814,-22.766077300430283L-61.08903193386471,-19.80059849938971L-71.94876629268401,-24.697006501543754L-82.74617774607678,-30.005173010221338L-67.57636104549621,-25.82897212551496L-75.41114357200686,-30.32136854789268L-83.04839604875497,-35.06463803960471L-72.14651506061034,-31.935859054060725L-77.50231580614764,-35.91458526063717L-77.17596147605362,-37.390301140283725L-62.75605634474298,-31.749345258054767L-60.845417991073866,-32.10990157299893L-75.32393657706788,-41.42375671510714L-72.26119233717833,-41.3751982607543L-81.37226018813071,-48.54980167586849L-75.56419065784065,-46.86679153011575L-76.71470833156089,-49.42887284810402L-75.09754118337707,-50.237028383208255L-77.1197054006248,-53.533990036083225L-66.25372600640254,-47.701870503886866L-73.18613783067742,-54.6302428398538L-67.83338700799013,-52.4768379567084L-64.41475255450369,-51.62870883977181L-59.4990088580636,-49.39462588035053L-65.18264600581895,-56.03610180062628L-48.54872933345447,-43.21163440148061L-50.496058830495215,-46.52717462836162L-42.63013069767478,-40.65836265871864L-40.53613642324668,-40.01613789905027L-44.29366221668654,-45.257165913052496L-47.32293240595651,-50.047391438696096L-45.226336913931256,-49.51013769892283L-44.19967362843265,-50.09121544950375L-35.94157131805657,-42.17396899007116L-19.187564303806493,-23.31610164753953L-17.068420842653886,-21.484291903272094L-19.25015686613761,-25.10593040940355L-25.431977423480422,-34.3779390158522L-26.288824377016407,-36.84625466819113L-21.735234082292244,-31.600677423570122L-30.317786003595604,-45.74574599107108L-32.94774238946858,-51.62221869120241L-38.02738302213496,-61.90544913736442L-28.14596756371556,-47.63901126988846L-25.02585413574465,-44.07309598202837L-25.52366748531335,-46.80839203233076L-24.641884654238353,-47.1026583779723L-25.850752897944705,-51.555011235475924L-24.498082066634446,-51.03121021895074L-32.94366912604274,-71.76473309502413L-37.134217228789474,-84.70964100288492L-35.53103083745641,-85.00244962572623L-34.79930025494134,-87.45286613088054L-31.79978376419572,-84.10095186828651L-23.81994989638386,-66.43143729423426L-28.32857913889715,-83.50249247085853L-23.057138154597553,-72.01565376011133L-15.303982136929559,-50.794552973783915L-12.205976579236053,-43.19018104804796L-9.686537076114812,-36.67627311872654L-6.562800415948848,-26.702400659598077L-5.203000309100257,-22.86060956438976L-1.6844789735135073,-8.038180957976348L-1.4952045368328724,-7.801648675985023L-0.9223973605326719,-5.305316977851199L-0.5412849487520318,-3.465788900772896L-0.7417759651857592,-5.352270816655983L-0.6079977204761718,-5.021202705403852L-0.3511432925177099,-3.387645357178447L-0.38901187985197294,-4.508494542145346L-0.08133671740140465,-1.179376629358413L-0.23380776316965726,-4.523393253550147L-0.33282504009432984,-9.66334208483027L-0.030217264305506593,-1.7551944558752821Z" fill="#4b7bec"><title>Svalbard and Jan Mayen</title></path><path class="FishingCircle__country" d="M0,-0.6459848484545454L0.03931915238369721,-2.283885052460116L0.008683633841192676,-0.2521232306411528L0.06639188639600953,-1.284459536085899L0.6634391281402656,-9.619820269720364L0.1384700789464254,-1.6048137023937459L0.4880205593334257,-4.708165063270108L0.2577597429398216,-2.128731531394546L0.06224344326499165,-0.4491164186372238L0.44369630973937013,-2.8409394149126124L0,0L0.34591292304586824,-1.8048976120706914L0.12994613123941223,-0.6200911582248154L1.4511523390807124,-6.375980217443407L0.8112342665549291,-3.3007102214631363L0.5285039411118462,-2.001081990006282L0.8299977541800784,-2.936901692363767L0.8124058694791438,-2.696408856482795L0.9704810977469708,-3.0311580842110195L0.8564817963965138,-2.5246011952935423L1.0643477799700733,-2.9683585864751714L1.6949258314108533,-4.482573744048388L1.424363801452707,-3.5795172873462615L1.1342740597353613,-2.71357377908615L1.569521484185213,-3.5803528764992527L0.4464445631591122,-0.972538146684784L2.742371064436759,-5.712549819491484L4.928264634099195,-9.828601108271137L2.948021694377476,-5.635107083306221L1.5645076296774314,-2.869183533661554L1.5243356231160252,-2.684511380191444L3.588490464354216,-6.0737701514884606L11.356740748537844,-18.48783904918242L16.29109208914278,-25.52473272988374L15.76647244960958,-23.789634367414617L20.53684232836613,-29.858345544396204L21.890593306344904,-30.681721032324347L17.679061760737316,-23.89785493073694L19.89206539139368,-25.94310336733569L14.736440625909903,-18.548991435171317L13.252361849504,-16.103837415763667L11.248919585611157,-13.199522680218251L16.492708982004583,-18.691084597333322L56.46481574855284,-61.81311584387956L52.64297196458925,-55.673714422576246L51.31084540968539,-52.42699130374222L47.8249154625553,-47.2114163071182L34.4766359611902,-32.881990864718404L42.841217251334086,-39.47398752515381L31.943935944616218,-28.43225147876089L70.33580791738785,-60.46616291606501L73.85612923356845,-61.313557023539055L86.21580484107717,-69.10234859258723L72.54027764786835,-56.118153071339854L61.09051801940429,-45.60139301699271L42.8525053971983,-30.853278546579055L11.152368799274742,-7.741611525583747L10.320777899312573,-6.904156968315261L22.31383347840656,-14.377264304922946L23.30530022381466,-14.454527172560278L19.95178665283264,-11.903998768557704L25.84722570469201,-14.824190519044672L33.44083198181618,-18.42175262923086L39.58835891490766,-20.928248378030045L30.932156161829518,-15.676973586902957L22.838526779810806,-11.085069655647604L23.388278791126424,-10.858516624937147L31.620524113089825,-14.051197115301074L32.16603450837108,-13.63552304359921L15.958515560955234,-6.443220954690157L10.866557898245635,-4.1712807617665355L14.285750394710513,-5.203456249780181L13.631200390067676,-4.7008907529913415L17.817362317303196,-5.80334408825375L19.172134029599597,-5.881564453624321L21.464680068866375,-6.182676848300264L27.397655191557657,-7.383320003156718L29.983802824258838,-7.529124444094699L32.29753713347005,-7.521570587313369L23.430457477276878,-5.033016623507019L17.912786080587797,-3.526358807569576L17.839809938709173,-3.194038884594962L16.31135482376377,-2.631458536407617L20.921140822998847,-3.0066135787943193L19.273191803294228,-2.4319614962508727L20.615219369276424,-2.241524311832264L21.42040473517191,-1.9566389983917083L23.065755880425037,-1.707150456926186L19.047354432026776,-1.0804450099397793L22.226784568469846,-0.8772845129769705L13.291865115857892,-0.29559355516577346L22.335002571697874,-0.1121407505175549L27.3722453390046,0.3337771728104817L26.821276991878225,0.7889769021018311L29.164998334443442,1.36071099580934L17.32290181500138,1.1073295670030485L16.040540351158857,1.3029436699830013L15.875299074418594,1.565017641250371L21.02236140471918,2.438482539448101L40.13332897121378,5.356882623233751L32.565782619078895,4.918740459805494L40.94844149357695,6.907785275427677L35.33748188708002,6.5887481503839265L18.098979207594585,3.6980537879957125L30.363768772818744,6.750528886924556L49.568012773353495,11.919029758985726L61.62217693096496,15.944437984109491L84.384539270774,23.391040824249774L116.46663161925811,34.453559619568885L130.96296400891111,41.20641961711322L90.79764860594891,30.296006022636508L66.9926548469961,23.642259177861867L52.97562218955944,19.72741295002497L41.255551795789714,16.17697744645361L28.70162637701529,11.828351166562143L45.073377076180336,19.489640569333936L42.03864231686323,19.042918372066072L47.87159205830286,22.68623618515554L54.95679187403827,27.212038462514816L48.1432140581008,24.8791847617819L38.414237481205745,20.696969400150206L33.87715741957582,19.012039143895365L29.955545762425004,17.495961910055875L34.987463393244425,21.25094819972652L33.87219508853489,21.380256217506567L29.540035801025134,19.364771610376962L21.3801787904343,14.54789567672276L16.66634500626854,11.76516966683494L23.800300772965407,17.42268254666355L17.966390809677296,13.633171102816311L21.078677661996092,16.57423099696663L25.649506323785,20.892690281582077L17.55998667361319,14.813450531367979L8.89689518117414,7.771375905847041L8.46265188980054,7.652842902861199L4.080497729846452,3.8197433751275773L7.737246924153769,7.496837848131824L7.938356261864431,7.961164413285248L7.585248346237015,7.873568980762588L7.756688038370726,8.333994582312155L10.766279693153752,11.97442595929089L11.642031047940417,13.405565671081101L7.522330016348431,8.96911789426922L5.431595165135748,6.707461424875669L3.5592856049785744,4.5534334253568876L6.495000858888436,8.610587623620738L6.888844797199671,9.4673939288526L6.581061943263169,9.379626015193816L7.485771118425434,11.069544796117606L9.698457041226781,14.887515597733657L7.105174080975541,11.328422932047243L7.631450775243868,12.646014855123967L4.945815276849281,8.523992202286164L9.542996281913961,17.119365104180087L5.188979765145747,9.697439081675691L6.485999303129617,12.639709928545285L7.7399552513489756,15.744867262184604L8.775006045106515,18.654782774098354L9.11231500291622,20.2706354481196L10.093646939909021,23.528489354737324L11.286213171467166,27.610722401004033L11.41638174118898,29.362372383653742L11.760648338301971,31.861037214291652L9.46668690382746,27.072031832348273L7.660799022129078,23.18084705740884L7.790676362236343,25.0108759236033L8.179279493331304,27.94367162205304L8.803408597858146,32.11647868222978L6.910445158755728,27.027047661754885L6.406486393608492,26.98317176187471L6.491498053824848,29.59925224081742L5.440260695212506,27.020694638324173L3.588192359722078,19.55578920124901L3.352558414094951,20.227152795762045L2.787084853554568,18.818059653638358L2.8223921828052907,21.617899037262426L3.077815455246678,27.216104188809712L2.0551743068201223,21.478356845392117L1.6259533292997972,20.754855094661423L0.49785980278501385,8.155936217138056L0.6492604813320914,14.829828350431377L0.3712832545853509,13.987042745136044L0.15427109574455938,16.544470148990683L-0.13011249753132048,16.490793531964854L-0.4401970344240443,17.531216769426077L-0.8972086138777432,21.188797104697013L-1.237631833222796,20.764626752470196L-1.249520860516226,16.249130441652266L-1.1913401245544908,12.641773195474448L-0.7774429252814381,6.964125655478625L-1.1278155499806328,8.736023393175293L-2.171372514008914,14.8073790500977L-2.7632984821986413,16.821495523497752L-3.3361024849155667,18.329982296220734L-4.3409639425952395,21.721699530625195L-2.862668734212625,13.142971036453709L-2.686900707715541,11.389497298439576L-4.007639058947843,15.76826467973005L-4.293157710166601,15.750829965521621L-5.345066993867252,18.35851512657247L-2.458802296040234,7.933705034281818L-2.1202703683327004,6.446760996055691L-2.6014091403687107,7.4736813503660535L-2.758082602928994,7.505107188997165L-4.061673578884197,10.49095773301602L-4.696415415166823,11.536588824834046L-5.381663718741391,12.594598925403334L-5.665252233599919,12.651032355431024L-5.433026589533793,11.59321857005096L-4.6158690826920425,9.423871909582088L-4.470475013100661,8.74277383828375L-3.251286235375305,6.097185200896136L-3.9460379819840314,7.1028127620645485L-3.771923503035791,6.5223547969555495L-6.824578871604361,11.345714204207557L-10.356003662248254,16.5642564848287L-8.86494928721832,13.650824813380549L-7.2008148463398935,10.681154688892358L-6.791065974307031,9.708524596650426L-9.692071455597004,13.360133062564021L-8.490459763472057,11.28966833431594L-9.276377834924373,11.902523305865518L-3.7110372487955026,4.596215010806071L-7.2920247283135575,8.719892677449636L-11.363162081213636,13.12243018057342L-11.478999732702443,12.804019987607209L-9.859419529595879,10.623743674033308L-6.200002918097082,6.454173971611316L-6.961669093176569,7.001730677195441L-8.972077524018653,8.718288769173535L-8.456595165357564,7.938988871301774L-13.769521416385025,12.487839334659823L-8.549244837937286,7.489354274851169L-17.267991575233662,14.60957701357199L-15.090686891797983,12.328104305009235L-7.680756275790062,6.057253544518149L-7.57361339162175,5.764112161372271L-9.504357902749382,6.9784967942531155L-11.172966320047378,7.911302174163808L-12.013068212519109,8.199389891737985L-8.942261147198973,5.880396792176574L-6.09836119739642,3.861553137893365L-5.752770836623398,3.5054679403044178L-6.985525402793187,4.09344587471729L-8.415387765773515,4.738646848058657L-5.414676831184236,2.9273702399123174L-14.897544427433756,7.725768967334523L-16.318212090485886,8.109185823236784L-14.55933916061114,6.9252304919074525L-15.589920471521586,7.088987002026385L-14.008273512676778,6.081017291310562L-12.889123152178744,5.333434922244649L-23.08139843842497,9.088817428952623L-21.10817047496534,7.894897753766509L-19.32349813981547,6.850609559369625L-32.5190150183009,10.902327728881305L-28.579173928968828,9.037278453017516L-29.921000828985726,8.898031620495537L-40.50491823425017,11.290388250442149L-36.96464729872079,9.621019889236612L-31.01480625297192,7.504841159404938L-34.1016293787838,7.6328906523375695L-40.76538445942371,8.39027974946483L-33.07534736667513,6.216078185054665L-27.894584244282967,4.7468326729525305L-16.443471587409586,2.5077561119998246L-13.484588456412537,1.8195768122702312L-16.279034355071264,1.911952446325355L-19.009336419405198,1.9015152414985836L-32.8066395511364,2.712200909704995L-31.044813800645485,2.0291939600733775L-30.11570310934861,1.4483651739881653L-24.84202469422674,0.7664237302946376L-16.994558126607867,0.23161470403185022L-20.7582377204566,-0.07444544144795039L-20.973852051665794,-0.4363295243865958L-23.33685864570415,-0.8875714012627635L-24.792008612415728,-1.3706295237724502L-11.117128336841475,-0.806771250210368L-15.821084299902813,-1.422289127587367L-25.619753521521083,-2.7484942545131132L-35.44255714892842,-4.420627689780854L-26.775875591648024,-3.8088120136532524L-18.016242209449103,-2.8799914155157116L-11.995834015550576,-2.1299783630650087L-16.110760623246794,-3.14760720051358L-21.426551857164817,-4.570419369568641L-33.17101413640825,-7.674840758597736L-33.7900953524835,-8.43339845807853L-28.162756579071434,-7.546187881996464L-21.222616998773535,-6.079996637686466L-18.608804229634778,-5.679553875789709L-8.517756879746123,-2.7608341260646596L-6.650381575203374,-2.2827982391304107L-9.018059466196169,-3.270101917336111L-9.014568881294078,-3.4455399011752093L-9.304716792939857,-3.741247430402642L-11.47201164120322,-4.84370505540851L-13.38104337652802,-5.923156716718293L-23.59977755163277,-10.936140606819839L-18.32977640314382,-8.880431761906436L-27.939348603539703,-14.134986752927794L-19.312888341060535,-10.191974419713038L-15.766484329568001,-8.67064363334683L-17.63119847478028,-10.09524350310808L-24.80918655599978,-14.80210927223455L-22.124843123042158,-13.722378301904559L-21.950043127197,-14.14286665935558L-24.972537211494604,-16.705554415305865L-19.67360109614697,-13.656773707624604L-17.452347274718765,-12.565476085179668L-21.607472381396345,-16.129030692699285L-16.38021491147924,-12.671958773111301L-14.33985744622664,-11.493459115109276L-15.546084866133716,-12.90598046261044L-17.444954380686767,-14.997047519307175L-25.274267445107284,-22.495797925047533L-30.2664915030022,-27.887608818642455L-28.061134105471787,-26.76322470523039L-12.959334483530625,-12.793091831896492L-12.52376160403651,-12.79618637078676L-26.885337696314824,-28.433170795638134L-22.589543769378594,-24.72920645123637L-22.273766520382775,-25.242721179884903L-7.311369610517056,-8.579187384442045L-8.049988545557067,-9.78208323984624L-11.533901272549178,-14.51790438068664L-5.767611656768461,-7.522081918096439L-4.394016477779854,-5.93965730593563L-5.990426820295363,-8.396145412449062L-6.681327842778399,-9.713927401074995L-4.995228914569033,-7.5371754740279515L-3.771589473788469,-5.9092915783989675L-5.068982762199064,-8.251886657065935L-11.224614357563839,-18.998441914268508L-6.46454129883231,-11.38472028158591L-8.79743246581129,-16.133796915141623L-2.846883453390008,-5.441782583941579L-2.240077070581669,-4.467459767926213L-3.6855677645776996,-7.6772942003696745L-3.0260047572734683,-6.591871200476978L-3.7154139548924583,-8.475508729777227L-2.6458920065126397,-6.329883954889583L-3.4172140994216686,-8.587677481671374L-1.7295968088959754,-4.5742681477061105L-4.638517119797352,-12.936356311514725L-4.1526050861818105,-12.24039064025026L-3.029940994242228,-9.463584773264955L-3.6686551391804127,-12.176418930859459L-2.5815370567708587,-9.1346277899508L-1.767267269105388,-6.691429199741696L-0.9105140007177766,-3.704654737671842L-0.29977897717669366,-1.3171496724422835L-0.20761780689056364,-0.9907333532359802L0,0L0,0L0,0L0,0L0,0L0,0L0,0L-0.02606413145122708,-0.37792805611272356L-0.00235025909178028,-0.04546960278705359L-0.02660112577362275,-0.7723450679049167L-0.04913565554974107,-2.8540846495818215Z" fill="#FDA7DF"><title>The United Kingdom</title></path><text class="FishingCircle__month" transform="translate(1.0103336092965664e-14,-165)" style="text-anchor: middle;">Dec</text><text class="FishingCircle__month" transform="translate(82.49999999999999,-142.89419162443238)" style="text-anchor: start;">Jan</text><text class="FishingCircle__month" transform="translate(142.89419162443238,-82.5)" style="text-anchor: start;">Feb</text><text class="FishingCircle__month" transform="translate(165,0)" style="text-anchor: start;">Mar</text><text class="FishingCircle__month" transform="translate(142.89419162443238,82.49999999999997)" style="text-anchor: start;">Apr</text><text class="FishingCircle__month" transform="translate(82.50000000000006,142.89419162443235)" style="text-anchor: start;">May</text><text class="FishingCircle__month" transform="translate(1.0103336092965664e-14,165)" style="text-anchor: middle;">Jun</text><text class="FishingCircle__month" transform="translate(-82.49999999999996,142.89419162443238)" style="text-anchor: end;">Jul</text><text class="FishingCircle__month" transform="translate(-142.89419162443235,82.50000000000006)" style="text-anchor: end;">Aug</text><text class="FishingCircle__month" transform="translate(-165,2.0206672185931328e-14)" style="text-anchor: end;">Sep</text><text class="FishingCircle__month" transform="translate(-142.89419162443244,-82.4999999999999)" style="text-anchor: end;">Oct</text><text class="FishingCircle__month" transform="translate(-82.50000000000007,-142.89419162443235)" style="text-anchor: end;">Nov</text></g><line class="FishingCircle__annotation-line" x1="314" x2="349" y1="297" y2="332"></line></svg><div class="FishingCircle__legend"><div class="FishingCircle__legend__item"><div class="FishingCircle__legend__item__label" title="Svalbard and Jan Mayen"><div class="FishingCircle__legend__item__dot" style="background: rgb(75, 123, 236);"></div><b>Svalbard and Jan Mayen</b></div><div class="FishingCircle__legend__item__value">5,276</div></div><div class="FishingCircle__legend__item"><div class="FishingCircle__legend__item__label" title="The United Kingdom"><div class="FishingCircle__legend__item__dot" style="background: rgb(253, 167, 223);"></div><b>The United Kingdom</b></div><div class="FishingCircle__legend__item__value">3,333</div></div><div class="FishingCircle__legend__item"><div class="FishingCircle__legend__item__label" title="Russia"><div class="FishingCircle__legend__item__dot" style="background: rgb(199, 236, 238);"></div><b>Russia</b></div><div class="FishingCircle__legend__item__value">762</div></div></div></div></div>`
