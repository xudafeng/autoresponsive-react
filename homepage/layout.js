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
let HeaderComponent = require('./header');
let FooterComponent = require('./footer');

class LayoutComponent extends React.Component {
  render() {
    return (
      <div>
        <HeaderComponent/>
          {this.props.children}
        <FooterComponent/>
      </div>
    );
  }
}

module.exports = LayoutComponent;
