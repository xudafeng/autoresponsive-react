'use strict';

const React = require('react');
const { expect } = require('chai');
const sinon = require('sinon');
const TestRenderer = require('react-test-renderer');

const AutoResponsive = require('../../src/index');

function createChild(key, overrides = {}) {
  return React.createElement('div', Object.assign({
    key,
    className: 'item',
    style: {
      width: '50',
      height: '60',
    },
  }, overrides));
}

describe('AutoResponsive', () => {
  it('respects fixed container height and float layout when container width is not set', () => {
    const onItemDidLayout = sinon.spy();
    const onContainerDidLayout = sinon.spy();

    const instance = new AutoResponsive(Object.assign({}, AutoResponsive.defaultProps, {
      containerHeight: 120,
      itemMargin: 5,
      children: [createChild('one')],
      onItemDidLayout,
      onContainerDidLayout,
    }));

    instance.sortManager = {
      changeProps: sinon.spy(),
      init: sinon.spy(),
      getPosition: sinon.stub().returns([15, 25]),
    };

    instance.animationManager = {
      generate: sinon.stub().callsFake(options => ({
        top: options.position[1],
        left: options.position[0],
      })),
    };

    const tree = instance.render();
    const renderer = TestRenderer.create(tree);
    const container = renderer.root.findByProps({ className: `${instance.props.prefixClassName}-container` });
    const renderedChild = container.findByType('div');

    expect(instance.fixedContainerHeight).to.equal(true);
    expect(instance.containerStyle.height).to.equal(120);
    expect(instance.sortManager.changeProps.calledOnce).to.equal(true);
    expect(instance.sortManager.init.calledOnce).to.equal(true);
    expect(onItemDidLayout.calledOnce).to.equal(true);
    expect(onContainerDidLayout.calledOnce).to.equal(true);

    expect(renderedChild.props.style.float).to.equal('left');
    expect(renderedChild.props.style.margin).to.equal('0 5px 5px 0');
    expect(renderedChild.props.style.position).to.equal(undefined);
    expect(renderedChild.props.style.top).to.equal(25);
    expect(renderedChild.props.style.left).to.equal(15);
  });

  it('accepts string container heights and keeps layout height fixed', () => {
    const onItemDidLayout = sinon.spy();
    const onContainerDidLayout = sinon.spy();

    const instance = new AutoResponsive(Object.assign({}, AutoResponsive.defaultProps, {
      containerHeight: '150px',
      itemMargin: 5,
      children: [createChild('one')],
      onItemDidLayout,
      onContainerDidLayout,
    }));

    instance.sortManager = {
      changeProps: sinon.spy(),
      init: sinon.spy(),
      getPosition: sinon.stub().returns([10, 20]),
    };

    instance.animationManager = {
      generate: sinon.stub().callsFake(options => ({
        top: options.position[1],
        left: options.position[0],
      })),
    };

    const tree = instance.render();
    const renderer = TestRenderer.create(tree);
    const container = renderer.root.findByProps({ className: `${instance.props.prefixClassName}-container` });
    const renderedChild = container.findByType('div');

    expect(instance.fixedContainerHeight).to.equal(true);
    expect(instance.containerStyle.height).to.equal('150px');
    expect(onItemDidLayout.calledOnce).to.equal(true);
    expect(onContainerDidLayout.calledOnce).to.equal(true);

    expect(renderedChild.props.style.float).to.equal('left');
    expect(renderedChild.props.style.margin).to.equal('0 5px 5px 0');
    expect(renderedChild.props.style.position).to.equal(undefined);
  });

  it('calculates dynamic container height, filters items, and uses absolute positioning when width is provided', () => {
    const onItemDidLayout = sinon.spy();
    const onContainerDidLayout = sinon.spy();

    const instance = new AutoResponsive(Object.assign({}, AutoResponsive.defaultProps, {
      containerWidth: 200,
      itemMargin: 10,
      children: [
        createChild('skip', { className: 'skip-me' }),
        createChild('two', { style: { width: '80', height: '70' } }),
      ],
      onItemDidLayout,
      onContainerDidLayout,
    }));

    const positionStub = sinon.stub();
    positionStub.onFirstCall().returns([5, 5]);

    instance.sortManager = {
      changeProps: sinon.spy(),
      init: sinon.spy(),
      getPosition: positionStub,
    };

    instance.animationManager = {
      generate: sinon.stub().callsFake(options => ({
        translateX: options.position[0],
        translateY: options.position[1],
      })),
    };

    const tree = instance.render();
    const renderer = TestRenderer.create(tree);
    const container = renderer.root.findByProps({ className: `${instance.props.prefixClassName}-container` });
    const renderedChild = container.findByType('div');

    expect(instance.fixedContainerHeight).to.equal(false);
    expect(instance.containerStyle.height).to.equal(85);
    expect(instance.sortManager.changeProps.calledOnce).to.equal(true);
    expect(instance.sortManager.init.calledOnce).to.equal(true);
    expect(onItemDidLayout.calledOnce).to.equal(true);
    expect(onContainerDidLayout.calledOnce).to.equal(true);

    expect(renderedChild.props.style.position).to.equal('absolute');
    expect(renderedChild.props.style.float).to.equal(undefined);
    expect(renderedChild.props.style.translateX).to.equal(5);
    expect(renderedChild.props.style.translateY).to.equal(5);
  });

  it('retains existing container height when items fit within bounds', () => {
    const onItemDidLayout = sinon.spy();
    const onContainerDidLayout = sinon.spy();

    const instance = new AutoResponsive(Object.assign({}, AutoResponsive.defaultProps, {
      containerWidth: 150,
      itemMargin: 0,
      children: [createChild('one'), createChild('two')],
      onItemDidLayout,
      onContainerDidLayout,
    }));

    const positionStub = sinon.stub();
    positionStub.onCall(0).returns([0, 0]);
    positionStub.onCall(1).returns([60, 70]);

    instance.containerHeight = 200;

    instance.sortManager = {
      changeProps: sinon.spy(),
      init: sinon.spy(),
      getPosition: positionStub,
    };

    instance.animationManager = {
      generate: sinon.stub().returns({}),
    };

    const tree = instance.render();
    const renderer = TestRenderer.create(tree);
    const container = renderer.root.findByProps({ className: `${instance.props.prefixClassName}-container` });
    const renderedChildren = container.findAllByType('div');

    expect(instance.containerStyle.height).to.equal(200);
    expect(instance.sortManager.changeProps.calledOnce).to.equal(true);
    expect(instance.sortManager.init.calledOnce).to.equal(true);
    expect(onItemDidLayout.callCount).to.equal(2);
    expect(onContainerDidLayout.calledOnce).to.equal(true);

    expect(renderedChildren.length).to.equal(2);
    renderedChildren.forEach(child => {
      expect(child.props.style.position).to.equal('absolute');
      expect(child.props.style.float).to.equal(undefined);
    });
  });

  it('calls layout callbacks when a single, non-array child is provided', () => {
    const onItemDidLayout = sinon.spy();
    const onContainerDidLayout = sinon.spy();

    const instance = new AutoResponsive(Object.assign({}, AutoResponsive.defaultProps, {
      containerWidth: 150,
      itemMargin: 0,
      children: createChild('solo'),
      onItemDidLayout,
      onContainerDidLayout,
    }));

    instance.sortManager = {
      changeProps: sinon.spy(),
      init: sinon.spy(),
      getPosition: sinon.stub().returns([0, 0]),
    };

    instance.animationManager = {
      generate: sinon.stub().returns({ top: 0, left: 0 }),
    };

    const tree = instance.render();
    const renderer = TestRenderer.create(tree);
    const container = renderer.root.findByProps({ className: `${instance.props.prefixClassName}-container` });
    const renderedChild = container.findByType('div');

    expect(onItemDidLayout.calledOnce).to.equal(true);
    expect(onContainerDidLayout.calledOnce).to.equal(true);
    expect(renderedChild.props.style.position).to.equal('absolute');
  });
});
