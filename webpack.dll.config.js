const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  entry: {
    runtime: [
      'react',
      'react-dom',
      'highlight',
      'marked',
      'autoresponsive-core',
      'forkmeon.github.io'
    ]
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'dll'),
    library: '_dll_[name]'
  },
  plugins: [
    new DllPlugin({
      context: __dirname,
      name: '_dll_[name]',
      path: path.join(__dirname, 'dll', 'manifest.json')
    })
  ]
};
