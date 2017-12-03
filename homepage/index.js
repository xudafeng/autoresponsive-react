let React = require('react');
let ReactDOM = require('react-dom');

let Utils = require('./utils');
let LayoutComponnet = require('./layout');
let MarkdownComponent = require('./markdown');
let SimplestSampleComponent = require('./simplest');
let WaterfallSampleComponent = require('./waterfall');

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
  }

  bindEventMapContext() {
    events.forEach(i => {
      this[i] = this[i].bind(this);
    });
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

    ReactDOM.render(<SimplestSampleComponent {...commonProps} />, simplestElem);
    ReactDOM.render(<WaterfallSampleComponent {...commonProps} />, waterfallElem);
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
    return this.state.documentsList.map(function(d, i) {
      return <MarkdownComponent key={i} ref={d.name}>{d.data}</MarkdownComponent>;
    });
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
  locale: Utils.getUrlParams('locale') || 'en'
};

ReactDOM.render(<HomePage />, document.querySelector('#app'));
