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

const AutoResponsive = require('..');
const React = require('react/addons');

const utils = require('./utils');

describe('AutoResponsive Test Suite - Basic', function() {
  const renderer = utils.renderer();

  const props = {
    itemClassName: 'item',
    containerWidth: 300,
    prefixClassName: 'extra-cls'
  };

  const itemStyle = {
    width: 100,
    height: 100
  };

  const tempString = '*******';

  renderer.render(
    <AutoResponsive {...props}>
      {
        tempString.split('*').map(i => {
          return <p style={itemStyle}></p>;
        })
      }
    </AutoResponsive>
  );

  const component = renderer.getRenderOutput();

  it('render container class', function() {
    component.props.className.indexOf(props.prefixClassName).should.be.exactly(0);
  });

  it('render container style', function() {
    const style = component.props.style;
    style.position.should.be.equal('relative');
    style.height.should.be.equal(Math.ceil(tempString.length / (props.containerWidth / itemStyle.width)) * itemStyle.height);
  });

  it('render children', function() {
    const children = component.props.children;
    children.should.be.an.Object();

    const child = children['.0'];
    child.type.should.equal('p');

    const style = child.props.style;
    style.width.should.equal(itemStyle.width);
    style.height.should.equal(itemStyle.height);
    style.Transform.should.equal('translate3d(0px, 0px, 0)');
    style.position.should.equal('absolute');
  });
});
