/* ================================================================
 * autoresponsive-react by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Jun 02 2014 20:15:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2014 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

let React = require('react');
let Util = require('./util');
let GridSort = require('./sort');
let AnimationManager = require('./animation');

const noop = function() {};

class AutoResponsive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.sortManager = new GridSort({
      containerWidth: this.props.containerWidth,
      gridWidth: this.props.gridWidth
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.containerWidth !== nextProps.containerWidth) {
      this.sortManager = new GridSort({
        containerWidth: nextProps.containerWidth,
        gridWidth: nextProps.gridWidth
      });
    }
  }

  setPrivateProps() {
    this.privateProps = {
      containerHeight: 0,
      containerStyle: {
        position: 'relative'
      }
    };

    if (this.props.containerHeight === 'auto') {
    } else {
      this.privateProps.containerStyle.height = this.props.containerHeight;
    }

    if (this.props.verticalDirection === 'bottom') {

      if (typeof this.props.containerHeight !== 'number') {
        this.privateProps.containerStyle.height = 800;
      } else {
        this.privateProps.containerStyle.height = this.props.containerHeight;
      }
    }
  }

  componentWillUpdate() {
    this.sortManager.init();
  }

  renderChildren() {
    return React.Children.map(this.props.children, function(child, childIndex) {

      if (child.props.className !== this.props.itemClassName) {
        return;
      }

      let childWidth = parseInt(child.props.style.width) + this.props.itemMargin;
      let childHeight = parseInt(child.props.style.height) + this.props.itemMargin;

      let calculatedPosition = this.sortManager.getPosition(childWidth, childHeight);

      let autoSetContainerHeight = this.props.containerHeight === 'auto' && this.props.verticalDirection !== 'bottom';

      if (autoSetContainerHeight) {

        if (calculatedPosition[1] + childHeight > this.privateProps.containerHeight) {
          this.privateProps.containerHeight = calculatedPosition[1] + childHeight;
        }

        if (childIndex + 1 === this.props.children.length) {
          this.privateProps.containerStyle.height = this.privateProps.containerHeight;
        }
      }

      let calculatedStyle = AnimationManager.init(this.props, this.privateProps, {
        position: 'absolute',
        overflow: 'hidden'
      }, calculatedPosition, {
        width: childWidth,
        height: childHeight
      });

      this.props.itemDidLayout(child);
      return React.cloneElement(child, {
        style: Util.extend({}, child.props.style, calculatedStyle)
      });
    }, this);
  }

  getContainerStyle() {
    return this.privateProps.containerStyle
  }

  render() {
    this.setPrivateProps();
    return (
      <div ref="container" className={`${this.props.prefixClassName}-container`} style={this.getContainerStyle()}>
      {this.renderChildren()}
      </div>
    );
  }
}

AutoResponsive.defaultProps = {
  containerWidth: 1024,
  containerHeight: 'auto',
  gridWidth: 10,
  prefixClassName: 'rc-autoresponsive',
  itemClassName: 'item',
  itemMargin: 0,
  horizontalDirection: 'left',
  transitionDuration: 1,
  transitionTimingFunction: 'ease',
  verticalDirection: 'top',
  closeAnimation: false,
  itemDidLayout: noop
};

module.exports = AutoResponsive;
