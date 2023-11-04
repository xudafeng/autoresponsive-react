const React = require('react');
const Core = require('autoresponsive-core');

const {
  GridSort,
} = Core;

const AnimationManager = require('./animation');

class AutoResponsive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.sortManager = new GridSort({
      containerWidth: this.props.containerWidth,
      gridWidth: this.props.gridWidth,
    });

    this.animationManager = new AnimationManager();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.containerWidth !== nextProps.containerWidth) {
      this.sortManager.changeProps({
        containerWidth: nextProps.containerWidth,
      });
    }
  }

  setPrivateProps() {
    this.containerStyle = {
      position: 'relative',
      height: this.containerHeight || 0,
    };

    if (typeof this.props.containerHeight === 'number') {
      this.fixedContainerHeight = true;
      this.containerStyle.height = this.props.containerHeight;
    } else {
      this.fixedContainerHeight = false;
    }
  }

  UNSAFE_componentWillUpdate() {
    this.sortManager.init();
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child, childIndex) => {
      if (child.props.className
        && this.props.itemClassName
        && !~child.props.className.indexOf(this.props.itemClassName)) {
        return;
      }

      const childWidth = parseInt(child.props.style.width, 10) + this.props.itemMargin;
      const childHeight = parseInt(child.props.style.height, 10) + this.props.itemMargin;

      const calculatedPosition = this.sortManager.getPosition(childWidth, childHeight);

      if (!this.fixedContainerHeight && this.props.containerWidth) {
        if (calculatedPosition[1] + childHeight > this.containerStyle.height) {
          this.containerStyle.height = calculatedPosition[1] + childHeight;
        }
      }

      const options = Object.assign({}, this.props, {
        position: calculatedPosition,
        size: {
          width: childWidth,
          height: childHeight,
        },
        containerHeight: this.containerStyle.height,
        itemMargin: this.props.itemMargin,
      });

      const calculatedStyle = this.animationManager.generate(options);

      this.mixItemInlineStyle(calculatedStyle);

      this.props.onItemDidLayout.call(this, child);

      if (childIndex + 1 === this.props.children.length) {
        this.props.onContainerDidLayout.call(this);
      }

      return React.cloneElement(child, {
        style: Object.assign({}, child.props.style, calculatedStyle),
      });
    });
  }

  mixItemInlineStyle(s) {
    const { itemMargin } = this.props;
    let style = {
      display: 'block',
      float: 'left',
      margin: `0 ${itemMargin}px ${itemMargin}px 0`,
    };

    if (this.props.containerWidth) {
      style = {
        position: 'absolute',
      };
    }
    Object.assign(s, style);
  }

  getContainerStyle() {
    return this.containerStyle;
  }

  render() {
    this.setPrivateProps();

    return (
      <div className={`${this.props.prefixClassName}-container`} style={this.getContainerStyle()}>
        {this.renderChildren()}
      </div>
    );
  }
}

AutoResponsive.defaultProps = {
  containerWidth: null,
  containerHeight: null,
  gridWidth: 10,
  prefixClassName: 'rc-autoresponsive',
  itemClassName: 'item',
  itemMargin: 0,
  horizontalDirection: 'left',
  transitionDuration: 1,
  transitionTimingFunction: 'linear',
  verticalDirection: 'top',
  closeAnimation: false,
  onItemDidLayout: () => {},
  onContainerDidLayout: () => {},
};

module.exports = AutoResponsive;
