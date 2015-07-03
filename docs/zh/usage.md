## Usage

### Simplest

简单的例子：

```js
class SimplestSampleComponent extends React.Component {

  ...

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
```

### waterfall

实现一个流式布局变得非常容易

```js
class WaterfallSampleComponent extends React.Component {

  ...

  render() {
    return (
      <AutoResponsive ref="container" {...this.getAutoResponsiveProps()}>
        {
          arrayList.map(function(i) {
            return <div onClick={this.clickItemHandle} className="item" style={this.state.styleList[i]}>{i}</div>;
          }, this)
        }
      </AutoResponsive>
    );
  }
}

```

### example

[点击查看例子](./examples)
