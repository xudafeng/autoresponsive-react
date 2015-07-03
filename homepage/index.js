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
const events = ['i18nClickHandler'];

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentsList: [],
      locale: this.props.locale
    };
    this.bindEventMap();
  }

  bindEventMap() {
    events.forEach(function(i) {
      this[i] = this[i].bind(this);
    }.bind(this));
  }

  componentWillMount() {
    this.getDocumentsData();
  }

  componentDidUpdate() {
    this.mountExamples();

    if (Object.keys(this.refs).length === 3) {
      this.scrollToAnchor();
    }

    if (this.currentLocale && (this.state.locale !== this.currentLocale)) {
      this.getDocumentsData();
    }
  }

  getDocumentsData() {
    let that = this;
    this.currentLocale = this.state.locale;
    let counter = documentsList.length;
    this.setState({
      loading: true
    });

    documentsList.forEach(function(name) {
      Util.ajax(`./docs/${this.currentLocale}/${name}.md`, function(data) {
        let item = that.state.documentsList.slice(0);

        if (item.length === documentsList.length) {
          item.shift();
        }

        item.push({
          name: name,
          data: data
        });

        this.setState({
          documentsList: item
        });

        if (counter === 1) {
          this.setState({
            loading: false
          });
        }
        counter--;
      }.bind(this));
    }.bind(this));
  }

  scrollToAnchor() {
    let hash = location.hash;
    if (hash) {
      location.href = location.href.split('#')[0] + hash;
    }
  }

  mountExamples() {
    let simplestElem = document.getElementById('simplest');

    if (!simplestElem) {
      return;
    }

    let waterfallElem = document.getElementById('waterfall');
    let commonProps = {
      containerWidth: Util.width(simplestElem)
    };

    React.render(<SimplestSampleComponent {...commonProps} />, simplestElem);
    React.render(<WaterfallSampleComponent {...commonProps} />, waterfallElem);
  }

  getLoadingClass() {
    var arr = ['loading'];

    if (!this.state.loading) {
      arr.push('fadeOut');
    }
    return arr.join(' ');
  }

  renderLoading() {
    return (
      <div className={this.getLoadingClass()}>
      loading ...
      </div>
    );
  }

  renderMarkdown() {
    return this.state.documentsList.map(function(d) {
      return <MarkdownComponent ref={d.name}>{d.data}</MarkdownComponent>;
    });
  }

  getI18nButtonStyle(locale) {
    var arr = ['btn', 'btn-default'];

    if (locale === this.state.locale) {
      arr.push('focus');
    }
    return arr.join(' ');
  }

  i18nClickHandler(e) {
    this.setState({
      locale: e.target.innerHTML
    });
  }

  renderI18n() {
    return (
      <div className="btn-group pull-right i18n-buttons">
        <button type="button" onClick={this.i18nClickHandler} className={this.getI18nButtonStyle('en')}>en</button>
        <button type="button" onClick={this.i18nClickHandler} className={this.getI18nButtonStyle('zh')}>zh</button>
      </div>
    );
  }

  render() {
    return (
      <LayoutComponnet>
        <article className="container">
          {this.renderLoading()}
          {this.renderI18n()}
          {this.renderMarkdown()}
        </article>
      </LayoutComponnet>
    );
  }
}

HomePage.defaultProps = {
  locale: Util.getUrlParams('locale') || 'en'
};

React.render(<HomePage/>, document.body);
