let React = require('react');
let AutoResponsive = require('..');

let style = {
  height: 100,
  width: 100,
  cursor: 'default',
  color: '#514713',
  borderRadius: 5,
  boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset',
  backgroundColor: '#a28f27',
  borderColor: '#796b1d',
  fontSize: '80px',
  lineHeight: '100px',
  textAlign: 'center',
  fontWeight: 'bold',
  textShadow: '1px 1px 0px #ab9a3c'
};

const buttons = ['margin', 'append', 'remove', 'sort', 'horizontal', 'vertical'];

class SimplestSampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      itemMargin: 10,
      horizontalDirection: 'left',
      verticalDirection: 'top',
      containerHeight: null
    };
    this.frame = 30;
    this.bindClickEventMap();
  }

  bindClickEventMap() {
    buttons.forEach(i => {
      this[`${i}ClickHandle`] = this[`${i}ClickHandle`].bind(this);
    });
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        containerWidth: React.findDOMNode(this.refs.container).clientWidth
      });
    }, false);
  }

  appendClickHandle(e) {
    let arrayList = this.state.arrayList;

    if (arrayList.length === 30) {
      return;
    }
    arrayList.push(this.frame++);
    this.setState({
      arrayList: arrayList
    });
  }

  removeClickHandle() {
    let arrayList = this.state.arrayList;
    arrayList.shift();
    this.setState({
      arrayList: arrayList
    });
  }

  sortClickHandle() {
    this.setState({
      arrayList: this.state.arrayList.reverse()
    });
  }

  marginClickHandle() {
    this.setState({
      itemMargin: this.state.itemMargin === 10 ? 20 : 10
    });
  }

  horizontalClickHandle() {
    this.setState({
      horizontalDirection: this.state.horizontalDirection === 'left' ? 'right' : 'left'
    });
  }

  verticalClickHandle() {
    if (this.state.verticalDirection === 'top') {
      this.setState({
        verticalDirection: 'bottom',
        containerHeight: React.findDOMNode(this.refs.container).clientHeight
      });
    } else {
      this.setState({
        verticalDirection: 'top',
        containerHeight: null
      });
    }
  }

  getAutoResponsiveProps() {
    return {
      horizontalDirection: this.state.horizontalDirection,
      verticalDirection: this.state.verticalDirection,
      itemMargin: this.state.itemMargin,
      containerWidth: this.state.containerWidth || this.props.containerWidth,
      itemClassName: 'item',
      containerHeight: this.state.containerHeight,
      transitionDuration: '.8',
      transitionTimingFunction: 'easeIn'
    };
  }

  renderItems() {
    return this.state.arrayList.map(function(i) {
      return <div className="item" key={i} style={style}>{i}</div>;
    });
  }

  renderButtons() {
    return buttons.map(i => {
      return <button type="button" onClick={this[`${i}ClickHandle`]} className="btn btn-default">{i}</button>;
    });
  }

  render() {
    return (
      <div>
        <div className="btn-group">
          {this.renderButtons()}
        </div>
        <AutoResponsive ref="container" {...this.getAutoResponsiveProps()}>
          {this.renderItems()}
        </AutoResponsive>
      </div>
    );
  }
}

module.exports = SimplestSampleComponent;
