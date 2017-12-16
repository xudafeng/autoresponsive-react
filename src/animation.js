const ExecutionEnvironment = require('exenv');

function transitionEnd() {
  let transitionEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  };
  if (!ExecutionEnvironment.canUseDOM) {
    return transitionEndEventNames;
  }
  let el = document.createElement('pin');

  for (let name in transitionEndEventNames) {
    if (el.style[name] !== undefined) {
      return transitionEndEventNames[name];
    }
  }
  return false;
}

let ifHasTransitionEnd = transitionEnd();

const prefixes = ['Webkit', 'Moz', 'ms', 'O', ''];

class AnimationManager {
  constructor() {
    this.animationHandle = `css${ifHasTransitionEnd ? 3 : 2}Animation`;
  }

  generate(options) {
    Object.assign(this, options);
    return this[this.animationHandle]();
  }

  css2Animation() {
    var style = {};
    style[this.horizontalDirection] = `${this.position[0]}px`;
    style[this.verticalDirection] = `${this.position[1]}px`;

    this.mixAnimation(style);
    return style;
  }

  css3Animation() {
    var style = {};

    prefixes.map(prefix => {
      let x, y;

      if (this.horizontalDirection === 'right') {
        x = this.containerWidth - this.size.width - this.position[0];
      } else {
        x = this.position[0];
      }

      if (this.verticalDirection === 'bottom') {
        y = this.containerHeight - this.size.height - this.position[1];
      } else {
        y = this.position[1];
      }

      style[`${prefix}Transform`] = `translate3d(${x}px, ${y}px, 0)`;
    });

    this.mixAnimation(style);
    return style;
  }

  mixAnimation(style) {
    if (!this.closeAnimation) {
      prefixes.map(prefix => {
        style[`${prefix}TransitionDuration`] = `${this.transitionDuration}s`;
        style[`${prefix}TransitionTimingFunction`] = this.transitionTimingFunction;
      });
    }
  }
}

module.exports = AnimationManager;
