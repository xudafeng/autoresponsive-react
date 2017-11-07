let React = require('react');
let AutoResponsive = require('../lib');

let arrayList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let styleList = {};
let getItemStyle = function() {
  return {
    width: 150,
    height: parseInt(Math.random() * 20 + 12, 10) * 10,
    color: '#3a2d5b',
    cursor: 'default',
    borderRadius: 5,
    boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset',
    backgroundColor: '#5c439b',
    borderColor: '#796b1d',
    fontSize: '80px',
    lineHeight: '100px',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '1px 1px 0px #816abe'
  };
};

const events = ['clickItemHandle'];

arrayList.map(function(i) {
  styleList[i] = getItemStyle();
});

class WaterfallSampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.bindEventMapContext();
    this.state = {
      styleList: styleList
    };
  }

  bindEventMapContext() {
    events.forEach(i => {
      this[i] = this[i].bind(this);
    });
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        containerWidth: React.findDOMNode(this.refs.container).clientWidth
      });
    }, false);
  }

  clickItemHandle(e) {
    let nodes = e.target.parentNode.childNodes;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === e.target) {
        styleList[i].width = styleList[i].width === '310px' ? '150px' : '310px';
        this.setState({
          styleList: styleList
        });
      }
    }
  }

  getAutoResponsiveProps() {
    return {
      itemMargin: 10,
      containerWidth: this.state.containerWidth || this.props.containerWidth,
      itemClassName: 'item',
      transitionDuration: '.8',
      transitionTimingFunction: 'easeIn'
    };
  }

  render() {
    return (
      <AutoResponsive ref="container" {...this.getAutoResponsiveProps()}>
        {
          arrayList.map(i => {
            return <div key={i} onClick={this.clickItemHandle} className="item" style={this.state.styleList[i]}>{i}</div>;
          })
        }
      </AutoResponsive>
    );
  }
}

module.exports = WaterfallSampleComponent;
