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
let LayoutComponnet = require('./layout');
let SimplestSampleComponent = require('./simplest');
let WaterfallSampleComponent = require('./waterfall');
let MarkdownComponent = require('./markdown');
let Util = require('./util');

const documentsList = ['usage', 'option', 'event'];

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentsList: [],
      loading: 'loading ...'
    };
  }

  componentWillMount() {
    this.getDocumentsData();
  }

  componentDidUpdate() {
    if (this.refs.usage) {
      this.mountExamples();
    }

    if (Object.keys(this.refs).length === 3) {
      this.scrollToAnchor();
    }
  }

  getDocumentsData() {
    let that = this;
    documentsList.forEach(function(name) {
      Util.ajax(`./docs/${that.props.i18n}/${name}.md`, function(data) {
        let item = that.state.documentsList.slice(0);
        item.push({
          name: name,
          data: data
        });
        that.setState({
          documentsList: item
        });
      });
    });
  }

  scrollToAnchor() {
    let hash = location.hash;
    if (hash) {
      location.href = location.href.split('#')[0] + hash;
    }
  }

  mountExamples() {
    if (this.simplestElem) {
      return;
    }

    let simplestElem = this.simplestElem = document.getElementById('simplest');
    let waterfallElem = document.getElementById('waterfall');
    let commonProps = {
      containerWidth: Util.width(simplestElem)
    };

    React.render(<SimplestSampleComponent {...commonProps} />, simplestElem);
    React.render(<WaterfallSampleComponent {...commonProps} />, waterfallElem);
    this.setState({
      loading: ''
    });
  }

  renderLoading() {
    return <div className="loading">{this.state.loading}</div>;
  }

  renderMarkdown() {
    return this.state.documentsList.map(function(d) {
      return <MarkdownComponent ref={d.name}>{d.data}</MarkdownComponent>;
    });
  }

  render() {
    return (
      <LayoutComponnet>
        <article className="container">
          {this.renderLoading()}
          {this.renderMarkdown()}
        </article>
      </LayoutComponnet>
    );
  }
}

HomePage.defaultProps = {
  i18n: Util.getUrlParams('locale') || 'en'
};

React.render(<HomePage/>, document.body);
