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
let Markdown = require('marked');
let Highlight = require('highlight.js');

const events = ['clickHandler'];

Markdown.setOptions({
  highlight: function(code) {
    return Highlight.highlightAuto(code).value;
  }
});

class MarkdownComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      classNames: ['markdown']
    };
    this.bindEventMapContext();
  }

  bindEventMapContext() {
    events.forEach(i => {
      this[i] = this[i].bind(this);
    });
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        classNames: ['markdown', 'fadeIn']
      });
    }, 0);
  }

  clickHandler(e) {
    var target = e.target;
    var nodeName = target.nodeName;

    if (nodeName !== 'H2' && nodeName !== 'H3') {
      return;
    }

    if (target.id) {
      location.href = location.href.split('#')[0] + '#' + target.id;
    }
  }

  getClassNames() {
    return this.state.classNames.join(' ');
  }

  render() {
    return (
      <div onClick={this.clickHandler} className={this.getClassNames()} dangerouslySetInnerHTML = {
        {
          __html: Markdown(this.props.children)
        }
      }></div>
    );
  }
}

module.exports = MarkdownComponent;
