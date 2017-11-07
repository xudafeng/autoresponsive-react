let React = require('react');
let HeaderComponent = require('./header');
let FooterComponent = require('./footer');

class LayoutComponent extends React.Component {
  render() {
    return (
      <div>
        <HeaderComponent />
        {this.props.children}
        <FooterComponent />
      </div>
    );
  }
}

module.exports = LayoutComponent;
