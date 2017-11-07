let React = require('react');

class FooterComponent extends React.Component {
  render() {
    return (
      <footer className="text-center">
        <hr/>
        &copy;&nbsp;<a href="https://github.com/xudafeng">xdf</a> {new Date().getFullYear()}
      </footer>
    );
  }
}

module.exports = FooterComponent;
