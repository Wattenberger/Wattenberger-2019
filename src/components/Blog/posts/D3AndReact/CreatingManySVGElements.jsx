import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import * as d3 from "d3";
import { format, range } from "d3";
import { times } from "lodash";

import { useInterval } from "utils/utils.js";
import Aside from "components/_ui/Aside/Aside";
import Button from "components/_ui/Button/Button";
import Code from "components/_ui/Code/Code";
import Expandy from "components/_ui/Expandy/Expandy";
import Link from "components/_ui/Link/Link";
import List from "components/_ui/List/List";
import { P, Blockquote, CodeAndExample } from "./examples";

const CreatingManySVGElements = () => {
  const [dataset, setDataset] = useState(generateDataset());

  return (
    <div className="CreatingManySVGElements">
      <p>
        One of the core concepts of d3.js is <b>binding data to DOM elements</b>
        .
        <Aside>
          If you're unfamiliar with d3.s data binding concept, I'd recommend
          reading up on it{" "}
          <Link to="https://observablehq.com/@d3/selection-join">
            on Observable
          </Link>{" "}
          or getting a full rundown with{" "}
          <Link to="https://newline.co/fullstack-d3">
            Fullstack Data Visualization and D3
          </Link>
          .
        </Aside>
      </p>

      <p>
        Let's generate a dataset of 10 random <P>[x, y]</P> coordinates.
      </p>

      <Expandy trigger="How are we generating this data?">
        <p>
          We've created a <P>generateDataset()</P> function that outputs an
          array of 10 arrays.
        </p>

        <CodeAndExample
          code={generateDatasetCode}
          hasLineNumbers={false}
          example={(getHighlightedMarkerProps) => (
            <>
              <Button
                style={{
                  position: "absolute",
                  right: "2em",
                  top: "14.5em",
                }}
                onClick={() => setDataset(generateDataset())}
              >
                Re-generate data
              </Button>

              <div
                style={{
                  paddingTop: "2em",
                  fontFamily: "monospace",
                  whiteSpace: "pre-line",
                  fontSize: "0.9em",
                  lineHeight: "1.4em",
                  padding: "1em 1.6em",
                  margin: "0 -1.6em",
                  background: "white",
                }}
              >
                <div>[</div>
                {dataset.map(([x, y], i) => (
                  <div
                    key={i}
                    style={{
                      paddingLeft: "1em",
                    }}
                  >
                    [
                    <span
                      style={{
                        display: "inline-block",
                        width: "4em",
                        textAlign: "right",
                      }}
                    >
                      {format(".2f")(x)}
                    </span>
                    ,
                    <span
                      style={{
                        display: "inline-block",
                        width: "4em",
                        textAlign: "right",
                      }}
                    >
                      {format(".2f")(y)}
                    </span>
                    ],
                  </div>
                ))}
                <div>]</div>
              </div>
            </>
          )}
        />
        <div className="D3AndReact__side-by-side">
          <div className="D3AndReact__side-by-side__section">
            <Code doWrap={false} hasLineNumbers={false} markers={[]}>
              {generateDatasetCode}
            </Code>
          </div>
        </div>
      </Expandy>

      <p>
        What would it look like if we drew a <P>{`<circle>`}</P> at each of
        these locations? Starting with the naive d3 code:
      </p>

      <CodeAndExample
        code={CirclesWithD3Code}
        markers={[[9, 10, 11], [15], [17, 18, 19, 20]]}
        fileName="Circles.jsx (d3 version)"
        theme="light"
        example={(getHighlightedMarkerProps) => (
          <>
            <br />

            <CirclesWithD3 />

            <p>
              This code looks very similar to our previous code, with two
              changes:
            </p>

            <List
              className="D3AndReact__marked-list"
              items={[
                <div {...getHighlightedMarkerProps(0)}>
                  We're creating a selection of all <P>{`<circle>`}</P> elements
                  and using our d3 selection's{" "}
                  <Link to="https://github.com/d3/d3-selection#selection_join">
                    <P>.join()</P>
                  </Link>{" "}
                  method to add a circle for each data point
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  We're re-running our d3 code whenever <P>dataset</P> changes
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  We're using <P>useInterval()</P> (from the end of{" "}
                  <Link to="/blog/react-hooks">Thinking in React Hooks</Link>)
                  to re-calculate our <P>dataset</P> every two seconds
                </div>,
              ]}
              hasNumbers
            />

            <Aside>
              Note that <P>{`<svg>`}</P>s are, by default, 300px x 150px - in
              this case, we're using the{" "}
              <Link kto="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox">
                <P>viewBox</P>
              </Link>{" "}
              element to re-define our working grid, just so we can use
              friendlier numbers.
            </Aside>

            <br />
            <br />
          </>
        )}
      />

      <p>
        Okay, we're back to our original issues: our code is a bit{" "}
        <b>imperative</b>, <b>verbose</b>, and <b>hacky</b>. What would this
        look like using React to render our <P>{`<circle>`}</P>s?
      </p>

      <CodeAndExample
        code={CirclesWithReactCode}
        markers={[
          [13, 19],
          [14, 15, 16, 17, 18],
        ]}
        fileName="Circles.jsx (React version)"
        example={(getHighlightedMarkerProps) => (
          <>
            <br />

            <CirclesWithReact />

            <p>Much clearer! In this code, we're...</p>

            <List
              className="D3AndReact__marked-list"
              items={[
                <div {...getHighlightedMarkerProps(0)}>
                  Looping over each data point, and
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  rendering a <P>{`<circle`}</P> at <P>[x, y]</P>
                </div>,
              ]}
              hasNumbers
            />

            <br />
            <br />
          </>
        )}
      />

      <Blockquote source="you, probably">
        But d3 is great at animating enter and exit transitions!
      </Blockquote>

      <p>
        We all know that d3 is great at keeping track of what elements are new
        and animating elements in and out. And if you don't you should{" "}
        <Link to="https://newline.co/fullstack-d3">read a book</Link>.
      </p>

      <p>Let's look at an example with transitions:</p>

      <CodeAndExample
        code={TransitionsWithD3Code}
        markers={[d3.range(16, 29), d3.range(29, 32), d3.range(32, 41)]}
        fileName="Transitions.jsx (d3 version)"
        theme="light"
        size="s"
        example={(getHighlightedMarkerProps) => (
          <>
            <br />

            <TransitionsWithD3 />

            <p>Wow, this is a lot of code!</p>

            <p>
              <b>Don't feel the need to run through all of it</b> -- the gist is
              that we have 6 <P>{`<circle>`}</P>s, and every two seconds, we
              randomly choose some of them to show up.
            </p>

            <List
              className="D3AndReact__marked-list"
              items={[
                <div {...getHighlightedMarkerProps(0)}>
                  circles that are new are animated in in{" "}
                  <span style={{ color: "cornflowerblue", fontWeight: 600 }}>
                    blue
                  </span>
                  ,
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  circles that stay for multiple rounds turn{" "}
                  <span style={{ color: "lightgrey", fontWeight: 600 }}>
                    grey
                  </span>
                  ,
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  circles that aren't in the new round are animated out in{" "}
                  <span style={{ color: "tomato", fontWeight: 600 }}>red</span>,
                </div>,
              ]}
              hasNumbers
            />

            <br />
          </>
        )}
      />

      <p>
        Okay, so we can see that this code is hard to scan, but how would we
        implement this using React?
      </p>

      <CodeAndExample
        code={TransitionsWithReactCode}
        markers={[
          d3.range(12, 19),
          [23],
          [24, 26, 27, 28],
          d3.range(30, 37),
          [39],
        ]}
        fileName="Transitions.jsx (d3 version)"
        // size="s"
        example={(getHighlightedMarkerProps) => (
          <>
            <br />

            <TransitionsWithReact />

            <p>
              Animating elements <i>out</i> is not very straightforward in
              React, so let's keep all of the <P>{`<circle>`}</P>s rendered, and
              give them an <P>opacity</P> if they're not in the currently shown
              circles.
            </p>

            <p>In this code, we:</p>

            <List
              className="D3AndReact__marked-list"
              items={[
                <div {...getHighlightedMarkerProps(0)}>
                  loop over our <P>allCircles</P> array and create a{" "}
                  <P>{`<AnimatedCircle>`}</P> for each item,
                </div>,
                <div {...getHighlightedMarkerProps(1)}>
                  define a <P>AnimatedCircle</P> component that takes to props:{" "}
                  <P>index</P> (for positioning), and <P>isShowing</P>
                </div>,
                <div {...getHighlightedMarkerProps(2)}>
                  cache the last <P>isShowing</P> value, so we can see whether
                  the <P>{`<circle>`}</P> is entering or exiting
                </div>,
                <div {...getHighlightedMarkerProps(3)}>
                  use the <P>useSpring</P> hook from{" "}
                  <Link to="https://www.react-spring.io">react-spring</Link> to
                  animate the <P>{`<circle>`}</P>'s <b>radius</b> and{" "}
                  <b>opacity</b>
                </div>,
                <div {...getHighlightedMarkerProps(4)}>
                  use <P>animated</P> from{" "}
                  <Link to="https://www.react-spring.io">react-spring</Link> to
                  animate our <P>{`<circle>`}</P>'s and spread our animated
                  values as element attributes
                </div>,
              ]}
              hasNumbers
            />

            <br />
          </>
        )}
      />

      <p>
        While this code isn't necessarily much <i>shorter</i> than the d3 code,
        it is a lot easier to read.
      </p>
    </div>
  );
};

export default CreatingManySVGElements;

const generateDataset = () =>
  Array(10)
    .fill(0)
    .map(() => [Math.random() * 80 + 10, Math.random() * 35 + 10]);
const generateDatasetCode = `const generateDataset = () => (
  Array(10).fill(0).map(() => ([
    Math.random() * 80 + 10,
    Math.random() * 35 + 10,
  ]))
)`;

const CirclesWithD3 = () => {
  const [ref, isInView] = useIsInView();
  const [dataset, setDataset] = useState(generateDataset());

  useInterval(
    () => {
      setDataset(generateDataset());
    },
    isInView ? 2000 : null
  );

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement
      .selectAll("circle")
      .data(dataset)
      .join("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 3);
  }, [dataset]);

  return <svg viewBox="0 0 100 50" width="100%" ref={ref} />;
};
const CirclesWithD3Code = `const Circles = () => {
  const [dataset, setDataset] = useState(
    generateDataset()
  )
  const ref = useRef()

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement.selectAll("circle")
      .data(dataset)
      .join("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r",  3)
  }, [dataset])

  useInterval(() => {
    const newDataset = generateDataset()
    setDataset(newDataset)
  }, 2000)

  return (
    <svg
      viewBox="0 0 100 50"
      ref={ref}
    />
  )
}`;

const useIsInView = (margin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin: margin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.unobserve(ref.current);
    };
  }, []);
  return [ref, isIntersecting];
};

const CirclesWithReact = () => {
  const [ref, isInView] = useIsInView();
  const [dataset, setDataset] = useState(generateDataset());

  useInterval(
    () => {
      setDataset(generateDataset());
    },
    isInView ? 2000 : null
  );

  return (
    <svg viewBox="0 0 100 50" width="100%" ref={ref}>
      {dataset.map(([x, y], i) => (
        <circle cx={x} cy={y} r="3" />
      ))}
    </svg>
  );
};
const CirclesWithReactCode = `const Circles = () => {
  const [dataset, setDataset] = useState(
    generateDataset()
  )

  useInterval(() => {
    const newDataset = generateDataset()
    setDataset(newDataset)
  }, 2000)

  return (
    <svg viewBox="0 0 100 50">
      {dataset.map(([x, y], i) => (
        <circle
          cx={x}
          cy={y}
          r="3"
        />
      ))}
    </svg>
  )
}`;

const allCircles = range(0, 6);
const generateCircles = () => allCircles.filter(() => Math.random() < 0.5);
const TransitionsWithD3 = () => {
  const [ref, isInView] = useIsInView();
  const [dataset, setDataset] = useState(generateCircles());

  useInterval(
    () => {
      setDataset(generateCircles());
    },
    isInView ? 2000 : null
  );

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement
      .selectAll("circle")
      .data(dataset, (d) => d)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("cx", (d) => d * 15 + 10)
            .attr("cy", 10)
            .attr("r", 0)
            .attr("fill", "cornflowerblue")
            .call((enter) =>
              enter
                .transition()
                .duration(1200)
                .attr("cy", 10)
                .attr("r", 6)
                .style("opacity", 1)
            ),
        (update) => update.attr("fill", "lightgrey"),
        (exit) =>
          exit
            .attr("fill", "tomato")
            .call((exit) =>
              exit
                .transition()
                .duration(1200)
                .attr("r", 0)
                .style("opacity", 0)
                .remove()
            )
      );
  }, [dataset]);

  return <svg viewBox="0 0 100 20" width="100%" ref={ref} />;
};
const TransitionsWithD3Code = `const AnimatedCircles = () => {
  const [visibleCircles, setVisibleCircles] = useState(
    generateCircles()
  )
  const ref = useRef()

  useInterval(() => {
    setVisibleCircles(generateCircles())
  }, 2000)

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement.selectAll("circle")
      .data(visibleCircles, d => d)
      .join(
        enter => (
          enter.append("circle")
              .attr("cx", d => d * 15 + 10)
              .attr("cy", 10)
              .attr("r", 0)
              .attr("fill", "cornflowerblue")
            .call(enter => (
              enter.transition().duration(1200)
                .attr("cy", 10)
                .attr("r", 6)
                .style("opacity", 1)
            ))
        ),
        update => (
          update.attr("fill", "lightgrey")
        ),
        exit => (
          exit.attr("fill", "tomato")
            .call(exit => (
              exit.transition().duration(1200)
                .attr("r", 0)
                .style("opacity", 0)
                .remove()
            ))
        ),
      )
  }, [dataset])

  return (
    <svg
      viewBox="0 0 100 20"
      ref={ref}
    />
  )
}`;

const TransitionsWithReact = () => {
  const [ref, isInView] = useIsInView();
  const [dataset, setDataset] = useState(generateCircles());

  useInterval(
    () => {
      setDataset(generateCircles());
    },
    isInView ? 2000 : null
  );

  return (
    <svg viewBox="0 0 100 20" width="100%" ref={ref}>
      {allCircles.map((d) => (
        <TransitionsWithReactCircle
          key={d}
          index={d}
          isShowing={dataset.includes(d)}
        />
      ))}
    </svg>
  );
};

const TransitionsWithReactCircle = ({ index, isShowing }) => {
  const wasShowing = useRef(false);

  useEffect(() => {
    wasShowing.current = isShowing;
  }, [isShowing]);

  const style = useSpring({
    config: {
      duration: 1200,
    },
    r: isShowing ? 6 : 0,
    opacity: isShowing ? 1 : 0,
  });

  return (
    <animated.circle
      cx={index * 15 + 10}
      cy="10"
      fill={
        !isShowing
          ? "tomato"
          : !wasShowing.current
          ? "cornflowerblue"
          : "lightgrey"
      }
      {...style}
    />
  );
};

const TransitionsWithReactCode = `const AnimatedCircles = () => {
  const [visibleCircles, setVisibleCircles] = useState(
    generateCircles()
  )

  useInterval(() => {
    setVisibleCircles(generateCircles())
  }, 2000)

  return (
    <svg viewBox="0 0 100 20">
      {allCircles.map(d => (
        <AnimatedCircle
          key={d}
          index={d}
          isShowing={visibleCircles.includes(d)}
        />
      ))}
    </svg>
  )
}

const AnimatedCircle = ({ index, isShowing }) => {
  const wasShowing = useRef(false)

  useEffect(() => {
    wasShowing.current = isShowing
  }, [isShowing])

  const style = useSpring({
    config: {
      duration: 1200,
    },
    r: isShowing ? 6 : 0,
    opacity: isShowing ? 1 : 0,
  })

  return (
    <animated.circle {...style}
      cx={index * 15 + 10}
      cy="10"
      fill={
        !isShowing          ? "tomato" :
        !wasShowing.current ? "cornflowerblue" :
                              "lightgrey"
      }
    />
  )
}`;
