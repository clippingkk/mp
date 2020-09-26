// const TerserPlugin = require('terser-webpack-plugin');

//         optimization: {
//           minimizer: [
//             new TerserPlugin({
//               cache: true,
//               parallel: true,
//               sourceMap: true,
//               terserOptions: {
//               }
//             }),
//           ],
//         }
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  plugins: [
    '@tarojs/plugin-stylus',
    '@tarojs/plugin-terser'
  ],
  mini: {

  },
  h5: {}
}
