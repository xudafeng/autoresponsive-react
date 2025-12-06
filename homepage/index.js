import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.less';
import Utils from './utils';
import LayoutComponnet from './layout';
import MarkdownComponent from './markdown';
import SimplestSampleComponent from './simplest';
import WaterfallSampleComponent from './waterfall';

const documentsList = [
  'usage',
  'option',
  'event'
];

const events = [
  'i18nClickHandler'
];

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentsList: [],
      locale: this.props.locale
    };
    this.bindEventMapContext();
    this.exampleRoots = {};
    this.markdownRefs = {};
  }

  bindEventMapContext() {
    events.forEach(i => {
      this[i] = this[i].bind(this);
    });
  }

  componentDidMount() {
    this.getDocumentsData();

    this.mountExamples();
  }

  componentDidUpdate() {
    this.mountExamples();

    if (Object.keys(this.markdownRefs).length === documentsList.length) {
      this.scrollToAnchor();
    }

    if (this.currentLocale && (this.state.locale !== this.currentLocale)) {
      this.getDocumentsData();
    }
  }

  getDocumentsData() {
    this.currentLocale = this.state.locale;
    let counter = documentsList.length;
    this.setState({
      loading: true
    });

    documentsList.forEach(name => {
      Utils.ajax(`./docs/${this.currentLocale}/${name}.md`, data => {
        let item = this.state.documentsList.slice(0);

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
    let simplestElem = document.getElementById('simplest');

    if (!simplestElem) {
      return;
    }

    let waterfallElem = document.getElementById('waterfall');
    let commonProps = {
      containerWidth: Utils.width(simplestElem)
    };

    if (!this.exampleRoots.simplest) {
      this.exampleRoots.simplest = createRoot(simplestElem);
    }

    if (waterfallElem && !this.exampleRoots.waterfall) {
      this.exampleRoots.waterfall = createRoot(waterfallElem);
    }

    this.exampleRoots.simplest.render(<SimplestSampleComponent {...commonProps} />);

    if (this.exampleRoots.waterfall) {
      this.exampleRoots.waterfall.render(<WaterfallSampleComponent {...commonProps} />);
    }
  }

  getLoadingClass() {
    let arr = ['loading'];

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
    return this.state.documentsList.map((d, i) => (
      <MarkdownComponent
        key={i}
        ref={node => {
          if (node) {
            this.markdownRefs[d.name] = node;
          } else {
            delete this.markdownRefs[d.name];
          }
        }}
      >
        {d.data}
      </MarkdownComponent>
    ));
  }

  getI18nButtonStyle(locale) {
    let arr = ['btn', 'btn-default'];

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
      <div className="i18n-buttons">
        <div className="btn-group pull-right">
          <button type="button" onClick={this.i18nClickHandler} className={this.getI18nButtonStyle('en')}>en</button>
          <button type="button" onClick={this.i18nClickHandler} className={this.getI18nButtonStyle('zh')}>zh</button>
        </div>
      </div>
    );
  }

  renderExamples() {
    return (
      <section className="examples">
        <h2 id="examples">Examples</h2>
        <div id="simplest" className="example" />
        <div id="waterfall" className="example" />
      </section>
    );
  }

  render() {
    return (
      <LayoutComponnet>
        <article className="container">
          {this.renderLoading()}
          {this.renderI18n()}
          {this.renderExamples()}
          {this.renderMarkdown()}
        </article>
      </LayoutComponnet>
    );
  }
}

HomePage.defaultProps = {
  locale: Utils.getUrlParams('locale') || 'en'
};

const container = document.querySelector('#app');
const root = createRoot(container);
root.render(<HomePage />);
