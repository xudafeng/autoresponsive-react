## Usage

### Simplest

Simplest example：

```js
var container = document.getElementById('simplest');
var clientWidth = container.clientWidth;
var arrayList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

var SimplestComponent = React.createClass({
  getInitialState: function() {
    return {
      arrayList: arrayList,
      itemMargin: 10,
      horizontalDirection: 'left',
      verticalDirection: 'top',
      containerHeight: 'auto'
    }
  },
  render: function() {
    return (
      <AutoResponsive horizontalDirection={this.state.horizontalDirection}  verticalDirection={this.state.verticalDirection} itemMargin={this.state.itemMargin} containerWidth={clientWidth} containerHeight={this.state.containerHeight}  itemSelector='item'>
      {
        this.state.arrayList.map(function(i) {
          return <div className='item' style={style}>{i}</div>;
        })
      }
      </AutoResponsive>
    );
  }
});

var simplestComponent = React.renderComponent(
  <SimplestComponent/>,
  container
);
```

### waterfall

The completion of a waterfall layout becomes very simple

```js
var container = document.getElementById('waterfall');
var clientWidth = container.clientWidth;
var arrayList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var styleList = {};
arrayList.map(function(i) {
  styleList[i] = getItemStyle();
});

var clickHandle = function(e) {
  var nodes = e.target.parentNode.childNodes;
  for (var i = 0; i < nodes.length; i ++) {
    if (nodes[i] === e.target) {
      styleList[i].width = styleList[i].width === '370px' ? '180px' : '370px';
      waterfallComponent.setState({
        styleList: styleList
      });
    }
  }
}

var WaterfallComponent = React.createClass({
  getInitialState: function() {
    return {
      styleList: styleList
    }
  },
  render: function() {
    return (
      <AutoResponsive  itemMargin={10} containerWidth={clientWidth} itemSelector='item'>
      {
        arrayList.map(function(i) {
          return <div onClick={clickHandle} className='item' style={this.state.styleList[i]}>{i}</div>;
        }, this)
      }
      </AutoResponsive>
    );
  }
});

var waterfallComponent = React.renderComponent(
  <WaterfallComponent/>,
  container
);

```

### drag

### loader

[example-link](http://xudafeng.github.io/autoResponsive/demo/loader/)

