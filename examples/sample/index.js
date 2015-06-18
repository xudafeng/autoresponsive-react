'use strict';

var methods = {
  doSth: function() {
    console.log(this);
  }
};

var Component1 = React.createClass({
  getInitialState: function() {
    return {
      dongxi: 'dongxi'
    };
  },
  getDefaultProps: function() {
    return {
      width: 100,
      height: 100
    };
  },
  componentWillMount: function() {
    console.log('componentWillMount');
  },
  componentDidMount: function() {
    var props = this.props;
    //console.log(props)
    console.log('componentDidMount')
    //console.log($(this.getDOMNode()))
    this.getData();
  },
  componentWillReceiveProps: function(nextProps) {
    var props = this.props;
    console.log($(this.getDOMNode()))
  },
  getData: function() {
    setTimeout(function() {
      this.setState({
        dongxi: '123'
      });
    }.bind(this), 3000);
  },
  render: function() {
    return <div className="con text">{this.state.dongxi}</div>;
  }
});

React.render(<Component1 />, $('.content')[0]);
