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

    this.animationManager = new AnimationManager();
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.containerWidth !== nextProps.containerWidth) {
      this.sortManager.changeProps({
        containerWidth: nextProps.containerWidth
      });
    }
  }

  setPrivateProps() {
    this.containerStyle = {
      position: 'relative',
      height: this.containerHeight || 0
    };

    if (typeof this.props.containerHeight === 'number') {
      this.fixedContainerHeight = true;
      this.containerStyle.height = this.props.containerHeight;
    } else {
      this.fixedContainerHeight = false;
    }
  }

  componentWillUpdate() {
    this.sortManager.init();
  }

  renderChildren() {
    return React.Children.map(this.props.children, function(child, childIndex) {

      if (!~child.props.className.indexOf(this.props.itemClassName)) {
        return;
      }

      let childWidth = parseInt(child.props.style.width) + this.props.itemMargin;
      let childHeight = parseInt(child.props.style.height) + this.props.itemMargin;

      let calculatedPosition = this.sortManager.getPosition(childWidth, childHeight, this.containerStyle.height);

      if (!this.fixedContainerHeight) {

        if (calculatedPosition[1] + childHeight > this.containerStyle.height) {
          this.containerStyle.height = calculatedPosition[1] + childHeight;
        }
      }

      let calculatedStyle = this.animationManager.generate(Util.extend({}, this.props, {
        position: calculatedPosition,
        size: {
          width: childWidth,
          height: childHeight
        },
        containerHeight: this.containerStyle.height
      }));

      this.mixItemInlineStyle(calculatedStyle);

      this.props.onItemDidLayout.call(this, child);

      if (childIndex + 1 === this.props.children.length) {
        this.props.onContainerDidLayout.call(this);
      }

      return React.cloneElement(child, {
        style: Util.extend({}, child.props.style, calculatedStyle)
      });
    }, this);
  }

  mixItemInlineStyle(s) {
    var style = {
      position: 'absolute',
      overflow: 'hidden'
    };
    Util.merge(s, style);
  }

  getContainerStyle() {
    return this.containerStyle
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
  containerHeight: null,
  gridWidth: 10,
  prefixClassName: 'rc-autoresponsive',
  itemClassName: 'item',
  itemMargin: 0,
  horizontalDirection: 'left',
  transitionDuration: 1,
  transitionTimingFunction: 'linear',
  verticalDirection: 'top',
  closeAnimation: false,
  onItemDidLayout: noop,
  onContainerDidLayout: noop
};

module.exports = AutoResponsive;
