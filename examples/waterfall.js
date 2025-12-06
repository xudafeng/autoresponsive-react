import React from 'react';
import ForkmeonComponent from '../homepage/forkme';

import './index.less';
import pkg from '../package';
import AutoResponsive from '../src';
import Utils from '../homepage/utils';

const noop = () => {};

class WaterfallExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.containerNodeRef = React.createRef();
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.handleResize();
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  getData() {
    Utils.ajax('./data.json', d => {
      let data = JSON.parse(d).data;
      this.setState({
        data: data
      });
    });
  }

  getForkmeonProps() {
    return {
      classPrefix: pkg.name,
      fixed: true,
      text: 'Fork me on Github',
      linkUrl: pkg.repository.url,
      onDemoUpdateDid: noop,
      flat: true
    };
  }

  getAutoResponsiveProps() {
    return {
      itemMargin: 10,
      containerWidth: this.state.containerWidth || document.body.clientWidth,
      itemClassName: 'item',
      gridWidth: 100,
      transitionDuration: '.5'
    };
  }

  render() {
    if (!this.state.data) {
      return <div>loading...</div>;
    }

    return (
      <div className="albumPanel" ref={this.containerNodeRef}>
        <AutoResponsive {...this.getAutoResponsiveProps()}>
          {
            this.state.data.map((i, index) => {
              let style = {
                width: i.w === 'w1' ? 190 : 390,
                height: i.w === 'w1' ? 240 : 490
              };
              return (
                <a key={index} href="#" className={`${i.w} album item`} style={style}>
                  <img className="a-cont j_ACont" src="images/a.jpg"/>
                  <img className="a-cover" src={i.src}/>
                  <p className="a-mask">{index}<i></i></p>
                  <p className="a-layer">
                    <span className="al-brand">{i.brand}</span>
                    <span className="al-title">{i.title}</span>
                    <span className="al-count">{i.count}件商品</span>
                  </p>
                  <p className="a-more j_ALMore"></p>
                </a>
              );
            })
          }
        </AutoResponsive>
        <ForkmeonComponent {...this.getForkmeonProps()}/>
      </div>
    );
  }

  handleResize() {
    const containerNode = this.containerNodeRef.current;

    if (!containerNode) {
      return;
    }

    this.setState({
      containerWidth: containerNode.clientWidth
    });
  }
}

export default WaterfallExampleComponent;
