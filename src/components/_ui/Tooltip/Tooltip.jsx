import React, { Component } from "react"
import ReactDOM from "react-dom"
import _ from "lodash"
import PropTypes from "prop-types";
import { areEqual } from 'utils/utils';
import Icon from 'components/_ui/Icon/Icon';

import './Tooltip.scss';

const placements = [ 'top', 'bottom', 'left', 'right' ];

class Tooltip extends Component {
    constructor(props) {
        super(props)

        // for perf, see https://github.com/facebook/react/issues/9851
        this.onScroll     = this.onScroll.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.setOffset    = this.setOffset.bind(this)

        this.state = {
            isShowing: false,
            isRendered: false,
            isUnmounting: false,
            top: 0,
            left: 0,
            arrowXOffset: 0
        };
    }

    elem = React.createRef();
    contents = React.createRef();

    static propTypes = {
        contents: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
        placement: PropTypes.oneOf(placements),
        isExternallyControlled: PropTypes.bool,
        onClose: PropTypes.func,
        isKeptOnScroll: PropTypes.bool,
        iteration: PropTypes.number, // for triggering updates
    };

    static defaultProps = {
        placement: 'top',
        isExternallyControlled: false,
        isKeptOnScroll: false
    };

    getClassName() {
        return ['Tooltip', this.props.className].join(" ");
    }

    componentDidMount() {
        if (this.props.isExternallyControlled) {
            this.setState({ isShowing: true, isRendered: true }, this.setOffset);
            return;
        }
        this.setOffset();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        if (areEqual(prevProps, this.props, [ "contents", "placement", "isKeptOnScroll" ])) return;
        this.throttledSetOffset();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !areEqual(nextProps, this.props, [ "contents", "placement", "isKeptOnScroll", "children", "iteration" ]) ||
               !areEqual(nextState, this.state, [ "isShowing", "isRendered", "isUnmounting", "top",  "left",  "arrowXOffset" ])
    }

    onScroll(e) {
        this.onMouseLeave();
    }

    onMouseEnter() {
        const { isKeptOnScroll } = this.props;
        if (this.timeout) {
            this.timeout = null
            window.clearTimeout(this.timeout)
        }

        this.setState({ isRendered: true }, () => {
            this.setState({ isShowing: true }, this.throttledSetOffset);
        });
        if (!isKeptOnScroll) {
            window.addEventListener('scroll', this.onScroll, {
                passive: true
            });
        }
    };

    onMouseLeave() {
        if (this.props.isExternallyControlled) return;
        this.setState({ isUnmounting: true }, () => {
            this.timeout = window.setTimeout(this.unmount, 300)
        });
        window.removeEventListener('scroll', this.onScroll);
    };

    unmount = () => {
        if (this.props.isExternallyControlled) return;
        this.setState({ isUnmounting: false, isShowing: false, isRendered: false });
        this.timeout = null
    }

    setOffset() {
        if (!(this.state.isShowing && this.state.isRendered)) return;
        if (!this.contents.current || !this.elem.current) return;

        const { placement } = this.props;
        const windowWidth = window.innerWidth;
        const elemRect = this.contents.current.getBoundingClientRect() || {};
        const elemWidth = elemRect.width;
        const position = this.elem.current.getBoundingClientRect();
        const leftBuffer = 10;
        const rightBuffer = 30;
        const defaultLeft = position.left + position.width / 2;
        const translateXOffset = _.includes(["top", "bottom"], placement) ? elemWidth / 2 : 0;

        const left =
            placement == 'left' ? position.left - elemWidth :
            placement == 'right' ? position.left + position.width :
            defaultLeft;
        const boundedLeft = _.max([ leftBuffer + translateXOffset, _.min([ windowWidth - rightBuffer - translateXOffset, left ]) ]);
        const top = placement == 'top'    ? position.top :
                    placement == 'bottom' ? position.top + position.height + 8 :
                                            position.top + position.height / 2;

        const maxArrowMovement = elemWidth / 2 - 10;
        const arrowXOffset =
            _.includes([ 'top', 'bottom' ], placement) &&
            _.max([ -maxArrowMovement, _.min([ maxArrowMovement, left - boundedLeft ]) ]);
        this.setState({ left: boundedLeft, top, arrowXOffset });
    };
    throttledSetOffset = _.throttle(this.setOffset, 100);

    render() {
        const { isExternallyControlled, contents, placement, isKeptOnScroll, onClose, className, ...props } = this.props;
        const { top, left, arrowXOffset, isShowing, isRendered, isUnmounting } = this.state;
        const portal = document.getElementById('app-tooltip-portal');

        return (
            <div
                {...props}
                className={this.getClassName()}
                ref={this.elem}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {contents && portal && isRendered &&
                    ReactDOM.createPortal(
                        <div
                            className={[
                                'Tooltip__contents',
                                `Tooltip__contents--${placement}`,
                                `Tooltip__contents--is-${
                                    isUnmounting ? "unmounting" :
                                    isExternallyControlled || isShowing
                                        ? "showing"
                                        : "hidden"
                                }`,
                                ..._.map((className || "").split(" "), d => `${d}__contents`)
                            ].join(" ")}
                            ref={this.contents}
                            style={{
                                left: `${left}px`,
                                top: `${top}px`
                            }}
                        >
                            <div
                                className="Tooltip__contents__arrow"
                                style={{
                                    marginLeft: arrowXOffset - 10,
                                }}
                            />
                            {!!onClose && (
                                <div
                                    className="Tooltip__contents__close"
                                    onClick={onClose}
                                >
                                    <Icon name="x" size="s" />
                                </div>
                            )}
                            {contents}
                        </div>,
                        portal
                    )}
                {this.props.children}
            </div>
        );
    }
}

export default Tooltip;
