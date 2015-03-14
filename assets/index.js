/* ================================================================
 * autoresponsive-react by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Jun 02 2014 20:15:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2014 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

+function(global, React, Model, Markdown, undefined) {

  function request(file, success) {
    var api = './docs/zh/' + file + '.md';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', api, true);
    xmlHttp.onreadystatechange = function(d) {
      if (xmlHttp.readyState == 4) {
        var data = xmlHttp.responseText;
        success(data);
      }
    };
    xmlHttp.send(null);
  }

  var MarkdownComponent = React.createClass({
    renderMarkdownContent: function() {
      return marked(this.props.children);
    },
    render: function() {
      return (<div className='markdown' dangerouslySetInnerHTML={
        {
          __html: this.renderMarkdownContent()
        }
      }></div>);
    }
  });


  var LogoComponent = React.createClass({
    mixins: [tweenState.Mixin],
    getInitialState: function() {
      return {
        length: 0
      };
    },
    componentDidMount: function() {
      this.beginTween();
    },
    beginTween: function() {
      this.tweenState('length', {
        easing: tweenState.easingTypes.linear,
        duration: 3500,
        endValue: this.refs.path1.getDOMNode().getTotalLength(),
        onEnd: this.handleTweenEnd
      });
    },
    handleTweenEnd: function() {
      this.setState({
        length: 0
      }, this.beginTween);
    },
    render: function() {
      var length, refs = this.refs, transforms = [];

      if (refs.path1) {
        length = this.getTweeningValue('length');
        transforms = ['path1', 'path2', 'path3'].map(function (ref) {
          var point = refs[ref].getDOMNode().getPointAtLength(length);
          return 'translate3d(' + point.x + 'px,' + point.y + 'px, 0)';
        });
      }

      return (
        React.createElement('div', {class: 'svg-container'},
          React.createElement('svg', {version: '1.1', x: '0px', y: '0px',
             viewBox: '0 0 400 400', 'enable-background': 'new 0 0 400 400'},
            React.createElement('path', {ref: 'path1', fill: 'none', stroke: '#FFFFFF', strokeWidth: '4', d: 'M231.7,200c0,17.4-1.7,88-31.7,88s-31.7-70.6-31.7-88s1.7-88,31.7-88S231.7,182.6,231.7,200z'}),
            React.createElement('path', {ref: 'path2', fill: 'none', stroke: '#FFFFFF', strokeWidth: '4', d: 'M216.1,227.7c-15,8.9-76.6,43.4-91.9,17.6s44.6-63.2,59.6-72.1s76.6-43.4,91.9-17.6S231.1,218.8,216.1,227.7z'}),
            React.createElement('path', {ref: 'path3', fill: 'none', stroke: '#FFFFFF', strokeWidth: '4', d: 'M183.9,227.7c15,8.9,76.6,43.4,91.9,17.6s-44.6-63.2-59.6-72.1s-76.6-43.4-91.9-17.6S168.9,218.8,183.9,227.7z'}),
            React.createElement('circle', {fill: '#FFFFFF', cx: '200', cy: '200', r: '16'}),
            React.createElement('circle', {ref: 'circle1', fill: '#8E4A3A', cx: '0', cy: '0', r: '6',
              style: {
                transform: transforms[0],
                WebkitTransform: transforms[0]
              }
            }),
            React.createElement('circle', {ref: 'circle2', fill: '#8E4A3A', cx: '0', cy: '0', r: '6',
              style: {
                transform: transforms[1],
                WebkitTransform: transforms[1]
              }
            }),
            React.createElement('circle', {ref: 'circle3', fill: '#8E4A3A', cx: '0', cy: '0', r: '6',
              style: {
                transform: transforms[2],
                WebkitTransform: transforms[2]
              }
            })
          )
        )
      );
    }
  });

  var Controller = Model({
    constructor: function() {
      this.init();
    },
    init: function() {
      this.renderLogo();
      this.renderMarkdownDoc();
      this.renderExample();
    },
    renderMarkdownDoc: function() {
      var that = this;
      marked.setOptions({
        highlight: function(code) {
          return hljs.highlightAuto(code).value;
        }
      });

      var requestList = ['option', 'event', 'usage'];

      requestList.forEach(function(name) {
        request(name, function(data) {
          React.render(
            <MarkdownComponent>
            {data}
            </MarkdownComponent>,
            document.getElementById(name)
          );
          if (name === 'usage') {
            that.initSimplestExample();
          }
        });
      });
    },
    renderLogo: function() {
      React.render(<LogoComponent/>, document.getElementById('logo'));
    },
    initSimplestExample: function() {
      var append = true;
      var style = {
        height: '100px',
        width: '100px',
        color: '#514713',
        'border-radius': '5px',
        'box-shadow': '0 1px 0 rgba(255,255,255,0.5) inset',
        'background-color': '#a28f27',
        'border-color': '#796b1d',
        'font-size': '80px',
        'line-height': '100px',
        'text-align': 'center',
        'font-weight': 'bold',
        'text-shadow': '2px 2px 0px #ab9a3c',
        'cursor': 'default'
      };

      var container = document.getElementById('simplest');
      var clientWidth = container.clientWidth;
      var arrayList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      var render = function() {
        React.renderComponent(
          <AutoResponsive itemMargin={10} containerWidth={clientWidth} itemSelector='item'>
            {
              arrayList.map(function(i) {
                return <div className='item' style={style}>{i}</div>;
              })
            }
          </AutoResponsive>,
          container
        );
      }

      render();

    },
    renderExample: function() {
      return;
      var style = {
        background: 'red',
        opacity: '0.2',
        height: '100px',
        width: '60px',
        color: '#fff'
        //right: '-999px',
        //bottom: '-999px'
      };

      var clickHandle = function(e) {
        console.log(e);
      }

      var onLayoutDidComplete = function(i) {
        i.props.style.background = 'blue';
      }

      var resizeHandle = function() {
        var container = document.getElementById('container');
        var clientWidth = container.clientWidth;

        React.render(
          <AutoResponsive onLayoutDidComplete={onLayoutDidComplete}  horizontalDirection={''} itemMargin={10} containerWidth={clientWidth} itemSelector='item'>
            {
              [1, 2, 3, 4,5,6,7,8,1, 3, 4,5,6,7,8,9,0].map(function(i) {
                return <div className='item' onClick={clickHandle} style={style}>{i}</div>;
              })
            }
          </AutoResponsive>,
          container
        );
      }
      resizeHandle();

      global.addEventListener('resize', function() {
        resizeHandle();
      }, false);

    }
  });

  global.controller = new Controller();

}(this, React, Enough.Klass, marked);
