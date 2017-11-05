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
let LogoComponent = require('react-logo');
let ForkmeonComponent = require('forkmeon.github.io');
let pkg = require('../package');

const noop = function() {};

class HeaderComponent extends React.Component {
  getForkmeonProps() {
    return {
      classPrefix: pkg.name,
      fixed: true,
      text: 'Fork me on Github',
      linkUrl: pkg.repository.url,
      onDemoUpdateDid: noop,
      flat: true
    };
  }

  render() {
    return (
      <header>
        <div className="container header">
          <div className="logo">
            <LogoComponent pathStrokeColor='#fff' bigCircleFillColor='#8e4a3a'/>
          </div>
          <div className="title">
            <h1>Auto<em>R</em>esponsive <em>R</em>eact</h1>
          </div>
          <div className="description">
            <h1>
              <div className="first">Magic</div>
              <p>Responsive Layout Library For React</p>
            </h1>
            <iframe className="github-btn" src="https://ghbtns.com/github-btn.html?user=xudafeng&repo=autoresponsive-react&type=watch&count=true" title="Star on GitHub"></iframe>
          </div>
        </div>
        <ForkmeonComponent {...this.getForkmeonProps()}/>
      </header>
    );
  }
}

module.exports = HeaderComponent;
