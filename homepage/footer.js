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

class FooterComponent extends React.Component {
  render() {
    return (
      <footer>
        <hr/>
        <div className="text-center">
          <br/>
          &copy;&nbsp;<a href="https://github.com/xudafeng">xdf</a> {new Date().getFullYear()}
        </div>
      </footer>
    );
  }
}

module.exports = FooterComponent;
