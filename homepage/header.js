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
            <iframe className="github-btn" src={`//ghbtns.com/github-btn.html?user=xudafeng&repo=${pkg.name}&type=watch&count=true`} title="Star on GitHub"></iframe>
            <a href={`//www.npmjs.com/${pkg.name}`}>
              <span className="version">v{ pkg.version }</span>
            </a>
          </div>
        </div>
        <ForkmeonComponent {...this.getForkmeonProps()}/>
      </header>
    );
  }
}

module.exports = HeaderComponent;
