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

  function request(file, i18n, success) {

    var api = './docs/' + (i18n || 'zh') + '/' + file + '.md';
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
      this.bind();
      this.renderLogo();
      this.renderMarkdownDoc();
    },
    renderMarkdownDoc: function(i18n) {
      var that = this;
      marked.setOptions({
        highlight: function(code) {
          return hljs.highlightAuto(code).value;
        }
      });

      var requestList = ['usage', 'option', 'event'];

      requestList.forEach(function(name) {
        var node = document.createElement('div');
        node.id = name;
        document.getElementById('page').appendChild(node);
        request(name, i18n, function(data) {
          React.render(
            <MarkdownComponent>
            {data}
            </MarkdownComponent>,
            document.getElementById(name)
          );
          if (name === 'usage') {
            that.emit('startInitExample');
          }
        });
      });
    },
    bind: function() {
      var that = this;
      this.on('startInitExample', function() {
        that.initSimplestExample();
        that.initWaterfallExample();
      });
    },
    renderLogo: function() {
      React.render(<LogoComponent/>, document.getElementById('logo'));
    },
    initSimplestExample: function() {
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
        'text-shadow': '1px 1px 0px #ab9a3c',
        'cursor': 'default'
      };

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

      var simplestComponent = React.render(
        <SimplestComponent/>,
        container
      );

      var buttonListNode = document.createElement('div');
      buttonListNode.id = 'buttonList';
      container.parentNode.insertBefore(buttonListNode, container);

      var appendClickHandle = function(e) {

        if (arrayList.length === 99) {
          return;
        }
        arrayList.push(arrayList.length);
        simplestComponent.setState({
          arrayList: arrayList
        });
      }

      var removeClickHandle = function() {
        arrayList.shift();
        simplestComponent.setState({
          arrayList: arrayList
        });
      }

      var sortClickHandle = function() {
        simplestComponent.setState({
          arrayList: arrayList.reverse()
        });
      }

      var marginClickHandle = function() {
        simplestComponent.setState({
          itemMargin: simplestComponent.state.itemMargin === 10 ? 20 : 10
        });
      }

      var horizontalClickHandle = function() {
        simplestComponent.setState({
          horizontalDirection: simplestComponent.state.horizontalDirection === 'left' ? 'right' : 'left'
        });
      }

      var verticalClickHandle = function() {
        var verticalDirection,
            containerHeight;

        if (simplestComponent.state.verticalDirection === 'top') {
          verticalDirection = 'bottom';
          containerHeight = container.clientHeight;
        } else {
          verticalDirection = 'top';
          containerHeight = 'auto';
        }
        simplestComponent.setState({
          verticalDirection: verticalDirection,
          containerHeight: containerHeight
        });
      }

      var ButtonsComponent = React.createClass({
        render: function() {
          return (
            <div className="btn-group">
              <button type="button" onClick={marginClickHandle} className="btn btn-default">margin</button>
              <button type="button" onClick={appendClickHandle} className="btn btn-default">append</button>
              <button type="button" onClick={removeClickHandle} className="btn btn-default">remove</button>
              <button type="button" onClick={sortClickHandle} className="btn btn-default">sort</button>
              <button type="button" onClick={horizontalClickHandle} className="btn btn-default">horizontal</button>
              <button type="button" onClick={verticalClickHandle} className="btn btn-default">vertical</button>
            </div>
          );
        }
      });

      React.render(
        <ButtonsComponent/>,
        buttonListNode
      );
    },
    initWaterfallExample: function() {
      var getItemStyle = function() {
        var _style = {
          width: '180px',
          height: parseInt(Math.random() * 20 + 15) * 10 + 'px',
          color: '#3a2d5b',
          'border-radius': '5px',
          'box-shadow': '0 1px 0 rgba(255,255,255,0.5) inset',
          'background-color': '#5c439b',
          'border-color': '#796b1d',
          'font-size': '80px',
          'line-height': '100px',
          'text-align': 'center',
          'font-weight': 'bold',
          'text-shadow': '1px 1px 0px #816abe',
          'cursor': 'default'
        };
        return _style;
      }

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

      var waterfallComponent = React.render(
        <WaterfallComponent/>,
        container
      );
    }
  });

  global.controller = new Controller();

}(this, React, Enough.Klass, marked);

