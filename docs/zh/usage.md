## Usage

### Simplest

如下代码实现：

```js
var style = {
  background: 'red',
  height: '100px',
  width: '100px',
  color: '#fff',
  'border-radius': '5px'
};
var container = document.getElementById('simplest');
var clientWidth = container.clientWidth;

React.render(
  <AutoResponsive itemMargin={10} containerWidth={clientWidth} itemSelector='item'>
    {
      [1, 2, 3, 4,5,6,7,8,9,0].map(function(i) {
        return <div className='item' style={style}>{i}</div>;
      })
    }
  </AutoResponsive>,
  container
);
```

### append remove sort filter

### animation

### direction

### resize

### drag

### event

### mobile media query

### waterfall
