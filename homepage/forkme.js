const React = require('react');

function ForkmeRibbon(props) {
  const {
    linkUrl,
    text = 'Fork me on Github',
    fixed = true,
    classPrefix = 'forkme',
  } = props;

  const style = {
    position: fixed ? 'fixed' : 'absolute',
    top: 0,
    right: 0,
    padding: '8px 14px',
    background: '#24292e',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderBottomLeftRadius: 4,
    zIndex: 1000,
  };

  return (
    <a
      className={`${classPrefix}-ribbon`}
      style={style}
      href={linkUrl}
      target="_blank"
      rel="noreferrer"
    >
      {text}
    </a>
  );
}

module.exports = ForkmeRibbon;
