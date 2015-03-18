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

'use strict';

let React = require('react/addons');
let Util = require('./util');
let GridSortManager = require('./sort');
let AnimationManager = require('./animation');

let noop = function() {};

let defaultContainerStyle = {
  position: 'relative'
};

class AutoResponsive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        children: []
      }
    };
  }

  setPrivateProps() {
    this.privateProps = {
      autoSetContainerHeight: false,
      containerHeight: 0,
      containerStyle: defaultContainerStyle
    };

    if (this.props.containerHeight === 'auto') {
      this.privateProps.autoSetContainerHeight = true;
    } else {
      this.privateProps.containerStyle.height = this.props.containerHeight;
    }

    if (this.props.verticalDirection === 'bottom') {
      this.privateProps.autoSetContainerHeight = false;

      if (typeof this.props.containerHeight !== 'number') {
        this.privateProps.containerStyle.height = 800;
      } else {
        this.privateProps.containerStyle.height = this.props.containerHeight;
      }
    }
  }

  initGridSortManager() {
    this.sortInstance = new GridSortManager(this.props, this.privateProps);
  }

  renderChildrenGrids() {
    this.initGridSortManager();

    return React.Children.map(this.props.children, function(child, childIndex) {

      let itemWidth = parseInt(child.props.style.width) + this.props.itemMargin;
      let itemHeight = parseInt(child.props.style.height) + this.props.itemMargin;

      let calculatedPositionObject = this.sortInstance.getPosition(itemWidth, itemHeight);

      if (this.privateProps.autoSetContainerHeight) {

        if (calculatedPositionObject[1] + itemHeight > this.privateProps.containerHeight) {
          this.privateProps.containerHeight = calculatedPositionObject[1] + itemHeight;
        }

        if (childIndex + 1 === this.props.children.length) {
          this.privateProps.containerStyle.height = this.privateProps.containerHeight;
        }
      }

      let calculatedStyle = new AnimationManager(this.props, this.privateProps).init({
        position: 'absolute',
        overflow: 'hidden'
      }, calculatedPositionObject, {
        width: itemWidth,
        height: itemHeight
      });

      this.props.onLayoutDidComplete(child);

      return React.addons.cloneWithProps(child, {
        style: Util.merge(child.props.style, calculatedStyle)
      });
    }, this);
  }

  render() {
    this.setPrivateProps();
    return (
      <div className={this.props.prefixClassName} {...this.props} style={this.privateProps.containerStyle}>
      {this.renderChildrenGrids()}
      </div>
    );
  }
}

AutoResponsive.defaultProps = {
  containerWidth: 1024,
  containerHeight: 'auto',
  gridWidth: 10,
  prefixClassName: 'rc-autoresponsive',
  itemSelector: 'rc-autoresponsive-item',
  itemMargin: 0,
  horizontalDirection: 'left',
  verticalDirection: 'top',
  amimationType: 'transform',
  onLayoutDidComplete: noop
};

module.exports = AutoResponsive;
